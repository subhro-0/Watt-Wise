import React, { useState, useMemo } from "react";
import {
  ReceiptText,
  IndianRupee,
  Sliders,
  TrendingDown,
  Info,
  Layers,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { TariffConfig } from "../types";
import { defaultTariffConfig } from "../data/mockHouseholdData";

interface BillEstimatorProps {
  currentKwh: number;
}

export const BillEstimator: React.FC<BillEstimatorProps> = ({ currentKwh }) => {
  const [kwhUnits, setKwhUnits] = useState<number>(currentKwh || 495);
  const [tariff, setTariff] = useState<TariffConfig>(defaultTariffConfig);

  React.useEffect(() => {
    if (currentKwh && currentKwh > 0) {
      setKwhUnits(currentKwh);
    }
  }, [currentKwh]);

  // Slab Calculation Logic
  const billBreakdown = useMemo(() => {
    let unitsLeft = kwhUnits;
    let energyCharges = 0;
    const slabDetails: Array<{ slab: string; units: number; rate: number; amount: number }> = [];

    for (let i = 0; i < tariff.slabs.length; i++) {
      const s = tariff.slabs[i];
      if (unitsLeft <= 0) break;

      const slabCapacity = s.maxUnits !== null
        ? (s.minUnits === 0 ? s.maxUnits : s.maxUnits - s.minUnits + 1)
        : Infinity;
      const unitsInThisSlab = Math.min(unitsLeft, slabCapacity);
      const amount = unitsInThisSlab * s.ratePerUnitInr;

      slabDetails.push({
        slab: s.maxUnits ? `${s.minUnits} – ${s.maxUnits} units` : `> ${s.minUnits} units`,
        units: unitsInThisSlab,
        rate: s.ratePerUnitInr,
        amount: Math.round(amount * 100) / 100,
      });

      energyCharges += amount;
      unitsLeft -= unitsInThisSlab;
    }

    const fixedCharges = tariff.fixedMonthlyChargesInr;
    const electricityDuty = (energyCharges * tariff.taxPercentage) / 100;
    const totalBill = Math.round(energyCharges + fixedCharges + electricityDuty);

    return {
      slabDetails,
      energyCharges: Math.round(energyCharges),
      fixedCharges,
      electricityDuty: Math.round(electricityDuty),
      totalBill,
      effectiveRate: kwhUnits > 0 ? (totalBill / kwhUnits).toFixed(2) : "0",
    };
  }, [kwhUnits, tariff]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
              <ReceiptText className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Slab-Based Electricity Bill Estimator
            </h3>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              Indian Domestic Tariff Mode
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Calculates exact electricity charges across tiered domestic consumption slabs, fixed meter charges, and state electricity duty.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Current Meter Baseline:</span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            {currentKwh} kWh
          </span>
        </div>
      </div>

      {/* Interactive Consumption Slider Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-emerald-600" />
            Adjust Projected Monthly Consumption (kWh Units):
          </span>
          <span className="text-xl font-extrabold text-slate-900 bg-slate-100 px-3 py-1 rounded-xl w-fit">
            {kwhUnits} kWh
          </span>
        </div>

        <input
          type="range"
          min="50"
          max="1200"
          step="10"
          value={kwhUnits}
          onChange={(e) => setKwhUnits(parseInt(e.target.value) || 0)}
          className="w-full accent-emerald-600 cursor-pointer h-2.5 bg-slate-200 rounded-lg appearance-none my-3"
        />

        <div className="flex justify-between text-[11px] font-bold text-slate-400">
          <span>50 kWh (Low)</span>
          <span className="text-emerald-700">300 kWh (Avg Household)</span>
          <span>600 kWh (Medium AC)</span>
          <span>1200 kWh (Heavy Load)</span>
        </div>
      </div>

      {/* Bill Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Detailed Slab Breakdown Table (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <h4 className="text-sm font-bold text-slate-900 mb-1">
            Consumption-Based Slab Breakdown
          </h4>
          <p className="text-xs text-slate-500 mb-4">
            How your {kwhUnits} units are taxed across each tier
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-2">Tariff Slab</th>
                  <th className="pb-2">Units in Slab</th>
                  <th className="pb-2">Rate/Unit</th>
                  <th className="pb-2 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {billBreakdown.slabDetails.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-2.5 font-bold text-slate-800">{item.slab}</td>
                    <td className="py-2.5 text-slate-600">{item.units} units</td>
                    <td className="py-2.5 text-slate-600">₹{item.rate.toFixed(2)}</td>
                    <td className="py-2.5 font-bold text-slate-900 text-right">
                      ₹{item.amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subtotals & Taxes */}
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Energy Charges Subtotal:</span>
              <span className="font-semibold text-slate-800">₹{billBreakdown.energyCharges}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Fixed Meter Charges (per cycle):</span>
              <span className="font-semibold text-slate-800">₹{billBreakdown.fixedCharges}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Electricity Duty ({tariff.taxPercentage}%):</span>
              <span className="font-semibold text-slate-800">₹{billBreakdown.electricityDuty}</span>
            </div>
          </div>
        </div>

        {/* Right: Total Invoice Summary Card (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/30">
                Official Estimate
              </span>
              <span className="text-xs text-slate-400">Nov 2026</span>
            </div>

            <span className="text-xs text-slate-400 font-medium block mb-1">Estimated Electricity Bill</span>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-xl font-bold text-emerald-400">₹</span>
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {billBreakdown.totalBill.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2 text-xs mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400">Effective Average Rate:</span>
                <span className="font-bold text-white">₹{billBreakdown.effectiveRate} / unit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Previous Month (Oct):</span>
                <span className="font-semibold text-slate-300">₹2,880 (480 kWh)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Difference:</span>
                <span className={billBreakdown.totalBill > 2880 ? "text-amber-400 font-bold" : "text-emerald-400 font-bold"}>
                  {(() => {
                    const diff = billBreakdown.totalBill - 2880;
                    const diffPct = Math.abs(Math.round((diff / 2880) * 100));
                    return diff > 0
                      ? `+₹${diff.toLocaleString("en-IN")} (+${diffPct}%)`
                      : `-₹${Math.abs(diff).toLocaleString("en-IN")} (-${diffPct}%)`;
                  })()}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Slab Tip:</strong> Keeping your total usage below 400 units avoids the top slab rate of ₹8.80/unit, saving an instant ~₹320 on your invoice.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
