import type { HealthStatus } from "./types";

export interface StatusStyle {
  label: string;
  text: string;
  bg: string;
  softBg: string;
  ring: string;
  dot: string;
}

export const STATUS_STYLES: Record<HealthStatus, StatusStyle> = {
  NORMAL: {
    label: "Normal",
    text: "text-success",
    bg: "bg-success",
    softBg: "bg-success-soft",
    ring: "ring-success/30",
    dot: "bg-success",
  },
  WARNING: {
    label: "Warning",
    text: "text-warning-foreground",
    bg: "bg-warning",
    softBg: "bg-warning-soft",
    ring: "ring-warning/40",
    dot: "bg-warning",
  },
  CRITICAL: {
    label: "Critical",
    text: "text-danger",
    bg: "bg-danger",
    softBg: "bg-danger-soft",
    ring: "ring-danger/40",
    dot: "bg-danger",
  },
};

export function statusOf(s: HealthStatus): StatusStyle {
  return STATUS_STYLES[s];
}
