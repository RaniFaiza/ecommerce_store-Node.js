//import packages
const express = require('express');
const dotenv = require('dotenv');
const {dbconn} = require('./config/dbconfig');
const morgan = require('morgan');
require('express-async-errors');
//import files
const {authroutes} = require('./Routes/authRoute');
const { errorMiddleware } = require('./Middlewares/errorMiddleware');

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
app.use('/api/v1/auth',authroutes);
app.get('/', (req,resp)=>{
    resp.status(200).send("Welcome to E-commerce Store.");
});

//Error Middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 3100;

app.listen(PORT, ()=>{
    console.log(`server is running in ${process.env.DEV_MODE} mode on port ${PORT}`);
});
