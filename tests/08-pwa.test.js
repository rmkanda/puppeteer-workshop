const puppeteer = require("puppeteer");
const chalk = require("chalk");

const APP_URL = "https://rmkanda.github.io/sample-pwa/";

const displayRequests = (allRequests) => {
  Array.from(allRequests.values()).forEach((req) => {
    console.log(
      req.url(),
      req.response() && req.response().fromServiceWorker()
        ? chalk.green("✔")
        : chalk.red("✕")
    );
  });
};

describe("PWA tests", () => {
  it("should register service worker", async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(APP_URL);
    await page.evaluate("navigator.serviceWorker.ready");
    const allRequests = new Map();
    page.on("request", (req) => {
      allRequests.set(req.url(), req);
    });
    await page.setOfflineMode(true);
    await page.reload({ waitUntil: "networkidle0" });
    await page.reload({ waitUntil: "domcontentloaded" });
    console.assert(
      await page.evaluate("navigator.serviceWorker.controller"),
      "page has active service worker"
    );
    displayRequests(allRequests);
    await browser.close();
  });
});
