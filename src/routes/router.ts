const router = require('express').Router();

// Users routes
const userRouter = require('./users');
const steamRouter = require('./steamGames');
const authRouter = require('./auth');

// Routes
router.use('/', userRouter);
router.use('/', steamRouter);
router.use('/', authRouter);

module.exports = router;