import crypto from "crypto";
import localforage from "localforage";

export const justQAPi = "http://xxx.xxx.x.x:xxxx/";

export function categoryAPI(selected, category, callBack) {
  let fetchCateNum = category.map((el) => el[1])[
    category.map((el) => el[0]).indexOf(selected)
  ];
  // assuming that fetching is done through its category number
  fetch(justQAPi + "?category=" + fetchCateNum)
    .then((res) => res.json())
    .then((res) => {
      localforage.setItem("data", res, () => {
        callBack();
      });
    })
    .catch((err) => {
      alert("카테고리에 해당하는 데이터를 불러오는데 실패했습니다: ", err);
      console.log("category fetch failed: ", err);
      callBack();
    });
}

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

export function send2ServerAPI() {
  Promise.resolve(
    fetch(justQAPi + `/newData`, {
      method: "POST",
      body: JSON.stringify(localforage.getItem("data")),
    })
  )
    .then(() => {
      alert("데이터 저장 성공");
      console.log("데이터 저장 성공");
      localforage.clear();
      /* delete locally saved data ONLY when posting is resolved
      because the user might want to continue when rejected */
    })
    .catch((err) => {
      alert("데이터를 서버에 저장하는데 실패했습니다: ", err);
      console.log("posting data rejected: ", err);
    });
}
