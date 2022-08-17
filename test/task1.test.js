'use strict';

const { Builder, By, until, Key } = require('selenium-webdriver');
const chai = require('chai');
const expect = chai.expect;
const chrome = require('selenium-webdriver/chrome');

// START TESTS: npm test -- --grep 'Task1'

describe('Task1', function() {
    let driver;

    before(async function() {
        let service = new chrome.ServiceBuilder('chromedriver.exe').build();
        chrome.setDefaultService(service);

        driver = await new Builder().forBrowser('chrome').build();
    });

    after(function() {
        return driver.quit();
    });

    it ("Go to Swag Labs home page", async function(){

        await driver.get('https://www.saucedemo.com/');

        expect(await driver.getCurrentUrl()).to.eq('https://www.saucedemo.com/');
    });

    // 
    it("Login with valid credentials", async function(){
        
        const username = "standard_user";
        const password = "secret_sauce";

        const inputUsername = await driver.findElement(By.id('user-name'));
        await inputUsername.sendKeys(username);

        const inputPassword = await driver.findElement(By.id('password'));
        await inputPassword.sendKeys(password);

        const loginButton = await driver.findElement(By.id('login-button'));
        await loginButton.click();

        expect(await driver.getCurrentUrl('https://www.saucedemo.com/inventory.html'));
    });

    it("Add an item from the list to the cart", async function(){

        // In case all buttons have the same class
        // <div class="inventory_item xh-highlight">
        const item1 = await driver.findElement(By.xpath('//*[@id="item_4_img_link"]/ancestor::div[2]'));

        const orderButton1 = await driver.findElement(By.name('add-to-cart-sauce-labs-backpack'));
        await item1.findElement(By.name('add-to-cart-sauce-labs-backpack'));
        await orderButton1.click();

        expect(await driver.getCurrentUrl('https://www.saucedemo.com/cart.html'));
        expect(await driver.findElement(By.xpath('//a[contains(., "Sauce Labs Backpack")]')));
        expect(await driver.findElement(By.xpath('//a[contains(., "1")]')));
        
    });

        it("Open another item’s details page and add to the cart", async function(){
            await driver.get('https://www.saucedemo.com/cart.html');
            // Back to the main page
            const continueShoping = await driver.findElement(By.xpath('//*[@id="continue-shopping"]'));
            await continueShoping.click();

            expect(await driver.getCurrentUrl()).to.eq('https://www.saucedemo.com/inventory.html');

            // select second item and open details page
            await driver.findElement(By.id('item_5_img_link')).click();

            expect(await driver.getCurrentUrl()).to.eq('https://www.saucedemo.com/inventory-item.html?id=5');
            // Add to cart
            
            await driver.findElement(By.id('add-to-cart-sauce-labs-fleece-jacket')).click();

            expect(await driver.findElement(By.xpath('//a[contains(., "2")]')));
            expect(await driver.getCurrentUrl()).to.eq('https://www.saucedemo.com/inventory-item.html?id=5');
 

        });

        it("Open the cart and verify the correct items are present", async function(){

            // Back to the shopping page
            const backToShopButton = await driver.findElement(By.id('back-to-products'));
            await backToShopButton.click();

            expect(await driver.getCurrentUrl()).to.eq('https://www.saucedemo.com/inventory.html');

            // Go to the cart and verify that the correct items are present
            await driver.findElement(By.className('shopping_cart_link')).click();
            expect(await driver.getCurrentUrl()).to.eq('https://www.saucedemo.com/cart.html');
            expect(await driver.findElement(By.xpath('//a[contains(., "Sauce Labs Backpack")]')));
            expect(await driver.findElement(By.xpath('//a[contains(., "Sauce Labs Fleece Jacket")]')));
            

        });

        it("Remove the first item from the cart and verify item2 is present", async function(){

            // Remove first item
            await driver.findElement(By.id('remove-sauce-labs-backpack')).click();
            
            expect(await driver.findElement(By.xpath('//a[contains(., "1")]')));
            expect(await driver.getCurrentUrl()).to.eq('https://www.saucedemo.com/cart.html');

            // Verify the correct item is present (item 2)
            expect(await driver.findElement(By.xpath('//a[contains(., "Sauce Labs Fleece Jacket")]')));

        });

        it("Continue to the Checkout page", async function(){

            await driver.findElement(By.id('checkout')).click();

            expect(await driver.getCurrentUrl()).to.eq('https://www.saucedemo.com/checkout-step-one.html');
            expect(await driver.findElement(By.xpath('//span[contains(@class, "title")]')).getText()).to.contain('CHECKOUT: YOUR INFORMATION');
            
        });

        it("Complete the checkout form and complete the order", async function(){

            const firstName = "Petar";
            const lastName = "Petrovic";
            const postalCode = "21000";

            const inputFirstName = await driver.findElement(By.id('first-name'));
            await inputFirstName.sendKeys(firstName);

            const inputLastName = await driver.findElement(By.id('last-name'));
            await inputLastName.sendKeys(lastName);

            const inputPostalCode = await driver.findElement(By.id('postal-code'));
            await inputPostalCode.sendKeys(postalCode);

            await driver.findElement(By.id('continue')).click();

            expect(await driver.getCurrentUrl()).to.eq('https://www.saucedemo.com/checkout-step-two.html');
            expect(await driver.findElement(By.xpath('//span[contains(@class, "title")]')).getText()).to.contain('CHECKOUT: OVERVIEW');

            // Complete order successfully with the displayed message
            await driver.findElement(By.name('finish')).click();

            expect(await driver.getCurrentUrl()).to.eq('https://www.saucedemo.com/checkout-complete.html');
            expect(await driver.findElement(By.xpath('//span[contains(@class, "title")]')).getText()).to.contain('CHECKOUT: COMPLETE!');
            expect(await driver.findElement(By.xpath('//h2[contains(., "THANK YOU FOR YOUR ORDER")]')));

            // Displayed message
            expect(await driver.findElement(By.xpath('//div[contains(@class, "complete-text")]')));


            

        });
        

});