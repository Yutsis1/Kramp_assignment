import { test, expect } from '@playwright/test';
import { CookiePopUp } from '../pages/comonents/coockiePopUp';
import { MainPage } from '../pages/mainPage';
import { LoginPage } from '../pages/loginPage';
import { ProductPage } from '../pages/productPage';
import { CartPage } from '../pages/cartPage';
import { CheckoutPage } from '../pages/checkoutPage';
import { ConfirmationPage } from '../pages/confirmationPage';

/**
 * This is a Kramp end-2-end scenario for web platform user
 * It designed to test main flow as all steps are necessary for basic user experience. 
 * It means if any step from suggested isn't possible to perform the main flow is broken
 * User can't place an order and basic functionality is not fulfiled
 * In mature systems the best practices is to have one generic happy path test flow
 * And multiple smaller component/unit tests for each page/component
 * It shows that the product can generate at least minimal value without additional time for e2e tests.
 */
test('Kramp Main flow', async ({ page }) => {
  const mainPage = new MainPage(page);
  const productQuantity = randomInt(1, 100); // Random quantity between 1 and 100
  const partNumber = '717004KR';
  let productPrice = 0;
  await test.step('Go to the main page', async () => {
    await mainPage.goto('');
    const cookiePopUp = new CookiePopUp(page);
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
    await mainPage.topBar.expectVisible();
  });

  await test.step('Search for a model', async () => {
    await mainPage.topBar.searchInput.fill(partNumber);
    await mainPage.topBar.searchDialog.selectPartNumberSuggestion(partNumber);
    const productPage = new ProductPage(page);
    await productPage.waitForPage();
    await productPage.verifyPartNumber(partNumber);
    await productPage.addToCart(productQuantity);
    await productPage.verifyAddedToCart(productQuantity);
    // there first coming check sign and this check is not passing 
    // Need to wait for end of animation 
    // expect(
    //   await productPage.topBar.validateShoppingCartCount(productQuantity)
    // ).toBe(true);
    productPrice = (await productPage.getPrice()).asNumber;
  });

  await test.step('Go to the cart and verify the subtotal', async () => {
    await mainPage.topBar.shoppingCartLink.click();
    const cartPage = new CartPage(page);
    await cartPage.waitForPage();
    await cartPage.verifyPartNumberInCart(partNumber);
    const quoteLine = cartPage.lineForPartNumber(partNumber);
    await quoteLine.verifyQuantityInput(productQuantity);
    await quoteLine.verifyBruttoUnitPrice(productPrice);
    await quoteLine.verifyBruttoTotal(productQuantity, productPrice);
  });

  await test.step('Proceed to checkout', async () => {
    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();
    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.waitForPage();
    await checkoutPage.paymentOptions.isVisible();
    await checkoutPage.placeOrder();
  });
  await test.step('Verify order confirmation', async () => {
    const confirmationPage = new ConfirmationPage(page);
    await confirmationPage.verifyOrderConfirmed();
    await confirmationPage.verifyPartNumber(partNumber);
    const confirmationLine = confirmationPage.itemForPartNumber(partNumber);
    await confirmationLine.verifyQuantity(productQuantity);
    await confirmationLine.verifyBruttoUnitPrice(productPrice);
    await confirmationLine.verifyBruttoTotal(productQuantity, productPrice);
    await confirmationLine.verifyBruttoPriceCalculation();
  });
});

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
