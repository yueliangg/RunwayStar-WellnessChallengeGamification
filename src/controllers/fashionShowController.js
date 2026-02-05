const { message } = require('statuses');
const model = require('../models/fashionShowModel');

// get fashion show by id
module.exports.checkFashionShowName = (req, res, next) => {
    const data = {
        description: req.body.description
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error checkFashionShowName:", error);
            return res.status(500).json(error);
        }

        // if found → conflict
        if (results.length > 0) {
            return res.status(409).json({
                message: "Fashion show with same name already exists"
            });
        }
        next();
    };

    model.selectFashionShowByName(data, callback);
};


//create fashion show
module.exports.createFashionShow = (req, res, next) => {

    if (req.body.date == undefined ||
        req.body.description == undefined
    ){
        return res.status(400).json({message: "date or description is undefined."})
    }

    const data = {
        date: req.body.date,
        description: req.body.description
    };

    const callback = (error,results, fields) => {
        if (error){
            console.log("Error: CreateFashionShow: ", error);
            res.status(500).json(error);
        }
        
        res.locals.fashion_show_id = results.insertId;
        next();
    };
    model.insertFashionShow(data,callback);
};

// get fashion show by id
module.exports.getFashionShow = (req, res, next) => {
    const data = {
        show_id: req.params.fashion_show_id || res.locals.fashion_show_id ||req.body.fashion_show_id 
    };

    const callback = (error, results) => {
        if (error) return res.status(500).json(error);

        if (results.length === 0) {
            return res.status(404).json({ message: "Fashion show not found" });
        }

        res.locals.fashionShow = results[0];

        if (!res.locals.data) {
            res.locals.data = results[0];
        }
        next();
    }

    model.selectFashionShow(data, callback)
};

// get fashion show by id
module.exports.updateFashionShow = (req, res, next) => {
    const data = {
        date: req.body.date,
        description: req.body.description,
        show_id: req.params.fashion_show_id
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error updateFashionShow:", error);
            return res.status(500).json(error);
        }

        next();
    };

    model.updateFashionShow(data, callback);
};

// get fashion show by id
module.exports.getAllFashionShow = (req, res, next) => {

    const callback = (error, results) => {
        if (error) {
            console.log("Error getAllFashionShow:", error);
            return res.status(500).json(error);
        }
        res.locals.data = results;  

        next();
    };

    model.selectAllFashionShow(callback);
};

module.exports.getFashionShowUser = (req, res, next) => {
    const data = {
        user_id : res.locals.userId
    }

    const callback = (error, results) => {
        if (error) {
            console.log("Error getFashionShowByUser:", error);
            return res.status(500).json(error);
        }
        res.locals.data = results;  
        console.log(results)

        next();
    };

    model.selectFashionShowByUser(data,callback);
};

//Update participants (plus one)
module.exports.addParticipants = (req, res, next) => {
    const data = {
        show_id: req.body.fashion_show_id 
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error updateParticipants:", error);
            return res.status(500).json(error);
        }
        next();
    };

    // call the model function
    model.addParticipants(data, callback);
};

//Update participants (minus one)
module.exports.reduceParticipants = (req, res, next) => {
    const data = {
        show_id: req.params.fashion_show_id
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error updateParticipants:", error);
            return res.status(500).json(error);
        }
        next();
    };

    // call the model function
    model.reduceParticipants(data, callback);
};

// get fashion show by id
module.exports.checkParticipants = (req, res, next) => {
    const data = {
        show_id: req.body.fashion_show_id
    };

    const callback = (error, results) => {
        if (error) return res.status(500).json(error);

        if (results.participants < 5) {
            return res.status(422).json({ message: "Require 5 participants to finalise" });
        }

        res.locals.fashionShow = results[0];

        if (!res.locals.data) {
            res.locals.data = results[0];
        }
        next();
    }

    model.selectFashionShow(data, callback)
};

// Check if the fashion show is already completed
module.exports.checkCompleted = (req, res, next) => {
    const data = {
        show_id: req.params.fashion_show_id || req.body.fashion_show_id 
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error checkCompleted:", error);
            return res.status(500).json(error);
        }

        // Check status
        if (results[0].status === 'completed') {
            return res.status(409).json({
                message: "Fashion show already finalized"
            });
        }

        next();
    };

    model.selectFashionShow(data, callback);
};

// Check if the fashion show is Ongoing
module.exports.checkOngoing = (req, res, next) => {
    const data = {
        show_id: req.params.fashion_show_id
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error checkOngoing:", error);
            return res.status(500).json(error);
        }

        // Check status
        if (results[0].status === 'ongoing') {
            return res.status(409).json({
                message: "Fashion show has not been finalised, ongoing"
            });
        }

        next();
    };

    model.selectFashionShow(data, callback);
};

// Update Fashion Show Status
module.exports.updateStatus = (req, res) => {
    const data = {
        show_id: req.body.fashion_show_id
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error updateStatus: ", error);
            return res.status(500).json(error);
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                message: "Fashion show not found"
            });
        }
        next();
    };
    

    model.updateStatus(data, callback);
};

// Get Completed Fashion Shows
module.exports.getCompletedFashionShow = (req, res, next) => {

    const callback = (error, results) => {
        if (error) {
            console.log("Error getCompletedFashionShow:", error);
            return res.status(500).json(error);
        }

        res.locals.data = results;
        next();
    };

    model.selectCompletedFashionShow(callback);
};

// Get Ongoing Fashion Shows
module.exports.getOngoingFashionShow = (req, res, next) => {

    const callback = (error, results) => {
        if (error) {
            console.log("Error getOngoingFashionShow:", error);
            return res.status(500).json(error);
        }

        res.locals.data = results;
        next();
    };

    model.selectOngoingFashionShow(callback);
};

// Get Ongoing Fashion Shows
module.exports.deleteFashionShow = (req, res, next) => {

    const data = {fashion_show_id: req.params.fashion_show_id}

    const callback = (error, results) => {
        if (error) {
            console.log("Error deleteFashionShow:", error);
            return res.status(500).json(error);
        }
        next();
    };

    model.deleteFashionShow(data, callback);
};

