/**
 * Convert an IOC/NOC country code to its flag emoji via regional indicator symbols.
 * Uses a mapping for codes that differ from ISO 3166-1 alpha-2.
 */

const nocToIso: Record<string, string> = {
  GER: 'DE',
  GIN: 'GN',
  GUI: 'GN',
  GBR: 'GB',
  NGA: 'NG',
  NGR: 'NG',
  PAR: 'PY',
  RSA: 'ZA',
  SUI: 'CH',
  NED: 'NL',
  CRO: 'HR',
  POR: 'PT',
  KOR: 'KR',
  CHN: 'CN',
  TPE: 'TW',
  GRE: 'GR',
  IRI: 'IR',
  DEN: 'DK',
  URU: 'UY',
  PHI: 'PH',
  BUL: 'BG',
  TUR: 'TR',
  SLO: 'SI',
  LAT: 'LV',
  MAS: 'MY',
  AHO: 'AN',
}

export function nocToFlag(noc: string): string {
  const iso = nocToIso[noc] ?? noc.slice(0, 2)
  const codePoints = [...iso.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  return String.fromCodePoint(...codePoints)
}

/**
 * Return the local path to a downloaded flag webp image.
 * Run `node scripts/download-flags.mjs` to populate public/flags/.
 */
export function flagImageUrl(noc: string): string {
  return `/flags/${noc}.webp`
}
