import { Users, UserPlus, MessageSquare, UserCheck, Phone, GraduationCap, TrendingUp, DollarSign, Bot, Clock } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";

const trendData = [
  { date: "Feb 24", leads: 320, conversations: 280, enrollments: 80 },
  { date: "Feb 26", leads: 380, conversations: 310, enrollments: 95 },
  { date: "Feb 28", leads: 350, conversations: 290, enrollments: 88 },
  { date: "Mar 2", leads: 420, conversations: 350, enrollments: 110 },
  { date: "Mar 4", leads: 390, conversations: 330, enrollments: 100 },
  { date: "Mar 6", leads: 450, conversations: 370, enrollments: 120 },
  { date: "Mar 8", leads: 410, conversations: 340, enrollments: 105 },
  { date: "Mar 10", leads: 440, conversations: 360, enrollments: 115 },
  { date: "Mar 12", leads: 400, conversations: 330, enrollments: 98 },
  { date: "Mar 14", leads: 460, conversations: 380, enrollments: 125 },
  { date: "Mar 16", leads: 430, conversations: 350, enrollments: 112 },
  { date: "Mar 18", leads: 470, conversations: 390, enrollments: 130 },
  { date: "Mar 20", leads: 420, conversations: 345, enrollments: 108 },
  { date: "Mar 22", leads: 450, conversations: 370, enrollments: 118 },
  { date: "Mar 25", leads: 380, conversations: 310, enrollments: 90 },
];

const channels = [
  { name: "WhatsApp", conversations: 5234, response: 78, color: "hsl(36, 95%, 55%)" },
  { name: "Web Chat", conversations: 3421, response: 65, color: "hsl(160, 70%, 48%)" },
  { name: "Email", conversations: 1177, response: 42, color: "hsl(36, 95%, 55%)" },
];

export default function Overview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">Track and analyze your AI SDR performance metrics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard icon={Users} value="12,847" label="Total Leads" change="+12.5%" />
        <StatCard icon={UserPlus} value="156" label="New Leads Today" change="+8.2%" />
        <StatCard icon={MessageSquare} value="9,832" label="Conversations" change="+15.3%" />
        <StatCard icon={UserCheck} value="5,421" label="Qualified Leads" change="+9.7%" />
        <StatCard icon={Phone} value="2,845" label="Calls Booked" change="+11.2%" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard icon={GraduationCap} value="1,892" label="Enrolled" change="+7.8%" />
        <StatCard icon={TrendingUp} value="14.7%" label="Conversion Rate" change="+2.1%" />
        <StatCard icon={DollarSign} value="$245" label="Cost/Enrollment" change="-5.3%" changeType="negative" />
        <StatCard icon={Bot} value="98.5%" label="AI Response Rate" change="+0.5%" />
        <StatCard icon={Clock} value="12s" label="Avg Response" change="-12%" changeType="negative" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">30-Day Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 6%, 18%)" />
              <XAxis dataKey="date" stroke="hsl(240, 5%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(240, 5%, 55%)" fontSize={12} />
              <Area type="monotone" dataKey="leads" stroke="hsl(263, 70%, 58%)" fill="hsl(263, 70%, 58%)" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="conversations" stroke="hsl(160, 70%, 48%)" fill="hsl(160, 70%, 48%)" fillOpacity={0.1} strokeWidth={2} />
              <Area type="monotone" dataKey="enrollments" stroke="hsl(185, 70%, 50%)" fill="hsl(185, 70%, 50%)" fillOpacity={0.1} strokeWidth={2} />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Channel Performance</h3>
          <div className="space-y-5">
            {channels.map((ch) => (
              <div key={ch.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{ch.name}</span>
                  <div className="flex gap-3 text-xs">
                    <span className="text-muted-foreground">{ch.conversations.toLocaleString()} conversations</span>
                    <span className="font-medium text-chart-green">{ch.response}% response</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${ch.response}%`, backgroundColor: ch.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
