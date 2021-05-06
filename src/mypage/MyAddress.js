import React, { useEffect, useState } from "react";
import MyAddressEditModal from "./MyAddressEditModal";
import { getAddressApi, updateAddressApi, deleteAddressApi, addAddressApi } from "./MyAddressApi";
import { isDevOrLoggedIn } from "../utils/detectutils";
import { LoadingSpinnerDiv } from "../utils/jsxUtils";
import { Grid } from "@material-ui/core";
import styled from "styled-components";
import { isTrue } from  "../utils/tsx_utils/tsFunctionUtil.tsx";

const MyAddress = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [myAddressList, setMyAddressList] = useState([]);
  const [editModal, setEditModal] = useState(false); // 수정 모달 open
  const [editingAddress, setEditingAddress] = useState({}); // ? 현재 수정 중인 주소
  const [isNew, setIsNew] = useState(false); // ? 새로운 배송지 등록일 경우 api가 다름

  useEffect(() => {
    if (isDevOrLoggedIn) getAddress();
  }, []);
  
  const getAddress = async()=> {
    setIsLoading(true);
    const data = await getAddressApi();
    setMyAddressList(data);
    setIsLoading(false);
  };
  
  const deleteAddress = async (sno) => {
    await deleteAddressApi(sno);
    handleCloseModal();
  };

  const submitModifiedAddress = async (editedAddress) => {
    arrangeDefault(editedAddress);
    if(isNew){
      await addAddressApi(editedAddress);
    }else{
      await updateAddressApi(editedAddress);
    }
    handleCloseModal();
  }; 
  
  const handleEditBtn = (address) => {
    setEditModal(true);
    setEditingAddress(address);
  };
  
  const handleCloseModal = () => {
    getAddress();
    setIsNew(false);
    setEditModal(false);
    window.scrollTo(0,0);
  };

  const handleEditNew = () => {
    setIsNew(true);
    handleEditBtn(defaultAddress)
  };

  const arrangeDefault = editedAddress => {
    if(isTrue(editedAddress.defaultFl)){
      myAddressList.map(address => {
        if(address.sno !== editedAddress.sno){
          address.defaultFl === "n"
        } else return;
      })
    }return;
  };

  return(
    <>
      {isLoading
        ? <LoadingSpinnerDiv />
        : <AddressList direction="column" container justify="flex-start" alignItems="center" editModal={String(editModal)}>
            {myAddressList.map((address,idx) => {
              const isDefaultAddress = isTrue(address.defaultFl);
              return (
                <div className="address" key={`addressList${idx}`}>
                  <img onClick={()=>{handleEditBtn(address)}} className="edit" src="https://1wecodereact.s3.ap-northeast-2.amazonaws.com/edit.svg" alt="edit"/>
                  {isDefaultAddress ? <p className="defaultFl">기본 배송지</p>:<p className="no_defaultFl"></p>}
                  <p className="title">{address.shippingTitle}</p>
                  <p className="sub">{address.shippingName}</p>
                  <p className="sub">{address.shippingAddress}</p>
                  <p className="sub">{address.shippingCellPhone}</p>
                </div>
              )})}
              <div id="add_address" onClick={handleEditNew}><span className="plus">+</span>새로운 배송지 등록</div>
          </AddressList>
      }
      {editModal &&
        <MyAddressEditModal 
          address={editingAddress}
          submitModifiedAddress={submitModifiedAddress}
          setEditModal={setEditModal}
          handleCloseModal={handleCloseModal}
          deleteAddress={deleteAddress}
        />
      }
      
    </>
  )
}

const AddressList = styled(Grid)`
  width: 100%;
  max-width: 550px;
  min-height: 650px;
  padding-top: 8px;
  background-color: #f5f6f8;
  &[editModal = "true"] {
    display: none;
  }
  .address{
    position: relative;
    width: 95%;
    height: 140px;
    padding: 17px;
    border-radius: 6px;
    border: solid 1px #d6d6d6;
    box-sizing: border-box;
    margin-bottom: 6px;
    background-color: white;
    color: #111;
    text-align: start;
    .edit{
      position: absolute;
      right: 17px;
      cursor: pointer;
    }
    .defaultFl{
      width: 67px;
      height: 16px;
      border-radius: 20px;
      margin-left: -2px;
      margin-bottom: 8px;
      background-color: #eaeaea;
      color: #777;
      font-size: 11px;
      line-height: 16px;
      text-align: center;
    }
    .no_defaultFl{
      width: 67px;
      height: 16px;
    }
    .title{
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
    }
    .sub{
      font-size: 12px;
      line-height: 18px;
    }

  }
  #add_address{
    display: flex;
    align-items: center;
    padding: 12px;
    color: #707070;
    font-size: 12px;
    line-height: 15px;
    cursor: pointer;
    .plus{
      display: inline-block;
      width: 15px;
      height: 15px;
      border: 1px solid #707070;
      border-radius: 50%;
      box-sizing: initial;
      margin-right: 8px;
      text-align: center;
      font-size: 15px;
      line-height: 14px;
    }
  }
`

export default MyAddress;

const defaultAddress= {
  defaultFl: "n",
  regDt: "",
  shippingAddress: "",
  shippingAddressSub: "",
  shippingCellPhone: "",
  shippingName: "",
  shippingTitle: "",
  shippingZipcode: "",
  shippingZonecode: "",
  sno: "1111"
}