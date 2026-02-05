document.addEventListener("DOMContentLoaded", function () {

    const signupForm = document.getElementById("signupForm");
    const warningCard = document.getElementById("warningCard");
    const warningText = document.getElementById("warningText");

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();
        
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const star_name = document.getElementById("star_name").value.trim();

        // Validation checks
        if (username.length < 3) {
            warningCard.classList.remove("d-none");
            warningText.innerText = "Username must be at least 3 characters long";
            return;
        }

        if (email.length === 0 || !email.includes("@")) {
            warningCard.classList.remove("d-none");
            warningText.innerText = "Please enter a valid email address";
            return;
        }

        if (star_name.length < 2) {
            warningCard.classList.remove("d-none");
            warningText.innerText = "Star name must be at least 2 characters long";
            return;
        }

        if (password !== confirmPassword) {
            warningCard.classList.remove("d-none");
            warningText.innerText = "Passwords do not match";
            return;
        }

        console.log("Signup successful");
        console.log("Username:", username);
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Star Name:", star_name)

        warningCard.classList.add("d-none");

        //Prepare req.body
        const data = {
            username: username,
            email: email,
            password: password,
            star_name: star_name
        };

        const callback = (responseStatus, responseData) => {

            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);

            
            if (responseStatus == 200) {
                if (responseData.token) {
                    localStorage.setItem("token", responseData.token);
                    window.location.href = "profile.html";
                }
            } 
            else {
                warningCard.classList.remove("d-none");
                warningText.innerText = responseData.message;
            }
        };

        fetchMethod(currentUrl + "/api/authentication/register", callback, "POST", data);

        signupForm.reset();
    });
});