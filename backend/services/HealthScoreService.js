class HealthScoreService {
  clampScore(score) {
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  getScoreBand(score) {
    if (score >= 85) {
      return "Excellent";
    }
    if (score >= 70) {
      return "Good";
    }
    if (score >= 55) {
      return "Fair";
    }
    return "Needs Attention";
  }

  calculateHealthScore({ latestVitals, historyCount, riskProfile }) {
    if (!latestVitals) {
      return 0;
    }

    let score = 100;

    switch (riskProfile.bmiCategory) {
      case "Underweight":
        score -= 8;
        break;
      case "Overweight":
        score -= 10;
        break;
      case "Obese":
        score -= 18;
        break;
      default:
        break;
    }

    switch (riskProfile.bloodPressureStatus) {
      case "Elevated":
        score -= 8;
        break;
      case "Stage 1":
        score -= 14;
        break;
      case "Stage 2":
        score -= 22;
        break;
      default:
        break;
    }

    switch (riskProfile.sugarRisk) {
      case "Prediabetes":
        score -= 12;
        break;
      case "High":
        score -= 22;
        break;
      default:
        break;
    }

    if (typeof latestVitals.sleepHours === "number") {
      if (latestVitals.sleepHours < 5) {
        score -= 15;
      } else if (latestVitals.sleepHours < 7) {
        score -= 8;
      } else if (latestVitals.sleepHours <= 9) {
        score += 2;
      } else {
        score -= 4;
      }
    }

    if (typeof latestVitals.steps === "number") {
      if (latestVitals.steps < 4000) {
        score -= 10;
      } else if (latestVitals.steps < 7000) {
        score -= 6;
      } else if (latestVitals.steps < 10000) {
        score -= 2;
      } else {
        score += 2;
      }
    }

    if (typeof latestVitals.oxygenLevel === "number" && latestVitals.oxygenLevel < 95) {
      score -= 8;
    }

    if (
      typeof latestVitals.heartRate === "number" &&
      (latestVitals.heartRate < 50 || latestVitals.heartRate > 100)
    ) {
      score -= 6;
    }

    if (historyCount >= 12) {
      score += 4;
    } else if (historyCount >= 6) {
      score += 2;
    } else if (historyCount <= 2) {
      score -= 8;
    } else if (historyCount <= 4) {
      score -= 4;
    }

    return this.clampScore(score);
  }
}

module.exports = HealthScoreService;
