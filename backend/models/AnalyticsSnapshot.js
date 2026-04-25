const mongoose = require("mongoose");

const analyticsSnapshotSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    healthScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    riskFlags: {
      type: [String],
      default: [],
    },
    recommendations: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

module.exports = mongoose.model("AnalyticsSnapshot", analyticsSnapshotSchema);
