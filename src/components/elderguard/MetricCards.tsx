import { motion } from "framer-motion";
import { Heart, Activity, Footprints, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Line, LineChart, ReferenceLine } from "recharts";
import type { ElderlyMonitorData, TrendPoint } from "@/lib/elderguard/types";
import { heartRateStatusOf } from "@/lib/elderguard/data-source";
import { useRef } from "react";

interface Props {
  data: ElderlyMonitorData;
  trend: TrendPoint[];
}

export function MetricCards({ data, trend }: Props) {
  const hrStatus = heartRateStatusOf(data.heartRate);
  const hrTone =
    hrStatus === "Normal" ? "text-success" : hrStatus === "Low" ? "text-warning-foreground" : "text-danger";

  // Compute trend direction: compare last 3 readings
  const last3Hr = trend.slice(-3).map((t) => t.heartRate);
  const hrTrendDir =
    last3Hr.length < 2 ? "stable" :
    last3Hr[last3Hr.length - 1] > last3Hr[0] ? "up" : last3Hr[last3Hr.length - 1] < last3Hr[0] ? "down" : "stable";

  const last3Pulse = trend.slice(-3).map((t) => t.pulseValue);
  const pulseTrendDir =
    last3Pulse.length < 2 ? "stable" :
    last3Pulse[last3Pulse.length - 1] > last3Pulse[0] ? "up" : last3Pulse[last3Pulse.length - 1] < last3Pulse[0] ? "down" : "stable";

  return (
    <section id="vitals" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Heart Rate */}
      <Card delay={0} accentColor="var(--color-danger)">
        <CardHead icon={Heart} iconClass="text-danger" iconBg="bg-danger/10" title="Heart Rate" animateIcon />
        <div className="mt-3 flex items-end justify-between">
          <div className="flex items-end gap-2">
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
          <TrendArrow dir={hrTrendDir} />
        </div>
        <StatusPill tone={hrTone} label={`Status: ${hrStatus}`} />
        <p className="mt-0.5 text-[11px] text-muted-foreground">Normal range: 60–100 BPM</p>
        <Spark data={trend} dataKey="heartRate" color="var(--color-danger)" refLines={[{ y: 60 }, { y: 100 }]} />
      </Card>

      {/* Pulse Sensor */}
      <Card delay={0.05} accentColor="var(--color-primary)">
        <CardHead icon={Activity} iconClass="text-primary" iconBg="bg-primary/10" title="Pulse Sensor" />
        <div className="mt-3 flex items-end justify-between">
          <div className="flex items-end gap-2">
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
          <TrendArrow dir={pulseTrendDir} />
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
        <p className="mt-0.5 text-[11px] text-muted-foreground">Infrared PPG sensor · MAX30102</p>
        <Spark data={trend} dataKey="pulseValue" color="var(--color-primary)" type="line" />
      </Card>

      {/* Movement / IMU */}
      <Card delay={0.1} accentColor="var(--color-chart-5)">
        <CardHead icon={Footprints} iconClass="text-chart-5" iconBg="bg-[oklch(0.63_0.17_300/0.1)]" title="Movement" />
        <div className="mt-3 flex items-end justify-between">
          <motion.span
            key={data.movement}
            initial={{ opacity: 0.4, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl font-bold"
          >
            {data.movement}
          </motion.span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            data.movement === "Active" ? "bg-success/10 text-success" :
            data.movement === "Resting" ? "bg-warning-soft text-warning-foreground" :
            "bg-muted text-muted-foreground"
          }`}>
            {data.movement === "Active" ? "● Active" : data.movement === "Resting" ? "◐ Resting" : "○ Idle"}
          </span>
        </div>
        <StatusPill tone="text-muted-foreground" label={`MPU6050 · Accel: ${data.acceleration.toFixed(2)} g`} />
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Tilt X: {data.angleX.toFixed(1)}° · Tilt Y: {data.angleY.toFixed(1)}°
        </p>
        <Spark data={trend} dataKey="activity" color="var(--color-chart-5)" />
      </Card>

      {/* Fall Detection */}
      <FallCard fall={data.fallDetected} angleX={data.angleX} angleY={data.angleY} />
    </section>
  );
}

function TrendArrow({ dir }: { dir: "up" | "down" | "stable" }) {
  if (dir === "up") return <TrendingUp className="h-4 w-4 text-danger" />;
  if (dir === "down") return <TrendingDown className="h-4 w-4 text-success" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

function FallCard({ fall, angleX, angleY }: { fall: boolean; angleX: number; angleY: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${
        fall
          ? "border-danger bg-danger text-danger-foreground animate-pulse-ring shadow-glow-danger"
          : "glass-card"
      }`}
    >
      {fall && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,oklch(0.75_0.2_27/0.3),transparent_70%)]" />
      )}
      <div className="relative flex items-center justify-between">
        <span className={`text-sm font-semibold ${fall ? "text-danger-foreground" : "text-muted-foreground"}`}>
          Fall Detection
        </span>
        <AlertTriangle className={`h-5 w-5 ${fall ? "text-danger-foreground animate-heartbeat" : "text-success"}`} />
      </div>

      {fall ? (
        <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="relative mt-4">
          <p className="font-display text-2xl font-extrabold">FALL DETECTED</p>
          <p className="mt-0.5 text-sm font-medium text-danger-foreground/90">Immediate help needed</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-white/20 p-2 text-center">
              <p className="text-danger-foreground/70">Tilt X</p>
              <p className="font-bold">{angleX.toFixed(1)}°</p>
            </div>
            <div className="rounded-lg bg-white/20 p-2 text-center">
              <p className="text-danger-foreground/70">Tilt Y</p>
              <p className="font-bold">{angleY.toFixed(1)}°</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="mt-4">
          <p className="font-display text-2xl font-bold text-success">Safe ✓</p>
          <p className="mt-0.5 text-sm text-muted-foreground">No fall detected</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="rounded-lg bg-muted/60 p-2 text-center">
              <p>Tilt X</p>
              <p className="font-semibold text-foreground">{angleX.toFixed(1)}°</p>
            </div>
            <div className="rounded-lg bg-muted/60 p-2 text-center">
              <p>Tilt Y</p>
              <p className="font-semibold text-foreground">{angleY.toFixed(1)}°</p>
            </div>
          </div>
        </div>
      )}

      <div className={`mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium ${
        fall ? "bg-white/20" : "bg-success-soft text-success"
      }`}>
        <span className={`h-2 w-2 rounded-full ${fall ? "bg-white animate-ping" : "bg-success"}`} />
        {fall ? "Emergency protocol active" : "Monitoring stable"}
      </div>
    </motion.div>
  );
}

function Card({
  children,
  delay,
  accentColor,
}: {
  children: React.ReactNode;
  delay: number;
  accentColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="metric-card"
      style={{ "--accent-color": accentColor } as React.CSSProperties}
    >
      {children}
    </motion.div>
  );
}

function CardHead({
  icon: Icon,
  iconClass,
  iconBg,
  title,
  animateIcon,
}: {
  icon: typeof Heart;
  iconClass: string;
  iconBg: string;
  title: string;
  animateIcon?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold text-muted-foreground">{title}</span>
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}>
        <Icon className={`h-4.5 w-4.5 ${iconClass} ${animateIcon ? "animate-heartbeat" : ""}`} />
      </div>
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
  refLines,
}: {
  data: TrendPoint[];
  dataKey: keyof TrendPoint;
  color: string;
  type?: "area" | "line";
  refLines?: { y: number }[];
}) {
  return (
    <div className="mt-3 h-14">
      <ResponsiveContainer width="100%" height="100%">
        {type === "area" ? (
          <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`g-${String(dataKey)}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            {refLines?.map((r) => (
              <ReferenceLine key={r.y} y={r.y} stroke={color} strokeDasharray="3 3" strokeOpacity={0.4} />
            ))}
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
