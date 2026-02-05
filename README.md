# Runway Star Gamification

## Project Overview
Runway Star is a fashion show–themed gamification system that encourages users to complete real-life wellness challenges and rewards them with in-game points and diamonds. Users can spend these currencies to buy outfits, increase their attraction scores, and compete in fashion shows. Top performers earn diamonds, which can be used to unlock rare, exclusive items—creating a continuous engagement loop.

---

## Gamification Summary
- Users complete real-life wellness challenges to earn points  
- Points are used to buy fashion and cosmetic items  
- Each item increases the user’s attraction score  
- Each user represents **one Runway Star**  
- Users participate in fashion shows  
- Fashion show rankings are based on total attraction score  
- Top 3 ranked users in each show earn diamonds  
- Diamonds are a premium currency used to buy rare or exclusive items  
- Rare items further increase attraction and competitiveness  
- The loop repeats to encourage long-term engagement  

---

## Features
1. **Wellness Challenges**  
   Real-life tasks such as sleep, hydration, and exercise  

2. **Points & Diamonds**  
   In-game currencies earned through challenges and competitions  

3. **Fashion Items**  
   Cosmetic upgrades that increase attraction scores  

4. **Runway Star**  
   Each user controls a single model representing them in fashion shows  

5. **Fashion Shows**  
   Competitive events where users are ranked by attraction score  

6. **Inventory Management**  
   Equip and unequip items strategically to maximise attraction  

7. **Fashion Show Entry & Leaderboard**  
   Displays top 3 ranked users to encourage competition and motivation  

---

## Database Tables

### 1. User
- Stores user account data  
- Includes username, points, diamonds, and selected Runway Star  

### 2. WellnessChallenge
- Defines real-life wellness tasks  
- Stores point values rewarded upon completion  

### 3. UserCompletion
- Records completed challenges  
- Prevents duplicate rewards and ensures fair progression  

### 4. Items
- Stores fashion and cosmetic items  
- Includes point/diamond cost and attraction value  

### 5. Inventory
- Tracks items owned by users  
- Records whether items are equipped or unequipped  

### 6. FashionShow
- Stores details of each fashion show event  

### 7. FashionShowEntry
- Records which users enter a fashion show  
- Links users to specific fashion show events  

### 8. RunwayStar
- Stores top 3 ranking data of each shows

---

---

## Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**
   Update a `.env` file in the root folder:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=CA1
PORT=3000
```

4. **Start the app**

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

* The app will run at `http://localhost:3000`.

---
Got it! Here's your **login and registration routes** rewritten in the same format as your example:

---

## Authentication API Endpoints

### 1. Login User

**POST** `/authentication/login`

Authenticate a user by checking login credentials, comparing the password with the stored hash, generating a JWT token, and sending the token back to the client.

**Request Body:**

```json
{
  "username": "Dashi",
  "password": "1234"
}
```

**Response:**

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInRpbWVzdGFtcCI6IjIwMjYtMDEtMjhUMDk6MDE6MTguNTUwWiIsImlhdCI6MTc2OTU5MDg3OCwiZXhwIjoxNzY5Njc3Mjc4fQ.KKeVFLHCpMOR9AHOqVNK8TPZCPdtbFO0tpAdmU4iv84"
}
```

**Success Response**

* `200 OK`

**Error Responses**

* `401 Unauthorized` – Invalid username or password

---

### 2. Register User

**POST** `/authentication/register`

Register a new user by checking username/email availability, hashing the password, creating the user record, generating a JWT token, and sending the token back to the client.

**Request Body:**

```json
{
  "username": "Dashi",
  "email": "dashi@example.com",
  "password": "1234",
  "star_name": "Dashi"
}
```

**Response:**

```json
{
    "message": "User Dashi created successfully.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsInRpbWVzdGFtcCI6IjIwMjYtMDEtMjhUMDk6MDA6MTcuMTkyWiIsImlhdCI6MTc2OTU5MDgxNywiZXhwIjoxNzY5Njc3MjE3fQ.EiWfLoW6ANtYBfAo90GJZDzWsQNMQ1wJlunaSHbq9vU"
}
```

**Success Response**

* `201 Created`

**Error Responses**

* `400 Bad Request` – Username or email is missing
* `409 Conflict` – Username or email already exists

---

## User API Endpoints

### 1. Get All Users
**GET** `/users`

Retrieves all users.

**Success Response**
- `200 OK`

---

### 2. Get User by ID
**GET** `/users/{user_id}`

Retrieves a specific user.

**Success Response**
- `200 OK`

**Error Responses**
- `404 Not Found` – User does not exist

---

### 3. Update User
**PUT** `/users/{user_id}`

Updates user information.

**Request Body:**  
```json
{
  "username": "Thawdar",
  "star_name": "yueliang",
  "points": 100,
  "diamonds": 20
}
```

**Respond:**  
```json
{
    "id": 9,
    "username": "thawdarr",
    "star_name": "baybay",
    "points": 100,
    "diamonds": 20
}
```
**Success Response**
- `200 OK`

**Error Responses**
- `404 Not Found` – Requested `user_id` does not exist
- `409 Conflict` – Username is already associated with another user


Sure! Here's your **fashion show endpoint** documented in the same format as your previous examples:

---

### 4. Get User's Fashion Shows

**GET** `/users/fashion-show`

Retrieve all fashion shows that the authenticated user has joined.

**Request Headers:**

```http
Authorization: Bearer <JWT token>
```

**Response:**

```json
[
    {
        "id": 4,
        "date": "2025-12-25",
        "description": "Winter Glam Runway Show",
        "show_id": 1,
        "user_id": 1,
        "attraction_score": 25
    }
]
```

**Success Response**

* `200 OK`

**Error Responses**

* `401 Unauthorized` – Missing or invalid JWT token
* `404 Not Found` – User not found or user has not joined any fashion shows

---
## Wellness Challenge endpoints

### 5. Create Wellness Challenge Completion
**POST** `/user-completions`

Creates a wellness Challenge
**Request Body:**  
```json
{
    "description": "Talk with a family or friend",
    "user_id": 4,
    "points": 75
}
```

**Respond:**  
```json
{
    "id": 9,
    "description": "Talk with a family or friend",
    "creator_id": 4,
    "points": 75
}
```
**Success Response**
- `201 Created`

**Error Responses**
- `400 Bad Request` – Request body is missing `question` or `user_id`

---

### 6. Get Wellness Challenges
**GET** `/challenges`

Retrieves all wellness challenges.

**Success Response**
- `200 OK`

---

### 7. Delete Wellness Challenge
**DELETE** `/challenges/{challenge_id}`

Deletes a wellness challenge.
The challenges's associated user completions, if any, also be deleted

**Success Response**
- `204 No Content`

**Error Responses**
- `404 Not Found` – Requested `challenge_id` does not exist

---

### 8. Update Wellness Challenge
**PUT** `/challenges/{challenge_id}`

Updates an existing wellness challenge.  
Only the original creator is allowed to perform this action.

**Request Body:**  
```json
{
    "description": "Talk with a family or friend",
    "user_id": 4,
    "points": 75
}
```

**Respond:**  
```json
{
    "id": 9,
    "description": "Talk with a family or friend",
    "creator_id": 4,
    "points": 75
}
```
**Success Response**
- `200 OK`

**Error Responses**
- `400 Bad Request` – Request body is missing `description`, `points`, or `user_id`
- `403 Forbidden` – `creator_id` does not match the challenge owner
- `404 Not Found` – Requested `challenge_id` does not exist

### 9. Create Challenge Completion
**POST** `/challenges/{challenge_id}`

Creates a completion record for a user when a wellness challenge is completed.
Points are also rewarded to user accordingly.

**Request Body:**  
```json
{
    "user_id": 4,
    "details": "Talked to a brother."
}
```

**Respond:**  
```json
{
    "id": 11,
    "challenge_id": 9,
    "user_id": 4,
    "details": "Talked to a brother."
}
```

**Success Response**
- `201 Created`

**Error Handling**
- `404 Not Found` – Requested `challenge_id` does not exist  
- `404 Not Found` – Requested `user_id` does not exist  

**Notes**
- User is rewarded with points upon successful completion

---

### 10. Get Challenge Completion Records
**GET** `/challenges/{challenge_id}`

Retrieves all completion records for a specific wellness challenge.

**Path Parameters**
- `challenge_id` (integer) – ID of the challenge

**Success Response**
- `200 OK`

**Error Handling**
- `404 Not Found` – No completion records exist for the requested `challenge_id`


## Items API Endpoints

### 1. Get All Items
**GET** `/items`

Retrieve all available items in the system.

**Respond:**  
```json
[
    {
        "id": 1,
        "name": "Silk Dress",
        "type": "Outfit",
        "cost_points": 100,
        "cost_diamonds": 0,
        "attraction_value": 10
    },
    {
        "id": 2,
        "name": "Golden Heels",
        "type": "Shoes",
        "cost_points": 150,
        "cost_diamonds": 0,
        "attraction_value": 15
    }
]
```
**Success Response**
- `200 OK`

### 2. Create Item
**POST** `/items`

Create a new item.

**Request Body:**  
```json
{
   "name": "Moon Dress",
   "type": "Outfit",
   "cost_points": 100,
   "cost_diamonds": 0,
   "attraction_value": 10
}
```

**Respond:**  
```json
{
   "id": 3,
   "name": "Moon Dress",
   "type": "Outfit",
   "cost_points": 100,
   "cost_diamonds": 0,
   "attraction_value": 10
}
```

**Success Response**
- `201 Created`

**Error Handling**
- `400 Bad Request` – Missing required fields
- `409 Conflict` – Item name already exists

### 3. Update Item

**PUT** `/items/{item_id}`

Update an existing item.

**Request Body:**

```json
{
   "name": "Moon Dress",
   "type": "Outfit",
   "cost_points": 100,
   "cost_diamonds": 0,
   "attraction_value": 10
}
````

**Response:**

```json
{
   "id": 3,
   "name": "Moon Dress",
   "type": "Outfit",
   "cost_points": 100,
   "cost_diamonds": 0,
   "attraction_value": 10
}
```

**Success Response:**
* `200 OK`

**Error Handling:**
* `400 Bad Request` – Invalid request body
* `404 Not Found` – Item does not exist
* `409 Conflict` – Updated item name already exists

---

### 4. Purchase Item

**POST** `/items/{item_id}/buy`

Purchase an item and add it to the user's inventory.

#### Flow of Controllers

1. **`userController.checkUserId`** – Verifies that the `user_id` in the request exists in the database.  
2. **`itemsController.getItem`** – Checks that the `item_id` exists and fetches the item details.  
3. **`inventoryController.checkUserAlreadyOwnsItem`** – Ensures that the user hasn't already purchased this item.  
4. **`itemsController.checkUserHasCurrency`** – Confirms the user has enough points or diamonds to buy the item.  
5. **`itemsController.deductCurrency`** – Deducts the appropriate amount of points/diamonds from the user.  
6. **`itemsController.addToInventory`** – Adds the purchased item to the user's inventory.  
7. **`inventoryController.getPurchasedInventoryById`** – Retrieves the new inventory record to include in the response.  
8. **`withMessage('Item purchased successfully', 201)`** – Attaches a success message and status code.  
9. **`sendResponse`** – Sends the final JSON response back to the client.  

**Request Body:**

```json
{
    "user_id": 1
}
```

**Response:**

```json
{
    "inventory_id": 15,
    "user_id": 9,
    "item_id": 1,
    "is_equipped": 0,
    "name": "Silk Dress",
    "type": "Outfit",
    "attraction_value": 10,
    "points_spent": 100,
    "remaining_points": 75,
    "remaining_diamonds": 20
}
```

#### Success Response:

* `201 Created` – Item purchased successfully

#### Error Handling:

* `400 Bad Request` – Invalid request body
* `404 Not Found` – User or item does not exist
* `409 Conflict` – User already owns this item
* `422 Unprocessable Entity` – Not enough points/diamonds

---

# Inventory API

This API handles user inventories, including fetching items, updating equip status, and calculating attraction scores.

---

## 1. Get User Inventory

**GET** `/inventory/:user_id`

Retrieve the full inventory for a specific user.

**Middleware Flow:**

1. **`userController.checkUserId`** – Validates that the user exists.  
2. **`inventoryController.getInventoryByUser`** – Fetches all inventory items belonging to the user.  
3. **`withMessage('User inventory retrieved successfully', 200)`** – Attaches a success message and HTTP 200 status code.  
4. **`sendResponse`** – Sends the response back to the client.  

**Success Response:**

```json
[
    {
        "inventory_id": 4,
        "user_id": 3,
        "is_equipped": 1,
        "name": "Runway Makeup",
        "type": "Makeup",
        "attraction_value": 12
    },
    {
        "inventory_id": 5,
        "user_id": 3,
        "is_equipped": 1,
        "name": "Crystal Gown",
        "type": "Exclusive",
        "attraction_value": 45
    }
]

```

**Error Handling:**
* `404 Not Found` – User does not exist

---

## 2. Update Inventory Equip Status

**PUT** `/inventory/update-equip`

Update the `is_equipped` status (0 or 1) of an inventory item.

**Middleware Flow:**

1. **`userController.checkUserId`** – Ensures the user performing the action exists.
2. **`inventoryController.checkInventory`** – Verifies the inventory item exists and belongs to the user. Returns `404` or `403` if invalid.
3. **`inventoryController.updateEquipStatus`** – Updates the equip status and handles conflicts (returns `409` if another item is already equipped in the same slot).
4. **`inventoryController.getInventoryById`** – Retrieves the updated inventory item.
5. **`withMessage('Item equip status updated', 200)`** – Attaches a success message.
6. **`sendResponse`** – Sends the updated inventory data.

**Request Body:**

```json
{
    "inventory_id": 2,
   "user_id": 1,
   "is_equipped": 1
}
```

**Success Response:**

```json
{
    "id": 2,
    "user_id": 1,
    "item_id": 2,
    "is_equipped": 0
}
```

**Error Handling:**

- `404 Not Found` – Inventory item or user does not exist
- `403 Forbidden` – Item does not belong to user
- `409 Conflict` – Equip conflict (Item is already equipped or unequipped)
- `400 Bad Request` – Invalid request body (e.g., `is_equipped` not 0 or 1) 
---

## 3. Get User Attraction Score

**GET** `/inventory/:user_id/attraction-score`

Calculate the user's total **attraction score** based on currently equipped items.

**Middleware Flow:**

1. **`userController.checkUserId`** – Validates that the user exists.  
2. **`inventoryController.calculateAttractionScore`** – Calculates total attraction score using equipped items only.  
3. **`withMessage('User attraction score retrieved successfully', 200)`** – Attaches a success message.  
4. **`sendResponse`** – Sends the calculated score to the client.  

**Success Response:**
- `200 OK`

```json
{
    "user_id": "3",
    "total_score": 67,
    "items": [
        {
            "name": "Runway Makeup",
            "attraction_value": 12
        },
        {
            "name": "Crystal Gown",
            "attraction_value": 45
        },
        {
            "name": "Silk Dress",
            "attraction_value": 10
        }
    ]
}
```
---

# Fashion Show API

This API manages fashion shows, including creating and updating them.

---

## 1. Create Fashion Show

**POST** `/fashion-show`

Create a new fashion show.

**Request Body:**

```json
{
    "date": "2026-02-15",
    "description": "Summer Gala"
}
```

**Success Response:**

* Status: `201 Created`

```json
{
    "id": 1,
    "date": "2026-02-15",
    "description": "Summer Gala"
}
```

**Error Handling:**

* `400 Bad Request` – Invalid request body
* `409 Conflict` – Fashion show description already exists

---

## 2. Update Fashion Show

**PUT** `/fashion-show/:fashion_show_id`

Update an existing fashion show by ID.

**Request Body:**

```json
{
    "date": "2026-02-15",
    "description": "Summer Gala"
}
```

**Success Response:**

* Status: `200 OK`

```json
{
    "id": 1,
    "date": "2026-02-15",
    "description": "Summer Gala"
}
```

**Error Handling:**

* `400 Bad Request` – Invalid request body
* `404 Not Found` – Fashion show does not exist
* `409 Conflict` – Updated name conflicts with another show

---

## 4. Get All Fashion Shows

**GET** `/fashion-show/`  

Retrieve a list of all fashion shows.

**Success Response:**

- Status: `200 OK`

```json
[
    {
        "id": 1,
        "date": "2025-12-25",
        "description": "Winter Glam Runway Show"
    },
    {
        "id": 2,
        "date": "2026-02-15",
        "description": "Summer Gala"
    }
]
```
---

# Fashion Show Entry API

This API manages user entries in fashion shows, including fetching entries, entering a show, and deleting entries.

---

## 1. Get All Entries for a Fashion Show

**GET** `/fashion-show-entry/:fashion_show_id`

Fetch all user entries for a specific fashion show.

**Success Response:**

- Status: `200 OK`

```json
[
    {
        "id": 1,
        "show_id": 1,
        "user_id": 5,
        "attraction_score": 95
    },
    {
        "id": 4,
        "show_id": 1,
        "user_id": 1,
        "attraction_score": 25
    }
]
```

**Error Handling:**
* `404 Not Found` – Fashion show does not exist

---

## 2. Enter a Fashion Show

**POST** `/fashion-show-entry/enter`

Allows a user to enter a fashion show. User's attraction score is calculated based on equipped items.

**Request Body:**

```json
{
    "fashion_show_id": 2,
    "user_id": 2
}
```

**Success Response:**

* Status: `201 Created`

```json
{
    "id": 11,
    "show_id": 1,
    "user_id": 3,
    "attraction_score": 67
}
```

**Error Handling:**

* `400 Bad Request` – Invalid request body
* `404 Not Found` – User or fashion show does not exist
* `409 Conflict` – User has already entered this fashion show

---

## 3. Delete User Entry from Fashion Show

**DELETE** `/fashion-show-entry/:fashion_show_id/:user_id`

Remove a user's entry from a fashion show completely. Also deletes associated RunwayStar record to maintain data consistency.

**Success Response:**
* Status: `204 No Content`

**Error Handling:**
* `404 Not Found` – User or fashion show does not exist

---

# Runway Star API

This API manages the top 3 runway stars for fashion shows, including finalizing results and fetching rankings.

---

## 1. Finalize Fashion Show Top 3

**POST** `/runway-star/finalize`  

Finalize a fashion show by selecting the top 3 runway stars and distributing diamond rewards.

**Request Body:**

```json
{
    "fashion_show_id": 1
}
````

**Success Response:**

* Status: `200 OK`

```json
[
    {
        "user_id": 5,
        "show_id": 1,
        "total_attraction": 95,
        "final_rank": 1,
        "diamonds_won": 100
    },
    {
        "user_id": 3,
        "show_id": 1,
        "total_attraction": 67,
        "final_rank": 2,
        "diamonds_won": 50
    },
    {
        "user_id": 1,
        "show_id": 1,
        "total_attraction": 25,
        "final_rank": 3,
        "diamonds_won": 30
    }
]
```

**Error Handling:**

- `404 Not Found` – Fashion show does not exist  
- `409 Conflict` – Fashion show already finalized  
- `400 Bad Request` – Invalid request body  
- `422 Unprocessable Entity` – Not enough participants to rank top 3

---

## 2. Get Top 3 Runway Stars for a Fashion Show

**GET** `/runway-star/:fashion_show_id`

Retrieve the finalized top 3 runway stars for a specific fashion show.

**Success Response:**

* Status: `200 OK`

```json
[
    {
        "user_id": 5,
        "show_id": 1,
        "total_attraction": 95,
        "final_rank": 1,
        "diamonds_won": 100
    },
    {
        "user_id": 3,
        "show_id": 1,
        "total_attraction": 67,
        "final_rank": 2,
        "diamonds_won": 50
    },
    {
        "user_id": 1,
        "show_id": 1,
        "total_attraction": 25,
        "final_rank": 3,
        "diamonds_won": 30
    }
]
```

**Error Handling:**
* `404 Not Found` – Fashion show does not exist


---

## 3. Get Top 3 Runway Stars for All Fashion Shows

**GET** `/runway-star`

Retrieve finalized top 3 runway stars for all fashion shows.

**Success Response:**

* Status: `200 OK`

```json
[
    {
        "id": 1,
        "user_id": 5,
        "show_id": 1,
        "total_attraction": 95,
        "final_rank": 1,
        "diamonds_won": 100
    },
    {
        "id": 2,
        "user_id": 3,
        "show_id": 1,
        "total_attraction": 67,
        "final_rank": 2,
        "diamonds_won": 50
    },
    {
        "id": 3,
        "user_id": 1,
        "show_id": 1,
        "total_attraction": 25,
        "final_rank": 3,
        "diamonds_won": 30
    },
    {
        "id": 4,
        "user_id": 7,
        "show_id": 2,
        "total_attraction": 65,
        "final_rank": 1,
        "diamonds_won": 100
    },
    {
        "id": 5,
        "user_id": 3,
        "show_id": 2,
        "total_attraction": 57,
        "final_rank": 2,
        "diamonds_won": 50
    },
    {
        "id": 6,
        "user_id": 1,
        "show_id": 2,
        "total_attraction": 25,
        "final_rank": 3,
        "diamonds_won": 30
    }
]
```

---

