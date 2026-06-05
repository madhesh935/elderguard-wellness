import { Activity, Heart, Shield, User, AlertTriangle, ClipboardList, Cpu, X } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";

const NAV = [
  { id: "overview", label: "Overview", icon: Activity, href: "#overview" },
  { id: "vitals", label: "Live Vitals", icon: Heart, href: "#vitals" },
  { id: "analytics", label: "Analytics", icon: Activity, href: "#analytics" },
  { id: "alerts", label: "Emergency", icon: AlertTriangle, href: "#alerts" },
  { id: "patient", label: "Patient", icon: User, href: "#patient" },
  { id: "devices", label: "Devices", icon: Cpu, href: "#devices" },
  { id: "history", label: "History", icon: ClipboardList, href: "#history" },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-foreground/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-display text-base font-bold leading-none text-sidebar-foreground">
              ElderGuard
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              Health Monitor
            </p>
          </div>
          <button onClick={onClose} className="lg:hidden text-muted-foreground" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 p-3">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={onClose}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <item.icon className="h-4.5 w-4.5 text-muted-foreground transition-colors group-hover:text-primary" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="absolute inset-x-3 bottom-4 rounded-xl bg-success-soft p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-success">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
            </span>
            Monitoring Active
          </div>
          <p className="mt-1 text-xs text-muted-foreground">All sensors reporting normally.</p>
        </div>
      </aside>
    </>
  );
}
