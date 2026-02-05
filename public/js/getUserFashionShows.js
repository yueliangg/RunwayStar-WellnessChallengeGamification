// Store fashion shows globally
let fashionShowsArray = [];

// Load fashion shows and attach modal logic
function loadUserFashionShows(token) {
    const callback = (responseStatus, responseData) => {
        const fashionShows = responseData;
        if (responseStatus !== 200) {
            console.error("Failed to load fashion shows:", fashionShows);
            return;
        }

        // Store shows globally
        fashionShowsArray = fashionShows;

        const showDiv = document.getElementById("userFashionShows");
        showDiv.innerHTML = "";

        if (fashionShows.length === 0) {
            showDiv.innerHTML = '<p class="text-muted">No fashion shows yet.</p>';
            return;
        }

        fashionShows.forEach(show => {
            const card = document.createElement("div");
            card.className = "col-12 col-md-6 mb-3";
            card.innerHTML = `
                <div class="card p-3 d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title mb-1">${show.description || 'Fashion Show'}</h5>
                        <p class="mb-0">Date: ${new Date(show.date).toLocaleDateString()}</p>
                        <p class="mb-0">Participants: ${show.participants}</p>
                    </div>
                    <button class="btn btn-sm show-btn" data-show-id="${show.show_id}">Show</button>
                </div>
            `;

            // Attach click event to the button
            const button = card.querySelector(".show-btn");
            button.addEventListener("click", function() {
                openFashionShowModal(this.dataset.showId, token);
            });

            showDiv.appendChild(card);
        });
    };

    fetchMethod(currentUrl + "/api/users/fashion-show", callback, "GET", null, token);
}

// Open Modal Function
function openFashionShowModal(showId, token) {
    console.log("Opening modal for show:", showId);
    
    if (!token) {
        console.error("No token provided");
        return;
    }

    // Find show info from stored array
    const show = fashionShowsArray.find(s => s.show_id == showId);
    
    if (!show) {
        console.error("Show not found:", showId);
        return;
    }

    // Modal body content with same styling as results modal
    const bodyContent = `
        <div class="ranking-item p-3 mb-3 border rounded">
            <div class="mb-3">
                <h6 class="mb-2"><i class="fas fa-calendar-alt me-2"></i>Event Details</h6>
                <p class="mb-2"><strong>Description:</strong> ${show.description || 'Fashion Show'}</p>
                <p class="mb-0"><strong>Date:</strong> ${new Date(show.date).toLocaleDateString()}</p>
            </div>
        </div>
        
        <div class="ranking-item p-3 mb-3 border rounded">
            <h6 class="mb-3"><i class="fas fa-star me-2"></i>Your Performance</h6>
            <div id="modal-user-rank" class="text-center">
                <div class="spinner-border text-purple" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    `;

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById("modal"));
    
    document.getElementById('modalTitle').innerHTML = '<i class="fas fa-award me-2"></i>Fashion Show Details';
    document.getElementById('modalBody').innerHTML = bodyContent;
    
    // Change submit button to delete button
    const submitBtn = document.getElementById('modalSubmit');
    submitBtn.textContent = 'Delete My Entry';
    submitBtn.className = 'btn btn-danger';
    
    // Delete button handler - pass modal instance
    submitBtn.onclick = () => deleteFashionShowEntry(showId, token, modal);
    
    modal.show();

    // Fetch user rank after modal is shown
    setTimeout(() => {
        const callback = (responseStatus, responseData) => {
            const rankEl = document.getElementById("modal-user-rank");
            
            if (!rankEl) {
                console.log("Rank element no longer exists");
                return;
            }
            
            console.log("Response Status:", responseStatus);
            console.log("Response Data:", responseData);
            
            // Handle 409 - show is ongoing
            if (responseStatus === 409) {
                rankEl.innerHTML = `
                    <div class="alert alert-info">
                        <i class="fas fa-clock me-2"></i>Show is still ongoing<br>
                        <small>Rankings not available yet</small>
                    </div>
                `;
                return;
            }
            
            if (responseStatus !== 200) {
                rankEl.innerHTML = `<div class="alert alert-danger">Error loading rank</div>`;
                return;
            }

            // Check if user has no rank
            if (!responseData.final_rank || responseData.final_rank === null || responseData.final_rank > 3) {
                rankEl.innerHTML = `
                    <div class="text-muted">
                        <i class="fas fa-info-circle me-2"></i>Not ranked in top 3
                    </div>
                `;
            } else {
                const rank = responseData.final_rank;
                const medalIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉';
                const medalClass = rank === 1 ? 'text-warning' : rank === 2 ? 'text-secondary' : 'text-danger';
                
                rankEl.innerHTML = `
                    <div class="d-flex justify-content-center align-items-center">
                        <span class="medal-icon ${medalClass} me-3" style="font-size: 3rem;">${medalIcon}</span>
                        <div class="text-start">
                            <h5 class="mb-1">Rank #${responseData.final_rank}</h5>
                            <p class="mb-0">
                                <small class="text-muted">Total Attraction: </small>
                                <strong class="attraction-score">${responseData.total_attraction}</strong>
                            </p>
                        </div>
                    </div>
                `;
            }
        };

        // Fixed: Use showId parameter instead of undefined fashion_show_id variable
        fetchMethod(currentUrl + `/api/runway-star/${showId}/user-rank`, callback, "GET", null, token);
    }, 100);
}

// Delete Entry Function
function deleteFashionShowEntry(showId, token, modal) {
    if (!confirm("Are you sure you want to delete your entry?")) return;

    const deleteCallback = (status, data) => {
        if (status === 200 || status === 204) {
            alert("Your entry was deleted successfully!");
            modal.hide();
            loadUserFashionShows(token); // Refresh list
        } else if (status === 409) {
            alert("Cannot delete entry - This fashion show has already been finalized.");
            modal.hide();
        } else if (status === 404) {
            alert("Entry not found in this fashion show.");
            modal.hide();
        } else {
            console.error("Delete failed:", data);
            alert(data.message || "Failed to delete entry. Please try again.");
            modal.hide();
        }
    };

    fetchMethod(currentUrl + `/api/fashion-show-entry/${showId}`, deleteCallback, "DELETE", null, token);
}