import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /begin determination/i }).click()
})

test('shows first question', async ({ page }) => {
  await expect(page.getByText(/question 1/i).first()).toBeVisible()
  await expect(page.getByRole('group', { name: /answer options/i })).toBeVisible()
})

test('back to home from first question', async ({ page }) => {
  await page.getByRole('button', { name: /back to home|go to home/i }).click()
  await expect(page.getByRole('button', { name: /begin determination/i })).toBeVisible()
})

test('progress bar advances after answering', async ({ page }) => {
  const firstAnswer = page.getByRole('group', { name: /answer options/i }).getByRole('button').first()
  await firstAnswer.click()
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', /^[1-9]/)
})
