// Globals 
let availableChallengesArray = [];
let acceptedChallengeIds = new Set();

// DOMContentLoaded 
document.addEventListener("DOMContentLoaded", function () {
    const token = getToken();
    if (!token) return;

    eventListeners(token);
    loadAllUserData(token);
});

// Event Listeners 
function eventListeners(token) {
    const challengeForm = document.getElementById("challengeForm");
    if (challengeForm) {
        challengeForm.addEventListener("submit", (event) => createChallenges(event, token));
    }
}

// Create Challenge 
function createChallenges(event, token) {
    event.preventDefault();
    const description = document.getElementById("challengeDescription").value.trim();
    const points = document.getElementById("challengePoints").value; 

    if (!description || !points) {
        showErrorModal('Input Required', 'Please fill in all fields!');
        return;
    }

    const data = {
        description: description,
        user_id: currentUserId,
        points: parseInt(points)
    };

    const callback = (responseStatus, responseData) => {
        if (responseStatus === 201) {
            showSuccessModal('Challenge Created', 'Your challenge has been created successfully!');
            
            document.getElementById("challengeForm").reset();
            
            // Add new challenge to available challenges array and display it
            const newChallenge = responseData;
            availableChallengesArray.push(newChallenge);
            
            const availableList = document.getElementById("availableChallenges");
            const card = createAvailableChallengeCard(newChallenge, token);
            availableList.insertBefore(card, availableList.firstChild);
        } else {
            showErrorModal('Creation Failed', 'Failed to create challenge');
        }
    };

    fetchMethod(currentUrl + '/api/challenges/create', callback, "POST", data, token);
}

// Create Available Challenge Card (Reusable)
function createAvailableChallengeCard(challenge, token) {
    const card = document.createElement("div");
    card.className = "col-md-4 col-sm-6 mb-3";
    card.setAttribute('data-challenge-id', challenge.id);
    card.innerHTML = `
        <div class="card p-3 h-100">
            <h5 class="card-title">${challenge.description}</h5>
            <p class="card-text">Points: ${challenge.points}</p>
            <p class="card-text">Created By: ${challenge.creator_id}</p>
            <div class="d-flex gap-2">
                <button class="btn btn-primary accept-btn flex-grow-1">Accept Challenge</button>
                <button class="btn btn-danger delete-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;

    card.querySelector(".accept-btn").addEventListener("click", () => {
        openModal(
            "Enter Challenge Details",
            `<textarea id="detailsInput" class="form-control" placeholder="Enter what you did"></textarea>`,
            () => {
                const details = document.getElementById("detailsInput").value.trim();
                if (!details) {
                    showErrorModal('Input Required', 'Please enter details!');
                    return;
                }
                acceptChallenge(challenge.id, details, token, challenge);
            }
        );
    });

    card.querySelector(".delete-btn").addEventListener("click", () => {
        openModal(
            '<i class="fas fa-trash me-2"></i>Delete Challenge',
            `
                <div class="text-center py-3">
                    <i class="fas fa-exclamation-triangle text-warning fa-3x mb-3"></i>
                    <p class="mb-0">Are you sure you want to delete this challenge?</p>
                </div>
            `,
            () => {
                deleteChallengeFromAdmin(challenge.id, token);
            },
            {
                centered: true,
                headerClass: 'bg-warning text-dark',
                bodyClass: 'modal-body'
            }
        );
    });

    return card;
}

// Create Accepted Challenge Card (Reusable)
function createAcceptedChallengeCard(challenge, token) {
    const card = document.createElement("div");
    card.className = "col-md-4 col-sm-6 mb-3";
    card.setAttribute('data-challenge-id', challenge.challenge_id);
    card.innerHTML = `
        <div class="card p-3 h-100">
            <h5 class="card-title">${challenge.description}</h5>
            <p class="card-text">Points: ${challenge.points}</p>
            <p class="card-text">Details: ${challenge.details}</p>
            <p class="card-text">Creator ID: ${challenge.creator_id}</p>
            <button class="btn btn-danger btn-sm mt-2 delete-accepted-btn">
                <i class="fas fa-trash me-1"></i>Delete
            </button>
        </div>
    `;

    card.querySelector(".delete-accepted-btn").addEventListener("click", () => {
        deleteAcceptedChallenge(challenge.challenge_id, token, challenge);
    });

    return card;
}

// Display User Completions 
function displayUserCompletions(responseData, token) {
    if (!responseData || !responseData.userCompletions) {
        console.error("No user completions data provided");
        return;
    }

    const acceptedChallenges = responseData.userCompletions || [];

    // Store accepted challenge IDs in global variable
    acceptedChallengeIds = new Set(acceptedChallenges.map(c => c.challenge_id));

    // Render accepted challenges
    const acceptedList = document.getElementById("acceptedChallenges");
    if (!acceptedList) return;
    
    acceptedList.innerHTML = "";

    acceptedChallenges.forEach(challenge => {
        const card = createAcceptedChallengeCard(challenge, token);
        acceptedList.appendChild(card);
    });

    loadAllChallenges(token);
}

// Load and Render Available Challenges
function loadAllChallenges(token) {
    const callback = (responseStatus, responseData) => {
        const challenges = responseData;

        if (responseStatus !== 200 || !challenges) {
            console.error("Failed to load challenges:", challenges);
            return;
        }

        // Filter out already accepted challenges using global variable
        availableChallengesArray = challenges.filter(c => !acceptedChallengeIds.has(c.id));
        
        const availableList = document.getElementById("availableChallenges");
        if (!availableList) return;
        
        availableList.innerHTML = "";

        availableChallengesArray.forEach(challenge => {
            const card = createAvailableChallengeCard(challenge, token);
            availableList.appendChild(card);
        });
    };

    fetchMethod(currentUrl + "/api/challenges", callback, "GET", null, token);
}

// Accept Challenge 
function acceptChallenge(challengeId, details, token, challengeData) {
    const data = { details };

    const callback = (responseStatus, responseData) => {
        if (responseStatus === 201) {
            // Add to accepted set
            acceptedChallengeIds.add(challengeId);

            // Remove card from available challenges
            const availableList = document.getElementById("availableChallenges");
            const cardToRemove = availableList.querySelector(`[data-challenge-id="${challengeId}"]`);
            if (cardToRemove) {
                cardToRemove.remove();
            }

            // Remove from array
            availableChallengesArray = availableChallengesArray.filter(c => c.id !== challengeId);

            // Create and add accepted challenge card
            const acceptedChallenge = {
                challenge_id: challengeId,
                description: challengeData.description,
                points: challengeData.points,
                details: details,
                creator_id: challengeData.creator_id
            };

            const acceptedList = document.getElementById("acceptedChallenges");
            const acceptedCard = createAcceptedChallengeCard(acceptedChallenge, token);
            acceptedList.insertBefore(acceptedCard, acceptedList.firstChild);

            // Update points immediately - ADD the points
            updateUserPoints(challengeData.points);

            showSuccessModal('Challenge Accepted', 'You have successfully accepted the challenge!');

        } else {
            showErrorModal('Accept Failed', 'Failed to accept challenge');
        }
    };

    fetchMethod(currentUrl + `/api/challenges/${challengeId}/record`, callback, "POST", data, token);
}

// Delete Accepted Challenge Function
function deleteAcceptedChallenge(challengeId, token, challengeData) {
    const bodyContent = `
        <div class="text-center py-3">
            <i class="fas fa-exclamation-triangle text-warning fa-3x mb-3"></i>
            <p class="mb-0">Are you sure you want to delete this challenge?</p>
            <p class="text-danger fw-bold">Your points will be deducted.</p>
        </div>
    `;

    const confirmDelete = () => {
        performDelete(challengeId, token, challengeData);
    };

    openModal(
        '<i class="fas fa-trash me-2"></i>Delete Challenge',
        bodyContent,
        confirmDelete,
        {
            centered: true,
            headerClass: 'bg-warning text-dark',
            bodyClass: 'modal-body'
        }
    );
}

// Perform Delete (from accepted challenges)
function performDelete(challengeId, token, challengeData) {
    console.log("Performing delete for challenge:", challengeId);
    
    const callback = (responseStatus, responseData) => {
        if (responseStatus === 200 || responseStatus === 204) {
            console.log("Delete successful - removing from UI");
            
            // Remove from accepted set
            acceptedChallengeIds.delete(challengeId);
            
            // Find and remove the card from accepted challenges
            const acceptedList = document.getElementById("acceptedChallenges");
            const cardToRemove = acceptedList.querySelector(`[data-challenge-id="${challengeId}"]`);
            if (cardToRemove) {
                cardToRemove.remove();
            }

            // Update points immediately - SUBTRACT the points
            updateUserPoints(-challengeData.points);
            
            // Add challenge back to available challenges
            const challenge = {
                id: challengeId,
                description: challengeData.description,
                points: challengeData.points,
                creator_id: challengeData.creator_id
            };
            
            availableChallengesArray.push(challenge);
            const availableList = document.getElementById('availableChallenges');
            const card = createAvailableChallengeCard(challenge, token);
            availableList.insertBefore(card, availableList.firstChild);
            
            showSuccessModal(
                'Challenge Deleted',
                'The challenge has been successfully deleted and your points have been deducted.'
            );
        } else {
            console.error("Failed to delete challenge:", responseData);
            showErrorModal(
                'Delete Failed',
                responseData.message || 'An error occurred while deleting the challenge.'
            );
        }
    };

    const url = currentUrl + `/api/challenges/${challengeId}/record`;
    fetchMethod(url, callback, "DELETE", null, token);
}

// Update user points in UI without reloading
function updateUserPoints(pointsToAdd) {
    const floatPoints = document.getElementById("float_points");
    if (floatPoints) {
        const currentPoints = parseInt(floatPoints.textContent) || 0;
        const newPoints = currentPoints + pointsToAdd;
        floatPoints.textContent = newPoints;
    }
}

// Delete Challenge from Admin (for available challenges - permanent delete)
function deleteChallengeFromAdmin(challengeId, token) {
    const callback = (responseStatus, responseData) => {
        if (responseStatus === 200 || responseStatus === 204) {
            // Remove from available challenges array
            availableChallengesArray = availableChallengesArray.filter(c => c.id !== challengeId);
            
            // Remove card from DOM
            const availableList = document.getElementById("availableChallenges");
            const cardToRemove = availableList.querySelector(`[data-challenge-id="${challengeId}"]`);
            if (cardToRemove) {
                cardToRemove.remove();
            }
            
            showSuccessModal('Challenge Deleted', 'The challenge has been deleted successfully.');
        } else {
            showErrorModal('Delete Failed', 'Failed to delete challenge');
        }
    };
    
    fetchMethod(currentUrl + `/api/challenges/${challengeId}`, callback, "DELETE", null, token);
}