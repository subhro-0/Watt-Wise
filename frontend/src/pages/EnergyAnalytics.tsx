import React, { useState } from "react";
import {
  BarChart3,
  Calendar,
  Layers,
  Clock,
  TrendingUp,
  Download,
  Filter,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Appliance, DailyTelemetry, HourlyTelemetry, MonthlyTelemetry } from "../types";

interface EnergyAnalyticsProps {
  appliances: Appliance[];
  hourlyReadings: HourlyTelemetry[];
  dailyReadings: DailyTelemetry[];
  monthlyReadings: MonthlyTelemetry[];
}

export const EnergyAnalytics: React.FC<EnergyAnalyticsProps> = ({
  appliances,
  hourlyReadings,
  dailyReadings,
  monthlyReadings,
}) => {
  const [activeTab, setActiveTab] = useState<"hourly" | "daily" | "monthly">("daily");
  const [dataSource, setDataSource] = useState("smart-meter");

  const COLORS = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#0284c7", "#6366f1", "#f59e0b", "#ec4899"];

  const pieData = appliances.map((a) => {
    let label = a.name;
    if (a.name.includes("AC") || a.name.includes("Air")) label = "1.5T Split AC";
    else if (a.name.includes("Refrigerator") || a.name.includes("Fridge")) label = "Refrigerator";
    else if (a.name.includes("Fan")) label = "BLDC Fans";
    else if (a.name.includes("Geyser") || a.name.includes("Heater")) label = "Water Geyser";
    else if (a.name.includes("Light") || a.name.includes("LED")) label = "LED Lights";
    else if (a.name.includes("Washing")) label = "Washing Machine";
    else if (a.name.includes("Microwave")) label = "Microwave";
    else if (a.name.includes("TV")) label = "Smart TV";
    else if (label.length > 16) label = label.slice(0, 15) + "…";
    return {
      name: label,
      value: a.monthlyKwh,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Time Horizon Tabs */}
        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit">
          <button
            onClick={() => setActiveTab("hourly")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "hourly"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Hourly (24-Hour)
          </button>
          <button
            onClick={() => setActiveTab("daily")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "daily"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Daily (Past 7 Days)
          </button>
          <button
            onClick={() => setActiveTab("monthly")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "monthly"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Monthly History (6 Mos)
          </button>
        </div>

        {/* Data Source Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={dataSource}
            onChange={(e) => setDataSource(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="smart-meter">Source: Household Smart Meter</option>
            <option value="appliance-aggregate">Source: Sub-Metered Appliances</option>
            <option value="utility-invoices">Source: Utility Billing Sync</option>
          </select>
        </div>
      </div>

      {/* Main Dynamic Chart */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              {activeTab === "hourly" && "24-Hour Continuous Telemetry (kWh & Cost)"}
              {activeTab === "daily" && "Daily Consumption & Cost Trend (Past 7 Days)"}
              {activeTab === "monthly" && "6-Month Historical Energy & Cost Comparison"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Interactive time-series breakdown of units and financial expense in Indian Rupees (₹)
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-slate-700">Usage (kWh)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-slate-900"></span>
              <span className="text-slate-700">Cost (₹)</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === "hourly" ? (
              <ComposedChart data={hourlyReadings}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}k`} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload as HourlyTelemetry;
                      return (
                        <div className="p-3 bg-slate-900 text-white rounded-xl text-xs shadow-lg">
                          <p className="font-bold text-emerald-400 mb-1">{d.hour}</p>
                          <p>Usage: <strong>{d.kwh} kWh</strong></p>
                          <p>Cost: <strong>₹{d.costInr}</strong></p>
                          <p>Carbon: <strong>{d.carbonKg} kg CO₂</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area yAxisId="left" type="monotone" dataKey="kwh" fill="#10b981" fillOpacity={0.15} stroke="#059669" strokeWidth={2.5} />
                <Line yAxisId="right" type="monotone" dataKey="costInr" stroke="#0f172a" strokeWidth={2} dot={false} />
              </ComposedChart>
            ) : activeTab === "daily" ? (
              <ComposedChart data={dailyReadings}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}k`} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload as DailyTelemetry;
                      return (
                        <div className="p-3 bg-slate-900 text-white rounded-xl text-xs shadow-lg">
                          <p className="font-bold text-emerald-400 mb-1">{d.date} ({d.day})</p>
                          <p>Usage: <strong>{d.kwh} kWh</strong></p>
                          <p>Cost: <strong>₹{d.costInr}</strong></p>
                          <p>Carbon: <strong>{d.carbonKg} kg CO₂</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar yAxisId="left" dataKey="kwh" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="costInr" stroke="#0f172a" strokeWidth={2.5} dot={{ r: 4 }} />
              </ComposedChart>
            ) : (
              <ComposedChart data={monthlyReadings}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}k`} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload as MonthlyTelemetry;
                      return (
                        <div className="p-3 bg-slate-900 text-white rounded-xl text-xs shadow-lg">
                          <p className="font-bold text-emerald-400 mb-1">{d.month} 2026</p>
                          <p>Total Consumption: <strong>{d.kwh} kWh</strong></p>
                          <p>Monthly Bill: <strong>₹{d.costInr}</strong></p>
                          <p>Carbon: <strong>{d.carbonKg} kg CO₂</strong></p>
                          <p>Saved vs Benchmark: <strong>{d.savedKwh} kWh</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar yAxisId="left" dataKey="kwh" fill="#059669" radius={[6, 6, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="costInr" stroke="#0f172a" strokeWidth={2.5} dot={{ r: 4 }} />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Breakdown Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Load Distribution Donut Chart (5 Columns) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            Category Load Share
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Proportional split of household power by device
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${val} kWh`, "Usage"]} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak vs Off-Peak Insights (7 Columns) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Peak vs. Off-Peak Usage Breakdown
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Analysis of discretionary loads operating during peak utility slab hours
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Morning Demand Peak (06:30 AM – 09:30 AM)</span>
                  <span className="font-bold text-slate-900">118 kWh (22%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: "22%" }} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Driven by Water Geyser and morning cooking appliances.</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Evening AC & Lighting Peak (07:00 PM – 11:30 PM)</span>
                  <span className="font-bold text-slate-900">232 kWh (44%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: "44%" }} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Driven by 1.5 Ton Living Room Split AC & Television.</p>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">Night Off-Peak Baseline (12:00 AM – 06:00 AM)</span>
                  <span className="font-bold text-slate-900">181 kWh (34%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full" style={{ width: "34%" }} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Steady standby draw from Refrigerator and BLDC fans.</p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 mt-6 flex items-center justify-between text-xs">
            <span className="text-emerald-900 font-semibold">
              Shifting 15% of evening AC draw to eco-timer mode saves:
            </span>
            <span className="font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
              ₹210 / month
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
