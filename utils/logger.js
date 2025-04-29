// utils/logger.js
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info', // Log level (can be error > warn > info > debug > silly) if it set to debug, it will work for all except silly
  format: format.combine(
    format.timestamp(), // Adds timestamp
    format.json() // Structured JSON logging
  ),
  transports: [
    // Console output (colored)
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    // File output (errors only)
    new transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    // File output (all logs)
    new transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

module.exports = logger;