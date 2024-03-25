import express from 'express';
const router = express.Router();

// Users routes
import userRouter from './users.js';
import steamRouter from './steamGames.js';
import authRouter from './auth.js';


// Routes
router.use('/', userRouter);
router.use('/', steamRouter);
router.use('/', authRouter);

export default router;