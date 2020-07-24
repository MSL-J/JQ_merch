import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import styled from "styled-components";

class Modified extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <AsideContainer>
        <AsideTitle>
          <div>(기존) 상품명 :</div>
          <span></span>
        </AsideTitle>
        <AsideTitle>
          <div>
            (수정) 상품명 :<button>상품명 추천</button>
          </div>
          <ol>
            {Array(5)
              .fill()
              .map(() => {
                return <li></li>;
              })}
          </ol>
        </AsideTitle>
        <AsideTitle>
          <div>
            (수정) 키워드 :<button>키워드 추천</button>
          </div>
          <textarea></textarea>
        </AsideTitle>
        <AsideTitle>
          <div>(수정) 카테고리 :</div>
          <input></input>
        </AsideTitle>
        <AsideTitle>
          <div>(수정) 원산지 :</div>
          <input></input>
        </AsideTitle>
        <Link to={`download`}>
          <ModComplete>개선 완료</ModComplete>
        </Link>
      </AsideContainer>
    );
  }
}

export default withRouter(Modified);

const AsideTitle = styled.div`
  display: flex;
  padding: 15px 0;
  border-bottom: 1px dashed gray;
  font-size: 15px;
  font-weight: 600;

  div:first-of-type {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40%;
    button {
      width: 70%;
      height: 30px;
      margin: auto 0;
    }
  }

  span {
    font-size: 12px;
    font-weight: normal;
  }
  input {
    margin-left: 1vw;
  }
  textarea {
    margin-left: 1vw;
    height: 80px;
  }
`;

const AsideContainer = styled.aside`
  position: fixed;
  right: 10vw;
  top: 23vh;
  width: 30%;
  border: 1px solid steelblue;
  background-color: white;
  padding: 2vh 3vw;
`;

const ModComplete = styled.button`
  width: 100px;
  height: 50px;
  border-radius: 15px;
  margin: 10px 35%;
  color: white;
  font-size: 20px;
  font-weight: 600;
  background-color: steelblue;
`;
