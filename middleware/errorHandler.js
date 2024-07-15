const { constants } = require('../constants.js');

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);
  switch (statusCode) {
    case 400:
      res.json({
        title: constants.VALIDATION_ERROR,
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case 404:
      res.json({
        title: constants.NOT_FOUND,
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case 401:
      res.json({
        title: constants.UNAUTHORIZED,
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case 403:
      res.json({
        title: constants.FORBIDDEN,
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case 500:
      res.json({
        title: constants.SERVER_ERROR,
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case 503:
      res.json({
        title: constants.SERVICE_UNAVAILABLE,
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    default:
      console.log('No Error, All good!');
      break;
  }

};

module.exports = { errorHandler };
