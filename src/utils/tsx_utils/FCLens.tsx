import { CircularProgress, Portal } from "@material-ui/core";
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import ImageCropper from "../../search_image/ImageCropper";
import PopupModalSI from "../../search_image/PopupModalSI"; // SI = SearchImage
import { hasCookie } from "../jsxUtils";
import { getImageUrlApi } from "../../search_image/searchImgApi";
interface FCLensProps {
  is: "header" | "bottom"
}

interface SearchResponse {
  data: {
    upload_image: string;
  };
};
interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget
};

const FCLens = ({
  is = "header"
}: FCLensProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cropImg, setCropImg] = useState<string| ArrayBuffer| null>("");
  const [modal, setModal] = useState<Boolean>(false);
  const [canOpenModal, setCanOpenModal] = useState<Boolean>(!hasCookie("lensCookie"));
  const inputRef = useRef<HTMLInputElement>(null);
  const reader = new FileReader();

  useEffect(()=>{
    return ()=> {
      if(inputRef.current){inputRef.current.value= ""} else return; // input 자동 실행 방지
    }
  },[]);

  useEffect(() => {
    isLoading
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "");
  }, [isLoading]);

  const openModal = () => {
    if(!hasCookie("lensCookie")){ // 각 컴포넌트에서 바로 업데이트가 안되기 때문에 쿠키 직접 체크
      setModal(true)
    }else{
      inputRef.current?.click();
    }
  };

  const closeModal = () => {
    setModal(false)
    inputRef.current?.click()
  };

  const setNextPath = ( imgUrl:string | undefined| "") => {
    const baseUrl = "/search_image.php?subjectImg=";
    const urlToGo = imgUrl
      ? `${baseUrl}${encodeURIComponent(imgUrl)}`
      : `${baseUrl}null`;
    window.location.href = urlToGo;
  };

  const fetchGetImgUrl = async( data:FormData ) => {
    setIsLoading(true)
    try{
      const res: SearchResponse | null = await getImageUrlApi(data);
      const imgUrl: string | undefined | "" = res?.data.upload_image;
      setNextPath(imgUrl)
      setIsLoading(false)
    }
    catch{
      setIsLoading(false)
      setNextPath("null")
      return null
    }
  };

  const searchImgByFile = async (imgObj: any) => {
    const formData = new FormData()
    formData.append("image", imgObj)
    fetchGetImgUrl(formData);
  }

  const handleUploadPhoto = (e: HTMLInputEvent) => {
    const files = e?.target?.files || [];
    if (files.length === 0) return;
    
    const imgObj = files[0];
    if (imgObj.size > 50000000) {
      alert("50MB이상의 파일은 업로드할 수 없습니다.");
      return;
    }
    if (imgObj) {
      reader.addEventListener("load", ()=>{setCropImg(reader.result)});
      reader.readAsDataURL(imgObj);
      }
    return;
  };

  const hwLens = is === "header" ? "camera_%23fff"  : "hwlens_beta" ;
  const hwLensSrc = `https://1wecodereact.s3.ap-northeast-2.amazonaws.com/${hwLens}.svg`;

  return (
    <>
      <PopupModalSI // 팝업 모달
        open={modal}
        closeModal={closeModal}
        setCanOpenModal={setCanOpenModal}
      />
      {Boolean(cropImg) && (
        <ImageCropper
          img={cropImg}
          setImg={setCropImg}
          searchImgByFile={searchImgByFile}
          inputRef={inputRef}
        />
      )}
      <LensLabel className="tab_link" htmlFor="fc_lens" onClick={e=>e.stopPropagation()}>
        <input // ? 모바일에선 카메라가 켜지고 pc에서는 파일 탐색 창이 뜸
          accept="image/png, image/jpeg, image/jpg"
          type="file"
          hidden
          ref={inputRef}
          onChange={(e:any)=> {
            if(e.target.value){ // 자동 실행 되지 않기 위함
              handleUploadPhoto(e);
            }
          }}
        />
        {hwLensSrc && (
          <>
            {canOpenModal && <div id="fake_lens" onClick={openModal}></div> }
            <img onClick={()=>{inputRef.current?.click()}} src={hwLensSrc} />
          </>
        )}
        {isLoading && (
          <Portal>
            <LoadingBackground>
              {<CircularProgress className="circle" size={100} />}
            </LoadingBackground>
          </Portal>
        )}
      </LensLabel>
    </>
  );
};

const LensLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  #fake_lens{
    position: absolute;
    z-index: 20;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0);
  }
`;

const LoadingBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9090;
  width: 100vw;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  .circle {
    color: var(--color-cta);
  }
`;

export default FCLens;