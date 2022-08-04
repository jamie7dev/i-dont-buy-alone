"use strict";

import { showDeleteButton } from "./delete.js";
import { replySubmit } from "./reply.js";

function getProfile() {
  window.location.href = '/profile';
}

function main() {
  const replySubmitBtn = document.getElementById('reply-submit-btn');
  document.addEventListener('DOMContentLoaded', showDeleteButton);
  const profile = document.getElementById('uploader');
  profile.addEventListener('click', getProfile)
  replySubmitBtn.addEventListener('click', replySubmit);
}

main();