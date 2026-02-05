import { test } from '../test-options';
import { faker } from '@faker-js/faker';

test('parametrized methods', async ({ pageManager }) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const randomFullName = `${firstName} ${lastName}`;
    // const randomFullName = faker.person.fullName();
    const randomEmail = `${firstName}${lastName}${faker.number.int(1000)}@test.com`;

    await pageManager.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption(process.env.USER, process.env.PASSWORD, 'Option 2');
    await pageManager.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true);
});
