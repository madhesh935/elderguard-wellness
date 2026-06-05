import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, PhoneCall, Users, History, ShieldCheck, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";
import type { ElderlyMonitorData } from "@/lib/elderguard/types";
import { PATIENT } from "@/lib/elderguard/types";

interface Props {
  data: ElderlyMonitorData;
  fallEvent: { time: string; angleX: number; angleY: number; heartRate: number } | null;
}

export function EmergencyAlertCenter({ data, fallEvent }: Props) {
  const active = data.fallDetected || !!fallEvent;

  return (
    <section id="alerts" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="section-heading">Emergency Alert Center</h2>
        <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
          active ? "bg-danger/10 text-danger" : "bg-success-soft text-success"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-danger animate-ping" : "bg-success"}`} />
          {active ? "ALERT ACTIVE" : "All Clear"}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {active ? (
          <motion.div
            key="alert"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="overflow-hidden rounded-2xl border-2 border-danger bg-danger text-danger-foreground shadow-glow-danger"
          >
            {/* Flashing top bar */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />

            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 0.9 }}
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 shadow-inner"
                >
                  <AlertTriangle className="h-8 w-8" />
                </motion.div>
                <div>
                  <p className="font-display text-2xl font-extrabold tracking-tight">🚨 FALL DETECTED</p>
                  <p className="text-sm text-danger-foreground/85">
                    <span className="font-semibold">{PATIENT.name}</span> requires immediate assistance
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-danger-foreground/70">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Detected at {fallEvent?.time?.slice(0, 8) ?? new Date(data.updatedAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
                <Stat label="Tilt X" value={`${(fallEvent?.angleX ?? data.angleX).toFixed(0)}°`} />
                <Stat label="Tilt Y" value={`${(fallEvent?.angleY ?? data.angleY).toFixed(0)}°`} />
                <Stat label="Heart Rate" value={`${fallEvent?.heartRate ?? data.heartRate} BPM`} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-white/20 bg-white/10 px-5 py-4">
              <AlertBtn
                icon={PhoneCall}
                label="Call Caregiver"
                onClick={() => toast.success("Calling caregiver…", { description: "Connecting to on-duty nurse." })}
              />
              <AlertBtn
                icon={Users}
                label="Notify Family"
                onClick={() => toast.success("Family notified", { description: `SMS sent to ${PATIENT.emergencyContact}` })}
              />
              <AlertBtn
                icon={MapPin}
                label="Share Location"
                onClick={() => toast.success("Location shared", { description: "Room 204, Ward B · Apollo Hospital" })}
              />
              <AlertBtn
                icon={History}
                label="View History"
                onClick={() => document.getElementById("history")?.scrollIntoView({ behavior: "smooth" })}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="safe"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="overflow-hidden rounded-2xl border border-success/25 bg-success-soft"
          >
            <div className="flex items-center gap-5 p-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-success shadow-md">
                <ShieldCheck className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-display text-lg font-bold text-success">No Active Emergencies</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {PATIENT.name} is safe. Fall detection is active and monitoring continuously.
                </p>
              </div>
            </div>

            {/* Info strip */}
            <div className="grid grid-cols-3 divide-x divide-success/20 border-t border-success/20 bg-success/5 text-center text-xs">
              <div className="px-4 py-3">
                <p className="text-muted-foreground">Today's Falls</p>
                <p className="mt-0.5 font-display text-lg font-bold text-success">0</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-muted-foreground">Response Time</p>
                <p className="mt-0.5 font-display text-lg font-bold text-success">&lt; 5s</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-muted-foreground">Sensitivity</p>
                <p className="mt-0.5 font-display text-lg font-bold text-success">High</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/15 px-3 py-2.5 backdrop-blur-sm">
      <p className="text-[10px] uppercase tracking-wider text-danger-foreground/70">{label}</p>
      <p className="font-display text-lg font-bold">{value}</p>
    </div>
  );
}

function AlertBtn({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof PhoneCall;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-danger shadow-sm transition-all hover:scale-[1.03] hover:shadow-md active:scale-95"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
