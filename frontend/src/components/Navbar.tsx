import React from "react";
import { Menu, Calendar, Bell, ShieldCheck, IndianRupee, Sparkles } from "lucide-react";
import { PageId } from "../types";

interface NavbarProps {
  currentPage: PageId;
  onToggleMobile: () => void;
  unreadAlertCount: number;
  onOpenAlerts: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onToggleMobile,
  unreadAlertCount,
  onOpenAlerts,
}) => {
  const pageTitles: Record<PageId, { title: string; subtitle: string }> = {
    landing: {
      title: "Watt Wise",
      subtitle: "Smarter Energy. Greener Living.",
    },
    dashboard: {
      title: "Household Energy Dashboard",
      subtitle: "Real-time electricity consumption, cost, and carbon analytics.",
    },
    appliances: {
      title: "My Appliances",
      subtitle: "Add, edit, and track power consumption across household devices.",
    },
    analytics: {
      title: "Energy Consumption Analytics",
      subtitle: "Hourly telemetry, daily trends, and historical usage comparisons.",
    },
    "ai-assistant": {
      title: "AI Energy Assistant",
      subtitle: "Gemini-powered insights grounded in your actual household telemetry.",
    },
    "carbon-tracker": {
      title: "Carbon Footprint Tracker",
      subtitle: "Scope 2 GHG accounting using Central Electricity Authority (CEA) factors.",
    },
    "bill-estimator": {
      title: "Electricity Bill Estimator",
      subtitle: "Slab-based utility tariff breakdown in Indian Rupees (₹).",
    },
    goals: {
      title: "Energy Saving Goals",
      subtitle: "Set monthly kWh & ₹ targets and monitor efficiency milestones.",
    },
    alerts: {
      title: "Alerts & Notifications",
      subtitle: "Real-time consumption threshold warnings and appliance anomalies.",
    },
    reports: {
      title: "Monthly Reports",
      subtitle: "Download official household energy and carbon audit reports.",
    },
  };

  const current = pageTitles[currentPage] || {
    title: "Watt Wise",
    subtitle: "Smarter Energy. Greener Living.",
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-8 py-4 flex items-center justify-between transition-all">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden border border-slate-200"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            {current.title}
          </h2>
          <p className="text-xs text-slate-500 font-medium hidden sm:block">
            {current.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions & Badges */}
      <div className="flex items-center gap-3">
        {/* Date Cycle Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span>Billing Cycle: <strong>Nov 2026</strong></span>
        </div>

        {/* Currency Tag */}
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
          <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
          <span>INR (₹)</span>
        </div>

        {/* Alerts Button */}
        <button
          onClick={onOpenAlerts}
          className="relative p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-2xs"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {unreadAlertCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
