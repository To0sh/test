let wd = require('selenium-webdriver');
const assert = require('assert');

const SELENIUM_HOST = 'http://localhost:4444/wd/hub';
const URL = 'http://www.yandex.ru';

let client = new wd.Builder()
    .usingServer(SELENIUM_HOST)
    .withCapabilities({ browserName: 'chrome' })
    .build();

client.get(URL).then( async () => {
    await client.findElement({ name: 'text' }).sendKeys('test');
    await client.findElement({ css: '.button_theme_websearch' }).click();

    await client.wait(wd.until.titleContains('Яндекс'), 1000);

    await client.getTitle().then(title => {
        assert.ok(title.indexOf('test — Яндекс: нашлось') > -1, 'Ничего не нашлось :(');
    });

    await client.quit();
}).catch(e => console.log(e.message));
