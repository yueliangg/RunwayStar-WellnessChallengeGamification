// token.js - Define function globally, not inside DOMContentLoaded
function getToken() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return null;
    }
    return token;
}