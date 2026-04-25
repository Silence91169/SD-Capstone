class Validator {
  static assertNonEmptyString(value, fieldName, maxLength = 500) {
    if (typeof value !== "string" || !value.trim()) {
      const error = new Error(`${fieldName} is required`);
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

  static optionalString(value, fieldName, maxLength = 500) {
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

  static optionalAge(value) {
    if (value === undefined || value === null || value === "") {
      return null;
    }

    const normalized = Number(value);
    if (!Number.isInteger(normalized) || normalized < 0 || normalized > 130) {
      const error = new Error("age must be an integer between 0 and 130");
      error.statusCode = 400;
      throw error;
    }

    return normalized;
  }

  static optionalBoolean(value, fieldName) {
    if (typeof value !== "boolean") {
      const error = new Error(`${fieldName} must be a boolean`);
      error.statusCode = 400;
      throw error;
    }

    return value;
  }

  static sanitizeStringArray(value, fieldName, maxItems = 20, maxLength = 120) {
    if (value === undefined || value === null) {
      return [];
    }

    if (!Array.isArray(value)) {
      const error = new Error(`${fieldName} must be an array`);
      error.statusCode = 400;
      throw error;
    }

    if (value.length > maxItems) {
      const error = new Error(`${fieldName} supports at most ${maxItems} items`);
      error.statusCode = 400;
      throw error;
    }

    return value
      .map((item, index) => {
        if (typeof item !== "string") {
          const error = new Error(`${fieldName}[${index}] must be a string`);
          error.statusCode = 400;
          throw error;
        }
        const normalized = item.trim();
        if (!normalized) {
          return "";
        }
        if (normalized.length > maxLength) {
          const error = new Error(`${fieldName}[${index}] exceeds allowed length`);
          error.statusCode = 400;
          throw error;
        }
        return normalized;
      })
      .filter(Boolean);
  }

  static sanitizeEmergencyContacts(contacts) {
    if (contacts === undefined || contacts === null) {
      return [];
    }

    if (!Array.isArray(contacts)) {
      const error = new Error("emergencyContacts must be an array");
      error.statusCode = 400;
      throw error;
    }

    if (contacts.length > 5) {
      const error = new Error("emergencyContacts supports at most 5 contacts");
      error.statusCode = 400;
      throw error;
    }

    return contacts.map((contact, index) => {
      if (!contact || typeof contact !== "object") {
        const error = new Error(`emergencyContacts[${index}] is invalid`);
        error.statusCode = 400;
        throw error;
      }

      return {
        name: this.assertNonEmptyString(contact.name, `emergencyContacts[${index}].name`, 80),
        relation: this.assertNonEmptyString(contact.relation, `emergencyContacts[${index}].relation`, 80),
        phone: this.assertNonEmptyString(contact.phone, `emergencyContacts[${index}].phone`, 30),
      };
    });
  }

  static validateEmergencyPayload(payload) {
    if (!payload || typeof payload !== "object") {
      const error = new Error("Invalid request body");
      error.statusCode = 400;
      throw error;
    }

    return {
      fullName: this.optionalString(payload.fullName, "fullName", 120),
      age: this.optionalAge(payload.age),
      bloodGroup: this.optionalString(payload.bloodGroup, "bloodGroup", 10).toUpperCase(),
      allergies: this.sanitizeStringArray(payload.allergies, "allergies", 20, 120),
      conditions: this.sanitizeStringArray(payload.conditions, "conditions", 20, 120),
      medications: this.sanitizeStringArray(payload.medications, "medications", 20, 120),
      emergencyContacts: this.sanitizeEmergencyContacts(payload.emergencyContacts),
      notes: this.optionalString(payload.notes, "notes", 500),
    };
  }

  static validateToken(token) {
    if (typeof token !== "string") {
      const error = new Error("Invalid token");
      error.statusCode = 400;
      throw error;
    }

    const normalized = token.trim();
    if (!/^[a-f0-9]{24,64}$/i.test(normalized)) {
      const error = new Error("Invalid token");
      error.statusCode = 400;
      throw error;
    }

    return normalized;
  }
}

module.exports = Validator;
