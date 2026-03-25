import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Facebook Ads", value: 4523, pct: "35.2%", color: "hsl(263, 70%, 58%)" },
  { name: "Google Ads", value: 3892, pct: "30.3%", color: "hsl(160, 70%, 48%)" },
  { name: "Website Chat", value: 2134, pct: "16.6%", color: "hsl(36, 95%, 55%)" },
  { name: "LinkedIn", value: 1234, pct: "9.6%", color: "hsl(0, 75%, 55%)" },
  { name: "Webinar", value: 712, pct: "5.5%", color: "hsl(140, 60%, 45%)" },
  { name: "Referral", value: 352, pct: "2.7%", color: "hsl(280, 60%, 55%)" },
];

const costs = [
  { source: "Facebook Ads", cost: "$185", color: "text-primary" },
  { source: "Google Ads", cost: "$220", color: "text-chart-orange" },
  { source: "Website Chat", cost: "$95", color: "text-chart-green" },
];

export default function LeadSources() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lead Source Analytics</h1>
        <p className="text-sm text-muted-foreground">Track and analyze your AI SDR performance metrics</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Lead Source Analytics</h3>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="w-64 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" strokeWidth={2} stroke="hsl(240, 10%, 6%)">
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-3">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-sm text-muted-foreground">{item.value.toLocaleString()}</span>
                  <span className="text-sm font-medium text-foreground">{item.pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {costs.map((c) => (
          <div key={c.source} className="rounded-lg border border-border bg-card p-6 text-center">
            <p className={`text-2xl font-bold ${c.color}`}>{c.cost}</p>
            <p className="text-sm text-muted-foreground">Cost per Enrollment</p>
            <p className="text-xs text-muted-foreground">{c.source}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
