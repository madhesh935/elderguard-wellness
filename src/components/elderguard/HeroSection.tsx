import { motion } from "framer-motion";
import { Activity, CheckCircle2, Cpu, Wifi } from "lucide-react";
import type { ElderlyMonitorData } from "@/lib/elderguard/types";
import { statusOf } from "@/lib/elderguard/status";
import { PATIENT } from "@/lib/elderguard/types";

export function HeroSection({ data }: { data: ElderlyMonitorData | null }) {
  const style = data ? statusOf(data.status) : statusOf("NORMAL");

  return (
    <motion.section
      id="overview"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary to-[oklch(0.45_0.16_265)] p-6 text-primary-foreground shadow-card sm:p-8"
    >
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            Monitoring Active
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">ElderGuard</h1>
          <p className="mt-2 text-sm text-primary-foreground/85 sm:text-base">
            Real-Time Elderly Health &amp; Fall Monitoring System — watching over{" "}
            <span className="font-semibold">{PATIENT.name}</span>, {PATIENT.age}.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Badge icon={Cpu} label="ESP32-S3 Connected" />
            <Badge icon={Wifi} label="Firebase Synced" />
            <Badge icon={Activity} label="2s Live Refresh" />
          </div>
        </div>

        <motion.div
          key={data?.status}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex shrink-0 items-center gap-4 rounded-2xl bg-white/12 p-5 backdrop-blur-sm"
        >
          <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${style.bg}`}>
            <CheckCircle2 className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-primary-foreground/70">
              Current Health Status
            </p>
            <p className="font-display text-2xl font-bold">{style.label}</p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function Badge({ icon: Icon, label }: { icon: typeof Cpu; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
