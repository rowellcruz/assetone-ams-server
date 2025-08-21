const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const err = new Error("Unauthorized: No token provided");
    err.status = 401;
    return next(err);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    err.status = err.name === "TokenExpiredError" ? 401 : 403;
    err.message = err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    next(err);
  }
}

module.exports = authenticate;