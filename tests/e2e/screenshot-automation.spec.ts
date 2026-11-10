import { test } from '@playwright/test';
import * as fs from 'fs';

const SCREENSHOT_DIR = 'docs/guides/assets/screenshots';

// Klas??r??n varl??????n?? kontrol et
if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

test.describe('Zuhre Planet Screenshot Automation', () => {
    
    // 1. GENEL SAYFALAR
    test('General Pages', async ({ page }) => {
        await page.goto('http://localhost:5173');
        await page.waitForTimeout(2000); // 3D animasyonlar??n y??klenmesi i??in
        await page.screenshot({ path: `${SCREENSHOT_DIR}/1_home.png`, fullPage: true });
        
        await page.goto('http://localhost:5173/catalog');
        await page.waitForTimeout(2000);
        await page.screenshot({ path: `${SCREENSHOT_DIR}/2_catalog.png`, fullPage: true });
    });

    // 2. M????TER?? AKI????I
    test('Customer Flow', async ({ page }) => {
        await page.goto('http://localhost:5173/login');
        await page.fill('input[type="email"]', 'vip@zuhre.com');
        await page.fill('input[type="password"]', 'Test123!');
        await page.click('button[type="submit"]');
        await page.waitForURL('**/customer/dashboard');
        
        await page.screenshot({ path: `${SCREENSHOT_DIR}/3_customer_dashboard.png` });
        
        await page.goto('http://localhost:5173/customer/wallet');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: `${SCREENSHOT_DIR}/4_customer_wallet.png` });
    });

    // 3. ESCORT AKI????I
    test('Escort Flow', async ({ page }) => {
        await page.goto('http://localhost:5173/login-escort');
        await page.fill('input[type="email"]', 'vip_escort@zuhre.com');
        await page.fill('input[type="password"]', 'Test123!');
        await page.click('button[type="submit"]');
        await page.waitForURL('**/dashboard');
        
        await page.screenshot({ path: `${SCREENSHOT_DIR}/5_escort_dashboard.png` });
        
        await page.goto('http://localhost:5173/escort/dashboard/profile');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: `${SCREENSHOT_DIR}/6_escort_profile_editor.png` });
    });

    // 4. ADM??N AKI????I
    test('Admin Flow', async ({ page }) => {
        await page.goto('http://localhost:5173/admin/login');
        await page.fill('input[type="email"]', 'admin@zuhre.com');
        await page.fill('input[type="password"]', 'Test123!');
        await page.click('button[type="submit"]');
        // 2FA mockland?????? varsay??l??yor veya atlan??yor
        await page.waitForURL('**/admin/dashboard');
        
        await page.screenshot({ path: `${SCREENSHOT_DIR}/7_admin_dashboard.png` });
        
        await page.goto('http://localhost:5173/admin/media-approvals');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: `${SCREENSHOT_DIR}/8_admin_media_approvals.png` });
    });
});
