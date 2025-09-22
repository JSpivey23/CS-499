const mongoose = require("mongoose");
const Trip = require("../models/travlr"); //Register Model
const Model = mongoose.model("trips");

//Get: /trips - lists all the trips
//Regardless of outcome, response must include HTML status code
//and JSON message to the requesting client

const tripsList = async (req, res) => {
  const q = await Model.find({}).exec();

  console.log(q);

  if (!q) {
    return res.status(404).json(err);
  } else {
    return res.status(200).json(q);
  }
};

const tripsFindByCode = async (req, res) => {
  const q = await Model.find({ code: req.params.tripCode }) //return single record
    .exec();

  console.log(q);

  if (!q) {
    return res.status(404).json(err);
  } else {
    return res.status(200).json(q);
  }
};

const tripsAddTrip = async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Not Authorized to Create Trips. Must be an admin." });
  }

 const exists = await Trip.exists({ code: req.body.code });
    if (exists) {
      return res.status(409).json({ message: "Code is already in use. Try another." });
    }

  const normalizeTripRequest = (tripParameter) => {
    trim().toLowerCase.tripParameter
  }
  const newTrip = new Trip({
    code: normalizeTripRequest(req.body.code),
    name: normalizeTripRequest(req.body.name),
    length:normalizeTripRequest(req.body.length),
    start: normalizeTripRequest(req.body.start),
    resort: normalizeTripRequest(req.body.resort),
    perPerson: normalizeTripRequest(req.body.perPerson),
    image: req.body.image,
    description: normalizeTripRequest(req.body.description),
  });

  const q = await newTrip.save();

  if (!q) {
    return res.status(400).json(err);
  } else {
    return res.status(201).json(q);
  }
  console.log(q);
};

// PUT: /trips/:tripCode - Adds a new Trip
// Regardless of outcome, response must include HTML status

// and JSON message to the requesting client
const tripsUpdateTrip = async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res
      .status(403)
      .json({ message: "Not Authorized to Update Trips. Must be an admin." });
  }
  // Uncomment for debugging
  console.log(req.params);
  console.log(req.body);
  const q = await Model.findOneAndUpdate(
    { code: req.params.tripCode },
    {
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description,
    },
    {
      new: true,
      returnDocument: "after",
    }
  ).exec();
  if (!q) {
    // Database returned no data
    return res.status(400).json(err);
  } else {
    // Return resulting updated trip
    return res.status(201).json(q);
  }
  // Uncomment the following line to show results of
  // operation on the console
  // console.log(q);
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip,
};
