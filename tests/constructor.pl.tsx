import { test, expect } from '@playwright/test';

const bunName = 'Краторная булка N-200i';
const fillingName = 'Биокотлета из марсианской Магнолии';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  await page.goto('/');
});

test.describe('Добавление ингредиентов в конструктор бургера', () => {
  test('Добавление ингредиента в конструктор', async ({ page }) => {
    const addButtons = page.getByRole('button', { name: 'Добавить' });

    await addButtons.first().click();

    await expect(page.getByText('Выберите булки')).toHaveCount(0);

    await expect(page.getByText(`${bunName} (верх)`)).toBeVisible();
    await expect(page.getByText(`${bunName} (низ)`)).toBeVisible();
  });

  test('Добавление начинки в конструктор', async ({ page }) => {
    await page.goto('/');
    const addFillingButton = page
      .locator('li')
      .filter({ hasText: fillingName })
      .getByRole('button', { name: 'Добавить' });

    await addFillingButton.click();

    await expect(
      page.locator('.constructor-element__text').getByText(fillingName)
    ).toBeVisible({ timeout: 5000 });
  });

  test.describe('Модальное окно ингредиента', () => {
    test('Открытие модального окна ингредиента', async ({ page }) => {
      await page.goto('/');

      const modal = page.locator('#modals');

      await page.getByText(bunName, { exact: true }).click();

      await expect(modal.getByText('Информация об ингредиенте')).toBeVisible();
      await expect(modal.getByRole('heading', { name: bunName })).toBeVisible();
    });

    test('Закрытие модального окна по крестику', async ({ page }) => {
      await page.goto('/');
      const modal = page.locator('#modals');
      await page.getByText(bunName, { exact: true }).click();

      await expect(modal.getByText('Информация об ингредиенте')).toBeVisible();

      await page.locator('#modals button').first().click();

      await expect(
        modal.getByText('Информация об ингредиенте')
      ).not.toBeVisible();
    });

    test('Закрытие модального окна по клику на оверлей', async ({ page }) => {
      const modal = page.locator('#modals');

      await page.getByText(bunName, { exact: true }).click();
      await expect(modal.getByText('Информация об ингредиенте')).toBeVisible();

      await page.mouse.click(5, 5);

      await expect(modal.getByText('Информация об ингредиенте')).toHaveCount(0);
    });
  });

  test('Создание заказа', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'test-refresh-token');
      document.cookie = 'accessToken=test-access-token';
    });

    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            email: 'test@test.ru',
            name: 'Тест'
          }
        })
      });
    });

    await page.route('**/api/orders', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            name: 'Тестовый бургер',
            order: {
              _id: '1',
              status: 'done',
              name: 'Тестовый бургер',
              createdAt: '2025-01-01',
              updatedAt: '2025-01-01',
              number: 12345,
              ingredients: []
            }
          })
        });
        return;
      }

      await route.fallback();
    });

    await page.goto('/');

    await page
      .locator('li')
      .filter({ hasText: bunName })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page
      .locator('li')
      .filter({ hasText: fillingName })
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText('12345')).toBeVisible();

    await expect(page.getByText('Выберите булки')).toHaveCount(2);
    await expect(page.getByText('Выберите начинку')).toHaveCount(1);

    await page.locator('#modals button').first().click();

    await expect(page.getByText('12345')).not.toBeVisible();
  });
});
