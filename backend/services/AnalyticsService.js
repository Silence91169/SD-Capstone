class AnalyticsService {
  constructor({
    vitalsService,
    riskEngineService,
    healthScoreService,
    reportAnalysisService,
    analyticsSnapshotModel,
    dateUtils,
  }) {
    this.vitalsService = vitalsService;
    this.riskEngineService = riskEngineService;
    this.healthScoreService = healthScoreService;
    this.reportAnalysisService = reportAnalysisService;
    this.analyticsSnapshotModel = analyticsSnapshotModel;
    this.dateUtils = dateUtils;
  }

  isNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
  }

  pickSugarValue(log) {
    if (this.isNumber(log?.bloodSugarFasting)) {
      return log.bloodSugarFasting;
    }
    if (this.isNumber(log?.bloodSugarRandom)) {
      return log.bloodSugarRandom;
    }
    return null;
  }

  createEmptyTrends() {
    const trendTemplate = {
      direction: "stable",
      recentAverage: null,
      previousAverage: null,
      interpretation: "Insufficient historical data.",
    };

    return {
      weight: { ...trendTemplate },
      bloodPressure: { ...trendTemplate },
      sugar: { ...trendTemplate },
      sleep: { ...trendTemplate },
    };
  }

  buildTrend(logs, { label, accessor, higherIsBetter = true, epsilon = 0.1 }) {
    const { recent, previous } = this.dateUtils.splitRecentAndPrevious(logs, 3);
    const recentAverage = this.dateUtils.average(recent.map(accessor));
    const previousAverage = this.dateUtils.average(previous.map(accessor));
    const direction = this.dateUtils.detectDirection(recentAverage, previousAverage, epsilon);

    let interpretation = "Insufficient historical data.";

    if (recentAverage !== null && previousAverage !== null) {
      if (direction === "stable") {
        interpretation = `${label} is stable.`;
      } else if (direction === "up") {
        interpretation = higherIsBetter ? `${label} is improving.` : `${label} is worsening.`;
      } else {
        interpretation = higherIsBetter ? `${label} is worsening.` : `${label} is improving.`;
      }
    } else if (recentAverage !== null) {
      interpretation = `${label} baseline is now available.`;
    }

    return {
      direction,
      recentAverage: this.dateUtils.round(recentAverage, 2),
      previousAverage: this.dateUtils.round(previousAverage, 2),
      interpretation,
    };
  }

  buildTrends(vitalsHistory) {
    if (!vitalsHistory.length) {
      return this.createEmptyTrends();
    }

    return {
      weight: this.buildTrend(vitalsHistory, {
        label: "Weight",
        accessor: (log) => log.weight,
        higherIsBetter: false,
        epsilon: 0.2,
      }),
      bloodPressure: this.buildTrend(vitalsHistory, {
        label: "Blood pressure",
        accessor: (log) => log.bloodPressureSystolic,
        higherIsBetter: false,
        epsilon: 1,
      }),
      sugar: this.buildTrend(vitalsHistory, {
        label: "Blood sugar",
        accessor: (log) => this.pickSugarValue(log),
        higherIsBetter: false,
        epsilon: 1,
      }),
      sleep: this.buildTrend(vitalsHistory, {
        label: "Sleep",
        accessor: (log) => log.sleepHours,
        higherIsBetter: true,
        epsilon: 0.2,
      }),
    };
  }

  buildChartsData(vitalsHistory) {
    const ordered = this.dateUtils.sortByDateAsc(vitalsHistory);
    const mapDate = (entry) => this.dateUtils.formatDateLabel(entry.date || entry.createdAt);

    return {
      weight: ordered
        .filter((entry) => this.isNumber(entry.weight))
        .map((entry) => ({
          date: mapDate(entry),
          weight: this.dateUtils.round(entry.weight, 2),
        })),
      bloodPressure: ordered
        .filter((entry) => this.isNumber(entry.bloodPressureSystolic) || this.isNumber(entry.bloodPressureDiastolic))
        .map((entry) => ({
          date: mapDate(entry),
          systolic: entry.bloodPressureSystolic,
          diastolic: entry.bloodPressureDiastolic,
        })),
      sugar: ordered
        .filter((entry) => this.isNumber(entry.bloodSugarFasting) || this.isNumber(entry.bloodSugarRandom))
        .map((entry) => ({
          date: mapDate(entry),
          fasting: entry.bloodSugarFasting,
          random: entry.bloodSugarRandom,
        })),
      sleep: ordered
        .filter((entry) => this.isNumber(entry.sleepHours))
        .map((entry) => ({
          date: mapDate(entry),
          sleepHours: this.dateUtils.round(entry.sleepHours, 2),
        })),
    };
  }

  composeRecommendations({ riskProfile, trends, latestVitals, reportAnalysis }) {
    const recommendations = [];

    if (riskProfile.bloodPressureStatus === "Elevated" || riskProfile.bloodPressureStatus === "Stage 1") {
      recommendations.push("Blood pressure trending high. Consider monitoring regularly.");
    }
    if (riskProfile.bloodPressureStatus === "Stage 2") {
      recommendations.push("Blood pressure is in Stage 2 range. Please consult your doctor soon.");
    }

    if (riskProfile.bmiCategory === "Overweight" || riskProfile.bmiCategory === "Obese") {
      recommendations.push("BMI is above healthy range. Focus on sustainable diet and activity goals.");
    }

    if (riskProfile.sugarRisk === "Prediabetes") {
      recommendations.push("Blood sugar is in prediabetes range. Consider fasting sugar follow-up.");
    }

    if (riskProfile.sugarRisk === "High") {
      recommendations.push("Blood sugar appears high. Consider a fasting sugar test and medical review.");
    }

    if (this.isNumber(latestVitals?.sleepHours) && latestVitals.sleepHours < 7) {
      recommendations.push("Sleep average is below 7 hours. Improve sleep hygiene for recovery.");
    }

    if (this.isNumber(latestVitals?.steps) && latestVitals.steps < 7000) {
      recommendations.push("Daily activity is low. Aim for consistent step targets each week.");
    }

    if (trends.weight.direction === "down" && this.isNumber(trends.weight.previousAverage)) {
      recommendations.push("Good progress in weight management. Keep your current consistency.");
    }

    if (trends.sugar.direction === "down" && this.isNumber(trends.sugar.previousAverage)) {
      recommendations.push("Blood sugar trend appears to be improving. Continue monitoring.");
    }

    reportAnalysis.recommendations.forEach((item) => {
      recommendations.push(item);
    });

    if (recommendations.length === 0) {
      recommendations.push("Your current vitals look stable. Continue regular logging and preventive care.");
    }

    return [...new Set(recommendations)];
  }

  composeSummaryInsights({ trends, riskProfile, latestVitals, healthScoreBand, reportAnalysis }) {
    const insights = [];

    if (trends.weight.interpretation) {
      insights.push(`Weight: ${trends.weight.interpretation}`);
    }

    if (riskProfile.bloodPressureStatus !== "Unknown") {
      insights.push(`Blood pressure status: ${riskProfile.bloodPressureStatus}.`);
    }

    if (riskProfile.sugarRisk !== "Unknown") {
      insights.push(`Sugar risk: ${riskProfile.sugarRisk}.`);
    }

    if (this.isNumber(latestVitals?.sleepHours)) {
      if (latestVitals.sleepHours < 7) {
        insights.push("Sleep average is low and may affect recovery.");
      } else {
        insights.push("Sleep duration is within a generally healthy range.");
      }
    }

    insights.push(`Overall health score band: ${healthScoreBand}.`);

    if (reportAnalysis.signals.length > 0) {
      insights.push(`Report analysis: ${reportAnalysis.signals[0].title}.`);
    }

    return [...new Set(insights)];
  }

  async persistSnapshot(userId, healthScore, riskFlags, recommendations) {
    try {
      await this.analyticsSnapshotModel.findOneAndUpdate(
        { userId },
        {
          $set: {
            healthScore,
            riskFlags,
            recommendations,
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    } catch {
      // Snapshot caching is optional and should never fail the analytics response.
    }
  }

  buildEmptyAnalytics(reportAnalysis) {
    const recommendations = [
      "Start logging vitals to unlock trend insights and a personalized health score.",
      ...reportAnalysis.recommendations,
    ];

    return {
      healthScore: 0,
      healthScoreBand: "Needs Attention",
      trends: this.createEmptyTrends(),
      riskFlags: [],
      recommendations: [...new Set(recommendations)],
      latestVitals: null,
      chartsData: {
        weight: [],
        bloodPressure: [],
        sugar: [],
        sleep: [],
      },
      summaryInsights: [
        "No vitals history found yet.",
        "Add your first log to generate analytics trends.",
      ],
      riskIndicators: [
        { key: "bp", title: "Blood Pressure", status: "Unknown", severity: "neutral" },
        { key: "bmi", title: "BMI", status: "Unknown", severity: "neutral" },
        { key: "sleep", title: "Sleep", status: "Unknown", severity: "neutral" },
        { key: "sugar", title: "Blood Sugar", status: "Unknown", severity: "neutral" },
      ],
      reportAnalysis,
      quickSummary: "Begin logging vitals regularly to activate personalized analytics.",
      lastUpdated: null,
    };
  }

  async buildAnalytics(userId) {
    const vitalsHistory = await this.vitalsService.getVitalsHistory(userId, { limit: 200 });
    const reportAnalysis = await this.reportAnalysisService.analyzeUserReports(userId);

    const latestVitals = vitalsHistory[0] || null;
    if (!latestVitals) {
      return this.buildEmptyAnalytics(reportAnalysis);
    }

    const riskProfile = this.riskEngineService.generateRiskProfile(latestVitals);
    const trends = this.buildTrends(vitalsHistory);
    const healthScore = this.healthScoreService.calculateHealthScore({
      latestVitals,
      historyCount: vitalsHistory.length,
      riskProfile,
    });
    const healthScoreBand = this.healthScoreService.getScoreBand(healthScore);

    const recommendations = this.composeRecommendations({
      riskProfile,
      trends,
      latestVitals,
      reportAnalysis,
    });

    const summaryInsights = this.composeSummaryInsights({
      trends,
      riskProfile,
      latestVitals,
      healthScoreBand,
      reportAnalysis,
    });

    const riskFlags =
      riskProfile.riskFlags.length > 0
        ? riskProfile.riskFlags
        : ["No major risk flags detected from latest vitals."];

    const chartsData = this.buildChartsData(vitalsHistory);
    const riskIndicators = this.riskEngineService.getRiskIndicators(riskProfile, latestVitals);

    await this.persistSnapshot(userId, healthScore, riskFlags, recommendations);

    return {
      healthScore,
      healthScoreBand,
      trends,
      riskFlags,
      recommendations,
      latestVitals,
      chartsData,
      summaryInsights,
      riskIndicators,
      reportAnalysis,
      quickSummary: summaryInsights[0] || "Health analytics generated.",
      lastUpdated: latestVitals.updatedAt || latestVitals.date,
    };
  }

  async getDashboard(userId) {
    return this.buildAnalytics(userId);
  }

  async getSummary(userId) {
    const analytics = await this.buildAnalytics(userId);
    return {
      healthScore: analytics.healthScore,
      healthScoreBand: analytics.healthScoreBand,
      insights: analytics.summaryInsights,
      riskFlags: analytics.riskFlags,
      recommendations: analytics.recommendations,
      lastUpdated: analytics.lastUpdated,
    };
  }
}

module.exports = AnalyticsService;
