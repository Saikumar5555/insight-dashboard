import { Target, Repeat, Clock, TrendingUp, HelpCircle, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";

const scoreData = [
  { range: "0-20", count: 800 },
  { range: "21-40", count: 1800 },
  { range: "41-60", count: 3200 },
  { range: "61-80", count: 3500 },
  { range: "81-100", count: 2100 },
];

const topQuestions = [
  "What are the course fees and payment options?",
  "Is there a placement guarantee?",
  "What's the course duration and schedule?",
  "Can I get a refund if not satisfied?",
  "Do you offer EMI or installment plans?",
];

const objections = [
  "The course is too expensive",
  "I need more time to decide",
  "I found a cheaper alternative",
  "Not sure about career outcomes",
  "Schedule conflicts with work",
];

export default function AiSdrPerformance() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI SDR Performance Metrics</h1>
        <p className="text-sm text-muted-foreground">Track and analyze your AI SDR performance metrics</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">AI Conversation Analytics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Target} value="87.5%" label="Qualification Accuracy" />
          <StatCard icon={Repeat} value="12.3%" label="Escalation Rate" />
          <StatCard icon={Clock} value="8s" label="Avg First Response" />
          <StatCard icon={TrendingUp} value="72.4%" label="Follow-Up Success" />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">AI Lead Score Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={scoreData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 6%, 18%)" />
            <XAxis dataKey="range" stroke="hsl(240, 5%, 55%)" fontSize={12} />
            <YAxis stroke="hsl(240, 5%, 55%)" fontSize={12} />
            <Bar dataKey="count" fill="hsl(263, 70%, 58%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" /> Top Questions Asked
          </h3>
          <div className="space-y-3">
            {topQuestions.map((q, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{i + 1}</span>
                <span className="text-sm text-foreground">{q}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-chart-orange" /> Common Objections
          </h3>
          <div className="space-y-3">
            {objections.map((o, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-chart-orange text-xs font-bold text-primary-foreground">{i + 1}</span>
                <span className="text-sm text-foreground">{o}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
