const pool = require("../services/db");

const bcrypt = require("bcrypt");
const saltRounds = 10;

require('dotenv').config();

const pepper = process.env.BCRYPT_PEPPER;

const callback = (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully");
  }
  process.exit();
}

bcrypt.hash('1234' + pepper, saltRounds, (error, hash) => {
  if (error) {
    console.error("Error hashing password:", error);
  } else {
    console.log("Hashed password:", hash);

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
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            star_name VARCHAR(100) NOT NULL,
            points INT DEFAULT 0,
            diamonds INT DEFAULT 0,
            attraction_score INT DEFAULT 0,
            profile_avatar VARCHAR(255) DEFAULT 'pfp1.jpg'
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
            type ENUM('exclusive', 'normal') NOT NULL DEFAULT 'normal',
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
            description VARCHAR(255),
            participants INT NOT NULL DEFAULT 0,
            status ENUM('ongoing', 'completed') NOT NULL DEFAULT 'ongoing'
        );

        CREATE TABLE FashionShowEntry (
            id INT AUTO_INCREMENT PRIMARY KEY,
            show_id INT NOT NULL,
            user_id INT NOT NULL,
            attraction_score INT DEFAULT 0
        );

        INSERT INTO User (username, email, password, star_name, points, diamonds, attraction_score, profile_avatar) VALUES
        ('Dashi', 'dashi@example.com', '${hash}', 'Aurora Blaze', 300, 200, 0, 'pfp1.jpg'),
        ('Mia', 'mia@example.com', '${hash}', 'Luna Silk', 250, 150, 0, 'pfp1.jpg'),
        ('Rina', 'rina@example.com', '${hash}', 'Nova Charm', 400, 100, 0, 'pfp1.jpg'),
        ('Eva', 'eva@example.com', '${hash}', 'Violet Luxe', 150, 10, 0, 'pfp1.jpg'),
        ('Zara', 'zara@example.com', '${hash}', 'Crimson Glow', 500, 10, 0, 'pfp1.jpg');

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
        (3, 1, 10, 3, 100);

        INSERT INTO Items (name, type, cost_points, cost_diamonds, attraction_value) VALUES
        ('Celestial Silk Gown', 'normal', 120, 0, 15),
        ('Butterfly Chiffon Dress', 'normal', 180, 0, 20),
        ('Runway Power Blazer', 'normal', 150, 0, 18),
        ('Frost Veil Coat', 'exclusive', 0, 120, 28),
        ('Crystal Stiletto Heels', 'normal', 160, 0, 17),
        ('Moonlight Satin Pumps', 'exclusive', 0, 90, 22),
        ('Starlight Diamond Choker', 'normal', 100, 0, 12),
        ('Aurora Silk Gloves', 'exclusive', 0, 60, 14),
        ('Aurora Silk Gown', 'normal', 160, 0, 9);

        INSERT INTO Inventory (user_id, item_id, is_equipped) VALUES
        (1, 1, TRUE),
        (1, 2, TRUE),
        (2, 3, TRUE),
        (3, 4, TRUE),
        (3, 6, TRUE),
        (4, 6, TRUE),
        (5, 5, TRUE);

        INSERT INTO FashionShow (date, description, participants, status) VALUES
        ('2025-12-25', 'Winter Glam Runway Show', 5, 'completed'),
        ('2026-12-06', 'Spring Summer Runway Show', 4, 'ongoing');


        INSERT INTO FashionShowEntry (show_id, user_id, attraction_score) VALUES
        (1, 1, 0),
        (1, 2, 0),
        (1, 3, 0),
        (1, 4, 0),
        (1, 5, 0),
        (2, 5, 0),
        (2, 2, 0),
        (2, 3, 0),
        (2, 4, 0);
      `;

    pool.query(SQLSTATEMENT, callback);
  }
});
