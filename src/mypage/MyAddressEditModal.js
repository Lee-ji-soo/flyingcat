import React, { useState, useRef } from "react";
import { Grid,Button, Checkbox, Input } from "@material-ui/core";
import AddressModal from "../crunch_order/AddressModal";
import styled from "styled-components";
import { isTrue } from  "../utils/tsx_utils/tsFunctionUtil.tsx";
import { CheckedCircle, UncheckedCircle } from "../utils/tsx_utils/styleUtils";
import { autoHyphenPhoneNumber } from "../utils/funcUtils";

const MyAddressEditModal = ({
    address,
    setEditModal,
    handleCloseModal,
    submitModifiedAddress,
    deleteAddress,}) => {
      
  const { defaultFl } = address;
  const [modifyingAddress, setModifyingAddress] = useState(address);
  // const modifiedAddress = useMemo(() => modifyingAddress, [])
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [showDefault, setShowDefault] = useState(isTrue(defaultFl));
  const checkRef = useRef();

  const handleDefaultFl = () => {
    const checkInputRef = checkRef.current.querySelector("input");
    checkInputRef.checked = !checkInputRef.checked;

    if(checkInputRef.checked){
      setModifyingAddress({...modifyingAddress, defaultFl : "y"});
      setShowDefault(true);
    }else{
      setModifyingAddress({...modifyingAddress, defaultFl : "n"})
      setShowDefault(false);
    }
  }

  const handleSubmit = modifyingAddress => {
    if(checkAddress(modifyingAddress)){
      submitModifiedAddress(modifyingAddress);
    }return;
  }

  return(
    <AddressEditWrap>
      <Grid className="close_btn" item xs={12} container>
        <img
          onClick={handleCloseModal}
          src="https://1wecodereact.s3.ap-northeast-2.amazonaws.com/icon_delete_10pt.svg"
        />
      </Grid>
      <Grid id="modify_box" item xs={12} container justify="flex-start">
        <h1 className="hidden">배송지 수정</h1>
        {showDefault ? <p className="defaultFl">기본 배송지</p> : <p className="no_defaultFl"></p>}
        <h2 className="item_title">배송지별명</h2>
        <Input
          className="item_input"
          disableUnderline
          placeholder="최대 5글자 입력"
          defaultValue={modifyingAddress.shippingTitle || ""}
          onChange={(e) => setModifyingAddress({...modifyingAddress, shippingTitle : e.target.value.slice(0,5)})}
        />
        <h2 className="item_title">받는 사람</h2>
        <Input
          className="item_input"
          disableUnderline
          placeholder="실명으로 입력해주세요"
          value={modifyingAddress.shippingName || ""}
          onChange={(e) => setModifyingAddress({...modifyingAddress, shippingName : e.target.value})}
        />
        <h2 className="item_title">연락처</h2>
        <Input
          type="tel"
          className="item_input"
          disableUnderline
          placeholder="수령자의 010 핸드폰 번호를 입력해주세요"
          value={autoHyphenPhoneNumber(modifyingAddress.shippingCellPhone) || ""}
          onChange={(e) => setModifyingAddress({...modifyingAddress, shippingCellPhone : e.target.value})}
        />
        <h2 className="item_title">주소</h2>
        <AddressModal
          open={searchModalOpen}
          handleClose={() => setSearchModalOpen(false)}
          handleAddress={(data) => {
            setModifyingAddress({
              ...modifyingAddress,
              shippingZonecode : data.zonecode,
              shippingZipcode : data.zonecode,
              shippingAddress : data.address,
              shippingAddressSub : "",
            });
            setSearchModalOpen(false);
          }}
        />
        <Grid className="search_input" container item xs={12} justify="space-between" alignItems="center" direction="row">
          <Input
            className="address_input item_input"
            disableUnderline
            disabled={true}
            value={modifyingAddress.shippingZonecode || ""}  // ! shippingZonecode, shippingZipcode
          />
          <img
            id="search_btn"
            src="https://1wecodereact.s3.ap-northeast-2.amazonaws.com/search.svg"
            onClick={() => setSearchModalOpen(true)}
          />
        </Grid>
        <Input
          className="address_input item_input"
          disableUnderline
          disabled={true}
          value={modifyingAddress.shippingAddress || ""}
        />
        <Input
          className="address_input item_input"
          disableUnderline
          placeholder="나머지 주소 입력"
          value={modifyingAddress.shippingAddressSub || ""}
          onChange={(e) => setModifyingAddress({...modifyingAddress, shippingAddressSub : e.target.value})}
        />
        <Grid
          className="defaultFl_input"
          container
          justify="flex-start"
          onClick={handleDefaultFl}
        >
          <Checkbox
            className="default_check"
            ref={checkRef}
            icon={<UncheckedCircle />}
            checkedIcon={<CheckedCircle />}
            checked={isTrue(modifyingAddress.defaultFl)}
            onChange={handleDefaultFl}
          />
          <div className="txt">기본 배송지로 설정</div>
        </Grid>
        <Button
          className="submit_btn"
          onClick={()=>{handleSubmit(modifyingAddress)}}
          disabled={JSON.stringify(modifyingAddress) === JSON.stringify(address)}
        >저장
        </Button>
        <Button
          className="delete_btn submit_btn"
          onClick={()=>{if(window.confirm("배송지를 삭제합니다.")){deleteAddress(address.sno)}}}
        >삭제
        </Button>
      </Grid>
    </AddressEditWrap>
  )
};

const AddressEditWrap = styled.div`
  position: relative;
  width:100%;
  max-width: 550px;
  padding:16px 24px 0px;
  box-sizing: border-box;
  margin: 0 auto;
  background-color:white;
  .close_btn{
    height: 10px;
    img{
      position: absolute;
      top: 0px;
      right: 16px;
      padding: 15px;
      cursor: pointer;
    }
  }
  #modify_box {
    width: 100%;
    height: auto;
    padding-bottom: 100px;
    background: white;
    .defaultFl, .no_defaultFl{
      width: 67px;
      height: 18px;
      border-radius: 20px;
      margin-left: -2px;
      margin-bottom: 17px;
      background-color: #eaeaea;
      color: #777;
      font-size: 11px;
      line-height: 18px;
      text-align: center;
    }
    .no_defaultFl{
      background-color: #fff;
    }
    .item_title {
      width: 100%;
      height: auto;
      box-sizing: border-box;
      margin: 4px 0;
      color: #404040;
      text-align: left;
      font-size: 13px;
      line-height: 18px;
    }
    .item_input{
      width: 100%;
      height: 32px;
      min-height: 40px;
      padding: 0 8px;
      box-sizing: border-box;
      margin: 4px 0;
      margin-bottom: 16px;
      background: #f8f8f8;
      text-align: left;
      color: #111;
      font-size: 12px;
      font-weight: 500;
    }
    .search_input{
      position: relative;
    }
    .address_input{
      margin-bottom: 4px;
    }
    .defaultFl_input{
      margin: 10px 0 40px 0;
      .default_check {
        padding: 0;
        cursor: pointer;
      }
      .txt {
        padding: 8px;
        color: #707070;
        font-size: 12px;
        line-height: 16px;
        cursor: pointer;
      }
    }
    #search_btn {
      position: absolute;
      right: 8px;
      height:20px;
      opacity: 0.7;
      font-family:Noto Sans KR;
      font-size:15px;
      cursor: pointer;
    }
    .submit_btn {
      width: 97.5%;
      height:40px;
      box-sizing: border-box;
      margin: 0 auto;
      margin-bottom: 16px; 
      background-color: var(--color-cta);
      color:white;
      font-family:Noto Sans KR;
      font-size:15px;
      font-weight:bold;
      cursor: pointer;
      :disabled{
        background-color:#808080;
      }
    }
    .delete_btn{
      border:1px solid var(--color-cta);
      background-color: white;
      color: var(--color-cta);
    }
  }
`

export default MyAddressEditModal;

const checkAddress = value => {
  const {
    shippingTitle,
    shippingName,
    shippingCellPhone,
    shippingAddress,
    shippingAddressSub
  } = value;

  if (shippingTitle === "") {
    alert("배송지별명을 입력해주세요!");
    return;
  } 
  if (shippingName === "") {
    alert("받는사람의 이름을 입력해주세요!");
    return;
  }
  if (!/^([가-힣]{2,15}|[a-zA-Z]{2,15}|[a-zA-Z]{2,15}\s[a-zA-Z]{2,15})$/.test(shippingName)) {
    alert("이름을 정확히 입력해주세요!");
    return;
  }
  if (shippingCellPhone === "") {
    alert("주문자 휴대폰번호를 입력해주세요!");
    return;
  }
  const numRegex = "^0(2|3[1-3]|4[1-4]|5[1-5]|6[1-4]|10)[0-9]{3,4}[0-9]{4}";
  if (!shippingCellPhone.split("-").join("").match(numRegex)) {
    alert("올바른형식의 휴대전화번호를 입력해주세요");
    return;
  }
  if (shippingAddress === "") {
    alert("주소를 입력해주세요!");
    return;
  }
  if (shippingAddressSub === "") {
    alert("상세 주소를 입력해주세요!");
    return;
  }
  else{
    return true;
  }
}