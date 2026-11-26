import React from "react";
import {
  LayoutDashboard,
  Tv,
  BarChart3,
  Bot,
  Leaf,
  ReceiptText,
  Target,
  Bell,
  FileSpreadsheet,
  Zap,
  ChevronRight,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { PageId } from "../types";

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  isOpenMobile: boolean;
  onToggleMobile: () => void;
  unreadAlertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  isOpenMobile,
  onToggleMobile,
  unreadAlertCount,
}) => {
  const navItems = [
    { id: "dashboard" as PageId, label: "Dashboard", icon: LayoutDashboard },
    { id: "appliances" as PageId, label: "My Appliances", icon: Tv },
    { id: "analytics" as PageId, label: "Energy Analytics", icon: BarChart3 },
    { id: "ai-assistant" as PageId, label: "AI Energy Assistant", icon: Bot, badge: "Gemini" },
    { id: "carbon-tracker" as PageId, label: "Carbon Tracker", icon: Leaf },
    { id: "bill-estimator" as PageId, label: "Bill Estimator", icon: ReceiptText },
    { id: "goals" as PageId, label: "Saving Goals", icon: Target },
    {
      id: "alerts" as PageId,
      label: "Alerts & Notices",
      icon: Bell,
      count: unreadAlertCount,
    },
    { id: "reports" as PageId, label: "Monthly Reports", icon: FileSpreadsheet },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onToggleMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 relative">
                <Zap className="w-5 h-5 fill-white text-white" />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1">
                  Watt<span className="text-emerald-600">Wise</span>
                </h1>
                <p className="text-[11px] font-medium text-slate-500">
                  Smarter Energy. Greener Living.
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onToggleMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Menu Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectPage(item.id);
                    if (isOpenMobile) onToggleMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? "text-emerald-600"
                          : "text-slate-400 group-hover:text-slate-700"
                      }`}
                    />
                    <span className="tracking-tight">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800">
                        {item.badge}
                      </span>
                    )}

                    {item.count && item.count > 0 ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white min-w-5 text-center">
                        {item.count}
                      </span>
                    ) : null}

                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Return to Public Landing Page */}
        <div className="px-4 pb-1">
          <button
            onClick={() => {
              onSelectPage("landing");
              if (isOpenMobile) onToggleMobile();
            }}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>← View Landing Page</span>
          </button>
        </div>

        {/* Footer Profile Box */}
        <div className="p-4 border-t border-slate-100 m-3 rounded-2xl bg-slate-50/80 border border-slate-200/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-800">Household Active</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              CESC Kolkata
            </span>
          </div>

          <p className="text-[11px] text-slate-500 mb-2">
            Connected to 8 appliances • Tariff Slab Active
          </p>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
            <span>Grid Factor:</span>
            <span className="font-semibold text-slate-700">0.82 kg CO₂/kWh</span>
          </div>
        </div>
      </aside>
    </>
  );
};
