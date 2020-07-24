import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

class Footer extends Component {
  render() {
    return (
      <FooterContainer>
        <span>Just Q 2020.</span>
      </FooterContainer>
    );
  }
}

export default withRouter(Footer);

const FooterContainer = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 5vh;
  padding: 0 3%;
  background-color: black;
  color: white;
  span {
    font-size: 15px;
  }
`;
