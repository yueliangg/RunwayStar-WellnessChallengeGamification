const model = require('../models/wellnessChallengeModel');

//Check Challenge Exists
module.exports.checkChallengeExists = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.log("Error checkChallengeExists:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({message: "Challenge Id does not exist"});
        }

        // store challenge for later use
        res.locals.challenge = results[0];
        next();
    };

    model.selectChallengeById(data, callback);
};

// Checks whether the current user is the creator of the challenge
// Prevents non-owners from modifying or deleting the challenge
module.exports.checkChallengeOwner = (req, res, next) => {
    const userId = req.body.user_id;

    if (res.locals.challenge.creator_id != userId) {
        return res.status(403).json({message: "Forbidden: You are not the owner"});
    }

    next();
};

//Creating New challenge
module.exports.createChallenge = (req, res, next) => {

    if (req.body.description == undefined ||
        req.body.user_id == undefined ||
        req.body.points == undefined
    ){
        res.status(400).json({message: 'Description or user_id or points is undefined'})
    }

    const data = {
        description: req.body.description,
        creator_id: req.body.user_id,
        points: req.body.points || 0
    };

    const callback = (error,results, fields) => {
        if (error){
            console.log("Error: CreateChallenge: ", error);
            res.status(500).json(error);
        }
        res.locals.challenge_id = results.insertId;
        next();
    };
    model.insertChallenge(data,callback);
};

// Retrieve a specific challenge by ID
module.exports.getChallenge = (req, res, next) => {
    const challenge_id = req.params.challenge_id || res.locals.challenge_id;

    if (challenge_id == undefined){
        return res.status(400).json({message: 'challenge_id is undefined'});
    }

    const data = { challenge_id };

    const callback = (error, results) => {
        if (error){
            console.log("Error: getChallenge: ", error);
            return res.status(500).json(error);
        }

        else if (results.length == 0){
            return res.status(404).json({ message: "No Challenge found" });
        }

        res.locals.data = results[0]
        next();
    };
    model.selectChallengeById(data, callback);
};

// Retrieve all wellness challenges
module.exports.getAllChallenges = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getAllChallenge: ", error);
            res.status(500).json(error);
        }
        else{ 
            res.locals.data = results;
            next(); 
        }
    };
    model.selectAllChallenge(callback);
};

module.exports.updateChallenge = (req, res, next) => {
    if (req.body.user_id == undefined ||
        req.body.description == undefined ||
        req.body.points == undefined)
        return res.status(400).json({message: "user_id or description or points undefined"})

    const data = {
        challenge_id: req.params.challenge_id,
        description: req.body.description,
        creator_id: req.body.user_id,
        points: req.body.points
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error getAllUser: ", error);
            res.status(500).json(error);
        }
        else next();
    };

    model.updateChallenge(data, callback)
};

//deleting the challenge
module.exports.deleteChallenge = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id 
    };

    if (req.params.challenge_id == undefined) {
        return res.status(400).json({ message: "Challenge ID required" });
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error deleteChallenge:", error);
            return res.status(500).json(error);
        } 

        // Check if WellnessChallenge was deleted
        if (results.affectedRows === 0) {
            return res.status(404).json({message: "Challenge ID not found"})
        }
        next();
    };

    model.deleteChallenge(data, callback);
};

// Delete user completions for a specific challenge
module.exports.deleteUserCompletion = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id 
    };
    
    if (req.params.challenge_id == undefined) {
        return res.status(400).json({ message: "Challenge ID required" });
    }

    const callback = (error, results) => {
        if (error) {
            console.error("Error deleting user completions:", err);
            return res.status(500).json(error);
        }
        next();
    };
    model.deleteUserCompletion(data, callback);
};

// Create a user completion record for a challenge
module.exports.createRecord = (req, res, next) => {
    if (req.body.user_id == undefined ||
        req.body.details == undefined)
        return res.status(400).json({message: "user_id or details undefined. "})

    const data = {
        challenge_id: req.params.challenge_id,
        user_id: req.body.user_id,
        details: req.body.details
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createRecord: ", error);
            res.status(500).json(error);
        }
        else {
            res.locals.completion_id = results.insertId
            next();
        };
    };

    model.insertRecord(data, callback)
};

// Reward points to a user for completing a challenge
module.exports.rewardPoints = (req, res, next) => {
    const data = {
        user_id: req.body.user_id,
        points: res.locals.challenge.points 
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.log("Error rewardPoints:", error);
            return res.status(500).json(error);
        }

        next();
    };

    model.addUserPoints(data, callback);
};

// Retrieve a specific user completion record
module.exports.getRecord = (req, res, next) => {
    const data = {
        completion_id: res.locals.completion_id
    };

    const callback = (error, results) => {
        if (error){
            console.log("Error: getRecord: ", error);
            return res.status(500).json(error);
        }

        else if (results.length == 0){
            return res.status(404).json({ message: "No Record found" });
        }

        res.locals.data = results[0]
        next();
    };
    model.selectRecord(data, callback);
};

// Retrieve all completions for a specific challenge
module.exports.getAllCompletions = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error getAllCompletions:", error);
            return res.status(500).json(error);
        }

        res.locals.data = results; 
        next();
    };

    model.selectAllCompletions(data, callback);
};
