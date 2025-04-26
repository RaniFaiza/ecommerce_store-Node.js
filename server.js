//import packages
const express = require('express');
const dotenv = require('dotenv');
const {dbconn} = require('./config/dbconfig');
const morgan = require('morgan');

//import files
const {userroutes} = require('./Routes/userroute');

//dotenv config
dotenv.config();

//db connection
dbconn();

//rest object
const app = express();

//Middleware
app.use(express.json());
app.use(morgan('dev'));

//Routes
app.use('/api/v1/user',userroutes);
app.get('/', (req,resp)=>{
    resp.status(200).send("Welcome to E-commerce Store.");
});

const PORT = process.env.PORT || 3100;

app.listen(PORT, ()=>{
    console.log(`server is running in ${process.env.DEV_MODE} mode on port ${PORT}`);
});
