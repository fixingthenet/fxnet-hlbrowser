const express    = require("express");
const bodyParser = require("body-parser");
const puppeteer  = require('puppeteer-core');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const delayExecution = (delay_ms) => new Promise((resolve) => setTimeout(resolve, delay_ms));

const viewport = {
  width: 1920,
  height: 1080
};
let browser = null;

app.post('/screenshot', async (req,res) => {
  const { url, delay } = req.body;
  console.log("getting from:", req.body, url, delay);

  try {
    const page = await browser.newPage();
    await page.setViewport(viewport);
    if (!delay) {
      await page.goto(url, { waitUntil: 'networkidle0' });
    } else {
      await page.goto(url);
      await delayExecution(delay);
    }
    const screenshot = await page.screenshot({ encoding: "binary" });
    page.close();

    console.log(screenshot);

    res.contentType("png");
    return res.end(screenshot, 'binary');
  } catch (error) {
    console.log(error);
    return res.json({error: true, name: error.name});
  }
});

(async () => {
  browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--shm-size=1gb'],
    executablePath: '/usr/bin/chromium-browser'
  });

  const PORT = 3100;
  app.listen(PORT, () => console.log(`Started on PORT ${PORT}`));

})();
