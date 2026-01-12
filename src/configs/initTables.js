const pool = require("../services/db");

const SQLSTATEMENT = `
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS WellnessChallenge;    
DROP TABLE IF EXISTS UserCompletion; 

DROP TABLE IF EXISTS RunwayStar;
DROP TABLE IF EXISTS Items;
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS FashionShow;
DROP TABLE IF EXISTS FashionShowEntry;

CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    star_name VARCHAR(100) NOT NULL,
    points INT DEFAULT 0,
    diamonds INT DEFAULT 0
);

CREATE TABLE WellnessChallenge (
    id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT NOT NULL,
    description TEXT NOT NULL,
    points INT NOT NULL
);

CREATE TABLE UserCompletion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    challenge_id INT NOT NULL,
    user_id INT NOT NULL,
    details TEXT
);

CREATE TABLE RunwayStar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    show_id INT NOT NULL,
    total_attraction INT DEFAULT 0,
    final_rank INT DEFAULT 0,
    diamonds_won INT DEFAULT 0
);

CREATE TABLE Items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    cost_points INT DEFAULT 0,
    cost_diamonds INT DEFAULT 0,
    attraction_value INT DEFAULT 0
);

CREATE TABLE Inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    is_equipped BOOLEAN DEFAULT FALSE
);

CREATE TABLE FashionShow (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE FashionShowEntry (
    id INT AUTO_INCREMENT PRIMARY KEY,
    show_id INT NOT NULL,
    user_id INT NOT NULL,
    attraction_score INT DEFAULT 0
);

INSERT INTO User (username, star_name, points, diamonds) VALUES
('Dashi', 'Aurora Blaze', 300, 200),
('Mia', 'Luna Silk', 250, 150),
('Rina', 'Nova Charm', 400, 100),
('Eva', 'Violet Luxe', 150, 10),
('Zara', 'Crimson Glow', 500, 10);


INSERT INTO WellnessChallenge (creator_id, description, points) VALUES
(1, 'Sleep at least 7 hours', 50),
(1, 'Drink at least 2 liters of water', 50),
(2, 'Walk for at least 20 minutes', 75),
(2, 'Do stretching for 20 minutes', 75),
(2, 'Eat at least 1 serving of fruits or vegetables', 100),
(3, 'Meditate for 30 minutes', 100),
(4, 'Talk to a friend or family member', 100);

INSERT INTO UserCompletion (challenge_id, user_id, details) VALUES
(1, 1, 'Slept 8 hours'),
(2, 1, 'Drank 2L water'),
(3, 2, 'Walked 25 minutes'),
(4, 2, 'Did full stretching routine'),
(5, 3, 'Ate fruits'),
(6, 3, 'Meditated calmly'),
(7, 4, 'Called family member');

INSERT INTO RunwayStar (user_id, show_id, total_attraction, final_rank, diamonds_won) VALUES
(1, 1, 25, 1, 200),
(2, 1, 17, 2, 150), 
(3, 2, 10, 3, 100), 

INSERT INTO Items (name, type, cost_points, cost_diamonds, attraction_value) VALUES
('Silk Dress', 'Outfit', 100, 0, 10),
('Golden Heels', 'Shoes', 150, 0, 15),
('Pearl Necklace', 'Accessory', 80, 0, 8),
('Runway Makeup', 'Makeup', 120, 0, 12),
('Angel Wings', 'Exclusive', 0, 150, 30),
('Crystal Gown', 'Exclusive', 0, 200, 55);

INSERT INTO Inventory (user_id, item_id, is_equipped) VALUES
(1, 1, TRUE),
(1, 2, TRUE),
(2, 3, TRUE),
(3, 4, TRUE),
(3, 6, TRUE),
(5, 5, TRUE);

INSERT INTO FashionShow (date, description) VALUES
('2025-12-25', 'Winter Glam Runway Show');

INSERT INTO FashionShowEntry (show_id, user_id, attraction_score) VALUES
(1, 5, 95),
(1, 2, 65),
(1, 3, 40);

`;

pool.query(SQLSTATEMENT, (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully.");
  }
  process.exit();
});
