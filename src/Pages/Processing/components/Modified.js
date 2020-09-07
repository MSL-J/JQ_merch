import React from "react";
import { withRouter } from "react-router-dom";
import Popup from "components/Popup";
import * as XLSX from "xlsx";
import { keywordsAPI } from "../../../services/apiService";
import CategoryPopup from "components/CategoryPopup";
import { crawlingAPI } from "utils/api";
import "./namePopup.scss";
import "./keywordPopup.scss";
import styled from "styled-components";

class Modified extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      categoryList: {},
      name: false,
      keyword: false,
      category: false,
      findNameInput: "",
      foundRelName: [],
      foundRecName: [],
      newNameInput: "",
      newName: [],
      newCategoryCode: null,
      newCategoryInput: "",
      filteredCategory: [],
      selectedCategory: "",
      newCategoryName: "",
      newOrigin: "",
      fetchedKeywords: [],
      chosenKeywords: [],
      newSetKeywords: [],
    };
  }

  componentDidMount = () => {
    window.addEventListener("beforeunload", () => {
      this.close("name");
      this.close("keyword");
    });

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
        const categoryList = XLSX.utils.sheet_to_json(workbook, { header: 1 });
        categoryList.shift();
        return categoryList;
      })
      .then((categoryList) => {
        this.setState({
          categoryList,
        });
      });
  };

  close = (popup) => {
    this.setState({
      [popup]: false,
    });
  };

  active = (popup) => {
    const { newSetKeywords } = this.state;
    const { ogKeyword } = this.props;
    this.setState({
      [popup]: true,
    });
    popup === "keyword" && !newSetKeywords.length
      ? keywordsAPI(ogKeyword).then((res) => {
          this.setState({
            fetchedKeywords: res,
            chosenKeywords: newSetKeywords,
          });
        })
      : this.setState({
          chosenKeywords: newSetKeywords,
        });
  };

  changeValue = (e, which) => {
    this.setState({
      [`new${which}`]: e.target.value,
    });
  };

  setNewNameInput = (e) => {
    this.setState({
      newNameInput: e.target.value,
    });
  };

  setNewName = () => {
    const { newName, newNameInput } = this.state;
    newNameInput && newName.length < 5
      ? this.setState({
          newName: [...newName, newNameInput],
          newNameInput: "",
        })
      : alert("수정 상품명은 최대 5개까지 가능합니다");
    this.nameInput.value = "";
  };

  findNameInput = (e) => {
    this.setState({
      findNameInput: e.target.value,
    });
  };

  enterFindNewName = (e) => {
    e.key === "Enter" && this.findNewName();
  };

  findNewName = () => {
    const { findNameInput } = this.state;
    findNameInput
      ? fetch(`${crawlingAPI}getNaverName?searchWord=${findNameInput.trim()}`, {
          method: "GET",
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            return res.json();
          })
          .then((res) => {
            this.setState({
              foundRelName: res.rel,
            });
            this.setState({
              foundRecName: res.rec,
            });
          })
          .catch((err) => {
            console.log(err);
          })
      : alert("검색단어를 입력해주세요");
  };

  chooseKeywords = (keyword) => {
    let { chosenKeywords } = this.state;
    chosenKeywords.includes(keyword)
      ? chosenKeywords.splice(chosenKeywords.indexOf(keyword), 1)
      : (chosenKeywords = [...chosenKeywords, keyword]);
    this.setState({
      chosenKeywords,
    });
  };

  setNewKeywords = () => {
    const { chosenKeywords } = this.state;
    this.setState(
      {
        newSetKeywords: chosenKeywords,
      },
      () => {
        this.close("keyword");
      }
    );
  };

  findCategory = (e, search) => {
    this.setState(
      {
        newCategoryInput: e.target.value,
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
    let { categoryList, newCategoryInput } = this.state;
    let categoryName = [];
    let categoryNum = [];
    for (let i in categoryList) {
      categoryName.push(categoryList[i][0]);
      categoryNum.push(categoryList[i][1]);
    }

    newCategoryInput = newCategoryInput.trim();
    let filteredCategory = [];
    if (newCategoryInput.includes("+")) {
      //'+' works as 'or'
      let eachInput = newCategoryInput.split("+");
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
    } else if (newCategoryInput.includes("&")) {
      // '&' works as 'and'
      let eachInput = newCategoryInput.split("&");
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
      if (isNaN(newCategoryInput)) {
        filteredCategory = categoryName.filter((c) => {
          return c.includes(newCategoryInput);
        });
      } else {
        for (let i in categoryNum) {
          categoryNum[i].toString().includes(newCategoryInput) &&
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
      selectedCategory: c,
    });
  };

  setCategory = () => {
    this.close("category");

    this.setState({
      newCategoryName: this.state.selectedCategory,
    });
    // here is where you fetch data of the chosen category, as a callback of the setState above
  };

  render() {
    const {
      name,
      keyword,
      category,
      newName,
      foundRelName,
      foundRecName,
      newCategoryCode,
      filteredCategory,
      selectedCategory,
      newCategoryName,
      newOrigin,
      fetchedKeywords,
      chosenKeywords,
      newSetKeywords,
    } = this.state;
    const {
      ogName,
      ogCategoryCode,
      ogCategoryName,
      ogOrigin,
      ogKeyword,
      onComplete,
    } = this.props;
    return (
      <AsideContainer>
        <AsideTitle>
          <div>(기존) 상품명 :</div>
          <span>{ogName}</span>
        </AsideTitle>
        <AsideTitle>
          <div>
            (수정) 상품명 :
            <button
              onClick={() => {
                this.active("name");
              }}
            >
              상품명 추천
            </button>
          </div>

          {name && (
            <Popup closed={() => this.close("name")} name="상품명 추천">
              <div className="nameNKeywordPopup">
                <div className="popupTitle">검색단어</div>
                <div className="inputField">
                  <input
                    onChange={(e) => this.findNameInput(e)}
                    onKeyUp={(e) => this.enterFindNewName(e)}
                    placeholder="검색 단어를 한개씩 입력해주세요"
                  ></input>
                  <button onClick={() => this.findNewName()}>검색</button>
                </div>
                <div className="related">
                  <div className="row">
                    <div>쇼핑연관</div>
                    <div>
                      {foundRelName.length
                        ? foundRelName.join(", ")
                        : "쇼핑연관 단어가 없습니다"}
                    </div>
                  </div>
                  <div className="row">
                    <div>키워드 추천</div>
                    <div>
                      {foundRecName.length
                        ? foundRecName.join(", ")
                        : "추천 키워드가 없습니다"}
                    </div>
                  </div>
                </div>
                <div className="popupTitle">제목입력</div>
                <div className="inputField">
                  <div>
                    <input
                      ref={(ref) => (this.nameInput = ref)}
                      placeholder={ogName}
                      onChange={(e) => this.setNewNameInput(e)}
                    ></input>
                    <div>(상품명을 한개씩 입력해주세요)</div>
                  </div>
                  <button onClick={() => this.setNewName()}>입력</button>
                </div>
                <div className="buttonContainer">
                  <button onClick={() => this.close("name")}>닫기</button>
                </div>
              </div>
            </Popup>
          )}
          {newName.length ? (
            <ol>
              {newName.map((name) => {
                return <li>{name}</li>;
              })}
            </ol>
          ) : (
            <span> 상품명 추천에서 추가하세요</span>
          )}
        </AsideTitle>
        <AsideTitle>
          <div>
            (수정) 키워드 :
            <button
              onClick={() => {
                this.active("keyword");
              }}
            >
              키워드 추천
            </button>
          </div>
          {keyword && (
            <Popup closed={() => this.close("keyword")} name="키워드 추천">
              <div className="nameNKeywordPopup">
                <div className="popupTitle">
                  키워드 추천 (타 브랜드/효과/효능/과장 단어 주의)
                </div>
                <div className="tableRow">
                  <div className="popupTitle">키워드</div>
                  <div className="popupTitle">모바일 월 평균 클릭 수</div>
                  <div className="popupTitle">PC 월 평균 클릭 수</div>
                </div>
                <div className="keywordList">
                  {fetchedKeywords.length ? (
                    fetchedKeywords.map((keyword, idx) => {
                      return (
                        <div className="tableRow">
                          <div>
                            <input
                              type="checkbox"
                              checked={chosenKeywords.includes(
                                keyword.relKeyword
                              )}
                              onChange={() =>
                                this.chooseKeywords(keyword.relKeyword)
                              }
                            ></input>
                            {keyword.relKeyword}
                          </div>
                          <div>{keyword.monthlyAveMobileClkCnt}</div>
                          <div>{keyword.monthlyAvePcClkCnt}</div>
                        </div>
                      );
                    })
                  ) : (
                    <span>추천 키워드를 받아오고 있습니다.</span>
                  )}
                </div>
                <div className="chosen">
                  <div className="chosenKeywords">
                    <div>선택한 키워드</div>
                    <div>{chosenKeywords.join(", ")}</div>
                  </div>
                  <div className="chosenButtons">
                    <button onClick={() => this.setNewKeywords()}>입력</button>
                    <button onClick={() => this.close("keyword")}>닫기</button>
                  </div>
                </div>
              </div>
            </Popup>
          )}
          <div>
            <textarea
              placeholder={ogKeyword}
              onChange={(e) => this.changeValue(e, "SetKeywords")}
              value={newSetKeywords}
            ></textarea>
          </div>
        </AsideTitle>
        <AsideTitle>
          <div>(수정) 카테고리 코드 :</div>
          <input
            placeholder={ogCategoryCode}
            onChange={(e) => this.changeValue(e, "CategoryCode")}
          ></input>
        </AsideTitle>
        <AsideTitle>
          <div>
            (수정) 카테고리명 :
            <button
              onClick={() => {
                this.active("category");
              }}
            >
              카테고리 검색
            </button>
          </div>
          {category && (
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
              selected={selectedCategory}
              setCategory={() => {
                this.setCategory();
              }}
            />
          )}
          <textarea
            placeholder={ogCategoryName}
            onChange={(e) => this.changeValue(e, "CategoryName")}
            value={newCategoryName}
          ></textarea>
        </AsideTitle>
        <AsideTitle>
          <div>(수정) 원산지 :</div>
          <input
            placeholder={ogOrigin}
            onChange={(e) => this.changeValue(e, "Origin")}
          ></input>
        </AsideTitle>
        <ModComplete
          onClick={() => {
            onComplete({
              newName,
              newSetKeywords,
              newCategoryCode,
              newCategoryName,
              newOrigin,
            });
          }}
        >
          개선 완료
        </ModComplete>
      </AsideContainer>
    );
  }
}

export default withRouter(Modified);

const AsideContainer = styled.aside`
  position: fixed;
  right: 10vw;
  top: 23vh;
  width: 33%;
  border: 1px solid steelblue;
  background-color: white;
  padding: 1vh 3vw 0;
`;

const AsideTitle = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px dashed gray;
  font-size: 15px;
  font-weight: 600;

  div:first-of-type {
    display: flex;
    flex-direction: column;
    width: 40%;
    button {
      width: 100px;
      min-height: 30px;
      margin-top: 10px;
      border-radius: 5px;
    }
  }
  div:nth-of-type(2) {
    display: flex;
    max-width: 250px;
  }
  span {
    font-size: 12px;
    font-weight: normal;
    margin-left: 1vw;
  }
  input {
    margin-left: 1vw;
  }
  textarea {
    margin-left: 1vw;
    height: 50px;
    min-width: 170px;
  }
  ol {
    padding-left: 32px;
  }
`;

// const PopupWrapper = styled.div`
//   height: 100%;
//   background-color: white;
// `;

// const PopupTitle = styled.div`
//   display: flex;
//   justify-content: center;
//   background-color: snow;
//   border-bottom: 1px solid black;
//   font-weight: bold;
// `;

// const InputField = styled.div`
//   display: flex;
//   justify-content: space-evenly;
//   padding: 15px 0;
//   border-bottom: 1px solid black;
//   input {
//     width: 70%;
//     padding-left: 5px;
//   }
//   button {
//     border: 1px solid black;
//     border-radius: 5px;
//     height: 23px;
//   }
//   div:first-of-type {
//     display: flex;
//     flex-direction: column;
//     width: 70%;
//     input {
//       width: 100%;
//     }
//   }
// `;

// const Related = styled.div`
//   padding: 20px 0;
//   border-bottom: 1px solid black;
// `;

// const Row = styled.div`
//   display: flex;
//   border-bottom: 0.5px solid black;
//   font-size: 15px;
//   &:first-of-type {
//     border-top: 0.5px solid black;
//   }
//   div {
//     padding: 7px;
//     &:first-of-type {
//       min-width: 100px;
//       border-right: 0.5px solid black;
//       background-color: snow;
//       text-align: center;
//       font-weight: bold;
//     }
//     &:last-of-type {
//       text-align: left;
//     }
//   }
// `;

// const ButtonContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   margin-top: 30px;
//   button {
//     border: 1px solid black;
//     border-radius: 5px;
//     background-color: snow;
//     width: 70px;
//   }
// `;

// const TableRow = styled.div`
//   display: flex;
//   div {
//     display: flex;
//     flex: 1;
//     justify-content: center;
//     align-items: center;
//     background-color: white;
//     border-bottom: 1px solid black;
//     padding: 2px 0;
//     &:first-of-type {
//       flex: 2;
//     }
//     input {
//       margin: 0 40px 0 10px;
//     }
//   }
//   ${PopupTitle} {
//     font-size: 12px;
//     background-color: snow;
//     justify-content: center;
//   }
// `;

// const KeywordList = styled.div`
//   height: 300px;
//   border-bottom: 1px solid black;
//   overflow-y: auto;
//   ${TableRow} {
//     div:first-of-type {
//       justify-content: left;
//     }
//   }
//   span {
//     margin: 15px 15px;
//     @keyframes slidein {
//       from {
//         opacity: 1;
//       }
//       to {
//         opacity: 0;
//       }
//     }
//     animation: slidein 1s linear 0s infinite alternate;
//   }
// `;

// const Chosen = styled.div`
//   display: flex;
//   justify-content: space-between;
// `;

// const ChosenKeywords = styled.div`
//   max-width: 75%;
//   div:first-of-type {
//     font-weight: bold;
//   }
//   div:nth-of-type(2) {
//     font-size: 12px;
//   }
// `;

// const ChosenButtons = styled.div`
//   margin: 15px 15px 0 0;
//   button {
//     border: 1px solid black;
//     border-radius: 5px;
//     background-color: snow;
//     width: 50px;
//     &:first-of-type {
//       margin-right: 10px;
//     }
//   }
// `;

const ModComplete = styled.button`
  width: 100px;
  height: 50px;
  border-radius: 15px;
  margin: 10px 35%;
  color: white;
  font-size: 20px;
  font-weight: 600;
  background-color: steelblue;
`;
