/**
 * Global error-handling middleware.
 * Must be registered AFTER all routes.
 */
const errorHandler = (err, req, res, _next) => {
  console.error('💥 Error:', err.stack || err.message);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
