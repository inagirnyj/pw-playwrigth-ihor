import { test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { argosScreenshot } from "@argos-ci/playwright";

import { PageManager } from '../page-objects/pageManager';

test.beforeEach(async ({ page }, testInfo) => {
    await page.goto('/');
});

test('navigate to form page @smoke', async ({ page }) => {
    const pm = new PageManager(page);

    await pm.navigateTo().formLayoutsPage();
    await pm.navigateTo().datepickerPage();
    await pm.navigateTo().toastrPage();
    await pm.navigateTo().smartTablePage();
    await pm.navigateTo().tooltipPage();
});

test('parametrized methods', async ({ page }) => {
    const pm = new PageManager(page);
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const randomFullName = `${firstName} ${lastName}`;
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com`.toLowerCase();

    await pm.navigateTo().formLayoutsPage();
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USER, process.env.PASSWORD, 'Option 1');
    // await page.waitForTimeout(500);
    // await page.screenshot({ path: `screenshots/formsLayoutPage-${Date.now()}.png` });
    // const buffer = await page.screenshot();
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true);
    // await page.locator('nb-card', { hasText: 'Inline form' }).screenshot({ path: `screenshots/inlineForm-${Date.now()}.png` });
    await pm.navigateTo().datepickerPage();
    await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(175);
    await pm.onDatepickerPage().selectDatePickerWithRangeFromToday(4, 14);
});

test.only('test with argo CI', async ({ page }) => {
    const pm = new PageManager(page);

    await pm.navigateTo().formLayoutsPage();
    await argosScreenshot(page, "formLayoutsPage");
    await pm.navigateTo().datepickerPage();
    await argosScreenshot(page, "datepickerPage");
});
