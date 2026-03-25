import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { Calendar, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Last 30 days
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 text-muted-foreground">
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
