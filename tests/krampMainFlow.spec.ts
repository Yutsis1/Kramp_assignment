import { test, expect } from '@playwright/test';
import { CoockiePopUp } from '../pages/comonents/coockiePopUp';
import { MainPage } from '../pages/mainPage';
import { LoginPage } from '../pages/loginPage';


test('has title', async ({ page }) => {
  const mainPage = new MainPage(page);
  await test.step('Go to the main page', async () => {
    await mainPage.goto('');
    const cookiePopUp = new CoockiePopUp(page);
    await cookiePopUp.expectVisible();
    await cookiePopUp.acceptAllCookies();
    await cookiePopUp.expectHidden();
  });

  await test.step('Go to login page and login', async () => {
    await mainPage.topBar.loginLink.click();
    const loginPage = new LoginPage(page);
    await loginPage.closeCookiePopUpIfAppears();
    await loginPage.login(process.env.USER_LOGIN!, process.env.USER_PASSWORD!);
    await mainPage.waitForPage();
    await expect(mainPage.topBar.root).toBeVisible();
  });

  await test.step('Search for a model', async () => {
    await mainPage.topBar.searchInput.fill('717004KR');

  });

});

