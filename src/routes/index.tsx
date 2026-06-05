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

        <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-4 sm:p-6">
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

              <footer className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
                ElderGuard · Real-Time Elderly Health &amp; Fall Monitoring · Powered by ESP32-S3 + Firebase
              </footer>
            </>
          )}
        </main>
      </div>

      <Toaster richColors position="top-right" />
    </div>
  );
}
