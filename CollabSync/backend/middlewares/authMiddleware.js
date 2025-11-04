const jwt= require("jsonwebtoken");
const User= require("../models/User");


//middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    token = token.split(" ")[1]; // extract token
    
    if (!token) {
      return res.status(401).json({ message: "Not authorized, invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }

    req.user = await User.findById(decoded.id).select("-password");
    
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Token failed", error: error.message });
  }
};

//middleware for admin-only access
const adminOnly=(req, res, next) =>{
    if(req.user && req.user.role==="admin"){
        next();
    }else{
        res.status(403).json({message: "Access denied, admin only"});
    }
};

module.exports ={protect, adminOnly};
