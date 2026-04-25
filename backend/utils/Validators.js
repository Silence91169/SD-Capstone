const mongoose = require("mongoose");
const DateUtils = require("./DateUtils");

class Validators {
  static hasOwn(source, key) {
    return Object.prototype.hasOwnProperty.call(source, key);
  }

  static parseOptionalNumber(value, fieldName, min, max) {
    if (value === undefined || value === null || value === "") {
      return null;
    }

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      const error = new Error(`${fieldName} must be a valid number`);
      error.statusCode = 400;
      throw error;
    }

    if (min !== undefined && parsed < min) {
      const error = new Error(`${fieldName} must be at least ${min}`);
      error.statusCode = 400;
      throw error;
    }

    if (max !== undefined && parsed > max) {
      const error = new Error(`${fieldName} must be at most ${max}`);
      error.statusCode = 400;
      throw error;
    }

    return parsed;
  }

  static parseOptionalInteger(value, fieldName, min, max) {
    const parsed = this.parseOptionalNumber(value, fieldName, min, max);
    if (parsed === null) {
      return null;
    }

    if (!Number.isInteger(parsed)) {
      const error = new Error(`${fieldName} must be an integer`);
      error.statusCode = 400;
      throw error;
    }

    return parsed;
  }

  static parseOptionalString(value, fieldName, maxLength = 500) {
    if (value === undefined || value === null || value === "") {
      return "";
    }

    if (typeof value !== "string") {
      const error = new Error(`${fieldName} must be a string`);
      error.statusCode = 400;
      throw error;
    }

    const normalized = value.trim();
    if (normalized.length > maxLength) {
      const error = new Error(`${fieldName} exceeds allowed length`);
      error.statusCode = 400;
      throw error;
    }

    return normalized;
  }

  static validateVitalsPayload(payload, { partial = false } = {}) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      const error = new Error("Invalid request body");
      error.statusCode = 400;
      throw error;
    }

    const result = {};
    const numericFields = [
      { key: "weight", min: 1, max: 400 },
      { key: "height", min: 30, max: 260 },
      { key: "bloodPressureSystolic", min: 60, max: 260 },
      { key: "bloodPressureDiastolic", min: 30, max: 160 },
      { key: "bloodSugarFasting", min: 30, max: 500 },
      { key: "bloodSugarRandom", min: 30, max: 600 },
      { key: "heartRate", min: 20, max: 240 },
      { key: "oxygenLevel", min: 40, max: 100 },
      { key: "temperature", min: 90, max: 115 },
      { key: "sleepHours", min: 0, max: 24 },
    ];

    const metricKeys = [];

    numericFields.forEach(({ key, min, max }) => {
      if (!partial || this.hasOwn(payload, key)) {
        result[key] = this.parseOptionalNumber(payload[key], key, min, max);
        if (result[key] !== null) {
          metricKeys.push(key);
        }
      }
    });

    if (!partial || this.hasOwn(payload, "steps")) {
      result.steps = this.parseOptionalInteger(payload.steps, "steps", 0, 200000);
      if (result.steps !== null) {
        metricKeys.push("steps");
      }
    }

    if (!partial || this.hasOwn(payload, "notes")) {
      result.notes = this.parseOptionalString(payload.notes, "notes", 500);
    }

    if (!partial || this.hasOwn(payload, "date")) {
      result.date = DateUtils.normalizeDate(payload.date, "date");
    }

    if (!partial && metricKeys.length === 0) {
      const error = new Error("At least one vital metric is required");
      error.statusCode = 400;
      throw error;
    }

    if (partial) {
      const hasAnyUpdatableKey = Object.keys(result).length > 0;
      if (!hasAnyUpdatableKey) {
        const error = new Error("No valid fields supplied for update");
        error.statusCode = 400;
        throw error;
      }
    }

    return result;
  }

  static validateMongoId(id, fieldName = "id") {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error(`${fieldName} is invalid`);
      error.statusCode = 400;
      throw error;
    }
  }
}

module.exports = Validators;
