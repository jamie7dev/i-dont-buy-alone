"use strict";

function isEmpty(str) {
  return (typeof str === 'undefined') || (str === null) || (str === '');
}

function isValidEmail(email) {
	const reg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

	return reg.test(email);
}

function allAreEqual(obj) {
  return new Set(Object.values(obj)).size === 1;
}

async function submitSignup() {
  const URL = '/signup';
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirm-password');
  const nickname = document.getElementById('nickname');
  const phone = document.getElementById('phone');
  const isValidInput = {
    email: (!isEmpty(email.value)) && isValidEmail(email.value),
    nickname: !isEmpty(nickname),
    password: password.value === confirmPassword.value,
  };
  const isValidAccount = allAreEqual(isValidInput);

  if (isValidAccount) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'accountEmail': email.value,
        'nickname': nickname.value,
        'pw': password.value,
        'phone': phone.value,
      }),
    }
  
    let response = await fetch(URL, options).catch(error => console.log(error));
    let result = await response.json().catch(error => console.log(error));
    console.log(result);
    result.msg ? window.location.href = '/signin' : alert('유효하지 않은 정보가 있어요');
  } else {
    alert('유효하지않은 정보가 있어요');
  }
}

async function isInUseEmail(event) {
  const URL = '/signup/email';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 'accountEmail': event.target.value, })
  };

  let response = await fetch(URL, options).catch(error => console.log(error));
  let result = await response.json().catch(error => console.log(error));
  
  return result;
}

async function isValidInputEmail(event) {
  let isValidEmailForm = isValidEmail(event.target.value);
  const helpEmail = document.getElementById('help-email');
  const red = 'rgba(255 0 0)';
  const green = 'rgba(0 128 0)';
  const colors = [red, green];
  const msgs = ['유효하지 않은 이메일 형식입니다', '사용 가능한 이메일입니다.', '이미 등록된 이메일입니다.'];

  let result = await isInUseEmail(event);

  helpEmail.innerHTML = msgs[Number(isValidEmailForm) + Number(result.hasAccount)];
  helpEmail.style.color = colors[Number(isValidEmailForm) - Number(result.hasAccount)];
}

function isSamePassword() {
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirm-password');
  const helpConfirmPassword = document.getElementById('help-confirm-password');
  const red = 'rgba(255 0 0)';
  const green = 'rgba(0 128 0)';
  const colors = [red, green];
  const msgs = ['비밀번호가 일치하지 않습니다.', '비밀번호가 일치합니다.'];
  let isSame = password.value === confirmPassword.value;

  helpConfirmPassword.innerHTML = msgs[Number(isSame)];
  helpConfirmPassword.style.color = colors[Number(isSame)];
}

function main() {
  const signupBtn = document.getElementById('signup');
  const email = document.getElementById('email');
  const confirmPassword = document.getElementById('confirm-password');

  email.addEventListener('keyup', isValidInputEmail);
  confirmPassword.addEventListener('keyup', isSamePassword);
  signupBtn.addEventListener('click', submitSignup);
}

main();