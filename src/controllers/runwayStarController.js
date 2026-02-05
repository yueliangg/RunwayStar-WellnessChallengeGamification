const model = require('../models/runwayStarModel');

// Insert top 3 runway stars after fashion show is finalized
// - Receives top 3 entries from res.locals
// - Calculates final ranks and diamond rewards
// - Inserts results into RunwayStar table
module.exports.insertTop3RunwayStars = (req, res, next) => {
    const top3 = res.locals.top3;
    const rewards = [100, 50, 30];

    const data = {
        values: top3.map((entry, index) => ([
            entry.user_id,
            req.body.fashion_show_id,
            entry.attraction_score,
            index + 1,
            rewards[index]
        ]))
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error insertTop3RunwayStars:", error);
            return res.status(500).json(error);
        }

        res.locals.data = top3.map((entry, index) => ({
            user_id: entry.user_id,
            show_id: req.body.fashion_show_id,
            total_attraction: entry.attraction_score,
            final_rank: index + 1,
            diamonds_won: rewards[index]
        }));

        next();
    };

    model.insertTop3RunwayStars(data, callback);
};

//get Top 3 ranked Runway Stars by Show id
module.exports.getFinalsByFashionShow = (req, res, next) => {
    const data = { show_id: req.params.fashion_show_id || req.body.fashion_show_id };

    const callback = (error, results) => {
        if (error) {
            console.log("Error getFinalsByFashionShow:", error);
            return res.status(500).json(error);
        }

        res.locals.data = results;
        next();
    };

    model.selectRunwayStarsByShow(data, callback);
};

//Get all the finals ranks of all the shows
module.exports.getAllFinals = (req, res, next) => {
    const callback = (error, results) => {
        if (error) {
            console.log("Error getAllFinals:", error);
            return res.status(500).json(error);
        }

        // Store results in res.locals for withMessage middleware
        res.locals.data = results;
        next();
    };

    model.selectAllFinalRunwayStars(callback);
};

//delete Entry by fashion_show_id and user_id
module.exports.deleteEntry = (req, res, next) => {
    const data = {
        fashion_show_id: req.params.fashion_show_id,
        user_id: req.params.user_id
    };

    const callback = (error, results) => {
        if (error){
            console.log("Error deleteEntry:", error);
            return res.status(500).json(error);
        }
            
        next();
    };

    model.deleteEntry(data, callback)
};

//Get User Rank: state ranked top 1,2,3 or unranked
module.exports.getUserRank = (req, res, next) => {
    const data = {
        fashion_show_id: req.params.fashion_show_id,
        user_id: res.locals.userId
    };

    const callback = (err, results) => {
        if (err) {
            console.error("Error getUserRank:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
        
        // If no results, user is unranked (not in top 3)
        if (!results || results.length === 0) {
            res.locals.data = {
                user_id: data.user_id,
                final_rank: null,
                total_attraction: 0,
                status: "unranked"
            };
        } else {
            res.locals.data = results[0];
        }
        
        next();
    };

    model.getUserRank(data, callback);
};



