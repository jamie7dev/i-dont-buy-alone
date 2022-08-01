"use strict";

function dateToYYYYMMDDHHMMSS() {
  return new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '');
}

function main() {
  const queryString = new URLSearchParams(window.location.search);
  const formReply = document.getElementById('form-reply');
  const replySubmitBtn = document.getElementById('reply-submit-btn');

  replySubmitBtn.addEventListener('click', async (event) => {
    let response = await fetch('/detail/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        queryString: queryString.get('id'),
        replyContent: formReply.value,
        date: dateToYYYYMMDDHHMMSS(),
      }),
    }).catch(error => console.log(error));
    let result = await response.json().catch(error => console.log(error));
    console.log(result);
  })
}

main();