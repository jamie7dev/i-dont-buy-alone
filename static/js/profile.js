"use strict";

import { onSignOut } from "./delete.js";

async function uploadProfile(event) {
  const formData = new FormData();
  const URL = 'profile/img';

  console.log(event.target.files[0]);

  formData.append('profileImg', event.target.files[0]);
  const options = {
    method: 'POST',
    body: formData,
  };

  let response = await fetch(URL, options).catch(error => console.log(error));
  let result = await response.json().catch(error => console.log(error));

  console.log(result);
}

function main() {
  const signOutBtn = document.getElementById('signout');
  const inputProfile = document.getElementById('input-profile');

  inputProfile.addEventListener('change', uploadProfile);
  signOutBtn.addEventListener('click', onSignOut);
}

main();