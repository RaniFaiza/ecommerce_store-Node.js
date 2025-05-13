const errorMiddleware = (err,req,resp,next)=>{
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

     resp.status(statusCode).json({
        status:'false',
        message:message
    });
}

module.exports = {errorMiddleware}