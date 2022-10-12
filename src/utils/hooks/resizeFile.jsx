import Resizer from "react-image-file-resizer";

export const resizeFile = (file, isprofile) =>
  new Promise((resolve) => {
    let pictureWidth = 1000
    let pictureHeight = 800  
    if (isprofile){ 
      pictureWidth = '150'
      pictureHeight = '150'
  }
  let pictureCompress = 80
  console.log(file.size)
  if(file.size <= 20000)
  pictureCompress = 100

  Resizer.imageFileResizer(
    file,
    pictureWidth,
    pictureHeight,
    "JPEG",
    pictureCompress,
    0,
    (uri) => {
      resolve(uri);
    },
    "file"
  );
});

