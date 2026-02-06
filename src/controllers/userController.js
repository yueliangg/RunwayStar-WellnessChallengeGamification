const model = require('../models/userModel');
const utils = require('../utils/diamondCalculation');

//Check User Id 
module.exports.checkUserId = (req, res, next) => {
    const data = {
        user_id: res.locals.userId || req.body.user_id 
    };

    if (data.user_id == undefined)
        return res.status(400).json({message: "User_id is undefined."})

    const callback = (error, results, fields) => {
        if (error) {
            console.log("Error checkUserId: ", error);
            return res.status(500).json(error);
        }

        // User does not exist → 404 Not Found
        if (results.length === 0) {
            return res.status(404).json({message: "UserId does not exist."})
        }

        res.locals.user = results[0]; 
        next();
    };

    model.selectUserById(data, callback);
};

//check username if duplicated
module.exports.checkUsername = (req, res, next) => {
    if (req.body.username == undefined){
        res.status(400).json({message: "Username is undefined."})
    }

    const data = {
        username: req.body.username
    };

    const callback = (error,results, fields) => {
        if (error){
            console.log("Error: checkUser: ", error);
            res.status(500).json(error);
        }

        // Username exists → 409 Conflict
        if (results.length > 0 ) {
            return res.status(409).json({message: "Username already exists."})
        }
        next();
    };

    model.selectUserByUsername(data, callback);
};

//Get User By ID
module.exports.getUser = (req, res, next) => {
    const user_id = res.locals.userId || res.locals.user_id;

    if (user_id == undefined){
        return res.status(400).json({message: "User id is undefined."});
    }

    const data = { user_id };

    const callback = (error, results) => {
        if (error){
            console.log("Error: getUser: ", error);
            return res.status(500).json(error);
        }

        res.locals.data = res.locals.data || {};
        res.locals.data.user = results;
        next();
    };

    model.selectUserById(data, callback);
};

//Get All User
module.exports.getAllUser = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getAllUser: ", error);
            res.status(500).json(error);
        }
        else{ 
            res.locals.data = results;
            next(); 
        }
        
    };

    model.selectAllUser(callback);
};

//Update User 
module.exports.updateUser = (req, res, next) => {
    if (req.body.star_name == undefined )
        return res.status(400).json({message: " star_name undefined"})

    const data = {
        user_id: res.locals.userId,
        star_name: req.body.star_name
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getAllUser: ", error);
            res.status(500).json(error);
        }
        else next();
    };

    model.updateUser(data, callback)
};

// Update diamonds for top 3 runway stars
// Update diamonds for top 3 runway stars
module.exports.updateDiamondsForWinners = (req, res, next) => {
    console.log('\n=== START updateDiamondsForWinners ===');
    
    const top3 = res.locals.top3;
    console.log('top3 received:', JSON.stringify(top3, null, 2));

    const values = utils.diamondCal(top3);
    console.log('values from diamondCal:', JSON.stringify(values, null, 2));
    
    // Handle empty case
    if (values.length === 0) {
        console.log('No values to process, moving to next middleware');
        return next();
    }

    let completed = 0;
    let hasError = false;
    const total = values.length;
    console.log(`Total updates to perform: ${total}`);

    // Call model once for each winner
    values.forEach(([diamonds, user_id], index) => {
        console.log(`\n--- Processing update ${index + 1}/${total} ---`);
        console.log('user_id:', user_id, '| Type:', typeof user_id);
        console.log('diamonds:', diamonds, '| Type:', typeof diamonds);
        
        const data = {
            diamonds: diamonds,
            user_id: user_id
        };
        console.log('Data being sent to model:', JSON.stringify(data, null, 2));

        const callback = (error, results) => {
            if (hasError) {
                console.log('Skipping callback - error already occurred');
                return;
            }
            
            if (error) {
                hasError = true;
                console.log('❌ ERROR in updateDiamondsForWinners:');
                console.log('Error details:', error);
                console.log('Failed for user_id:', user_id);
                return res.status(500).json(error);
            }
            
            completed++;
            console.log(`✓ Update ${completed}/${total} completed successfully`);
            console.log('Results:', JSON.stringify(results, null, 2));
            console.log('Rows affected:', results?.affectedRows || 'N/A');
            
            // Check if any rows were actually updated
            if (results?.affectedRows === 0) {
                console.log('⚠️ WARNING: No rows were updated for user_id:', user_id);
                console.log('This likely means the user_id does not exist in the database');
            }
            
            // Only proceed after ALL updates complete
            if (completed === total) {
                console.log('\n✓ All diamond updates completed successfully');
                console.log('=== END updateDiamondsForWinners ===\n');
                next();
            }
        };

        model.updateDiamondsForWinner(data, callback);
    });
};

// Check Username or Email Exist
module.exports.checkUsernameOrEmailExist = (req, res, next) => {

    // 400 Check for all expected input 
    if (req.body.username == undefined ||
        req.body.email == undefined ||
        req.body.password == undefined) {
        return res.status(400).json({message: "Username, email or password is missing."});
    }
    const data = {
        username: req.body.username,
        email: req.body.email
    };

    const callback = (error, results) => {

        if (error) {
            console.log(error);
            return res.status(500).json({message: "Internal server error"});
        } 
        else {
            if (results.length > 0) {
                return res.status(409).json({message: "Username or email already exists"});
            } 
            else next();
        }
    };
  
    model.checkUsernameOrEmailExist(data, callback);
};

// Register User (Create)
module.exports.register = (req, res, next) => {
    const data = {
        username: req.body.username,
        email: req.body.email,
        password: res.locals.hash, //Encrypted in hashPassword
        star_name: req.body.star_name
    };

    if (!req.body || !req.body.star_name || !req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const callback = (error, results) => {

        if (error) {
            console.log(error);
            return res.status(500).json({message: "Internal server error"});
        } 
        
        else {
            res.locals.message = `User ${data.username} created successfully.`; 
            res.locals.userId = results.insertId; 
            next();
        }
    };
  
    model.insertUser(data, callback);
};

// Login
// This retrieves related User data by username for comparing later
module.exports.login = (req, res, next) => {
    if (req.body.username == undefined ||
        req.body.password == undefined) {
        return res.status(400).json({message: "Username or password is missing."});
    }
    const data = {
        username: req.body.username
    };

    const callback = (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({message: "Internal server error"});
        } 
        
        else {
            console.log("=== DEBUG LOGIN ===");
            console.log("Results:", results);
            console.log("Results length:", results.length);
            console.log("First result:", results[0]);
            console.log("Password field:", results[0]?.password);
            console.log("==================");
            if (results.length == 0) {
                return res.status(404).json({message: "User not found"});
            } 

            else {
                res.locals.hash = results[0].password;
                res.locals.userId = results[0].id;
                
                next();
            }
        }
    };

    model.selectUserByUsername(data, callback);
};

// Update attraction score for a user
module.exports.updateAttractionScore = (req, res, next) => {
    const data = {
        user_id: res.locals.userId || req.params.user_id || req.body.user_id,
        attraction_score: res.locals.data.total_score
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error updateAttractionScore:", error);
            return res.status(500).json(error);
        }
        next(); 
    };

    model.updateAttractionScore(data, callback);
};

// Update avatar
module.exports.updateAvatar = (req, res) => {
    const data = {
        user_id: res.locals.userId,           
        avatar: req.body.avatar               
    };

    const callback = (err, result) => {
        if (err) {
            console.log("Error updating avatar:", err);
            return res.status(500).json({ message: "Failed to update avatar" });
        }
        res.status(200).json({ message: "Avatar updated successfully", avatar: data.avatar });
    };

    model.updateAvatar(data, callback);
};

//deduct points
module.exports.deductPoints = (req, res, next) => {
    const data = {
        user_id: res.locals.userId,
        challenge_id: req.params.challenge_id
    };

    const callback = (err, result) => {
        if (err) {
            console.log("Error getting challenge points:", err);
            return res.status(500).json({ message: "Failed to deduct points" });
        }

        // store deducted points for next middleware
        res.locals.deductPoints = result[0].points;
        console.log(res.locals.deductPoints)
        next();
    };

    model.getChallengePoints(data, callback);
};

//update points
module.exports.updatePoints = (req, res, next) => {
    const data = {
        user_id: res.locals.userId,
        points: res.locals.deductPoints
    };

    const callback = (err, result) => {
        if (err) {
            console.log("Error updating points:", err);
            return res.status(500).json({ message: "Failed to update points" });
        }

        next();
    };

    model.updateUserPoints(data, callback);
};

