"use strict";

import { getCookie } from "./cookie.js";

function main() {
  const search = document.getElementById('search');
  const nickname = `${localStorage.getItem('nickname')}님 함께 나눠요💚`;
  getCookie('mytoken') ? search.placeholder = nickname : search.placeholder;
}

main();
