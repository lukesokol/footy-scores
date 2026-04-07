import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchOlympicSchedule, loadFallbackSchedule } from '../olympics-schedule'

describe('loadFallbackSchedule', () => {
  it('returns an array of schedule units', () => {
    const units = loadFallbackSchedule()
    expect(Array.isArray(units)).toBe(true)
    expect(units.length).toBeGreaterThan(0)
  })

  it('returns units with expected properties', () => {
    const units = loadFallbackSchedule()
    const first = units[0]
    expect(first).toHaveProperty('startDate')
    expect(first).toHaveProperty('gender')
    expect(first).toHaveProperty('competitors')
    expect(first).toHaveProperty('status')
    expect(first).toHaveProperty('unitCode')
    expect(first).toHaveProperty('venueDescription')
  })

  it('contains both men and women matches', () => {
    const units = loadFallbackSchedule()
    const men = units.filter((u) => u.gender === 'M')
    const women = units.filter((u) => u.gender === 'W')
    expect(men.length).toBeGreaterThan(0)
    expect(women.length).toBeGreaterThan(0)
  })

  it('all units have disciplineCode FBL', () => {
    const units = loadFallbackSchedule()
    expect(units.every((u) => u.disciplineCode === 'FBL')).toBe(true)
  })
})

describe('fetchOlympicSchedule', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('falls back to static data when fetch fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))

    const result = await fetchOlympicSchedule()
    expect(result.status).toBe('success')
    if (result.status === 'success') {
      expect(result.data.length).toBeGreaterThan(0)
    }
  })

  it('falls back to static data when response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))

    const result = await fetchOlympicSchedule()
    expect(result.status).toBe('success')
    if (result.status === 'success') {
      expect(result.data.length).toBeGreaterThan(0)
    }
  })

  it('falls back to static data when response shape is unexpected', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ unexpected: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const result = await fetchOlympicSchedule()
    expect(result.status).toBe('success')
  })

  it('parses valid API response with units array', async () => {
    const mockData = {
      units: [
        {
          startDate: '2024-07-24T15:00:00+02:00',
          endDate: '2024-07-24T17:00:00+02:00',
          disciplineCode: 'FBL',
          disciplineName: 'Football',
          eventName: "Men's Tournament",
          gender: 'M',
          unitCode: 'TEST01',
          unitName: 'Test Match',
          phaseName: 'Group A',
          venueDescription: 'Test Venue',
          locationDescription: 'Test City',
          competitors: [],
          status: 'FINISHED',
        },
      ],
    }

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const result = await fetchOlympicSchedule()
    expect(result.status).toBe('success')
    if (result.status === 'success') {
      expect(result.data).toHaveLength(1)
      expect(result.data[0]?.unitCode).toBe('TEST01')
    }
  })
})
