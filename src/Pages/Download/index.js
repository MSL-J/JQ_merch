import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { WhichRow } from "../Processing";
import * as XLSX from "xlsx";
import localforage from "localforage";
import styled from "styled-components";

class Download extends Component {
  constructor() {
    super();
    this.state = {
      raw: [],
      row: null,
    };
  }

  componentDidMount = async () => {
    const raw = await localforage.getItem("data");
    const row = await localforage.getItem("row");

    await this.setState({
      raw,
      row,
    });
  };

  nextRow = async () => {
    const { raw, row } = this.state;
    await localforage.setItem("data", raw);
    await localforage.setItem("row", row + 1, () => {
      this.props.history.push("/processing");
    });
    // re-setting item as the user might choose to download and/or sent2server but still want to continue
  };

  download = async () => {
    const { raw } = this.state;
    const workBook = await XLSX.utils.book_new(); // create a new blank book
    const workSheet = await XLSX.utils.json_to_sheet(raw, { skipHeader: true });
    await XLSX.utils.book_append_sheet(workBook, workSheet, "data"); // add the worksheet to the book
    await XLSX.writeFile(workBook, "[수정본] 데이터.xlsx"); // initiate a file download in browser
    await localforage.clear(); // delete locally saved data
  };

  send2Server = async () => {
    //api
    await localforage.clear(); // delete locally saved data
  };

  render() {
    const { raw, row } = this.state;
    return (
      <DownloadContainer>
        <WhichRow>
          <div>
            총<span>{raw.length}</span>개 중 <span>{row}</span>번째 상품
          </div>
          <div>작업 완료</div>
        </WhichRow>
        <ButtonContainer>
          <button
            onClick={() => {
              this.nextRow();
            }}
          >
            이어서 하기
          </button>
          <button
            onClick={() => {
              this.download();
            }}
          >
            그만하고 엑셀로 다운받기
          </button>
          <button
            onClick={() => {
              this.send2Server();
            }}
          >
            그만하고 저스트큐 서버로 보내기
          </button>
        </ButtonContainer>
      </DownloadContainer>
    );
  }
}

export default withRouter(Download);

const DownloadContainer = styled.div`
  width: 70%;
  margin: 5vh auto 0;
  padding: 5vh 0;
  background-color: white;
  border-radius: 25px;
  ${WhichRow} {
    height: 25%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    div {
      margin: 2vh 0;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3vh;
  button {
    width: 30vw;
    margin: 2vh 0;
    padding: 13px;
    background-color: rgba(70, 130, 180, 0.9);
    border-radius: 25px;
    font-size: 23px;
    font-weight: bold;
    color: white;
  }
`;
