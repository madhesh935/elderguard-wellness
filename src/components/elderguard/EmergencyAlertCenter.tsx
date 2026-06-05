import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, PhoneCall, Users, History, ShieldCheck } from "lucide-react";
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
      <h2 className="font-display text-lg font-bold">Emergency Alert Center</h2>

      <AnimatePresence mode="wait">
        {active ? (
          <motion.div
            key="alert"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="overflow-hidden rounded-2xl border-2 border-danger bg-danger text-danger-foreground shadow-glow-danger"
          >
            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20"
                >
                  <AlertTriangle className="h-7 w-7" />
                </motion.div>
                <div>
                  <p className="font-display text-2xl font-extrabold">🚨 FALL DETECTED</p>
                  <p className="text-sm text-danger-foreground/90">Immediate assistance required</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <Stat label="Time" value={fallEvent?.time?.slice(0, 8) ?? data.updatedAt.toString()} />
                <Stat label="Tilt Angle" value={`${(fallEvent?.angleX ?? data.angleX).toFixed(0)}°`} />
                <Stat label="Heart Rate" value={`${fallEvent?.heartRate ?? data.heartRate}`} />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-white/20 bg-white/10 p-4">
              <AlertBtn icon={PhoneCall} label="Call Caregiver" onClick={() => toast.success("Calling caregiver…")} />
              <AlertBtn icon={Users} label="Notify Family" onClick={() => toast.success(`Family notified at ${PATIENT.emergencyContact}`)} />
              <AlertBtn icon={History} label="View History" onClick={() => document.getElementById("history")?.scrollIntoView({ behavior: "smooth" })} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="safe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4 rounded-2xl border border-success/30 bg-success-soft p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-success">No Active Emergencies</p>
              <p className="text-sm text-muted-foreground">
                {PATIENT.name} is safe. The system will alert instantly if a fall is detected.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/15 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-danger-foreground/75">{label}</p>
      <p className="font-display text-base font-bold">{value}</p>
    </div>
  );
}

function AlertBtn({ icon: Icon, label, onClick }: { icon: typeof PhoneCall; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-danger transition-transform hover:scale-[1.03] active:scale-95"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
