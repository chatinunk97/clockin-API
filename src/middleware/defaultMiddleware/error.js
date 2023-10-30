module.exports = (err, req, res, next) => {
  console.log(err);
  if (err.name === "ValidationError") {
    return (err.statusCode = 400);
  }
  if (err.name === "TokenExpiredError" || err.name === "JsonWedTokenError") {
    return (err.statusCode = 401);
  }
  console.log("####################");
  res.status(err.statusCode || 500).json({ message: err.message });
};
