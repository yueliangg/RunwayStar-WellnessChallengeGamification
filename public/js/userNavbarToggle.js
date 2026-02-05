//DOMContentLoaded Event waits for html content to load first
document.addEventListener("DOMContentLoaded", function () {

  //Reference the button Divs in the navbar
  const loginButton = document.getElementById("loginButton");
  const registerButton = document.getElementById("registerButton");
  const profileButton = document.getElementById("profileButton");
  const logoutButton = document.getElementById("logoutButton");

  // get JWT token from local storage
  const token = localStorage.getItem("token");

  // if Token exists, means they're logged in
  if (token) {

    //add dnone <-- "Display none"  property to Login and register Button
    //This hides the two buttons
    loginButton.classList.add("d-none");
    registerButton.classList.add("d-none");

    //Remove dnone <-- "Display none" property to Profile and Login Button
    //This unhides the two buttons
    profileButton.classList.remove("d-none");
    logoutButton.classList.remove("d-none");
  } 
  
  // if Token does not exists, means they're logged out
  else {
    // Token does not exist, show login and register buttons and hide profile and logout buttons
    loginButton.classList.remove("d-none");
    registerButton.classList.remove("d-none");
    profileButton.classList.add("d-none");
    logoutButton.classList.add("d-none");
  }

  //Event Logged out button
  // Remove the token from local storage and redirect to index.html
  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });
});