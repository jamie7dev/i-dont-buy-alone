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
      replyContent: formReply.value,
      date: dateToYYYYMMDDHHMMSS(),
    }),
  };

  let response = await fetch(URL, options).catch(error => console.log(error));
  let result = await response.json().catch(error => console.log(error));
  console.log(result);
}

function main() {
  const replySubmitBtn = document.getElementById('reply-submit-btn');

  replySubmitBtn.addEventListener('click', replySubmit);
}

main();