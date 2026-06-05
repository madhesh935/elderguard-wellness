import { motion } from "framer-motion";
import { Activity, CheckCircle2, Cpu, Wifi, Battery, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import type { ElderlyMonitorData } from "@/lib/elderguard/types";
import { statusOf } from "@/lib/elderguard/status";
import { PATIENT } from "@/lib/elderguard/types";

export function HeroSection({ data }: { data: ElderlyMonitorData | null }) {
  const style = data ? statusOf(data.status) : statusOf("NORMAL");
  const [uptime, setUptime] = useState(0);

  // Live uptime counter in seconds
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setUptime(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${sec}s`;
    return `${sec}s`;
  };

  const initials = PATIENT.name
    .split(" ")
    .map((w) => w[0])
    .join("");

  return (
    <motion.section
      id="overview"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary via-[oklch(0.48_0.18_258)] to-[oklch(0.40_0.16_270)] p-6 text-primary-foreground shadow-card sm:p-8"
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 right-16 h-56 w-56 rounded-full bg-white/5 blur-2xl" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: identity + badges */}
        <div className="max-w-xl">
          {/* Live pill */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            Live Monitoring · Updates every 2s
          </div>

          {/* Patient avatar + name */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-xl font-bold backdrop-blur-sm ring-2 ring-white/30">
              {initials}
            </div>
            <div>
              <h1 className="font-display text-3xl font-extrabold sm:text-4xl">ElderGuard</h1>
              <p className="mt-0.5 text-sm text-primary-foreground/80">
                Watching over{" "}
                <span className="font-semibold text-white">{PATIENT.name}</span>
                {" · "}Age {PATIENT.age}
              </p>
            </div>
          </div>

          {/* Badges row */}
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge icon={Cpu} label="ESP32-S3 Connected" color="bg-white/15" />
            <Badge icon={Wifi} label="Firebase Synced" color="bg-white/15" />
            <Badge icon={Activity} label="2s Live Refresh" color="bg-white/15" />
            <Badge icon={Battery} label="Battery 87%" color="bg-white/15" />
            <Badge icon={Clock} label={`Uptime ${formatUptime(uptime)}`} color="bg-white/10" />
          </div>
        </div>

        {/* Right: status card */}
        <motion.div
          key={data?.status}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex shrink-0 flex-col gap-4 rounded-2xl bg-white/12 p-5 backdrop-blur-sm ring-1 ring-white/20 sm:flex-row sm:items-center"
        >
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${style.bg} shadow-lg`}
          >
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-primary-foreground/65">
              Current Health Status
            </p>
            <p className="font-display text-3xl font-extrabold">{style.label}</p>
            <p className="mt-1 text-xs text-primary-foreground/75">
              {data?.status === "NORMAL"
                ? "All vitals within safe range"
                : data?.status === "WARNING"
                ? "Heart rate outside normal range"
                : "Immediate attention required"}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom stats bar */}
      <div className="relative mt-6 flex flex-wrap gap-4 border-t border-white/15 pt-4 text-xs text-primary-foreground/70">
        <StatItem label="Heart Rate" value={`${data?.heartRate ?? "—"} BPM`} />
        <StatItem label="Tilt X" value={`${data?.angleX?.toFixed(1) ?? "—"}°`} />
        <StatItem label="Tilt Y" value={`${data?.angleY?.toFixed(1) ?? "—"}°`} />
        <StatItem label="Movement" value={data?.movement ?? "—"} />
        <StatItem label="Signal" value={data?.signalQuality ?? "—"} />
        <StatItem label="Fall Status" value={data?.fallDetected ? "⚠ DETECTED" : "✓ Clear"} />
      </div>
    </motion.section>
  );
}

function Badge({
  icon: Icon,
  label,
  color,
}: {
  icon: typeof Cpu;
  label: string;
  color: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg ${color} px-3 py-1.5 text-xs font-medium backdrop-blur-sm`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-medium">{label}:</span>
      <span className="font-bold text-white">{value}</span>
    </div>
  );
}
