// Global storage for user data
let userData = null;
let currentUserId = null;

// Single fetch function that loads all user data once
function loadAllUserData(token) {
    const callback = (status, responseData) => {
        if (status !== 200 || !responseData) {
            console.error("Failed to load user data");
            return;
        }

        // Store data globally
        userData = responseData;

        // Extract user ID
        if (responseData.user && responseData.user[0]) {
            currentUserId = responseData.user[0].id;
        }

        // Call display functions only if they exist (different pages need different functions)
        if (typeof displayUserProfile === 'function') {
            displayUserProfile(userData);
            
            // Only attach star name listener if the element exists (profile.html/user.html only)
            if (document.getElementById('star_name')) {
                attachStarNameEditListener(token);
            }
        }
        
        if (typeof displayUserFashionShows === 'function') {
            displayUserFashionShows(userData, token);
        }
        
        if (typeof displayUserInventory === 'function') {
            displayUserInventory(userData, token);
        }
        
        if (typeof displayEquippedItems === 'function') {
            displayEquippedItems(userData);
        }
        
        if (typeof displayUserCompletions === 'function') {
            displayUserCompletions(userData, token);
        }
    };

    // Single fetch call
    fetchMethod(currentUrl + "/api/users/me", callback, "GET", null, token);
}