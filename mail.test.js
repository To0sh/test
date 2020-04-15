const webdriver = require('selenium-webdriver');
const  { Builder, By, Key, until, } = require('selenium-webdriver');

const assert = require('assert');

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

let chromeCapabilities = webdriver.Capabilities.chrome();
let chromeOptions = {
    'args': ['--disable-notifications', '--start-maximized']
};

chromeCapabilities.set('chromeOptions', chromeOptions);

const url = 'https://mail.yandex.ru/',
      seleniumHost = 'http://localhost:4444/wd/hub',
      email = 'Your email',
      password = 'Your password',
      subject = 'Test',
      message = 'Test message';


let driver =  new Builder()
    .withCapabilities(chromeCapabilities)
    .usingServer(seleniumHost)
    .forBrowser('chrome')
    .build();

(async function () {
    try {
        await driver.get(url);

        await driver.findElement(By.className('HeadBanner-Button-Enter')).click();
        await driver.findElement(By.name('login')).sendKeys(email, Key.ENTER);
        await driver.wait(until.elementLocated(By.name('passwd')), 5000);
        await driver.findElement(By.className('passp-form-field__label')).click();
        await driver.findElement(By.name('passwd')).sendKeys(password, Key.ENTER);

        await driver.wait(until.elementLocated(By.className('mail-ComposeButton')), 5000);
        await driver.findElement(By.className('mail-ComposeButton')).click();

        await driver.wait(until.elementLocated(By.className('composeYabbles')), 5000);
        await driver.findElement(By.className('composeYabbles')).sendKeys(email);
        await driver.findElement(By.className('ComposeSubject-TextField')).sendKeys(subject);
        await driver.findElement(By.className('cke_wysiwyg_div ')).sendKeys(message);
        await driver.findElement(By.className('ComposeControlPanelButton-Button_action')).click();

        await driver.get(url);

        await driver.wait(until.elementLocated(By.linkText('Отправленные')), 5000);
        await driver.findElement(By.linkText('Отправленные')).click();

        await sleep(3000);

        let sentMessages = await driver.findElements(By.className('ns-view-messages-item-wrap'));
        let firstSendMessageWrapper = await sentMessages[0];
        await firstSendMessageWrapper.click();
        await driver.wait(until.elementLocated(By.className('ns-view-messages-item-thread')), 5000);
        let threadWrapper =  await firstSendMessageWrapper.findElement(By.className('ns-view-messages-item-thread'));
        let threadMessages = await threadWrapper.findElements(By.css('.ns-view-messages-item-wrap'));
        await threadMessages[1].click();

        await driver.wait(until.elementLocated(By.className('mail-Message-Body-Content')), 5000);
        let messageBody = await driver.findElement(By.className('mail-Message-Body-Content'));
        let text = await messageBody.getText().then(text => text);

        await assert.ok(text === message, 'Текст не совпадает!');

        await driver.findElement(By.className('mail-FolderList-Item_inbox')).click();

        await sleep(5000);

        await driver.navigate().refresh();

        await driver.wait(until.elementLocated(By.className('ns-view-messages-item-wrap')), 5000);
        let incomingMessages = await driver.findElements(By.className('ns-view-messages-item-wrap'));

        let firstIncomingMessageWrapper = await incomingMessages[0];
        await firstIncomingMessageWrapper.click();
        await driver.wait(until.elementLocated(By.className('ns-view-messages-item-thread')), 5000);
        let threadIncomingWrapper =  await firstIncomingMessageWrapper.findElement(By.className('ns-view-messages-item-thread'));
        let threadIncomingMessages = await threadIncomingWrapper.findElements(By.css('.ns-view-messages-item-wrap'));
        await threadIncomingMessages[0].click();

        await driver.wait(until.elementLocated(By.className('mail-Message-Body-Content')), 5000);
        let incomingMessageBody = await driver.findElement(By.className('mail-Message-Body-Content'));
        let incomingText = await incomingMessageBody.getText().then(text => text);

        await assert.ok(incomingText === message, 'Текст не совпадает!');

        await console.log('Test is done!');

        await sleep(1000);

        await driver.quit();
    } catch (e) {
        await console.log('Error! -> ' + e.message);
        await driver.quit();
    }
})();
