//import package
const express = require('express');
const authroutes = express.Router();

//import files
const {
    userregistershow, userregister,
    showlogin, login, verifyEmail

} = require('../Controllers/authController');

// User Register
authroutes.get('/register',userregistershow);
authroutes.post('/register',userregister);

// User Login
authroutes.get('/login',showlogin);
authroutes.post('/login',login);

// Verify Email
authroutes.get('/verify-email',verifyEmail)
                                                                              
module.exports = {
    authroutes, 
}