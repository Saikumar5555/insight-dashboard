import { Phone, GraduationCap, TrendingUp, Clock } from "lucide-react";
import { StatCard } from "@/components/StatCard";

const counselors = [
  { rank: 1, name: "Alex Thompson", initials: "AT", calls: 423, enrollments: 187, conversion: "44.2%", avgDuration: "24m", topPerformer: true },
  { rank: 2, name: "Maria Garcia", initials: "MG", calls: 398, enrollments: 165, conversion: "41.5%", avgDuration: "28m" },
  { rank: 3, name: "John Smith", initials: "JS", calls: 356, enrollments: 142, conversion: "39.9%", avgDuration: "22m" },
  { rank: 4, name: "Emily Chen", initials: "EC", calls: 312, enrollments: 134, conversion: "42.9%", avgDuration: "26m" },
];

export default function Counselors() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Counselor Performance</h1>
        <p className="text-sm text-muted-foreground">Track and analyze your AI SDR performance metrics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Phone} value="1,776" label="Total Calls" />
        <StatCard icon={GraduationCap} value="740" label="Total Enrollments" />
        <StatCard icon={TrendingUp} value="41.5%" label="Avg Conversion" />
        <StatCard icon={Clock} value="25 min" label="Avg Call Duration" />
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Counselor Performance Leaderboard</h3>
        <div className="space-y-4">
          {counselors.map((c) => (
            <div key={c.rank} className={`rounded-lg border p-4 ${c.topPerformer ? "border-primary bg-primary/5" : "border-border"}`}>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">#{c.rank}</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {c.initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{c.name}</p>
                    {c.topPerformer && (
                      <span className="rounded bg-chart-orange/20 px-2 py-0.5 text-[10px] font-medium text-chart-orange">Top Performer</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{c.calls} calls handled</p>
                </div>
                <div className="flex gap-6 text-right">
                  <div>
                    <p className="text-lg font-bold text-foreground">{c.enrollments}</p>
                    <p className="text-xs text-muted-foreground">Enrollments</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-chart-green">{c.conversion}</p>
                    <p className="text-xs text-muted-foreground">Conversion</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-primary">{c.avgDuration}</p>
                    <p className="text-xs text-muted-foreground">Avg Duration</p>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Performance</span>
                  <span className="text-muted-foreground">{c.conversion}</span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: c.conversion }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
