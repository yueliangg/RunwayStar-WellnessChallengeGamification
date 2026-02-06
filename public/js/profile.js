let inventoryArray = [];
let equippedArray = [];
let fashionShowEntriesArray = [];
let fashionShowCounts = {}; 

// DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    const token = getToken();
    if (!token) return; 

    attachEventListeners();
    attachStarNameEditListener(token);
    
    // Single call to load all data
    loadAllUserData(token);
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
  
  console.log('Attaching listener, editIcon found:', editIcon); // DEBUG
  
  if (!editIcon) return;
  
  editIcon.addEventListener('click', () => {
    console.log('Edit icon clicked!'); // DEBUG
    handleStarNameEdit(token);
  });
}

// Handle the edit click
function handleStarNameEdit(token) {
  const starNameEl = document.getElementById('star_name');
  
  // Clone the element to get text without the icon
  const clone = starNameEl.cloneNode(true);
  const iconInClone = clone.querySelector('.edit-icon, .fa-edit');
  if (iconInClone) iconInClone.remove();
  const currentName = clone.textContent.trim();
  
  console.log('Editing star name:', currentName);
  
  // Create input field
  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentName;
  input.className = 'form-control form-control-sm d-inline-block';
  input.style.minWidth = '200px';
  
  // Replace content
  starNameEl.innerHTML = '';
  starNameEl.appendChild(input);
  input.focus();
  input.select();
  
  // Handle save/cancel
  let saved = false;
  
  const save = () => {
    if (saved) return;
    saved = true;
    saveStarName(input, currentName, token);
  };
  
  const cancel = () => {
    if (saved) return;
    saved = true;
    restoreStarName(currentName, token);
  };
  
  input.addEventListener('blur', save);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      save();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
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
        // Update userData globally without reloading
        if (userData && userData.user && userData.user[0]) {
          userData.user[0].star_name = newName;
        }
        
        restoreStarName(newName, token);
        
        // Show success modal
        showSuccessModal("Star Name Updated!", "Your new star name has been saved successfully.");
      } else {
        // Show error modal
        showErrorModal("Update Failed", "Failed to update star name. Please try again.");
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

// Display Inventory Items (NO FETCH - just displays data)
function displayUserInventory(responseData, token) {
    if (!responseData || !responseData.userInventory) {
        console.error("No inventory data provided");
        return;
    }

    inventoryArray = responseData.userInventory || [];

    const inventoryDiv = document.getElementById("inventoryItems");
    if (!inventoryDiv) return;
    
    inventoryDiv.innerHTML = "";

    inventoryArray.forEach(item => {
        const displayItem = document.createElement("div");
        displayItem.className = "col-4 col-md-3 mb-3";

        displayItem.innerHTML = `
            <div class="item-card text-center p-2">
                <img src="https://raw.githubusercontent.com/yueliangg/images/main/item${item.id}.png" 
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
}

// Display Equipped Items (NO FETCH - just displays data)
function displayEquippedItems(responseData) {
    if (!responseData || !responseData.userInventory) {
        console.error("No inventory data provided");
        return;
    }

    // Filter equipped items from inventory
    const equippedItems = responseData.userInventory.filter(item => item.is_equipped === 1);
    equippedArray = equippedItems;

    const equippedDiv = document.getElementById("equippedItems");
    if (!equippedDiv) return;
    
    equippedDiv.innerHTML = "";

    equippedItems.forEach(item => {
        const displayItem = document.createElement("div");
        displayItem.className = "col-4 col-md-3 mb-3";
        displayItem.innerHTML = `
            <div class="item-card text-center p-2">
                <img src="https://raw.githubusercontent.com/yueliangg/images/main/item${item.id}.png" 
                class="card-img-top" 
                alt="${item.id}">
                <p class="small mb-0">${item.name}</p>
                <p class="small mb-0">Attraction value: ${item.attraction_value}</p>
            </div>
        `;
        equippedDiv.appendChild(displayItem);
    });

    // Calculate total attraction score
    const totalScore = equippedItems.reduce((sum, item) => sum + (item.attraction_value || 0), 0);
    
    const attractionScoreEl = document.getElementById("attraction_score");
    const floatAttractionScore = document.getElementById("float_attraction_score");
    if (attractionScoreEl) {
        attractionScoreEl.textContent = totalScore;
    }

    if (floatAttractionScore) {
        floatAttractionScore.textContent = totalScore;
    }

    
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
            // Update userData globally without reloading
            if (userData && userData.userInventory) {
                const itemToUpdate = userData.userInventory.find(item => item.inventory_id == inventoryId);
                if (itemToUpdate) {
                    itemToUpdate.is_equipped = newEquipStatus;
                }
            }

            // Re-display inventory and equipped items with updated data
            if (typeof displayUserInventory === 'function') {
                displayUserInventory(userData, token);
            }
            if (typeof displayEquippedItems === 'function') {
                displayEquippedItems(userData);
            }

            // Show success message
            const action = newEquipStatus ? "equipped" : "unequipped";
            showSuccessModal("Item Updated!", `Item has been ${action} successfully.`);
        } else {
            console.error("Failed to equip item:", responseData);
            showErrorModal("Update Failed", "Failed to update item. Please try again.");
        }
    };

    fetchMethod(currentUrl + "/api/inventory/update-equip", callback, "PUT", data, token);
}