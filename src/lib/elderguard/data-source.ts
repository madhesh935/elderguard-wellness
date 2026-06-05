import {
  type ElderlyMonitorData,
  type HealthStatus,
  type HeartRateStatus,
  type MovementState,
  type SignalQuality,
} from "./types";

/**
 * ElderGuard data source.
 *
 * This module simulates a live Firebase Realtime Database feed so the dashboard
 * runs end-to-end out of the box. To connect a real Firebase project:
 *
 *   1. `bun add firebase`
 *   2. Initialize the app with your config and call:
 *        import { getDatabase, ref, onValue } from "firebase/database";
 *        const db = getDatabase(app);
 *        onValue(ref(db, "elderly_monitor"), (snap) => callback(snap.val()));
 *   3. Replace `subscribeToMonitor` below with that listener — the UI already
 *      reacts to the same `ElderlyMonitorData` shape.
 */

function deriveHeartRateStatus(bpm: number): HeartRateStatus {
  if (bpm < 60) return "Low";
  if (bpm > 100) return "High";
  return "Normal";
}

export function deriveStatus(bpm: number, fallDetected: boolean): HealthStatus {
  if (fallDetected || bpm > 100) return "CRITICAL";
  if (bpm < 60) return "WARNING";
  return "NORMAL";
}

export function heartRateStatusOf(bpm: number): HeartRateStatus {
  return deriveHeartRateStatus(bpm);
}

type Subscriber = (data: ElderlyMonitorData) => void;

let current: ElderlyMonitorData = {
  heartRate: 78,
  pulseValue: 1650,
  fallDetected: false,
  status: "NORMAL",
  angleX: 12.4,
  angleY: 5.1,
  movement: "Active",
  acceleration: 1.02,
  signalQuality: "Strong",
  updatedAt: Date.now(),
};

const subscribers = new Set<Subscriber>();
let timer: ReturnType<typeof setInterval> | null = null;
let tick = 0;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function nextSample(): ElderlyMonitorData {
  tick += 1;

  // Occasionally simulate a fall event, then auto-recover after a few ticks.
  const triggerFall = !current.fallDetected && Math.random() < 0.012;
  const stillFalling = current.fallDetected && Math.random() > 0.35;
  const fallDetected = triggerFall || stillFalling;

  const baseline = 78 + Math.sin(tick / 8) * 6;
  let heartRate = Math.round(baseline + (Math.random() - 0.5) * 8);
  if (fallDetected) heartRate = clamp(heartRate + 28, 60, 140);
  // Rare spontaneous warning/critical drift for demo realism.
  if (!fallDetected && Math.random() < 0.04) heartRate = Math.random() < 0.5 ? 54 : 108;
  heartRate = clamp(heartRate, 44, 145);

  const pulseValue = Math.round(1600 + Math.sin(tick / 3) * 180 + (Math.random() - 0.5) * 120);

  const acceleration = fallDetected
    ? +(2.6 + Math.random() * 1.2).toFixed(2)
    : +(0.9 + Math.random() * 0.5).toFixed(2);

  const movement: MovementState = fallDetected
    ? "Idle"
    : acceleration > 1.15
      ? "Active"
      : acceleration > 1.0
        ? "Resting"
        : "Idle";

  const angleX = fallDetected
    ? +(60 + Math.random() * 25).toFixed(1)
    : +(8 + Math.random() * 10).toFixed(1);
  const angleY = fallDetected
    ? +(48 + Math.random() * 20).toFixed(1)
    : +(3 + Math.random() * 8).toFixed(1);

  const signalQuality: SignalQuality =
    pulseValue > 1750 ? "Strong" : pulseValue > 1500 ? "Fair" : "Weak";

  current = {
    heartRate,
    pulseValue,
    fallDetected,
    status: deriveStatus(heartRate, fallDetected),
    angleX,
    angleY,
    movement,
    acceleration,
    signalQuality,
    updatedAt: Date.now(),
  };
  return current;
}

export function getSnapshot(): ElderlyMonitorData {
  return current;
}

export function subscribeToMonitor(cb: Subscriber): () => void {
  subscribers.add(cb);
  cb(current);

  if (!timer) {
    timer = setInterval(() => {
      const sample = nextSample();
      subscribers.forEach((s) => s(sample));
    }, 2000);
  }

  return () => {
    subscribers.delete(cb);
    if (subscribers.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}
