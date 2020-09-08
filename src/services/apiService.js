import crypto from "crypto";
import localforage from "localforage";
import * as XLSX from "xlsx";
import { justQAPi, crawlingAPI } from "utils/api";

export function categoryAPI(selected, category, callBack) {
  /* changing category name to corresponding category number,
  assuming that fetching is done through category number */
  let fetchCateNum = category.map((el) => el[1])[
    category.map((el) => el[0]).indexOf(selected)
  ];
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

export function nameCrawlingApi(input) {
  return new Promise((resolve, reject) => {
    fetch(`${crawlingAPI}getNaverName?searchWord=${input.trim()}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((res) => {
      resolve(res.json());
    });
  });
}

export function justQCategoryXLSX() {
  return new Promise((resolve, reject) => {
    fetch("Category.xlsx")
      .then((res) => res.arrayBuffer())
      .then((res) => {
        let file = XLSX.read(res, { type: "array" });
        const workbook = file.Sheets[file.SheetNames[0]];
        const category = XLSX.utils.sheet_to_json(workbook, { header: 1 });
        category.shift();
        resolve(category);
      });
  });
}
