const puppeteer = require("puppeteer");
const expect = require("chai").expect;

const APP_URL = "https://rmkanda.github.io/sample-pwa/";

describe("Date & Time card", async () => {
  it("check rendering", async () => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--disable-web-security"],
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    const mockApiResponse = {
      abbreviation: "IST",
      datetime: "2020-09-30T08:09:37.537455+05:30",
      timezone: "Asia/Kolkata",
      unixtime: 1601433577,
    };

    page.on("request", (intercept) => {
      if (
        intercept.url() === "https://worldtimeapi.org/api/timezone/Asia/Kolkata"
      ) {
        intercept.respond({
          status: 200,
          body: JSON.stringify(mockApiResponse),
        });
      } else intercept.continue();
    });

    await page.goto(APP_URL, { waitUntil: "networkidle0" });

    const element = await page.$("#currentDateTime");
    const content = await page.evaluate(
      (element) => element.textContent,
      element
    );
    expect(content).to.be.contains("1601433577");

    await browser.close();
  });
});
