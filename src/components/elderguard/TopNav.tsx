import { Bell, Menu, Moon, Sun, Wifi } from "lucide-react";
import { motion } from "framer-motion";
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
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <button onClick={onMenu} className="lg:hidden text-muted-foreground" aria-label="Open menu">
        <Menu className="h-6 w-6" />
      </button>

      <div className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 sm:flex">
        <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
        <span className="text-sm font-medium">
          System Status: <span className={style.text}>{style.label}</span>
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
          <Wifi className="h-4 w-4 text-success" />
          <span>
            Updated <span className="font-medium text-foreground">{updated}</span>
          </span>
        </div>

        <button
          onClick={onToggleDark}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          {notifications > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-danger-foreground"
            >
              {notifications}
            </motion.span>
          )}
        </button>

        <div className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            DR
          </div>
          <span className="hidden text-sm font-medium sm:inline">Dr. Rao</span>
        </div>
      </div>
    </header>
  );
}
