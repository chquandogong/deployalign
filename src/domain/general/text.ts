import {
  AREA_COUNTERS,
  AREA_NOUNS,
  AUTONOMY_CUES,
  GENERIC_WORDS,
  KO_PARTICLES,
  KO_PREDICATE_ENDINGS,
  KO_STOPWORDS,
  LABEL_HEADS,
  LABEL_SUFFIXES,
  NUMBER_WORDS,
  STOPWORDS,
  UNITS,
  UNIVERSAL_QUANTIFIERS,
} from './lexicon'

const HANGUL = '\\uAC00-\\uD7A3\\u3131-\\u318E'
const CJK = '\\u4E00-\\u9FFF\\u3040-\\u30FF'
const LETTER = `A-Za-z0-9${HANGUL}${CJK}`
const WORD_PATTERN = new RegExp(`[${LETTER}][${LETTER}%'’./-]*[${LETTER}%]|[${LETTER}]|~|≥|≤|>=|<=`, 'g')

export const isHangul = (text: string) => /[가-힣]/.test(text)

export interface WordToken {
  /** Lower-cased word without surrounding punctuation. */
  word: string
  /** Exact source slice, with original case and any attached punctuation stripped. */
  raw: string
  start: number
  end: number
}

/** Splits text into word tokens with exact source offsets (Latin, Hangul, CJK). */
export const wordTokens = (text: string): WordToken[] => {
  const tokens: WordToken[] = []
  for (const match of text.matchAll(WORD_PATTERN)) {
    const raw = match[0]
    tokens.push({ word: raw.toLowerCase(), raw, start: match.index, end: match.index + raw.length })
  }
  return tokens
}

/** Removes one trailing Korean particle when at least two syllables remain. */
export const stripParticle = (word: string): string => {
  if (!isHangul(word)) return word
  for (const particle of KO_PARTICLES) {
    if (word.endsWith(particle) && word.length - particle.length >= 2) return word.slice(0, -particle.length)
  }
  return word
}

/** True for Korean predicate forms that close a phrase ("커버합니다", "권고함"). */
export const endsPredicate = (word: string) =>
  isHangul(word) && KO_PREDICATE_ENDINGS.some((ending) => word.endsWith(ending) && word.length > ending.length)

/** Removes one trailing Korean predicate ending ("mm입니다" → "mm"); endings are tried longest first. */
export const stripEnding = (word: string): string => {
  if (!/[가-힣]$/.test(word)) return word
  for (const ending of KO_PREDICATE_ENDINGS) {
    if (word.endsWith(ending) && word.length > ending.length) return word.slice(0, -ending.length)
  }
  return word
}

/** Very small stemmer: English suffixes, Korean particles. */
export const stem = (word: string): string => {
  if (isHangul(word)) return stripParticle(word.replace(/[^가-힣A-Za-z0-9]/g, ''))
  const cleaned = word.toLowerCase().replace(/[^a-z0-9]/g, '')
  if (cleaned.length > 5 && cleaned.endsWith('ies')) return `${cleaned.slice(0, -3)}y`
  for (const suffix of ['ing', 'ed', 'ly']) {
    if (cleaned.length - suffix.length >= 4 && cleaned.endsWith(suffix)) {
      return cleaned.slice(0, -suffix.length)
    }
  }
  if (cleaned.length >= 5 && cleaned.endsWith('s') && !cleaned.endsWith('ss')) {
    return cleaned.slice(0, -1)
  }
  return cleaned
}

/** Content keywords (stemmed) used to relate statements to each other. */
export const keywordsOf = (text: string): Set<string> => {
  const result = new Set<string>()
  for (const token of wordTokens(text)) {
    for (const part of token.word.split(/[-/]/)) {
      if (isHangul(part)) {
        const core = stripParticle(part.replace(/[^가-힣A-Za-z0-9]/g, ''))
        if (core.length < 2 || KO_STOPWORDS.has(core) || endsPredicate(core)) continue
        result.add(core)
        continue
      }
      const cleaned = part.replace(/[^a-z0-9]/g, '')
      if (cleaned.length < 3 || /^\d+$/.test(cleaned)) continue
      if (STOPWORDS.has(cleaned) || GENERIC_WORDS.has(cleaned)) continue
      const stemmed = stem(cleaned)
      if (stemmed.length >= 3 && !GENERIC_WORDS.has(stemmed)) result.add(stemmed)
    }
  }
  return result
}

export const sharedKeywords = (a: Set<string>, b: Set<string>): string[] =>
  [...a].filter((keyword) => b.has(keyword))

/**
 * Word-level membership: exact for Latin words; for Hangul, a listed cue may be
 * followed only by a particle or plural marker ("구역에서" → 구역, but not 존재 → 존).
 */
export const wordMatches = (word: string, list: readonly string[]): boolean => {
  const bare = word.replace(/[.,;:!?]$/, '')
  if (list.includes(bare)) return true
  if (!isHangul(bare)) return false
  return list.some((cue) => {
    if (!isHangul(cue) || !bare.startsWith(cue)) return false
    const remainder = bare.slice(cue.length).replace(/^들/, '')
    return remainder === '' || KO_PARTICLES.includes(remainder)
  })
}

export const isAreaWord = (word: string) =>
  wordMatches(word, AREA_NOUNS) ||
  (isHangul(word) && AREA_COUNTERS.includes(stripParticle(word.replace(/[^가-힣]/g, ''))))

const cueMatchers = new Map<string, RegExp>()

const matchCue = (text: string, cue: string): RegExpExecArray | null => {
  let matcher = cueMatchers.get(cue)
  if (!matcher) {
    const trailingSpace = cue.endsWith(' ')
    const core = cue.trim()
    const escaped = core.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
    if (isHangul(core)) {
      // Anchor at a word start; particles attach to the right so no right boundary.
      matcher = new RegExp(`(?<![\\uAC00-\\uD7A3])${escaped}${trailingSpace ? '(?=\\s|\\d)' : ''}`, 'i')
    } else {
      const alphabetic = /^[a-z0-9]/i.test(core) && /[a-z0-9]$/i.test(core)
      matcher = new RegExp(alphabetic ? `\\b${escaped}\\b` : escaped, 'i')
    }
    cueMatchers.set(cue, matcher)
  }
  matcher.lastIndex = 0
  return matcher.exec(text)
}

/** True when any cue occurs in the text. */
export const hasCue = (text: string, cues: readonly string[]): boolean =>
  cues.some((cue) => matchCue(text, cue) !== null)

/** Returns the earliest occurrence of any cue, with its exact source slice. */
export const matchAnyCue = (
  text: string,
  cues: readonly string[],
): { cue: string; start: number; end: number } | undefined => {
  let best: { cue: string; start: number; end: number } | undefined
  for (const cue of cues) {
    const match = matchCue(text, cue)
    if (match && (!best || match.index < best.start)) {
      best = { cue, start: match.index, end: match.index + match[0].length }
    }
  }
  return best
}

export interface Quantity {
  value: number
  /** Exact source slice of the number token (digits or number word). */
  raw: string
  unit?: string
  noun?: string
  /** Names a stage ("Phase 1", "1단계") rather than counting things. */
  label: boolean
  percent: boolean
  start: number
  end: number
}

const numericValue = (word: string): number | undefined => {
  const cleaned = word.replace(/[%,]/g, '')
  if (/^\d+(\.\d+)?$/.test(cleaned)) return Number(cleaned)
  return NUMBER_WORDS[word]
}

const cleanNoun = (word: string | undefined) => {
  if (!word) return undefined
  const cleaned = word.replace(/[^a-z0-9가-힣-]/g, '')
  const core = isHangul(cleaned) ? stripParticle(cleaned) : cleaned
  if (!/^[a-z가-힣]/.test(core)) return undefined
  if (STOPWORDS.has(core) || KO_STOPWORDS.has(core)) return undefined
  return core
}

/** Finds counts, measurements and percentages with their neighbouring words. */
export const quantitiesIn = (text: string): Quantity[] => {
  const tokens = wordTokens(text)
  const found: Quantity[] = []
  tokens.forEach((token, index) => {
    const base = { raw: token.raw, start: token.start, end: token.end }
    // Digits with an attached unit and/or Korean counter/label ("12곳의", "1단계", "800mm입니다", "95%").
    const attached = /^(\d+(?:[.,]\d+)?)([a-z%°/]+)?([가-힣]+)?$/.exec(token.word)
    if (attached && (attached[2] || attached[3])) {
      const value = Number(attached[1]!.replace(',', ''))
      const latin = attached[2]
      // A one-syllable counter may carry a particle ("곳의" → 곳); stripParticle keeps two syllables, so strip here.
      const rawSuffix = attached[3] ? stripEnding(attached[3]) : ''
      const suffix = rawSuffix ? (KO_PARTICLES.find((particle) => rawSuffix.endsWith(particle) && rawSuffix.length > particle.length) ? rawSuffix.slice(0, -(KO_PARTICLES.find((particle) => rawSuffix.endsWith(particle) && rawSuffix.length > particle.length)!.length)) : rawSuffix) : ''
      const percent = latin === '%' || suffix === '퍼센트'
      const unit = latin && latin !== '%' && UNITS.includes(latin) ? latin : !latin && suffix && UNITS.includes(suffix) ? suffix : undefined
      const label = !latin && LABEL_SUFFIXES.includes(suffix)
      found.push({
        ...base,
        value,
        unit,
        noun: unit || percent || label || !suffix || latin ? undefined : suffix,
        label,
        percent,
      })
      return
    }
    const parts = token.word.split('-')
    const head = parts[0] ?? token.word
    const value = numericValue(head)
    if (value === undefined) return
    const previous = tokens[index - 1]?.word
    const nextRaw = parts.length > 1 ? parts.slice(1).join('-') : tokens[index + 1]?.word
    const nextCore = nextRaw && isHangul(nextRaw) ? stripParticle(stripEnding(nextRaw)) : nextRaw?.replace(/[.,]$/, '')
    const percent = token.word.endsWith('%') || nextCore === '%' || nextCore === 'percent' || nextCore === '퍼센트'
    const unit = nextCore && UNITS.includes(nextCore) ? nextCore : undefined
    const compoundAdjective = parts.length > 1 && /(ed|ing)$/.test(parts[parts.length - 1] ?? '')
    const label =
      Boolean(previous && LABEL_HEADS.includes(previous)) ||
      Boolean(nextCore && LABEL_SUFFIXES.includes(nextCore)) ||
      /^\d{4}$/.test(head) ||
      compoundAdjective
    const noun = unit || percent || label ? undefined : cleanNoun(nextRaw)
    found.push({ ...base, value, unit, noun, label, percent })
  })
  return found
}

/** A count of things ("five analytes", "12곳") — not a label, unit or percentage. */
export const isEnumeration = (quantity: Quantity) =>
  !quantity.label && !quantity.unit && !quantity.percent && quantity.noun !== undefined

/** A measured threshold ("800 mm", "95%"). */
export const isThreshold = (quantity: Quantity) =>
  !quantity.label && (quantity.unit !== undefined || quantity.percent)

export type ScopeCategory = 'scope' | 'coverage' | 'autonomy'

export interface QuantifiedPhrase {
  quantifier: string
  /** Exact source slice starting at the quantifier (trailing Korean particle removed). */
  phrase: string
  category: ScopeCategory
  start: number
  end: number
}

const PHRASE_BOUNDARY = new Set([
  'and', 'or', 'but', 'that', 'which', 'who', 'using', 'via', 'with', 'by', 'for', 'to', 'of', 'in', 'on', 'at',
  'through', 'as', 'so', 'while', 'when', 'if', 'is', 'are', 'will', 'be',
  // Korean connectives
  '그리고', '및', '또는', '하고', '또', '즉',
])

const isBoundary = (word: string) => PHRASE_BOUNDARY.has(word) || endsPredicate(word)

const categoryOf = (words: string[]): ScopeCategory => {
  if (words.some((word) => wordMatches(word, AUTONOMY_CUES) || wordMatches(stem(word), AUTONOMY_CUES))) return 'autonomy'
  if (words.some((word) => isAreaWord(word) || isAreaWord(stem(word)))) return 'coverage'
  return 'scope'
}

/** Trims a trailing Korean particle off a source slice; the result is still a substring. */
const trimSlice = (text: string, start: number, end: number) => {
  const slice = text.slice(start, end)
  if (!isHangul(slice)) return { phrase: slice, end }
  const lastWord = slice.split(/\s+/).pop() ?? ''
  const core = stripParticle(lastWord)
  const trimmed = lastWord.length - core.length
  return { phrase: slice.slice(0, slice.length - trimmed), end: end - trimmed }
}

/**
 * Universal-quantifier phrases ("entire facility", "모든 구역") and bare autonomy
 * claims ("autonomously", "자율적으로") that leave a commitment unbounded. A
 * quantifier followed by a number ("all five analytes") is bounded and skipped.
 */
export const unboundedPhrases = (text: string): QuantifiedPhrase[] => {
  const tokens = wordTokens(text)
  const phrases: QuantifiedPhrase[] = []
  const covered = new Set<number>()
  tokens.forEach((token, index) => {
    if (covered.has(index)) return
    const quantifier = token.word.replace(/[.,;:]$/, '')
    const isQuantifier = wordMatches(quantifier, UNIVERSAL_QUANTIFIERS as readonly string[])
    const isAutonomy = wordMatches(quantifier, AUTONOMY_CUES)
    if (!isQuantifier && !isAutonomy) return
    const next = tokens[index + 1]
    if (isQuantifier && next && numericValue(next.word.split('-')[0] ?? '') !== undefined) return
    if (isQuantifier && next && /^\d/.test(next.word)) return
    const words = [quantifier]
    let start = token.start
    let end = token.end
    // Korean: a quantifier carrying a particle ("시설 전체를") follows its noun, so the
    // phrase is the previous word plus the quantifier and nothing is read forward.
    const trailing = isQuantifier && isHangul(quantifier) && stripParticle(quantifier) !== quantifier
    const previous = tokens[index - 1]
    if (trailing && previous && !isBoundary(previous.word) && !/[,.;:]/.test(text.slice(previous.end, token.start))) {
      words.unshift(previous.word)
      start = previous.start
    }
    const reach = isQuantifier && !trailing ? (isHangul(quantifier) ? 2 : 3) : 0
    for (let cursor = index + 1; cursor <= Math.min(tokens.length - 1, index + reach); cursor += 1) {
      const nextToken = tokens[cursor]!
      const between = text.slice(tokens[cursor - 1]!.end, nextToken.start)
      if (/[,.;:]/.test(between)) break
      const nextWord = nextToken.word.replace(/[.,;:]$/, '')
      if (isBoundary(nextWord)) break
      if (words.length > 1 && (wordMatches(nextWord, UNIVERSAL_QUANTIFIERS as readonly string[]) || wordMatches(nextWord, AUTONOMY_CUES))) break
      words.push(nextWord)
      end = nextToken.end
      covered.add(cursor)
    }
    if (isQuantifier && words.length === 1 && !isAutonomy && quantifier !== 'fully' && quantifier !== 'completely' && !isHangul(quantifier)) {
      // A lone English quantifier ("at all", "in full") is not a scope statement.
      return
    }
    // An autonomy adverb ("자율적으로", "autonomously") is kept whole; only noun phrases lose a trailing particle.
    const { phrase, end: trimmedEnd } = isQuantifier ? trimSlice(text, start, end) : { phrase: text.slice(start, end), end }
    phrases.push({ quantifier, phrase, category: categoryOf(words), start, end: trimmedEnd })
  })
  return phrases
}

/** Exact source slice of an enumeration: number plus its describing words. */
export const enumerationPhrase = (text: string, quantity: Quantity): string => {
  const tokens = wordTokens(text)
  const startIndex = tokens.findIndex((token) => token.start === quantity.start)
  if (startIndex < 0) return quantity.raw
  const reach = isHangul(quantity.raw) || isHangul(tokens[startIndex + 1]?.word ?? '') ? 4 : 3
  let end = quantity.end
  for (let cursor = startIndex + 1; cursor <= Math.min(tokens.length - 1, startIndex + reach); cursor += 1) {
    const token = tokens[cursor]!
    const between = text.slice(tokens[cursor - 1]!.end, token.start)
    if (/[,.;:]/.test(between) || isBoundary(token.word) || STOPWORDS.has(token.word) || KO_STOPWORDS.has(token.word)) break
    end = token.end
  }
  return trimSlice(text, quantity.start, end).phrase
}

/** Turns "Twelve critical AOIs" into "12 critical AOIs" (kept for callers that want digits). */
export const normalizeCount = (phrase: string): string =>
  phrase.replace(/^([A-Za-z가-힣]+)\b/, (word) => {
    const value = NUMBER_WORDS[word.toLowerCase()]
    return value === undefined ? word : String(value)
  })

export const truncate = (text: string, max = 160) =>
  text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`
