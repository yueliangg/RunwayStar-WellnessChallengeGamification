// Globals 
let currentUserId = null;
let normalItemsArray = [];
let exclusiveItemsArray = [];

// DOMContentLoaded 
document.addEventListener("DOMContentLoaded", function () {
    const token = getToken();
    if (!token) return;

    loadUserProfile(token);
    loadAllItems(token);
});

// Tab switching functionality
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content-luxury').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.store-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).style.display = 'block';
    
    // Add active class to clicked button
    document.getElementById(tabName + '-tab').classList.add('active');
}

// Load All Items (Normal and Exclusive)
function loadAllItems(token) {
    const callback = (responseStatus, responseData) => {
        if (responseStatus === 200) {
            normalItemsArray = responseData.normal || [];
            exclusiveItemsArray = responseData.exclusive || [];
            
            displayNormalItems();
            displayExclusiveItems();
            
            // Update item count badges
            document.getElementById("normalItemsCount").textContent = normalItemsArray.length;
            document.getElementById("exclusiveItemsCount").textContent = exclusiveItemsArray.length;
        } else {
            showErrorInContainers();
        }
    };
    
    fetchMethod(currentUrl + '/api/items/all', callback, "GET", null, token);
}

// Show error in both containers
function showErrorInContainers() {
    const errorHTML = `
        <div class="col-12 text-center py-5">
            <i class="fas fa-exclamation-circle fa-3x text-muted mb-3"></i>
            <p class="text-muted">Failed to load items</p>
        </div>
    `;
    
    document.getElementById("normalItemsContainer").innerHTML = errorHTML;
    document.getElementById("exclusiveItemsContainer").innerHTML = errorHTML;
}

// Display Normal Items
function displayNormalItems() {
    const container = document.getElementById("normalItemsContainer");
    container.innerHTML = "";
    
    if (normalItemsArray.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
                <p class="text-muted">No normal items available</p>
            </div>
        `;
        return;
    }
    
    normalItemsArray.forEach(item => {
        const card = createItemCard(item, 'normal');
        container.appendChild(card);
    });
}

// Display Exclusive Items
function displayExclusiveItems() {
    const container = document.getElementById("exclusiveItemsContainer");
    container.innerHTML = "";
    
    if (exclusiveItemsArray.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-gem fa-3x text-muted mb-3"></i>
                <p class="text-muted">No exclusive items available</p>
            </div>
        `;
        return;
    }
    
    exclusiveItemsArray.forEach(item => {
        const card = createItemCard(item, 'exclusive');
        container.appendChild(card);
    });
}

// Create Item Card
function createItemCard(item, type) {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";
    
    // Determine currency based on cost_points and cost_diamonds
    const isDiamond = item.cost_points === 0 || item.cost_points === null;
    const currencyIcon = isDiamond
        ? '<i class="fas fa-gem"></i>' 
        : '<i class="fas fa-coins"></i>';
    
    const currencyClass = isDiamond ? 'diamond-icon' : 'gold-icon';
    const price = isDiamond ? item.cost_diamonds : item.cost_points;
    
    // Add exclusive badge for exclusive items
    const exclusiveBadge = type === 'exclusive' 
        ? '<div class="exclusive-badge"><i class="fas fa-star me-1"></i>Exclusive</div>' 
        : '';
    
    col.innerHTML = `
        <div class="card luxury-card h-100">
            <div class="card-img-wrapper">
                <img src="https://raw.githubusercontent.com/yueliangg/images/main/item${item.id}.png" 
                class="card-img-top" 
                alt="${item.id}">
                ${exclusiveBadge}
            </div>
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${item.name}</h5>
                <div class="d-flex align-items-center justify-content-between mt-3">
                    <div class="price-tag ${currencyClass}">
                        ${currencyIcon}
                        <span class="ms-2">${price}</span>
                    </div>
                    <button class="btn btn-luxury" onclick="purchaseItem(${item.id}, '${type}')">
                        <i class="fas fa-shopping-cart me-2"></i>Purchase
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// Purchase Item
function purchaseItem(itemId, type) {
    const token = getToken();
    if (!token) return;
    
    // Find item in the appropriate array
    const itemsArray = type === 'exclusive' ? exclusiveItemsArray : normalItemsArray;
    const item = itemsArray.find(i => i.id === itemId);
    if (!item) return;
    
    const data = {
        item_id: itemId,
        user_id: currentUserId
    };
    
    const callback = (responseStatus, responseData) => {
        if (responseStatus === 200 || responseStatus === 201) {
            showSuccessModal('Purchase Successful', `You've acquired ${item.name}!`);
            
            // Reload user profile to update wallet
            loadUserProfile(token);
        } else if (responseStatus === 409) {
            showErrorModal('Already Owned', 'You already own this item!');
        } else if (responseStatus === 422) {
            showErrorModal('Insufficient Funds', 'You don\'t have enough points or diamonds to purchase this item.');
        } else if (responseStatus === 400) {
            showErrorModal('Purchase Failed', responseData.message || 'Item unavailable');
        } else {
            showErrorModal('Purchase Failed', 'Failed to complete purchase. Please try again.');
        }
    };
    
    fetchMethod(currentUrl + `/api/items/${itemId}/buy`, callback, "POST", data, token);
}