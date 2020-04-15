const webdriver = require('selenium-webdriver');
const  { Builder, By, Key, until } = require('selenium-webdriver');

let chromeCapabilities = webdriver.Capabilities.chrome();
let chromeOptions = {
    'args': ['--disable-notifications']
};

chromeCapabilities.set('chromeOptions', chromeOptions);

const url = 'https://mail.yandex.ru/',
      seleniumHost = 'http://localhost:4444/wd/hub',
      email = 'sergey@nabiullin.com',
      password = 'sorrowkill',
      message = 'Test message';


let driver =  new Builder()
    .withCapabilities(chromeCapabilities)
    .usingServer(seleniumHost)
    .forBrowser('chrome')
    .build();

(async function () {
    try {
        await driver.get(url);

        await driver.findElement(By.css('.HeadBanner-Button-Enter')).click();
        await driver.findElement(By.name('login')).sendKeys(email, Key.ENTER);
        await driver.wait(until.elementLocated(By.name('passwd')), 5000);
        await driver.findElement(By.name('passwd')).sendKeys(password, Key.ENTER);


    } catch (e) {
        console.log(e.message);
    } finally {

    }
})();