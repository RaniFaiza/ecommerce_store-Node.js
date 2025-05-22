const errorMiddleware = (err,req,resp,next)=>{
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    //Check for mongoose validation error
    if(err.name === 'ValidationError'){
        statusCode = 400;
        message = Object.values(err.errors).map(items=>items.message)
    }

    //Check for duplicate key
    if(err.code && err.code === 11000 ){
        statusCode = 409;
        const field = Object.keys(err.keyValue);
        message = `Duplicate key error: ${field} must be unique.`
    }
    
    resp.status(statusCode).json({
        status:'false',
        message
    });
}

module.exports = {errorMiddleware}