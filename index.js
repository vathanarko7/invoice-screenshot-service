import express from "express";
import puppeteer from "puppeteer-core";

const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => res.status(200).send("ok"));

app.post("/screenshot", async (req, res) => {
  try {
    const { spreadsheetId, gid } = req.body || {};
    if (!spreadsheetId || !gid) return res.status(400).send("Missing spreadsheetId/gid");

    // Sheet must be viewable by link, or use a published URL
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${gid}`;

    const browser = await puppeteer.launch({
      headless: "new",
      executablePath: process.env.CHROME_BIN || "/usr/bin/google-chrome",
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
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      page.setDefaultNavigationTimeout(90000);
      page.setDefaultTimeout(90000);

      await page.goto(url, { waitUntil: "networkidle2" });
      await page.waitForTimeout(2500);

      const png = await page.screenshot({ type: "png", fullPage: true });
      res.setHeader("Content-Type", "image/png");
      res.status(200).send(png);
    } finally {
      await browser.close();
    }
  } catch (e) {
    console.error(e);
    res.status(500).send(String(e?.stack || e));
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("Listening on", port));