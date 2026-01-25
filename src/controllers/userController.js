const model = require('../models/userModel');

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

//Creating New user
module.exports.createNewUser = (req, res, next) => {

    if (
        req.body.username == undefined ||
        req.body.star_name == undefined ||
        req.body.email == undefined ||
        req.body.password == undefined
    ) {
        return res.status(400).json({
            message: "Username, email, password, or star name is undefined."
        });
    }

    const data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        star_name: req.body.star_name
    };

    const callback = (error,results, fields) => {
        if (error) {
            console.log("Error: CreateNewUser:", error);
            return res.status(500).json(error);
        }

        res.locals.user_id = results.insertId;
        next();
    }

    model.insertUser(data, callback);
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

        res.locals.data = results[0]
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
    if (req.body.username == undefined || 
        req.body.star_name == undefined ||
        req.body.points == undefined ||
        req.body.diamonds == undefined)
        return res.status(400).json({message: "user_id or star_name or points or diamonds undefined"})

    const data = {
        user_id: res.locals.userId,
        username: req.body.username,
        star_name: req.body.star_name,
        points: req.body.points,
        diamonds: req.body.diamonds
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

//update diamonds for top 3 runway Star
module.exports.updateDiamondsForWinners = (req, res, next) => {
    const top3 = res.locals.top3; // array of top 3 from previous middleware
    const rewards = [100, 50, 20];

    // Map top 3 into array of arrays: [diamonds, user_id]
    const data = {
        values: top3.map((entry, index) => [
            rewards[index],  // diamonds to add
            entry.user_id    // user id
        ])
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error updateDiamondsForWinners:", error);
            return res.status(500).json(error);
        }
        next();
    };

    model.updateDiamondsForWinner(data, callback);
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
    // We use hash here, not the raw password
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
            //For sendToken: They send res.locals message & token
            res.locals.message = `User ${data.username} created successfully.`; 

            //For generateToken: They save res.locals.userId into token payload
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
            if (results.length == 0) {
                return res.status(404).json({message: "User not found"});
            } 

            else {
                // For comparePassword: hashed password is saved into res.locals.hash
                res.locals.hash = results[0].password;
                // For generateToken: Matching userId for input username is saved. 
                res.locals.userId = results[0].id;
                
                next();
            }
        }
    };

    model.selectUserByUsername(data, callback);
};