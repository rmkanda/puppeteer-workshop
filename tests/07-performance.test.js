const fs = require("fs");
const puppeteer = require("puppeteer");
const { expect } = require("chai");
const lighthouse = require("lighthouse");
const reportGenerator = require("lighthouse/lighthouse-core/report/report-generator");

const APP_URL = "https://rmkanda.github.io/sample-pwa/";

describe("Performance tests", async () => {
  it("site should take only 5MB of heap size", async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(APP_URL, { waitUntil: "networkidle0" });

    const metrics = await page.metrics();

    expect(metrics.JSHeapTotalSize).lessThan(5 * 1024 * 1024);

    await browser.close();
  });

  it("seo score should be 100", async () => {
    const browser = await puppeteer.launch({
      headless: true,
      args: [`--remote-debugging-port=${8042}`],
    });
    const lighthouseResult = await lighthouse(APP_URL, {
      port: 8042,
      disableStorageReset: true,
    });

    expect(lighthouseResult.lhr.categories["seo"].score).equals(100 / 100);

    const time_to_interactive =
      lighthouseResult.lhr.audits["interactive"].displayValue;

    console.log(`Time To Interactive: ${time_to_interactive}`);
    // console.log("Lighthouse metrics", lighthouseResult.lhr.audits);

    //Report
    const html = reportGenerator.generateReport(lighthouseResult.lhr, "html");
    fs.writeFile("LightHouseReport.html", html, (err) => {
      if (err) {
        console.error(err);
      }
    });

    await browser.close();
  });
});
