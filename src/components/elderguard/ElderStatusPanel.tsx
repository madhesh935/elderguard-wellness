import { motion } from "framer-motion";
import { HeartPulse, ShieldCheck, AlertTriangle, Move3d, Activity } from "lucide-react";
import type { ElderlyMonitorData } from "@/lib/elderguard/types";
import { statusOf } from "@/lib/elderguard/status";
import { PATIENT } from "@/lib/elderguard/types";

export function ElderStatusPanel({ data }: { data: ElderlyMonitorData }) {
  const style = statusOf(data.status);
  const Icon = data.status === "NORMAL" ? ShieldCheck : AlertTriangle;

  const message =
    data.status === "CRITICAL"
      ? data.fallDetected
        ? "Fall detected — emergency response required immediately."
        : "Heart rate critically elevated — alert caregiver now."
      : data.status === "WARNING"
      ? "Heart rate below normal range — continue monitoring closely."
      : "All vitals within healthy range. Patient is stable.";

  const heartRateBar = Math.min(100, Math.max(0, ((data.heartRate - 40) / (150 - 40)) * 100));

  return (
    <motion.div
      key={data.status}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl border-2 p-5 shadow-card ${style.softBg} border-transparent ring-1 ${style.ring}`}
    >
      {/* Status icon + label */}
      <div className="flex flex-col items-center text-center">
        <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl ${style.bg} shadow-lg`}>
          <Icon className="h-8 w-8 text-white" />
          {/* Pulsing ring for critical */}
          {data.status === "CRITICAL" && (
            <span className="absolute -inset-1 rounded-2xl border-2 border-danger animate-pulse opacity-60" />
          )}
        </div>
        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Elder Status
        </p>
        <p className={`font-display text-3xl font-extrabold ${style.text}`}>{style.label}</p>
        <p className="mt-1.5 text-sm text-foreground/75 max-w-[200px]">{message}</p>
      </div>

      {/* Heart rate bar */}
      <div className="mt-4">
        <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
          <span>Heart Rate</span>
          <span className="font-semibold text-foreground">{data.heartRate} BPM</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-card/70">
          <motion.div
            animate={{ width: `${heartRateBar}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full rounded-full ${
              data.heartRate > 100 ? "bg-danger" : data.heartRate < 60 ? "bg-warning" : "bg-success"
            }`}
          />
        </div>
        <div className="mt-0.5 flex justify-between text-[9px] text-muted-foreground">
          <span>40</span>
          <span className="text-success">60–100 normal</span>
          <span>150</span>
        </div>
      </div>

      {/* Mini stats grid */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Mini icon={HeartPulse} label="Heart Rate" value={`${data.heartRate} BPM`} />
        <Mini icon={ShieldCheck} label="Fall Status" value={data.fallDetected ? "⚠ Detected" : "✓ Clear"} danger={data.fallDetected} />
        <Mini icon={Move3d} label="Tilt X / Y" value={`${data.angleX.toFixed(0)}° / ${data.angleY.toFixed(0)}°`} />
        <Mini icon={Activity} label="Movement" value={data.movement} />
      </div>

      {/* Patient tag */}
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-card/60 px-3 py-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{PATIENT.name}</span>
        <span>·</span>
        <span>{PATIENT.age} yrs</span>
        <span>·</span>
        <span className="text-primary font-medium">{PATIENT.bloodGroup}</span>
      </div>
    </motion.div>
  );
}

function Mini({
  icon: Icon,
  label,
  value,
  danger,
}: {
  icon: typeof HeartPulse;
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl bg-card/70 p-2.5 text-left">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{label}</span>
      </div>
      <p className={`mt-1 font-display text-sm font-bold ${danger ? "text-danger" : ""}`}>{value}</p>
    </div>
  );
}
