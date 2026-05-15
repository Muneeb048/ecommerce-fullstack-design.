/**
 * 404 handler — catches requests to undefined routes.
 * Must be registered AFTER all routes but BEFORE errorHandler.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found — ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = notFound;
