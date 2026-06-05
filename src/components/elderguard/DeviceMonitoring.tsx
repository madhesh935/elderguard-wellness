import { motion } from "framer-motion";
import { Cpu, Activity, Move3d, Database, Wifi, Thermometer, RefreshCw, Battery } from "lucide-react";
import type { DeviceStatus } from "@/lib/elderguard/types";

const DEVICE_META: {
  icon: typeof Cpu;
  iconColor: string;
  iconBg: string;
  firmwareOrDetail?: string;
  uptime?: string;
  battery?: number;
}[] = [
  {
    icon: Cpu,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    firmwareOrDetail: "Firmware v2.4",
    uptime: "12h 34m",
    battery: 87,
  },
  {
    icon: Activity,
    iconColor: "text-danger",
    iconBg: "bg-danger/10",
    firmwareOrDetail: "MAX30102",
    uptime: "12h 34m",
    battery: 87,
  },
  {
    icon: Move3d,
    iconColor: "text-chart-5",
    iconBg: "bg-[oklch(0.63_0.17_300/0.1)]",
    firmwareOrDetail: "6-axis IMU",
    uptime: "12h 34m",
  },
  {
    icon: Database,
    iconColor: "text-success",
    iconBg: "bg-success/10",
    firmwareOrDetail: "Google Cloud",
    uptime: "99.9% uptime",
  },
];

const EXTRA_STATS = [
  { icon: Thermometer, label: "MCU Temp", value: "28°C" },
  { icon: Wifi, label: "WiFi Signal", value: "-52 dBm" },
  { icon: RefreshCw, label: "Data Rate", value: "2s" },
  { icon: Battery, label: "Battery", value: "87%" },
];

export function DeviceMonitoring({ devices }: { devices: DeviceStatus[] }) {
  return (
    <section id="devices" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="section-heading">Device Monitoring</h2>
        <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
          {devices.filter((d) => d.online).length}/{devices.length} Online
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {devices.map((d, i) => {
          const meta = DEVICE_META[i % DEVICE_META.length];
          const Icon = meta.icon;
          return (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass-card-hover rounded-2xl p-4 border border-border"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.iconBg}`}>
                  <Icon className={`h-5 w-5 ${meta.iconColor}`} />
                </div>
                {/* Online / offline badge */}
                <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  d.online ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                }`}>
                  <span className={`relative flex h-2 w-2`}>
                    {d.online && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                    )}
                    <span className={`relative inline-flex h-2 w-2 rounded-full ${d.online ? "bg-success" : "bg-danger"}`} />
                  </span>
                  {d.online ? "Online" : "Offline"}
                </span>
              </div>

              {/* Device name + detail */}
              <div className="mt-3">
                <p className="text-sm font-semibold leading-tight">{d.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{d.detail}</p>
                {meta.firmwareOrDetail && (
                  <span className="mt-1.5 inline-block rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {meta.firmwareOrDetail}
                  </span>
                )}
              </div>

              {/* Battery bar (if applicable) */}
              {meta.battery && (
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Battery</span>
                    <span className="font-semibold text-foreground">{meta.battery}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all ${
                        meta.battery > 50 ? "bg-success" : meta.battery > 20 ? "bg-warning" : "bg-danger"
                      }`}
                      style={{ width: `${meta.battery}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Uptime */}
              {meta.uptime && (
                <p className="mt-2 text-[10px] text-muted-foreground">Uptime: {meta.uptime}</p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* System stats strip */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <Cpu className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">System Diagnostics</h3>
          <span className="ml-auto text-xs text-muted-foreground">ESP32-S3 · Live</span>
        </div>
        <div className="grid grid-cols-2 divide-border sm:grid-cols-4">
          {EXTRA_STATS.map((s, i) => (
            <div
              key={s.label}
              className={`flex items-center gap-3 px-5 py-4 ${i < 3 ? "sm:border-r border-border" : ""} ${i > 0 && i < 2 ? "border-t sm:border-t-0 border-border" : ""} ${i >= 2 ? "border-t sm:border-t-0 border-border" : ""}`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                <s.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="font-display text-sm font-bold">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
