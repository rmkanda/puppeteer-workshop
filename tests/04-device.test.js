const puppeteer = require("puppeteer");
const expect = require("chai").expect;

const APP_URL = "https://rmkanda.github.io/sample-pwa/";

describe("Device Compatablity", async () => {
  it("Test against custom screen resolution", async () => {
    const browser = await puppeteer.launch({
      headless: true,
      //   args: ["--window-size=540,720"],
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 540,
      height: 720,
    });
    await page.goto(APP_URL);
    const element = await page.$("#displayDimen");
    const content = await page.evaluate(
      (element) => element.textContent,
      element
    );
    expect(content).to.be.contains("Width: 540");
    expect(content).to.be.contains("Height: 720");
    await browser.close();
  });

  it("Device emulation - iPhone", async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(APP_URL);
    await page.emulate(puppeteer.devices["iPhone X"]);
    const element = await page.$("#browserInfo");
    const content = await page.evaluate(
      (element) => element.textContent,
      element
    );
    expect(content).to.be.contains("Browser: Safari");
    await browser.close();
  });

  it("Device emulation on Landscape", async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.emulate(puppeteer.devices["iPhone X landscape"]);
    await page.goto(APP_URL);
    const element = await page.$("#displayDimen");
    const content = await page.evaluate(
      (element) => element.textContent,
      element
    );
    expect(content).to.be.contains("Orientation: landscape-primary");
    await browser.close();
  });

  //TODO: add assertion
  it("Network/CPU Emulation for slow 3G", async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const client = await page.target().createCDPSession();
    const slow3G = {
      offline: false,
      // Download speed (512 kbps)
      downloadThroughput: ((500 * 1024) / 8) * 0.8,
      // Upload speed (512 kbps)
      uploadThroughput: ((500 * 1024) / 8) * 0.8,
      // Latency 2000 (ms)
      latency: 400 * 5,
    };
    await client.send("Network.enable");
    await client.send("Network.emulateNetworkConditions", slow3G);
    await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.goto(APP_URL);
    await browser.close();
  });
});
