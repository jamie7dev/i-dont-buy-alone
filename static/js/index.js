"use strict";

import { getCookie } from "./cookie.js";

function getProfile() {
  window.location.href = '/profile';
}

function main() {
  const search = document.getElementById('search');
  const nickname = `${localStorage.getItem('nickname')}님 함께 나눠요💚`;
  const profileBox = document.querySelector('.profile-box');

  profileBox.addEventListener('click', getProfile);
  getCookie('mytoken') ? search.placeholder = nickname : search.placeholder;
}

main();
