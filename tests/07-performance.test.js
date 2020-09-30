const puppeteer = require("puppeteer");
const { expect } = require("chai");

const APP_URL = "https://rmkanda.github.io/sample-pwa/";

describe("Performance metrics", async () => {
  it("site should take only 5MB of heap size", async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(APP_URL, { waitUntil: "networkidle0" });

    const metrics = await page.metrics();

    expect(metrics.JSHeapTotalSize).lessThan(5 * 1024 * 1024);

    await browser.close();
  });
});
