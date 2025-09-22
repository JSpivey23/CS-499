const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // Enable JSON Web Tokens
const User = require("../models/user");

const tripsController = require("../controllers/trips");
const authController = require("../controllers/authentication");

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);

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
  .get(tripsController.tripsList) //Get method routes triplist
  .post(authenticateJWT, tripsController.tripsAddTrip); //Post method that adds a trip

//Get Method routes tripsFindByCode - requires Parameter
router
  .route("/trips/:tripCode")
  .get(tripsController.tripsFindByCode)
  .put(authenticateJWT, tripsController.tripsUpdateTrip);

module.exports = router;
