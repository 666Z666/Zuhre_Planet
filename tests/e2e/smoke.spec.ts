import { expect, test, type Page } from '@playwright/test';

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? 'admin@zuhre.com';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? 'Test123!';

async function bypassAgeGate(page: Page) {
  await page.addInitScript(() => {
    window.sessionStorage.setItem('v31_age_verified', 'true');
  });
}

async function openRoute(page: Page, route: string) {
  await bypassAgeGate(page);
  const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
  expect(response).not.toBeNull();
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator('body')).toBeVisible();
}

async function loginAsAdmin(page: Page) {
  await openRoute(page, '/admin/login');
  await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
  await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: /sisteme giriş|doğrulanıyor/i }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard/);
  await expect(page.getByText(/yönetici paneli/i)).toBeVisible();
}

test.describe('Smoke', () => {
  test('ana rotalar render oluyor', async ({ page }) => {
    for (const route of ['/', '/catalog', '/login', '/register', '/about', '/contact', '/forum']) {
      await openRoute(page, route);
    }
  });

  test('header navigasyonu kataloga ve ana sayfaya gidiyor', async ({ page }) => {
    await openRoute(page, '/');

    await page.getByRole('link', { name: /keşfet/i }).first().click();
    await expect(page).toHaveURL(/\/catalog$/);

    await page.locator('header a[href="/"]').first().click();
    await expect(page).toHaveURL('/');
  });

  test('müşteri girişi ve forum kategori listeleme smoke kontrolünden geçiyor', async ({ page }) => {
    await openRoute(page, '/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /giriş|login/i }).first()).toBeVisible();

    await openRoute(page, '/forum');
    await expect(page.getByRole('heading', { name: /kozmik forum/i })).toBeVisible();
    await page.getByText('Genel Sohbet').click();
    await expect(page).toHaveURL(/\/forum\/genel$/);
    await expect(page.getByRole('heading', { name: /genel sohbet/i })).toBeVisible();
  });

  test('admin giriş ve medya moderasyonu sekmesi açılıyor', async ({ page }) => {
    await loginAsAdmin(page);
    await page.getByRole('tab', { name: /medya onayları/i }).click();

    await expect(page.getByRole('heading', { name: /medya onayları/i }).first()).toBeVisible();
    await expect(page.getByText(/bekleyen medya yok|medya id:/i).first()).toBeVisible();
  });
});
