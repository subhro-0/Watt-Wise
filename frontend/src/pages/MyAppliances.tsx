import React, { useState } from "react";
import {
  Plus,
  Tv,
  Wind,
  Flame,
  Shirt,
  Monitor,
  Microwave,
  Trash2,
  Edit2,
  Zap,
  Info,
  Clock,
  Sparkles,
  Check,
  X,
  Search,
} from "lucide-react";
import { Appliance } from "../types";
import { CEA_GRID_EMISSION_FACTOR } from "../data/mockHouseholdData";

interface MyAppliancesProps {
  appliances: Appliance[];
  onAddAppliance: (appliance: Appliance) => void;
  onUpdateAppliance: (appliance: Appliance) => void;
  onDeleteAppliance: (id: string) => void;
}

export const MyAppliances: React.FC<MyAppliancesProps> = ({
  appliances,
  onAddAppliance,
  onUpdateAppliance,
  onDeleteAppliance,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState<Appliance | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Appliance["category"]>("climate");
  const [watts, setWatts] = useState(1000);
  const [quantity, setQuantity] = useState(1);
  const [dailyHours, setDailyHours] = useState(4);
  const [schedule, setSchedule] = useState("");

  // Presets definition
  const presets = [
    { name: "Inverter Split AC (1.5 Ton)", label: "1.5T Split AC", category: "climate" as const, watts: 1450, hours: 6 },
    { name: "Double-Door Refrigerator (300L)", label: "Refrigerator", category: "cooling" as const, watts: 180, hours: 24 },
    { name: "BLDC Ceiling Fan", label: "BLDC Fan", category: "cooling" as const, watts: 32, hours: 12 },
    { name: "Storage Water Geyser", label: "Water Geyser", category: "utility" as const, watts: 2000, hours: 1.5 },
    { name: "LED Bulbs / Tube Array", label: "LED Lights", category: "lighting" as const, watts: 14, hours: 7 },
    { name: "Smart 4K LED Television", label: "Smart TV", category: "entertainment" as const, watts: 110, hours: 4.5 },
    { name: "Automatic Washing Machine", label: "Washing Machine", category: "utility" as const, watts: 1800, hours: 0.8 },
    { name: "Desktop Computer / Workstation", label: "Computer / PC", category: "other" as const, watts: 200, hours: 6 },
    { name: "Microwave Oven / OTG", label: "Microwave", category: "kitchen" as const, watts: 1200, hours: 0.5 },
  ];

  const handleApplyPreset = (p: (typeof presets)[0]) => {
    setName(p.name);
    setCategory(p.category);
    setWatts(p.watts);
    setDailyHours(p.hours);
  };

  const openAddModal = () => {
    setEditingAppliance(null);
    setName("");
    setCategory("climate");
    setWatts(1200);
    setQuantity(1);
    setDailyHours(4);
    setSchedule("");
    setIsModalOpen(true);
  };

  const openEditModal = (app: Appliance) => {
    setEditingAppliance(app);
    setName(app.name);
    setCategory(app.category);
    setWatts(app.watts);
    setQuantity(app.quantity);
    setDailyHours(app.dailyHours);
    setSchedule(app.operatingSchedule || "");
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Calculations
    const dailyKwh = (watts * quantity * dailyHours) / 1000;
    const monthlyKwh = Math.round(dailyKwh * 30 * 10) / 10;
    const estimatedUnitCost = 6.2; // Average composite tariff
    const monthlyCostInr = Math.round(monthlyKwh * estimatedUnitCost);
    const monthlyCo2Kg = Math.round(monthlyKwh * CEA_GRID_EMISSION_FACTOR * 10) / 10;

    if (editingAppliance) {
      onUpdateAppliance({
        ...editingAppliance,
        name,
        category,
        watts,
        quantity,
        dailyHours,
        operatingSchedule: schedule,
        monthlyKwh,
        monthlyCostInr,
        monthlyCo2Kg,
      });
    } else {
      const newApp: Appliance = {
        id: "app-" + Date.now(),
        name,
        category,
        watts,
        quantity,
        dailyHours,
        operatingSchedule: schedule,
        monthlyKwh,
        monthlyCostInr,
        monthlyCo2Kg,
      };
      onAddAppliance(newApp);
    }

    setIsModalOpen(false);
  };

  const filteredAppliances = appliances.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMonthlyWatts = appliances.reduce((acc, a) => acc + a.watts * a.quantity, 0);
  const totalMonthlyKwh = Math.round(appliances.reduce((acc, a) => acc + a.monthlyKwh, 0));

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Household Appliance Inventory
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage device ratings, daily usage hours, and track individual power loads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search appliances..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
            />
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Appliance</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs">
          <span className="text-slate-500 font-medium block mb-1">Total Monitored Appliances</span>
          <span className="text-2xl font-extrabold text-slate-900">{appliances.length} Devices</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs">
          <span className="text-slate-500 font-medium block mb-1">Combined Connected Load</span>
          <span className="text-2xl font-extrabold text-slate-900">{(totalMonthlyWatts / 1000).toFixed(2)} kW</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs">
          <span className="text-slate-500 font-medium block mb-1">Monthly Appliance Draw</span>
          <span className="text-2xl font-extrabold text-emerald-600">{totalMonthlyKwh} kWh</span>
        </div>
      </div>

      {/* Appliances Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Active Devices ({filteredAppliances.length})
          </span>
          <span className="text-xs text-slate-400">Values calculated at ₹6.20/kWh avg</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredAppliances.map((app) => {
            const pctOfTotal = totalMonthlyKwh > 0 ? Math.round((app.monthlyKwh / totalMonthlyKwh) * 100) : 0;

            return (
              <div
                key={app.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                {/* Appliance Info */}
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-100 text-emerald-700 shrink-0">
                    <Zap className="w-5 h-5 fill-emerald-600 text-emerald-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{app.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                        {app.category}
                      </span>
                      {app.quantity > 1 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                          Qty: {app.quantity}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Power: <strong>{app.watts}W</strong> • Average run time: <strong>{app.dailyHours} hrs/day</strong>
                      {app.operatingSchedule && ` • (${app.operatingSchedule})`}
                    </p>
                  </div>
                </div>

                {/* Consumption Stats */}
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0">
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 block">{app.monthlyKwh} kWh</span>
                    <span className="text-xs text-slate-400">Monthly</span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-emerald-700 block">₹{app.monthlyCostInr}</span>
                    <span className="text-xs text-slate-400">Cost/mo</span>
                  </div>

                  <div className="text-right hidden sm:block">
                    <span className="text-sm font-semibold text-slate-700 block">{app.monthlyCo2Kg} kg</span>
                    <span className="text-xs text-slate-400">CO₂e</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 pl-2">
                    <button
                      onClick={() => openEditModal(app)}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
                      title="Edit Appliance"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteAppliance(app.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Appliance"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Appliance Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {editingAppliance ? "Edit Appliance Details" : "Add New Appliance"}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter the rated wattage and typical daily usage to calculate accurate monthly consumption.
            </p>

            {/* Quick Presets Picker */}
            {!editingAppliance && (
              <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Choose from Common Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {presets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition-colors"
                    >
                      {preset.label} ({preset.watts}W)
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Appliance Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 1.5 Ton Inverter AC"
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs font-medium px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="climate">Climate & AC</option>
                    <option value="cooling">Cooling & Fans</option>
                    <option value="lighting">Lighting</option>
                    <option value="utility">Utility & Geysers</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="kitchen">Kitchen Appliances</option>
                    <option value="other">Other Devices</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Power Rating (Watts)</label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    required
                    value={watts}
                    onChange={(e) => setWatts(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Daily Usage (Hours/day)</label>
                  <input
                    type="number"
                    min="0.1"
                    max="24"
                    step="0.5"
                    required
                    value={dailyHours}
                    onChange={(e) => setDailyHours(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Operating Schedule (Optional)</label>
                <input
                  type="text"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="e.g. 10:00 PM - 06:00 AM"
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Live Preview Box */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Calculated Monthly Consumption:</span>
                  <span className="text-sm font-bold text-slate-900">
                    {Math.round(((watts * quantity * dailyHours) / 1000) * 30 * 10) / 10} kWh/month
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Est. Cost:</span>
                  <span className="text-sm font-bold text-emerald-700">
                    ≈ ₹{Math.round(((watts * quantity * dailyHours) / 1000) * 30 * 6.2)}/mo
                  </span>
                </div>
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
                  {editingAppliance ? "Save Changes" : "Add to Inventory"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
