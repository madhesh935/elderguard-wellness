import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import type { TrendPoint } from "@/lib/elderguard/types";

const tooltipStyle = {
  backgroundColor: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: "0.625rem",
  fontSize: "12px",
  color: "var(--color-popover-foreground)",
  boxShadow: "0 4px 16px oklch(0 0 0 / 0.1)",
};

export function AnalyticsCharts({ trend }: { trend: TrendPoint[] }) {
  const avgHR = trend.length
    ? Math.round(trend.reduce((s, t) => s + t.heartRate, 0) / trend.length)
    : 0;
  const avgPulse = trend.length
    ? Math.round(trend.reduce((s, t) => s + t.pulseValue, 0) / trend.length)
    : 0;

  return (
    <section id="analytics" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="section-heading">Live Health Analytics</h2>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Last {trend.length} samples
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Heart Rate */}
        <ChartCard
          title="Heart Rate Trend"
          subtitle={`Real-time BPM · Avg: ${avgHR} BPM`}
          delay={0}
          badge={{ label: `${avgHR} avg`, color: "bg-danger/10 text-danger" }}
        >
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                interval="preserveEnd"
                minTickGap={40}
              />
              <YAxis domain={[40, 150]} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v} BPM`, "Heart Rate"]} />
              {/* Normal range reference lines */}
              <ReferenceLine y={60} stroke="var(--color-warning)" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: "60", position: "right", fontSize: 9, fill: "var(--color-warning-foreground)" }} />
              <ReferenceLine y={100} stroke="var(--color-danger)" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: "100", position: "right", fontSize: 9, fill: "var(--color-danger)" }} />
              <ReferenceLine y={avgHR} stroke="var(--color-primary)" strokeDasharray="6 3" strokeOpacity={0.5} />
              <Line
                type="monotone"
                dataKey="heartRate"
                stroke="var(--color-danger)"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pulse Sensor */}
        <ChartCard
          title="Pulse Sensor (PPG)"
          subtitle={`Raw IR signal · Avg: ${avgPulse}`}
          delay={0.05}
          badge={{ label: "MAX30102", color: "bg-primary/10 text-primary" }}
        >
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                interval="preserveEnd"
                minTickGap={40}
              />
              <YAxis domain={[1300, 1900]} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v, "Pulse (raw)"]} />
              <ReferenceLine y={avgPulse} stroke="var(--color-primary)" strokeDasharray="6 3" strokeOpacity={0.5} />
              <Line
                type="monotone"
                dataKey="pulseValue"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Activity — full width */}
        <ChartCard
          title="Activity Monitor"
          subtitle="Movement intensity · MPU6050 accelerometer"
          delay={0.1}
          className="lg:col-span-2"
          badge={{ label: "Rest / Active", color: "bg-success/10 text-success" }}
        >
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                interval="preserveEnd"
                minTickGap={40}
              />
              <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v, "Activity Level"]} />
              <ReferenceLine y={40} stroke="var(--color-muted-foreground)" strokeDasharray="4 4" strokeOpacity={0.4} label={{ value: "Normal", position: "right", fontSize: 9, fill: "var(--color-muted-foreground)" }} />
              <Area
                type="monotone"
                dataKey="activity"
                stroke="var(--color-success)"
                strokeWidth={2.5}
                fill="url(#activityFill)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
  delay,
  className = "",
  badge,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  delay: number;
  className?: string;
  badge?: { label: string; color: string };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`glass-card rounded-2xl p-5 ${className}`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        {badge && (
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${badge.color}`}>
            {badge.label}
          </span>
        )}
      </div>
      {children}
    </motion.div>
  );
}
