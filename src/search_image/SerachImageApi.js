import { postJsonData, postLoggedinFormData} from "../utils/apiutils";
import { crunchDjangoUrl } from "../enums";

export const searchImgApi = async(data) => {
  const apiUrl = `${crunchDjangoUrl}/oneboundapi/image_search_api/`;
  try{
    const res = await postJsonData(apiUrl, data);
    return await res.data;
  }
  catch(err){
    console.log(err);
    return err;
  }
};

export const getItemDetailApi = async(itemUrl) => {
  const apiUrl = `${crunchDjangoUrl}/oneboundapi/image_goods/`;
  try{
    const res = await postJsonData(apiUrl, {link: itemUrl})
    return await res.data
  }
  catch(err){
    console.log(err);
    return err;
  }
};

export const getImageUrlApi = async(data) => {
  const apiUrl = `${crunchDjangoUrl}/oneboundapi/image_search_only_image/`;
  try{
    const res = await postLoggedinFormData(apiUrl, data);
    return await res;
  }
  catch(err){
    console.log(err)
    return err;
  }
};
