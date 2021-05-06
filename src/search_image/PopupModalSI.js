import React, { useRef } from "react";
import { Modal, Grid} from "@material-ui/core";
import styled from "styled-components";
import Slider from "react-slick";
import { setCookie } from "../utils/jsxUtils";

const stopPropagation = e => e.stopPropagation();

const modalBG = {
  backgroundColor: "rgba(17, 17, 17, 0.7)",
};

const sliderSettings = {
  arrows: false,
  autoplay: false,
  dots: true,
  infinite: true,
  speed: 200,
  slidesToShow: 1,
  slidesToScroll: 1
};

export const PopupModalSI = ({
  open,
  closeModal,
  setCanOpenModal,
})=>{

  const sliderRef = useRef();
  const onClickSlick = () => {
    sliderRef.current.slickNext();
  }

  const setLensCookie = () => {
    setCookie("lensCookie", "", 1)
    setCanOpenModal(false)
    closeModal()
  };

  return(
    <Modal
      style={modalBG}
      open={open}
      onClose={closeModal}
      onMouseDown={stopPropagation} onTouchMove={stopPropagation}
    >
      <PopupBox onClick={onClickSlick}>
        <Grid container justify="space-between" alignItems="center">
          <div className="btn can-open_btn" onClick={setLensCookie}>오늘 하루 보지 않기</div>
          <img className="btn close_btn" onClick={closeModal} src="https://1wecodereact.s3.ap-northeast-2.amazonaws.com/x.svg"/>
        </Grid>
        <button className="btn" onClick={closeModal}>지금 찾아보기</button>
        <Slider ref={sliderRef} className="slider_wrap" {...sliderSettings}>
          <article>
            <h2>상품 이미지를 캡처해 올리면,<br/>지구 최저가를 찾아드려요.</h2>
            <h3>오늘의집, 지그재그 등에서 본 상품의 가격이 진짜일까요?<br/>5천만 개의 공장 가격 데이터에서 최저가를 찾아드립니다.</h3>
            <img alt="" src="https://1wecodereact.s3.ap-northeast-2.amazonaws.com/si_modal1.png"/>
          </article>
          <article>
            <h2>눈앞의 물건을 찍어도.<br/>지구 최저가를 찾아드려요.</h2>
            <h3>단색 배경에서 물체만 나오게 쵤영하시면<br/>더욱 정확한 결과를 얻으실 수 있어요.</h3>
            <img alt="" src="https://1wecodereact.s3.ap-northeast-2.amazonaws.com/si_modal2.svg"/>
          </article>
        </Slider>
      </PopupBox>
    </Modal>
  )
}

const PopupBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  overflow: hidden;
  width: 83%;
  max-width: 420px;
  padding: 24px;
  border-radius: 23px;
  box-sizing: border-box;
  background-color: white;
  transform: translate(-50%,-50%);
  .btn{
    cursor: pointer;
  }
  .can-open_btn{
    color: rgba(167, 167, 167, 0.85);
    font-size: 12px;
  }
  .close_btn{
    width: 16px;
    height: 16px;
    opacity: 0.4;
  }
  button{
    position: absolute;
    z-index: 20;
    left: 50%;
    bottom: 12%;
    width: 75%;
    height: 56px;
    border: none;
    border-radius: 28px;
    background-color: var(--color-cta);
    color: white;
    font-size: 16px;
    font-weight: 500;
    line-height: 56px;
    transform: translate(-50%, 0);
  }
  .slider_wrap{
    width: 100%;
    height: calc(100% - 20px);
    padding-top: 5%;
    article{
      padding-top: 5%;
      padding-bottom: 19%;
      line-height: 1.5;
      word-break: keep-all;
      h2{
        padding-bottom: 8px;
        color: #111;
        font-size: 20px;
        font-weight: 900;
      }
      h3{
        color: #7f7f7f;
        font-size: 11px;
        font-weight: 500;
      }
      img{
        width: 90%;
        padding: 20px;
        box-sizing: border-box;
        margin: 0 auto;
      }
    }
  }
  .slick-dots{ padding-bottom: 7%; }
  .slick-dots li{ margin: 0 !important; }
  .slick-dots li button::before{ 
    content:"";
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: black;
  }
`

export default PopupModalSI; 