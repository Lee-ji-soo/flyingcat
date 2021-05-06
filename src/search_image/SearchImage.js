import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Grid } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { handleProductClick2 } from "../utils/gautils";
import { sorting } from "../utils/jsxUtils";
import { CircularLoading } from "../utils/loadingutils";
import SearchImageList from "./SearchImageList";
import ImageCropper from "./ImageCropper";
import SorterSI from "./SorterSI"; // SI = searchImage
import { searchImgApi, getItemDetailApi } from "./searchImgApi";

const SearchImage = ({history}) => {
  const searchParams = new URLSearchParams(window.location.search);
  const subjectImgUrl = searchParams.get("subjectImg");
  const sortUrl = searchParams.get("sort");
  const userId = useSelector(state => state.MainReducer.userId);
  const isSubjectImgUrl =
    (subjectImgUrl !== "null"
      && subjectImgUrl !== (null || undefined)
      && subjectImgUrl
    ) && true;
  const [goods, setGoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false); //상품 detail 페이지로 넘어가기
  const [errorType, setErrorType] = useState("noError");
  const [sortType, setSortType] = useState(sortUrl ?? "recomm");
  const [cropImg, setCropImg] = useState("");

  const inputRef = useRef();
  const reader = new FileReader();

  //fetch1. 첫 화면 이미지url로 검색결과 불러오기 
  useEffect(() => {
    if(isSubjectImgUrl){
      searchImgByURL();
    } else{
      setLoading(false)
      setErrorType("itemError")
    }

    //언마운트
    return ()=> {
      if(inputRef.current){inputRef.current.value= ""} else return; // input 자동 실행 방지
    }
  }, [])

  //이미지 클릭 시 상품페이지로 넘어가기
  const handleClick = async(itemUrl) => {
    setPageLoading(true);
    try{
      const res = await getItemDetailApi(itemUrl);
      const { goodsNo } = res;
      setPageLoading(false);
      handleProductClick2({goodsNo}, "flyingcatlens");
      window.location.href = `/goods/goods_view.php?goodsNo=${goodsNo}`;
    }
    catch{
      setPageLoading(false);
      window.alert("다른 상품으로 시도해주세요.")
    }
  };
  
  const checkItemError = items => {
    if( items.length <= 0 || subjectImgUrl === "null" ){
      setErrorType("itemError");
    } else {
      setErrorType("noError");
    }
  }

  const setNextState = res => {
    const { items, upload_image } = res;      
    checkItemError(items);
    sortGoods(items, sortType);
    history.replace(`/search_image.php?subjectImg=${upload_image}&sort=${sortType}`)
  }
  
  const fetchSearchImg = async(data) => {
    setLoading(true)
    try{
      const res = await searchImgApi(data)
      setNextState(res)
      setLoading(false)
    }
    catch(err){
      console.log(err)
      setErrorType("apiError")
      setLoading(false)
    }
  };

  const searchImgByURL = async() => {
    let data = new FormData()
    data.append("image_url", subjectImgUrl)
    data.append("userId", userId)
    fetchSearchImg(data)
  };

  const searchImgByFile = async(file) => {
    if (file) {
      let data = new FormData()
      data.append("image", file)
      data.append("userId", userId)
      fetchSearchImg(data)
    }
  };
  
  const handleUpload = files => {
    const file = files[0];
    if(file){
      if (file.size > 50000000) {
        window.alert("50MB이하의 파일만 업로드 해주세요.")
        return;
      }
      reader.addEventListener("load", ()=>setCropImg(reader.result));
      reader.readAsDataURL(file);
    }
  };

  const handleRecrop = () => {
    setCropImg(JSON.parse(window.sessionStorage.getItem("originalImg")));
  };

  const sortGoods = (items, type) => {
    setSortType(type)
    const sortedArr = sorting(items, type);
    setGoods(sortedArr);
  }

  const handleSortType = type => {
    let url = new URL(`${location.href}`);
    let params = new URLSearchParams(url.search);
    params.set("sort", type);
    params.toString();
    history.replace(`/search_image.php?${params}`)

    sortGoods(goods, type);
  }

  return (
    <>
      {cropImg && (
        <ImageCropper
          img={cropImg}
          setImg={setCropImg}
          searchImgByFile={searchImgByFile}
          inputRef={inputRef}
        />
      )}
      {pageLoading && <CircularLoading/>}
      <SearchImageTopWrapper container justify="center" subjectimgurl={subjectImgUrl}>
        {loading
          ? renderBlueSpinner()
          :<>
            <div className="button_wrap">
              <div className="icon_wrap" onClick={handleRecrop}>
                <img src="https://1wecodereact.s3.ap-northeast-2.amazonaws.com/recrop.svg"/>
                <p>다시 자르기</p>
              </div>
              <div className="subject_img"></div>
            </div>
            <div className="button_wrap">
              <div className="icon_wrap">
                <img src="https://1wecodereact.s3.ap-northeast-2.amazonaws.com/searchImage_upload_icon.svg"/>
                <p>재업로드</p>
                <input
                  ref={inputRef}
                  type="file" name="upload"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => {
                    if (e.target.files) {
                      handleUpload(e.target.files);
                    }
                  }}
                />
              </div>
            </div>
          </>
        }
      </SearchImageTopWrapper>
      <SorterSI
        sortType={sortType}
        handleSortType={handleSortType}
      />
      <SearchImageList
        goods={goods}
        loading={loading}
        handleClick={handleClick}
        subjectImgUrl={subjectImgUrl}
        errorType={errorType}
      />
    </>
  );
};

const UploadImage = {
  width: "64px",
  background: "rgba(17,17,17,0.4)"
}

const SearchImageTopWrapper = styled(Grid)`
  height: 64px;
  .button_wrap{
    position: relative;
    width: ${UploadImage.width};
    height: ${UploadImage.width};
    margin: 0 4px;
    overflow: hidden;
    cursor: pointer;
    img{
      position: absolute;
      top: 50%;
      left: 50%;
      width: 30px;
      height: 30px;
      transform: translate(-50%,-75%);
    }
    .icon_wrap{
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      width: ${UploadImage.width};
      height: ${UploadImage.width};
      background-color: rgba(17,17,17,0.3);
      p{
        position: absolute;
        left: 0;
        bottom: 0;
        width: ${UploadImage.width};
        height: 19px;
        font-size: 10px;
        line-height: 19px;
        color: white;
        background-color: ${UploadImage.background};
      }
      input{
      width: ${UploadImage.width};
      height: ${UploadImage.width};
      opacity: 0;
      cursor: pointer;
      }
    }
    .subject_img{
      width: 100%;
      height: 100%;
      background-image: url(${props=> props.subjectimgurl});
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover; 
    }
  }
`

export default withRouter(SearchImage);