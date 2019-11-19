const express    = require("express");
const bodyParser = require("body-parser");
const puppeteer  = require('puppeteer-core');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const delayExecution = (delay_ms) => new Promise((resolve) => setTimeout(resolve, delay_ms));
const PORT = 3100;
const viewport = {
  width: 1920,
  height: 1080
};

let browser = null;

// TBD: this should block for anybody and return to anybody the same thing
// currently parallel requests could overwrite browsers

const launchBrowser = async function() {
  console.debug("Launching new browser");
  var b = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--shm-size=1gb'],
    headless: false,
    executablePath: '/usr/bin/chromium-browser'
  });
  console.debug("Browser launched")
  return b;
}

app.get('/health', (req,res) => {
  return res.json({success: true})
})

app.post('/screenshot', async (req,res) => {
  const { url, delay } = req.body;
  console.log("getting from:", req.body, url, delay || "no delay");
  var page;

  try {
    if (!browser) {
      browser=await launchBrowser();
    }
    console.debug("Creating new page");
    page = await browser.newPage();
    await page.setViewport(viewport);
    if (!delay) {
      await page.goto(url, { waitUntil: 'networkidle0' });
    } else {
      await page.goto(url);
      await delayExecution(delay);
    }
    const screenshot = await page.screenshot({ encoding: "binary" });
    res.contentType("png");
    res.end(screenshot, 'binary');
  } catch (error) {
    console.error("Error:", error);
    res.json({error: true, name: error.name});
  } finally {
    if (page) {
      console.debug("Closing Page");
      //page.close()
    } else { //no page? that's strang! browser might be broken
      console.debug("Closing Browser");
      if (browser) browser.close()
      browser=null //force relaunch
    }
  }
    return
});

app.listen(PORT, function() {
  console.log(`Started on PORT ${PORT}`);
});


process.on('SIGUSR2', () => {
  console.debug('SIGTERM signal received.');
  if (browser) {
    browser.close()
  }
});
