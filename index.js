import express from "express";
import puppeteer from "puppeteer";

const app = express();
app.use(express.json());

app.post("/screenshot", async (req, res) => {
  const { spreadsheetId, gid } = req.body;

  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=${gid}`;

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.waitForTimeout(2000);

  const screenshot = await page.screenshot({ fullPage: true });

  await browser.close();

  res.setHeader("Content-Type", "image/png");
  res.send(screenshot);
});


app.listen(process.env.PORT || 8080);

app.get("/", (req, res) => res.status(200).send("ok"));
app.get("/healthz", (req, res) => res.status(200).send("ok"));
