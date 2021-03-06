import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Modified from "./components/Modified";
import htmlToImage from "html-to-image";
import ReactCrop from "react-image-crop";
import localforage from "localforage";
import { repo } from "utils/production";
import { createS3Album, addImgs2S3 } from "services/cropNSaveService";
import "react-image-crop/dist/ReactCrop.css";
import styled from "styled-components";

class Processing extends Component {
  constructor() {
    super();
    this.state = {
      column: {
        origin: 4, //Excel column E
        name: 5, //Excel column F
        categoryCode: 8, //Excel column I
        keyword: 42, //Excel column AQ
        categoryName: 81, //Excel column CD
      },
      newColumn: {
        categoryCode: 82, //Excel column CE
        categoryName: 83, //Excel column CF
        keyword: 84, //Excel column CG
        name: 85, //Excel column CH ~ CL
        origin: 90, //Excel column CM
        orgDetailUrl: 91, //Excel column CN
        relCoord: 92, //Excel column CO
        croppedImg: 93, //Excel column CP ~ CY
      },
      loading: true,
      raw: null,
      row: null,
      data: null,
      ogDetailUrl: "",
      crop: {
        aspect: 1 / 1,
      },
      croppedImageUrl: [],
      croppedImageCoord: "",
      uploading: false,
    };
  }

  componentDidMount = async () => {
    const { column } = this.state;

    window.onscroll = () => {
      window.scrollTo(0, 0);
    };

    const raw = await localforage.getItem("data");
    const row = await localforage.getItem("row");
    const data = raw[row];
    await this.setState({
      raw,
      row,
      data,
    });

    let newState = await this.state.data[33]
      .split(`src="`)
      .join(`src="https://cors-anywhere.herokuapp.com/`)
      .split(`src=h`)
      .join(`src=https://cors-anywhere.herokuapp.com/h`)
      .split("<img")
      .join("<img crossOrigin")
      .split("<IMG")
      .join("<IMG crossOrigin");

    let modNode = this.rawHTML;
    modNode.innerHTML = await newState;

    let len = Array.from(modNode.getElementsByTagName("img")).length;
    let counter = 0;
    let incrementCounter = () => {
      counter++;
      if (counter === len) {
        this.html2Image(modNode);
      }
    };
    Array.from(modNode.getElementsByTagName("img")).forEach((img) => {
      if (img.complete) incrementCounter();
      else img.addEventListener("load", incrementCounter, false);
    });

    createS3Album(this.state.data[column.name]);
  };

  html2Image = (modNode) => {
    htmlToImage
      .toPng(modNode)
      .then((dataUrl) => {
        document
          .getElementById("detailBox")
          .getElementsByTagName("img")[0].src = dataUrl;
        this.setState({
          ogDetailUrl: dataUrl,
          loading: false,
        });
        window.onscroll = () => {};
        document.getElementById("detailHTML").style.display = "none";
      })
      .catch(function (error) {
        alert("상세페이지를 이미지로 변환하는데 문제가 생겼습니다: ", error);
      });
  };

  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  onCropComplete = (crop) => {
    const { croppedImageCoord, croppedImageUrl } = this.state;
    const { x, y, width, height } = crop;
    if (width) {
      if (croppedImageUrl.length >= 10)
        alert("이미지 크롭은 10개까지 가능합니다");
      else {
        this.makeClientCrop(crop);
        let cropCoord = `[[${x},${y}], [${x + width}, ${y}], [${x + width}, ${
          y + height
        }], [${x}, ${y + height}]]`;
        /* [[],[],[],[]] 
        each arr represents each corner of the newly cropped image, starting from top left, rotating clock-wise
        each arr has x and y coordinates relative to the top left corner of the whole detail image. */

        let originalCoord = croppedImageCoord ? croppedImageCoord + ", " : "";
        this.setState({
          croppedImageCoord: originalCoord + cropCoord,
        });
      }
    }
  };

  onCropChange = (crop) => {
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(this.imageRef, crop);
      this.setState({
        croppedImageUrl: [...this.state.croppedImageUrl, croppedImageUrl],
      });
    }
  }

  async getCroppedImg(image, crop) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d");
    await ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      1000,
      1000
    );
    return canvas.toDataURL("image/jpeg");
  }

  deleteCropped = (idx) => {
    let newUrlArr = [...this.state.croppedImageUrl];
    let newCoordArr = [...this.state.croppedImageCoord];
    newUrlArr.splice(idx, 1);
    newCoordArr.splice(idx, 1);
    this.setState({
      croppedImageUrl: newUrlArr,
      croppedImageCoord: newCoordArr,
    });
  };

  deleteAll = () => {
    this.setState({
      croppedImageUrl: [],
      croppedImageCoord: [],
    });
  };

  onComplete = async (mod) => {
    const {
      data,
      raw,
      row,
      ogDetailUrl,
      croppedImageUrl,
      croppedImageCoord,
      column,
    } = this.state;
    const {
      categoryCode,
      categoryName,
      keyword,
      name,
      origin,
      orgDetailUrl,
      relCoord,
      croppedImg,
    } = this.state.newColumn;

    this.setState({
      uploading: true,
    });

    let y = Number(window.scrollY);
    window.onscroll = () => {
      window.scrollTo(0, y);
    };

    mod.newCategoryCode && (data[categoryCode] = mod.newCategoryCode);
    mod.newCategoryName && (data[categoryName] = mod.newCategoryName);
    mod.newSetKeywords.length && (data[keyword] = mod.newSetKeyword);
    mod.newName.length &&
      (await mod.newName.forEach((el, idx) => {
        data[name + idx] = el;
      }));
    mod.newOrigin && (data[origin] = mod.newOrigin);
    data[orgDetailUrl] = ogDetailUrl;
    croppedImageCoord && (data[relCoord] = croppedImageCoord);

    await addImgs2S3(croppedImageUrl, data, column.name, croppedImg).then(
      (modifiedData) => {
        raw[row] = modifiedData;
      }
    );

    localforage.setItem("data", raw, () => {
      this.setState(
        {
          uploading: false,
        },
        () => {
          this.props.history.push(`${repo}/download`);
        }
      );
    });
  };

  render() {
    const {
      column,
      loading,
      raw,
      row,
      data,
      crop,
      croppedImageUrl,
      uploading,
    } = this.state;

    return (
      <ProcessingContainer>
        {loading && (
          <Loading scrollY={window.scrollY - 150 + `px`}>
            <LogoContainer />
            <span>데이터를 불러오는 중입니다</span>
          </Loading>
        )}
        {uploading && (
          <Loading scrollY={window.scrollY - 150 + `px`}>
            <LogoContainer />
            <span>데이터를 저장하는 중입니다</span>
          </Loading>
        )}
        <WhichRow>
          총 <span>{raw && raw.length}</span>개 중 <span>{row && row}</span>
          번째 상품
        </WhichRow>
        <Original>
          <OrigData>
            <Title>
              (기존) 상품명 :<span>{data && data[column.name]}</span>
            </Title>
            <Title>
              (기존) 카테고리 코드 :
              <span>{data && data[column.categoryCode]}</span>
            </Title>
            <Title>
              (기존) 카테고리명 :
              <span>{data && data[column.categoryName]}</span>
            </Title>
            <Title>
              (기존) 원산지 : <span>{data && data[column.origin]}</span>
            </Title>
            <Title>
              (기존) 키워드 : <span>{data && data[column.keyword]}</span>
            </Title>
          </OrigData>
          <Detail>
            <Title>
              상세페이지
              <span>
                (드래그 하여 스캔하세요. 스캔된 이미지는 하단에 있습니다.)
              </span>
            </Title>
            <DetailBox>
              <DetailImg id="detailBox">
                <ReactCrop
                  crop={crop}
                  ruleOfThirds
                  onImageLoaded={this.onImageLoaded}
                  onComplete={this.onCropComplete}
                  onChange={this.onCropChange}
                />
              </DetailImg>
              <DetailHTML id="detailHTML">
                <div ref={(ref) => (this.rawHTML = ref)}></div>
              </DetailHTML>
            </DetailBox>
            <ScannedImg>
              <Title>
                <div>스캔된 이미지 (클릭시 삭제)</div>
                <button onClick={() => this.deleteAll()}>모두 삭제</button>
              </Title>
              {croppedImageUrl &&
                croppedImageUrl.map((cropped, idx) => {
                  return (
                    <img
                      alt="Crop"
                      src={cropped}
                      onClick={() => {
                        this.deleteCropped(idx);
                      }}
                    />
                  );
                })}
            </ScannedImg>
          </Detail>
        </Original>
        <Modified
          ogName={data && data[column.name]}
          ogCategoryCode={data && data[column.categoryCode]}
          ogCategoryName={data && data[column.categoryName]}
          ogOrigin={data && data[column.origin]}
          ogKeyword={data && data[column.keyword]}
          onComplete={(mod) => this.onComplete(mod)}
        />
      </ProcessingContainer>
    );
  }
}

export default withRouter(Processing);

const ProcessingContainer = styled.div`
  padding-bottom: 5vh;
  position: relative;
`;

const Loading = styled.div`
  position: absolute;
  top: ${(props) => props.scrollY};
  width: 100vw;
  height: 115vh;
  background-color: lightsteelblue;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span {
    font-size: xx-large;
  }

  @keyframes slidein {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  animation: slidein 2s linear 0s infinite alternate;
`;

const LogoContainer = styled.div`
  width: 350px;
  height: 200px;
  background-image: url("https://justq.cafe24.com/wp-content/uploads/2020/07/logo_final_w-1.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

export const WhichRow = styled.h1`
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
  margin-bottom: 5vh;
  width: 40%;
  padding-top: 3vh;
`;

const OrigData = styled.div`
  margin-bottom: 5vh;
`;

const Title = styled.div`
  margin-bottom: 15px;
  padding: 0 1vw;
  font-size: 20px;
  font-weight: 600;
  span {
    font-size: 15px;
    font-weight: normal;
    margin-left: 5px;
  }
  input {
    margin-left: 1vw;
  }
`;

const Detail = styled.div`
  padding-bottom: 1vh;
`;

const DetailBox = styled.div`
  border: 2px dashed rgba(70, 130, 180, 0.6);
  position: relative;
  img {
    width: 100%;
  }
`;

const DetailHTML = styled.div`
  img {
    width: 100%;
  }
`;

const DetailImg = styled.div``;

const ScannedImg = styled.div`
  ${Title} {
    margin: 2vh 0;
    display: flex;
    justify-content: space-between;
    button {
      width: 100px;
      background-color: #ff6161;
      border-radius: 5px;
      color: white;
    }
  }

  img {
    border: 1px solid black;
    max-width: 150px;
  }
`;
