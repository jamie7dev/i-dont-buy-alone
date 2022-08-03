"use strict";

import { onSignOut } from "./delete.js";

function main() {
  const signOutBtn = document.getElementById('signout');
  signOutBtn.addEventListener('click', onSignOut);
}

main();