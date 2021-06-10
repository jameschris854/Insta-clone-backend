const AppError = require('../utils/appError');

const sendErrorProd = (err,req, res) => {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      console.log({
        status: err.status,
        message: err.message,
      });
    } else {
      //1)log error
      console.error('ERROR', err);
      //2)send generic message
  
      res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
      });
    }
  };

module.exports  = (err,req,res,next) => {
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';


    sendErrorProd(err,req,res)
}