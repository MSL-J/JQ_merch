import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Modified from "./components/Modified";
import htmlToImage from "html-to-image";
import ReactCrop from "react-image-crop";
import localforage from "localforage";
import AWS from "aws-sdk";
import "react-image-crop/dist/ReactCrop.css";
import styled from "styled-components";

require("dotenv").config();

class Processing extends Component {
  constructor() {
    super();
    this.state = {
      column: {
        name: 5,
        category: 8,
        origin: 4,
        keyword: 42,
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
      nextItem: false,
      uploading: false,
    };
  }

  componentDidMount = async () => {
    const raw = await localforage.getItem("data");
    const row = await localforage.getItem("row");
    const data = raw[row];

    await this.setState(
      {
        raw,
        row,
        data,
      },
      () => {}
    );

    let newState = await this.state.data[33]
      .split(`src="`)
      .join(`src="https://cors-anywhere.herokuapp.com/`)
      .split(`src=h`)
      .join(`src=https://cors-anywhere.herokuapp.com/h`)
      .split("<img")
      .join("<img crossOrigin")
      .split("<IMG")
      .join("<IMG crossOrigin");

    let modNode = document.getElementById("my-node");
    modNode.innerHTML = await newState;

    var imgs = Array.from(modNode.getElementsByTagName("img")),
      len = imgs.length,
      counter = 0;

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

    var bucketName = "just-q-crop-img";
    var bucketRegion = "ap-northeast-2";
    var IdentityPoolId = "ap-northeast-2:9c0baf26-7771-4fd8-9f54-2791447042a7";

    AWS.config.update({
      region: bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId,
      }),
    });

    var s3 = new AWS.S3({
      apiVersion: "2006-03-01",
      params: {
        Bucket: bucketName,
      },
    });

    function createAlbum(albumName) {
      albumName = albumName.trim();
      albumName = albumName.replace("/", "");
      if (!albumName) {
        return alert(
          "Album names must contain at least one non-space character."
        );
      }
      if (albumName.indexOf("/") !== -1) {
        return alert("Album names cannot contain slashes.");
      }
      var albumKey = albumName + "/";
      s3.headObject(
        {
          Key: albumKey,
        },
        function (err, data) {
          if (!err) {
            return alert("Album already exists.");
          }
          if (err.code !== "NotFound") {
            return alert(
              "There was an error creating your album: " + err.message
            );
          }
          s3.putObject(
            {
              Key: albumKey,
            },
            function (err, data) {
              if (err) {
                return alert(
                  "There was an error creating your album: " + err.message
                );
              }
              alert("Successfully created album.");
            }
          );
        }
      );
    }
    createAlbum(this.state.data[this.state.column.name]);
  };

  html2Image = (modNode) => {
    htmlToImage
      .toPng(modNode)
      .then(function (dataUrl) {
        document
          .getElementById("detailBox")
          .getElementsByTagName("img")[0].src = dataUrl;
        return dataUrl;
      })
      .then((dataUrl) => {
        console.log("toIMG success!!");
        this.setState({
          ogDetailUrl: dataUrl,
          loading: false,
        });
        document.getElementById("detailHTML").style.display = "none";
        // console.log(this.state.ogDetailUrl);
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  onCropComplete = (crop) => {
    const { x, y, width, height } = crop;
    if (width) {
      this.makeClientCrop(crop);
      let cropCoord = `[[${x},${y}], [${x + width}, ${y}], [${x + width}, ${
        y + height
      }], [${x}, ${y + height}]]`;
      // console.log(this.state.croppedImageCoord);
      // console.log(cropCoord);
      let originalCoord = this.state.croppedImageCoord
        ? this.state.croppedImageCoord + ", "
        : "";
      this.setState(
        {
          croppedImageCoord: originalCoord + cropCoord,
        },
        () => {
          console.log(this.state.croppedImageCoord);
        }
      );
    }
  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(this.imageRef, crop);

      await this.setState(
        {
          croppedImageUrl: [...this.state.croppedImageUrl, croppedImageUrl],
        },
        () => {
          console.log(this.state.croppedImageUrl);
        }
      );
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
    console.log(newUrlArr, newCoordArr);
    this.setState(
      {
        croppedImageUrl: newUrlArr,
        croppedImageCoord: newCoordArr,
      },
      () => {
        console.log(this.state.croppedImageUrl, this.state.croppedImageCoord);
      }
    );
  };

  deleteAll = () => {
    this.setState(
      {
        croppedImageUrl: [],
        croppedImageCoord: [],
      },
      () => {
        console.log(this.state.croppedImageUrl, this.state.croppedImageCoord);
      }
    );
  };

  onComplete = async (mod) => {
    const {
      data,
      raw,
      row,
      ogDetailUrl,
      croppedImageUrl,
      croppedImageCoord,
    } = this.state;
    const { name, keyword, category, origin } = this.state.column;

    this.setState({
      uploading: true,
    });

    mod.newName.length && (await (data[name] = mod.newName.join()));
    mod.newKeyword && (await (data[keyword] = mod.newKeyword));
    mod.newCategory && (await (data[category] = mod.newCategory));
    mod.newOrigin && (await (data[origin] = mod.newOrigin));
    data.push(ogDetailUrl);

    var bucketName = "just-q-crop-img";
    var bucketRegion = "ap-northeast-2";
    var IdentityPoolId = "ap-northeast-2:9c0baf26-7771-4fd8-9f54-2791447042a7";

    AWS.config.update({
      region: bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId,
      }),
    });

    var s3 = new AWS.S3({
      apiVersion: "2006-03-01",
      params: {
        Bucket: bucketName,
      },
    });

    function dataURItoBlob(dataURI) {
      var binary = atob(dataURI.split(",")[1]);
      var array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], { type: "image/jpeg" });
    }

    function addPhoto(albumName, file, idx) {
      let fileData = dataURItoBlob(file);
      let fileName = idx + 1;
      let albumPhotosKey = albumName + "/";

      let photoKey = albumPhotosKey + fileName;
      let each = s3.upload(
        {
          Key: photoKey,
          ContentType: "image/jpeg",
          Body: fileData,
          ACL: "public-read",
        },
        function (err, data) {
          if (err) {
            console.log(err);
            return alert(
              "There was an error uploading your photo: ",
              err.message
            );
          }
          console.log("look", data.Location);
          return data.Location;
        }
      );
      let promiseEach = each.promise();
      return promiseEach;
    }

    const urls = await Promise.all(
      croppedImageUrl.map((file, idx, arr) => {
        return addPhoto(data[name], file, idx);
      })
    );

    let s3Url = [];
    urls.forEach((url) => {
      s3Url.push(url.Location);
    });

    s3Url.length && data.push(`${'"' + s3Url.join(`", "`) + '"'}`);
    croppedImageCoord && data.push(croppedImageCoord);
    raw[row] = data;
    localforage.setItem("data", raw, () => {
      this.setState(
        {
          uploading: false,
        },
        () => {
          this.props.history.push("/download");
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
      nextItem,
      uploading,
    } = this.state;

    return (
      <ProcessingContainer>
        {loading && (
          <Loading>
            <LogoContainer />
            <span>데이터를 불러오는 중입니다</span>
          </Loading>
        )}
        {uploading && (
          <Loading>
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
              (기존) 상품명 :<span>{data && data[5]}</span>
            </Title>
            <Title>
              (기존) 카테고리 : <span>{data && data[8]}</span>
            </Title>
            <Title>
              (기존) 원산지 : <span>{data && data[4]}</span>
            </Title>
            <Title>
              (기존) 키워드 : <span>{data && data[42]}</span>
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
                <div id="my-node"></div>
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
                        console.log(idx);
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
          ogCategory={data && data[column.category]}
          ogOrigin={data && data[column.origin]}
          ogKeyword={data && data[column.keyword]}
          onComplete={(mod) => this.onComplete(mod)}
          nextItem={nextItem}
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
  top: -15vh;
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
  /* height: 800px; */
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
