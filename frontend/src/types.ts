export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  _id: string;
  originalName: string;
  fileUrl: string;
  size: number;
  createdAt: string;
  user?: { name: string };
  fileName?: string;
}

export interface Appointment {
  _id: string;
  patientId: any;
  doctorId: any;
  date: string;
  time: string;
  reason: string;
  status: string;
  notes?: string;
}

export interface MedicalDocument {
  _id: string;
  title: string;
  documentType: string;
  description?: string;
  fileUrl: string;
  createdAt: string;
}

export interface Doctor {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface ShareDocument {
  shareId: string;
  document: MedicalDocument;
  patient: { name: string; email: string };
  permission: string;
  expiresAt?: string;
  sharedAt: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface EmergencyProfileData {
  fullName: string;
  age: number | null;
  bloodGroup: string;
  allergies: string[];
  conditions: string[];
  medications: string[];
  emergencyContacts: EmergencyContact[];
  notes: string;
}

export interface EmergencyPrivateData {
  emergencyAccessEnabled: boolean;
  emergencyToken: string;
  publicUrl: string;
  emergencyProfile: EmergencyProfileData;
  updatedAt: string;
}

export interface VitalLog {
  _id: string;
  userId: string;
  date: string;
  weight: number | null;
  height: number | null;
  bmi: number | null;
  bloodPressureSystolic: number | null;
  bloodPressureDiastolic: number | null;
  bloodSugarFasting: number | null;
  bloodSugarRandom: number | null;
  heartRate: number | null;
  oxygenLevel: number | null;
  temperature: number | null;
  sleepHours: number | null;
  steps: number | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsTrendInfo {
  direction: 'up' | 'down' | 'stable';
  recentAverage: number | null;
  previousAverage: number | null;
  interpretation: string;
}

export interface AnalyticsChartsData {
  weight: Array<{ date: string; weight: number | null }>;
  bloodPressure: Array<{ date: string; systolic: number | null; diastolic: number | null }>;
  sugar: Array<{ date: string; fasting: number | null; random: number | null }>;
  sleep: Array<{ date: string; sleepHours: number | null }>;
}

export interface RiskIndicator {
  key: string;
  title: string;
  status: string;
  severity: 'good' | 'warning' | 'neutral';
}

export interface ReportSignal {
  key: string;
  title: string;
  recommendation?: string;
}

export interface AnalyticsDashboardData {
  healthScore: number;
  healthScoreBand: string;
  trends: {
    weight: AnalyticsTrendInfo;
    bloodPressure: AnalyticsTrendInfo;
    sugar: AnalyticsTrendInfo;
    sleep: AnalyticsTrendInfo;
  };
  riskFlags: string[];
  recommendations: string[];
  latestVitals: VitalLog | null;
  chartsData: AnalyticsChartsData;
  summaryInsights: string[];
  riskIndicators: RiskIndicator[];
  reportAnalysis: {
    reportCount: number;
    lastReportDate: string | null;
    signals: ReportSignal[];
    recommendations: string[];
  };
  quickSummary: string;
  lastUpdated: string | null;
}

export interface AnalyticsSummaryData {
  healthScore: number;
  healthScoreBand: string;
  insights: string[];
  riskFlags: string[];
  recommendations: string[];
  lastUpdated: string | null;
}

export interface VitalsFormValues {
  date: string;
  weight: string;
  height: string;
  bloodPressureSystolic: string;
  bloodPressureDiastolic: string;
  bloodSugarFasting: string;
  bloodSugarRandom: string;
  heartRate: string;
  oxygenLevel: string;
  temperature: string;
  sleepHours: string;
  steps: string;
  notes: string;
}
