// Initialize event listeners when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
  const selectedAvatar = document.getElementById("selectedAvatar");
  const avatarChoices = document.querySelectorAll(".avatar-choice");

  if (!selectedAvatar || avatarChoices.length === 0) {
    console.error("Avatar elements not found");
    return;
  }

  avatarChoices.forEach(function(avatar) {
    avatar.addEventListener("dragstart", handleDragStart);
  });

  selectedAvatar.addEventListener("dragover", handleDragOver);
  selectedAvatar.addEventListener("drop", handleDrop);
});

// Handle drag start on avatar choices
function handleDragStart(e) {
  const avatarFile = e.target.getAttribute("data-avatar");
  e.dataTransfer.setData("text/plain", avatarFile);
  e.dataTransfer.effectAllowed = "copy";
}

// Handle drag over on main avatar
function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
}

// Handle drop on main avatar
function handleDrop(e) {
  e.preventDefault();
  const avatarFile = e.dataTransfer.getData("text/plain");
  
  if (!avatarFile) {
    console.error("No avatar file data received");
    return;
  }

  // Update main avatar visually
  const selectedAvatar = document.getElementById("selectedAvatar");
  selectedAvatar.src = `https://raw.githubusercontent.com/yueliangg/images/main/${avatarFile}`;

  // Save to backend
  updateAvatarInBackend(avatarFile);
}

// Update avatar in backend
function updateAvatarInBackend(avatarFile) {
    const data = {
        user_id: currentUserId,  
        avatar: avatarFile
    };

    const callback = (status, responseData) => {
        if (status === 200) {
            console.log("Avatar saved successfully:", responseData);
            
            // Update userData globally without reloading
            if (userData && userData.user && userData.user[0]) {
                userData.user[0].profile_avatar = avatarFile;
            }
            
            // Re-display profile with updated data
            displayUserProfile(userData);
            
            // Show success modal
            showSuccessModal("Avatar Updated!", "Your new avatar has been saved successfully.");
        } else {
            console.error("Failed to save avatar. Status:", status, "Response:", responseData);
            
            // Show error modal
            showErrorModal("Update Failed", "Failed to update avatar. Please try again.");
            
            // Revert to original avatar visually
            const selectedAvatar = document.getElementById("selectedAvatar");
            if (userData && userData.user && userData.user[0]) {
                selectedAvatar.src = `https://raw.githubusercontent.com/yueliangg/images/main/${userData.user[0].profile_avatar}`;
            }
        }
    };

    const token = localStorage.getItem("token");
    fetchMethod(currentUrl + "/api/users/update-avatar", callback, "PUT", data, token);
}

