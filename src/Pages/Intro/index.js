import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

class Intro extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <IntroContainer>
        <LogoContainer>
          <img src="https://www.justq.co.kr/images/justq_logo_c.png" />
        </LogoContainer>
        <SepLine />
        <ProjDesc>
          Just Q에서 개발한 상품가공 시스템의 prototype입니다.
        </ProjDesc>
        <SignInUp>
          <button>로그인</button>
          <button>회원가입</button>
        </SignInUp>
      </IntroContainer>
    );
  }
}

export default withRouter(Intro);

const IntroContainer = styled.div`
  width: 60%;
  height: 60vh;
  margin: 10vh auto 0;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  background-color: white;
  border-radius: 25px;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SepLine = styled.div`
  width: 80%;
  height: 2px;
  border-bottom: 3px solid rgb(239, 239, 239);
  margin: 0 auto;
`;

const ProjDesc = styled.div`
  display: flex;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
`;

const SignInUp = styled.div`
  display: flex;
  justify-content: space-evenly;
  button {
    width: 200px;
    height: 50px;
    border-radius: 10px;
    font-size: 20px;
    color: steelblue;
  }
`;
