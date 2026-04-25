const mongoose = require("mongoose");

const emergencyContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    relation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },
  },
  { _id: false }
);

const emergencyProfileDataSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    age: {
      type: Number,
      min: 0,
      max: 130,
      default: null,
    },
    bloodGroup: {
      type: String,
      trim: true,
      maxlength: 10,
      default: "",
    },
    allergies: {
      type: [String],
      default: [],
    },
    conditions: {
      type: [String],
      default: [],
    },
    medications: {
      type: [String],
      default: [],
    },
    emergencyContacts: {
      type: [emergencyContactSchema],
      default: [],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  { _id: false }
);

const emergencyProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    emergencyAccessEnabled: {
      type: Boolean,
      default: false,
    },
    emergencyToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    emergencyProfile: {
      type: emergencyProfileDataSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EmergencyProfile", emergencyProfileSchema);