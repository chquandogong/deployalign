import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { compileDemo } from '../src/domain/compiler'
import { compileGeneral } from '../src/domain/general/compile'
import type { ArtifactRole, CompileResult, SourceArtifact } from '../src/domain/types'
import { resultToMarkdown } from '../src/lib/exportMarkdown'

export interface CliIo {
  out: (text: string) => void
  err: (text: string) => void
  now?: () => string
}

type FailOn = 'blocker' | 'warning' | 'none'

interface CompileArgs {
  dir?: string
  roleFiles: Partial<Record<ArtifactRole, string>>
  artifactsJson?: string
  out?: string
  failOn: FailOn
  approved: boolean
  json: boolean
  quiet: boolean
}

const { version } = createRequire(import.meta.url)('../package.json') as { version: string }

export const USAGE = `deployalign ${version} — evidence-gated decision compiler (deterministic path, no model calls)

Usage:
  deployalign compile <dir> [options]          role from file name: customer*/sales*/engineering* (or 고객*/영업*/엔지니어링*)
  deployalign compile --customer F --sales F --engineering F [options]
  deployalign compile --artifacts artifacts.json [options]
  deployalign demo [options]                   compile the bundled synthetic fixture
  deployalign --help | --version

Options:
  --out <dir>          write result.json, report.md and the three target documents
  --fail-on <level>    blocker (default) | warning | none — exit 2 when unresolved diagnostics remain at/above the level
  --approved           render the reviewed baseline (v2); records nothing, states that a person approved on the command line
  --json               print the full CompileResult JSON to stdout instead of the summary
  --quiet              print nothing but errors (exit code carries the verdict)

Exit codes: 0 no diagnostics at/above --fail-on · 1 usage or input error · 2 verdict failed
`

const ROLE_PREFIXES: Array<[RegExp, ArtifactRole]> = [
  [/^(customer|client|cust|고객)/i, 'customer'],
  [/^(sales|proposal|sow|commercial|영업|제안)/i, 'sales'],
  [/^(engineering|eng|technical|review|엔지니어링|기술)/i, 'engineering'],
]

const roleOf = (fileName: string): ArtifactRole | undefined => {
  const base = path.basename(fileName).replace(/\.[^.]+$/, '')
  return ROLE_PREFIXES.find(([pattern]) => pattern.test(base))?.[1]
}

const readArtifact = (file: string, role: ArtifactRole, index: number): SourceArtifact => {
  if (!existsSync(file)) throw new Error(`File not found: ${file}`)
  const content = readFileSync(file, 'utf8').trim()
  if (content.length < 20) throw new Error(`${file} needs at least 20 characters of text.`)
  if (content.length > 8_000) throw new Error(`${file} exceeds 8,000 characters (${content.length}).`)
  return {
    id: `SRC-${role.toUpperCase()}-${String(index + 1).padStart(2, '0')}`,
    role,
    title: path.basename(file),
    owner: role,
    updatedAt: statSync(file).mtime.toISOString(),
    content,
  }
}

const loadArtifacts = (args: CompileArgs): SourceArtifact[] => {
  if (args.artifactsJson) {
    const parsed = JSON.parse(readFileSync(args.artifactsJson, 'utf8')) as unknown
    const list = Array.isArray(parsed) ? parsed : (parsed as { artifacts?: unknown }).artifacts
    if (!Array.isArray(list)) throw new Error('artifacts JSON must be an array or an object with an "artifacts" array.')
    return list.map((item, index) => {
      const candidate = item as Partial<SourceArtifact>
      const role = candidate.role
      if (role !== 'customer' && role !== 'sales' && role !== 'engineering') {
        throw new Error(`Artifact ${index + 1} has no valid role (customer | sales | engineering).`)
      }
      if (typeof candidate.content !== 'string' || candidate.content.trim().length < 20) {
        throw new Error(`Artifact ${index + 1} needs at least 20 characters of content.`)
      }
      return {
        id: typeof candidate.id === 'string' ? candidate.id : `SRC-${role.toUpperCase()}-${String(index + 1).padStart(2, '0')}`,
        role,
        title: typeof candidate.title === 'string' ? candidate.title : `${role} artifact`,
        owner: typeof candidate.owner === 'string' ? candidate.owner : role,
        updatedAt: typeof candidate.updatedAt === 'string' ? candidate.updatedAt : new Date(0).toISOString(),
        content: candidate.content,
      }
    })
  }
  const files: Partial<Record<ArtifactRole, string>> = { ...args.roleFiles }
  if (args.dir) {
    if (!existsSync(args.dir) || !statSync(args.dir).isDirectory()) throw new Error(`Not a directory: ${args.dir}`)
    for (const entry of readdirSync(args.dir).sort()) {
      const full = path.join(args.dir, entry)
      if (!statSync(full).isFile()) continue
      const role = roleOf(entry)
      if (role && !files[role]) files[role] = full
    }
  }
  const roles: ArtifactRole[] = ['customer', 'sales', 'engineering']
  const missing = roles.filter((role) => !files[role])
  if (missing.length > 0) {
    throw new Error(`Missing ${missing.join(', ')} document(s). Name files customer*/sales*/engineering* or pass --customer/--sales/--engineering.`)
  }
  return roles.map((role, index) => readArtifact(files[role]!, role, index))
}

const parse = (argv: string[]): { command: 'compile' | 'demo' | 'help' | 'version'; args: CompileArgs } => {
  const args: CompileArgs = { roleFiles: {}, failOn: 'blocker', approved: false, json: false, quiet: false }
  let command: 'compile' | 'demo' | 'help' | 'version' = 'help'
  const rest = [...argv]
  const first = rest[0]
  if (first === 'compile' || first === 'demo') {
    command = first
    rest.shift()
  } else if (first === '--version' || first === '-v') {
    return { command: 'version', args }
  } else if (!first || first === '--help' || first === '-h' || first === 'help') {
    return { command: 'help', args }
  } else {
    throw new Error(`Unknown command: ${first}`)
  }
  const takeValue = (flag: string) => {
    const value = rest.shift()
    if (!value || value.startsWith('--')) throw new Error(`${flag} needs a value.`)
    return value
  }
  while (rest.length > 0) {
    const token = rest.shift()!
    switch (token) {
      case '--customer':
      case '--sales':
      case '--engineering':
        args.roleFiles[token.slice(2) as ArtifactRole] = takeValue(token)
        break
      case '--artifacts':
        args.artifactsJson = takeValue(token)
        break
      case '--out':
        args.out = takeValue(token)
        break
      case '--fail-on': {
        const level = takeValue(token)
        if (level !== 'blocker' && level !== 'warning' && level !== 'none') throw new Error('--fail-on must be blocker, warning or none.')
        args.failOn = level
        break
      }
      case '--approved':
        args.approved = true
        break
      case '--json':
        args.json = true
        break
      case '--quiet':
        args.quiet = true
        break
      default:
        if (token.startsWith('--')) throw new Error(`Unknown option: ${token}`)
        if (args.dir) throw new Error(`Unexpected argument: ${token}`)
        args.dir = token
    }
  }
  if (command === 'compile' && !args.dir && !args.artifactsJson && Object.keys(args.roleFiles).length === 0) {
    throw new Error('compile needs a directory, --artifacts, or --customer/--sales/--engineering files.')
  }
  return { command, args }
}

const TARGET_FILES: Record<CompileResult['targets'][number]['kind'], string> = {
  'customer-decision-memo': 'customer-decision-memo.md',
  'sales-sow': 'sales-sow.md',
  'engineering-test-manifest': 'engineering-test-manifest.md',
}

const writeOutputs = (result: CompileResult, dir: string) => {
  mkdirSync(dir, { recursive: true })
  writeFileSync(path.join(dir, 'result.json'), `${JSON.stringify(result, null, 2)}\n`)
  writeFileSync(path.join(dir, 'report.md'), resultToMarkdown(result))
  for (const target of result.targets) {
    const lines = [
      `# ${target.title}`,
      '',
      `_Audience: ${target.audience} · ${target.status} · Decision ${result.decisionId} · Baseline v${result.version}_`,
      '',
    ]
    for (const section of target.sections) {
      lines.push(`## ${section.id} · ${section.heading}${section.changed ? ' (recompiled)' : ''}`, '', section.body, '', `<sub>fingerprint ${section.hash}</sub>`, '')
    }
    writeFileSync(path.join(dir, TARGET_FILES[target.kind]), `${lines.join('\n')}\n`)
  }
}

const verdict = (result: CompileResult, failOn: FailOn) => {
  const open = result.diagnostics.filter((d) => !d.resolved)
  const blockers = open.filter((d) => d.severity === 'BLOCKER').length
  const warnings = open.filter((d) => d.severity === 'WARNING').length
  const failed = failOn === 'blocker' ? blockers > 0 : failOn === 'warning' ? blockers + warnings > 0 : false
  return { blockers, warnings, failed }
}

const summary = (result: CompileResult, failOn: FailOn, outDir?: string) => {
  const { blockers, warnings, failed } = verdict(result, failOn)
  const lines = [
    `${result.projectName} · baseline v${result.version} · gate ${result.gate} · ${result.mode} mode · ${result.nodes.length} typed nodes`,
    `${blockers} open blocker(s), ${warnings} open warning(s)`,
  ]
  for (const d of result.diagnostics) {
    lines.push(`  ${d.resolved ? '✓' : d.severity === 'BLOCKER' ? '✗' : '!'} ${d.code} ${d.title} — ${d.message}`)
  }
  if (result.patch.changes.length > 0) {
    lines.push(`patch ${result.patch.id} (${result.patch.status}):`)
    for (const c of result.patch.changes) lines.push(`  ${c.field}: ${c.before} → ${c.after}`)
  } else {
    lines.push(`patch: none — ${result.patch.rationale}`)
  }
  if (outDir) lines.push(`written: ${path.join(outDir, 'result.json')}, report.md, ${Object.values(TARGET_FILES).join(', ')}`)
  lines.push(failed ? `verdict: FAIL (--fail-on ${failOn})` : `verdict: PASS (--fail-on ${failOn})`)
  return lines.join('\n')
}

/** Entry point; returns the process exit code. */
export const main = async (argv: string[], io: CliIo = { out: (t) => process.stdout.write(t), err: (t) => process.stderr.write(t) }): Promise<number> => {
  let parsed: ReturnType<typeof parse>
  try {
    parsed = parse(argv)
  } catch (error) {
    io.err(`${error instanceof Error ? error.message : String(error)}\n\n${USAGE}`)
    return 1
  }
  if (parsed.command === 'help') {
    io.out(USAGE)
    return 0
  }
  if (parsed.command === 'version') {
    io.out(`${version}\n`)
    return 0
  }
  const { args } = parsed
  let result: CompileResult
  try {
    const now = io.now?.()
    if (parsed.command === 'demo') {
      result = compileDemo({ approved: args.approved, executionOrigin: 'cli', now })
    } else {
      const artifacts = loadArtifacts(args)
      result = compileGeneral({ artifacts, approved: args.approved, executionOrigin: 'cli', now })
    }
  } catch (error) {
    io.err(`${error instanceof Error ? error.message : String(error)}\n`)
    return 1
  }
  if (args.out) {
    try {
      writeOutputs(result, args.out)
    } catch (error) {
      io.err(`Could not write outputs: ${error instanceof Error ? error.message : String(error)}\n`)
      return 1
    }
  }
  const { failed } = verdict(result, args.failOn)
  if (args.json) {
    io.out(`${JSON.stringify(result, null, 2)}\n`)
  } else if (!args.quiet) {
    io.out(`${summary(result, args.failOn, args.out)}\n`)
    if (args.approved) io.out('note: the approved baseline was rendered because --approved was passed; nothing was recorded anywhere.\n')
    io.out(`note: ${result.mode === 'custom' ? 'heuristic English/Korean detectors over your text — review every quote; no model was called.' : 'synthetic fixture; no model was called.'}\n`)
  }
  return failed ? 2 : 0
}
