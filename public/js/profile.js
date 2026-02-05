let inventoryArray = [];
let equippedArray = [];
let fashionShowEntriesArray = [];
let currentUserId = null;
let fashionShowCounts = {}; 

// DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    const token = getToken();
    if (!token) return; 

    attachEventListeners();
    loadUserProfile(token);
    attachStarNameEditListener(token);
    loadEquippedItems(token);
    loadInventory(token);
    loadUserFashionShows(token);
});

// Attach Event Listeners
function attachEventListeners() {
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) logoutButton.addEventListener("click", handleLogout);
}

// Logout
function handleLogout() {
    localStorage.removeItem("token"); 
    window.location.href = "index.html";
}

// Attach edit listener to star name
function attachStarNameEditListener(token) {
  const editIcon = document.getElementById('edit_star_name');
  
  if (!editIcon) return;
  
  editIcon.addEventListener('click', () => handleStarNameEdit(token));
}

// Handle the edit click
function handleStarNameEdit(token) {
  const starNameEl = document.getElementById('star_name');
  const currentName = starNameEl.childNodes[0].textContent.trim();
  
  // Create input field
  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentName;
  input.className = 'form-control d-inline-block';
  input.style.width = 'auto';
  input.style.maxWidth = '300px';
  
  // Replace content with input
  starNameEl.innerHTML = '';
  starNameEl.appendChild(input);
  input.focus();
  input.select();
  
  // Save on blur
  input.addEventListener('blur', () => saveStarName(input, currentName, token));
  
  // Save on Enter, cancel on Escape
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      input.blur();
    }
    if (e.key === 'Escape') {
      restoreStarName(currentName, token);
    }
  });
}

// Save the star name to backend
function saveStarName(input, originalName, token) {
  const newName = input.value.trim();
  
  if (!newName) {
    restoreStarName(originalName, token);
    return;
  }
  
  if (newName !== originalName) {
    const data = { star_name: newName };
    
    const callback = (status, response) => {
      if (status === 200) {
        restoreStarName(newName, token);
        loadUserProfile(token);
      } else {
        alert('Failed to update star name');
        restoreStarName(originalName, token);
      }
    };
    
    fetchMethod(currentUrl + '/api/users', callback, 'PUT', data, token);
  } else {
    restoreStarName(originalName, token);
  }
}

// Restore star name display with edit icon
function restoreStarName(name, token) {
  const starNameEl = document.getElementById('star_name');
  starNameEl.innerHTML = `${name} <i class="fas fa-edit edit-icon" id="edit_star_name"></i>`;
  attachStarNameEditListener(token);
}

// Load and Display Inventory Items
function loadInventory(token) {
    if (!token) return;

    const callback = (status, responseData) => {
        if (status !== 200) {
            console.error("Failed to load inventory items:", responseData);
            return;
        }

        inventoryArray = responseData || [];

        const inventoryDiv = document.getElementById("inventoryItems");
        inventoryDiv.innerHTML = "";

        inventoryArray.forEach(item => {
            const displayItem = document.createElement("div");
            displayItem.className = "col-4 col-md-3 mb-3";

            displayItem.innerHTML = `
                <div class="item-card text-center p-2">
                    <img src="https://raw.githubusercontent.com/yueliangg/images/main/item${item.item_id}.png" 
                class="card-img-top" 
                alt="${item.id}">
                    <p class="small mb-1">${item.name}</p>
                    <p class="small mb-0">Attraction value: ${item.attraction_value}</p>
                    <button 
                        class="btn btn-equip btn-sm w-100" 
                        data-inventory-id="${item.inventory_id}">
                        ${item.is_equipped ? "Unequip" : "Equip"}
                    </button>
                </div>
            `;

            inventoryDiv.appendChild(displayItem);
        });

        // Attach click listeners after rendering
        document.querySelectorAll(".btn-equip").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const inventoryId = e.currentTarget.dataset.inventoryId;
                if (!inventoryId) return console.error("inventoryId undefined");

                handleEquipItem(inventoryId, token);
            });
        });
    };

    fetchMethod(currentUrl + "/api/inventory/", callback, "GET", null, token);
}

// Load and Display Equipped Items (Inventory Route)
function loadEquippedItems(token) {
    const callback = (status, responseData) => {
        if (status === 200) {
            const items = responseData.items || [];
            equippedArray = items; 

            const equippedDiv = document.getElementById("equippedItems");
            equippedDiv.innerHTML = "";

            items.forEach(item => {
                const displayItem = document.createElement("div");
                displayItem.className = "col-4 col-md-3 mb-3";
                displayItem.innerHTML = `
                    <div class="item-card text-center p-2">
                        <img src="https://raw.githubusercontent.com/yueliangg/images/main/item${item.item_id}.png" 
                        class="card-img-top" 
                        alt="${item.id}">
                        <p class="small mb-0">${item.name}</p>
                        <p class="small mb-0">Attraction value: ${item.attraction_value}</p>
            
                    </div>
                `;
                equippedDiv.appendChild(displayItem);
            });

            document.getElementById("attraction_score").textContent = responseData.total_score || 0;
        } 
        else {
            console.error("Failed to load equipped items:", responseData);
        }
    };

    fetchMethod(currentUrl + `/api/inventory/attraction-score`, callback, "GET", null, token);
}

// Equip / Unequip inventory item
function handleEquipItem(inventoryId, token) {
    const currentItem = inventoryArray.find(item => item.inventory_id == inventoryId);
    if (!currentItem) return;

    const newEquipStatus = currentItem.is_equipped ? 0 : 1;

    const data = {
        inventory_id: inventoryId,
        is_equipped: newEquipStatus
    };

    const callback = (status, responseData) => {
        if (status === 200) {
            // Update local state immediately
            currentItem.is_equipped = newEquipStatus;

            loadInventory(token);
            loadEquippedItems(token);
            loadUserProfile(token);
        } else {
            console.error("Failed to equip item:", responseData);
        }
    };

    fetchMethod(currentUrl + "/api/inventory/update-equip", callback, "PUT", data, token);
}





