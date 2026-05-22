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

# Frontend Pages Documentation

## Pages Summary

| Page | Route | Description| API Routes Used |
|------|-------|-----------|-----------------|
| **Runway Star - Index** | `/` | Landing page introducing the Runway Star platform with overview of features and call-to-action for login/register | None |
| **Login** | `/login` | User authentication page for existing users | `POST /authentication/login` |
| **Register** | `/register` | New user registration page | `POST /authentication/register` |
| **Fashion Shows** | `/fashion-show` | Browse ongoing and upcoming fashion shows, view rankings, and participate in competitions | `GET /fashion-show/all` <br> `GET /runway-star/:fashion_show_id` <br> `POST /fashion-show`<br>`POST /fashion-show-entry/:fashion_show_id/enter`<br> `POST /runway-star/finalize ` |
| **Challenges** | `/challenges` | View and participate in wellness challenges to earn points and rewards | `GET /challenges`<br>`DELETE /challenges/:challenge_id` <br>`POST /challenges/:challenge_id/record`<br>`DELETE /challenges/:challenge_id/record` |
| **Store** | `/store` | Browse and purchase fashion items and accessories using diamonds | `GET /items/all`<br>`POST /items/:item_id/buy` |
| **Profile** | `/profile` | View user profile, statistics, achievements, and fashion show history | `GET /users/me`<br>`PUT /users/`<br>`PUT /users/update-avatar`<br>`GET /runway-star/:fashion_show_id/user-rank` <br>`PUT /inventory/update-equip` <br> `DELETE /fashion-show-entry/:fashion_show_id` |

---
