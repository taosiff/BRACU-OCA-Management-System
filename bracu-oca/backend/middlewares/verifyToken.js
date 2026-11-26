const jwt = require("jsonwebtoken");

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || process.env.JWT_Secret;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET environment variable is required in production");
    }
    return "devsecret";
  }
  return secret;
}

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied: Missing token" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access Denied: Missing token" });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.decoded = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Access Denied: Invalid or expired token" });
  }
};

const requireRole = (...allowedRoles) => (req, res, next) => {
  if (!req.decoded || !allowedRoles.includes(req.decoded.role)) {
    return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
  }
  next();
};

const requireSelfOrOca = (paramName = "email") => (req, res, next) => {
  const targetEmail = req.params[paramName];
  if (!req.decoded) {
    return res.status(401).json({ message: "Access Denied" });
  }
  if (req.decoded.role === "oca" || req.decoded.email === targetEmail) {
    return next();
  }
  return res.status(403).json({ message: "Forbidden: Access restricted to own account or OCA" });
};

module.exports = verifyToken;
module.exports.verifyToken = verifyToken;
module.exports.requireRole = requireRole;
module.exports.requireSelfOrOca = requireSelfOrOca;
module.exports.getJwtSecret = getJwtSecret;
