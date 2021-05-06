export const setCookie = (name, value="", expiredays) => {
  const today = new Date();
  today.setDate(today.getDate() + expiredays);
  document.cookie = name + '=' + value + '; expires=' + today.toUTCString();
}

export const hasCookie = (name) => {
  const isCookie = document.cookie.split(';').some((item) => item.includes(name));
  return isCookie;
}
