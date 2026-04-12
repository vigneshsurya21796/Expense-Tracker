const errorhandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.node_env === "developement" ? err.stack : null,
  });
};

module.exports = errorhandler;
