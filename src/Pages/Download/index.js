import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import styled from "styled-components";
import { WhichRow } from "../Processing";

class Download extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <DownloadContainer>
        <WhichRow>
          <div>
            총 <span>n</span>개 중 <span>n</span>번째 상품
          </div>
          <div>작업 완료</div>
        </WhichRow>
        <ButtonContainer>
          <Link to={`/processing`}>
            <button>이어서 하기</button>
          </Link>
          <button>그만하고 엑셀로 다운받기</button>
          <button>그만하고 저스트큐 서버로 보내기</button>
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
