import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { WhichRow } from "../Processing";
import * as XLSX from "xlsx";
import localforage from "localforage";
import { send2ServerAPI } from "services/apiService";
import { repo } from "utils/production";
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

    //Headers for newly added columns:
    raw[0][81] = "기존카테고리명";
    raw[0][82] = "신규카테고리코드 ";
    raw[0][83] = "신규카테고리명";
    raw[0][84] = "신규키워드";
    raw[0][85] = "신규상품명1";
    raw[0][86] = "신규상품명2";
    raw[0][87] = "신규상품명3";
    raw[0][88] = "신규상품명4";
    raw[0][89] = "신규상품명5";
    raw[0][90] = "신규원산지";
    raw[0][91] = "(URL)상세이미지";
    raw[0][92] = "추출한_이미지들의_상대좌표들";
    raw[0][93] = "(URL)추출한_이미지1";
    raw[0][94] = "(URL)추출한_이미지2";
    raw[0][95] = "(URL)추출한_이미지3";
    raw[0][96] = "(URL)추출한_이미지4";
    raw[0][97] = "(URL)추출한_이미지5";
    raw[0][98] = "(URL)추출한_이미지6";
    raw[0][99] = "(URL)추출한_이미지7";
    raw[0][100] = "(URL)추출한_이미지8";
    raw[0][101] = "(URL)추출한_이미지9";
    raw[0][102] = "(URL)추출한_이미지10";

    await this.setState({
      raw,
      row,
    });
  };

  nextRow = async () => {
    const { raw, row } = this.state;
    await localforage.setItem("data", raw);
    await localforage.setItem("row", row + 1, () => {
      this.props.history.push(`${repo}/processing`);
    });
    // re-setting item as the user might choose to download and/or sent2server but still want to continue
  };

  download = async () => {
    const { raw } = this.state;
    const workBook = XLSX.utils.book_new(); // create a new blank book
    const workSheet = XLSX.utils.json_to_sheet(raw, { skipHeader: true });
    await XLSX.utils.book_append_sheet(workBook, workSheet, "data"); // add the worksheet to the book
    await XLSX.writeFile(workBook, "[수정본] 데이터.xlsx"); // initiate a file download in browser
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
              send2ServerAPI();
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
