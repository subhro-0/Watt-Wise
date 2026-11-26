import {
  Appliance,
  Goal,
  AlertNotification,
  HourlyTelemetry,
  DailyTelemetry,
  MonthlyTelemetry,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

// Helper converters
export function toFrontendAppliance(raw: any): Appliance {
  return {
    id: raw.id,
    name: raw.name,
    category: raw.category || "other",
    watts: raw.watts,
    quantity: raw.quantity,
    dailyHours: raw.daily_hours ?? raw.dailyHours ?? 0,
    operatingSchedule: raw.operating_schedule ?? raw.operatingSchedule ?? "",
    monthlyKwh: raw.monthly_kwh ?? raw.monthlyKwh ?? 0,
    monthlyCostInr: raw.monthly_cost_inr ?? raw.monthlyCostInr ?? 0,
    monthlyCo2Kg: raw.monthly_co2_kg ?? raw.monthlyCo2Kg ?? 0,
  };
}

export function toBackendAppliance(app: Partial<Appliance>): any {
  return {
    name: app.name,
    category: app.category,
    watts: app.watts,
    quantity: app.quantity,
    daily_hours: app.dailyHours,
    operating_schedule: app.operatingSchedule,
  };
}

export function toFrontendGoal(raw: any): Goal {
  return {
    id: raw.id,
    title: raw.title,
    targetKwh: raw.target_kwh ?? raw.targetKwh ?? 0,
    currentKwh: raw.current_kwh ?? raw.currentKwh ?? 0,
    targetBillInr: raw.target_bill_inr ?? raw.targetBillInr ?? 0,
    currentBillInr: raw.current_bill_inr ?? raw.currentBillInr ?? 0,
    targetMonth: raw.target_month ?? raw.targetMonth ?? "",
    achieved: raw.achieved ?? false,
  };
}

export function toFrontendHourly(raw: any): HourlyTelemetry {
  return {
    hour: raw.hour,
    kwh: raw.kwh,
    costInr: raw.cost_inr ?? raw.costInr ?? 0,
    carbonKg: raw.carbon_kg ?? raw.carbonKg ?? 0,
  };
}

export function toFrontendDaily(raw: any): DailyTelemetry {
  return {
    date: raw.date,
    day: raw.day,
    kwh: raw.kwh,
    costInr: raw.cost_inr ?? raw.costInr ?? 0,
    carbonKg: raw.carbon_kg ?? raw.carbonKg ?? 0,
  };
}

export function toFrontendMonthly(raw: any): MonthlyTelemetry {
  return {
    month: raw.month,
    kwh: raw.kwh,
    costInr: raw.cost_inr ?? raw.costInr ?? 0,
    carbonKg: raw.carbon_kg ?? raw.carbonKg ?? 0,
    savedKwh: raw.saved_kwh ?? raw.savedKwh ?? 0,
  };
}

// 1. Dashboard Summary
export async function fetchDashboardSummary() {
  const res = await fetch(`${API_BASE_URL}/dashboard/summary`);
  if (!res.ok) throw new Error("Failed to fetch dashboard summary");
  return res.json();
}

// 2. Appliances
export async function fetchAppliances(): Promise<Appliance[]> {
  const res = await fetch(`${API_BASE_URL}/appliances`);
  if (!res.ok) throw new Error("Failed to fetch appliances");
  const data = await res.json();
  return data.map(toFrontendAppliance);
}

export async function createApplianceApi(app: Partial<Appliance>): Promise<Appliance> {
  const res = await fetch(`${API_BASE_URL}/appliances`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toBackendAppliance(app)),
  });
  if (!res.ok) throw new Error("Failed to create appliance");
  const data = await res.json();
  return toFrontendAppliance(data);
}

export async function updateApplianceApi(
  id: string,
  app: Partial<Appliance>
): Promise<Appliance> {
  const res = await fetch(`${API_BASE_URL}/appliances/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(toBackendAppliance(app)),
  });
  if (!res.ok) throw new Error("Failed to update appliance");
  const data = await res.json();
  return toFrontendAppliance(data);
}

export async function deleteApplianceApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/appliances/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete appliance");
}

// 3. Analytics
export async function fetchHourlyAnalytics(): Promise<HourlyTelemetry[]> {
  const res = await fetch(`${API_BASE_URL}/analytics/hourly`);
  if (!res.ok) throw new Error("Failed to fetch hourly telemetry");
  const data = await res.json();
  return data.map(toFrontendHourly);
}

export async function fetchDailyAnalytics(): Promise<DailyTelemetry[]> {
  const res = await fetch(`${API_BASE_URL}/analytics/daily`);
  if (!res.ok) throw new Error("Failed to fetch daily telemetry");
  const data = await res.json();
  return data.map(toFrontendDaily);
}

export async function fetchMonthlyAnalytics(): Promise<MonthlyTelemetry[]> {
  const res = await fetch(`${API_BASE_URL}/analytics/monthly`);
  if (!res.ok) throw new Error("Failed to fetch monthly telemetry");
  const data = await res.json();
  return data.map(toFrontendMonthly);
}

// 4. Billing
export async function estimateBillApi(
  kwhUnits: number,
  fixedChargeInr = 120.0,
  taxPct = 5.0
) {
  const res = await fetch(`${API_BASE_URL}/billing/estimate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      kwh_units: kwhUnits,
      fixed_charge_inr: fixedChargeInr,
      tax_pct: taxPct,
    }),
  });
  if (!res.ok) throw new Error("Failed to calculate bill estimate");
  return res.json();
}

// 5. Goals
export async function fetchGoals(): Promise<Goal[]> {
  const res = await fetch(`${API_BASE_URL}/goals`);
  if (!res.ok) throw new Error("Failed to fetch goals");
  const data = await res.json();
  return data.map(toFrontendGoal);
}

export async function createGoalApi(goal: {
  title: string;
  targetKwh: number;
  targetBillInr: number;
  targetMonth: string;
}): Promise<Goal> {
  const res = await fetch(`${API_BASE_URL}/goals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: goal.title,
      target_kwh: goal.targetKwh,
      target_bill_inr: goal.targetBillInr,
      target_month: goal.targetMonth,
    }),
  });
  if (!res.ok) throw new Error("Failed to create goal");
  const data = await res.json();
  return toFrontendGoal(data);
}

// 6. Alerts
export async function fetchAlerts(): Promise<AlertNotification[]> {
  const res = await fetch(`${API_BASE_URL}/alerts`);
  if (!res.ok) throw new Error("Failed to fetch alerts");
  return res.json();
}

export async function markAlertReadApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/alerts/${id}/read`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to mark alert as read");
}

export async function markAllAlertsReadApi(): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/alerts/mark-all-read`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to mark all alerts as read");
}

export async function deleteAlertApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/alerts/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to dismiss alert");
}

// 7. AI Chat
export async function sendAIChatApi(query: string) {
  const res = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error("Failed to query AI assistant");
  return res.json();
}

// 8. PDF Download URL
export const REPORT_DOWNLOAD_URL = `${API_BASE_URL}/reports/download`;
