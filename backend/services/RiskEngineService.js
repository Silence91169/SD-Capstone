class RiskEngineService {
  getBloodPressureStatus(systolic, diastolic) {
    if (typeof systolic !== "number" && typeof diastolic !== "number") {
      return "Unknown";
    }

    if ((typeof systolic === "number" && systolic >= 140) || (typeof diastolic === "number" && diastolic >= 90)) {
      return "Stage 2";
    }

    if ((typeof systolic === "number" && systolic >= 130) || (typeof diastolic === "number" && diastolic >= 80)) {
      return "Stage 1";
    }

    if (typeof systolic === "number" && systolic >= 120 && (!diastolic || diastolic < 80)) {
      return "Elevated";
    }

    if ((typeof systolic !== "number" || systolic < 120) && (typeof diastolic !== "number" || diastolic < 80)) {
      return "Normal";
    }

    return "Unknown";
  }

  getSugarRisk(fasting, random) {
    if (typeof fasting !== "number" && typeof random !== "number") {
      return "Unknown";
    }

    const hasHighReading =
      (typeof fasting === "number" && (fasting >= 126 || fasting < 70)) ||
      (typeof random === "number" && (random >= 200 || random < 70));

    if (hasHighReading) {
      return "High";
    }

    const hasPrediabetesReading =
      (typeof fasting === "number" && fasting >= 100 && fasting < 126) ||
      (typeof random === "number" && random >= 140 && random < 200);

    if (hasPrediabetesReading) {
      return "Prediabetes";
    }

    return "Normal";
  }

  getBmiCategory(bmi) {
    if (typeof bmi !== "number") {
      return "Unknown";
    }

    if (bmi < 18.5) {
      return "Underweight";
    }

    if (bmi < 25) {
      return "Healthy";
    }

    if (bmi < 30) {
      return "Overweight";
    }

    return "Obese";
  }

  generateRiskProfile(latestVitals) {
    const bloodPressureStatus = this.getBloodPressureStatus(
      latestVitals?.bloodPressureSystolic,
      latestVitals?.bloodPressureDiastolic
    );
    const sugarRisk = this.getSugarRisk(latestVitals?.bloodSugarFasting, latestVitals?.bloodSugarRandom);
    const bmiCategory = this.getBmiCategory(latestVitals?.bmi);

    const riskFlags = [];

    if (bloodPressureStatus === "Elevated") {
      riskFlags.push("Blood pressure is elevated.");
    }
    if (bloodPressureStatus === "Stage 1") {
      riskFlags.push("Blood pressure in Stage 1 range.");
    }
    if (bloodPressureStatus === "Stage 2") {
      riskFlags.push("Blood pressure in Stage 2 range.");
    }

    if (bmiCategory === "Overweight") {
      riskFlags.push("BMI is above healthy range.");
    }
    if (bmiCategory === "Obese") {
      riskFlags.push("BMI indicates obesity risk.");
    }
    if (bmiCategory === "Underweight") {
      riskFlags.push("BMI is below healthy range.");
    }

    if (sugarRisk === "Prediabetes") {
      riskFlags.push("Blood sugar is in prediabetes range.");
    }
    if (sugarRisk === "High") {
      riskFlags.push("Blood sugar is in high-risk range.");
    }

    if (typeof latestVitals?.sleepHours === "number" && latestVitals.sleepHours < 7) {
      riskFlags.push("Average sleep is below 7 hours.");
    }

    if (typeof latestVitals?.steps === "number" && latestVitals.steps < 5000) {
      riskFlags.push("Daily activity level is low.");
    }

    if (typeof latestVitals?.oxygenLevel === "number" && latestVitals.oxygenLevel < 95) {
      riskFlags.push("Oxygen saturation appears lower than ideal.");
    }

    if (
      typeof latestVitals?.heartRate === "number" &&
      (latestVitals.heartRate < 50 || latestVitals.heartRate > 100)
    ) {
      riskFlags.push("Heart rate is outside common resting range.");
    }

    return {
      bloodPressureStatus,
      sugarRisk,
      bmiCategory,
      riskFlags,
    };
  }

  getRiskIndicators(riskProfile, latestVitals) {
    const sleepStatus =
      typeof latestVitals?.sleepHours !== "number"
        ? "Unknown"
        : latestVitals.sleepHours < 7
          ? "Low"
          : "Good";

    return [
      {
        key: "bp",
        title: "Blood Pressure",
        status: riskProfile.bloodPressureStatus,
        severity:
          riskProfile.bloodPressureStatus === "Normal"
            ? "good"
            : riskProfile.bloodPressureStatus === "Unknown"
              ? "neutral"
              : "warning",
      },
      {
        key: "bmi",
        title: "BMI",
        status: riskProfile.bmiCategory,
        severity: riskProfile.bmiCategory === "Healthy" ? "good" : riskProfile.bmiCategory === "Unknown" ? "neutral" : "warning",
      },
      {
        key: "sleep",
        title: "Sleep",
        status: sleepStatus,
        severity: sleepStatus === "Good" ? "good" : sleepStatus === "Unknown" ? "neutral" : "warning",
      },
      {
        key: "sugar",
        title: "Blood Sugar",
        status: riskProfile.sugarRisk,
        severity: riskProfile.sugarRisk === "Normal" ? "good" : riskProfile.sugarRisk === "Unknown" ? "neutral" : "warning",
      },
    ];
  }
}

module.exports = RiskEngineService;
