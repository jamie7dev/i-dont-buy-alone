"use strict";

import { showDeleteButton } from "./delete.js";
import { replySubmit } from "./reply.js";

function main() {
  const replySubmitBtn = document.getElementById('reply-submit-btn');
  document.addEventListener('DOMContentLoaded', showDeleteButton);
  
  replySubmitBtn.addEventListener('click', replySubmit);
}

main();