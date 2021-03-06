import React from "react";
import { withRouter } from "react-router-dom";
import Popup from "components/Popup";
import {
  keywordsAPI,
  nameCrawlingApi,
  justQCategoryXLSX,
} from "../../../services/apiService";
import { categorySearch } from "services/categorySearchService";
import CategoryPopup from "components/CategoryPopup";
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
      this.close("category");
    });

    window.setInterval(() => {
      this.setState({
        counter: this.state.counter + 1,
      });
    }, 1000);

    justQCategoryXLSX().then((categoryList) => {
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
      ? nameCrawlingApi(findNameInput)
          .then((res) => {
            this.setState({
              foundRelName: res.rel,
              foundRecName: res.rec,
            });
          })
          .catch((err) => {
            console.log(err);
            alert("서버로부터 데이터를 불러오는데 실패하였습니다: ", err);
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
    categorySearch(categoryList, newCategoryInput).then((filteredCategory) => {
      this.setState({
        filteredCategory,
      });
    });
  };

  select = (c) => {
    this.setState({
      selectedCategory: c,
    });
  };

  setCategory = () => {
    this.setState(
      {
        newCategoryName: this.state.selectedCategory,
      },
      () => {
        this.close("category");
      }
    );
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
              close={() => this.close("category")}
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
