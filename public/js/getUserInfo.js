// DOM content is loaded - Create floating stats box HTML
document.addEventListener('DOMContentLoaded', function () {
  // Floating stats box HTML with avatar
  const getUserInfoHTML = `
    <div class="user-stats-float" id="userStatsFloat" style="display: none;">
      <img id="float_avatar" 
           src="https://raw.githubusercontent.com/yueliangg/images/main/pfp1.jpg" 
           alt="User Avatar" 
           class="float-avatar-img mb-2">
      <h6><i class="fas fa-star"></i> <span id="float_star_name">Star Name</span></h6>
      <div class="stat-item">
        <span><i class="fas fa-fire text-warning"></i> Attraction</span>
        <span class="stat-value" id="float_attraction_score">0</span>
      </div>
      <div class="stat-item">
        <span><i class="fas fa-coins text-success"></i> Points</span>
        <span class="stat-value" id="float_points">0</span>
      </div>
      <div class="stat-item">
        <span><i class="fas fa-gem text-info"></i> Diamonds</span>
        <span class="stat-value" id="float_diamonds">0</span>
      </div>
    </div>
  `;

  // Insert stats box into page
  const getUserInfoContainer = document.getElementById("getUserInfo");
  if (getUserInfoContainer) {
    getUserInfoContainer.innerHTML = getUserInfoHTML;
  }
});

// Load User Profile 
function loadUserProfile(token) {
    const callback = (status, user) => {
        if (status !== 200 || !user) return;

        currentUserId = user.id;

        // Update profile card (if on profile page)
        const usernameEl = document.getElementById("username");
        const starNameEl = document.getElementById("star_name");
        const pointsEl = document.getElementById("points");
        const diamondsEl = document.getElementById("diamonds");
        const attractionEl = document.getElementById("attraction_score");
        const selectedAvatar = document.getElementById("selectedAvatar");

        if (usernameEl) usernameEl.textContent = user.username || "Username";
        
        if (starNameEl) {
            starNameEl.innerHTML = `
                ${user.star_name || "Star Name"}
                <i class="fas fa-edit edit-icon" id="edit_star_name"></i>
            `;
        }
        if (pointsEl) pointsEl.textContent = user.points || 0;
        if (diamondsEl) diamondsEl.textContent = user.diamonds || 0;
        if (attractionEl) attractionEl.textContent = user.attraction_score || 0;

        
        // Update profile page avatar
        if (selectedAvatar && user.profile_avatar) {
            selectedAvatar.src = `https://raw.githubusercontent.com/yueliangg/images/main/${user.profile_avatar}`;
        }
        

        // Update floating stats box
        const floatStarName = document.getElementById("float_star_name");
        const floatPoints = document.getElementById("float_points");
        const floatDiamonds = document.getElementById("float_diamonds");
        const floatAttractionScore = document.getElementById("float_attraction_score");
        const floatAvatar = document.getElementById("float_avatar");
        const userStatsFloat = document.getElementById("userStatsFloat");

        if (floatStarName) floatStarName.textContent = user.star_name || "Star Name";
        if (floatPoints) floatPoints.textContent = user.points || 0;
        if (floatDiamonds) floatDiamonds.textContent = user.diamonds || 0;
        if (floatAttractionScore) floatAttractionScore.textContent = user.attraction_score || 0;
        
        // Update floating box avatar
        if (floatAvatar && user.profile_avatar) {
            floatAvatar.src = `https://raw.githubusercontent.com/yueliangg/images/main/${user.profile_avatar}`;
        }
        
        const currentPage = window.location.pathname.split("/").pop();
        if (
          userStatsFloat &&
          currentPage !== "profile.html" &&
          currentPage !== "store.html"
        ) {
          userStatsFloat.style.display = "block";
        }

        
        // Show/hide navbar buttons
        const loginNav = document.getElementById("loginNav");
        const registerNav = document.getElementById("registerNav");
        const profileNav = document.getElementById("profileNav");
        const logoutNav = document.getElementById("logoutNav");
        
        if (loginNav) loginNav.style.display = "none";
        if (registerNav) registerNav.style.display = "none";
        if (profileNav) profileNav.style.display = "block";
        if (logoutNav) logoutNav.style.display = "block";
    };

    fetchMethod(currentUrl + "/api/users/me", callback, "GET", null, token);
}