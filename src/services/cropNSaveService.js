import AWS from "aws-sdk";

export const bucketName = "just-q-crop-img";
export const bucketRegion = "ap-northeast-2";
export const IdentityPoolId =
  "ap-northeast-2:9c0baf26-7771-4fd8-9f54-2791447042a7";

export function createS3Album(name) {
  AWS.config.update({
    region: bucketRegion,
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: IdentityPoolId,
    }),
  });

  let s3 = new AWS.S3({
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
    let albumKey = albumName + "/";
    s3.headObject(
      {
        Key: albumKey,
      },
      function (err, data) {
        if (!err) {
          return alert("S3에 같은 상품명으로 이미 생성된 폴더가 존재합니다.");
        }
        if (err.code !== "NotFound") {
          return alert(
            "S3에서 폴더를 생성하는데 문제가 생겼습니다: " + err.message
          );
        }
        s3.putObject(
          {
            Key: albumKey,
          },
          function (err, data) {
            if (err) {
              return alert(
                "S3에서 폴더를 생성하는데 문제가 생겼습니다: " + err.message
              );
            }
            alert("성공적으로 S3에 폴더를 생성했습니다");
          }
        );
      }
    );
  }
  return createAlbum(name);
}

function dataURItoBlob(dataURI) {
  let binary = atob(dataURI.split(",")[1]);
  let array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: "image/jpeg" });
}

export function addPhoto2S3(albumName, file, idx) {
  let fileData = dataURItoBlob(file);
  let fileName = idx + 1;
  let albumPhotosKey = albumName + "/";
  let photoKey = albumPhotosKey + fileName;
  let s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    params: {
      Bucket: bucketName,
    },
  });
  let each = s3.upload(
    {
      Key: photoKey,
      ContentType: "image/jpeg",
      Body: fileData,
      ACL: "public-read",
    },
    function (err, data) {
      if (err) {
        return alert(
          "S3에 이미지를 업로드 하는데 문제가 생겼습니다: ",
          err.message
        );
      }
      return data.Location;
    }
  );
  let promiseEach = each.promise();
  return promiseEach;
}

export function addImgs2S3(imgUrl, data, name, img) {
  return new Promise(async (resolve, reject) => {
    let s3Url = [];
    const urls = await Promise.all(
      imgUrl.map((file, idx) => {
        return addPhoto2S3(data[name], file, idx);
      })
    );
    urls.forEach((url) => {
      s3Url.push(url.Location);
    });
    s3Url.length &&
      s3Url.forEach((el, idx) => {
        data[img + idx] = `${'"' + el + '"'}`;
      });
    resolve(data);
  });
}
