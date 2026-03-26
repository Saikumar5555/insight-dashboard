import { Users, UserPlus, MessageSquare, UserCheck, Phone, GraduationCap, TrendingUp, Bot } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, BarChart, Bar, Cell, PieChart, Pie, Tooltip } from "recharts";

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

const courseInterestData = [
  { name: "AI & Machine Learning", leads: 4500, enrollments: 800, percentage: "16%" },
  { name: "Data Science", leads: 3800, enrollments: 700, percentage: "15%" },
  { name: "Cybersecurity", leads: 2200, enrollments: 400, percentage: "14%" },
  { name: "Product Management", leads: 1800, enrollments: 300, percentage: "13%" },
  { name: "Cloud Computing", leads: 1200, enrollments: 200, percentage: "11.4%" },
];

const leadSourceData = [
  { name: "Facebook Ads", value: 4523, percentage: "35.2%", color: "#8b5cf6" },
  { name: "Google Ads", value: 3892, percentage: "30.3%", color: "#10b981" },
  { name: "Website Chat", value: 2134, percentage: "16.6%", color: "#f59e0b" },
  { name: "LinkedIn", value: 1234, percentage: "9.6%", color: "#ef4444" },
  { name: "Webinar", value: 712, percentage: "5.5%", color: "#22c55e" },
  { name: "Referral", value: 352, percentage: "2.7%", color: "#6366f1" },
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
        <StatCard icon={MessageSquare} value="28.4%" label="Response Rate of Leads" change="+4.2%" />
        <StatCard icon={Bot} value="1.2s" label="Avg Response of AI" change="-15%" changeType="negative" />
        <StatCard icon={Phone} value="52.3%" label="Meeting Booked Rate" change="+3.2%" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border bg-card p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-foreground mb-6">Course Interest Analytics</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={courseInterestData}
                layout="vertical"
                margin={{ left: 50, right: 30, top: 0, bottom: 0 }}
                barGap={8}
              >
                <CartesianGrid horizontal={false} stroke="hsl(240, 6%, 18%)" strokeDasharray="3 3" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="hsl(240, 5%, 55%)"
                  fontSize={10}
                  width={100}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '4px' }}
                />
                <Bar dataKey="leads" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={12} name="Leads" />
                <Bar dataKey="enrollments" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} name="Enrollments" />
                <Legend iconType="square" align="center" verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-5 gap-2 mt-6 pt-6 border-t border-border">
            {courseInterestData.map((course) => (
              <div key={course.name} className="flex flex-col items-center">
                <span className="text-sm font-bold text-[#8b5cf6]">{course.percentage}</span>
                <span className="text-[10px] text-muted-foreground text-center line-clamp-2">{course.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-foreground mb-6">Lead Source Analytics</h3>
          <div className="flex flex-1 items-center gap-8">
            <div className="w-1/2 aspect-square">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {leadSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '4px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-3">
              {leadSourceData.map((source) => (
                <div key={source.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                    <span className="text-foreground">{source.name}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-muted-foreground">{source.value.toLocaleString()}</span>
                    <span className="font-medium text-foreground w-12 text-right">{source.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 p-4 rounded-lg bg-secondary/30">
            <div className="flex flex-col items-center text-center">
              <span className="text-lg font-bold text-foreground">1.2s</span>
              <span className="text-[10px] text-muted-foreground">Avg Response</span>
              <span className="text-[10px] text-muted-foreground font-medium">AI SDR</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-lg font-bold text-foreground">28.4%</span>
              <span className="text-[10px] text-muted-foreground">Response Rate</span>
              <span className="text-[10px] text-muted-foreground font-medium">Leads</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-lg font-bold text-foreground">98.5%</span>
              <span className="text-[10px] text-muted-foreground">Success Rate</span>
              <span className="text-[10px] text-muted-foreground font-medium">AI Bot</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
