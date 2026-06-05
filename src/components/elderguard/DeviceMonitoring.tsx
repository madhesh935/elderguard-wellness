import { motion } from "framer-motion";
import { Cpu, Activity, Move3d, Database } from "lucide-react";
import type { DeviceStatus } from "@/lib/elderguard/types";

const ICONS = [Cpu, Activity, Move3d, Database];

export function DeviceMonitoring({ devices }: { devices: DeviceStatus[] }) {
  return (
    <section id="devices" className="space-y-4">
      <h2 className="font-display text-lg font-bold">Device Monitoring</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {devices.map((d, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card flex items-center gap-3 rounded-2xl p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{d.name}</p>
                <p className="truncate text-xs text-muted-foreground">{d.detail}</p>
              </div>
              <span className="flex items-center gap-1.5">
                <span className={`relative flex h-2.5 w-2.5`}>
                  {d.online && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                  )}
                  <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${d.online ? "bg-success" : "bg-danger"}`} />
                </span>
                <span className={`text-xs font-medium ${d.online ? "text-success" : "text-danger"}`}>
                  {d.online ? "Online" : "Offline"}
                </span>
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
