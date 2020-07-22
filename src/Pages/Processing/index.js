import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import htmlToImage from "html-to-image";
import styled from "styled-components";

class Processing extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount = () => {
    let node = document.getElementById("my-node");
    let width = document.getElementById("detailBox").clientWidth;
    console.log(width);
    htmlToImage
      .toPng(node)
      .then(function (dataUrl) {
        let img = new Image();
        img.src = dataUrl;
        img.style.width = `${width}px`;
        document.getElementById("detailBox").appendChild(img);
        console.log("first");
      })
      .then(() => {
        console.log("second");
        document.getElementById("detailHTML").style.display = "none";
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  render() {
    return (
      <ProcessingContainer>
        <WhichRow>
          총 <span>n</span>개 중 <span>n</span>번째 상품
        </WhichRow>
        <Original>
          <OrigData>
            <Title>
              (기존) 상품명 : <span></span>
            </Title>
            <Title>
              (기존) 카테고리 : <span></span>
            </Title>
            <Title>
              (기존) 원산지 : <span></span>
            </Title>
            <Title>
              (기존) 키워드 : <span></span>
            </Title>
          </OrigData>
          <Detail>
            <Title>상세페이지</Title>
            <DetailBox ref={(ref) => (this.detailBox = ref)}>
              <DetailImg id="detailBox" />
              <DetailHTML id="detailHTML">
                <div id="my-node">
                  <div>heloleooeoeoeo</div>
                  <div>heloleooeoeoeo</div>
                  <div>heloleooeoeoeo</div>
                  <div>heloleooeoeoeo</div>
                  <div>heloleooeoeoeo</div>
                  <div>heloleooeoeoeo</div>
                  <div>heloleooeoeoeo</div>
                  <div>heloleooeoeoeo</div>
                  <div>heloleooeoeoeo</div>
                  <div>heloleooeoeoeo</div>
                  <div>heloleooeoeoeo</div>
                  <div>heloleooeoeoeo</div>
                  <div>heloleooeoeoeo</div>
                  <div>heloleooeoeoeo</div>
                  <div>heloleooeoeoeo</div>
                  <div>heloleooeoeoeo</div>
                  <div>heloleooeoeoeo</div>
                  <div>heloleooeoeoeo</div>
                </div>
              </DetailHTML>
            </DetailBox>
          </Detail>
        </Original>
        <Modified>
          <Title>
            <div>(수정) 상품명 :</div>
            <ol>
              {Array(5)
                .fill()
                .map(() => {
                  return (
                    <li>
                      <input></input>
                    </li>
                  );
                })}
            </ol>
          </Title>
          <Title>
            <div>(수정) 키워드 :</div>
            <ol>
              {Array(5)
                .fill()
                .map(() => {
                  return <li></li>;
                })}
            </ol>
          </Title>
          <Title>
            <div>(수정) 카테고리 :</div>
            <input></input>
          </Title>
          <Title>
            <div>(수정) 원산지 :</div>
            <input></input>
          </Title>
          <ModComplete>개선 완료</ModComplete>
        </Modified>
      </ProcessingContainer>
    );
  }
}

export default withRouter(Processing);

const ProcessingContainer = styled.div`
  margin-bottom: 5vh;
  position: relative;
`;

const WhichRow = styled.h1`
  margin-top: 3vh;
  font-size: 34px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 7px;
  span {
    color: steelblue;
  }
`;

const Original = styled.div`
  background-color: white;
  margin-left: 10vw;
  width: 40%;
  padding-top: 5vh;
`;

const OrigData = styled.div`
  margin-bottom: 3vh;
  padding-left: 1vw;
`;

const Title = styled.div`
  margin-bottom: 15px;
  font-size: 20px;
  font-weight: 600;
  span {
    font-size: 12px;
    font-weight: normal;
  }
  input {
    margin-left: 1vw;
  }
`;

const Detail = styled.div`
  ${Title} {
    padding-left: 1vw;
  }
`;

const DetailBox = styled.div`
  border: 2px dashed rgba(70, 130, 180, 0.6);
  /* height: 800px; */
  position: relative;
`;

const DetailHTML = styled.div`
  /* position: absolute;
  top: 0; */
`;

const DetailImg = styled.div``;

const Modified = styled.div`
  position: fixed;
  right: 10vw;
  top: 23vh;
  border: 1px solid steelblue;
  background-color: white;
  padding: 4vh 4vw;
  margin-bottom: 100px;
  ${Title} {
    display: flex;
    font-size: 20px;
  }
`;

const ModComplete = styled.button`
  width: 100px;
  height: 50px;
  border-radius: 15px;
  margin: 5vh 0 0 30%;
  color: white;
  font-size: 20px;
  font-weight: 600;
  background-color: steelblue;
`;
