import { motion } from "framer-motion";
import { HeartPulse, ShieldCheck, AlertTriangle } from "lucide-react";
import type { ElderlyMonitorData } from "@/lib/elderguard/types";
import { statusOf } from "@/lib/elderguard/status";

export function ElderStatusPanel({ data }: { data: ElderlyMonitorData }) {
  const style = statusOf(data.status);
  const Icon = data.status === "NORMAL" ? ShieldCheck : AlertTriangle;

  const message =
    data.status === "CRITICAL"
      ? data.fallDetected
        ? "Fall detected — emergency response required."
        : "Heart rate critically high — alert caregiver."
      : data.status === "WARNING"
        ? "Heart rate below normal range — keep watching."
        : "All vitals within healthy range.";

  return (
    <motion.div
      key={data.status}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl border-2 p-6 text-center shadow-card ${style.softBg} border-transparent ring-1 ${style.ring}`}
    >
      <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${style.bg}`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Elder Status
      </p>
      <p className={`font-display text-3xl font-extrabold ${style.text}`}>{style.label}</p>
      <p className="mt-2 text-sm text-foreground/80">{message}</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Mini icon={HeartPulse} label="Heart Rate" value={`${data.heartRate} BPM`} />
        <Mini icon={ShieldCheck} label="Fall Status" value={data.fallDetected ? "Detected" : "Clear"} />
      </div>
    </motion.div>
  );
}

function Mini({ icon: Icon, label, value }: { icon: typeof HeartPulse; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card/70 p-3 text-left">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1 font-display text-lg font-bold">{value}</p>
    </div>
  );
}
