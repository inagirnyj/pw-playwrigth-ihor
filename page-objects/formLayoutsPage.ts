import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class FormLayoutsPage extends HelperBase {

    constructor(page: Page) {
        super(page);
    }

    async submitUsingTheGridFormWithCredentialsAndSelectOption(email: string, password: string, optionText: string) {
        const usingTheGridForm = this.page.locator('nb-card', { hasText: 'Using the Grid' });
        await usingTheGridForm.getByRole('textbox', { name: 'Email' }).fill(email);
        await usingTheGridForm.getByRole('textbox', { name: 'Password' }).fill(password);
        await usingTheGridForm.getByRole('radio', { name: optionText }).check({ force: true });
        await usingTheGridForm.getByRole('button', { name: 'Sign In' }).click();
    }

    /**
     * This method fills and submits the inline form with the provided name, email and checkbox option.
     * @param name - Name to be filled in the form
     * @param email - Email to be filled in the form
     * @param rememberMe - Boolean indicating whether to check the "Remember Me" checkbox
     */
    async submitInlineFormWithNameEmailAndCheckbox(name: string, email: string, rememberMe: boolean) {
        const inlineForm = this.page.locator('nb-card', { hasText: 'Inline form' });
        await inlineForm.getByRole('textbox', { name: 'Jane Doe' }).fill(name);
        await inlineForm.getByRole('textbox', { name: 'Email' }).fill(email);
        const checkbox = inlineForm.getByRole('checkbox');
        if (rememberMe)
            await inlineForm.getByRole('checkbox').check({ force: true });
        await inlineForm.getByRole('button', { name: 'Submit' }).click();
    }
}
