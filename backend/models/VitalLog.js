const mongoose = require("mongoose");

const vitalLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    weight: {
      type: Number,
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
    bmi: {
      type: Number,
      default: null,
    },
    bloodPressureSystolic: {
      type: Number,
      default: null,
    },
    bloodPressureDiastolic: {
      type: Number,
      default: null,
    },
    bloodSugarFasting: {
      type: Number,
      default: null,
    },
    bloodSugarRandom: {
      type: Number,
      default: null,
    },
    heartRate: {
      type: Number,
      default: null,
    },
    oxygenLevel: {
      type: Number,
      default: null,
    },
    temperature: {
      type: Number,
      default: null,
    },
    sleepHours: {
      type: Number,
      default: null,
    },
    steps: {
      type: Number,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

vitalLogSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("VitalLog", vitalLogSchema);
