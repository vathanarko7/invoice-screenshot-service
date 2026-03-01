import express from "express";
import puppeteer from "puppeteer-core";

const app = express();
app.use(express.json({ limit: "1mb" }));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

app.get("/", (req, res) => res.status(200).send("ok"));

app.post("/screenshot", async (req, res) => {
  try {
    const { spreadsheetId, gid } = req.body || {};
    if (!spreadsheetId || !gid) return res.status(400).send("Missing spreadsheetId/gid");

    // const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${gid}`;
    const url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vR2-Ih8dHyYTrhWUSyYgngFLa0yS6DdhJmoel8y2MzNzMeCnKwKep3GV7Xj8H2iQX3jh2HhL9qDupFi/pubhtml?gid=790763898&single=true`;

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.CHROME_BIN || "/usr/bin/chromium",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
      ],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 3 });

      page.setDefaultNavigationTimeout(90000);
      page.setDefaultTimeout(90000);

      await page.goto(url, { waitUntil: "networkidle2" });
      await page.addStyleTag({content: `*{font-family:"Khmer OS","Khmer OS System","Noto Sans",sans-serif !important;}`});
      await sleep(1200); // ✅ instead of page.waitForTimeout

      const png = await page.screenshot({ type: "png", fullPage: true });

      res.setHeader("Content-Type", "image/png");
      return res.status(200).send(png);
    } finally {
      await browser.close();
    }
  } catch (e) {
    console.error(e);
    return res.status(500).send(String(e?.stack || e));
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("Listening on", port));