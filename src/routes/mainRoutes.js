const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const wellnessChallengeRoutes = require('./wellnessChallengeRoutes');
const itemsRoutes = require('./itemsRoutes')
const inventoryRoutes = require('./inventoryRoutes')
const fashionShowRoutes = require('./fashionShowRoutes')
const fashionShowEntryRoutes = require('./fashionShowEntryRoutes')
const runwayStarRoutes = require('./runwayStarRoutes')
const authenticationRoutes = require('./aunthenticationRoutes')

router.use('/users', userRoutes);
router.use('/challenges', wellnessChallengeRoutes);
router.use('/items', itemsRoutes )
router.use('/inventory', inventoryRoutes)
router.use('/fashion-show', fashionShowRoutes)
router.use('/fashion-show-entry', fashionShowEntryRoutes);
router.use('/runway-star', runwayStarRoutes);
router.use('/authentication', authenticationRoutes);


module.exports = router;
