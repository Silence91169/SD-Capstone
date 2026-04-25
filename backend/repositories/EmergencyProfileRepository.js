const EmergencyProfile = require("../models/EmergencyProfile");

class EmergencyProfileRepository {
  static findByUserId(userId) {
    return EmergencyProfile.findOne({ user: userId });
  }

  static findByTokenAndEnabled(token) {
    return EmergencyProfile.findOne({
      emergencyToken: token,
      emergencyAccessEnabled: true,
    });
  }

  static create(payload) {
    return EmergencyProfile.create(payload);
  }

  static save(document) {
    return document.save();
  }

  static async existsByToken(token) {
    const count = await EmergencyProfile.countDocuments({ emergencyToken: token });
    return count > 0;
  }
}

module.exports = EmergencyProfileRepository;
