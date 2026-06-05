import { Bell, Menu, Moon, Sun, Wifi, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ElderlyMonitorData } from "@/lib/elderguard/types";
import { statusOf } from "@/lib/elderguard/status";

interface Props {
  data: ElderlyMonitorData | null;
  notifications: number;
  dark: boolean;
  onToggleDark: () => void;
  onMenu: () => void;
}

export function TopNav({ data, notifications, dark, onToggleDark, onMenu }: Props) {
  const style = data ? statusOf(data.status) : statusOf("NORMAL");
  const updated = data
    ? new Date(data.updatedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "—";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6 shadow-sm">
      {/* Mobile hamburger */}
      <button
        onClick={onMenu}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Brand (mobile only) */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[oklch(0.45_0.18_270)] text-primary-foreground">
          <Shield className="h-4 w-4" />
        </div>
        <span className="font-display text-sm font-bold">ElderGuard</span>
      </div>

      {/* Status pill */}
      <div className="hidden items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 shadow-sm sm:flex">
        <span className={`relative flex h-2.5 w-2.5`}>
          {data?.status === "NORMAL" && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50" />
          )}
          <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${style.dot}`} />
        </span>
        <span className="text-sm font-medium">
          Status:{" "}
          <span className={`font-semibold ${style.text}`}>{style.label}</span>
        </span>
      </div>

      {/* Spacer */}
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {/* Last updated */}
        <div className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
          <Wifi className="h-4 w-4 text-success" />
          <span>
            Updated{" "}
            <span className="font-semibold text-foreground tabular-nums">{updated}</span>
          </span>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
          aria-label="Toggle dark mode"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={dark ? "sun" : "moon"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {dark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </motion.span>
          </AnimatePresence>
        </button>

        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label={`Notifications ${notifications > 0 ? `(${notifications} new)` : ""}`}
        >
          <Bell className="h-4.5 w-4.5" />
          <AnimatePresence>
            {notifications > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-danger-foreground shadow-sm"
              >
                {notifications}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* Doctor avatar */}
        <div className="flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-3 shadow-sm">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.45_0.18_270)] text-[11px] font-bold text-primary-foreground">
            PR
          </div>
          <span className="hidden text-sm font-medium sm:inline">Dr. Rao</span>
        </div>
      </div>
    </header>
  );
}
