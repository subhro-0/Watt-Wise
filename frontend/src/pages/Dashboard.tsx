import React, { useState } from "react";
import {
  Zap,
  IndianRupee,
  Leaf,
  TrendingDown,
  ArrowUpRight,
  Sparkles,
  AlertTriangle,
  Clock,
  Target,
  ChevronRight,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Appliance,
  DailyTelemetry,
  Goal,
  MonthlyTelemetry,
} from "../types";

interface DashboardProps {
  appliances: Appliance[];
  dailyReadings: DailyTelemetry[];
  monthlyReadings: MonthlyTelemetry[];
  goals: Goal[];
  onNavigate: (page: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  appliances,
  dailyReadings,
  monthlyReadings,
  goals,
  onNavigate,
}) => {
  const [dateFilter, setDateFilter] = useState("this-month");

  // Aggregations from appliances and readings
  const totalKwh = Math.round(appliances.reduce((acc, a) => acc + a.monthlyKwh, 0));
  const estimatedBill = Math.round(appliances.reduce((acc, a) => acc + a.monthlyCostInr, 0));
  const totalCo2 = Math.round(appliances.reduce((acc, a) => acc + a.monthlyCo2Kg, 0));
  const energySavedPct = 12.4; // 12.4% reduction vs past cycle

  // Highest energy consuming appliances
  const sortedAppliances = [...appliances].sort((a, b) => b.monthlyKwh - a.monthlyKwh);
  const topAppliance = sortedAppliances[0];

  const primaryGoal = goals[0];
  const goalProgressPct = primaryGoal
    ? Math.min(100, Math.round((primaryGoal.currentKwh / primaryGoal.targetKwh) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {/* Date Filter & Quick Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          <span>Smart Meter Stream: <strong>Active Telemetry</strong></span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">Last updated 12 mins ago</span>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="this-month">November 2026 (Current Cycle)</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="last-7-days">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* 4 Main Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Consumption */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Electricity Used
            </span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
              <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalKwh}
            </span>
            <span className="text-sm font-semibold text-slate-500">kWh</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
              <TrendingDown className="w-3.5 h-3.5" /> 8.4% lower
            </span>
            <span className="text-slate-400">Target: 500 kWh</span>
          </div>
        </div>

        {/* Card 2: Estimated Bill */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Estimated Bill
            </span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-lg font-bold text-emerald-600">₹</span>
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {estimatedBill.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
              <TrendingDown className="w-3.5 h-3.5" /> ₹340 saved
            </span>
            <span className="text-slate-400">Slab Tariff Active</span>
          </div>
        </div>

        {/* Card 3: Carbon Emissions */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Carbon Footprint
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalCo2}
            </span>
            <span className="text-sm font-semibold text-emerald-700">kg CO₂</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500">Factor: 0.82 kg/kWh</span>
            <span className="font-semibold text-slate-700">≈ 20 trees needed</span>
          </div>
        </div>

        {/* Card 4: Energy Saved */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Energy Saved
            </span>
            <div className="p-2 rounded-xl bg-emerald-500 text-white">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">
              {energySavedPct}%
            </span>
            <span className="text-xs font-semibold text-slate-500">vs benchmark</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-500">Saved: 64 kWh</span>
            <span className="text-emerald-700 font-bold">Good Efficiency</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Consumption Line Chart (7 Columns) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Daily Electricity Consumption (Past 7 Days)
              </h3>
              <p className="text-xs text-slate-500">
                Daily units consumed in kWh across the household
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              Avg: 19.1 kWh/day
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyReadings}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}k`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as DailyTelemetry;
                      return (
                        <div className="p-3 bg-slate-900 text-white rounded-xl text-xs shadow-lg">
                          <p className="font-bold text-emerald-400 mb-1">{data.date} ({data.day})</p>
                          <p>Usage: <strong>{data.kwh} kWh</strong></p>
                          <p>Cost: <strong>₹{data.costInr}</strong></p>
                          <p>Carbon: <strong>{data.carbonKg} kg CO₂</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="kwh"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#ffffff" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appliance-wise Energy Consumption Bar Chart (5 Columns) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Appliance-wise Consumption
              </h3>
              <p className="text-xs text-slate-500">
                Monthly breakdown by individual appliance (kWh)
              </p>
            </div>
            <button
              onClick={() => onNavigate("appliances")}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
            >
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedAppliances.slice(0, 5)}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#475569"
                  fontSize={10}
                  tickLine={false}
                  width={110}
                  tickFormatter={(val) => (val.length > 14 ? `${val.slice(0, 14)}...` : val)}
                />
                <Tooltip
                  formatter={(val: any) => [`${val} kWh`, "Monthly Usage"]}
                  contentStyle={{ backgroundColor: "#0f172a", color: "#fff", borderRadius: "10px", fontSize: "11px" }}
                />
                <Bar dataKey="monthlyKwh" fill="#059669" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Insights & Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Highest Energy Consuming Appliances Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Highest Consumer
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              49% of Total Bill
            </span>
          </div>

          {topAppliance && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <h5 className="text-sm font-bold text-slate-900">{topAppliance.name}</h5>
                <p className="text-xs text-slate-500 mt-0.5">
                  Power: {topAppliance.watts}W • Daily: {topAppliance.dailyHours} hrs
                </p>
                <div className="mt-2.5 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">{topAppliance.monthlyKwh} kWh / month</span>
                  <span className="text-emerald-700 font-bold">₹{topAppliance.monthlyCostInr}/mo</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                💡 <strong>Tip:</strong> Raising AC temperature from 22°C to 24°C saves approximately 12% on AC power (~₹194/month).
              </p>
            </div>
          )}
        </div>

        {/* AI Recommendations Highlight Card */}
        <div className="p-5 rounded-2xl bg-emerald-950 text-white shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" /> AI Recommendation
            </span>
            <button
              onClick={() => onNavigate("ai-assistant")}
              className="text-xs text-emerald-300 hover:text-white flex items-center gap-0.5"
            >
              <span>Ask AI</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <h4 className="text-sm font-bold text-white mb-2">
            Schedule Water Geyser Before 7:30 AM
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Water Geyser consumes 2,000W. Limiting continuous cycle to 45 mins instead of 1.5 hrs avoids peak morning tariff slab and saves ~₹180/mo.
          </p>

          <div className="pt-3 border-t border-emerald-800/80 flex items-center justify-between text-xs">
            <span className="text-emerald-400 font-semibold">Estimated Impact:</span>
            <span className="font-bold text-white">-29 kg CO₂e / month</span>
          </div>
        </div>

        {/* Goal Progress Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Monthly Goal Progress
              </h4>
              <button
                onClick={() => onNavigate("goals")}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                View
              </button>
            </div>

            {primaryGoal && (
              <>
                <h5 className="text-sm font-bold text-slate-900 mb-1">{primaryGoal.title}</h5>
                <p className="text-xs text-slate-500 mb-3">
                  Target: {primaryGoal.targetKwh} kWh • Used: {primaryGoal.currentKwh} kWh
                </p>

                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      goalProgressPct > 100 ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(100, goalProgressPct)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span>{goalProgressPct}% of budget used</span>
                  <span className={goalProgressPct > 100 ? "text-amber-600 font-bold" : "text-emerald-600 font-bold"}>
                    {primaryGoal.targetKwh - primaryGoal.currentKwh > 0
                      ? `${primaryGoal.targetKwh - primaryGoal.currentKwh} kWh left`
                      : `+${Math.abs(primaryGoal.targetKwh - primaryGoal.currentKwh)} kWh over`}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-emerald-600" />
            <span>Target Bill: ₹{primaryGoal?.targetBillInr} (Projected: ₹{estimatedBill})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
