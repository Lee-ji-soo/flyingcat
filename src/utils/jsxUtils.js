export const setCookie = (name, value="", expiredays) => {
  const today = new Date();
  today.setDate(today.getDate() + expiredays);
  document.cookie = name + '=' + value + '; expires=' + today.toUTCString();
}

export const hasCookie = (name) => {
  const isCookie = document.cookie.split(';').some((item) => item.includes(name));
  return isCookie;
}

export const sorting = (goods, sort) => {
  let arr=[];
  switch(sort){
    case "recomm" :
      arr = goods.sort(function(a,b){return a["recommends"]-b["recommends"]});
      return arr;
    case "orderCnt":
      arr = goods.sort(function(a,b){return b["sales"]-a["sales"]})
      return arr;
    case "lowPrice":
      return goods.sort(function(a,b){return a["price"]-b["price"]})
    case "highPrice":
      arr = goods.sort(function(a,b){return b["price"]-a["price"]})
      return arr;
    default: 
      return goods
  }
};