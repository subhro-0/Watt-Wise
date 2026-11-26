import React, { useState } from "react";
import {
  Target,
  Award,
  Plus,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  Trophy,
  Calendar,
  X,
} from "lucide-react";
import { Goal } from "../types";

interface EnergyGoalsProps {
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
  currentKwh: number;
  currentBillInr: number;
}

export const EnergyGoals: React.FC<EnergyGoalsProps> = ({
  goals,
  onAddGoal,
  currentKwh,
  currentBillInr,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [targetKwh, setTargetKwh] = useState(480);
  const [targetBill, setTargetBill] = useState(3000);
  const [targetMonth, setTargetMonth] = useState("December 2026");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newGoal: Goal = {
      id: "goal-" + Date.now(),
      title,
      targetKwh,
      currentKwh,
      targetBillInr: targetBill,
      currentBillInr,
      targetMonth,
      achieved: false,
    };

    onAddGoal(newGoal);
    setIsModalOpen(false);
    setTitle("");
  };

  const achievements = [
    {
      title: "October Energy Master",
      desc: "Kept consumption 12% below monthly budget.",
      date: "Oct 2026",
      icon: Trophy,
    },
    {
      title: "Slab Defender",
      desc: "Successfully stayed below the 400-unit top tier tariff.",
      date: "Sep 2026",
      icon: Award,
    },
    {
      title: "Clean Grid Champion",
      desc: "Operated Geyser during early clean morning hours for 20 days straight.",
      date: "Aug 2026",
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Household Energy-Saving Goals
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Set concrete monthly kWh and financial reduction targets to keep bills within budget.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Set New Goal</span>
        </button>
      </div>

      {/* Active Goals List */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Active Monthly Targets
        </h4>

        {goals.map((g) => {
          const progressPct = Math.round((g.currentKwh / g.targetKwh) * 100);
          const isOver = g.currentKwh > g.targetKwh;

          return (
            <div
              key={g.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl ${
                      g.achieved ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {g.achieved ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Target className="w-5 h-5 text-emerald-600" />}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">{g.title}</h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Cycle: <strong>{g.targetMonth}</strong> • Target Bill: <strong>₹{g.targetBillInr}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500 uppercase block">Current vs Target</span>
                  <span className="text-sm font-black text-slate-900">
                    {g.currentKwh} / {g.targetKwh} kWh
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      g.achieved ? "bg-emerald-500" : isOver ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(100, progressPct)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>{progressPct}% of target energy threshold used</span>
                  <span className={isOver ? "text-amber-600 font-bold" : "text-emerald-700 font-bold"}>
                    {g.achieved
                      ? "Goal Achieved!"
                      : isOver
                      ? `Exceeded by +${g.currentKwh - g.targetKwh} kWh`
                      : `${g.targetKwh - g.currentKwh} kWh remaining in budget`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Badges & Achievements Section */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 mb-1">
          Efficiency Achievements & Badges
        </h4>
        <p className="text-xs text-slate-500 mb-5">
          Milestones unlocked through continuous household energy reduction
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {achievements.map((ach, idx) => {
            const Icon = ach.icon;
            return (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{ach.title}</h5>
                  <p className="text-xs text-slate-500 mt-1">{ach.desc}</p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-2">
                    Unlocked: {ach.date}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Set Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">Set New Energy Target</h3>
            <p className="text-xs text-slate-500 mb-4">Establish monthly caps on kWh and electricity expenditure.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cut AC and Geyser power in Dec"
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Units (kWh)</label>
                  <input
                    type="number"
                    min="100"
                    max="2000"
                    required
                    value={targetKwh}
                    onChange={(e) => setTargetKwh(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Bill (₹)</label>
                  <input
                    type="number"
                    min="500"
                    max="15000"
                    required
                    value={targetBill}
                    onChange={(e) => setTargetBill(parseInt(e.target.value) || 0)}
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Target Cycle Month</label>
                <input
                  type="text"
                  value={targetMonth}
                  onChange={(e) => setTargetMonth(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  Create Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
