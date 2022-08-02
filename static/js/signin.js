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

  if (result.result === 'success') {
    setCookie('mytoken', result.token, 1);
    window.location.href = '/';
  } else {
    errorMsg.innerHTML = '계정 정보가 일치하지 않습니다.';
    errorMsg.style.color = red;
  }
}
 
function main() {
  const signInBtn = document.getElementById('signin');
  signInBtn.addEventListener('click', submitSignIn);
}

main();