import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }, testInfo) => {
    await page.goto(process.env.URL);
    await page.getByText('Button Triggering AJAX Request').click();
    testInfo.setTimeout(testInfo.timeout + 10000); // extend timeout for each test
});

test('auto waiting', async ({ page }) => {
    const successButton = page.locator('.bg-success');

    await successButton.click();

    // const text = await successButton.textContent();
    // await successButton.waitFor({ state: 'attached' });
    // const text = await successButton.allTextContents();

    // expect(text).toEqual('Data loaded with AJAX get request.');

    await expect(successButton).toHaveText('Data loaded with AJAX get request.', { timeout: 20000 });
});

test('alternative waits', async ({ page }) => {
    const successButton = page.locator('.bg-success');

    // wait for element
    // await page.waitForSelector('.bg-success');

    // wait for particular response
    // await page.waitForResponse('http://uitestingplayground.com/ajaxdata');

    // wait for network calls to be completed 'NOT RECOMENDED'
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // just to see the result

    // const text = await successButton.allTextContents();
    // expect(text).toEqual('Data loaded with AJAX get request.');
    await expect(successButton).toHaveText('Data loaded with AJAX get request.');

});

test('timeouts', async ({ page }) => {
    test.setTimeout(20000); // set test timeout
    const successButton = page.locator('.bg-success');
    await successButton.click({ timeout: 17000 }); // set action timeout
    await expect(successButton).toHaveText('Data loaded with AJAX get request.', { timeout: 7000 }); // set expect timeout
});
