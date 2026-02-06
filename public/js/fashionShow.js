// Get DOM elements
let ongoingShowsContainer;
let completedShowsContainer;
let ongoingCount;
let completedCount;
let modalContainer;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    const token = getToken();
    if (!token) return;

    // Initialize DOM elements
    ongoingShowsContainer = document.getElementById("ongoingFashionShows");
    completedShowsContainer = document.getElementById("completedFashionShows");
    ongoingCount = document.getElementById("ongoingCount");
    completedCount = document.getElementById("completedCount");
    modalContainer = document.getElementById("modalContainer");

    // Load all shows with single fetch (only on page load)
    loadAllShows(token);
});

// Load all shows with single fetch (ONLY called on initial page load)
function loadAllShows(token) {
    const callback = (responseStatus, responseData) => {
        if (responseStatus === 200) {
            const ongoingShows = responseData.ongoing || [];
            const completedShows = responseData.completed || [];
            
            // Update counts
            ongoingCount.innerText = ongoingShows.length;
            completedCount.innerText = completedShows.length;
            
            // Display ongoing shows
            displayOngoingShows(ongoingShows, token);
            
            // Display completed shows
            displayCompletedShows(completedShows, token);
        } else {
            console.log("Error loading shows");
            showError(ongoingShowsContainer, "Failed to load fashion shows");
            showError(completedShowsContainer, "Failed to load fashion shows");
        }
    };

    fetchMethod(currentUrl + "/api/fashion-show/all", callback, "GET", null, token);
}

// Display ongoing shows
function displayOngoingShows(shows, token) {
    if (shows.length === 0) {
        ongoingShowsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                <p class="text-muted">No ongoing shows at the moment. Check back soon!</p>
            </div>
        `;
        return;
    }

    ongoingShowsContainer.innerHTML = "";
    
    shows.forEach(show => {
        const card = createOngoingShowCard(show, token);
        ongoingShowsContainer.innerHTML += card;
    });
    
    // Add event listeners
    addRegisterEventListeners(token);
    addFinalizeButtonListeners(token);
}

// Display completed shows
function displayCompletedShows(shows, token) {
    if (shows.length === 0) {
        completedShowsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-trophy fa-3x text-muted mb-3"></i>
                <p class="text-muted">No completed shows yet.</p>
            </div>
        `;
        return;
    }

    completedShowsContainer.innerHTML = "";
    
    shows.forEach(show => {
        const card = createCompletedShowCard(show);
        completedShowsContainer.innerHTML += card;
    });
    
    addViewResultsEventListeners(token);
}

// Create ongoing show card HTML
function createOngoingShowCard(show, token) {
    const showDate = new Date(show.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const isFull = show.participants >= 5;

    return `
    <div class="col-md-6 col-lg-4 mb-4" id="ongoing-show-${show.id}">
        <div class="card h-100 shadow-sm border-0 fashion-show-card">
            <div class="card-header text-white fashion-show-header">
                <h5 class="mb-0">
                    <i class="fas fa-star me-2"></i>Show #${show.id}
                </h5>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <p class="text-muted mb-2">
                        <i class="far fa-calendar me-2"></i>${showDate}
                    </p>
                    <p class="mb-2">${show.description || 'Join this exciting fashion show!'}</p>
                </div>
                
                <div class="d-flex justify-content-between mb-3 align-items-center">
                    <span class="badge bg-purple-light rounded-pill" id="participants-${show.id}">
                        <i class="fas fa-users me-1"></i>
                        ${show.participants} Participants
                    </span>
                </div>
                ${isFull ? `
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-secondary flex-grow-1" disabled>
                            <i class="fas fa-lock me-1"></i>Show Full
                        </button>
                        <button class="btn btn-success finalize-show-btn" data-show-id="${show.id}">
                            <i class="fas fa-check me-1"></i>Finalize
                        </button>
                    </div>
                ` : `
                    <button class="btn btn-authentication w-100 register-btn" data-show-id="${show.id}">
                        <i class="fas fa-plus-circle me-2"></i>Register Now
                    </button>
                `}
            </div>
        </div>
    </div>
    `;
}

// Create completed show card HTML
function createCompletedShowCard(show) {
    const showDate = new Date(show.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `
        <div class="col-md-6 col-lg-4 mb-4" id="completed-show-${show.id}">
            <div class="card h-100 shadow-sm border-0 fashion-show-card">
                <div class="card-header text-white fashion-show-header">
                    <h5 class="mb-0">
                        <i class="fas fa-medal me-2"></i>Show #${show.id}
                    </h5>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <p class="text-muted mb-2">
                            <i class="far fa-calendar me-2"></i>${showDate}
                        </p>
                        <p class="mb-2">${show.description || 'Fashion show completed'}</p>
                    </div>
                    
                    <div class="mb-3">
                        <span class="badge bg-purple-light rounded-pill">
                            <i class="fas fa-check-circle me-1"></i>Completed
                        </span>
                        <span class="badge bg-purple-light rounded-pill ms-2">
                            <i class="fas fa-users me-1"></i>${show.participants} Participants
                        </span>
                    </div>

                    <button class="btn w-100 view-results-btn" data-show-id="${show.id}">
                        <i class="fas fa-trophy me-2"></i>View Results
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Add event listeners to register buttons
function addRegisterEventListeners(token) {
    const registerButtons = document.querySelectorAll('.register-btn');
    
    registerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const showId = this.getAttribute('data-show-id');
            registerForShow(showId, token);
        });
    });
}

// Add event listeners to view results buttons
function addViewResultsEventListeners(token) {
    const viewResultsButtons = document.querySelectorAll('.view-results-btn');
    
    viewResultsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const showId = this.getAttribute('data-show-id');
            viewShowResults(showId, token);
        });
    });
}

// Finalize button listener
function addFinalizeButtonListeners(token) {
    const finalizeButtons = document.querySelectorAll(".finalize-show-btn");
    finalizeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const showId = btn.dataset.showId;

            const data = {
                fashion_show_id: parseInt(showId)
            };

            const callback = (status, responseData) => {
            if (status === 200) {
                // Find current user's entry in the response
                const currentUserEntry = responseData.find(entry => entry.user_id === currentUserId);
                
                if (currentUserEntry) {
                    const diamondsWon = currentUserEntry.diamonds_won || 0;
                    
                    if (diamondsWon > 0) {
                        alert(`Fashion show finalized! You earned ${diamondsWon} diamonds!`);
                        
                        // MANUALLY UPDATE DIAMONDS
                        updateUserDiamonds(diamondsWon);
                    } else {
                        alert("Fashion show finalized!");
                    }
                }
                
                // Extract show data from first participant
                const showData = {
                    id: responseData[0].show_id,
                    date: responseData[0].date,
                    description: responseData[0].description,
                    participants: responseData[0].participants
                };
                
                const completedCard = createCompletedShowCard(showData);
                
                // Move card from ongoing to completed
                const ongoingCard = document.getElementById(`ongoing-show-${showId}`);
                if (ongoingCard) {
                    ongoingCard.remove();
                    
                    // Update ongoing count
                    ongoingCount.innerText = parseInt(ongoingCount.innerText) - 1;
                    
                    // Remove "no shows" message if exists
                    const noShowsMsg = completedShowsContainer.querySelector('.text-center.py-5');
                    if (noShowsMsg) {
                        completedShowsContainer.innerHTML = "";
                    }
                    
                    completedShowsContainer.innerHTML += completedCard;
                    
                    // Update completed count
                    completedCount.innerText = parseInt(completedCount.innerText) + 1;
                    
                    // Store the participants data for the view results button
                    // You can store it in a data attribute or a global cache
                    window.fashionShowResults = window.fashionShowResults || {};
                    window.fashionShowResults[showId] = responseData; // Store full participant array
                    
                    // Re-attach event listeners
                    addViewResultsEventListeners(token);
                    
                    // Check if ongoing is now empty
                    if (ongoingShowsContainer.children.length === 0) {
                        ongoingShowsContainer.innerHTML = `
                            <div class="col-12 text-center py-5">
                                <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                                <p class="text-muted">No ongoing shows at the moment. Check back soon!</p>
                            </div>
                        `;
                    }
                }
            }
        };

            fetchMethod(currentUrl + `/api/runway-star/finalize`, callback, "POST", data, token);
        });
    });
}

// Register for show
function registerForShow(showId, token) {
    const data = { 
        fashion_show_id: parseInt(showId)
    };
    
    console.log('Sending:', JSON.stringify(data));

    const callback = (responseStatus, responseData) => {
        console.log("Register Response:", responseStatus, responseData);

        if (responseStatus == 200 || responseStatus == 201) {
            showSuccessModal("Registration Successful!", "You have been registered for the fashion show!");
            
            // Update participant count on the card
            setTimeout(() => {
                const participantBadge = document.getElementById(`participants-${showId}`);
                if (participantBadge) {
                    const currentCount = parseInt(participantBadge.textContent.match(/\d+/)[0]);
                    const newCount = currentCount + 1;
                    participantBadge.innerHTML = `
                        <i class="fas fa-users me-1"></i>
                        ${newCount} Participants
                    `;
                    
                    // If now full, update button
                    if (newCount >= 5) {
                        const card = document.getElementById(`ongoing-show-${showId}`);
                        const buttonContainer = card.querySelector('.card-body > div:last-child, .card-body > button');
                        buttonContainer.outerHTML = `
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-secondary flex-grow-1" disabled>
                                    <i class="fas fa-lock me-1"></i>Show Full
                                </button>
                                <button class="btn btn-success finalize-show-btn" data-show-id="${showId}">
                                    <i class="fas fa-check me-1"></i>Finalize
                                </button>
                            </div>
                        `;
                        
                        // Re-attach finalize listeners
                        addFinalizeButtonListeners(token);
                    }
                }
            }, 1500);
        } else {
            showErrorModal("Registration Failed", responseData.message || "Unable to register for this show.");
        }
    };

    fetchMethod(currentUrl + "/api/fashion-show-entry/enter", callback, "POST", data, token);
}

// View results for a completed show
function viewShowResults(showId, token) {
    console.log("=== viewShowResults called ===");
    console.log("Show ID:", showId);
    console.log("Token:", token);
    console.log("Request URL:", currentUrl + `/api/runway-star/${showId}`);
    
    const callback = (responseStatus, responseData) => {
        console.log("=== Results Response ===");
        console.log("Response Status:", responseStatus);
        console.log("Response Data:", responseData);
        console.log("Response Data Type:", typeof responseData);
        console.log("Is Array?:", Array.isArray(responseData));

        if (responseStatus == 200) {
            console.log("Success - displaying modal");
            displayResultsModal(responseData);
        } else {
            console.log("Error - showing error modal");
            showErrorModal("Error", "Unable to load results for this show.");
        }
    };

    console.log("Calling fetchMethod...");
    fetchMethod(currentUrl + `/api/runway-star/${showId}`, callback, "GET", null, token);
}

// Display results in a modal
function displayResultsModal(data) {
    const results = Array.isArray(data) ? data : (data.results || []);
    
    console.log("Results data:", data);
    console.log("Results array:", results);

    let rankingsHTML = '';
    
    if (results.length === 0) {
        rankingsHTML = '<p class="text-center text-muted">No results available</p>';
    } else {
        results.forEach((result) => {
            const rank = result.final_rank;
            const medalIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
            const medalClass = rank === 1 ? 'text-warning' : rank === 2 ? 'text-secondary' : rank === 3 ? 'text-danger' : 'text-muted';
            
            rankingsHTML += `
                <div class="ranking-item ${rank <= 3 ? 'top-3' : ''} d-flex justify-content-between align-items-center p-3 mb-3 border rounded">
                    <div class="d-flex align-items-center">
                        <span class="medal-icon ${medalClass}">${medalIcon}</span>
                        <div class="ms-3">
                            <h6 class="mb-1">${result.username}</h6>
                            <small class="star-name">★ ${result.star_name}</small>
                        </div>
                    </div>
                    <div class="text-end">
                        <div class="mb-2">
                            <small class="text-muted">Attraction: </small>
                            <strong class="attraction-score">${result.total_attraction}</strong>
                        </div>
                        <span class="badge bg-purple-light rounded-pill">
                            <i class="fas fa-gem me-1"></i>${result.diamonds_won}
                        </span>
                    </div>
                </div>
            `;
        });
    }

    const bodyContent = `
        <h6 class="results-heading">Top Runway Stars</h6>
        ${rankingsHTML}
    `;

    openModal(
        '<i class="fas fa-plus-circle me-2"></i>Create Fashion Show',
        bodyContent,
        handleCreateShow,  // ← Just the function reference
        {
            size: 'lg',
            centered: true,
            closeButtonClass: 'btn-close',
            hideFooter: false
        }
    );
}

// Create Fashion Show - Open Modal
document.getElementById('createShowBtn')?.addEventListener('click', () => {
    const bodyContent = `
        <form id="createShowForm">
            <div class="mb-3">
                <label for="showDescription" class="form-label">Description</label>
                <textarea class="form-control" id="showDescription" rows="3" required></textarea>
            </div>
            <div class="mb-3">
                <label for="showDate" class="form-label">Show Date</label>
                <input type="datetime-local" class="form-control" id="showDate" required>
            </div>
        </form>
    `;

        openModal(
            '<i class="fas fa-plus-circle me-2"></i>Create Fashion Show',
            bodyContent,
            handleCreateShow,  // ← Just the function reference
            {
                size: 'lg',
                centered: true,
                closeButtonClass: 'btn-close',
                hideFooter: false
            }
        );
});

// Handle Create Show Submission
function handleCreateShow(token) {
    const form = document.getElementById('createShowForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const data = {
        description: document.getElementById('showDescription').value,
        date: document.getElementById('showDate').value,
    };

    const callback = (responseStatus, responseData) => {
        console.log("Create Show Response:", responseStatus, responseData);

        if (responseStatus === 201 || responseStatus === 200) {
            showSuccessModal("Success", "Fashion show created successfully!");
            
            // Create and add new card to ongoing shows
            const newShow = responseData.fashionShow || responseData;
            
            // Remove "no shows" message if exists
            const noShowsMsg = ongoingShowsContainer.querySelector('.text-center.py-5');
            if (noShowsMsg) {
                ongoingShowsContainer.innerHTML = "";
            }
            
            const newCard = createOngoingShowCard(newShow, token);
            ongoingShowsContainer.innerHTML += newCard;
            
            // Update count
            ongoingCount.innerText = parseInt(ongoingCount.innerText) + 1;
            
            // Re-attach event listeners
            addRegisterEventListeners(token);
            addFinalizeButtonListeners(token);
        } else {
            showErrorModal("Error", responseData.message || "Failed to create fashion show.");
        }
    };

    fetchMethod(currentUrl + `/api/fashion-show`, callback, "POST", data, token);
}

// Manually update user diamonds in the UI
function updateUserDiamonds(diamondsToAdd) {
    const diamondsElement = document.getElementById("diamonds");
    if (diamondsElement) {
        const currentDiamonds = parseInt(diamondsElement.textContent) || 0;
        const newDiamonds = currentDiamonds + diamondsToAdd;
        diamondsElement.textContent = newDiamonds;
    }
    
    // Also update float_diamonds if it exists (for navbar/other pages)
    const floatDiamonds = document.getElementById("float_diamonds");
    if (floatDiamonds) {
        const currentFloatDiamonds = parseInt(floatDiamonds.textContent) || 0;
        const newFloatDiamonds = currentFloatDiamonds + diamondsToAdd;
        floatDiamonds.textContent = newFloatDiamonds;
    }
}