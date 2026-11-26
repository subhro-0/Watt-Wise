export type PageId =
  | "landing"
  | "dashboard"
  | "appliances"
  | "analytics"
  | "ai-assistant"
  | "carbon-tracker"
  | "bill-estimator"
  | "goals"
  | "alerts"
  | "reports";

export interface Appliance {
  id: string;
  name: string;
  category: "climate" | "cooling" | "lighting" | "entertainment" | "utility" | "kitchen" | "other";
  watts: number;
  quantity: number;
  dailyHours: number;
  operatingSchedule?: string;
  monthlyKwh: number;
  monthlyCostInr: number;
  monthlyCo2Kg: number;
}

export interface HourlyTelemetry {
  hour: string;
  kwh: number;
  costInr: number;
  carbonKg: number;
}

export interface DailyTelemetry {
  date: string;
  day: string;
  kwh: number;
  costInr: number;
  carbonKg: number;
}

export interface MonthlyTelemetry {
  month: string;
  kwh: number;
  costInr: number;
  carbonKg: number;
  savedKwh: number;
}

export interface TariffSlab {
  minUnits: number;
  maxUnits: number | null; // null for above
  ratePerUnitInr: number;
}

export interface TariffConfig {
  fixedMonthlyChargesInr: number;
  slabs: TariffSlab[];
  taxPercentage: number;
}

export interface Goal {
  id: string;
  title: string;
  targetKwh: number;
  currentKwh: number;
  targetBillInr: number;
  currentBillInr: number;
  targetMonth: string;
  achieved: boolean;
}

export interface AlertNotification {
  id: string;
  type: "threshold" | "appliance" | "projection" | "achievement";
  severity: "high" | "medium" | "low" | "success";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}
