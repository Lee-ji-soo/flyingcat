import React, { useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import { croppedImgToFile } from "../utils/imageutils";
import "./cropper_custom.scss";
import { Modal, Grid } from "@material-ui/core";
import styled from "styled-components";

const ImageCropper = ({
  img,
  setImg,
  searchImgByFile,
  inputRef
}) => {
  const imgRef = useRef();
  const widthRatio = 70;
  const [crop, setCrop] = useState({
    unit: "%",
    width: widthRatio,
    height: widthRatio,
    x: 50 - (widthRatio / 2), // 50 = 50% 
    y: 50 - (widthRatio / 2)
  });
  const [cropped, setCropped] = useState(null);

  const handleCloseCropper = () => {
    setImg("");
  }

  const handleSubmit = () => {
    croppedImgToFile(imgRef.current, cropped, "") // <img/>, crop정보, 파일명  
      .then(generatedFile => {
        handleCloseCropper();
        searchImgByFile(generatedFile);
      })
    handleCloseCropper();
    window.sessionStorage.setItem("originalImg", JSON.stringify(img));
  };

  const handleReupload = e => {
    inputRef.current?.click(); 
    e.preventDefault();
  }

  return (
    <Modal open={true}>
      <CropperWrapper container direction="column" justify="space-between" alignItems="center" wrap="nowrap">
        <div className="btn close_btn">
          <p onClick={handleCloseCropper}>닫기</p>
        </div>
        <ReactCrop
          src={img}
          crop={crop}
          onImageLoaded={img => { imgRef.current = img }}
          onChange={crop => { setCrop(crop) }}
          onComplete={crop => { setCropped(crop) }}
        />
        <Grid container justify="space-between" className="btn bottom_btns">
          <Grid item xs={6} onClick={handleReupload}>다른 사진</Grid>
          <Grid item xs={6} onClick={handleSubmit}>확인</Grid>
        </Grid>
      </CropperWrapper>
    </Modal>
  )
};

const CropperWrapper = styled(Grid)`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9090;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 1);
  .btn{
    display: flex;
    width:100%;
    max-width: 550px;
    padding: 2rem;
    box-sizing:border-box;
    margin: 0 auto;
    color: white;
    font-size: 16px;
    cursor: pointer;
  }
  .close_btn{
    justify-content: flex-end;
  }
  .bottom_btns{
    text-align:center;
  }
`;

export default ImageCropper;