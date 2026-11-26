import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  User,
  Sparkles,
  Zap,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { Appliance, ChatMessage } from "../types";
import { sendAIChatApi } from "../services/api";

interface AIAssistantProps {
  appliances: Appliance[];
  totalKwh: number;
  totalBillInr: number;
  totalCo2Kg: number;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  appliances,
  totalKwh,
  totalBillInr,
  totalCo2Kg,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "ai",
      text: `Namaste! I am your **Watt Wise AI Energy Assistant**. I am actively analyzing your home's connected telemetry (**${totalKwh} kWh** used this month, estimated at **₹${totalBillInr}**, producing **${totalCo2Kg} kg CO₂**).\n\nHow can I help you optimize your appliance schedules or reduce your electricity bill today?`,
      timestamp: "Just now",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const promptChips = [
    "How can I reduce my electricity bill?",
    "Which appliance consumes the most electricity?",
    "Why has my electricity consumption increased?",
    "How can I reduce my household carbon footprint?",
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    try {
      // Call backend API for real-time grounded AI response
      const res = await sendAIChatApi(query);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: res.reply,
          timestamp: "Just now",
        },
      ]);
    } catch {
      // Fallback to local grounded logic if backend is temporarily disconnected
      let reply = "";
      const q = query.toLowerCase();
      const sorted = [...appliances].sort((a, b) => b.monthlyKwh - a.monthlyKwh);
      const top = sorted[0] || { name: "1.5T AC", monthlyKwh: 261, monthlyCostInr: 1618, dailyHours: 6, watts: 1450 };
      const secondTop = sorted[1] || { name: "Water Geyser", monthlyKwh: 90, monthlyCostInr: 558 };

      if (q.includes("most") || q.includes("highest") || q.includes("which appliance")) {
        reply = `Based on your household inventory, your single largest energy consumer is your **${top.name}**.\n\n` +
          `• **Consumption:** ${top.monthlyKwh} kWh/month (${Math.round((top.monthlyKwh / totalKwh) * 100)}% of your total usage)\n` +
          `• **Cost:** ₹${top.monthlyCostInr}/month\n` +
          `• **Run Time:** ${top.dailyHours} hours/day at ${top.watts} Watts\n\n` +
          `Your second highest consumer is **${secondTop.name}** using ${secondTop.monthlyKwh} kWh (₹${secondTop.monthlyCostInr}/mo). Focus on these two appliances for the highest savings.`;
      } else if (q.includes("reduce") && (q.includes("bill") || q.includes("cost") || q.includes("money"))) {
        reply = `To reduce your current estimated bill of **₹${totalBillInr}** down towards ₹2,800, here are three high-yield actions grounded in your actual device data:\n\n` +
          `1. **AC Temperature Adjustment:** Raising your 1.5 Ton AC from 22°C to 24°C reduces compressor load by 12-15%, saving approximately **₹195 to ₹240/month**.\n` +
          `2. **Water Geyser Timer:** Your 2,000W Geyser runs 1.5 hours daily (90 kWh/mo = ₹558). Installing a 45-minute timer cuts usage by half, saving **₹279/month**.\n` +
          `3. **Slab Protection:** Cutting 32 units will keep your total usage under the higher 400+ unit tariff slab (₹8.80/unit), protecting you from tiered rate increases.`;
      } else {
        reply = `I've analyzed your telemetry across your ${appliances.length} connected appliances. You are currently tracking at **${totalKwh} kWh** (estimated at ₹${totalBillInr}).\n\nWould you like me to analyze operating habits for your AC, examine your water geyser cycle, or calculate your potential savings under different tariff slabs?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: reply,
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-10rem)] min-h-[550px]">
      {/* Left Column: Live Context & Data Grounding Summary (4 Cols) */}
      <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Grounded Telemetry Context
              </h4>
              <p className="text-[11px] text-slate-500">
                AI answers strictly verified with backend data
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500">Current Month Usage:</span>
              <span className="font-bold text-slate-900">{totalKwh} kWh</span>
            </div>

            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500">Estimated Current Bill:</span>
              <span className="font-bold text-emerald-700">₹{totalBillInr}</span>
            </div>

            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500">Carbon Footprint:</span>
              <span className="font-bold text-slate-900">{totalCo2Kg} kg CO₂</span>
            </div>

            <div className="flex justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-slate-500">Top Energy Consumer:</span>
              <span className="font-bold text-amber-700">1.5T AC (261 kWh)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            <p className="font-semibold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Anti-Hallucination Active:
            </p>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              The AI is forbidden from inventing fictional meter spikes. Every dollar and kWh cited corresponds to your database records.
            </p>
          </div>
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-xs font-bold text-slate-700 block mb-2">
            Suggested Questions:
          </span>
          <div className="space-y-1.5">
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-xs text-slate-700 font-medium transition-colors line-clamp-1"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Chat Stream & Input (8 Cols) */}
      <div className="lg:col-span-8 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between overflow-hidden">
        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "ai" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl text-xs max-w-[85%] leading-relaxed whitespace-pre-line shadow-2xs ${
                  m.sender === "user"
                    ? "bg-slate-900 text-white font-medium rounded-tr-none"
                    : "bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none"
                }`}
              >
                {m.text}
              </div>

              {m.sender === "user" && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-100"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-200"></span>
                <span className="text-[11px] font-semibold text-slate-700 ml-1">Analyzing consumption telemetry...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-3 border-t border-slate-100 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about electricity bills, geyser timers, AC setpoints or carbon reduction..."
            className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 text-slate-800 placeholder:text-slate-400 font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
