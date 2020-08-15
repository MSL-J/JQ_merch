import React from "react";
import { withRouter } from "react-router-dom";
import Popup from "components/Popup";
import styled from "styled-components";

class Modified extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      name: false,
      keyword: false,
      newNameInput: "",
      newName: [],
      newKeyword: "",
      newCategory: "",
      newOrigin: "",
    };
  }

  componentDidMount = () => {
    window.addEventListener("beforeunload", () => {
      this.close();
    });
    window.setInterval(() => {
      this.setState({
        counter: this.state.counter + 1,
      });
    }, 1000);
  };

  close = () => {
    this.setState({
      name: false,
    });
  };

  active = (popup) => {
    this.setState({
      [popup]: !this.state[popup],
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

  render() {
    const {
      name,
      keyword,
      newName,
      newKeyword,
      newCategory,
      newOrigin,
    } = this.state;
    const { ogName, ogCategory, ogOrigin, ogKeyword, onComplete } = this.props;
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
            <Popup closed={this.close} name="상품명 추천">
              <PopupWrapper>
                <PopupTitle>검색단어</PopupTitle>
                <InputField>
                  <input></input>
                  <button>검색</button>
                </InputField>
                <Related>
                  <Row>
                    <div>쇼핑연관</div>
                    <div></div>
                  </Row>
                  <Row>
                    <div>키워드 추천</div>
                    <div></div>
                  </Row>
                </Related>
                <PopupTitle>제목입력</PopupTitle>
                <InputField>
                  <div>
                    <input
                      ref={(ref) => (this.nameInput = ref)}
                      placeholder={ogName}
                      onChange={(e) => this.setNewNameInput(e)}
                    ></input>
                    <div>(상품명을 한개씩 입력해주세요)</div>
                  </div>
                  <button onClick={() => this.setNewName()}>입력</button>
                </InputField>
                <ButtonContainer>
                  <button onClick={() => this.close()}>닫기</button>
                </ButtonContainer>
              </PopupWrapper>
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
            <Popup closed={() => this.active("keyword")} name="키워드 추천">
              <div>키워드 추천</div>
            </Popup>
          )}
          <div>
            <textarea
              placeholder={ogKeyword}
              onChange={(e) => this.changeValue(e, "Keyword")}
            ></textarea>
          </div>
        </AsideTitle>
        <AsideTitle>
          <div>(수정) 카테고리 :</div>
          <input
            placeholder={ogCategory}
            onChange={(e) => this.changeValue(e, "Category")}
          ></input>
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
            onComplete({ newName, newKeyword, newCategory, newOrigin });
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
  padding: 1vh 3vw;
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
      width: 80px;
      min-height: 30px;
      margin-top: 10px;
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
    height: 80px;
    min-width: 180px;
  }
  ol {
    padding-left: 32px;
  }
`;

const PopupWrapper = styled.div`
  height: 100%;
  background-color: white;
`;

const PopupTitle = styled.div`
  display: flex;
  justify-content: center;
  background-color: snow;
  border-bottom: 1px solid black;
  font-weight: bold;
`;

const InputField = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 15px 0;
  border-bottom: 1px solid black;
  input {
    width: 70%;
    padding-left: 5px;
  }
  button {
    border: 1px solid black;
    border-radius: 5px;
    height: 23px;
  }
  div:first-of-type {
    display: flex;
    flex-direction: column;
    width: 70%;
    input {
      width: 100%;
    }
  }
`;

const Related = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid black;
`;

const Row = styled.div`
  display: flex;
  border-bottom: 0.5px solid black;
  font-size: 12px;
  font-weight: bold;
  &:first-of-type {
    border-top: 0.5px solid black;
  }
  div {
    padding: 7px;
    &:first-of-type {
      width: 100px;
      border-right: 0.5px solid black;
      text-align: center;
      background-color: snow;
    }
    &:last-of-type {
      text-align: left;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  button {
    border: 1px solid black;
    border-radius: 5px;
    background-color: snow;
    width: 70px;
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
