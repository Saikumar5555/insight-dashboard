import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardLayout } from "@/components/DashboardLayout";
import Overview from "@/pages/Overview";
import LeadFunnel from "@/pages/LeadFunnel";
import LeadManagement from "@/pages/LeadManagement";
import AiAnalytics from "@/pages/AiAnalytics";
import Outreach from "@/pages/Outreach";
import CourseAnalytics from "@/pages/CourseAnalytics";
import LeadSources from "@/pages/LeadSources";
import Counselors from "@/pages/Counselors";
import AiSdrPerformance from "@/pages/AiSdrPerformance";
import Campaign from "@/pages/Campaign";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Overview />} />
            <Route path="/lead-funnel" element={<LeadFunnel />} />
            <Route path="/lead-management" element={<LeadManagement />} />
            <Route path="/ai-analytics" element={<AiAnalytics />} />
            <Route path="/outreach" element={<Outreach />} />
            <Route path="/course-analytics" element={<CourseAnalytics />} />
            <Route path="/lead-sources" element={<LeadSources />} />
            <Route path="/counselors" element={<Counselors />} />
            <Route path="/ai-sdr-performance" element={<AiSdrPerformance />} />
            <Route path="/campaign" element={<Campaign />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
