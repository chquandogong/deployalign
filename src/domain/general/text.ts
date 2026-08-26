import {
  AREA_NOUNS,
  AUTONOMY_CUES,
  GENERIC_WORDS,
  LABEL_HEADS,
  NUMBER_WORDS,
  STOPWORDS,
  UNITS,
  UNIVERSAL_QUANTIFIERS,
} from './lexicon'

export interface WordToken {
  /** Lower-cased word without surrounding punctuation. */
  word: string
  /** Exact source slice, with original case and any attached punctuation stripped. */
  raw: string
  start: number
  end: number
}

const WORD_PATTERN = /[A-Za-z0-9][A-Za-z0-9%'’./-]*[A-Za-z0-9%]|[A-Za-z0-9]|~|≥|≤|>=|<=/g

/** Splits text into word tokens with exact source offsets. */
export const wordTokens = (text: string): WordToken[] => {
  const tokens: WordToken[] = []
  for (const match of text.matchAll(WORD_PATTERN)) {
    const raw = match[0]
    tokens.push({ word: raw.toLowerCase(), raw, start: match.index, end: match.index + raw.length })
  }
  return tokens
}

/** Very small suffix stemmer — enough for noun/verb agreement across statements. */
export const stem = (word: string): string => {
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

const cueMatchers = new Map<string, RegExp>()

/** True when any cue occurs in the text (word-bounded for alphabetic cues). */
export const hasCue = (text: string, cues: readonly string[]): boolean =>
  cues.some((cue) => matchCue(text, cue) !== null)

/** Returns the first occurrence of any cue, with its exact source slice. */
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

const matchCue = (text: string, cue: string): RegExpExecArray | null => {
  let matcher = cueMatchers.get(cue)
  if (!matcher) {
    const escaped = cue.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+')
    const alphabetic = /^[a-z0-9]/i.test(cue) && /[a-z0-9]$/i.test(cue.trim())
    matcher = new RegExp(alphabetic ? `\\b${escaped}\\b` : escaped, 'i')
    cueMatchers.set(cue, matcher)
  }
  matcher.lastIndex = 0
  return matcher.exec(text)
}

export interface Quantity {
  value: number
  /** Exact source slice of the number (digits or number word). */
  raw: string
  unit?: string
  noun?: string
  /** Names a stage ("Phase 1") rather than counting things. */
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

/** Finds counts, measurements and percentages with their neighbouring words. */
export const quantitiesIn = (text: string): Quantity[] => {
  const tokens = wordTokens(text)
  const found: Quantity[] = []
  tokens.forEach((token, index) => {
    const parts = token.word.split('-')
    const head = parts[0] ?? token.word
    const value = numericValue(head)
    if (value === undefined) return
    const previous = tokens[index - 1]?.word
    const next = parts.length > 1 ? parts.slice(1).join('-') : tokens[index + 1]?.word
    const percent = token.word.endsWith('%') || next === '%' || next === 'percent'
    const unit = next && UNITS.includes(next.replace(/[.,]$/, '')) ? next.replace(/[.,]$/, '') : undefined
    const compoundAdjective = parts.length > 1 && /(ed|ing)$/.test(parts[parts.length - 1] ?? '')
    const label =
      Boolean(previous && LABEL_HEADS.includes(previous)) || /^\d{4}$/.test(head) || compoundAdjective
    const nounCandidate = unit || percent ? undefined : next?.replace(/[^a-z0-9-]/g, '')
    const noun = nounCandidate && /^[a-z]/.test(nounCandidate) && !STOPWORDS.has(nounCandidate) ? nounCandidate : undefined
    found.push({
      value,
      raw: token.raw,
      unit,
      noun,
      label,
      percent,
      start: token.start,
      end: token.end,
    })
  })
  return found
}

/** A count of things ("five analytes", "12 AOIs") — not a label, unit or percentage. */
export const isEnumeration = (quantity: Quantity) =>
  !quantity.label && !quantity.unit && !quantity.percent && quantity.noun !== undefined

/** A measured threshold ("800 mm", "95%"). */
export const isThreshold = (quantity: Quantity) =>
  !quantity.label && (quantity.unit !== undefined || quantity.percent)

export type ScopeCategory = 'scope' | 'coverage' | 'autonomy'

export interface QuantifiedPhrase {
  quantifier: string
  /** Exact source slice starting at the quantifier. */
  phrase: string
  category: ScopeCategory
  start: number
  end: number
}

const PHRASE_BOUNDARY = new Set([
  'and',
  'or',
  'but',
  'that',
  'which',
  'who',
  'using',
  'via',
  'with',
  'by',
  'for',
  'to',
  'of',
  'in',
  'on',
  'at',
  'through',
  'as',
  'so',
  'while',
  'when',
  'if',
  'is',
  'are',
  'will',
  'be',
])

const categoryOf = (words: string[]): ScopeCategory => {
  if (words.some((word) => AUTONOMY_CUES.includes(word) || AUTONOMY_CUES.includes(stem(word)))) return 'autonomy'
  if (words.some((word) => AREA_NOUNS.includes(word) || AREA_NOUNS.includes(stem(word)))) return 'coverage'
  return 'scope'
}

/**
 * Universal-quantifier phrases ("entire facility", "any leaked material") and bare
 * autonomy claims ("autonomously") that leave a commitment unbounded.
 */
export const unboundedPhrases = (text: string): QuantifiedPhrase[] => {
  const tokens = wordTokens(text)
  const phrases: QuantifiedPhrase[] = []
  const covered = new Set<number>()
  tokens.forEach((token, index) => {
    if (covered.has(index)) return
    const quantifier = token.word.replace(/[.,;:]$/, '')
    const isQuantifier = (UNIVERSAL_QUANTIFIERS as readonly string[]).includes(quantifier)
    const isAutonomy = AUTONOMY_CUES.includes(quantifier)
    if (!isQuantifier && !isAutonomy) return
    const words = [quantifier]
    let end = token.end
    // A bare autonomy claim ("autonomously") is a phrase on its own; only a
    // quantifier extends over the noun phrase it quantifies.
    const limit = isQuantifier ? Math.min(tokens.length, index + 4) : index + 1
    for (let cursor = index + 1; cursor < limit; cursor += 1) {
      const nextToken = tokens[cursor]!
      const between = text.slice(tokens[cursor - 1]!.end, nextToken.start)
      if (/[,.;:]/.test(between)) break
      const nextWord = nextToken.word.replace(/[.,;:]$/, '')
      if (PHRASE_BOUNDARY.has(nextWord)) break
      if (words.length > 1 && ((UNIVERSAL_QUANTIFIERS as readonly string[]).includes(nextWord) || AUTONOMY_CUES.includes(nextWord))) break
      words.push(nextWord)
      end = nextToken.end
      covered.add(cursor)
    }
    if (isQuantifier && words.length === 1 && !isAutonomy) {
      // A lone quantifier ("at all", "in full") is not a scope statement.
      if (quantifier !== 'fully' && quantifier !== 'completely') return
    }
    phrases.push({
      quantifier,
      phrase: text.slice(token.start, end),
      category: categoryOf(words),
      start: token.start,
      end,
    })
  })
  return phrases
}

/** Turns "Twelve critical AOIs" into "12 critical AOIs" for patch text. */
export const normalizeCount = (phrase: string): string =>
  phrase.replace(/^([A-Za-z]+)\b/, (word) => {
    const value = NUMBER_WORDS[word.toLowerCase()]
    return value === undefined ? word : String(value)
  })

/** Exact source slice of an enumeration: number plus its describing words. */
export const enumerationPhrase = (text: string, quantity: Quantity): string => {
  const tokens = wordTokens(text)
  const startIndex = tokens.findIndex((token) => token.start === quantity.start)
  if (startIndex < 0) return quantity.raw
  let end = quantity.end
  for (let cursor = startIndex + 1; cursor < Math.min(tokens.length, startIndex + 4); cursor += 1) {
    const token = tokens[cursor]!
    const between = text.slice(tokens[cursor - 1]!.end, token.start)
    if (/[,.;:]/.test(between) || PHRASE_BOUNDARY.has(token.word) || STOPWORDS.has(token.word)) break
    end = token.end
  }
  return text.slice(quantity.start, end)
}

export const truncate = (text: string, max = 160) =>
  text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`
