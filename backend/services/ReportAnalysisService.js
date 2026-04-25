class ReportAnalysisService {
  constructor({ medicalRecordModel, medicalDocumentModel, dateUtils }) {
    this.medicalRecordModel = medicalRecordModel;
    this.medicalDocumentModel = medicalDocumentModel;
    this.dateUtils = dateUtils;
  }

  buildSignal(payload, signals, recommendations) {
    if (!signals.find((signal) => signal.key === payload.key)) {
      signals.push(payload);
    }

    if (payload.recommendation && !recommendations.includes(payload.recommendation)) {
      recommendations.push(payload.recommendation);
    }
  }

  inferSignalsFromText(textBlob) {
    const signals = [];
    const recommendations = [];

    if (/(sugar|glucose|hba1c|diabet)/i.test(textBlob)) {
      this.buildSignal(
        {
          key: "sugar_reports",
          title: "Glucose-related reports found",
          recommendation: "Consider scheduling periodic fasting sugar and HbA1c monitoring.",
        },
        signals,
        recommendations
      );
    }

    if (/(bp|blood pressure|hypertension|cardio)/i.test(textBlob)) {
      this.buildSignal(
        {
          key: "bp_reports",
          title: "Blood pressure/cardiac reports found",
          recommendation: "Track blood pressure regularly and compare with your vitals trend.",
        },
        signals,
        recommendations
      );
    }

    if (/(lipid|cholesterol|triglyceride)/i.test(textBlob)) {
      this.buildSignal(
        {
          key: "lipid_reports",
          title: "Lipid profile reports found",
          recommendation: "Maintain heart-healthy nutrition and review lipid profiles with your doctor.",
        },
        signals,
        recommendations
      );
    }

    if (/(thyroid|tsh|t3|t4)/i.test(textBlob)) {
      this.buildSignal(
        {
          key: "thyroid_reports",
          title: "Thyroid-related reports found",
          recommendation: "Monitor thyroid-related symptoms and follow up on periodic lab checks.",
        },
        signals,
        recommendations
      );
    }

    if (/(sleep|apnea)/i.test(textBlob)) {
      this.buildSignal(
        {
          key: "sleep_reports",
          title: "Sleep-related reports found",
          recommendation: "Keep sleep logs consistent and target 7-9 hours where possible.",
        },
        signals,
        recommendations
      );
    }

    return { signals, recommendations };
  }

  async analyzeUserReports(userId) {
    const [medicalRecords, medicalDocuments] = await Promise.all([
      this.medicalRecordModel
        .find({ user: userId })
        .select("originalName fileName createdAt")
        .sort({ createdAt: -1 })
        .lean(),
      this.medicalDocumentModel
        .find({ patientId: userId })
        .select("title description documentType createdAt")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const reportCount = medicalRecords.length + medicalDocuments.length;
    const allDates = [...medicalRecords, ...medicalDocuments]
      .map((item) => item.createdAt)
      .filter(Boolean)
      .map((dateValue) => new Date(dateValue));

    const lastReportDate =
      allDates.length > 0
        ? new Date(Math.max(...allDates.map((date) => date.getTime()))).toISOString()
        : null;

    if (reportCount === 0) {
      return {
        reportCount,
        lastReportDate,
        signals: [],
        recommendations: [],
      };
    }

    const reportTexts = [
      ...medicalRecords.map((item) => `${item.originalName || ""} ${item.fileName || ""}`),
      ...medicalDocuments.map((item) => `${item.title || ""} ${item.description || ""} ${item.documentType || ""}`),
    ]
      .join(" ")
      .toLowerCase();

    const inferred = this.inferSignalsFromText(reportTexts);

    return {
      reportCount,
      lastReportDate,
      signals: inferred.signals,
      recommendations: inferred.recommendations,
    };
  }
}

module.exports = ReportAnalysisService;
