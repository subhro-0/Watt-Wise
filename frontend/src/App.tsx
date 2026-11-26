import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./pages/LandingPage";
import { Dashboard } from "./pages/Dashboard";
import { MyAppliances } from "./pages/MyAppliances";
import { EnergyAnalytics } from "./pages/EnergyAnalytics";
import { AIAssistant } from "./pages/AIAssistant";
import { CarbonTracker } from "./pages/CarbonTracker";
import { BillEstimator } from "./pages/BillEstimator";
import { EnergyGoals } from "./pages/EnergyGoals";
import { Alerts } from "./pages/Alerts";
import { Reports } from "./pages/Reports";
import {
  initialAppliances,
  initialGoals,
  initialAlerts,
  mockDailyReadings,
  mockHourlyReadings,
  mockMonthlyReadings,
  CEA_GRID_EMISSION_FACTOR,
} from "./data/mockHouseholdData";
import {
  PageId,
  Appliance,
  Goal,
  AlertNotification,
  DailyTelemetry,
  HourlyTelemetry,
  MonthlyTelemetry,
} from "./types";
import {
  fetchAppliances,
  createApplianceApi,
  updateApplianceApi,
  deleteApplianceApi,
  fetchGoals,
  createGoalApi,
  fetchAlerts,
  markAlertReadApi,
  markAllAlertsReadApi,
  fetchDailyAnalytics,
  fetchHourlyAnalytics,
  fetchMonthlyAnalytics,
} from "./services/api";

export function App() {
  const [currentPage, setCurrentPage] = useState<PageId>("landing");
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Core State
  const [appliances, setAppliances] = useState<Appliance[]>(initialAppliances);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [alerts, setAlerts] = useState<AlertNotification[]>(initialAlerts);
  const [dailyReadings, setDailyReadings] = useState<DailyTelemetry[]>(mockDailyReadings);
  const [hourlyReadings, setHourlyReadings] = useState<HourlyTelemetry[]>(mockHourlyReadings);
  const [monthlyReadings, setMonthlyReadings] = useState<MonthlyTelemetry[]>(mockMonthlyReadings);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Load live data from FastAPI & Database on mount
  useEffect(() => {
    async function loadLiveData() {
      try {
        const [appsData, goalsData, alertsData, dailyData, hourlyData, monthlyData] =
          await Promise.allSettled([
            fetchAppliances(),
            fetchGoals(),
            fetchAlerts(),
            fetchDailyAnalytics(),
            fetchHourlyAnalytics(),
            fetchMonthlyAnalytics(),
          ]);

        if (appsData.status === "fulfilled" && appsData.value.length > 0) {
          setAppliances(appsData.value);
        }
        if (goalsData.status === "fulfilled" && goalsData.value.length > 0) {
          setGoals(goalsData.value);
        }
        if (alertsData.status === "fulfilled" && alertsData.value.length > 0) {
          setAlerts(alertsData.value);
        }
        if (dailyData.status === "fulfilled" && dailyData.value.length > 0) {
          setDailyReadings(dailyData.value);
        }
        if (hourlyData.status === "fulfilled" && hourlyData.value.length > 0) {
          setHourlyReadings(hourlyData.value);
        }
        if (monthlyData.status === "fulfilled" && monthlyData.value.length > 0) {
          setMonthlyReadings(monthlyData.value);
        }

        if (appsData.status === "fulfilled") {
          setIsBackendConnected(true);
        }
      } catch (err) {
        console.warn("FastAPI backend connection check:", err);
      }
    }

    loadLiveData();
  }, []);

  // Dynamic calculations
  const totalKwh = Math.round(appliances.reduce((acc, a) => acc + a.monthlyKwh, 0));
  const totalBillInr = Math.round(appliances.reduce((acc, a) => acc + a.monthlyCostInr, 0));
  const totalCo2Kg = Math.round(totalKwh * CEA_GRID_EMISSION_FACTOR * 10) / 10;
  const unreadAlertCount = alerts.filter((a) => !a.read).length;

  // Appliance Handlers with DB Sync
  const handleAddAppliance = async (newApp: Appliance) => {
    try {
      const created = await createApplianceApi(newApp);
      setAppliances((prev) => [created, ...prev]);
    } catch (e) {
      console.warn("Using local state fallback for add:", e);
      setAppliances((prev) => [newApp, ...prev]);
    }
  };

  const handleUpdateAppliance = async (updated: Appliance) => {
    try {
      const res = await updateApplianceApi(updated.id, updated);
      setAppliances((prev) => prev.map((a) => (a.id === res.id ? res : a)));
    } catch (e) {
      console.warn("Using local state fallback for update:", e);
      setAppliances((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    }
  };

  const handleDeleteAppliance = async (id: string) => {
    try {
      await deleteApplianceApi(id);
      setAppliances((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.warn("Using local state fallback for delete:", e);
      setAppliances((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // Goal Handler with DB Sync
  const handleAddGoal = async (newGoal: Goal) => {
    try {
      const created = await createGoalApi(newGoal);
      setGoals((prev) => [created, ...prev]);
    } catch (e) {
      console.warn("Using local state fallback for goal:", e);
      setGoals((prev) => [newGoal, ...prev]);
    }
  };

  // Alert Handlers with DB Sync
  const handleMarkAsRead = async (id: string) => {
    try {
      await markAlertReadApi(id);
    } catch {}
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  };

  const handleClearAlerts = async () => {
    try {
      await markAllAlertsReadApi();
    } catch {}
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  // 1. Render Public Landing Page
  if (currentPage === "landing") {
    return <LandingPage onNavigate={setCurrentPage} />;
  }

  // 2. Render Full 9-Page Management Dashboard Suite
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-emerald-500 selection:text-white flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        isOpenMobile={isOpenMobile}
        onToggleMobile={() => setIsOpenMobile(!isOpenMobile)}
        unreadAlertCount={unreadAlertCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Navbar
          currentPage={currentPage}
          onToggleMobile={() => setIsOpenMobile(!isOpenMobile)}
          unreadAlertCount={unreadAlertCount}
          onOpenAlerts={() => setCurrentPage("alerts")}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {currentPage === "dashboard" && (
            <Dashboard
              appliances={appliances}
              dailyReadings={dailyReadings}
              monthlyReadings={monthlyReadings}
              goals={goals}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === "appliances" && (
            <MyAppliances
              appliances={appliances}
              onAddAppliance={handleAddAppliance}
              onUpdateAppliance={handleUpdateAppliance}
              onDeleteAppliance={handleDeleteAppliance}
            />
          )}

          {currentPage === "analytics" && (
            <EnergyAnalytics
              appliances={appliances}
              hourlyReadings={hourlyReadings}
              dailyReadings={dailyReadings}
              monthlyReadings={monthlyReadings}
            />
          )}

          {currentPage === "ai-assistant" && (
            <AIAssistant
              appliances={appliances}
              totalKwh={totalKwh}
              totalBillInr={totalBillInr}
              totalCo2Kg={totalCo2Kg}
            />
          )}

          {currentPage === "carbon-tracker" && (
            <CarbonTracker
              totalKwh={totalKwh}
              dailyReadings={dailyReadings}
              monthlyReadings={monthlyReadings}
            />
          )}

          {currentPage === "bill-estimator" && (
            <BillEstimator currentKwh={totalKwh} />
          )}

          {currentPage === "goals" && (
            <EnergyGoals
              goals={goals}
              onAddGoal={handleAddGoal}
              currentKwh={totalKwh}
              currentBillInr={totalBillInr}
            />
          )}

          {currentPage === "alerts" && (
            <Alerts
              alerts={alerts}
              onMarkAsRead={handleMarkAsRead}
              onClearAlerts={handleClearAlerts}
            />
          )}

          {currentPage === "reports" && (
            <Reports
              appliances={appliances}
              totalKwh={totalKwh}
              totalBillInr={totalBillInr}
              totalCo2Kg={totalCo2Kg}
              monthlyReadings={monthlyReadings}
            />
          )}
        </main>

        {/* Clean Footer with Live Connection Status */}
        <footer className="border-t border-slate-200/80 bg-white py-6 px-4 sm:px-8 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="font-semibold text-slate-700">
              Watt Wise • Smarter Energy. Greener Living.
            </span>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {isBackendConnected
                  ? "Live Database Sync: Active (FastAPI + SQLite/Postgres)"
                  : "Connecting to Backend API..."}
              </span>
              <span className="text-slate-400 hidden md:inline">
                CEA Grid Factor: 0.82 kg CO₂/kWh
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
