const chrome = require('selenium-webdriver/chrome');
//const firefox = require('../firefox');
const {Builder, By, Key, until} = require('selenium-webdriver');
var fs = require('fs');
var express        =        require("express");
var bodyParser     =        require("body-parser");

var app            =        express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



const width = 1920;
const height = 1080;
let options=new chrome.Options().headless().
    windowSize({width, height}).
    addArguments("--no-sandbox",
                 "--mute-audio",
                 "--disable-dev-shm-usage",
                 '--disable-gpu',
                 '--disable-impl-side-painting',
                 '--disable-gpu-sandbox',
                 '--disable-accelerated-2d-canvas',
                 '--disable-accelerated-jpeg-decoding',

                 "--hide-scrollbars")


function delay(ms) {
  console.log("DELAYING: ", ms);
  return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};

app.post('/screenshot',function(req,res){
  var url=req.body.url;
  var delay_ms=req.body.delay || 2000;

  console.log("getting from:", req.body, url);
  let driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

  driver.get(url)
    .then( delay(delay_ms))
    .then(_ => driver.takeScreenshot())
    //.then(data => {
      //var base64Data = data.replace(/^data:image\/png;base64,/,"");
      //console.log("SCREENSHOT IMAGE:", data.length, data.slice(0,30));
//      return base64Data
    //})
    .then(
      data => {
        //var base64Data = data.replace(/^data:image\/png;base64,/,"")
        console.log("SENDING IMAGE:", data.length, data.slice(0,30));
        res.contentType('png');
        res.end(Buffer.from(data, 'base64').toString('binary'),'binary');
        //res.end(data,'binary')
        driver.quit();
      })
    .catch(
      e => driver.quit().
        then(() => {
          console.log("ERROR:", e)
          res.end(JSON.stringify({error: true, name: e.name}))
        })
    );


});

var port = 3100
app.listen(port,function(){
  console.log(`Started on PORT ${port}`);
})
