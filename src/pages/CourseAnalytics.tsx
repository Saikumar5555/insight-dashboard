import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";

const data = [
  { course: "AI & Machine Learning", leads: 5200, enrollments: 480 },
  { course: "Data Science", leads: 4300, enrollments: 380 },
  { course: "Cybersecurity", leads: 2800, enrollments: 120 },
  { course: "Product Management", leads: 2400, enrollments: 90 },
  { course: "Cloud Computing", leads: 1800, enrollments: 50 },
];

const conversionRates = [
  { course: "AI & Machine Learning", rate: "16%", color: "text-chart-green" },
  { course: "Data Science", rate: "15%", color: "text-chart-orange" },
  { course: "Cybersecurity", rate: "14%", color: "text-primary" },
  { course: "Product Management", rate: "13%", color: "text-chart-red" },
  { course: "Cloud Computing", rate: "11.4%", color: "text-chart-green" },
];

export default function CourseAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Course Interest Analytics</h1>
        <p className="text-sm text-muted-foreground">Track and analyze your AI SDR performance metrics</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Course Interest Analytics</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 6%, 18%)" />
            <XAxis type="number" stroke="hsl(240, 5%, 55%)" fontSize={12} />
            <YAxis type="category" dataKey="course" stroke="hsl(240, 5%, 55%)" fontSize={12} width={130} />
            <Bar dataKey="leads" fill="hsl(263, 70%, 58%)" radius={[0, 4, 4, 0]} />
            <Bar dataKey="enrollments" fill="hsl(160, 70%, 48%)" radius={[0, 4, 4, 0]} />
            <Legend />
          </BarChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-5 gap-4 mt-6 pt-4 border-t border-border">
          {conversionRates.map((c) => (
            <div key={c.course} className="text-center">
              <p className={`text-xl font-bold ${c.color}`}>{c.rate}</p>
              <p className="text-xs text-muted-foreground">{c.course}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
