const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    const statusCode = 
      typeof error.statusCode === 'number' && error.statusCode >= 100 && error.statusCode <= 599
        ? error.statusCode
        : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


//2nd way
/*
const asyncHandler = (requestHandler) => { 
    return (req, res, next) => { 
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err));
    }; 
};
*/
export {asyncHandler} ;

