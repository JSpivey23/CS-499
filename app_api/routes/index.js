const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // Enable JSON Web Tokens
const User = require("../models/user");

const tripsController = require("../controllers/trips");
const authController = require("../controllers/authentication");
const {
  tripsGetLimiter, tripsPutLimiter, tripsPostLimiter, loginIpLimiter, loginUserLimiter
} = require("../utils/limiters");


router.route("/register").post(authController.register);
router.route("/login").post(loginIpLimiter, loginUserLimiter,authController.login);

//Method to authenticate our JWT
async function authenticateJWT(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Authorization required" });

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Authorization required" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload._id)
      .select("_id email name isAdmin")
      .lean();
    if (!user) return res.status(401).json({ message: "Invalid token" });

    req.user = user;
    return next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

router
  .route("/trips")
  .get(tripsGetLimiter, tripsController.tripsList) //Get method routes triplist
  .post(authenticateJWT, tripsPostLimiter, tripsController.tripsAddTrip); //Post method that adds a trip

//Get Method routes tripsFindByCode - requires Parameter
router
  .route("/trips/:tripCode")
  .get(tripsGetLimiter, tripsController.tripsFindByCode)
  .put(authenticateJWT, tripsPutLimiter, tripsController.tripsUpdateTrip);

module.exports = router;
