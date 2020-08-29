import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Popup from "components/Popup";
import styled from "styled-components";

class CategoryPopup extends Component {
  render() {
    const {
      close,
      findCategory,
      enterCategory,
      search,
      filteredCategory,
      select,
      selected,
      setCategory,
    } = this.props;
    return (
      <Popup closed={() => close()} name="카테고리 검색">
        <PopupWrapper>
          <PopupTitle>저스트큐 카테고리</PopupTitle>
          <SearchBox>
            <span>
              {`카테고리명이나 카테고리 코드로 검색 가능합니다. (교차검색 가능, & = 'and', + = 'or')`}
            </span>
            <input
              placeholder="ex) 패션 + 77906"
              onChange={(e) => {
                findCategory(e);
              }}
              onKeyUp={(e) => {
                enterCategory(e);
              }}
            ></input>
            <button
              onClick={() => {
                search();
              }}
            >
              검색
            </button>
          </SearchBox>
          <ResultBox>
            {filteredCategory.length ? (
              filteredCategory.map((c) => {
                return (
                  <div
                    onClick={() => {
                      select(c);
                    }}
                  >
                    {c}
                  </div>
                );
              })
            ) : (
              <p> 검색값을 입력해주세요</p>
            )}
          </ResultBox>
          <ButtonContainer>
            {selected ? <div>{selected}</div> : "카테고리를 선택해 주세요"}
            <button
              onClick={() => {
                setCategory();
              }}
            >
              불러오기
            </button>
          </ButtonContainer>
        </PopupWrapper>
      </Popup>
    );
  }
}

export default withRouter(CategoryPopup);

const PopupWrapper = styled.div`
  height: 100%;
  background-color: white;
  button {
    border: solid 1px lightgrey;
  }
`;

const PopupTitle = styled.div`
  display: flex;
  justify-content: center;
  background-color: snow;
  border-bottom: 1px solid black;
  font-weight: bold;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  margin: 10px 40px 20px;
  border-bottom: solid 1px lightgrey;
  span {
    font-size: 12px;
    margin-right: 10px;
  }
  input {
    width: 120px;
    margin-right: 10px;
    padding-left: 5px;
  }
  button {
    min-width: 50px;
  }
`;

const ResultBox = styled.div`
  margin: 20px auto;
  overflow: auto;
  width: 500px;
  height: 200px;
  background-color: snow;
  border: 1px solid lightgrey;
  div {
    cursor: pointer;
    border-bottom: 1px solid lightgrey;
    padding: 3px 0 3px 3px;
  }
  p {
    margin: 5px 0 0 3px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 20px 30px;
  padding-top: 10px;
  border-top: solid 1px lightgrey;
  button {
    margin-left: 20px;
    min-width: 80px;
  }
`;
