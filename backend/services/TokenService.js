const crypto = require("crypto");

class TokenService {
  constructor(emergencyProfileRepository) {
    this.emergencyProfileRepository = emergencyProfileRepository;
  }

  generateSecureToken() {
    return crypto.randomBytes(24).toString("hex");
  }

  async generateUniqueToken(maxAttempts = 5) {
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const token = this.generateSecureToken();
      const exists = await this.emergencyProfileRepository.existsByToken(token);
      if (!exists) {
        return token;
      }
    }

    const error = new Error("Could not generate a unique emergency token");
    error.statusCode = 500;
    throw error;
  }
}

module.exports = TokenService;
