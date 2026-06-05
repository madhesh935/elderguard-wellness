import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { subscribeToMonitor, heartRateStatusOf } from "./data-source";
import type {
  ElderlyMonitorData,
  TrendPoint,
  HistoryRecord,
  DeviceStatus,
} from "./types";

const MAX_TREND = 30;

function activityLevel(d: ElderlyMonitorData): number {
  if (d.fallDetected) return 5;
  return Math.round(d.acceleration * 40);
}

function seedTrend(): TrendPoint[] {
  const now = Date.now();
  return Array.from({ length: MAX_TREND }, (_, i) => {
    const t = new Date(now - (MAX_TREND - i) * 2000);
    return {
      time: t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      heartRate: 78 + Math.round(Math.sin(i / 4) * 6),
      pulseValue: 1640 + Math.round(Math.sin(i / 3) * 150),
      activity: 38 + Math.round(Math.sin(i / 5) * 10),
    };
  });
}

function seedHistory(): HistoryRecord[] {
  const statuses = ["NORMAL", "NORMAL", "NORMAL", "WARNING", "CRITICAL"] as const;
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - i * 1000 * 60 * 73);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      id: `rec-${i}`,
      date: d.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      heartRate: 60 + Math.round(Math.random() * 50),
      pulseValue: 1500 + Math.round(Math.random() * 350),
      status,
      fallDetected: status === "CRITICAL" && Math.random() > 0.5,
    };
  });
}

export interface MonitorState {
  data: ElderlyMonitorData | null;
  trend: TrendPoint[];
  history: HistoryRecord[];
  devices: DeviceStatus[];
  loading: boolean;
  fallEvent: { time: string; angleX: number; angleY: number; heartRate: number } | null;
  clearFallEvent: () => void;
}

export function useElderlyMonitor(): MonitorState {
  const [data, setData] = useState<ElderlyMonitorData | null>(null);
  const [trend, setTrend] = useState<TrendPoint[]>(seedTrend);
  const [history] = useState<HistoryRecord[]>(seedHistory);
  const [loading, setLoading] = useState(true);
  const [fallEvent, setFallEvent] = useState<MonitorState["fallEvent"]>(null);

  const prev = useRef<ElderlyMonitorData | null>(null);

  useEffect(() => {
    const unsub = subscribeToMonitor((sample) => {
      setData(sample);
      setLoading(false);

      setTrend((t) => {
        const point: TrendPoint = {
          time: new Date(sample.updatedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          heartRate: sample.heartRate,
          pulseValue: sample.pulseValue,
          activity: activityLevel(sample),
        };
        return [...t.slice(-(MAX_TREND - 1)), point];
      });

      const p = prev.current;
      if (p) {
        if (sample.fallDetected && !p.fallDetected) {
          toast.error("🚨 Fall Detected", {
            description: "Immediate assistance required for John Smith.",
            duration: 8000,
          });
          setFallEvent({
            time: new Date(sample.updatedAt).toLocaleTimeString(),
            angleX: sample.angleX,
            angleY: sample.angleY,
            heartRate: sample.heartRate,
          });
        }
        const sNow = heartRateStatusOf(sample.heartRate);
        const sPrev = heartRateStatusOf(p.heartRate);
        if (sNow !== sPrev && !sample.fallDetected) {
          if (sNow === "High") toast.warning("Heart Rate High", { description: `${sample.heartRate} BPM detected.` });
          if (sNow === "Low") toast.warning("Heart Rate Low", { description: `${sample.heartRate} BPM detected.` });
        }
      }
      prev.current = sample;
    });
    return unsub;
  }, []);

  const devices: DeviceStatus[] = [
    { name: "ESP32-S3 Controller", online: true, detail: "Firmware v2.4 · 28°C" },
    { name: "Pulse Sensor", online: (data?.signalQuality ?? "Strong") !== "Weak", detail: `Signal: ${data?.signalQuality ?? "—"}` },
    { name: "MPU6050 IMU", online: true, detail: `accel ${data?.acceleration?.toFixed(2) ?? "—"} g` },
    { name: "Firebase Realtime DB", online: true, detail: "Synced · 2s interval" },
  ];

  return {
    data,
    trend,
    history,
    devices,
    loading,
    fallEvent,
    clearFallEvent: () => setFallEvent(null),
  };
}
