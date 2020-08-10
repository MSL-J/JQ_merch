import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import DropZone from "./components/dropZone";
import * as XLSX from "xlsx";
import Popup from "components/popup";
import localforage from "localforage";
import styled from "styled-components";

class Upload extends Component {
  constructor() {
    super();
    this.state = {
      dropActive: false,
      popup: false,
      category: null,
      row: "",
    };
  }

  componentDidMount = () => {
    fetch("Category.xlsx")
      .then((res) => res.arrayBuffer())
      .then((res) => {
        let file = XLSX.read(res, { type: "array" });
        const workbook = file.Sheets[file.SheetNames[0]];
        const category = XLSX.utils.sheet_to_json(workbook, { header: 1 });
        return category;
      })
      .then((category) => {
        this.setState({
          category,
        });
      });
  };

  active = (input) => {
    this.setState({
      [input]: !this.state[input],
    });
  };

  whichRow = (e) => {
    console.log(e.target.value);
    (!isNaN(Number(e.target.value)) &&
      Number(e.target.value) >= 1 &&
      e.target.value.slice(-1) !== " ") ||
    e.target.value === ""
      ? this.setState({
          row: e.target.value,
        })
      : alert("1 이상의 숫자를 입력해 주세요");
  };

  setRowNNext = async () => {
    await localforage.setItem("row", this.state.row ? this.state.row : 1);
    this.props.history.push("/processing");
  };

  render() {
    const { row, dropActive, popup } = this.state;
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
                <Popup closed={() => this.active("popup")} name="카테고리 검색">
                  <PopupWrapper>
                    <PopupTitle>저스트큐 카테고리</PopupTitle>
                    <input placeholder="ex)패션"></input>
                    <div></div>
                    <button></button>
                  </PopupWrapper>
                </Popup>
              )}
              <Link to={`/processing`}>
                <button>업로드 하기</button>
              </Link>
            </UploadMethod>
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

const PopupTitle = styled.div`
  display: flex;
  justify-content: center;
  background-color: snow;
  border-bottom: 1px solid black;
  font-weight: bold;
`;

const PopupWrapper = styled.div`
  height: 100%;
  background-color: white;
`;
