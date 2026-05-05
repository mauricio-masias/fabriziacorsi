import { test, expect } from '@playwright/test'

test.describe('Fabrizia Corsi Homepage', () => {

    test.beforeEach(async ({ context }) => {
        await context.clearCookies()
    })

    test('loads and shows hero section', async ({ page }) => {
        await page.goto('/')

        // Preloader should disappear and hero should be visible
        await expect(page.locator('#hero')).toBeVisible({ timeout: 15000 })
        await expect(page.locator('#hero h1')).toContainText('FABRIZIA CORSI')
    })

    test('navigation bar is visible after load', async ({ page }) => {
        await page.goto('/')
        await expect(page.locator('#hero')).toBeVisible({ timeout: 15000 })
        await expect(page.locator('header')).toBeVisible()
    })

    test('cookie banner appears on first visit', async ({ page }) => {
        await page.goto('/')
        await expect(page.locator('#hero')).toBeVisible({ timeout: 15000 })
        await expect(page.locator('[data-testid="cookie-banner"]')).toBeVisible({ timeout: 5000 })
    })

    test('accepting cookies hides the banner', async ({ page }) => {
        await page.goto('/')
        await expect(page.locator('[data-testid="cookie-banner"]')).toBeVisible({ timeout: 5000 })
        await page.click('[data-testid="accept-cookies"]')
        await expect(page.locator('[data-testid="cookie-banner"]')).not.toBeVisible({ timeout: 3000 })
    })

    test('just essentials hides the banner without GTM', async ({ page }) => {
        await page.goto('/')
        await expect(page.locator('[data-testid="cookie-banner"]')).toBeVisible({ timeout: 5000 })
        await page.click('[data-testid="essential-cookies"]')
        await expect(page.locator('[data-testid="cookie-banner"]')).not.toBeVisible({ timeout: 3000 })
        // GTM script should NOT be injected
        const gtmScript = await page.$('#gtm-script')
        expect(gtmScript).toBeNull()
    })

    test('privacy policy opens from cookie banner', async ({ page }) => {
        await page.goto('/')
        await expect(page.locator('[data-testid="cookie-banner"]')).toBeVisible({ timeout: 5000 })
        await page.click('.privacy-link')
        await expect(page.locator('[role="dialog"]')).toBeVisible()
        await expect(page.locator('#privacy-title')).toContainText('Privacy Policy')
    })

    test('privacy policy closes on escape key', async ({ page }) => {
        await page.goto('/')
        await expect(page.locator('[data-testid="cookie-banner"]')).toBeVisible({ timeout: 5000 })
        await page.click('.privacy-link')
        await expect(page.locator('[role="dialog"]')).toBeVisible()
        await page.keyboard.press('Escape')
        await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 2000 })
    })

    test('all main sections are present in the DOM', async ({ page }) => {
        await page.goto('/')
        await expect(page.locator('#hero')).toBeVisible({ timeout: 15000 })
        await expect(page.locator('#about')).toBeAttached()
        await expect(page.locator('#gigs')).toBeAttached()
        await expect(page.locator('#mixes')).toBeAttached()
        await expect(page.locator('#releases')).toBeAttached()
        await expect(page.locator('#contact')).toBeAttached()
    })

    test('navbar link scrolls to section', async ({ page }) => {
        await page.goto('/')
        await expect(page.locator('#hero')).toBeVisible({ timeout: 15000 })
        // Scroll triggers navbar visibility
        await page.evaluate(() => window.scrollBy(0, 100))
        await page.click('a[href="#about"]')
        await page.waitForTimeout(800)
        const aboutTop = await page.locator('#about').boundingBox()
        expect(aboutTop).not.toBeNull()
    })

    test('gig tabs switch between UK and International', async ({ page }) => {
        await page.goto('/')
        await expect(page.locator('#gigs')).toBeAttached({ timeout: 15000 })
        await page.locator('#gigs').scrollIntoViewIfNeeded()
        await page.waitForTimeout(500)

        // UK tab should be active by default
        const ukBtn = page.locator('.tab-btn').first()
        await expect(ukBtn).toHaveClass(/active/)

        // Click International tab
        await page.locator('.tab-btn').nth(1).click()
        await expect(page.locator('.tab-btn').nth(1)).toHaveClass(/active/)
    })

    test('has correct page title', async ({ page }) => {
        await page.goto('/')
        await expect(page).toHaveTitle(/Fabrizia Corsi/)
    })

    test('logo image loads', async ({ page }) => {
        await page.goto('/')
        await expect(page.locator('#hero')).toBeVisible({ timeout: 15000 })
        const logo = page.locator('.hero-logo')
        await expect(logo).toBeVisible()
    })
})
