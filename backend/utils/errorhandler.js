class ErrorHandler extends Error{
     constructor(message,statusCode)
     {
         super(message); // super is a constructor of class "Error"
         this.statusCode = statusCode;
         
         Error.captureStackTrace(this,this.constructor);

     }
}

module.exports = ErrorHandler;