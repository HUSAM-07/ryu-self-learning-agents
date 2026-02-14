import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata = {
  title: "Dashboard — Ryujin",
  description: "Live BTCUSDT trading dashboard with AI signal analysis",
};

export default function DashboardPage() {
  return <DashboardShell />;
}
