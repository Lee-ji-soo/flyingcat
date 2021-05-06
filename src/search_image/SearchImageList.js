import React from "react";
import { Grid } from "@material-ui/core";
import { renderGotoTopButton } from "../utils/jsxUtils";
import styled from "styled-components"
import { SkeletonGrid } from "../utils/Skeletons";
import { getMoneyString, getMoneyStringWithoutWon } from "../utils/stringutils";

const errors = {
  "noError" : null,
  "itemError" : {
    title: "이런! 일치하는 상품을 찾지 못했어요.",
    content: "보여주신 사진과 일치하는 상품이 없어요. \n다시 촬영하거나 다른 사진으로 시도해주세요.",
    img: "https://1wecodereact.s3.ap-northeast-2.amazonaws.com/search_man.svg" 
  },
  "apiError" : {
    title: "잠시 후 다시 시도해주세요!",
    content: "사용량이 급증하여 긴급 서버 점검 중입니다. \n 문제를 해결하기 위해 열심히 노력하고 있으니, \n 잠시 후 다시 확인해주세요.",
    img: "https://1wecodereact.s3.ap-northeast-2.amazonaws.com/waiting_icon.svg"
  }
};

const SearchImageList = ({
  goods,
  loading,
  showTopBtn = true,
  handleClick,
  subjectImgUrl,
  errorType
}) => {
  const currentError = errors[errorType];
  return (     
    <SearchImgListWrapper container>
      <SearchImgList container spacing={1}>
        {
          loading
            ? SkeletonGrid({ //스켈레톤 재사용 컴포넌트
              smallTag: false,
              gridNum: 6,
              gridHeight: 230
            })
            : !currentError
              ? <>
                  { goods.map((item, idx) =>{
                    const orderCnt = item.sales;
                    const parsedCnt = getMoneyStringWithoutWon(orderCnt);
                    return(
                      <SearchImg
                          item container xs = {6}
                          key={`searchImg-${idx}`}
                          onClick={() => handleClick(item.detail_url)}
                      >
                        <div className="image_wrapper_border">
                          <div id="image_wrapper">
                            <div className="show_up image_square">
                              <img className="square_image" alt="" src={item.pic_url} />
                            </div>
                          </div>
                          <div className="item_info" draggable="false">
                            <span className="title text_overflow">{item.title}</span>
                            <span className="price">{getMoneyString(item.price)}</span>
                            <span className="sales">구매&nbsp;
                              <span className="count">
                                {parsedCnt.slice(-2) === "00"
                                  ? `${parsedCnt}+`
                                  : parsedCnt
                                }
                              </span>
                            </span>
                          </div>
                        </div>
                      </SearchImg>
                    )}
                  )}
                </>
              : <NoResultWrapper>
                  <Grid 
                    className="error_wrap"
                    container
                    spacing={1}
                    alignItems="center"
                    direction="column"
                    justify="center"
                  >
                    <img className="search_man" src={currentError.img}/>
                    <h2>{currentError.title}</h2>
                    <div className="line"></div>
                    <h3>{currentError.content}</h3>
                  </Grid>
                </NoResultWrapper>
        }
      </SearchImgList>
      {showTopBtn && renderGotoTopButton()}
    </SearchImgListWrapper>
  );
};

const SearchImgListWrapper = styled(Grid)`
  padding: 4px;
  background-color: #f5f5fa;
`
const SearchImgList = styled(Grid)`
  margin: 0px;
  background-color: #f5f5fa;
`
const SearchImg = styled(Grid)`
    background-color: transparent;
    .image_wrapper_border{
      width: 100%;
      overflow: hidden;
      border-radius: 3px;
      .image_square{
        background-color: white;
        .square_image{
          object-fit: cover;
          cursor: pointer;
        }
      }
      .item_info {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        width: 100%;
        padding: 8px 8px 10px 8px;
        box-sizing: border-box;
        line-height: 1.8;
        text-align: start;
        background-color: white;
        .title {
          font-size: 12px;
          font-weight: 500;
        }
        .price {
          font-size: 14px;
          font-family: GmarketSansBold;
          white-space: nowrap;
        }
        .sales{
          font-size: 12px;
          line-height: 1.2;
          .count{
            color: #111;
            font-weight: bold;
          }
        }
          
      }
  }
`;
const NoResultWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 70vh;
  background-color: #f5f5fa;
  .error_wrap{
    width: 82%; 
    margin: 46px auto;
    padding: 32px 16px;
    background-color: #fff;
    .search_man{
      width: 80px;
    }
    h2,h3,p{
      word-break: keep-all;
      line-height: 21px;
    }
    h2{
      padding-top: 24px;
      color: #333;
      font-size: 16px;
      font-weight: bold;
    }
    .line{
      width: 24px;
      height: 1px;
      margin: 16px 0;
      background-color: rgba(112, 112, 112, 0.5);
    }
    h3,p{
      color: #111;
      font-size: 14px;
      white-space: break-spaces;
    }
    p{
      span{
        display: inline-block;
      }
    }
  }
`
export default SearchImageList;