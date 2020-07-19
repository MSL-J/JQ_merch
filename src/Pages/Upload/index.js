import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

class Upload extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <UploadContainer>
        <TitleContainer>작업할 상품 업로드</TitleContainer>
        <Choices>
          <SelectBox>
            <BoxTitle>액셀 (플레이오토 양식)</BoxTitle>
            <UploadMethod>
              <button>파일 선택하기</button>
              <button>업로드 하기</button>
            </UploadMethod>
          </SelectBox>
          <SelectBox>
            <BoxTitle>저스트큐 서버</BoxTitle>
            <UploadMethod>
              <button>카테고리 선택하기</button>
              <button>업로드 하기</button>
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
  height: 80vh;
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
  width: 50%;
  height: 60%;
  margin-top: 8vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SelectBox = styled.div`
  height: 40%;
  border: 1px solid black;
  border-radius: 10px;
`;

const BoxTitle = styled.div`
  height: 32px;
  border-bottom: 1px solid black;
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
  margin-top: 5%;
  button {
    height: 50px;
    width: 170px;
    border-radius: 10px;
    font-size: 20px;
    color: steelblue;
  }
`;
