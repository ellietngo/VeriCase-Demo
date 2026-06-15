import { test, expect } from '@playwright/test'

test('landing page loads with key content', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('button', { name: /begin determination/i })).toBeVisible()
})

test('navigates to verify page on start', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /begin determination/i }).click()
  await expect(page.getByText(/question 1/i).first()).toBeVisible()
})
