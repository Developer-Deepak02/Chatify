import express from 'express';
import { signup } from '../controllers/auth.controllers.js';

const router = express.Router();

//route for user sign-up
router.post('/signup', signup )

// route for user log-out
router.get('/logout', (req, res) => {
    res.send('Log Out Endpoint');
});

// route for user log-in
router.get("/login", (req, res) => {
    res.send("Login Endpoint");
});


export default router;