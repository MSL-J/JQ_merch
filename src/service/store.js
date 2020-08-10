import { Subject } from "rxjs";

const subject = new Subject();

const initialData = {
  data: [],
  row: 1,
};

let newData = [];

const excelStore = {
  init: () => {
    console.log(newData);
    newData = { ...newData };
    subject.next(newData.data[initialData.row]);
  },
  retrieve: () => {
    return newData.data[initialData.row];
  },
  row: () => {
    return initialData.row;
  },
  upload: (excel) => {
    initialData.data = excel;
    newData = excel;
    // console.log(newData);
  },
  nextRow: () => initialData.row++,
  subscribe: (fn) => subject.subscribe(fn),
  changeData: (column, mod) => {
    mod.newName.length && (newData[column.name] = mod.newName);
    mod.newKeyword && (newData[column.keyword] = mod.newKeyword);
    mod.newCategory && (newData[column.category] = mod.newCategory);
    mod.newOrigin && (newData[column.origin] = mod.newOrigin);
  },
};

export default excelStore;
