const puppeteer = require("puppeteer");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.get("/getNaverName", async (req, res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-first-run",
      "--no-sandbox",
      "--no-zygote",
      "--single-process",
    ],
    headless: true,
    executablePath: "/usr/bin/chromium-browser",
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });
  try {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(
      `https://search.shopping.naver.com/search/all?query=${req.query.searchWord}&frm=NVSHATC`
    );
    let rel = await page.$$eval(
      ".relatedTags_relation_srh__1CleC ul li a",
      (texts) => {
        let relArr = [];
        if (!texts) return;
        texts.forEach((text) => relArr.push(text.innerText));
        return relArr;
      }
    );

    let rec = await page.$$eval(".filter_finder_tit__2VCKd", (elArr) => {
      return elArr.reduce((res, el, idx) => {
        if (
          el.innerText === "키워드추천" ||
          el.innerText === "키워드추천\n더보기"
        ) {
          [
            ...document
              .querySelectorAll(".filter_finder_col__3ttPW")
              [idx].querySelectorAll(".filter_text_over__3zD9c"),
          ].map((el) => res.push(el.innerText));
        }
        return res;
      }, []);
    });

    res.json({ rel, rec });
  } catch (err) {
    console.log(err);
  } finally {
    await browser.close();
  }
});

const server = http.createServer(app);

server.listen(4000, () => {
  console.log("Server online!");
});
