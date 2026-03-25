import { Bot, MessageSquare, Zap, Brain, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";

const performanceData = [
  { day: "Mon", accuracy: 85, responseTime: 92, satisfaction: 88 },
  { day: "Tue", accuracy: 87, responseTime: 90, satisfaction: 85 },
  { day: "Wed", accuracy: 89, responseTime: 93, satisfaction: 90 },
  { day: "Thu", accuracy: 86, responseTime: 88, satisfaction: 87 },
  { day: "Fri", accuracy: 91, responseTime: 95, satisfaction: 92 },
  { day: "Sat", accuracy: 88, responseTime: 91, satisfaction: 89 },
  { day: "Sun", accuracy: 90, responseTime: 94, satisfaction: 91 },
];

const intents = [
  { intent: "Course Inquiry", count: 4521, pct: 35 },
  { intent: "Fee & Payment", count: 2845, pct: 22 },
  { intent: "Schedule & Duration", count: 2134, pct: 16 },
  { intent: "Placement Info", count: 1892, pct: 15 },
  { intent: "General Support", count: 1540, pct: 12 },
];

export default function AiAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Analytics</h1>
        <p className="text-sm text-muted-foreground">AI conversation insights and performance analysis</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Bot} value="98.5%" label="AI Uptime" change="+0.2%" />
        <StatCard icon={MessageSquare} value="45,234" label="Messages Processed" change="+18%" />
        <StatCard icon={Zap} value="8s" label="Avg Response Time" change="-15%" />
        <StatCard icon={Brain} value="89.2%" label="Intent Accuracy" change="+3.1%" />
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Weekly AI Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 6%, 18%)" />
            <XAxis dataKey="day" stroke="hsl(240, 5%, 55%)" fontSize={12} />
            <YAxis stroke="hsl(240, 5%, 55%)" fontSize={12} />
            <Line type="monotone" dataKey="accuracy" stroke="hsl(263, 70%, 58%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="responseTime" stroke="hsl(160, 70%, 48%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="satisfaction" stroke="hsl(36, 95%, 55%)" strokeWidth={2} dot={false} />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Top Detected Intents</h3>
        <div className="space-y-4">
          {intents.map((item) => (
            <div key={item.intent} className="flex items-center gap-4">
              <span className="w-40 text-sm text-foreground">{item.intent}</span>
              <div className="flex-1 h-3 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: `${item.pct}%` }} />
              </div>
              <span className="text-sm text-muted-foreground w-16 text-right">{item.count.toLocaleString()}</span>
              <span className="text-sm font-medium text-foreground w-10 text-right">{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
