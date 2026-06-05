import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Download } from "lucide-react";
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
    toast.success("Health report exported");
  }

  return (
    <section id="history" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-lg font-bold">Historical Records</h2>
        <button
          onClick={exportReport}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
        >
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search records…"
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {f === "ALL" ? "All" : statusOf(f).label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Heart Rate</th>
                <th className="px-4 py-3 font-medium">Pulse Value</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Fall</th>
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
                    className="border-b border-border/60 last:border-0 hover:bg-muted/40"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">{r.date}</td>
                    <td className="px-4 py-3 tabular-nums">{r.heartRate} BPM</td>
                    <td className="px-4 py-3 tabular-nums">{r.pulseValue}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.softBg} ${s.text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {r.fallDetected ? (
                        <span className="font-medium text-danger">Yes</span>
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No records match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
