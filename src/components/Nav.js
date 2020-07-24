import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

class Nav extends Component {
  render() {
    return (
      <NavContainer>
        <LogoContainer />
        <span>상품가공 프로젝트</span>
      </NavContainer>
    );
  }
}

export default withRouter(Nav);

const NavContainer = styled.div`
  height: 10vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(0, 118, 163);
  color: white;
  span {
    font-size: 40px;
    font-weight: bolder;
  }
`;

const LogoContainer = styled.div`
  width: 150px;
  height: 45px;
  background-image: url("https://www.justq.co.kr/images/justq_logo_w.png");
  background-size: contain;
  position: absolute;
  left: 50px;
`;
