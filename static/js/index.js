"use strict";

import { getCookie,deleteCookie } from "./cookie.js";

 function sign_out() {
            deleteCookie("mytoken");
            alert('로그아웃 하셨습니다');
            window.location.href = "/signin";
        }

function main() {
  const search = document.getElementById('search');
  const nickname = `${localStorage.getItem('nickname')}님 함께 나눠요💚`;
  const signOutBtn = document.getElementById('signout');
  signOutBtn.addEventListener('click', sign_out);

  getCookie('mytoken') ? search.placeholder = nickname : search.placeholder;
}

main();
