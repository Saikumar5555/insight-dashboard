import { Search, Filter, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const leads = [
  { name: "Rahul Sharma", email: "rahul@gmail.com", course: "AI & Machine Learning", status: "Qualified", score: 85, source: "Facebook Ads", lastContact: "2h ago" },
  { name: "Priya Patel", email: "priya@outlook.com", course: "Data Science", status: "Contacted", score: 72, source: "Google Ads", lastContact: "5h ago" },
  { name: "Arjun Kumar", email: "arjun@yahoo.com", course: "Cybersecurity", status: "New", score: 45, source: "Website Chat", lastContact: "1d ago" },
  { name: "Sneha Reddy", email: "sneha@gmail.com", course: "Product Management", status: "Enrolled", score: 92, source: "LinkedIn", lastContact: "3h ago" },
  { name: "Vikram Singh", email: "vikram@gmail.com", course: "Cloud Computing", status: "Call Booked", score: 78, source: "Webinar", lastContact: "12h ago" },
  { name: "Ananya Gupta", email: "ananya@gmail.com", course: "AI & Machine Learning", status: "Qualified", score: 88, source: "Referral", lastContact: "30m ago" },
];

const statusColors: Record<string, string> = {
  New: "bg-secondary text-foreground",
  Contacted: "bg-primary/20 text-primary",
  Qualified: "bg-chart-green/20 text-chart-green",
  "Call Booked": "bg-chart-orange/20 text-chart-orange",
  Enrolled: "bg-chart-cyan/20 text-chart-cyan",
};

export default function LeadManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lead Management</h1>
        <p className="text-sm text-muted-foreground">Manage and track all your leads</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search leads..." className="pl-9 bg-card border-border" />
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" /> Filters
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Lead</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Course</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Score</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Source</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Last Contact</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/50">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-foreground">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">{lead.email}</p>
                </td>
                <td className="px-4 py-3 text-sm text-foreground">{lead.course}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${lead.score}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{lead.score}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{lead.source}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{lead.lastContact}</td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
