import express from 'express';

const router = express.Router();

//route for user sign-up
router.get('/signup', (req, res) => {
    res.send('Sign Up Endpoint');
});

// route for user log-out
router.get('/logout', (req, res) => {
    res.send('Log Out Endpoint');
});

// route for user log-in
router.get("/login", (req, res) => {
    res.send("Login Endpoint");
});


export default router;