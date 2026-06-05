import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Heart,
  Shield,
  User,
  AlertTriangle,
  ClipboardList,
  Cpu,
  X,
  BarChart2,
} from "lucide-react";

const NAV = [
  { id: "overview",   label: "Overview",   icon: Activity,       href: "overview" },
  { id: "vitals",     label: "Live Vitals", icon: Heart,         href: "vitals" },
  { id: "analytics",  label: "Analytics",  icon: BarChart2,      href: "analytics" },
  { id: "alerts",     label: "Emergency",  icon: AlertTriangle,  href: "alerts" },
  { id: "patient",    label: "Patient",    icon: User,           href: "patient" },
  { id: "devices",    label: "Devices",    icon: Cpu,            href: "devices" },
  { id: "history",    label: "History",    icon: ClipboardList,  href: "history" },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [active, setActive] = useState<string>("overview");
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Track which section is visible using IntersectionObserver
  useEffect(() => {
    const targets = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the largest intersection ratio that is intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    targets.forEach((t) => observerRef.current!.observe(t));
    return () => observerRef.current?.disconnect();
  }, []);

  function handleNav(id: string) {
    onClose();
    // Small delay so sidebar close animation doesn't fight with scroll
    setTimeout(() => scrollToSection(id), 150);
  }

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
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-sidebar-border bg-sidebar transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[oklch(0.45_0.18_270)] text-primary-foreground shadow-sm">
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
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-0.5 p-3" aria-label="Dashboard sections">
          {NAV.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                aria-current={isActive ? "location" : undefined}
                className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute inset-y-1 left-0 w-0.5 rounded-r-full bg-primary" />
                )}
                <item.icon
                  className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-primary"
                  }`}
                />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Status Badge */}
        <div className="absolute inset-x-3 bottom-4 overflow-hidden rounded-xl bg-gradient-to-br from-success-soft to-success/5 p-4 ring-1 ring-success/20">
          <div className="flex items-center gap-2 text-sm font-semibold text-success">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
            </span>
            Monitoring Active
          </div>
          <p className="mt-1 text-xs text-muted-foreground">All sensors reporting normally.</p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="rounded bg-success/15 px-1.5 py-0.5 font-medium text-success">
              ESP32-S3
            </span>
            <span>·</span>
            <span>2s refresh</span>
          </div>
        </div>
      </aside>
    </>
  );
}
