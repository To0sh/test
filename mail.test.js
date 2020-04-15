const { Builder } = require('selenium-webdriver');
const url = 'https://mail.yandex.ru/',
    email = '',
    password = '',
    message = 'Test message';


(async function () {
    let driver = await new Builder()
        .forBrowser('chrome')
        .build();

    await driver.get(url);
})();