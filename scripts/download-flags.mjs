/**
 * Bulk-download Paris 2024 Olympic football team flag images
 * from the official Olympics asset CDN into public/flags/.
 *
 * Usage:  node scripts/download-flags.mjs
 * Requires Node 18+ (native fetch).
 */

import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public', 'flags')
const BASE_URL = 'https://stacy.olympics.com/OG2024/assets/images/flags/OG2024'

/** All NOC codes that appear in the Paris 2024 Olympic football tournament */
const NOC_CODES = [
  // Men's tournament (16 teams)
  'ARG',
  'FRA',
  'USA',
  'NZL',
  'MAR',
  'IRQ',
  'UKR',
  'ISR',
  'JPN',
  'PAR',
  'ESP',
  'DOM',
  'EGY',
  'MLI',
  'GUI',
  'UZB',
  // Women's tournament — additional codes not in men's (8 teams)
  'GER',
  'AUS',
  'ZAM',
  'BRA',
  'NGR',
  'CAN',
  'COL',
  'GBR',
]

async function downloadFlag(noc) {
  const url = `${BASE_URL}/${noc}.webp`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.warn(`  SKIP  ${noc}  (HTTP ${response.status})`)
      return false
    }
    const buffer = await response.arrayBuffer()
    await writeFile(join(OUT_DIR, `${noc}.webp`), Buffer.from(buffer))
    console.log(`  OK    ${noc}`)
    return true
  } catch (err) {
    console.warn(`  ERR   ${noc}  (${err.message})`)
    return false
  }
}

await mkdir(OUT_DIR, { recursive: true })
console.log(`Downloading ${NOC_CODES.length} flags → public/flags/\n`)

const results = await Promise.all(NOC_CODES.map(downloadFlag))
const ok = results.filter(Boolean).length

console.log(`\nDone: ${ok} / ${NOC_CODES.length} downloaded`)
if (ok < NOC_CODES.length) process.exit(1)
