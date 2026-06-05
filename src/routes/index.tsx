import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useElderlyMonitor } from "@/lib/elderguard/use-elderly-monitor";
import { useDarkMode } from "@/lib/elderguard/use-dark-mode";
import { Sidebar } from "@/components/elderguard/Sidebar";
import { TopNav } from "@/components/elderguard/TopNav";
import { HeroSection } from "@/components/elderguard/HeroSection";
import { MetricCards } from "@/components/elderguard/MetricCards";
import { AnalyticsCharts } from "@/components/elderguard/AnalyticsCharts";
import { ElderStatusPanel } from "@/components/elderguard/ElderStatusPanel";
import { EmergencyAlertCenter } from "@/components/elderguard/EmergencyAlertCenter";
import { PatientProfile } from "@/components/elderguard/PatientProfile";
import { DeviceMonitoring } from "@/components/elderguard/DeviceMonitoring";
import { HistoricalRecords } from "@/components/elderguard/HistoricalRecords";
import { DashboardSkeleton } from "@/components/elderguard/DashboardSkeleton";
import { Shield, Heart, Cpu } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ElderGuard — Elderly Health & Fall Monitoring Dashboard" },
      {
        name: "description",
        content:
          "ElderGuard is a real-time IoT dashboard for elderly health and fall monitoring — heart rate, pulse, movement, and instant fall alerts.",
      },
      { property: "og:title", content: "ElderGuard — Elderly Health & Fall Monitoring" },
      {
        property: "og:description",
        content: "Real-time elderly health and fall monitoring with live vitals, analytics, and emergency alerts.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data, trend, history, devices, loading, fallEvent } = useElderlyMonitor();
  const { dark, toggle } = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const notifications = (data?.fallDetected ? 1 : 0) + (fallEvent ? 1 : 0);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav
          data={data}
          notifications={notifications}
          dark={dark}
          onToggleDark={toggle}
          onMenu={() => setSidebarOpen(true)}
        />

        <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
          {loading || !data ? (
            <DashboardSkeleton />
          ) : (
            <>
              <HeroSection data={data} />
              <MetricCards data={data} trend={trend} />

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <AnalyticsCharts trend={trend} />
                </div>
                <div className="space-y-6">
                  <ElderStatusPanel data={data} />
                  <PatientProfile />
                </div>
              </div>

              <EmergencyAlertCenter data={data} fallEvent={fallEvent} />
              <DeviceMonitoring devices={devices} />
              <HistoricalRecords history={history} />

              {/* Footer */}
              <footer className="border-t border-border pt-6 pb-2">
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                      <Shield className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">ElderGuard</span>
                    <span>·</span>
                    <span>Real-Time Elderly Health & Fall Monitoring</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5" /> ESP32-S3
                    </span>
                    <span>+</span>
                    <span className="flex items-center gap-1.5">
                      <Heart className="h-3.5 w-3.5 text-danger" /> Firebase
                    </span>
                    <span>·</span>
                    <span>IEEE Project 2025</span>
                  </div>
                </div>
              </footer>
            </>
          )}
        </main>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
}
