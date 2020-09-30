const puppeteer = require("puppeteer");
const expect = require("chai").expect;

const APP_URL = "https://rmkanda.github.io/sample-pwa/";

describe("Home Page", async () => {
  it("check site title", async () => {
    const browser = await puppeteer.launch({ headless: true, slowMo: 500 });
    const page = await browser.newPage();

    await page.goto(APP_URL, { waitUntil: "networkidle0" });
    const pageTitle = await page.title();
    expect(pageTitle).to.be.equal("Sample PWA");

    await browser.close();
  });
});
