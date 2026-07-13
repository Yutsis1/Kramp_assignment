import { test, expect } from '@playwright/test';
import { CoockiePopUp } from '../pages/comonents/coockiePopUp';
import { MainPage } from '../pages/mainPage';
import { LoginPage } from '../pages/loginPage';
import { ProductPage } from '../pages/productPage';


test('has title', async ({ page }) => {
  const mainPage = new MainPage(page);
  const productQuantity = randomInt(1, 100); // Random quantity between 1 and 100
  const partNumber = '717004KR';
  let productPrice = 0;
  let productSubtotal = 0;
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
    await mainPage.topBar.searchInput.fill(partNumber);
    await mainPage.topBar.searchDialog.selectPartNumberSuggestion(partNumber);
    const productPage = new ProductPage(page);
    await productPage.waitForPage();
    await productPage.verifyPartNumber(partNumber);
    await productPage.addToCart(productQuantity);
    await productPage.verifyAddedToCart(productQuantity);
    productPrice = (await productPage.getPrice()).asNumber;
  });

});

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
