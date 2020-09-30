const puppeteer = require("puppeteer");
const expect = require("chai").expect;

const APP_URL = "https://rmkanda.github.io/sample-pwa/";

describe("Accessibility", async () => {
  it("Accessibility snapshot test", async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(APP_URL, { waitUntil: "networkidle0" });

    const snapshot = await page.accessibility.snapshot();
    expect(snapshot.name).equals("Sample PWA");
    await browser.close();
  });

  it.skip("verify default language is detected peoperly", async () => {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "language", {
        get: function () {
          return "fr-ca";
        },
      });
      Object.defineProperty(navigator, "languages", {
        get: function () {
          return ["fr-ca", "en"];
        },
      });
    });
    await page.setExtraHTTPHeaders({
      "Accept-Language": "es",
    });
    await page.goto(APP_URL, { waitUntil: "networkidle0" });
    await browser.close();
  });
});
