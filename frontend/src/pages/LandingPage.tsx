import React, { useState, useMemo } from "react";
import {
  Zap,
  ShieldCheck,
  TrendingDown,
  Leaf,
  Sparkles,
  FileText,
  AlertTriangle,
  ArrowRight,
  Sliders,
  CheckCircle2,
  ChevronDown,
  Activity,
  Layers,
  ThermometerSnowflake,
  Flame,
  Wind,
  Refrigerator,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  Download,
  BarChart3,
  Tv,
  Check,
  Info,
  Clock,
  Compass,
} from "lucide-react";
import { PageId } from "../types";
import { computeWattWiseImpact } from "../utils/calculatorLogic";

interface LandingPageProps {
  onNavigate: (page: PageId) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  // Hero Interactive Preview State (Normal vs High Consumption)
  const [heroMode, setHeroMode] = useState<"normal" | "high">("normal");

  // Calculator State
  const [calcMode, setCalcMode] = useState<"units" | "bill">("units");
  const [calcUnits, setCalcUnits] = useState<number>(420);
  const [calcBill, setCalcBill] = useState<number>(3200);

  // FAQ Accordion State (0 is open by default)
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Mobile navigation drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live calculator impact computation
  const impact = useMemo(() => {
    return computeWattWiseImpact(
      calcMode,
      calcMode === "units" ? calcUnits : calcBill
    );
  }, [calcMode, calcUnits, calcBill]);

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#202923] font-sans selection:bg-[#183D32] selection:text-white antialiased">
      {/* ========================================================= */}
      {/* 1. CLEAN MINIMAL NAVIGATION BAR                           */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 bg-[#F7F8F5]/95 backdrop-blur-xs border-b border-[#E4E9E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#183D32] text-[#F7F8F5] flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 fill-current text-[#A6C98B]" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-[#202923] block leading-none">
                Watt Wise
              </span>
              <span className="text-[10px] text-[#737D75] font-medium tracking-wide hidden sm:block mt-0.5">
                Smarter Energy. Greener Living.
              </span>
            </div>
          </div>

          {/* Center: Clean Text Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#527C65]">
            <a href="#features" className="hover:text-[#183D32] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#183D32] transition-colors">
              How It Works
            </a>
            <a href="#calculator" className="hover:text-[#183D32] transition-colors">
              Benefits
            </a>
            <a href="#appliances" className="hover:text-[#183D32] transition-colors">
              Appliances
            </a>
            <a href="#sustainability" className="hover:text-[#183D32] transition-colors">
              Sustainability
            </a>
            <a href="#faq" className="hover:text-[#183D32] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("dashboard")}
              className="px-4 py-2 rounded-lg bg-[#183D32] hover:bg-[#122c24] text-white text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A6C98B]" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#202923] hover:bg-[#E8EFE8] transition-colors"
              aria-label="Toggle navigation menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className="w-full h-0.5 bg-[#202923]"></span>
                <span className="w-full h-0.5 bg-[#202923]"></span>
                <span className="w-full h-0.5 bg-[#202923]"></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E4E9E3] bg-[#F7F8F5] px-4 py-4 space-y-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-semibold text-[#527C65] hover:text-[#183D32] py-1"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-semibold text-[#527C65] hover:text-[#183D32] py-1"
            >
              How It Works
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-semibold text-[#527C65] hover:text-[#183D32] py-1"
            >
              Benefits
            </a>
            <a
              href="#appliances"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-semibold text-[#527C65] hover:text-[#183D32] py-1"
            >
              Appliances
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs font-semibold text-[#527C65] hover:text-[#183D32] py-1"
            >
              FAQ
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate("dashboard");
              }}
              className="w-full py-2.5 rounded-lg bg-[#183D32] text-white text-xs font-semibold text-center block mt-2"
            >
              Launch Dashboard
            </button>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* 2. RESTRAINED TWO-COLUMN HERO SECTION                     */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-24 border-b border-[#E4E9E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left 7 Columns: Headlines, Description & Value Props */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[11px] font-bold text-[#527C65] uppercase tracking-wider block">
                Smart Energy Management for Modern Homes
              </span>

              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#202923] leading-[1.15]">
                Understand Your Energy. <br className="hidden sm:inline" />
                <span className="text-[#183D32]">Take Control of Your Bills.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#737D75] leading-relaxed max-w-xl font-normal">
                Monitor household electricity consumption, identify energy wastage, estimate your electricity bills, and reduce your carbon footprint with intelligent insights from Watt Wise.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate("dashboard")}
                  className="px-5 py-3 rounded-lg bg-[#183D32] hover:bg-[#122c24] text-white text-xs font-semibold tracking-wide transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#A6C98B]" />
                </button>

                <a
                  href="#how-it-works"
                  className="px-5 py-3 rounded-lg bg-white hover:bg-[#E8EFE8] text-[#202923] border border-[#E4E9E3] text-xs font-semibold transition-all inline-flex items-center gap-2"
                >
                  <span>Discover How It Works</span>
                </a>
              </div>

              {/* 3 Compact Value Propositions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#E4E9E3]">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#E8EFE8] text-[#183D32] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#183D32]" />
                  </div>
                  <span className="text-xs font-semibold text-[#202923]">
                    Intelligent Energy Insights
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#E8EFE8] text-[#183D32] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#183D32]" />
                  </div>
                  <span className="text-xs font-semibold text-[#202923]">
                    Bill Estimation in ₹
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#E8EFE8] text-[#183D32] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#183D32]" />
                  </div>
                  <span className="text-xs font-semibold text-[#202923]">
                    Scope 2 Carbon Tracking
                  </span>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Realistic Product Dashboard Preview */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-white border border-[#E4E9E3] shadow-xs space-y-5">
                {/* Header & Demonstration Mode Switcher */}
                <div className="flex items-center justify-between pb-3 border-b border-[#E4E9E3]">
                  <div>
                    <span className="text-xs font-bold text-[#202923] block">
                      Household Telemetry
                    </span>
                    <span className="text-[10px] text-[#737D75]">
                      Simulated demonstration telemetry
                    </span>
                  </div>

                  <div className="flex items-center bg-[#F7F8F5] p-0.5 rounded-lg border border-[#E4E9E3] text-[11px] font-medium">
                    <button
                      onClick={() => setHeroMode("normal")}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        heroMode === "normal"
                          ? "bg-white text-[#183D32] font-semibold shadow-xs"
                          : "text-[#737D75] hover:text-[#202923]"
                      }`}
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => setHeroMode("high")}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        heroMode === "high"
                          ? "bg-white text-[#183D32] font-semibold shadow-xs"
                          : "text-[#737D75] hover:text-[#202923]"
                      }`}
                    >
                      High Draw
                    </button>
                  </div>
                </div>

                {/* 3 Metrics Row */}
                <div className="grid grid-cols-3 gap-3 text-left">
                  <div className="p-3 rounded-lg bg-[#F7F8F5] border border-[#E4E9E3]">
                    <span className="text-[10px] font-medium text-[#737D75] block uppercase">
                      Current Power
                    </span>
                    <span className="text-base font-bold text-[#202923] font-mono mt-0.5 block">
                      {heroMode === "normal" ? "1.42 kW" : "3.68 kW"}
                    </span>
                    <span className="text-[10px] text-[#527C65] block mt-0.5">
                      {heroMode === "normal" ? "Steady load" : "High appliance load"}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F7F8F5] border border-[#E4E9E3]">
                    <span className="text-[10px] font-medium text-[#737D75] block uppercase">
                      Monthly Bill
                    </span>
                    <span className="text-base font-bold text-[#202923] font-mono mt-0.5 block">
                      {heroMode === "normal" ? "₹2,840" : "₹3,920"}
                    </span>
                    <span className="text-[10px] text-[#737D75] block mt-0.5">
                      {heroMode === "normal" ? "Slab tier 2" : "Approaching tier 4"}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F7F8F5] border border-[#E4E9E3]">
                    <span className="text-[10px] font-medium text-[#737D75] block uppercase">
                      Emissions
                    </span>
                    <span className="text-base font-bold text-[#202923] font-mono mt-0.5 block">
                      {heroMode === "normal" ? "236 kg" : "388 kg"}
                    </span>
                    <span className="text-[10px] text-[#737D75] block mt-0.5">
                      CO₂e (CEA factor)
                    </span>
                  </div>
                </div>

                {/* Small Consumption Trend Chart (Clean SVG Line) */}
                <div className="p-3.5 rounded-lg bg-[#F7F8F5] border border-[#E4E9E3] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#202923]">
                      7-Day Daily Consumption Trend
                    </span>
                    <span className="text-[11px] text-[#527C65] font-mono font-medium">
                      {heroMode === "normal" ? "Avg: 14.1 kWh/day" : "Avg: 22.4 kWh/day"}
                    </span>
                  </div>
                  <div className="h-12 w-full flex items-end justify-between gap-1 pt-2">
                    {[
                      { day: "M", h: heroMode === "normal" ? 40 : 60 },
                      { day: "T", h: heroMode === "normal" ? 45 : 75 },
                      { day: "W", h: heroMode === "normal" ? 38 : 55 },
                      { day: "T", h: heroMode === "normal" ? 50 : 85 },
                      { day: "F", h: heroMode === "normal" ? 42 : 70 },
                      { day: "S", h: heroMode === "normal" ? 65 : 95 },
                      { day: "S", h: heroMode === "normal" ? 58 : 90 },
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className={`w-full rounded-xs transition-all duration-300 ${
                            heroMode === "normal" ? "bg-[#527C65]" : "bg-[#183D32]"
                          }`}
                          style={{ height: `${bar.h}%` }}
                        ></div>
                        <span className="text-[9px] text-[#737D75]">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Appliance Breakdown Preview */}
                <div className="space-y-2 text-xs">
                  <span className="text-[10px] font-semibold text-[#737D75] uppercase tracking-wider block">
                    Appliance Consumption Share
                  </span>
                  <div className="space-y-1.5">
                    <div>
                      <div className="flex justify-between text-[11px] text-[#202923] mb-0.5">
                        <span>1.5 Ton Split AC</span>
                        <span className="font-mono font-medium">44%</span>
                      </div>
                      <div className="w-full h-1 bg-[#E4E9E3] rounded-full overflow-hidden">
                        <div className="h-full bg-[#183D32] rounded-full" style={{ width: "44%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-[#202923] mb-0.5">
                        <span>Storage Water Geyser</span>
                        <span className="font-mono font-medium">
                          {heroMode === "normal" ? "22%" : "35% (Extended draw)"}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-[#E4E9E3] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#527C65] rounded-full transition-all"
                          style={{ width: heroMode === "normal" ? "22%" : "35%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-[#202923] mb-0.5">
                        <span>Double Door Refrigerator</span>
                        <span className="font-mono font-medium">16%</span>
                      </div>
                      <div className="w-full h-1 bg-[#E4E9E3] rounded-full overflow-hidden">
                        <div className="h-full bg-[#A6C98B] rounded-full" style={{ width: "16%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. PROBLEM SECTION (4-GRID)                               */}
      {/* ========================================================= */}
      <section className="py-20 border-b border-[#E4E9E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-bold text-[#527C65] uppercase tracking-wider block">
              The Problem
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#202923]">
              Your Electricity Bill Is Only Part of the Story.
            </h2>
            <p className="text-sm text-[#737D75] leading-relaxed">
              Without proper visibility, understanding household energy consumption can be difficult. Traditional monthly utility bills only report cumulative costs long after the power has been consumed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-white border border-[#E4E9E3] shadow-xs space-y-3">
              <span className="text-xs font-mono font-bold text-[#527C65]">01</span>
              <h3 className="text-base font-bold text-[#202923]">
                Hidden Energy Consumption
              </h3>
              <p className="text-xs text-[#737D75] leading-relaxed">
                Identify unnecessary electricity consumption from appliances and standby loads running unnoticed in the background.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E4E9E3] shadow-xs space-y-3">
              <span className="text-xs font-mono font-bold text-[#527C65]">02</span>
              <h3 className="text-base font-bold text-[#202923]">
                Unexpected Electricity Bills
              </h3>
              <p className="text-xs text-[#737D75] leading-relaxed">
                Understand how increasing consumption pushes your household units across higher state slab tariff thresholds.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E4E9E3] shadow-xs space-y-3">
              <span className="text-xs font-mono font-bold text-[#527C65]">03</span>
              <h3 className="text-base font-bold text-[#202923]">
                Appliance Overuse
              </h3>
              <p className="text-xs text-[#737D75] leading-relaxed">
                Identify heavy-draw climate and heating appliances that contribute significantly to monthly household energy draw.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E4E9E3] shadow-xs space-y-3">
              <span className="text-xs font-mono font-bold text-[#527C65]">04</span>
              <h3 className="text-base font-bold text-[#202923]">
                Limited Energy Visibility
              </h3>
              <p className="text-xs text-[#737D75] leading-relaxed">
                Understand exactly where electricity goes room by room instead of relying only on a single aggregate monthly meter invoice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. INTRODUCING WATT WISE (WIDE SAAS PRESENTATION)         */}
      {/* ========================================================= */}
      <section className="py-20 bg-white border-b border-[#E4E9E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <span className="text-[11px] font-bold text-[#527C65] uppercase tracking-wider block">
              Introducing Watt Wise
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#202923]">
              A Smarter Way to Understand Your Home's Energy.
            </h2>
            <p className="text-sm text-[#737D75] leading-relaxed">
              Watt Wise brings household electricity data, intelligent analytics, and practical recommendations together in one unified, hardware-free platform.
            </p>
          </div>

          {/* Panoramic SaaS Interface Showcase */}
          <div className="rounded-2xl border border-[#E4E9E3] bg-[#F7F8F5] p-6 sm:p-10 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#E4E9E3] gap-4">
              <div>
                <h3 className="text-lg font-bold text-[#202923]">
                  Integrated Household Energy Management
                </h3>
                <p className="text-xs text-[#737D75]">
                  Full-stack analytics calibrated to Indian domestic tariff rates and Scope 2 CEA baselines.
                </p>
              </div>

              <button
                onClick={() => onNavigate("dashboard")}
                className="px-4 py-2 rounded-lg bg-[#183D32] hover:bg-[#122c24] text-white text-xs font-semibold tracking-wide transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Launch Live App</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#A6C98B]" />
              </button>
            </div>

            {/* 4 Dashboard Panels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-white border border-[#E4E9E3] space-y-1">
                <span className="text-[11px] font-medium text-[#737D75] block uppercase">Monthly Consumption</span>
                <span className="text-2xl font-bold text-[#202923] font-mono">473 kWh</span>
                <span className="text-[11px] text-[#527C65] block">8.4% below regional baseline</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E4E9E3] space-y-1">
                <span className="text-[11px] font-medium text-[#737D75] block uppercase">Estimated Bill</span>
                <span className="text-2xl font-bold text-[#202923] font-mono">₹2,934</span>
                <span className="text-[11px] text-[#737D75] block">Tier 2 slab active (CESC)</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E4E9E3] space-y-1">
                <span className="text-[11px] font-medium text-[#737D75] block uppercase">Carbon Footprint</span>
                <span className="text-2xl font-bold text-[#202923] font-mono">388 kg CO₂</span>
                <span className="text-[11px] text-[#737D75] block">0.82 kg/kWh CEA standard</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E4E9E3] space-y-1">
                <span className="text-[11px] font-medium text-[#737D75] block uppercase">Active Goal Progress</span>
                <span className="text-2xl font-bold text-[#527C65] font-mono">94.6%</span>
                <span className="text-[11px] text-[#527C65] block">Target: &lt; 500 kWh/month</span>
              </div>
            </div>

            {/* Recommendations Preview Card */}
            <div className="p-5 rounded-xl bg-white border border-[#E4E9E3] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E8EFE8] text-[#183D32] flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-[#183D32]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#202923] block">
                    Grounded AI Energy Recommendation
                  </span>
                  <p className="text-xs text-[#737D75] leading-relaxed mt-0.5">
                    "Raising your 1.5 Ton AC setpoint from 22°C to 24°C reduces compressor power draw by approximately 12%, saving ₹195/month and keeping your bill within tier-2 slab rates."
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate("ai-assistant")}
                className="px-3.5 py-1.5 rounded-lg bg-[#E8EFE8] hover:bg-[#d8e3d8] text-[#183D32] text-xs font-semibold transition-all shrink-0 cursor-pointer"
              >
                Ask Assistant
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. CORE FEATURES (6 CAPABILITIES)                         */}
      {/* ========================================================= */}
      <section id="features" className="py-20 border-b border-[#E4E9E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-bold text-[#527C65] uppercase tracking-wider block">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#202923]">
              Everything You Need. All in One Place.
            </h2>
            <p className="text-sm text-[#737D75] leading-relaxed">
              Engineered specifically for Indian domestic households, from appliance management to ReportLab PDF audit exports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 01 */}
            <div className="p-6 rounded-xl bg-white border border-[#E4E9E3] shadow-xs space-y-3">
              <span className="text-xs font-mono font-bold text-[#527C65]">01</span>
              <h3 className="text-base font-bold text-[#202923]">
                Smart Energy Dashboard
              </h3>
              <p className="text-xs text-[#737D75] leading-relaxed">
                Get a clear overview of electricity consumption, estimated expenses, carbon emissions, and energy-saving progress in a centralized, responsive interface.
              </p>
            </div>

            {/* Feature 02 */}
            <div className="p-6 rounded-xl bg-white border border-[#E4E9E3] shadow-xs space-y-3">
              <span className="text-xs font-mono font-bold text-[#527C65]">02</span>
              <h3 className="text-base font-bold text-[#202923]">
                Appliance Management
              </h3>
              <p className="text-xs text-[#737D75] leading-relaxed">
                Add and manage household appliances to understand their individual electricity consumption, rated wattage, and daily operating hours with real-time calculations.
              </p>
            </div>

            {/* Feature 03 */}
            <div className="p-6 rounded-xl bg-white border border-[#E4E9E3] shadow-xs space-y-3">
              <span className="text-xs font-mono font-bold text-[#527C65]">03</span>
              <h3 className="text-base font-bold text-[#202923]">
                Energy Analytics
              </h3>
              <p className="text-xs text-[#737D75] leading-relaxed">
                Explore 24-hour diurnal load curves, 7-day daily trends, and historical monthly comparisons to spot peak draw windows and optimize device schedules.
              </p>
            </div>

            {/* Feature 04 */}
            <div className="p-6 rounded-xl bg-white border border-[#E4E9E3] shadow-xs space-y-3">
              <span className="text-xs font-mono font-bold text-[#527C65]">04</span>
              <h3 className="text-base font-bold text-[#202923]">
                AI Energy Assistant
              </h3>
              <p className="text-xs text-[#737D75] leading-relaxed">
                Ask natural questions about your usage and receive recommendations strictly grounded in your database inventory—without fictitious readings.
              </p>
            </div>

            {/* Feature 05 */}
            <div className="p-6 rounded-xl bg-white border border-[#E4E9E3] shadow-xs space-y-3">
              <span className="text-xs font-mono font-bold text-[#527C65]">05</span>
              <h3 className="text-base font-bold text-[#202923]">
                Carbon Footprint Tracker
              </h3>
              <p className="text-xs text-[#737D75] leading-relaxed">
                Understand your electricity-related Scope 2 carbon emissions calculated using the official Central Electricity Authority (CEA) India baseline factor.
              </p>
            </div>

            {/* Feature 06 */}
            <div className="p-6 rounded-xl bg-white border border-[#E4E9E3] shadow-xs space-y-3">
              <span className="text-xs font-mono font-bold text-[#527C65]">06</span>
              <h3 className="text-base font-bold text-[#202923]">
                Electricity Bill Estimator
              </h3>
              <p className="text-xs text-[#737D75] leading-relaxed">
                Estimate monthly electricity expenses using tiered slab tariffs, fixed charges, and duty calculations in Indian Rupees (₹).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. INTERACTIVE SAVINGS CALCULATOR                         */}
      {/* ========================================================= */}
      <section id="calculator" className="py-20 bg-white border-b border-[#E4E9E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-bold text-[#527C65] uppercase tracking-wider block">
              Interactive Estimator
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#202923]">
              Small Changes. Meaningful Savings.
            </h2>
            <p className="text-sm text-[#737D75] leading-relaxed">
              Explore how better household energy habits could reduce electricity consumption, prevent tier jumps, and lower expenses.
            </p>
          </div>

          <div className="p-6 sm:p-10 rounded-2xl bg-[#F7F8F5] border border-[#E4E9E3] shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Inputs Column */}
              <div className="lg:col-span-7 space-y-6">
                {/* Mode Selector */}
                <div className="flex items-center justify-between pb-4 border-b border-[#E4E9E3]">
                  <span className="text-xs font-semibold text-[#202923]">
                    Calculation Input:
                  </span>
                  <div className="flex items-center bg-white p-1 rounded-lg border border-[#E4E9E3] text-xs font-semibold">
                    <button
                      onClick={() => setCalcMode("units")}
                      className={`px-3 py-1 rounded-md transition-all ${
                        calcMode === "units"
                          ? "bg-[#183D32] text-white shadow-xs"
                          : "text-[#737D75] hover:text-[#202923]"
                      }`}
                    >
                      By Units (kWh)
                    </button>
                    <button
                      onClick={() => setCalcMode("bill")}
                      className={`px-3 py-1 rounded-md transition-all ${
                        calcMode === "bill"
                          ? "bg-[#183D32] text-white shadow-xs"
                          : "text-[#737D75] hover:text-[#202923]"
                      }`}
                    >
                      By Monthly Bill (₹)
                    </button>
                  </div>
                </div>

                {/* Slider */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#527C65]">
                      {calcMode === "units" ? "Monthly Units Consumed:" : "Current Monthly Bill:"}
                    </label>
                    <span className="text-2xl font-bold text-[#202923] font-mono">
                      {calcMode === "units"
                        ? `${calcUnits} kWh`
                        : `₹${calcBill.toLocaleString("en-IN")}`}
                    </span>
                  </div>

                  {calcMode === "units" ? (
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      step="10"
                      value={calcUnits}
                      onChange={(e) => setCalcUnits(Number(e.target.value))}
                      className="w-full h-2 bg-[#E4E9E3] rounded-lg appearance-none cursor-pointer accent-[#183D32]"
                    />
                  ) : (
                    <input
                      type="range"
                      min="1000"
                      max="10000"
                      step="100"
                      value={calcBill}
                      onChange={(e) => setCalcBill(Number(e.target.value))}
                      className="w-full h-2 bg-[#E4E9E3] rounded-lg appearance-none cursor-pointer accent-[#183D32]"
                    />
                  )}

                  <div className="flex justify-between text-[11px] text-[#737D75]">
                    <span>{calcMode === "units" ? "100 kWh" : "₹1,000"}</span>
                    <span>{calcMode === "units" ? "500 kWh" : "₹5,000"}</span>
                    <span>{calcMode === "units" ? "1000 kWh" : "₹10,000"}</span>
                  </div>
                </div>

                {/* Household Presets */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-semibold text-[#737D75] block">
                    Household Presets:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "1 BHK", units: 180, bill: 1400 },
                      { label: "2 BHK", units: 320, bill: 2500 },
                      { label: "3 BHK + AC", units: 520, bill: 4200 },
                      { label: "Independent Villa", units: 820, bill: 7100 },
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCalcUnits(p.units);
                          setCalcBill(p.bill);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#E8EFE8] border border-[#E4E9E3] text-xs font-semibold text-[#202923] transition-all cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-white border border-[#E4E9E3] text-xs text-[#737D75]">
                  <span className="font-semibold text-[#202923] block mb-0.5">
                    Tariff Tier: {impact.currentSlab}
                  </span>
                  <span>
                    Simulated using progressive domestic slab rates (0–100 @ ₹3.50, 101–300 @ ₹5.50, 301–500 @ ₹7.50, &gt;500 @ ₹9.00) plus fixed charges.
                  </span>
                </div>
              </div>

              {/* Results Panel */}
              <div className="lg:col-span-5 p-6 rounded-xl bg-white border border-[#E4E9E3] space-y-4 shadow-xs">
                <div>
                  <span className="text-[11px] font-medium text-[#737D75] uppercase block">
                    Potential Monthly Savings
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-bold text-[#183D32] font-mono">
                      ₹{impact.monthlySavingsInr.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-[#737D75]">/ month</span>
                  </div>
                  <span className="text-xs text-[#527C65] font-semibold block mt-1">
                    ≈ ₹{impact.annualSavingsInr.toLocaleString("en-IN")} estimated annual savings
                  </span>
                </div>

                <div className="pt-4 border-t border-[#E4E9E3] space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#737D75]">Optimized Monthly Draw:</span>
                    <span className="font-semibold text-[#202923] font-mono">
                      {impact.optimizedUnits} kWh (-{impact.savedUnitsMonthly} kWh)
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#737D75]">Annual CO₂ Emissions Reduced:</span>
                    <span className="font-semibold text-[#527C65] font-mono">
                      {impact.annualCo2SavedKg.toLocaleString("en-IN")} kg CO₂e
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#737D75]">Environmental Equivalent:</span>
                    <span className="font-semibold text-[#202923]">
                      ≈ {impact.treesPlantedEquivalent} Mature Trees
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate("dashboard")}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#183D32] hover:bg-[#122c24] text-white text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                >
                  <span>Apply in Watt Wise Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#A6C98B]" />
                </button>

                <p className="text-[10px] text-[#737D75] text-center italic">
                  *Savings are illustrative estimates based on CEA India baselines, not guaranteed results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. HOW IT WORKS (3 STEPS)                                 */}
      {/* ========================================================= */}
      <section id="how-it-works" className="py-20 border-b border-[#E4E9E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-bold text-[#527C65] uppercase tracking-wider block">
              Onboarding Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#202923]">
              Getting Started Is Simple.
            </h2>
            <p className="text-sm text-[#737D75] leading-relaxed">
              No electricians, physical smart plugs, or complex hardware installations required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-white border border-[#E4E9E3] shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#E8EFE8] text-[#183D32] flex items-center justify-center font-bold text-xs">
                01
              </div>
              <h3 className="text-base font-bold text-[#202923]">
                Add Your Appliances
              </h3>
              <p className="text-xs text-[#737D75] leading-relaxed">
                Enter your household appliances, their rated wattage, quantities, and daily operating hours using simple presets.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E4E9E3] shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#E8EFE8] text-[#183D32] flex items-center justify-center font-bold text-xs">
                02
              </div>
              <h3 className="text-base font-bold text-[#202923]">
                Understand Your Usage
              </h3>
              <p className="text-xs text-[#737D75] leading-relaxed">
                Explore consumption patterns, appliance breakdowns, estimated electricity bills in ₹, and carbon emissions.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-[#E4E9E3] shadow-xs space-y-3">
              <div className="w-8 h-8 rounded-lg bg-[#E8EFE8] text-[#183D32] flex items-center justify-center font-bold text-xs">
                03
              </div>
              <h3 className="text-base font-bold text-[#202923]">
                Make Smarter Decisions
              </h3>
              <p className="text-xs text-[#737D75] leading-relaxed">
                Follow practical AI recommendations, identify potential wastage, prevent slab jumps, and track energy-saving goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. HOUSEHOLD APPLIANCE SHOWCASE                           */}
      {/* ========================================================= */}
      <section id="appliances" className="py-20 bg-white border-b border-[#E4E9E3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-bold text-[#527C65] uppercase tracking-wider block">
              Device Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#202923]">
              Designed Around Your Everyday Energy Needs.
            </h2>
            <p className="text-sm text-[#737D75] leading-relaxed">
              Understand power consumption across five familiar Indian household appliances.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {/* Air Conditioner */}
            <div className="p-5 rounded-xl bg-[#F7F8F5] border border-[#E4E9E3] space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-white text-[#183D32] flex items-center justify-center border border-[#E4E9E3] mb-3">
                  <ThermometerSnowflake className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#202923]">Air Conditioner</h3>
                <span className="text-[11px] font-medium text-[#527C65] block font-mono">1,200 – 1,600 W</span>
                <p className="text-xs text-[#737D75] mt-2 leading-relaxed">
                  Typical usage: 6–8 hours daily during warm months.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E4E9E3] text-[11px] text-[#202923]">
                <strong className="block text-[#183D32]">Energy-saving tip:</strong>
                Setting temperature to 24°C saves ~12% vs 20°C.
              </div>
            </div>

            {/* Refrigerator */}
            <div className="p-5 rounded-xl bg-[#F7F8F5] border border-[#E4E9E3] space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-white text-[#183D32] flex items-center justify-center border border-[#E4E9E3] mb-3">
                  <Refrigerator className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#202923]">Refrigerator</h3>
                <span className="text-[11px] font-medium text-[#527C65] block font-mono">150 – 250 W</span>
                <p className="text-xs text-[#737D75] mt-2 leading-relaxed">
                  Continuous operation with ~8 hours compressor run time.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E4E9E3] text-[11px] text-[#202923]">
                <strong className="block text-[#183D32]">Energy-saving tip:</strong>
                Ensuring clean door seals avoids continuous cycling.
              </div>
            </div>

            {/* Ceiling Fan */}
            <div className="p-5 rounded-xl bg-[#F7F8F5] border border-[#E4E9E3] space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-white text-[#183D32] flex items-center justify-center border border-[#E4E9E3] mb-3">
                  <Wind className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#202923]">Ceiling Fan</h3>
                <span className="text-[11px] font-medium text-[#527C65] block font-mono">28 – 75 W</span>
                <p className="text-xs text-[#737D75] mt-2 leading-relaxed">
                  Operated 12–16 hours daily across living spaces.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E4E9E3] text-[11px] text-[#202923]">
                <strong className="block text-[#183D32]">Energy-saving tip:</strong>
                BLDC motor fans consume 60% less than induction models.
              </div>
            </div>

            {/* Water Geyser */}
            <div className="p-5 rounded-xl bg-[#F7F8F5] border border-[#E4E9E3] space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-white text-[#183D32] flex items-center justify-center border border-[#E4E9E3] mb-3">
                  <Flame className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#202923]">Water Geyser</h3>
                <span className="text-[11px] font-medium text-[#527C65] block font-mono">2,000 W</span>
                <p className="text-xs text-[#737D75] mt-2 leading-relaxed">
                  High-draw heating operated 1–2 hours in mornings.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E4E9E3] text-[11px] text-[#202923]">
                <strong className="block text-[#183D32]">Energy-saving tip:</strong>
                Limiting cycle to 40 mins prevents unnecessary power draw.
              </div>
            </div>

            {/* LED Lighting */}
            <div className="p-5 rounded-xl bg-[#F7F8F5] border border-[#E4E9E3] space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-lg bg-white text-[#183D32] flex items-center justify-center border border-[#E4E9E3] mb-3">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#202923]">LED Lighting</h3>
                <span className="text-[11px] font-medium text-[#527C65] block font-mono">9 – 18 W</span>
                <p className="text-xs text-[#737D75] mt-2 leading-relaxed">
                  Operated 6–8 hours daily during evening hours.
                </p>
              </div>
              <div className="pt-3 border-t border-[#E4E9E3] text-[11px] text-[#202923]">
                <strong className="block text-[#183D32]">Energy-saving tip:</strong>
                Replacing older CFLs saves ~85% on lighting energy.
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#737D75] text-center italic">
            *Actual appliance wattages and runtime behaviors vary by model, star rating, and manufacturer.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. CONTRAST DARK-GREEN SUSTAINABILITY SECTION             */}
      {/* ========================================================= */}
      <section id="sustainability" className="py-24 bg-[#183D32] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-bold text-[#A6C98B] uppercase tracking-wider block">
              Environmental Responsibility
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Better Energy Habits. A Lighter Carbon Footprint.
            </h2>
            <p className="text-sm text-[#A6C98B] leading-relaxed">
              Understanding electricity consumption is the first step towards reducing its environmental impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#122c24] border border-[#527C65]/30 space-y-2">
              <span className="text-[11px] text-[#A6C98B] font-medium uppercase block">
                Electricity Saved
              </span>
              <span className="text-3xl font-bold text-white font-mono block">
                ~64 kWh
              </span>
              <p className="text-xs text-[#E8EFE8]/80 leading-relaxed">
                Average monthly conservation achieved by households addressing geyser and AC overruns.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#122c24] border border-[#527C65]/30 space-y-2">
              <span className="text-[11px] text-[#A6C98B] font-medium uppercase block">
                Emissions Avoided
              </span>
              <span className="text-3xl font-bold text-white font-mono block">
                ~52.5 kg CO₂e
              </span>
              <p className="text-xs text-[#E8EFE8]/80 leading-relaxed">
                Computed using the Central Electricity Authority (CEA) India baseline factor of 0.82 kg CO₂/kWh.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#122c24] border border-[#527C65]/30 space-y-2">
              <span className="text-[11px] text-[#A6C98B] font-medium uppercase block">
                Environmental Equivalent
              </span>
              <span className="text-3xl font-bold text-white font-mono block">
                ≈ 2.4 Trees
              </span>
              <p className="text-xs text-[#E8EFE8]/80 leading-relaxed">
                Equivalent monthly urban carbon sequestration based on an annual 21.8 kg CO₂ absorption standard per tree.
              </p>
            </div>
          </div>

          <p className="text-[10px] text-[#A6C98B]/70 italic">
            *Environmental equivalencies are illustrative representations calculated via CEA India national grid baselines, not exact laboratory measurements.
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 10. FREQUENTLY ASKED QUESTIONS (6-ACCORDION)              */}
      {/* ========================================================= */}
      <section id="faq" className="py-20 border-b border-[#E4E9E3]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-left space-y-3">
            <span className="text-[11px] font-bold text-[#527C65] uppercase tracking-wider block">
              Information
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#202923]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "What is Watt Wise?",
                a: "Watt Wise is a modern web application designed to help domestic Indian households monitor electricity consumption, identify power wastage, estimate monthly electricity bills using slab rates, track Scope 2 carbon emissions, and receive actionable conservation advice.",
              },
              {
                q: "How does Watt Wise work without physical smart-meter hardware?",
                a: "Watt Wise uses a Python-based virtual telemetry simulation engine. By combining your registered appliance ratings (wattage, quantities, and operating hours) with realistic Indian residential usage curves, it reconstructs hourly and daily telemetry without requiring expensive IoT smart plugs.",
              },
              {
                q: "How accurate are the electricity bill estimates?",
                a: "Bill calculations are calibrated to authentic progressive domestic slab tariffs in Indian Rupees (₹) with tiered unit rates, standard fixed meter charges (₹120), and 5% electricity duty. Estimates provide high-fidelity financial projections for domestic households.",
              },
              {
                q: "How does the AI Energy Assistant work?",
                a: "The AI assistant is powered by Google Gemini and is strictly grounded in your database inventory and telemetry totals. It is prompt-constrained to answer questions using only your actual registered appliances and verifiable numbers, avoiding hallucinated readings.",
              },
              {
                q: "How is the carbon footprint calculated?",
                a: "Carbon emissions are calculated using the formula: CO₂ (kg) = Electricity (kWh) × Grid Emission Factor. Watt Wise uses the official Central Electricity Authority (CEA) India baseline factor of 0.82 kg CO₂/kWh.",
              },
              {
                q: "Can I add my own household appliances?",
                a: "Yes. In the 'My Appliances' section, you can add any custom device with its specific name, category, rated wattage, and daily operating hours, or choose from pre-calibrated Indian household presets.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white border border-[#E4E9E3] shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F7F8F5] transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-[#202923]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#737D75] shrink-0 transition-transform ${
                      openFaq === idx ? "rotate-180 text-[#183D32]" : ""
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-[#737D75] leading-relaxed border-t border-[#E4E9E3] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 11. RESTRAINED FINAL CTA SECTION                          */}
      {/* ========================================================= */}
      <section className="py-20 bg-[#F7F8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-14 rounded-2xl bg-[#183D32] text-white text-center space-y-6 shadow-xs">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white max-w-xl mx-auto">
              Make Your Home Energy Smarter.
            </h2>

            <p className="text-xs sm:text-sm text-[#A6C98B] max-w-lg mx-auto leading-relaxed">
              Start understanding your electricity usage and take control of your household energy consumption.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onNavigate("dashboard")}
                className="px-6 py-3 rounded-lg bg-white hover:bg-[#E8EFE8] text-[#183D32] font-semibold text-xs tracking-wide transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#183D32]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 12. CLEAN SAAS FOOTER                                     */}
      {/* ========================================================= */}
      <footer className="border-t border-[#E4E9E3] bg-white pt-16 pb-12 text-[#202923]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#E4E9E3]">
            {/* Col 1: Brand & Tagline */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md bg-[#183D32] text-white flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-[#A6C98B]" />
                </div>
                <span className="font-bold text-base text-[#202923]">Watt Wise</span>
              </div>
              <p className="text-xs text-[#737D75] leading-relaxed">
                Smarter Energy. Greener Living. An AI-based smart home energy management and carbon footprint reduction system.
              </p>
            </div>

            {/* Col 2: Platform Navigation */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#202923] block mb-3 uppercase tracking-wider text-[11px]">
                Platform Navigation
              </span>
              <button onClick={() => onNavigate("dashboard")} className="text-[#737D75] hover:text-[#183D32] block">
                Dashboard Overview
              </button>
              <button onClick={() => onNavigate("appliances")} className="text-[#737D75] hover:text-[#183D32] block">
                Appliance Inventory
              </button>
              <button onClick={() => onNavigate("analytics")} className="text-[#737D75] hover:text-[#183D32] block">
                Energy Analytics
              </button>
              <button onClick={() => onNavigate("ai-assistant")} className="text-[#737D75] hover:text-[#183D32] block">
                AI Energy Assistant
              </button>
            </div>

            {/* Col 3: Financial & Carbon */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[#202923] block mb-3 uppercase tracking-wider text-[11px]">
                Billing & Sustainability
              </span>
              <button onClick={() => onNavigate("bill-estimator")} className="text-[#737D75] hover:text-[#183D32] block">
                Electricity Bill Estimator (₹)
              </button>
              <button onClick={() => onNavigate("carbon-tracker")} className="text-[#737D75] hover:text-[#183D32] block">
                Carbon Footprint Tracker
              </button>
              <button onClick={() => onNavigate("goals")} className="text-[#737D75] hover:text-[#183D32] block">
                Energy Saving Goals
              </button>
              <button onClick={() => onNavigate("reports")} className="text-[#737D75] hover:text-[#183D32] block">
                Download Monthly PDF
              </button>
            </div>

            {/* Col 4: CEA Emission Factor Citation */}
            <div className="p-4 rounded-xl bg-[#F7F8F5] border border-[#E4E9E3] space-y-1.5 text-xs">
              <span className="font-bold text-[#183D32] block flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-[#527C65]" />
                <span>CEA Carbon Baseline</span>
              </span>
              <p className="text-[11px] text-[#737D75] leading-relaxed">
                Scope 2 emissions use the Central Electricity Authority (CEA) India baseline factor of <strong>0.82 kg CO₂/kWh</strong> for national grid electricity accounting.
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737D75]">
            <span>© 2026 Watt Wise. Built for Indian residential households.</span>
            <div className="flex items-center gap-4 text-[#737D75]">
              <span>Domestic Tiered Tariffs (₹)</span>
              <span>•</span>
              <span>Central Electricity Authority Verified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
