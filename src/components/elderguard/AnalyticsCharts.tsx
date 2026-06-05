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
} from "recharts";
import type { TrendPoint } from "@/lib/elderguard/types";

const tooltipStyle = {
  backgroundColor: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: "0.625rem",
  fontSize: "12px",
  color: "var(--color-popover-foreground)",
};

export function AnalyticsCharts({ trend }: { trend: TrendPoint[] }) {
  return (
    <section id="analytics" className="space-y-4">
      <h2 className="font-display text-lg font-bold">Live Health Analytics</h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Heart Rate Trend" subtitle="Last samples · BPM" delay={0}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} interval="preserveEnd" minTickGap={40} />
              <YAxis domain={[40, 150]} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="heartRate" stroke="var(--color-danger)" strokeWidth={2.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Pulse Sensor Trend" subtitle="Raw signal · real-time" delay={0.05}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} interval="preserveEnd" minTickGap={40} />
              <YAxis domain={[1300, 1900]} tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="pulseValue" stroke="var(--color-primary)" strokeWidth={2.5} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Activity Monitoring" subtitle="Movement levels · rest vs active" delay={0.1} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trend} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} interval="preserveEnd" minTickGap={40} />
              <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="activity" stroke="var(--color-success)" strokeWidth={2.5} fill="url(#activityFill)" isAnimationActive={false} />
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
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={`glass-card rounded-2xl p-5 ${className}`}
    >
      <div className="mb-2">
        <h3 className="font-display text-base font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </motion.div>
  );
}
