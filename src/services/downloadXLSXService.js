import * as XLSX from "xlsx";
import localforage from "localforage";

export async function downloadXLSX(raw) {
  const workBook = XLSX.utils.book_new(); // create a new blank book
  const workSheet = XLSX.utils.json_to_sheet(raw, { skipHeader: true });
  await XLSX.utils.book_append_sheet(workBook, workSheet, "data"); // add the worksheet to the book
  await XLSX.writeFile(workBook, "[수정본] 데이터.xlsx"); // initiate a file download in browser
  await localforage.clear(); // delete locally saved data
}
