import { getData, normalFormPost } from "./apiutils";

export const getAddressApi = async () => {
  const apiUrl = `/mypage/mypage_shipping.php`;
  try{
    const res = await getData(apiUrl);
    return await res.data;
  }
  catch(err){
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      return fakeData
    }
    console.log(err);
    return [];
  }
};

export const addAddressApi = async({regDt,sno, ...others})=>{
  const apiUrl = "/mypage/insert_shipping.php";
  const data = {...others};
  try{
    await normalFormPost(apiUrl, data);
  }
  catch(err){
    console.log(err)
    alert("배송지 등록에 실패했습니다. 잠시후 다시 시도해 주시기 바랍니다.")
  }
}

export const updateAddressApi = async(address) => {
  const apiUrl = "/mypage/update_shipping.php";
  const data = Object.assign(address);
  try{
    const res = await normalFormPost(apiUrl, data);
    return await res.data;
  }
  catch{
    alert("배송지 수정에 실패했습니다. 잠시후 다시 시도해 주시기 바랍니다.")
  }
}

export const deleteAddressApi = async(sno) =>{
  const apiUrl = "/mypage/delete_shipping.php";
  const data = Object.assign({sno});
  try{
    await normalFormPost(apiUrl, data);
  }
  catch{
    alert("배송지 삭제에 실패했습니다. 잠시후 다시 시도해주시기 바랍니다.");
  }
}

const fakeData = [
  {
    defaultFl: "y",
    regDt: "2020-08-27 16:13:16",
    shippingAddress: "우주 화성시 특별감자밭구 마스동",
    shippingAddressSub: "화성인바이러스아파트",
    shippingCellPhone: "010-7907-4507",
    shippingName: "김화성",
    shippingTitle: "화성별장",
    shippingZipcode: "",
    shippingZonecode: "12345",
    sno: "1111"
  },
  {
    defaultFl: "n",
    regDt: "2020-09-27 16:13:16",
    shippingAddress: "어쩌구 저쩌구 주소가 이렇다",
    shippingAddressSub: "이런빌딩 저런호",
    shippingCellPhone: "010-7907-4507",
    shippingName: "야임마",
    shippingTitle: "우미관",
    shippingZipcode: "",
    shippingZonecode: "33333",
    sno: "3333"
  },
  {
    defaultFl: "n",
    regDt: "2020-08-06 16:13:16",
    shippingAddress: "경기 성남시 분당구 판교역로 235 에이치스퀘어 엔동",
    shippingAddressSub: "크프",
    shippingCellPhone: "010-7907-4507",
    shippingName: "테스",
    shippingTitle: "테스트",
    shippingZipcode: "",
    shippingZonecode: "13494",
    sno: "6556"
  },
]