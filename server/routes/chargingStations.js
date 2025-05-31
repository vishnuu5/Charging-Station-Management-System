const express = require("express");
const { body, validationResult } = require("express-validator");
const ChargingStation = require("../models/ChargingStation");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all charging stations
router.get("/", auth, async (req, res) => {
  try {
    const {
      status,
      connectorType,
      minPower,
      maxPower,
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (connectorType) filter.connectorType = connectorType;
    if (minPower || maxPower) {
      filter.powerOutput = {};
      if (minPower) filter.powerOutput.$gte = Number(minPower);
      if (maxPower) filter.powerOutput.$lte = Number(maxPower);
    }

    const skip = (page - 1) * limit;

    const stations = await ChargingStation.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await ChargingStation.countDocuments(filter);

    res.json({
      stations,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get stations error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching charging stations" });
  }
});

// Get single charging station
router.get("/:id", auth, async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!station) {
      return res.status(404).json({ message: "Charging station not found" });
    }

    res.json(station);
  } catch (error) {
    console.error("Get station error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching charging station" });
  }
});

// Create charging station
router.post(
  "/",
  auth,
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("location.latitude")
      .isFloat({ min: -90, max: 90 })
      .withMessage("Invalid latitude"),
    body("location.longitude")
      .isFloat({ min: -180, max: 180 })
      .withMessage("Invalid longitude"),
    body("powerOutput")
      .isFloat({ min: 1, max: 350 })
      .withMessage("Power output must be between 1-350 kW"),
    body("connectorType")
      .isIn(["Type 1", "Type 2", "CCS", "CHAdeMO", "Tesla Supercharger"])
      .withMessage("Invalid connector type"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const stationData = {
        ...req.body,
        createdBy: req.user._id,
      };

      const station = new ChargingStation(stationData);
      await station.save();

      await station.populate("createdBy", "name email");

      res.status(201).json({
        message: "Charging station created successfully",
        station,
      });
    } catch (error) {
      console.error("Create station error:", error);
      res
        .status(500)
        .json({ message: "Server error while creating charging station" });
    }
  }
);

// Update charging station
router.put(
  "/:id",
  auth,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("location.latitude")
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage("Invalid latitude"),
    body("location.longitude")
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage("Invalid longitude"),
    body("powerOutput")
      .optional()
      .isFloat({ min: 1, max: 350 })
      .withMessage("Power output must be between 1-350 kW"),
    body("connectorType")
      .optional()
      .isIn(["Type 1", "Type 2", "CCS", "CHAdeMO", "Tesla Supercharger"])
      .withMessage("Invalid connector type"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const station = await ChargingStation.findById(req.params.id);

      if (!station) {
        return res.status(404).json({ message: "Charging station not found" });
      }

      // Check if user owns the station or is admin
      if (
        station.createdBy.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this charging station" });
      }

      const updatedStation = await ChargingStation.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).populate("createdBy", "name email");

      res.json({
        message: "Charging station updated successfully",
        station: updatedStation,
      });
    } catch (error) {
      console.error("Update station error:", error);
      res
        .status(500)
        .json({ message: "Server error while updating charging station" });
    }
  }
);

// Delete charging station
router.delete("/:id", auth, async (req, res) => {
  try {
    const station = await ChargingStation.findById(req.params.id);

    if (!station) {
      return res.status(404).json({ message: "Charging station not found" });
    }

    // Check if user owns the station or is admin
    if (
      station.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this charging station" });
    }

    await ChargingStation.findByIdAndDelete(req.params.id);

    res.json({ message: "Charging station deleted successfully" });
  } catch (error) {
    console.error("Delete station error:", error);
    res
      .status(500)
      .json({ message: "Server error while deleting charging station" });
  }
});

module.exports = router;
