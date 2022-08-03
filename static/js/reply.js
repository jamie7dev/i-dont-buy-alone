"use strict";

function dateToYYYYMMDDHHMMSS() {
  return new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '');
}

async function replySubmit() {
  const queryString = new URLSearchParams(window.location.search);
  const boardId = queryString.get('id');
  const formReply = document.getElementById('form-reply');
  const URL = '/detail/reply';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      boardId: boardId,
      accountEmail: localStorage.getItem('accountEmail'),
      nickname: localStorage.getItem('nickname'),
      replyContent: formReply.value,
      date: dateToYYYYMMDDHHMMSS(),
    }),
  };

  let response = await fetch(URL, options).catch(error => console.log(error));
  let result = await response.json().catch(error => console.log(error));

  result.repliable ? window.location.reload() : alert('댓글을 달 수 없습니다.');
}

export { replySubmit, };