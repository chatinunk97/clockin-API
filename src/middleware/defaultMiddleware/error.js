module.exports = (err, req, res, next) => {
  console.log(err);
  if (err.name === 'ValidationError') {
    err.statusCode = 400;
  }
  if (err.name === 'TokenExpiredError' || err.name === 'JsonWedTokenError') {
    err.statusCode = 401;
  }
  console.log('####################');
  res.status(err.statusCode || 500).json({ message: err.message });
};
