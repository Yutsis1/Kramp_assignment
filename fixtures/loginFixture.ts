import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { MainPage } from '../pages/mainPage';
import { QuotationApi } from '../api/quotationApi';

type LoginFixture = {
  mainPage: MainPage;
  quotationApi: QuotationApi;
};

export const test = base.extend<LoginFixture>({
  quotationApi: [async ({ page }, use) => {
    const quotationApi = new QuotationApi(page);
    quotationApi.start();
    await use(quotationApi);
    await quotationApi.dispose();
  }, { auto: true }],
  mainPage: async ({ page, quotationApi }, use) => {
    const mainPage = new MainPage(page);

    await mainPage.goto('');
    await mainPage.cookiePopUp.expectVisible();
    await mainPage.cookiePopUp.acceptAllCookies();
    await mainPage.cookiePopUp.expectHidden();

    await mainPage.topBar.loginLink.click();
    const loginPage = new LoginPage(page);
    await loginPage.closeCookiePopUpIfAppears();
    await loginPage.login(process.env.USER_LOGIN!, process.env.USER_PASSWORD!);
    await mainPage.topBar.expectVisible();
    await mainPage.waitForPage();
    await expect(mainPage.topBar.searchInput).toBeVisible();
    await quotationApi.initialize();

    await use(mainPage);
  },
});
