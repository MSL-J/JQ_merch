import crypto from "crypto";

export function keywordsAPI(hint) {
  let currMilli = Date.now();
  let hints = [];
  hint
    .split(",")
    .slice(0, 5)
    .forEach((el) => {
      hints.push(el.trim());
    });
  hint = hints.join(",");

  return new Promise(function (resolve, reject) {
    fetch(
      `https://cors-anywhere.herokuapp.com/https://api.naver.com/keywordstool?hintKeywords=${hint}&showDetail=1`,
      {
        headers: {
          "X-API-KEY": process.env.REACT_APP_API_KEY,
          "X-Signature": crypto
            .createHmac("sha256", process.env.REACT_APP_SECRET_KEY)
            .update(`${currMilli}.GET./keywordstool`)
            .digest("base64"),
          "X-Customer": process.env.REACT_APP_CUSTOMER,
          "X-Timestamp": currMilli,
          "Access-Control-Allow-Origin": "*",
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        let useful = [];
        let l = res.keywordList.length;
        for (let i = 0; i < l; i++) {
          res.keywordList[i].monthlyAveMobileClkCnt > 40 &&
            useful.push(res.keywordList[i]);
        }
        resolve(useful);
      });
  });
}
