import express from 'express';
import { signup , login ,logout } from '../controllers/auth.controllers.js';

const router = express.Router();

//route for user sign-up
router.post('/signup', signup )

// route for user log-in
router.post('/login', login )

// route for user log-out
router.post('/logout', logout )

export default router;