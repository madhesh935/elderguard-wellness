import { motion } from "framer-motion";
import { Heart, Activity, Footprints, AlertTriangle } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Line, LineChart } from "recharts";
import type { ElderlyMonitorData, TrendPoint } from "@/lib/elderguard/types";
import { heartRateStatusOf } from "@/lib/elderguard/data-source";

interface Props {
  data: ElderlyMonitorData;
  trend: TrendPoint[];
}

export function MetricCards({ data, trend }: Props) {
  const hrStatus = heartRateStatusOf(data.heartRate);
  const hrTone =
    hrStatus === "Normal" ? "text-success" : hrStatus === "Low" ? "text-warning-foreground" : "text-danger";

  return (
    <section id="vitals" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Heart Rate */}
      <Card delay={0}>
        <CardHead icon={Heart} iconClass="text-danger" title="Heart Rate" animateIcon />
        <div className="mt-3 flex items-end gap-2">
          <motion.span
            key={data.heartRate}
            initial={{ opacity: 0.4, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold tabular-nums"
          >
            {data.heartRate}
          </motion.span>
          <span className="mb-1 text-sm font-medium text-muted-foreground">BPM</span>
        </div>
        <StatusPill tone={hrTone} label={`Status: ${hrStatus}`} />
        <Spark data={trend} dataKey="heartRate" color="var(--color-danger)" />
      </Card>

      {/* Pulse Sensor */}
      <Card delay={0.05}>
        <CardHead icon={Activity} iconClass="text-primary" title="Pulse Sensor" />
        <div className="mt-3 flex items-end gap-2">
          <motion.span
            key={data.pulseValue}
            initial={{ opacity: 0.4, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold tabular-nums"
          >
            {data.pulseValue}
          </motion.span>
          <span className="mb-1 text-sm font-medium text-muted-foreground">raw</span>
        </div>
        <StatusPill
          tone={
            data.signalQuality === "Strong"
              ? "text-success"
              : data.signalQuality === "Fair"
                ? "text-warning-foreground"
                : "text-danger"
          }
          label={`Signal: ${data.signalQuality}`}
        />
        <Spark data={trend} dataKey="pulseValue" color="var(--color-primary)" type="line" />
      </Card>

      {/* Movement */}
      <Card delay={0.1}>
        <CardHead icon={Footprints} iconClass="text-chart-5" title="Movement" />
        <div className="mt-3 flex items-end gap-2">
          <motion.span
            key={data.movement}
            initial={{ opacity: 0.4, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl font-bold"
          >
            {data.movement}
          </motion.span>
        </div>
        <StatusPill tone="text-muted-foreground" label={`MPU6050 · ${data.acceleration.toFixed(2)} g`} />
        <Spark data={trend} dataKey="activity" color="var(--color-chart-5)" />
      </Card>

      {/* Fall Detection */}
      <FallCard fall={data.fallDetected} />
    </section>
  );
}

function FallCard({ fall }: { fall: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className={`relative overflow-hidden rounded-2xl border p-5 shadow-card transition-colors ${
        fall ? "border-danger bg-danger text-danger-foreground animate-pulse-ring" : "glass-card"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${fall ? "text-danger-foreground" : "text-muted-foreground"}`}>
          Fall Detection
        </span>
        <AlertTriangle className={`h-5 w-5 ${fall ? "text-danger-foreground" : "text-success"}`} />
      </div>

      {fall ? (
        <motion.div animate={{ scale: [1, 1.04, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="mt-4">
          <p className="font-display text-2xl font-extrabold">FALL DETECTED</p>
          <p className="mt-1 text-sm font-medium text-danger-foreground/90">Help needed immediately</p>
        </motion.div>
      ) : (
        <div className="mt-4">
          <p className="font-display text-2xl font-bold text-success">Safe</p>
          <p className="mt-1 text-sm text-muted-foreground">No fall detected</p>
        </div>
      )}

      <div className={`mt-4 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium ${
        fall ? "bg-white/20" : "bg-success-soft text-success"
      }`}>
        <span className={`h-2 w-2 rounded-full ${fall ? "bg-white" : "bg-success"}`} />
        {fall ? "Emergency protocol engaged" : "Monitoring stable"}
      </div>
    </motion.div>
  );
}

function Card({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card rounded-2xl p-5"
    >
      {children}
    </motion.div>
  );
}

function CardHead({
  icon: Icon,
  iconClass,
  title,
  animateIcon,
}: {
  icon: typeof Heart;
  iconClass: string;
  title: string;
  animateIcon?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold text-muted-foreground">{title}</span>
      <Icon className={`h-5 w-5 ${iconClass} ${animateIcon ? "animate-heartbeat" : ""}`} />
    </div>
  );
}

function StatusPill({ tone, label }: { tone: string; label: string }) {
  return <p className={`mt-1 text-sm font-medium ${tone}`}>{label}</p>;
}

function Spark({
  data,
  dataKey,
  color,
  type = "area",
}: {
  data: TrendPoint[];
  dataKey: keyof TrendPoint;
  color: string;
  type?: "area" | "line";
}) {
  return (
    <div className="mt-3 h-12">
      <ResponsiveContainer width="100%" height="100%">
        {type === "area" ? (
          <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`g-${String(dataKey)}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey={dataKey as string}
              stroke={color}
              strokeWidth={2}
              fill={`url(#g-${String(dataKey)})`}
              isAnimationActive={false}
            />
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <Line
              type="monotone"
              dataKey={dataKey as string}
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
