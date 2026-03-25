import { useState } from "react";
import { ArrowLeft, Play, MoreHorizontal, Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

export default function Campaign() {
  const [tab, setTab] = useState("leads");
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">My Campaign</h1>
      </div>

      <div className="flex items-center justify-between">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 gap-6">
              {["analytics", "leads", "sequences", "schedule", "options"].map((t) => (
                <TabsTrigger
                  key={t}
                  value={t}
                  className="rounded-none border-b-2 border-transparent px-1 pb-3 pt-2 text-sm capitalize data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground"
                >
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex items-center gap-2">
              <Button size="sm" className="gap-2 bg-primary text-primary-foreground">
                <Play className="h-3 w-3" /> Resume campaign
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="leads" className="mt-6">
            <div className="flex justify-end mb-6">
              <Button className="gap-2 bg-chart-red hover:bg-chart-red/80 text-primary-foreground">
                <Plus className="h-4 w-4" /> Add Leads
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-6 text-6xl">👋</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Add some leads to get started</h3>
              <Button className="mt-4 gap-2 bg-primary text-primary-foreground">
                <UserPlus className="h-4 w-4" /> Add Leads
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              Campaign analytics will appear here once you add leads and start the campaign.
            </div>
          </TabsContent>

          <TabsContent value="sequences" className="mt-6">
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              Configure your outreach sequences here.
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              Set your campaign schedule and timing preferences.
            </div>
          </TabsContent>

          <TabsContent value="options" className="mt-6">
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              Campaign options and settings.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
