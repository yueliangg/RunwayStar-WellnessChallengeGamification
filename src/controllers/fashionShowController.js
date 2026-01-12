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
        show_id: req.params.fashion_show_id || res.locals.fashion_show_id || req.body.fashion_show_id
    };

    const callback = (error, results) => {
        if (error) {
            console.log("Error getFashionShow:", error);
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Fashion show not found" });
        }

        res.locals.data = results[0];  

        next();
    };

    model.selectFashionShow(data, callback);
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

