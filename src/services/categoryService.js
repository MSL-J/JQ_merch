export function categorySearch(category, input) {
  return new Promise((resolve, reject) => {
    let categoryName = [];
    let categoryNum = [];
    for (let i in category) {
      categoryName.push(category[i][0]);
      categoryNum.push(category[i][1]);
    }

    input = input.trim();
    let filteredCategory = [];
    if (input.includes("+")) {
      //'+' works as 'or'
      let eachInput = input.split("+");
      eachInput.forEach((w) => {
        w = w.trim();
        if (isNaN(w)) {
          let eachCategory = categoryName.filter((c) => {
            return c.includes(w);
          });

          filteredCategory = filteredCategory.concat(eachCategory);
        } else {
          for (let i in categoryNum) {
            categoryNum[i].toString().includes(w) &&
              filteredCategory.push(categoryName[i]);
          }
        }
      });
      filteredCategory = [...new Set(filteredCategory)]; //delete duplicates
    } else if (input.includes("&")) {
      // '&' works as 'and'
      let eachInput = input.split("&");
      eachInput.forEach((w, idx) => {
        w = w.trim();
        if (idx === 0) {
          if (isNaN(w)) {
            let eachCategory = categoryName.filter((c) => {
              return c.includes(w);
            });
            filteredCategory = filteredCategory.concat(eachCategory);
          } else {
            for (let i in categoryNum) {
              categoryNum[i].toString().includes(w) &&
                filteredCategory.push(categoryName[i]);
            }
          }
        } else {
          if (isNaN(w)) {
            filteredCategory = filteredCategory.filter((c) => {
              return c.includes(w);
            });
          } else {
            let newCategory = [];
            for (let i in categoryNum) {
              categoryNum[i].toString().includes(w) &&
                filteredCategory.includes(categoryName[i]) &&
                newCategory.push(categoryName[i]);
            }
            filteredCategory = newCategory;
          }
        }
      });
    } else {
      if (isNaN(input)) {
        filteredCategory = categoryName.filter((c) => {
          return c.includes(input);
        });
      } else {
        for (let i in categoryNum) {
          categoryNum[i].toString().includes(input) &&
            filteredCategory.push(categoryName[i]);
        }
      }
    }
    resolve(filteredCategory);
  });
}
