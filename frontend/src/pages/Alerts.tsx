import React from "react";
import {
  Bell,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  Trash2,
  CheckCheck,
} from "lucide-react";
import { AlertNotification } from "../types";

interface AlertsProps {
  alerts: AlertNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAlerts: () => void;
}

export const Alerts: React.FC<AlertsProps> = ({ alerts, onMarkAsRead, onClearAlerts }) => {
  const getSeverityBadge = (severity: AlertNotification["severity"]) => {
    switch (severity) {
      case "high":
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">High Severity</span>;
      case "medium":
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">Notice</span>;
      case "success":
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">Milestone</span>;
      default:
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">Info</span>;
    }
  };

  const getAlertIcon = (severity: AlertNotification["severity"]) => {
    switch (severity) {
      case "high":
        return <div className="p-2.5 rounded-xl bg-red-50 text-red-600"><AlertTriangle className="w-5 h-5" /></div>;
      case "medium":
        return <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600"><Clock className="w-5 h-5" /></div>;
      case "success":
        return <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 className="w-5 h-5" /></div>;
      default:
        return <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700"><Bell className="w-5 h-5" /></div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
              <Bell className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Alerts & System Notifications
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Automated alerts for consumption threshold violations, appliance anomalies, and target milestones.
          </p>
        </div>

        <button
          onClick={onClearAlerts}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">All Clear!</p>
            <p className="text-xs text-slate-500">No active energy threshold alerts detected.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start justify-between gap-4 ${
                alert.read
                  ? "bg-white border-slate-200 opacity-70"
                  : "bg-white border-slate-300 shadow-xs ring-1 ring-emerald-500/10"
              }`}
            >
              <div className="flex items-start gap-3.5">
                {getAlertIcon(alert.severity)}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-slate-900">{alert.title}</h4>
                    {getSeverityBadge(alert.severity)}
                    {!alert.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {alert.message}
                  </p>
                  <span className="text-[11px] text-slate-400 font-medium block mt-2">
                    {alert.timestamp}
                  </span>
                </div>
              </div>

              {!alert.read && (
                <button
                  onClick={() => onMarkAsRead(alert.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold self-end sm:self-center transition-colors"
                >
                  Dismiss
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
