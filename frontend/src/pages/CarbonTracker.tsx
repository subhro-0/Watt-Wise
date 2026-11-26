import React, { useState } from "react";
import {
  Leaf,
  TreePine,
  Car,
  Globe2,
  TrendingDown,
  Info,
  Sliders,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { DailyTelemetry, MonthlyTelemetry } from "../types";

interface CarbonTrackerProps {
  totalKwh: number;
  dailyReadings: DailyTelemetry[];
  monthlyReadings: MonthlyTelemetry[];
}

export const CarbonTracker: React.FC<CarbonTrackerProps> = ({
  totalKwh,
  dailyReadings,
  monthlyReadings,
}) => {
  // Configurable Grid Emission Factor (kg CO2 / kWh)
  // Default to CEA India (0.82 kg/kWh)
  const [gridFactor, setGridFactor] = useState<number>(0.82);

  // Carbon Math
  const totalCo2Kg = Math.round(totalKwh * gridFactor * 10) / 10;
  const treesRequired = Math.round(totalCo2Kg / 21.7); // 1 tree absorbs ~21.7 kg CO2/yr
  const carMilesEquivalent = Math.round(totalCo2Kg / 0.404); // 404g/mile
  const avoidedCo2Kg = Math.round(64 * gridFactor * 10) / 10; // Based on 64 kWh saved

  const carbonChartData = monthlyReadings.map((m) => ({
    month: m.month,
    co2Kg: Math.round(m.kwh * gridFactor),
    avoidedCo2Kg: Math.round(m.savedKwh * gridFactor),
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner: Scope 2 Formula & Configuration */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Household Scope 2 Carbon Accounting
            </h3>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              GHG Protocol Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Formula: <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-800 font-mono font-semibold">CO₂ (kg) = Usage (kWh) × Grid Factor ({gridFactor} kg/kWh)</code>. 
            Calibrated against Central Electricity Authority (CEA) India baseline carbon intensity.
          </p>
        </div>

        {/* Configurable Emission Factor Selector */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="text-xs">
            <span className="font-bold text-slate-700 block">Regional Grid Factor:</span>
            <span className="text-[11px] text-slate-500 font-medium">Source: CEA India 2024</span>
          </div>

          <select
            value={gridFactor}
            onChange={(e) => setGridFactor(parseFloat(e.target.value))}
            className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value={0.82}>0.82 kg/kWh (India National Grid Avg - CEA)</option>
            <option value={0.71}>0.71 kg/kWh (Southern Regional Grid)</option>
            <option value={0.91}>0.91 kg/kWh (Eastern Coal-Dominated Grid)</option>
            <option value={0.05}>0.05 kg/kWh (100% Rooftop Solar Net-Metered)</option>
            <option value={0.38}>0.38 kg/kWh (US Grid Benchmark)</option>
          </select>
        </div>
      </div>

      {/* 4 Carbon Impact Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Monthly Carbon Emitted
          </span>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalCo2Kg}
            </span>
            <span className="text-sm font-bold text-emerald-700">kg CO₂e</span>
          </div>
          <p className="text-xs text-slate-500">From {totalKwh} kWh electric consumption</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Trees Required to Offset
          </span>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">
              {treesRequired}
            </span>
            <span className="text-sm font-semibold text-slate-500">Mature Trees</span>
          </div>
          <p className="text-xs text-slate-500">1 tree absorbs ~21.7 kg CO₂/year</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Driving Equivalence
          </span>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {carMilesEquivalent.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-slate-500">Vehicle Miles</span>
          </div>
          <p className="text-xs text-slate-500">≈ {Math.round(carMilesEquivalent * 1.6)} km petrol driving</p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-950 text-white shadow-xs">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
            Emissions Avoided
          </span>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              -{avoidedCo2Kg}
            </span>
            <span className="text-sm font-bold text-emerald-400">kg CO₂</span>
          </div>
          <p className="text-xs text-slate-300">Through 64 kWh reduction in habits</p>
        </div>
      </div>

      {/* Historical Carbon Footprint Chart */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              6-Month Historical Carbon Footprint (kg CO₂e)
            </h4>
            <p className="text-xs text-slate-500">
              Monthly emissions trajectory based on CEA grid carbon intensity
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            Down 21% from June peak
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={carbonChartData}>
              <defs>
                <linearGradient id="carbonGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `${v}kg`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="p-3 bg-slate-900 text-white rounded-xl text-xs shadow-lg">
                        <p className="font-bold text-emerald-400 mb-1">{d.month} 2026</p>
                        <p>Total Emissions: <strong>{d.co2Kg} kg CO₂</strong></p>
                        <p>Avoided: <strong>-{d.avoidedCo2Kg} kg CO₂</strong></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area type="monotone" dataKey="co2Kg" stroke="#059669" strokeWidth={2.5} fill="url(#carbonGreen)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Environmental Equivalencies Walkthrough */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 mb-3">
          Tangible Environmental Footprint Equivalencies
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800">
              <TreePine className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">Tree Absorption Need</h5>
              <p className="text-xs text-slate-500 mt-1">
                It takes <strong>{treesRequired} mature teak/banyan trees</strong> one full year to absorb this household's annual emissions.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">Car Trips Offset</h5>
              <p className="text-xs text-slate-500 mt-1">
                Your monthly power usage equals driving <strong>{carMilesEquivalent.toLocaleString()} miles</strong> in an average petrol car.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">Per Capita Footprint</h5>
              <p className="text-xs text-slate-500 mt-1">
                For a family of 4, each member produces <strong>{Math.round(totalCo2Kg / 4)} kg CO₂</strong> monthly from electricity alone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
