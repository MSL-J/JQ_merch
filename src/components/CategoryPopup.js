import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Popup from "components/Popup";
import "./categoryPopup.scss";

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
        <div className="categoryPopup">
          <div className="popupTitle">저스트큐 카테고리</div>
          <div className="searchBox">
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
          </div>
          <div className="resultBox">
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
          </div>
          <div className="buttonContainer">
            {selected ? <div>{selected}</div> : "카테고리를 선택해 주세요"}
            <button
              onClick={() => {
                setCategory();
              }}
            >
              불러오기
            </button>
          </div>
        </div>
      </Popup>
    );
  }
}

export default withRouter(CategoryPopup);
