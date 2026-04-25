class VitalsService {
  constructor({ vitalLogModel, validators, dateUtils }) {
    this.vitalLogModel = vitalLogModel;
    this.validators = validators;
    this.dateUtils = dateUtils;
  }

  calculateBmi(weight, heightCm) {
    if (typeof weight !== "number" || typeof heightCm !== "number" || heightCm <= 0) {
      return null;
    }

    const heightInMeters = heightCm / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return this.dateUtils.round(bmi, 2);
  }

  sanitizeCreatePayload(payload) {
    const validated = this.validators.validateVitalsPayload(payload, { partial: false });
    return {
      ...validated,
      bmi: this.calculateBmi(validated.weight, validated.height),
    };
  }

  sanitizeUpdatePayload(payload, existingLog) {
    const validated = this.validators.validateVitalsPayload(payload, { partial: true });

    const includesWeight = Object.prototype.hasOwnProperty.call(validated, "weight");
    const includesHeight = Object.prototype.hasOwnProperty.call(validated, "height");

    if (includesWeight || includesHeight) {
      const nextWeight = includesWeight ? validated.weight : existingLog.weight;
      const nextHeight = includesHeight ? validated.height : existingLog.height;
      validated.bmi = this.calculateBmi(nextWeight, nextHeight);
    }

    return validated;
  }

  async createVitalLog(userId, payload) {
    const data = this.sanitizeCreatePayload(payload);
    const created = await this.vitalLogModel.create({
      userId,
      ...data,
    });

    return created.toObject();
  }

  async getVitalsHistory(userId, { limit = 200 } = {}) {
    const normalizedLimit = Math.min(Math.max(Number(limit) || 200, 1), 500);

    return this.vitalLogModel
      .find({ userId })
      .sort({ date: -1, createdAt: -1 })
      .limit(normalizedLimit)
      .lean();
  }

  async getVitalByIdForUser(userId, vitalId) {
    this.validators.validateMongoId(vitalId, "vitalId");

    const vitalLog = await this.vitalLogModel.findOne({ _id: vitalId, userId });
    if (!vitalLog) {
      const error = new Error("Vital log not found");
      error.statusCode = 404;
      throw error;
    }

    return vitalLog;
  }

  async updateVitalLog(userId, vitalId, payload) {
    const existing = await this.getVitalByIdForUser(userId, vitalId);
    const updates = this.sanitizeUpdatePayload(payload, existing);

    Object.assign(existing, updates);
    await existing.save();

    return existing.toObject();
  }

  async deleteVitalLog(userId, vitalId) {
    this.validators.validateMongoId(vitalId, "vitalId");

    const deleted = await this.vitalLogModel.findOneAndDelete({ _id: vitalId, userId }).lean();
    if (!deleted) {
      const error = new Error("Vital log not found");
      error.statusCode = 404;
      throw error;
    }

    return {
      deletedId: vitalId,
    };
  }
}

module.exports = VitalsService;
