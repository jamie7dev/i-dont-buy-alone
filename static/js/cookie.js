"use strict";

// name라는 이름과 value라는 값을 가지며 hour시간동안 유지되는 cookie를 생성 됩니다.
function setCookie(name, value, hour) {
  const date = new Date();
  date.setTime(date.getTime() + hour * 60 * 60 *  1000);
  document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
}

function getCookie(name) {
  const value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return value ? value[2] : null;
}

function deleteCookie(name) {
  const date = new Date();
  document.cookie = name + "= " + "; expires=" + date.toUTCString() + "; path=/";
}

export { 
  setCookie, 
  getCookie, 
  deleteCookie, 
};