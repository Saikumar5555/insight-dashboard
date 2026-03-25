import { Mail, MessageCircle, Linkedin, Reply } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";

const chartData = [
  { channel: "Email", sent: 15000, replies: 4200 },
  { channel: "WhatsApp", sent: 12000, replies: 5300 },
  { channel: "LinkedIn", sent: 4000, replies: 1200 },
];

const channelDetails = [
  { name: "Email", icon: Mail, sent: "45,234 sent", replies: "12,654 replies", rate: "28%", color: "text-chart-red" },
  { name: "WhatsApp", icon: MessageCircle, sent: "32,145 sent", replies: "14,123 replies", rate: "44%", color: "text-chart-green" },
  { name: "LinkedIn", icon: Linkedin, sent: "8,923 sent", replies: "2,677 replies", rate: "30%", color: "text-chart-red" },
];

export default function Outreach() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Outreach Analytics</h1>
        <p className="text-sm text-muted-foreground">Track and analyze your AI SDR performance metrics</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Outreach Analytics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Mail} value="45,234" label="Emails Sent" />
          <StatCard icon={MessageCircle} value="32,145" label="WhatsApp Sent" />
          <StatCard icon={Linkedin} value="8,923" label="LinkedIn Sent" />
          <StatCard icon={Reply} value="34.2%" label="Reply Rate" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Response Rate by Channel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 6%, 18%)" />
              <XAxis dataKey="channel" stroke="hsl(240, 5%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(240, 5%, 55%)" fontSize={12} />
              <Bar dataKey="sent" fill="hsl(263, 70%, 58%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="replies" fill="hsl(160, 70%, 48%)" radius={[4, 4, 0, 0]} />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Channel Performance Details</h3>
          <div className="space-y-4">
            {channelDetails.map((ch) => (
              <div key={ch.name} className="flex items-center gap-4 rounded-lg border border-border bg-secondary p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-card">
                  <ch.icon className="h-5 w-5 text-chart-orange" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{ch.name}</p>
                  <p className="text-xs text-muted-foreground">{ch.sent}</p>
                  <p className="text-xs text-muted-foreground">{ch.replies}</p>
                </div>
                <span className={`text-lg font-bold ${ch.color}`}>{ch.rate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
