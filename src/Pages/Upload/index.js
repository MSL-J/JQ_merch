import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import DropZone from "./components/dropZone";
import * as XLSX from "xlsx";
import localforage from "localforage";
import CategoryPopup from "components/CategoryPopup";
import { categoryAPI } from "services/apiService";
import { repo } from "utils/production";
import styled from "styled-components";

class Upload extends Component {
  constructor() {
    super();
    this.state = {
      counter: 0,
      dropActive: false,
      popup: false,
      category: null,
      row: "",
      input: "",
      filteredCategory: [],
      selected: "",
      chosen: "",
    };
  }

  componentDidMount = () => {
    window.setInterval(() => {
      this.setState({
        counter: this.state.counter + 1,
      });
    }, 1000);

    fetch("Category.xlsx")
      .then((res) => res.arrayBuffer())
      .then((res) => {
        let file = XLSX.read(res, { type: "array" });
        const workbook = file.Sheets[file.SheetNames[0]];
        const category = XLSX.utils.sheet_to_json(workbook, { header: 1 });
        category.shift();
        return category;
      })
      .then((category) => {
        this.setState({
          category,
        });
      });
    window.addEventListener("beforeunload", () => {
      this.close();
    });
  };

  active = (input) => {
    this.setState({
      [input]: !this.state[input],
    });
  };

  close = () => {
    this.setState({
      popup: false,
    });
  };

  whichRow = (e) => {
    (!isNaN(Number(e.target.value)) &&
      Number(e.target.value) >= 1 &&
      e.target.value.slice(-1) !== " ") ||
    e.target.value === ""
      ? this.setState({
          row: Number(e.target.value),
        })
      : alert("1 이상의 숫자를 입력해 주세요");
  };

  findCategory = (e, search) => {
    this.setState(
      {
        input: e.target.value,
      },
      () => {
        search && this.search();
      }
    );
  };

  enterCategory = (e) => {
    e.key === "Enter" && this.findCategory(e, true);
  };

  search = () => {
    let { category, input } = this.state;
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

    this.setState({
      filteredCategory,
    });
  };

  select = (c) => {
    this.setState({
      selected: c,
    });
  };

  setCategory = () => {
    const { selected, category } = this.state;
    selected &&
      this.setState(
        {
          chosen: selected,
        },
        () => {
          categoryAPI(selected, category, this.close);
        }
      );
  };

  setRowNNext = async () => {
    let data = await localforage.getItem("data");
    data
      ? await localforage.setItem(
          "row",
          this.state.row ? this.state.row : 1,
          () => {
            this.props.history.push(`${repo}/processing`);
          }
        )
      : alert("파일을 먼저 업로드 해주세요");
  };

  render() {
    const {
      row,
      dropActive,
      popup,
      filteredCategory,
      selected,
      chosen,
    } = this.state;
    return (
      <UploadContainer>
        <TitleContainer>작업할 상품 업로드</TitleContainer>
        <Choices>
          <SelectBox>
            <BoxTitle>액셀 (플레이오토 양식)</BoxTitle>
            <UploadMethod>
              {dropActive ? (
                <DropZone />
              ) : (
                <button onClick={() => this.active("dropActive")}>
                  파일 선택하기
                </button>
              )}
              <button onClick={() => this.setRowNNext()}>업로드 하기</button>
            </UploadMethod>
            <input
              value={row}
              onChange={(e) => this.whichRow(e)}
              placeholder="시작하고 싶은 row를 입력해주세요. default: 1"
            ></input>
          </SelectBox>
          <SelectBox>
            <BoxTitle>저스트큐 서버</BoxTitle>
            <UploadMethod>
              <button onClick={() => this.active("popup")}>
                카테고리 선택하기
              </button>
              {popup && (
                <CategoryPopup
                  close={() => this.close()}
                  findCategory={(e) => this.findCategory(e)}
                  enterCategory={(e) => {
                    this.enterCategory(e);
                  }}
                  search={() => {
                    this.search();
                  }}
                  filteredCategory={filteredCategory}
                  select={(c) => {
                    this.select(c);
                  }}
                  selected={selected}
                  setCategory={() => {
                    this.setCategory();
                  }}
                />
              )}
              <button onClick={() => this.setRowNNext()}>업로드 하기</button>
            </UploadMethod>
            {chosen && <Chosen>{chosen}</Chosen>}
          </SelectBox>
        </Choices>
      </UploadContainer>
    );
  }
}

export default withRouter(Upload);

const UploadContainer = styled.div`
  width: 60%;
  margin: 5vh auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 25px;
`;

const TitleContainer = styled.div`
  margin: 5vh auto 0;
  font-size: 34px;
  font-weight: 600;
`;

const Choices = styled.div`
  width: 70%;
  margin-top: 8vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SelectBox = styled.div`
  border: 1px solid black;
  border-radius: 10px;
  margin-bottom: 10%;
  input {
    margin: 0 0 10px 20px;
    padding-left: 5px;
    width: 300px;
  }
`;

const BoxTitle = styled.div`
  height: 32px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding-left: 10px;
  background-color: steelblue;
  font-size: 20px;
  color: white;
`;

const UploadMethod = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 5% 0;
  button {
    height: 50px;
    width: 170px;
    border-radius: 10px;
    font-size: 20px;
    color: steelblue;
  }
`;

const Chosen = styled.div`
  margin: 0 0 10px 20px;
`;
