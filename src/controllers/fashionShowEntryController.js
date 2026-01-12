const model = require('../models/fashionShowEntryModel');

//get all user entries
module.exports.getAllUserEntries = (req, res, next) => {
    const data = {
        show_id: req.params.fashion_show_id
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error checkUserEntry:", error);
            return res.status(500).json(error);
        }
        res.locals.data = results;

        next();
    };

    model.selectAllUserEntries(data, callback);
};

// Check if user already entered a fashion show
module.exports.checkUserEntry = (req, res, next) => {
    const data = {
        show_id: req.params.fashion_show_id,
        user_id: req.body.user_id
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error checkUserEntry:", error);
            return res.status(500).json(error);
        }

        if (results.length !== 0) {
            return res.status(409).json({
                message: "User already entered the fashion show."
            });
        }

        // user has NOT entered → continue
        next();
    };

    model.getFashionShowEntry(data, callback);
};


// Enter user into fashion show
module.exports.enterFashionShow = (req, res, next) => {
    const data = {
        show_id: req.params.fashion_show_id,
        user_id: req.body.user_id,
        attraction_score: res.locals.total_score
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error enterFashionShow:", error);
            return res.status(500).json(error);
        }

        res.locals.entry_id = results.insertId;
        next();
    };

    model.addFashionShowEntry(data, callback);
};

// Get current user's entry for a fashion show
module.exports.getUserEntry = (req, res, next) => {
    const data = {
        show_id: req.params.fashion_show_id,
        user_id: req.body.user_id 
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error getUserEntry:", error);
            return res.status(500).json(error);
        }

        res.locals.data = results[0];
        next();
    };

    model.getFashionShowEntry(data, callback);
};

//top 3 entries
module.exports.getTop3Entries = (req, res, next) => {
    const data = {
        show_id: req.body.fashion_show_id
    };

    if (data.show_id == undefined){
        return res.status(400).json({message: "Fashion show Id is undefined"})
    }

    const callback = (error, results) => {
        if (error) {
            console.log("Error getTop3Entries:", error);
            return res.status(500).json(error);
        }
        if (results.length < 3) {
            return res.status(422).json({
                message: "Not enough participants to rank top 3"
            });
        }
        
        res.locals.top3 = results; 
        next();
    };

    model.selectTop3ByAttraction(data, callback);
};

// Delete fashion show entry
module.exports.deleteEntry = (req, res, next) => {
    const data = {
        fashion_show_id: req.params.fashion_show_id,
        user_id: req.params.user_id
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error deleting fashion show entry:", error);
            return res.status(500).json(error);
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Entry not found." });
        }
        next();
    };

    model.deleteEntry(data, callback);
};
