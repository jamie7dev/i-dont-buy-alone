"use strict";

import { getCookie } from "./cookie.js";

function getProfile() {
  window.location.href = '/profile';
}

function main() {
  const profileBox = document.querySelector('.profile-box');

  profileBox.addEventListener('click', getProfile);
}

main();
