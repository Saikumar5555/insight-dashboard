import { useState } from "react";
import { ArrowLeft, Play, MoreHorizontal, Plus, UserPlus, ChevronLeft, AlertCircle, FileText, Search, Mail, Upload, Globe, Check, Trash2, Sparkles, Eye, Save, Layout, Type, Link as LinkIcon, Image as ImageIcon, Code, X, Send, ShieldCheck, ChevronDown, List, Calendar, Share, Settings, Edit2, Pause, HeartCrack, CheckCircle2, Infinity as InfinityIcon, ArrowRight, BarChart3, Users, GitBranch, SearchIcon, Clock, Terminal, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

interface SequenceStep {
  id: string;
  subject: string;
  body: string;
  delay: number;
  delayUnit: string;
}

interface Schedule {
  id: string;
  name: string;
  fromTime: string;
  toTime: string;
  timezone: string;
  days: string[];
}

export default function Campaign() {
  const [view, setView] = useState<"list" | "details">("list");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All statuses");
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [tab, setTab] = useState("leads");
  const [showAddLeads, setShowAddLeads] = useState(false);
  const [activeOption, setActiveOption] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createMode, setCreateMode] = useState<"select" | "manual" | "ai">("select");
  const [newCampaignName, setNewCampaignName] = useState("");
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [renameCampaignId, setRenameCampaignId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState("");
  
  // Sequence state
  const [steps, setSteps] = useState<SequenceStep[]>([
    { id: "1", subject: "", body: "Start typing here...", delay: 1, delayUnit: "Days" },
    { id: "2", subject: "<Previous email's subject>", body: "", delay: 1, delayUnit: "Days" }
  ]);
  const [activeStepId, setActiveStepId] = useState("1");
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Schedule state
  const [schedules, setSchedules] = useState<Schedule[]>([
    { 
      id: "1", 
      name: "New schedule", 
      fromTime: "9:00 AM", 
      toTime: "6:00 PM", 
      timezone: "Eastern Time (US & Canada) (UTC-04:00)",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    }
  ]);
  const [activeScheduleId, setActiveScheduleId] = useState("1");

  // Options state
  const [options, setOptions] = useState({
    stopOnReply: true,
    openTracking: false,
    linkTracking: false,
    textOnly: false,
    firstEmailTextOnly: false,
    dailyLimit: 30,
    showAdvanced: false
  });

  const navigate = useNavigate();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeCampaign = campaigns.find(c => c.id === activeCampaignId);
  const activeStep = steps.find(s => s.id === activeStepId) || steps[0];
  const activeSchedule = schedules.find(s => s.id === activeScheduleId) || schedules[0];

  const updateStep = (id: string, updates: Partial<SequenceStep>) => {
    setSteps(steps.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addStep = () => {
    const newId = (steps.length + 1).toString();
    setSteps([...steps, { 
      id: newId, 
      subject: "<Previous email's subject>", 
      body: "", 
      delay: 1, 
      delayUnit: "Days" 
    }]);
    setActiveStepId(newId);
  };

  const removeStep = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (steps.length > 1) {
      const newSteps = steps.filter(s => s.id !== id);
      setSteps(newSteps);
      if (activeStepId === id) setActiveStepId(newSteps[0].id);
    }
  };

  const updateSchedule = (id: string, updates: Partial<Schedule>) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addSchedule = () => {
    const newId = (schedules.length + 1).toString();
    setSchedules([...schedules, { 
      id: newId, 
      name: `Schedule ${newId}`, 
      fromTime: "9:00 AM", 
      toTime: "6:00 PM", 
      timezone: "Eastern Time (US & Canada) (UTC-04:00)",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    }]);
    setActiveScheduleId(newId);
  };

  const toggleDay = (day: string) => {
    const newDays = activeSchedule.days.includes(day)
      ? activeSchedule.days.filter(d => d !== day)
      : [...activeSchedule.days, day];
    updateSchedule(activeSchedule.id, { days: newDays });
  };

  const renderOptionContent = () => {
    switch (activeOption) {
      case "CSV":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setActiveOption(null)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-2xl font-bold text-foreground">Upload CSV</h2>
            </div>
            <div className="border-2 border-dashed border-border rounded-2xl p-20 flex flex-col items-center justify-center bg-card/10 hover:bg-card/20 transition-colors cursor-pointer group">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <Upload className="h-8 w-8" />
              </div>
              <p className="text-lg font-medium text-foreground mb-1">Click or drag CSV here</p>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                Make sure your CSV has columns for name and email address.
              </p>
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-green-500/10 text-green-500">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Sample Template</p>
                  <p className="text-xs text-muted-foreground">Download our ready-to-use CSV template</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Download</Button>
            </div>
          </div>
        );
      case "Supersearch":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setActiveOption(null)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-2xl font-bold text-foreground">Supersearch Leads</h2>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Job title, company, or industry..." 
                  className="w-full bg-card border border-border rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-card/40">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">Location</p>
                  <p className="text-sm text-foreground italic">Worldwide</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card/40">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-2">Company Size</p>
                  <p className="text-sm text-foreground italic">Any size</p>
                </div>
              </div>
              <Button className="w-full h-14 text-lg font-bold gap-2">
                <Search className="h-5 w-5" /> Find Leads
              </Button>
            </div>
          </div>
        );
      case "Emails":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setActiveOption(null)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-2xl font-bold text-foreground">Enter Emails Manually</h2>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enter one email address per line or separate them with commas.
              </p>
              <textarea 
                placeholder="rahul@gmail.com, priya@outlook.com..." 
                className="w-full h-64 bg-card border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none"
              />
              <Button 
                onClick={() => { showToast("Leads added successfully!"); setShowAddLeads(false); }}
                className="w-full h-14 text-lg font-bold"
              >
                Add Leads
              </Button>
            </div>
          </div>
        );
      case "Sheets":
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setActiveOption(null)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-2xl font-bold text-foreground">Google Sheets</h2>
            </div>
            <div className="flex flex-col items-center justify-center p-12 space-y-6 bg-card/20 rounded-2xl border border-border">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                <svg className="h-10 w-10" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">Connect Google Sheets</h3>
                <p className="text-sm text-muted-foreground">Select a sheet and map your columns to import leads</p>
              </div>
              <Button className="gap-2 bg-white text-black hover:bg-white/90">
                Continue with Google
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <>
            <div className="flex justify-start">
              <Button 
                variant="ghost" 
                className="text-primary hover:text-primary/80 hover:bg-transparent px-0 gap-1 text-base font-normal" 
                onClick={() => setShowAddLeads(false)}
              >
                <ChevronLeft className="h-5 w-5" /> Cancel
              </Button>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <div className="bg-[#2d2d00] border border-[#4d4d00] rounded-lg px-4 py-2.5 flex items-center gap-2 text-[#e5e500] text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>0 of 250 leads uploaded. 250 uploads remaining.</span>
              </div>
              <button className="text-primary text-sm hover:underline font-medium">Upgrade plan</button>
            </div>

            <div className="grid grid-cols-1 gap-4 px-4">
              {["CSV", "Supersearch", "Emails", "Sheets"].map((opt) => (
                <button 
                  key={opt}
                  onClick={() => setActiveOption(opt)}
                  className="flex items-center gap-6 p-6 rounded-xl bg-card/40 border border-border hover:border-primary/50 transition-colors text-left group"
                >
                  <div className={`w-12 h-12 rounded-lg ${opt === 'CSV' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-foreground/80'} flex items-center justify-center`}>
                    {opt === "CSV" && <FileText className="h-6 w-6" />}
                    {opt === "Supersearch" && <Search className="h-6 w-6" />}
                    {opt === "Emails" && <Mail className="h-6 w-6" />}
                    {opt === "Sheets" && (
                      <svg className="h-6 w-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">
                      {opt === "CSV" ? "Upload" : opt === "Supersearch" ? "From" : opt === "Emails" ? "Enter" : "Use"}
                    </p>
                    <h4 className="text-xl font-bold text-foreground">
                      {opt === "Emails" ? "Emails Manually" : opt === "Sheets" ? "Google Sheets" : opt}
                    </h4>
                  </div>
                </button>
              ))}
            </div>
          </>
        );
    }
  };

  if (showAddLeads) {
    return (
      <div className="max-w-xl mx-auto pt-10 pb-20 space-y-12">
        {renderOptionContent()}
      </div>
    );
  }

  const filteredCampaigns = selectedStatus === "All statuses" 
    ? campaigns 
    : campaigns.filter(c => c.status === selectedStatus);

  if (view === "list") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-card/40 border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-sm font-medium ${showStatusDropdown ? 'border-primary/50 bg-card/60 text-foreground' : 'border-border bg-card/40 hover:bg-card/60 text-foreground'}`}
              >
                <span className="text-yellow-500">⚡</span> {selectedStatus} <ChevronDown className={`h-4 w-4 transition-transform ${showStatusDropdown ? 'rotate-180 text-foreground' : 'text-muted-foreground'}`} />
              </button>
              
              {showStatusDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border shadow-2xl bg-[#111116] overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-2 border-b border-border/50">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                      <input 
                        type="text" 
                        placeholder="Search..." 
                        className="w-full bg-transparent border-none focus:ring-0 text-sm pl-8 pr-3 py-1.5 text-foreground placeholder:text-muted-foreground/50 transition-all"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="p-1.5 space-y-0.5 max-h-72 overflow-y-auto custom-scrollbar">
                    <button onClick={() => { setSelectedStatus("All statuses"); setShowStatusDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/5 text-foreground transition-colors">
                      <span className="text-yellow-500">⚡</span> All statuses
                    </button>
                    <button onClick={() => { setSelectedStatus("Active"); setShowStatusDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/5 text-foreground transition-colors">
                      <Play className="h-4 w-4 text-blue-500 fill-blue-500" /> Active
                    </button>
                    <button onClick={() => { setSelectedStatus("Draft"); setShowStatusDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/5 text-foreground transition-colors">
                      <Edit2 className="h-4 w-4 text-muted-foreground" /> Draft
                    </button>
                    <button onClick={() => { setSelectedStatus("Paused"); setShowStatusDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/5 text-foreground transition-colors">
                      <Pause className="h-4 w-4 text-yellow-500 fill-yellow-500" /> Paused
                    </button>
                    <button onClick={() => { setSelectedStatus("Error"); setShowStatusDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/5 text-foreground transition-colors">
                      <HeartCrack className="h-4 w-4 text-red-500" /> Error
                    </button>
                    <button onClick={() => { setSelectedStatus("Completed"); setShowStatusDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/5 text-foreground transition-colors">
                      <CheckCircle2 className="h-4 w-4 text-green-500" /> Completed
                    </button>
                    <button onClick={() => { setSelectedStatus("Evergreen"); setShowStatusDropdown(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/5 text-foreground transition-colors">
                      <InfinityIcon className="h-4 w-4 text-blue-400" /> Evergreen
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card/40 hover:bg-card/60 text-sm font-medium text-foreground transition-colors">
              Newest first <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20"
            >
              <Plus className="h-4 w-4" /> Add New
            </Button>
          </div>
        </div>

        <div className="border border-border bg-card/20 rounded-xl overflow-visible shadow-sm">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border/50 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <div className="col-span-3 flex items-center gap-4">
              <div className="w-4 h-4 rounded border border-border" />
              NAME
            </div>
            <div className="col-span-2">STATUS</div>
            <div className="col-span-2">PROGRESS</div>
            <div className="col-span-1">SENT</div>
            <div className="col-span-1">CLICK</div>
            <div className="col-span-1">REPLIED</div>
            <div className="col-span-2">OPPORTUNITIES</div>
          </div>
          
          {campaigns.length === 0 ? (
            <div className="p-16 text-center text-sm text-muted-foreground flex flex-col items-center justify-center bg-card/10 animate-in fade-in duration-500">
              <div className="text-5xl mb-4 opacity-50">📋</div>
              <p className="font-medium text-lg text-foreground mb-1">No campaigns yet</p>
              <p className="max-w-xs mb-6">Create your first campaign and start reaching out to leads.</p>
              <Button onClick={() => setShowCreateModal(true)} className="gap-2 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 px-6 h-12 rounded-xl">
                <Plus className="h-4 w-4" /> Create Campaign
              </Button>
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="p-16 text-center text-sm text-muted-foreground flex flex-col items-center justify-center bg-card/10 animate-in fade-in duration-500">
              <div className="text-3xl mb-4 opacity-50">🔍</div>
              <p className="font-medium text-lg text-foreground mb-1">No campaigns found</p>
              <p className="max-w-xs mb-6">There are no campaigns matching the status '{selectedStatus}'.</p>
              <Button onClick={() => setSelectedStatus("All statuses")} variant="outline" className="border-border">
                Clear filter
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/50 animate-in fade-in duration-300">
              {filteredCampaigns.map((camp) => (
                <div 
                  key={camp.id} 
                  className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-card/40 transition-colors cursor-pointer group relative ${openDropdownId === camp.id ? 'z-50' : 'z-10'}`}
                  onClick={() => { setActiveCampaignId(camp.id); setView("details"); }}
                >
                  <div className="col-span-3 flex items-center gap-4">
                    <div className="w-4 h-4 rounded border border-border flex items-center justify-center transition-colors group-hover:border-primary/50" onClick={(e) => { e.stopPropagation(); }} />
                    <span className="font-bold text-sm text-foreground">{camp.name}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-secondary text-foreground">
                      {camp.status}
                    </span>
                  </div>
                  <div className="col-span-2 text-primary font-bold">-</div>
                  <div className="col-span-1 text-muted-foreground font-medium">-</div>
                  <div className="col-span-1 text-muted-foreground font-medium">-</div>
                  <div className="col-span-1 text-muted-foreground font-medium">-</div>
                  <div className="col-span-2 flex items-center justify-between relative">
                    <span className="text-foreground font-bold">0</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground transition-colors" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setOpenDropdownId(openDropdownId === camp.id ? null : camp.id);
                      }}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    
                    {openDropdownId === camp.id && (
                      <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border shadow-2xl bg-[#1a1a20] overflow-hidden z-30 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                        <div className="p-1.5 space-y-0.5">
                          <button 
                            onClick={() => { setRenameCampaignId(camp.id); setRenameText(camp.name); setOpenDropdownId(null); }} 
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/5 text-foreground transition-colors"
                          >
                            <Terminal className="h-4 w-4" /> Rename
                          </button>
                          <button 
                            onClick={() => { 
                               setCampaigns(campaigns.filter(c => c.id !== camp.id));
                               setOpenDropdownId(null);
                               showToast("Campaign deleted");
                            }} 
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/5 text-foreground transition-colors"
                          >
                            <Trash2 className="h-4 w-4" /> Delete
                          </button>
                          <button 
                            onClick={() => {
                               const newId = Date.now().toString();
                               setCampaigns([...campaigns, { ...camp, id: newId, name: `${camp.name} (Copy)` }]);
                               setOpenDropdownId(null);
                               showToast("Campaign duplicated");
                            }} 
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/5 text-foreground transition-colors"
                          >
                            <Copy className="h-4 w-4" /> Duplicate campaign
                          </button>
                          <button 
                            onClick={() => { showToast("Analytics download started"); setOpenDropdownId(null); }} 
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/5 text-foreground transition-colors"
                          >
                            <Download className="h-4 w-4" /> Download analytics CSV
                          </button>
                          <button 
                            onClick={() => { showToast("Share link copied to clipboard!"); setOpenDropdownId(null); }} 
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/5 text-foreground transition-colors"
                          >
                            <Share className="h-4 w-4" /> Share Campaign
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Campaign Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-[#111116] border border-border/40 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10">
                <h2 className="text-xl font-bold text-white">Create New Campaign</h2>
                <Button variant="ghost" size="icon" onClick={() => { setShowCreateModal(false); setCreateMode("select"); }} className="hover:bg-white/10 text-white/70 hover:text-white rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-8 relative z-10">
                {createMode === "select" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div 
                      onClick={() => setCreateMode("ai")}
                      className="bg-white/5 border border-white/10 rounded-2xl p-8 cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-all text-center group shadow-xl"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform ring-1 ring-primary/20 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                        <Sparkles className="h-8 w-8" />
                      </div>
                      <h3 className="font-bold text-white text-xl mb-2">Create with AI</h3>
                      <p className="text-sm text-white/50 leading-relaxed">Let our artificial intelligence craft your perfect sequence based on your target audience.</p>
                      
                      <div className="mt-6 flex justify-center">
                        <span className="text-[10px] bg-primary/20 text-primary-200 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-primary/20 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          Recommended
                        </span>
                      </div>
                    </div>
                    
                    <div 
                      onClick={() => setCreateMode("manual")}
                      className="bg-white/5 border border-white/10 rounded-2xl p-8 cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all text-center group shadow-xl"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 text-white flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform ring-1 ring-white/10">
                        <FileText className="h-8 w-8" />
                      </div>
                      <h3 className="font-bold text-white text-xl mb-2">Create Manually</h3>
                      <p className="text-sm text-white/50 leading-relaxed">Build your entire campaign flow from scratch with full granular control.</p>
                    </div>
                  </div>
                )}

                {createMode === "manual" && (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 max-w-md mx-auto py-4">
                    <div className="flex items-center gap-3 text-white/70 mb-6 cursor-pointer hover:text-white transition-colors w-fit bg-white/5 px-3 py-1.5 rounded-lg border border-white/10" onClick={() => setCreateMode("select")}>
                      <ArrowLeft className="h-4 w-4" /> <span className="text-sm font-bold">Back to options</span>
                    </div>
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-white/90 uppercase tracking-widest pl-1">Campaign Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Q3 Enterprise Outreach"
                        autoFocus
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
                        value={newCampaignName}
                        onChange={(e) => setNewCampaignName(e.target.value)}
                      />
                    </div>
                    <Button 
                      className="w-full h-14 text-lg font-bold bg-white text-black hover:bg-white/90 shadow-xl rounded-xl transition-all"
                      disabled={!newCampaignName.trim()}
                      onClick={() => {
                        const newId = Date.now().toString();
                        setCampaigns([...campaigns, { id: newId, name: newCampaignName, status: "Draft" }]);
                        setActiveCampaignId(newId);
                        setShowCreateModal(false);
                        setCreateMode("select");
                        setNewCampaignName("");
                        setView("details");
                        showToast("Campaign created successfully!");
                      }}
                    >
                      Build Campaign
                    </Button>
                  </div>
                )}

                {createMode === "ai" && (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 text-center py-12 max-w-sm mx-auto">
                    <div className="w-20 h-20 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-6 ring-2 ring-primary/40 shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                      <Sparkles className="h-10 w-10 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">AI Builder</h3>
                    <p className="text-sm text-white/60 leading-relaxed mb-8">Describe your target audience and value proposition to generate a complete sequence structure instantly.</p>
                    <Button 
                      variant="outline" 
                      className="h-12 border-white/20 text-white font-bold hover:bg-white/10 rounded-xl px-8" 
                      onClick={() => setCreateMode("select")}
                    >
                      Return to Selection
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 relative min-h-screen animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => { setView("list"); setActiveCampaignId(null); }} className="hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">{activeCampaign?.name || "My Campaign"}</h1>
      </div>

      <div className="flex items-center justify-between">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <div className="flex items-center justify-between border-b border-border mb-6">
            <TabsList className="bg-transparent rounded-none h-auto p-0 gap-6">
              {["analytics", "leads", "sequences", "schedule", "options"].map((t) => (
                <TabsTrigger
                  key={t}
                  value={t}
                  className="rounded-none border-b-2 border-transparent px-1 pb-3 pt-2 text-sm capitalize data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground transition-all"
                >
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="flex items-center gap-3 pb-2">
              <Button size="sm" className="gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20" onClick={() => showToast("Campaign resumed!")}>
                <Play className="h-3 w-3 fill-current" /> Resume campaign
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-accent border-border/50">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="leads" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-5xl mx-auto space-y-8 pb-20 pt-4">
               <div className="flex items-center justify-between">
                 <div>
                   <h2 className="text-xl font-bold text-foreground">Campaign Leads</h2>
                   <p className="text-sm text-muted-foreground">Manage and import prospects for this campaign.</p>
                 </div>
               </div>

               {/* Add Leads Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 {[
                   { id: "CSV", title: "CSV Import", desc: "Upload a spreadsheet", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
                   { id: "Supersearch", title: "B2B Database", desc: "Find new prospects", icon: SearchIcon, color: "text-purple-500", bg: "bg-purple-500/10" },
                   { id: "Emails", title: "Manual Entry", desc: "Type or paste emails", icon: Type, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                   { id: "Sheets", title: "Integration", desc: "Sync via Google Sheets", icon: LinkIcon, color: "text-orange-500", bg: "bg-orange-500/10" }
                 ].map((opt) => (
                   <div 
                     key={opt.id}
                     onClick={() => { setShowAddLeads(true); setActiveOption(opt.id); }}
                     className="bg-card/40 border border-border rounded-2xl p-6 hover:border-primary/40 hover:bg-card/60 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer group flex flex-col items-center text-center gap-4"
                   >
                     <div className={`w-14 h-14 rounded-2xl ${opt.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/5`}>
                       <opt.icon className={`h-6 w-6 ${opt.color}`} />
                     </div>
                     <div>
                       <h3 className="font-bold text-foreground text-sm">{opt.title}</h3>
                       <p className="text-xs text-muted-foreground mt-1">{opt.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>

               {/* Current Leads Table - Empty State */}
               <div className="bg-card/40 border border-border rounded-2xl overflow-hidden shadow-sm mt-8">
                 <div className="p-4 border-b border-border/50 flex justify-between items-center bg-card/20">
                   <h3 className="font-bold text-sm text-foreground">Current Leads (0)</h3>
                   <div className="flex gap-2">
                     <Button variant="outline" size="sm" className="h-8 text-xs font-bold border-border/50 hover:bg-accent text-muted-foreground">
                       <Upload className="h-3 w-3 mr-2" /> Export
                     </Button>
                     <Button variant="outline" size="sm" className="h-8 text-xs font-bold border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 text-muted-foreground">
                       <Trash2 className="h-3 w-3 mr-2" /> Clear All
                     </Button>
                   </div>
                 </div>
                 <div className="p-20 flex flex-col items-center justify-center text-center">
                   <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4 ring-1 ring-white/5">
                     <Users className="h-8 w-8 text-muted-foreground/50" />
                   </div>
                   <p className="font-bold text-foreground text-lg">No leads found</p>
                   <p className="text-sm text-muted-foreground mt-2 max-w-sm leading-relaxed">You haven't added any leads to this campaign yet. Choose an import method above to get started.</p>
                 </div>
               </div>
            </div>
          </TabsContent>

          <TabsContent value="sequences" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-3xl mx-auto space-y-4 pb-20 pt-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-foreground">Sequence Builder</h2>
                  <p className="text-sm text-muted-foreground">Design your automated outreach flow.</p>
                </div>
                <Button onClick={addStep} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 rounded-xl h-10 px-5">
                  <Plus className="h-4 w-4" /> Add Step
                </Button>
              </div>

              {steps.map((step, index) => (
                <div key={step.id} className="relative">
                  {/* Step Card */}
                  <div className={`bg-card/40 border rounded-2xl p-6 transition-all ${activeStepId === step.id ? 'border-primary ring-1 ring-primary/20 shadow-xl shadow-primary/5 bg-card/60' : 'border-border hover:border-primary/30'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${activeStepId === step.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}`}>
                          {index + 1}
                        </div>
                        <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">
                          {index === 0 ? "Initial Outreach" : "Follow-up"}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {activeStepId !== step.id ? (
                          <Button variant="outline" size="sm" onClick={() => setActiveStepId(step.id)} className="h-8 gap-2 font-bold text-xs bg-card hover:bg-card/80 border-border/50 text-foreground">
                            <Edit2 className="h-3 w-3" /> Edit Mode
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => setActiveStepId("")} className="h-8 gap-2 font-bold text-xs hover:bg-accent text-muted-foreground">
                            Done
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={(e) => removeStep(step.id, e)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {activeStepId === step.id ? (
                      <div className="space-y-4 animate-in zoom-in-95 duration-200 mt-6 border-t border-border/50 pt-4">
                        <input 
                          type="text" 
                          placeholder="Subject line"
                          className="w-full bg-background/50 border border-border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground font-bold transition-all shadow-inner"
                          value={step.subject}
                          onChange={(e) => updateStep(step.id, { subject: e.target.value })}
                        />
                        <textarea 
                          placeholder="Write your message here..." 
                          className="w-full h-56 bg-background/50 border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground text-sm resize-none custom-scrollbar font-medium shadow-inner leading-relaxed"
                          value={step.body}
                          onChange={(e) => updateStep(step.id, { body: e.target.value })}
                        />
                        <div className="flex justify-between items-center pt-2">
                           <div className="flex gap-3">
                             <Button variant="secondary" size="sm" className="h-9 text-xs font-bold gap-2 text-primary hover:text-primary"><Sparkles className="h-4 w-4" /> Rewrite with AI</Button>
                             <Button variant="outline" size="sm" className="h-9 text-xs font-bold gap-2 border-border/50"><Layout className="h-4 w-4" /> Insert Template</Button>
                           </div>
                           <Button size="sm" className="gap-2 h-9 bg-primary hover:bg-primary/90 text-xs font-bold px-6 rounded-lg text-primary-foreground shadow-sm" onClick={() => setShowPreviewModal(true)}>
                             <Eye className="h-4 w-4" /> Preview
                           </Button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="bg-background/40 rounded-xl p-5 border border-border/40 cursor-pointer hover:bg-background/60 transition-colors shadow-inner mt-2 group"
                        onClick={() => setActiveStepId(step.id)}
                      >
                        <p className="text-sm font-bold text-foreground mb-2 truncate group-hover:text-primary transition-colors">{step.subject || "(No subject set)"}</p>
                        <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2">{step.body || "Click to start crafting this message..."}</p>
                      </div>
                    )}
                  </div>

                  {/* Delay Node */}
                  {index < steps.length - 1 && (
                    <div className="flex flex-col items-center py-5">
                      <div className="w-px h-8 bg-primary/20" />
                      <div className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/5 shadow-sm text-sm hover:border-primary/40 hover:bg-primary/10 transition-colors cursor-pointer">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-bold text-foreground">Delay:</span>
                        <input 
                          type="number" 
                          className="w-10 bg-transparent text-center font-black text-primary focus:outline-none border-b border-dashed border-primary/50 px-1"
                          value={step.delay}
                          onChange={(e) => updateStep(step.id, { delay: parseInt(e.target.value) || 1 })}
                        />
                        <select 
                          className="bg-transparent font-black text-primary focus:outline-none appearance-none cursor-pointer border-b border-dashed border-primary/50 pb-0.5 pr-4 relative"
                          value={step.delayUnit}
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238b5cf6' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundPosition: 'right center', backgroundRepeat: 'no-repeat' }}
                          onChange={(e) => updateStep(step.id, { delayUnit: e.target.value })}
                        >
                          <option>Days</option>
                          <option>Hours</option>
                        </select>
                      </div>
                      <div className="w-px h-8 bg-primary/20" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-5xl mx-auto space-y-8 pb-20 pt-4">
              <div className="flex items-center justify-between">
                 <div>
                   <h2 className="text-xl font-bold text-foreground">Campaign Analytics</h2>
                   <p className="text-sm text-muted-foreground">Monitor performance and conversion metrics.</p>
                 </div>
                 <div className="flex gap-3">
                   <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-xl text-sm font-bold border border-border/50">
                     <span className="w-2 h-2 rounded-full bg-yellow-500 relative"><span className="absolute inset-0 rounded-full bg-yellow-500 animate-ping opacity-75"></span></span>
                     Draft Mode
                   </div>
                 </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  { label: "Sequences Sent", value: "0", sub: "Total emails", status: "neutral" },
                  { label: "Open Rate", value: "0%", sub: "0 opened", status: "disabled" },
                  { label: "Click Rate", value: "0%", sub: "0 clicked", status: "neutral" },
                  { label: "Reply Rate", value: "0%", sub: "0 replied", status: "neutral" },
                  { label: "Opportunities", value: "0", sub: "$0 pipeline", status: "good" }
                ].map((metric, i) => (
                  <div key={i} className="bg-card/30 border border-border/80 p-5 rounded-3xl shadow-sm hover:shadow-lg hover:border-primary/40 transition-all group flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-tight">{metric.label}</span>
                      <AlertCircle className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <div className={`text-4xl font-black tracking-tighter mb-1 ${metric.status === 'disabled' ? 'text-muted-foreground/30' : metric.status === 'good' ? 'text-chart-green' : 'text-foreground'}`}>
                        {metric.value}
                      </div>
                      <span className="text-xs font-bold text-muted-foreground/70">{metric.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts area */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="col-span-2 bg-card/30 border border-border/60 rounded-3xl p-8 min-h-[400px] flex flex-col">
                   <h3 className="text-lg font-bold text-foreground mb-2">Activity Overview</h3>
                   <p className="text-xs text-muted-foreground mb-8">Daily engagement metrics across all steps</p>
                   <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-border/30 rounded-2xl bg-card/10">
                      <BarChart3 className="h-12 w-12 text-muted-foreground/20 mb-4" />
                      <p className="text-sm font-bold text-foreground">Awaiting Data</p>
                      <p className="text-xs text-muted-foreground max-w-xs text-center mt-2 leading-relaxed">Publish this campaign to start collecting engagement data over time.</p>
                   </div>
                 </div>
                 <div className="col-span-1 bg-card/30 border border-border/60 rounded-3xl p-8 flex flex-col">
                   <h3 className="text-lg font-bold text-foreground mb-2">Step Breakdown</h3>
                   <p className="text-xs text-muted-foreground mb-8">Performance per sequence step</p>
                   <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-border/30 rounded-2xl bg-card/10 p-6 text-center">
                      <List className="h-8 w-8 text-muted-foreground/20 mb-3" />
                      <p className="text-xs text-muted-foreground leading-relaxed">Analytics will populate here once emails are sent.</p>
                   </div>
                 </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="schedule" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-4xl mx-auto space-y-8 pb-20 pt-4">
              <div className="flex items-center justify-between">
                 <div>
                   <h2 className="text-xl font-bold text-foreground">Sending Schedule</h2>
                   <p className="text-sm text-muted-foreground">Configure when your emails are delivered.</p>
                 </div>
                 <Button onClick={addSchedule} className="gap-2 bg-secondary hover:bg-secondary/80 text-foreground font-bold shadow-sm rounded-xl h-10 border border-border/50 px-6">
                   <Plus className="h-4 w-4" /> New Schedule
                 </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Calendar Builder */}
                <div className="space-y-6">
                  {schedules.map((s) => (
                    <div 
                      key={s.id}
                      onClick={() => setActiveScheduleId(s.id)}
                      className={`p-6 rounded-3xl border transition-all cursor-pointer group ${
                        activeScheduleId === s.id 
                          ? 'border-primary ring-1 ring-primary/20 bg-primary/5 shadow-xl shadow-primary/5' 
                          : 'border-border bg-card/30 hover:border-primary/40 hover:bg-card/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${activeScheduleId === s.id ? 'bg-primary text-white' : 'bg-card border border-border/50 text-foreground'}`}>
                            <Calendar className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground text-lg">{s.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Globe className="h-3 w-3" /> {activeSchedule.timezone.split(' ')[0]}</p>
                          </div>
                        </div>
                        <div className="bg-chart-green/10 text-chart-green px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Active</div>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1 mt-4">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                          const isActive = s.days?.includes(day) || activeSchedule.days.includes(day);
                          return (
                            <div key={day} className="flex flex-col items-center gap-2">
                              <span className="text-[9px] font-bold text-muted-foreground uppercase">{day.charAt(0)}</span>
                              <div className={`w-full aspect-square rounded-md transition-all ${isActive ? 'bg-primary shadow-sm shadow-primary/30' : 'bg-border/30'}`} />
                            </div>
                          )
                        })}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-border/50 flex justify-between items-center">
                        <span className="text-sm font-bold text-foreground bg-background/50 px-3 py-1.5 rounded-lg border border-border/50 shadow-inner">{s.fromTime || activeSchedule.fromTime}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
                        <span className="text-sm font-bold text-foreground bg-background/50 px-3 py-1.5 rounded-lg border border-border/50 shadow-inner">{s.toTime || activeSchedule.toTime}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Edit Form */}
                <div className="bg-card/40 border border-border/80 rounded-3xl p-8 shadow-xl relative overflow-hidden h-fit sticky top-24 mt-2">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                  <h3 className="text-xl font-bold text-foreground mb-6 relative z-10">Configure Schedule</h3>
                  
                  <div className="space-y-6 relative z-10">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Identifier</label>
                      <input
                        type="text"
                        className="w-full bg-background/80 border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary/50 text-foreground font-bold shadow-inner"
                        value={activeSchedule.name}
                        onChange={(e) => updateSchedule(activeSchedule.id, { name: e.target.value })}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Start Time</label>
                        <select
                          className="w-full bg-background/80 border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary/50 text-foreground font-bold appearance-none shadow-inner cursor-pointer"
                          value={activeSchedule.fromTime}
                          onChange={(e) => updateSchedule(activeSchedule.id, { fromTime: e.target.value })}
                        >
                          {["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">End Time</label>
                        <select
                          className="w-full bg-background/80 border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary/50 text-foreground font-bold appearance-none shadow-inner cursor-pointer"
                          value={activeSchedule.toTime}
                          onChange={(e) => updateSchedule(activeSchedule.id, { toTime: e.target.value })}
                        >
                          {["5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Timezone</label>
                      <select
                        className="w-full bg-background/80 border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary/50 text-foreground font-medium appearance-none shadow-inner text-sm cursor-pointer"
                        value={activeSchedule.timezone}
                        onChange={(e) => updateSchedule(activeSchedule.id, { timezone: e.target.value })}
                      >
                        <option>Eastern Time (US & Canada) (UTC-04:00)</option>
                        <option>IST (India Standard Time) (UTC+05:30)</option>
                      </select>
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Active Days</label>
                      <div className="flex flex-wrap gap-2">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                          const isActive = activeSchedule.days.includes(day);
                          return (
                            <button
                              key={day}
                              onClick={() => toggleDay(day)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                isActive 
                                  ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' 
                                  : 'bg-background border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                              }`}
                            >
                              {day.substring(0, 3)}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <Button 
                      className="w-full h-12 mt-4 gap-2 font-bold text-sm bg-foreground hover:bg-foreground/90 text-background rounded-xl transition-all shadow-lg active:scale-95"
                      onClick={() => showToast("Schedule updated!")}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="options" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-5xl mx-auto space-y-8 pb-20 pt-4">
              <div className="flex items-center justify-between mb-2">
                 <div>
                   <h2 className="text-xl font-bold text-foreground">Campaign Settings</h2>
                   <p className="text-sm text-muted-foreground">Fine-tune delivery, tracking, and account behavior.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Sending Accounts */}
                <div className="bg-card/40 rounded-3xl border border-border/80 p-8 shadow-sm flex flex-col justify-between hover:border-primary/30 transition-colors">
                  <div className="space-y-2 mb-8 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                      <Mail className="h-6 w-6 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Sender Accounts</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Select the connected email addresses to distribute volume across.</p>
                  </div>
                  <div className="space-y-4">
                    <select className="w-full bg-background/80 border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary/50 text-foreground font-bold shadow-inner cursor-pointer">
                      <option>support@oyesell.com</option>
                      <option>sales@oyesell.com</option>
                    </select>
                    <Button variant="outline" className="w-full border-dashed border-2 hover:bg-primary/5 hover:border-primary border-border/60 font-bold h-12 rounded-xl text-primary">
                      <Plus className="h-4 w-4 mr-2" /> Connect New Account
                    </Button>
                  </div>
                </div>

                {/* Daily Limits */}
                <div className="bg-card/40 rounded-3xl border border-border/80 p-8 shadow-sm flex flex-col justify-between hover:border-primary/30 transition-colors">
                  <div className="space-y-2 mb-8 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6">
                      <Upload className="h-6 w-6 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Daily Volume Limits</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Set the maximum number of initial emails to dispatch daily to protect domain health.</p>
                  </div>
                  <div>
                    <div className="relative">
                      <input 
                        type="number" 
                        className="w-full bg-background/80 border border-border rounded-xl p-6 text-center text-foreground font-black text-4xl focus:ring-2 focus:ring-primary/50 outline-none shadow-inner"
                        value={options.dailyLimit}
                        onChange={(e) => setOptions({ ...options, dailyLimit: parseInt(e.target.value) || 0 })}
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground uppercase tracking-widest">Emails/Day</span>
                    </div>
                  </div>
                </div>

                {/* Behavioral Rules */}
                <div className="bg-card/40 rounded-3xl border border-border/80 p-8 shadow-sm flex flex-col justify-between hover:border-primary/30 transition-colors lg:col-span-2">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-full md:w-1/3">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                        <List className="h-6 w-6 text-purple-500" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">Behavior & Rules</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">Configure how the campaign responds to user actions and tracking constraints.</p>
                    </div>
                    
                    <div className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                       {/* Stop on reply */}
                       <div className="bg-background/40 border border-border/50 rounded-2xl p-6 flex flex-col justify-between shadow-inner">
                         <div className="mb-6">
                           <h4 className="font-bold text-foreground flex items-center gap-2 mb-1"><Send className="h-4 w-4 text-muted-foreground" /> Stop on Reply</h4>
                           <p className="text-xs text-muted-foreground">Halt sequence when lead responds.</p>
                         </div>
                         <div className="flex bg-card/60 p-1 rounded-xl border border-border/50">
                            <button onClick={() => setOptions({ ...options, stopOnReply: false })} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${!options.stopOnReply ? 'bg-secondary text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Off</button>
                            <button onClick={() => setOptions({ ...options, stopOnReply: true })} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${options.stopOnReply ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>On</button>
                         </div>
                       </div>

                       {/* Open Tracking */}
                       <div className="bg-background/40 border border-border/50 rounded-2xl p-6 flex flex-col justify-between shadow-inner">
                         <div className="mb-6">
                           <h4 className="font-bold text-foreground flex items-center gap-2 mb-1"><Eye className="h-4 w-4 text-muted-foreground" /> Open Tracking</h4>
                           <p className="text-xs text-muted-foreground">Track when recipients view emails.</p>
                         </div>
                         <div className="flex bg-card/60 p-1 rounded-xl border border-border/50">
                            <button onClick={() => setOptions({ ...options, openTracking: false })} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${!options.openTracking ? 'bg-secondary text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Disabled</button>
                            <button onClick={() => setOptions({ ...options, openTracking: true })} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${options.openTracking ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Enabled</button>
                         </div>
                       </div>

                       {/* Link Tracking */}
                       <div className="bg-background/40 border border-border/50 rounded-2xl p-6 flex flex-col justify-between shadow-inner md:col-span-2">
                           <div className="flex items-center justify-between">
                             <div>
                               <h4 className="font-bold text-foreground flex items-center gap-2 mb-1"><LinkIcon className="h-4 w-4 text-muted-foreground" /> Link Tracking</h4>
                               <p className="text-xs text-muted-foreground">Track clicks on URLs within emails.</p>
                             </div>
                             <div 
                               onClick={() => setOptions({ ...options, linkTracking: !options.linkTracking })}
                               className={`w-12 h-6 rounded-full cursor-pointer transition-colors relative flex items-center px-1 ${options.linkTracking ? 'bg-chart-green' : 'bg-secondary'}`}
                             >
                               <div className={`w-4 h-4 rounded-full bg-white transition-all shadow-sm ${options.linkTracking ? 'translate-x-6' : 'translate-x-0'}`} />
                             </div>
                           </div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Advanced Deliverability */}
                {options.showAdvanced && (
                   <div className="bg-card/40 rounded-3xl border border-border/80 p-8 shadow-sm flex flex-col hover:border-primary/30 transition-colors lg:col-span-2 animate-in slide-in-from-top-4 fade-in duration-300">
                     <div className="flex items-center gap-3 mb-6">
                       <h3 className="text-lg font-bold text-foreground">Advanced Deliverability</h3>
                       <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-black uppercase tracking-wider relative">
                         <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-chart-green animate-pulse" />
                         Pro Feature
                       </span>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div 
                          onClick={() => setOptions({ ...options, textOnly: !options.textOnly })}
                          className={`p-6 rounded-2xl border cursor-pointer transition-all ${options.textOnly ? 'bg-primary/5 border-primary ring-1 ring-primary/20' : 'bg-background/40 border-border/50 hover:bg-card'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-foreground">Force Text-Only</h4>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${options.textOnly ? 'bg-primary border-primary' : 'border-border'}`}>
                              {options.textOnly && <Check className="h-3 w-3 text-white" />}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">Strip all HTML elements and formatting to maximize inbox placement chances.</p>
                        </div>

                        <div 
                          onClick={() => setOptions({ ...options, firstEmailTextOnly: !options.firstEmailTextOnly })}
                          className={`p-6 rounded-2xl border cursor-pointer transition-all ${options.firstEmailTextOnly ? 'bg-primary/5 border-primary ring-1 ring-primary/20' : 'bg-background/40 border-border/50 hover:bg-card'}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-foreground">First Email Text-Only</h4>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${options.firstEmailTextOnly ? 'bg-primary border-primary' : 'border-border'}`}>
                              {options.firstEmailTextOnly && <Check className="h-3 w-3 text-white" />}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">Only strip HTML for the initial outreach step, retaining rich styling for follow-ups.</p>
                        </div>
                     </div>
                   </div>
                )}
              </div>

              <div className="flex flex-col items-center pt-8 gap-6 border-t border-border/50">
                <button 
                  onClick={() => setOptions({ ...options, showAdvanced: !options.showAdvanced })}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                  {options.showAdvanced ? 'Hide Advanced Settings' : 'Reveal Advanced Settings'}
                  <ChevronDown className={`h-4 w-4 transition-transform ${options.showAdvanced ? 'rotate-180' : ''}`} />
                </button>

                <Button 
                  onClick={() => showToast("Campaign configuration saved successfully!")}
                  className="h-14 px-12 text-lg font-bold bg-foreground text-background hover:bg-foreground/90 shadow-xl shadow-foreground/10 rounded-2xl transition-all active:scale-[0.98]"
                >
                  Save Campaign Configuration
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-5xl h-[85vh] rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-6 border-b border-border flex items-center justify-between bg-card/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Eye className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Email Preview</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowPreviewModal(false)} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Modal Left Sidebar */}
              <div className="w-72 border-r border-border p-8 space-y-8 bg-card/30">
                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-primary">
                     <Send className="h-4 w-4" />
                     <h4 className="text-sm font-bold uppercase tracking-widest">Test Email</h4>
                   </div>
                   <div className="space-y-4">
                     <div>
                       <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wider">Send from:</label>
                       <select className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 text-foreground font-medium">
                         <option>support@oyesell.com</option>
                         <option>sales@oyesell.com</option>
                       </select>
                     </div>
                     <div>
                       <label className="text-xs font-bold text-muted-foreground mb-2 block uppercase tracking-wider">Load data for lead:</label>
                       <select className="w-full bg-background border border-border rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 text-foreground font-medium">
                         <option>Rahul Sharma</option>
                         <option>Priya Patel</option>
                         <option>Arjun Kumar</option>
                       </select>
                     </div>
                   </div>
                </div>
              </div>

              {/* Modal Main Content */}
              <div className="flex-1 p-12 bg-background/50 overflow-y-auto">
                <div className="bg-card rounded-2xl border border-border shadow-lg p-10 min-h-full flex flex-col">
                  <div className="pb-8 border-b border-border space-y-4 mb-8">
                     <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-muted-foreground w-16">To:</span>
                        <input 
                          type="text" 
                          placeholder="Enter email address"
                          className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-foreground font-medium placeholder:text-muted-foreground/30"
                        />
                     </div>
                     <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-muted-foreground w-16">Subject:</span>
                        <span className="text-sm font-bold text-foreground">
                          {activeStep.subject || "No subject set"}
                        </span>
                     </div>
                  </div>
                  <div className="flex-1 text-foreground/90 leading-relaxed font-medium whitespace-pre-wrap text-lg">
                    {activeStep.body || "No email content provided."}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-border flex items-center justify-between bg-card/80">
              <Button variant="outline" className="gap-2 font-bold border-primary text-primary hover:bg-primary/5 hover:text-primary">
                <ShieldCheck className="h-4 w-4" /> Check Deliverability Score
              </Button>
              <Button className="gap-2 bg-primary hover:bg-primary/90 font-bold px-8 h-12 rounded-xl shadow-lg shadow-primary/20">
                <Send className="h-4 w-4" /> Send test email
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Campaign Modal */}
      {renameCampaignId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-[#111116] border border-border/40 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Rename Campaign</h2>
              <Button variant="ghost" size="icon" onClick={() => setRenameCampaignId(null)} className="hover:bg-white/10 text-white/70 hover:text-white rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-white/90">New Name</label>
                <input 
                  type="text" 
                  autoFocus
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold"
                  value={renameText}
                  onChange={(e) => setRenameText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && renameText.trim()) {
                      setCampaigns(campaigns.map(c => c.id === renameCampaignId ? { ...c, name: renameText } : c));
                      setRenameCampaignId(null);
                      showToast("Campaign renamed successfully");
                    }
                  }}
                />
              </div>
              <Button 
                className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-xl"
                disabled={!renameText.trim()}
                onClick={() => {
                  setCampaigns(campaigns.map(c => c.id === renameCampaignId ? { ...c, name: renameText } : c));
                  setRenameCampaignId(null);
                  showToast("Campaign renamed successfully");
                }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-[0_10px_40px_rgba(139,92,246,0.3)] flex items-center gap-3 font-bold border border-primary-400">
            <CheckCircle2 className="h-5 w-5" />
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
}
