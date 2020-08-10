import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import styled from "styled-components";

class Nav extends Component {
  render() {
    return (
      <NavContainer>
        <Link to={`/`}>
          <LogoContainer />
        </Link>
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
  background-color: rgb(42, 73, 97);
  color: white;
  span {
    font-size: 40px;
    font-weight: bolder;
  }
  a {
    position: absolute;
    left: 50px;
  }
`;

const LogoContainer = styled.div`
  width: 110px;
  height: 70px;
  background-image: url("https://justq.cafe24.com/wp-content/uploads/2020/07/logo_final_w-1.png");
  background-size: contain;
  background-repeat: no-repeat;
`;
