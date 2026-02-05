import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'parallel' })

test.beforeEach(async ({ page }, testInfo) => {
    await page.goto('/');
});

test.describe.parallel('Form Layouts Page', () => {
    test.describe.configure({ retries: 0 });

    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    });

    test('input fields', async ({ page }) => {
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: 'Email' });

        await usingTheGridEmailInput.fill('test@test.com');
        await usingTheGridEmailInput.clear();
        await usingTheGridEmailInput.pressSequentially('test2@test.com');

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue();
        expect(inputValue).toEqual('test2@test.com');

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com');
    });

    test.only('radiobuttons', async ({ page }) => {
        const usingTheGridForm = page.locator('nb-card', { hasText: 'Using the Grid' });

        // await usingTheGridForm.getByLabel('Option 1').check({ force: true });
        await usingTheGridForm.getByRole('radio', { name: 'Option 2' }).check({ force: true });
        const radioStatus = await usingTheGridForm.getByRole('radio', { name: 'Option 1' }).isChecked();
        await expect(usingTheGridForm).toHaveScreenshot();
        // expect(radioStatus).toBeTruthy();
        // await expect(usingTheGridForm.getByRole('radio', { name: 'Option 1' })).toBeChecked();

        // await usingTheGridForm.getByRole('radio', { name: 'Option 2' }).check({ force: true });
        // expect(await usingTheGridForm.getByRole('radio', { name: 'Option 2' }).isChecked()).toBeTruthy();
        // expect(await usingTheGridForm.getByRole('radio', { name: 'Option 1' }).isChecked()).toBeFalsy();
    });
});

test('checkboxes', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Toastr').click();

    await page.getByRole('checkbox', { name: 'Hide on click' }).check({ force: true });
    // await page.getByRole('checkbox', { name: 'Hide on click' }).uncheck({ force: true });

    const allBoxes = page.getByRole('checkbox');
    for (const box of await allBoxes.all()) {
        await box.uncheck({ force: true });
        expect(await box.isChecked()).toBeFalsy();
    }
});

test('lists and dropdowns', async ({ page }) => {
    const dropDownMenu = page.locator('ngx-header nb-select');
    await dropDownMenu.click();

    page.getByRole('list'); // when the list has a UL tag
    // page.getByRole('listitem'); // when the list has a LI tag

    // const optionList = page.getByRole('list').locator('nb-option');
    const optionList = page.locator('nb-option-list nb-option');
    await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate']);
    await optionList.filter({ hasText: 'Dark' }).click();
    const header = page.locator('nb-layout-header');
    await expect(header).toHaveCSS('background-color', 'rgb(34, 43, 69)');

    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    };

    await dropDownMenu.click();
    for (const color in colors) {
        await optionList.filter({ hasText: color }).click();
        await expect(header).toHaveCSS('background-color', colors[color]);
        if (color != "Corporate")
            await dropDownMenu.click();
    }
});

test('tooltips', async ({ page }) => {
    await page.getByText('Modal & Overlays').click();
    await page.getByText('Tooltip').click();

    const toolTipCard = page.locator('nb-card', { hasText: 'Tooltip Placements' });
    await toolTipCard.getByRole('button', { name: 'Top' }).hover();

    page.getByRole('tooltip') // when the tooltip has a role
    const tooltip = await page.locator('nb-tooltip').textContent();
    expect(tooltip).toEqual('This is a tooltip');
});

test('dialog boxes', async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?');
        await dialog.dismiss();
    });

    await page.getByRole('table').locator('tr', { hasText: 'mdo@gmail.com' }).locator('.nb-trash').click();
});

test('web tables', async ({ page }) => {
    await page.getByText('Tables & Data').click();
    await page.getByText('Smart Table').click();

    // 1 get row by any text in this row
    const targetRow = page.getByRole('row', { name: 'mdo@gmail.com' });
    await targetRow.locator('.nb-edit').click();
    await page.locator('input-editor').getByPlaceholder('Age').clear();
    await page.locator('input-editor').getByPlaceholder('Age').fill('25');
    await page.locator('.nb-checkmark').click();

    // 2 get row based on the velue in the specific column
    // const idColumn = page.getByRole('columnheader', { name: 'ID' });
    // const columnIndex = await idColumn.getAttribute('aria-colindex');

    await page.locator('.ng2-smart-pagination-nav').getByText('2').click(); // navigate to second page
    const targetRowById = page.getByRole('row', { name: '11' }).filter({ has: page.locator('td').nth(1).getByText('11') });
    await targetRowById.locator('.nb-edit').click();
    await page.locator('input-editor').getByPlaceholder('E-mail').clear();
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('@');
    await page.locator('.nb-checkmark').click();
    await expect(targetRowById.locator('td').nth(5)).toHaveText('@');

    // 3 test filter of the table
    const ages = ['20', '30', '40', '200'];
    for (const age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear();
        await page.locator('input-filter').getByPlaceholder('Age').fill(age);
        await page.waitForTimeout(500); // just to see the result
        const ageRows = page.locator('tbody tr');

        for (let row of await ageRows.all()) {
            const cellValue = await row.locator('td').last().textContent();

            if (age == '200') {
                expect(await page.getByRole('table').textContent()).toContain('No data found');
            } else {
                expect(cellValue).toEqual(age);
            }

        }
    }
});

test('datepicker', async ({ page }) => {
    await page.getByText('Forms').click();
    await page.getByText('Datepicker').click();

    const calendarInputField = page.getByPlaceholder('Form Picker');
    await calendarInputField.click();

    let date = new Date();
    date.setDate(date.getDate() + 175);
    const expectedDate = date.getDate().toString();
    const expectedMonthShort = date.toLocaleString('En-US', { month: 'short' });
    const expectedMonthLong = date.toLocaleString('En-US', { month: 'long' });
    const expectedYear = date.getFullYear().toString();
    const expectedDateString = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`;

    let calendarMonthYear = await page.locator('nb-calendar-view-mode').textContent();
    const expectedMonthYear = `${expectedMonthLong} ${expectedYear}`;

    while (!calendarMonthYear.includes(expectedMonthYear)) {
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click();
        calendarMonthYear = await page.locator('nb-calendar-view-mode').textContent();
    }

    // await page.locator('.day-cell.ng-star-inserted').filter({ hasText: '18' }).click();
    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, { exact: true }).click();
    await expect(calendarInputField).toHaveValue(expectedDateString);
});

test('sliders', async ({ page }) => {
    // update attribute
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle');
    await tempGauge.evaluate(node => {
        node.setAttribute('cy', '232.630');
        node.setAttribute('cx', '232.630');
    })
    await tempGauge.click();

    // mouse movement
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger');
    await tempBox.scrollIntoViewIfNeeded();

    const box = await tempBox.boundingBox();
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 100, y);
    await page.mouse.move(x + 100, y + 100);
    await page.mouse.up();
    await expect(tempBox).toContainText('30');
});
