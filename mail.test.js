const { Builder, By, Key, until } = require('selenium-webdriver');
const url = 'https://mail.yandex.ru/',
    email = 'sergey@nabiullin.com',
    password = 'sorrowkill',
    message = 'Test message';


(async function () {
    let driver = await new Builder()
        .forBrowser('chrome')
        .build();

    await driver.get(url);
    await driver.findElement(By.css('.HeadBanner-Button-Enter')).click();
    await driver.findElement(By.name('login')).sendKeys(email, Key.ENTER);
    await driver.wait(until.elementLocated(By.name('passwd')), 5000);
    await driver.findElement(By.name('passwd')).sendKeys(password, Key.ENTER);
})();