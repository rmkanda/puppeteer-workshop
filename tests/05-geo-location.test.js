const puppeteer = require("puppeteer");
const expect = require("chai").expect;

const APP_URL = "https://rmkanda.github.io/sample-pwa/";

describe("Geo Location", async () => {
  it("check site title", async () => {
    const browser = await puppeteer.launch({ headless: true });

    const context = await browser.defaultBrowserContext();
    await context.overridePermissions(APP_URL, ["geolocation"]);

    const page = await context.newPage();

    await page.setGeolocation({
      latitude: 41.8339037,
      longitude: -87.8720466,
    });
    await page.goto(APP_URL);
    const button = await page.$(".btn-primary");
    await button.click();

    const element = await page.$("#current-geo-loc");
    const content = await page.evaluate(
      (element) => element.textContent,
      element
    );
    expect(content).to.be.contains("Latitude: 41.8339037");
    await browser.close();
  });
});
