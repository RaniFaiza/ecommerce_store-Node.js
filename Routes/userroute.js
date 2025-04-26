//import package
const express = require('express');
const userroutes = express.Router();

//import files
const {
    userregistershow, userregister,
    showlogin, login

} = require('../Controllers/userController');

//User Register
userroutes.get('/register',userregistershow);
userroutes.post('/register',userregister);

//User Login
userroutes.get('/login',showlogin);
userroutes.post('/login',login);

module.exports = {
    userroutes,
}