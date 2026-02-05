import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
});

test('locator syntax rules', async ({ page }) => {
    // by tag name
    await page.locator('input');

    // by id
    await page.locator('#inputEmail1').click();

    // by class name
    await page.locator('.input-full-width');

    // by attribute name
    await page.locator('[placeholder="Email"]');

    // by class value
    await page.locator('[class="input-full-width size-medium shape-rectangle"]');

    // combine selectors
    await page.locator('input[placeholder="Email"]');

    // by XPath
    await page.locator('//input[@placeholder="Email"]');

    // by partial text
    await page.locator(':text("Using")');

    // by exact text
    await page.locator(':text-is("Using the Grid")');
});

test.skip('User facing locators', async ({ page }) => {
    // by role
    await page.getByRole('textbox', { name: 'Email' }).click();

    // by label
    await page.getByLabel('Email').click();

    // by placeholder
    await page.getByPlaceholder('Email').click();

    // by text
    await page.getByText('Using the Grid').click();

    // by alt text
    await page.getByAltText('People').click();

    // by title
    await page.getByTitle('Email').click();

    // by test id
    await page.getByTestId('inputEmail1').click();
});

test('locating child elements', async ({ page }) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click();
});

test('locating parent elements', async ({ page }) => {
    await page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email' }).click();
    await page.locator('nb-card', { has: page.locator('#inputEmail1') }).getByRole('textbox', { name: 'Email' }).click();

    await page.locator('nb-card').filter({ hasText: 'Basic form' }).getByRole('textbox', { name: 'Email' }).click();
});

test('reusing locators', async ({ page }) => {
    const basicForm = page.locator('nb-card').filter({ hasText: 'Basic form' });
    const emailField = basicForm.getByRole('textbox', { name: 'Email' });

    await emailField.fill('test@test.com');
    await basicForm.getByRole('textbox', { name: 'Password' }).fill('test@test.com');
    await basicForm.locator('nb-checkbox').click();
    await basicForm.getByRole('button', { name: 'Submit' }).click();

    await expect(emailField).toHaveValue('test@test.com');
});

test('extracting values', async ({ page }) => {
    // single text value extraction
    const basicForm = page.locator('nb-card').filter({ hasText: 'Basic form' });
    const labelText = await basicForm.locator('button').textContent();
    expect(labelText).toEqual('Submit');

    // all text values extraction
    const allRadioButtonsLabels = page.locator('nb-radio').allTextContents();
    expect(await allRadioButtonsLabels).toContain('Option 1');

    // input value extraction
    const emailField = basicForm.getByRole('textbox', { name: 'Email' });
    await emailField.fill('test@test.com');
    const emailValue = await emailField.inputValue();
    expect(emailValue).toEqual('test@test.com');

    // placeholder value extraction
    const placeholderValue = await emailField.getAttribute('placeholder');
    expect(placeholderValue).toEqual('Email');
});

test('assertions', async ({ page }) => {
    const basicFormButton = page.locator('nb-card').filter({ hasText: 'Basic form' }).locator('button');

    // general assertions
    const text = await basicFormButton.textContent();
    expect(text).toEqual('Submit');

    // locator assertions
    await expect(basicFormButton).toHaveText('Submit');
    await expect(basicFormButton).toBeVisible();
    await expect(basicFormButton).toBeEnabled();

    // soft assertions
    await expect.soft(basicFormButton).toHaveText('Submit');
    await basicFormButton.click();
});
