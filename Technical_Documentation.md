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

# API Documentation

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
  "username": "Thawdar",
  "email": "Thawdar@example.com",
  "password": "1234",
  "star_name": "Thawdar"
}
```

**Response:**

```json
{
    "message": "User Thawdar created successfully.",
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

### 1. Get Specific User
**GET** `/api/users/me`

Retrieves a specific user and its details: completions, inventory, fashionshow.

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Success Response**
- `200 OK`
```json
{
    "user": [
        {
            "id": 1,
            "username": "Dashi",
            "email": "dashi@example.com",
            "password": "$2b$10$lebzpLLNIHQxJHKPXM8ESuO4PD.S.OS03iGU3mLvFwC66DOzCwqYO",
            "star_name": "Aurora Blaze",
            "points": 300,
            "diamonds": 200,
            "attraction_score": 0,
            "profile_avatar": "pfp1.jpg"
        }
    ],
    "userCompletions": [
        {
            "completion_id": 1,
            "user_id": 1,
            "challenge_id": 1,
            "details": "Slept 8 hours",
            "creator_id": 1,
            "description": "Sleep at least 7 hours",
            "points": 50
        },
        {
            "completion_id": 2,
            "user_id": 1,
            "challenge_id": 2,
            "details": "Drank 2L water",
            "creator_id": 1,
            "description": "Drink at least 2 liters of water",
            "points": 50
        }
    ],
    "userInventory": [
        {
            "inventory_id": 1,
            "user_id": 1,
            "is_equipped": 1,
            "name": "Celestial Silk Gown",
            "type": "normal",
            "attraction_value": 15,
            "id": 1
        },
        {
            "inventory_id": 2,
            "user_id": 1,
            "is_equipped": 1,
            "name": "Butterfly Chiffon Dress",
            "type": "normal",
            "attraction_value": 20,
            "id": 2
        }
    ],
    "userFashionShow": [
        {
            "id": 1,
            "date": "2025-12-25",
            "description": "Winter Glam Runway Show",
            "participants": 5,
            "status": "completed",
            "show_id": 1,
            "user_id": 1,
            "attraction_score": 0
        }
    ]
}
```
**Error Responses**
- `401 Invalid token`
- `404 Not Found` – User does not exist

---

### 2. Update User
**PUT** `/api/users/`

Updates user information.

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Request Body:**  
```json
{
  "star_name": "Aurora"
}
```

**Respond:**  
```json
{
    {
    "user": [
        {
            "id": 1,
            "username": "Dashi",
            "email": "dashi@example.com",
            "password": "$2b$10$Mq4owsnQjEpkj/JODfLrs.FSdVcfa.G8CwFNkvRgh5aLkuiTCPzrq",
            "star_name": "Aurora",
            "points": 300,
            "diamonds": 300,
            "attraction_score": 35,
            "profile_avatar": null
        }
    ]
}
}
```
**Success Response**
- `200 OK`

**Error Responses**
- `404 Not Found` – Requested `user_id` does not exist
- `409 Conflict` – Username is already associated with another user

---

### 3. Update Avatar
**PUT** `/api/users/update-avatar`

Updates the user's profile avatar.

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Request Body:**
```json
{
  "avatar": "pfp2.jpg"
}
```

**Success Response:**
- `200 OK`
```json
{
  "message": "Avatar updated successfully"
}
```

**Error Responses:**
- `404 Not Found` – User not found
- `500 Internal Server Error` – Database error

---


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

### 4. Create Wellness Challenge
**POST** `/api/challenges/create`

Creates a new wellness challenge.

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Request Body:**
```json
{
  "description": "Drink at least 2 liters of water",
  "points": 50
}
```

**Success Response:**
- `201 Created`
```json
{
  "message": "Challenge created successfully",
  "data": {
    "challenge_id": 1,
    "creator_id": 1,
    "description": "Drink at least 2 liters of water",
    "points": 50
  }
}
```

**Error Responses:**
- `400 Bad Request` – Missing required fields
- `500 Internal Server Error` – Database error

---

### 5. Get All Wellness Challenges
**GET** `/api/challenges/`

Fetches all wellness challenges available in the system.

**Success Response:**
- `200 OK`
```json
{
  "message": "All Challenge fetched successfully",
  "data": [
    {
      "challenge_id": 1,
      "creator_id": 1,
      "description": "Sleep at least 7 hours",
      "points": 50
    },
    {
      "challenge_id": 2,
      "creator_id": 1,
      "description": "Drink at least 2 liters of water",
      "points": 50
    }
  ]
}
```

**Error Responses:**
- `500 Internal Server Error` – Database error

---

### 6. Delete Wellness Challenge
**DELETE** `/api/challenges/:challenge_id`

Deletes a specific challenge and all associated user completions.

**URL Parameters:**
- `challenge_id` (integer) – ID of the challenge to delete

**Success Response:**
- `204 No Content`
```json
{
  "message": "Challenge delete successfully"
}
```

**Error Responses:**
- `404 Not Found` – Challenge not found
- `500 Internal Server Error` – Database error

---

### 7. Update Wellness Challenge
**PUT** `/api/challenges/:challenge_id`

Updates an existing challenge. Only the challenge creator can update it.

**URL Parameters:**
- `challenge_id` (integer) – ID of the challenge to update

**Request Body:**
```json
{
  "description": "Sleep at least 8 hours",
  "points": 60
}
```

**Success Response:**
- `200 OK`
```json
{
  "message": "Challenge updated successfully",
  "data": {
    "challenge_id": 1,
    "creator_id": 1,
    "description": "Sleep at least 8 hours",
    "points": 60
  }
}
```

**Error Responses:**
- `403 Forbidden` – User is not the challenge creator
- `404 Not Found` – Challenge not found
- `500 Internal Server Error` – Database error

---

### 8. Complete a Challenge
**POST** `/api/challenges/:challenge_id/record`

Creates a completion record when a user completes a challenge and rewards points to the user.

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**URL Parameters:**
- `challenge_id` (integer) – ID of the challenge to complete

**Request Body:**
```json
{
  "details": "Slept 8 hours last night"
}
```

**Success Response:**
- `201 Created`
```json
{
  "message": "Record created successfully",
  "data": {
    "completion_id": 1,
    "user_id": 1,
    "challenge_id": 1,
    "details": "Slept 8 hours last night"
  }
}
```

**Error Responses:**
- `404 Not Found` – Challenge or user not found
- `409 Conflict` – User has already completed this challenge
- `500 Internal Server Error` – Database error

---

### 9. Delete Challenge Completion
**DELETE** `/api/challenges/:challenge_id/record`

Deletes a user's completion record for a specific challenge and deducts the awarded points.

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**URL Parameters:**
- `challenge_id` (integer) – ID of the challenge completion to delete

**Success Response:**
- `204 No Content`
```json
{
  "message": "Challenge delete successfully"
}
```

**Error Responses:**
- `404 Not Found` – Completion record not found
- `500 Internal Server Error` – Database error

---

## Items API Endpoints

### 10. Get All Items
**GET** `/api/items/all`

Retrieves all available items in the system (both normal and exclusive items).

**Success Response:**
- `200 OK`
```json
{
  "message": "All Items retrieved successfully",
  "data": {
    "normalItems": [
      {
        "id": 1,
        "name": "Celestial Silk Gown",
        "type": "normal",
        "attraction_value": 15,
        "price_diamonds": null,
        "price_points": 100
      },
      {
        "id": 2,
        "name": "Butterfly Chiffon Dress",
        "type": "normal",
        "attraction_value": 20,
        "price_diamonds": null,
        "price_points": 150
      }
    ],
    "exclusiveItems": [
      {
        "id": 3,
        "name": "Diamond Tiara",
        "type": "exclusive",
        "attraction_value": 50,
        "price_diamonds": 100,
        "price_points": null
      }
    ]
  }
}
```

**Error Responses:**
- `500 Internal Server Error` – Database error

---

### 11. Update Item
**PUT** `/api/items/:item_id`

Updates an existing item's details.

**URL Parameters:**
- `item_id` (integer) – ID of the item to update

**Request Body:**
```json
{
  "name": "Royal Silk Gown",
  "attraction_value": 25,
  "price_points": 120
}
```

**Success Response:**
- `200 OK`
```json
{
  "message": "Item updated successfully",
  "data": {
    "id": 1,
    "name": "Royal Silk Gown",
    "type": "normal",
    "attraction_value": 25,
    "price_diamonds": null,
    "price_points": 120
  }
}
```

**Error Responses:**
- `404 Not Found` – Item not found
- `409 Conflict` – Item name already exists
- `500 Internal Server Error` – Database error

---

### 12. Purchase Item
**POST** `/api/items/:item_id/buy`

Purchases an item and adds it to the user's inventory. Deducts the appropriate currency (points or diamonds) from the user.

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**URL Parameters:**
- `item_id` (integer) – ID of the item to purchase

**Success Response:**
- `201 Created`
```json
{
  "message": "Item purchased successfully",
  "data": {
    "inventory_id": 1,
    "user_id": 1,
    "item_id": 1,
    "is_equipped": 0,
    "name": "Celestial Silk Gown",
    "type": "normal",
    "attraction_value": 15
  }
}
```

**Error Responses:**
- `400 Bad Request` – Insufficient points or diamonds
- `404 Not Found` – Item or user not found
- `409 Conflict` – User already owns this item
- `500 Internal Server Error` – Database error

---

## Inventory API Endpoints

This API handles user inventories, including fetching items, updating equip status, and calculating attraction scores.

### 13. Update Inventory Equip Status

**PUT** `/api/inventory/update-equip`

Update equip status and recalculate attraction score

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
    "user_id": 1,
    "total_score": 15,
    "equipped_items": [
        {
            "id": 1,
            "name": "Celestial Silk Gown",
            "type": "normal",
            "attraction_value": 15,
            "cost_points": 120,
            "cost_diamonds": 0,
            "inventory_id": 1,
            "is_equipped": 1
        }
    ]
}
```

**Error Handling:**

- `404 Not Found` – Inventory item or user does not exist
- `403 Forbidden` – Item does not belong to user
- `409 Conflict` – Equip conflict (Item is already equipped or unequipped)
- `400 Bad Request` – Invalid request body (e.g., `is_equipped` not 0 or 1) 
---
## Fashion Show API

This API manages fashion shows, including creating and updating them.

### 14. Create Fashion Show

**POST** `/api/fashion-show`

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

### 15. Get All Fashion Shows

**GET** `/api/fashion-show/all`  

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

## Fashion Show Entry API

This API manages user entries in fashion shows, including fetching entries, entering a show, and deleting entries.

## 16. Get All Entries for a Fashion Show

**GET** `/api/fashion-show-entry/:fashion_show_id`

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

## 17. Enter a Fashion Show

**POST** `/api/fashion-show-entry/enter`

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

## 18. Delete User Entry from Fashion Show

**DELETE** `/fashion-show-entry/:fashion_show_id/:user_id`

Remove a user's entry from a fashion show completely. Also deletes associated RunwayStar record to maintain data consistency.

**Success Response:**
* Status: `204 No Content`

**Error Handling:**
* `404 Not Found` – User or fashion show does not exist

---

## Runway Star API

This API manages the top 3 runway stars for fashion shows, including finalizing results and fetching rankings.

### 19. Finalize Fashion Show Top 3

**POST** `/api/runway-star/finalize`  

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
        "username": "Zara",
        "star_name": "Crimson Glow",
        "user_id": 5,
        "show_id": 2,
        "total_attraction": 0,
        "final_rank": 1,
        "diamonds_won": 100,
        "date": "2026-12-06",
        "description": "Spring Summer Runway Show",
        "status": "completed",
        "participants": 4
    },
    {
        "username": "Mia",
        "star_name": "Luna Silk",
        "user_id": 2,
        "show_id": 2,
        "total_attraction": 0,
        "final_rank": 2,
        "diamonds_won": 50,
        "date": "2026-12-06",
        "description": "Spring Summer Runway Show",
        "status": "completed",
        "participants": 4
    },
    {
        "username": "Rina",
        "star_name": "Nova Charm",
        "user_id": 3,
        "show_id": 2,
        "total_attraction": 0,
        "final_rank": 3,
        "diamonds_won": 30,
        "date": "2026-12-06",
        "description": "Spring Summer Runway Show",
        "status": "completed",
        "participants": 4
    }
]
```

**Error Handling:**

- `404 Not Found` – Fashion show does not exist  
- `409 Conflict` – Fashion show already finalized  
- `400 Bad Request` – Invalid request body  
- `422 Unprocessable Entity` – Not enough participants to rank top 3

---

## 20. Get Top 3 Runway Stars for a Fashion Show

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
## Get User Rank in Fashion Show

**GET** `/runway-star/:fashion_show_id/user-rank`

Retrieve the authenticated user's rank in a specific ongoing fashion show.

**Authentication Required:** Yes (JWT token)

**Path Parameters:**
* `fashion_show_id` (integer) – ID of the fashion show

**Success Response:**

* Status: `200 OK`
* Message: `"Top 3 ranked runway stars fetched successfully"`
```json
{
    "user_id": 1,
    "total_attraction": 25,
    "status": "completed",
    "final_rank": 1
}
```

**Error Handling:**
* `401 Unauthorized` – Invalid or missing JWT token
* `404 Not Found` – Fashion show does not exist or user not found
* `400 Bad Request` – Fashion show is not currently ongoing

---