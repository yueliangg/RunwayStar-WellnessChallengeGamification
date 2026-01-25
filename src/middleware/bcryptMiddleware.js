// Import Modules
const bcrypt = require("bcrypt");

// Set Salt Rounds (Encryption Layers)
const saltRounds = 10;

// Compare Password
// Used during Login to verify Password
// Takes 1 Raw Password (from req.body) + 1 Hashed Password (from DB)
module.exports.comparePassword = (req, res, next) => {
  console.log("Input password:", req.body.password);
  console.log("DB hashed password:", res.locals.hash);

  
  const callback = (err, isMatch) => {
    if (err) {
      console.error("Error bcrypt:", err);
      return res.status(500).json(err);
    }

    if (isMatch) {
      return next();
    } 
    else {
      return res.status(401).json({ message: "Wrong password" });
      
    }
  };

  bcrypt.compare(req.body.password, res.locals.hash, callback);
};

// Hash (Encrypt) Password
// Used during Register to encrypt Password
// Make sure this encrypted password is stored in DB instead of raw
module.exports.hashPassword = (req, res, next) => {
  const callback = (err, hash) => {
    if (err) {
      console.error("Error bcrypt:", err);
      return res.status(500).json(err);
    }

    res.locals.hash = hash;
    next();
  };

  bcrypt.hash(req.body.password, saltRounds, callback);
};
