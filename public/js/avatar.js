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
            // Reload user profile to sync with backend
            const token = localStorage.getItem("token");
            if (token) {
                loadUserProfile(token);
            }
        } else {
            console.error("Failed to save avatar. Status:", status, "Response:", responseData);
            alert("Failed to update avatar. Please try again.");
            // Reload to revert to original avatar
            const token = localStorage.getItem("token");
            if (token) {
                loadUserProfile(token);
            }
        }
    };

    const token = localStorage.getItem("token");
    fetchMethod(currentUrl + "/api/users/update-avatar", callback, "PUT", data, token);
}

