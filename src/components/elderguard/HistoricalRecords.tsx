import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, AlertTriangle, TrendingUp, Activity, Calendar } from "lucide-react";
import { toast } from "sonner";
import type { HistoryRecord, HealthStatus } from "@/lib/elderguard/types";
import { statusOf } from "@/lib/elderguard/status";
import { PATIENT } from "@/lib/elderguard/types";

const FILTERS: ("ALL" | HealthStatus)[] = ["ALL", "NORMAL", "WARNING", "CRITICAL"];

export function HistoricalRecords({ history }: { history: HistoryRecord[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");

  const rows = useMemo(() => {
    return history.filter((r) => {
      const matchFilter = filter === "ALL" || r.status === filter;
      const matchQuery =
        query.trim() === "" ||
        r.date.toLowerCase().includes(query.toLowerCase()) ||
        r.status.toLowerCase().includes(query.toLowerCase()) ||
        String(r.heartRate).includes(query);
      return matchFilter && matchQuery;
    });
  }, [history, filter, query]);

  // Summary stats
  const totalRecords = history.length;
  const criticalCount = history.filter((r) => r.status === "CRITICAL").length;
  const warningCount = history.filter((r) => r.status === "WARNING").length;
  const avgHR = history.length
    ? Math.round(history.reduce((s, r) => s + r.heartRate, 0) / history.length)
    : 0;
  const fallCount = history.filter((r) => r.fallDetected).length;

  function exportReport() {
    const header = "Date,Heart Rate (BPM),Pulse Value,Status,Fall Detected\n";
    const body = rows
      .map((r) => `${r.date},${r.heartRate},${r.pulseValue},${r.status},${r.fallDetected ? "Yes" : "No"}`)
      .join("\n");
    const blob = new Blob([`ElderGuard Health Report — ${PATIENT.name}\n\n${header}${body}`], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "elderguard-health-report.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Health report exported", { description: `${rows.length} records downloaded as CSV.` });
  }

  return (
    <section id="history" className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="section-heading">Historical Records</h2>
        <button
          onClick={exportReport}
          className="inline-flex items-center gap-2 self-start rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:scale-[1.02] hover:shadow-md active:scale-95"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard icon={Calendar} label="Total Records" value={String(totalRecords)} color="text-primary" bg="bg-primary/10" />
        <SummaryCard icon={Activity} label="Avg Heart Rate" value={`${avgHR} BPM`} color="text-danger" bg="bg-danger/10" />
        <SummaryCard icon={AlertTriangle} label="Critical Events" value={String(criticalCount)} color="text-danger" bg="bg-danger/10" />
        <SummaryCard icon={TrendingUp} label="Falls Logged" value={String(fallCount)} color="text-warning-foreground" bg="bg-warning-soft" />
      </div>

      {/* Table card */}
      <div className="glass-card overflow-hidden rounded-2xl">
        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by date, status, or heart rate…"
              className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>
          <div className="flex gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  filter === f
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {f === "ALL" ? "All" : statusOf(f).label}
              </button>
            ))}
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {rows.length} record{rows.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-semibold">
                  <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Date</div>
                </th>
                <th className="px-5 py-3 font-semibold">
                  <div className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-danger" /> Heart Rate</div>
                </th>
                <th className="px-5 py-3 font-semibold">Pulse Value</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Fall</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const s = statusOf(r.status);
                return (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className={`border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30 ${
                      i % 2 === 0 ? "" : "bg-muted/10"
                    }`}
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap font-medium">{r.date}</td>
                    <td className="px-5 py-3.5">
                      <span className={`tabular-nums font-semibold ${
                        r.heartRate > 100 ? "text-danger" : r.heartRate < 60 ? "text-warning-foreground" : "text-foreground"
                      }`}>
                        {r.heartRate} BPM
                      </span>
                    </td>
                    <td className="px-5 py-3.5 tabular-nums text-muted-foreground">{r.pulseValue}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.softBg} ${s.text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {r.fallDetected ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-2.5 py-1 text-xs font-semibold text-danger">
                          <AlertTriangle className="h-3 w-3" /> Yes
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Search className="h-8 w-8 opacity-40" />
                      <p className="text-sm">No records match your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/20 px-5 py-3 text-xs text-muted-foreground">
          Patient: <span className="font-semibold text-foreground">{PATIENT.name}</span> · Records from the last 14 sessions · Powered by ESP32-S3 + Firebase
        </div>
      </div>
    </section>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="glass-card rounded-xl p-4">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg} mb-2`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`font-display text-xl font-bold mt-0.5 ${color}`}>{value}</p>
    </div>
  );
}
