// ElderGuard — domain types shared across the dashboard.

export type HealthStatus = "NORMAL" | "WARNING" | "CRITICAL";
export type HeartRateStatus = "Normal" | "Low" | "High";
export type MovementState = "Active" | "Resting" | "Idle";
export type SignalQuality = "Strong" | "Fair" | "Weak";

/**
 * Mirrors the Firebase Realtime Database node:
 * {
 *   "elderly_monitor": {
 *     "heartRate": 78,
 *     "pulseValue": 1650,
 *     "fallDetected": false,
 *     "status": "NORMAL",
 *     "angleX": 12.4,
 *     "angleY": 5.1
 *   }
 * }
 */
export interface ElderlyMonitorData {
  heartRate: number;
  pulseValue: number;
  fallDetected: boolean;
  status: HealthStatus;
  angleX: number;
  angleY: number;
  movement: MovementState;
  acceleration: number;
  signalQuality: SignalQuality;
  updatedAt: number;
}

export interface TrendPoint {
  time: string;
  heartRate: number;
  pulseValue: number;
  activity: number;
}

export interface HistoryRecord {
  id: string;
  date: string;
  heartRate: number;
  pulseValue: number;
  status: HealthStatus;
  fallDetected: boolean;
}

export interface DeviceStatus {
  name: string;
  online: boolean;
  detail: string;
}

export interface PatientProfileData {
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  emergencyContact: string;
  medicalNotes: string;
}

export const PATIENT: PatientProfileData = {
  name: "John Smith",
  age: 72,
  gender: "Male",
  bloodGroup: "O+",
  emergencyContact: "+91 98765 43210",
  medicalNotes: "Hypertension. On daily beta-blocker. History of one prior fall (2023).",
};
