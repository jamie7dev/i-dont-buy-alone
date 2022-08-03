"use strict";

import { deleteCookie } from './cookie.js'

function onSignOut() {
  deleteCookie('mytoken');
  localStorage.clear();
  
  window.location.href = '/';
}

async function showDeleteButton() {
  const queryString = new URLSearchParams(window.location.search).get('id');
  const URL = '/detail';
  const nickname = localStorage.getItem('nickname');
  const accountEmail = localStorage.getItem('accountEmail');
  const navBar = document.querySelector('.navbar');
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'accountEmail': accountEmail,
      'nickname': nickname,
      'queryString': queryString,
    }),
  };

  let response = await fetch(URL, options).catch(error => console.log(error));
  let result = await response.json().catch(error => console.log(error));
  console.log(result);

  if (result.isOwn) {
    let template = `
    <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <button class="btn btn-primary btn-submit btn-outline-light" id="btn-delete" style="background-color: #1E7E5E;">
        삭제하기
        </button>
      </li>
    </ul>
    `;
    navBar.insertAdjacentHTML('beforeend', template);
  }

  const btnDelete = document.getElementById('btn-delete');
  btnDelete.addEventListener('click', confirmDelete);
}

function confirmDelete(event) {
  Swal.fire({
    title: '정말 삭제하실 건가요?',
    text: "복구하실 수  없어요!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '네, 삭제할게요!'
  }).then((result) => {
    if (result.isConfirmed) {
      event.preventDefault();
      console.log(result);
      Swal.fire(
        '삭제가 완료되었습니다',
        '',
        'success'
      ).then((result) => {
        deleteBoard();
      });
    }
  });
}

function errorDelete() {
  Swal.fire({
    icon: 'error',
    title: '존재하지 않는 게시물이에요😂',
    text: '',
    footer: '<a href="/">홈으로 이동하기</a>'
  });
}

async function deleteBoard() {
  const queryString = new URLSearchParams(window.location.search).get('id');
  const URL = `/detail/${queryString}/delete`;
  const options = {
    method: 'DELETE',
  };

  let response = await fetch(URL, options).catch(error => console.log(error));
  let result = await response.json().catch(error => console.log(error));
  console.log(result);

  result.delete ? window.location.href = '/' : errorDelete();
}

export { onSignOut, showDeleteButton, };