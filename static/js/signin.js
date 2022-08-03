"use strict";

import { setCookie, restrictionsByCookies } from "./cookie.js";

async function submitSignIn() {
  const errorMsg = document.getElementById('error-msg');
  const red = 'rgba(255 0 0)';
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const URL = '/signin';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'accountEmail': email.value,
      'pw': password.value,
    }),
  };

  let response = await fetch(URL, options).catch(error => console.log(error));
  let result = await response.json().catch(error => console.log(error));
  console.log(result);

  if (result.result) {
    setCookie('mytoken', result.token, 1);
    localStorage.setItem('accountEmail', email.value);
    localStorage.setItem('nickname', result.nickname);
    window.location.href = '/';
  } else {
    errorMsg.innerHTML = '계정 정보가 일치하지 않습니다.';
    errorMsg.style.color = red;
  }
}
 
function main() {
  restrictionsByCookies();
  const signInBtn = document.getElementById('signin');
  signInBtn.addEventListener('click', submitSignIn);
}

main();