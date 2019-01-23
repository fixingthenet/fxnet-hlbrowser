const chrome = require('selenium-webdriver/chrome');
//const firefox = require('../firefox');
const {Builder, By, Key, until} = require('selenium-webdriver');
var fs = require('fs');

const width = 640;
const height = 480;

let driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(
        new chrome.Options().headless().
            windowSize({width, height}).
            addArguments("--no-sandbox","--mute-audio","--hide-scrollbars")
    ).build();

//    .setFirefoxOptions(
//        new firefox.Options().headless().windowSize({width, height}))
//    .build();

driver.get('http://www.google.com/ncr')
  .then(_ =>
          driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN))
  .then(_ => driver.wait(until.titleIs('webdriver - Google Search'), 1000))
  .then(_ => driver.takeScreenshot())
  .then(data => {
    var base64Data = data.replace(/^data:image\/png;base64,/,"");
    fs.writeFile("out.png", base64Data, 'base64', function(err) {
      if(err) console.log(err);
    })
   })
  .then(
    _ => driver.quit(),
    e => driver.quit().then(() => { throw e; }));
