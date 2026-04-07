import { test, expect } from '@playwright/test'

test.describe('FootyScores App', () => {
  test('shows the app header and initial state', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'FootyScores' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Fetch Schedule' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Use Static Data' })).toBeVisible()
  })

  test('loads static data and displays matches', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Use Static Data' }).click()

    // Should show loaded state
    await expect(page.getByText('Loaded')).toBeVisible()
    await expect(page.getByText(/58 matches/)).toBeVisible()
    await expect(page.getByText(/Showing \d+ of 58/)).toBeVisible()

    // Should show match cards
    await expect(page.getByRole('list', { name: /match list/i })).toBeVisible()
  })

  test('filters by gender', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Use Static Data' }).click()
    await expect(page.getByText(/58 matches/)).toBeVisible()

    // Gender filter fieldset
    const genderFilter = page.locator('fieldset[aria-label="Gender"]')

    // Click Men filter
    await genderFilter.getByRole('button', { name: 'Men', exact: true }).click()
    await expect(page.getByText(/Showing 32 of 58/)).toBeVisible()

    // Click Women filter
    await genderFilter.getByRole('button', { name: 'Women', exact: true }).click()
    await expect(page.getByText(/Showing 26 of 58/)).toBeVisible()

    // Click All filter
    await genderFilter.getByRole('button', { name: 'All', exact: true }).click()
    await expect(page.getByText(/Showing 58 of 58/)).toBeVisible()
  })

  test('searches for a team', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Use Static Data' }).click()
    await expect(page.getByText(/58 matches/)).toBeVisible()

    const searchBox = page.getByRole('searchbox', { name: /search matches/i })
    await searchBox.fill('France')

    // Should filter to matches involving France
    const countText = page.getByText(/Showing \d+ of 58/)
    await expect(countText).toBeVisible()
  })

  test('selects a match and shows endpoint preview', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Use Static Data' }).click()
    await expect(page.getByText(/58 matches/)).toBeVisible()

    // Click the first match card
    const firstCard = page.getByRole('listitem').first().getByRole('button')
    await firstCard.click()

    // Should show endpoint preview with JSON
    await expect(page.getByText('application/json')).toBeVisible()
    await expect(page.getByText(/"competition"/)).toBeVisible()
  })

  test('exports JSON file', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Use Static Data' }).click()
    await expect(page.getByText(/58 matches/)).toBeVisible()

    // Export button should be enabled
    const exportBtn = page.getByRole('button', { name: 'Export JSON' })
    await expect(exportBtn).toBeEnabled()

    // Download event
    const downloadPromise = page.waitForEvent('download')
    await exportBtn.click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toBe('footy-scores-endpoints.json')
  })
})
