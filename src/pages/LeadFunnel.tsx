const funnelStages = [
  { label: "Lead Captured", count: 12847, converted: null, dropOff: null, width: "100%" },
  { label: "Contacted by AI", count: 11562, converted: "90% converted", dropOff: "10% drop-off", width: "90%" },
  { label: "Conversation Started", count: 9832, converted: "85% converted", dropOff: "15% drop-off", width: "76%" },
  { label: "Qualified Lead", count: 5421, converted: "55% converted", dropOff: "45% drop-off", width: "42%" },
  { label: "Counseling Call Booked", count: 2845, converted: "52% converted", dropOff: "48% drop-off", width: "34%" },
  { label: "Attended Call", count: 2276, converted: "80% converted", dropOff: "20% drop-off", width: "29%" },
  { label: "Enrolled", count: 1892, converted: "83% converted", dropOff: "17% drop-off", width: "24%" },
];

const colors = [
  "hsl(263, 70%, 58%)", "hsl(263, 70%, 58%)", "hsl(263, 60%, 55%)",
  "hsl(263, 50%, 50%)", "hsl(200, 70%, 50%)", "hsl(160, 70%, 48%)", "hsl(36, 95%, 55%)",
];

export default function LeadFunnel() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lead Pipeline Funnel</h1>
        <p className="text-sm text-muted-foreground">Track and analyze your AI SDR performance metrics</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Lead Pipeline Funnel</h3>
        <div className="space-y-4">
          {funnelStages.map((stage, i) => (
            <div key={stage.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground">{stage.label}</span>
                <div className="flex gap-4 text-xs">
                  <span className="text-muted-foreground">{stage.count.toLocaleString()} leads</span>
                  {stage.converted && <span className="text-chart-green">{stage.converted}</span>}
                  {stage.dropOff && <span className="text-chart-red">{stage.dropOff}</span>}
                </div>
              </div>
              <div className="relative h-8 w-full rounded bg-secondary overflow-hidden">
                <div
                  className="h-full rounded flex items-center justify-center text-xs font-medium text-primary-foreground"
                  style={{ width: stage.width, backgroundColor: colors[i] }}
                >
                  {stage.count.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8 rounded-lg border border-border p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-green">14.7%</p>
            <p className="text-sm text-muted-foreground">Overall Conversion</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">1,892</p>
            <p className="text-sm text-muted-foreground">Total Enrolled</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-chart-red">10,955</p>
            <p className="text-sm text-muted-foreground">Total Drop-offs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
