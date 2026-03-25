import { useState } from "react";
import { ArrowLeft, Play, MoreHorizontal, Plus, UserPlus, ChevronLeft, AlertCircle, FileText, Search, Mail, Upload, Globe, Check, Trash2, Sparkles, Eye, Save, Layout, Type, Link as LinkIcon, Image as ImageIcon, Code, X, Send, ShieldCheck, ChevronDown, List, Calendar, Share, Settings } from "lucide-react";
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
  const [tab, setTab] = useState("leads");
  const [showAddLeads, setShowAddLeads] = useState(false);
  const [activeOption, setActiveOption] = useState<string | null>(null);
  
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
              <Button className="w-full h-14 text-lg font-bold">Add Leads</Button>
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

  return (
    <div className="space-y-6 px-6 relative min-h-screen">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">My Campaign</h1>
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
              <Button size="sm" className="gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20">
                <Play className="h-3 w-3 fill-current" /> Resume campaign
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-accent border-border/50">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="leads" className="mt-0">
            <div className="flex justify-end mb-6">
              <Button 
                onClick={() => {
                  setShowAddLeads(true);
                  setActiveOption(null);
                }}
                className="gap-2 bg-chart-red hover:bg-chart-red/90 text-white font-medium px-4"
              >
                <Plus className="h-4 w-4" /> Add Leads
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center py-32 bg-card/20 rounded-2xl border border-dashed border-border/50">
              <div className="mb-6 text-7xl animate-bounce">👋</div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Add some leads to get started</h3>
              <p className="text-muted-foreground mb-8">Import your first set of leads to begin your campaign</p>
              <Button 
                onClick={() => {
                  setShowAddLeads(true);
                  setActiveOption(null);
                }}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-12 rounded-full"
              >
                <UserPlus className="h-5 w-5" /> Add Leads
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="sequences" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              {/* Left Sidebar Steps */}
              <div className="lg:col-span-1 border border-border bg-card/20 rounded-2xl overflow-hidden flex flex-col max-h-[750px] shadow-sm animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="p-4 border-b border-border bg-card/40 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <List className="h-4 w-4 text-primary" /> Sequence Steps
                  </h3>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">{steps.length} Steps</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {steps.map((step, index) => (
                    <div key={step.id} className="space-y-4">
                      <div 
                        onClick={() => setActiveStepId(step.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                          activeStepId === step.id 
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
                          : 'border-border bg-background/50 hover:border-primary/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Step {index + 1}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => removeStep(step.id, e)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-3 rounded-lg border border-border bg-background/50 mb-3">
                          <p className="text-xs text-foreground font-medium truncate">
                            {step.subject || (index === 0 ? "Initial Message" : "Follow-up Message")}
                          </p>
                          <p className="text-[10px] text-muted-foreground italic truncate mt-1">
                            {step.body.substring(0, 30)}...
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="w-full text-[10px] font-bold gap-1 h-7 text-primary hover:bg-primary/10 border border-primary/20 uppercase tracking-tighter">
                          <Plus className="h-3 w-3" /> Add variant
                        </Button>
                      </div>

                      {index < steps.length - 1 && (
                        <div className="flex flex-col items-center py-2 space-y-2">
                          <div className="w-px h-6 bg-border" />
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background shadow-sm">
                            <span className="text-[10px] text-muted-foreground font-medium">Wait</span>
                            <input 
                              type="number" 
                              className="w-8 bg-transparent text-center text-[10px] font-black border-none p-0 focus:ring-0 text-foreground"
                              value={step.delay}
                              onChange={(e) => updateStep(step.id, { delay: parseInt(e.target.value) || 1 })}
                            />
                            <select 
                              className="bg-transparent text-[10px] font-black border-none p-0 focus:ring-0 text-foreground cursor-pointer"
                              value={step.delayUnit}
                              onChange={(e) => updateStep(step.id, { delayUnit: e.target.value })}
                            >
                              <option>Days</option>
                              <option>Hours</option>
                            </select>
                          </div>
                          <div className="w-px h-6 bg-border" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-border bg-card/40">
                  <Button 
                    onClick={addStep}
                    variant="outline" 
                    className="w-full h-11 border-dashed border-2 hover:border-primary hover:bg-primary/5 gap-2 font-bold text-muted-foreground hover:text-primary transition-all active:scale-95 text-xs uppercase tracking-wider"
                  >
                    <Plus className="h-4 w-4" /> Add step
                  </Button>
                </div>
              </div>

              {/* Main Editor */}
              <div className="lg:col-span-3 h-full">
                <div className="flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-500">
                  <div className="p-4 border-b border-border flex items-center justify-between bg-card/50">
                    <div className="flex items-center gap-4 flex-1 mr-4">
                      <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">Subject</span>
                      <input 
                        type="text" 
                        placeholder={activeStepId === "1" ? "Leave empty to use previous step's subject" : "Enter email subject"}
                        className="flex-1 bg-transparent border-none p-0 focus:ring-0 text-foreground placeholder:text-muted-foreground/50 font-medium"
                        value={activeStep.subject}
                        onChange={(e) => updateStep(activeStep.id, { subject: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="h-9 gap-2 font-semibold"
                        onClick={() => setShowPreviewModal(true)}
                      >
                        <Eye className="h-4 w-4 text-primary" /> Preview
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-primary hover:bg-primary/10">
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 p-8 min-h-[400px]">
                    <textarea 
                      placeholder="Start typing here..." 
                      className="w-full h-full bg-transparent border-none p-0 focus:ring-0 text-foreground/90 leading-relaxed text-lg resize-none placeholder:text-muted-foreground/30 font-medium"
                      value={activeStep.body}
                      onChange={(e) => updateStep(activeStep.id, { body: e.target.value })}
                    />
                  </div>

                  {/* Editor Toolbar */}
                  <div className="p-3 border-t border-border bg-card/80 backdrop-blur-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90 font-bold px-4">
                        Save <ChevronDown className="h-3 w-3" />
                      </Button>
                      <div className="h-6 w-px bg-border mx-1" />
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                          <Layout className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                          <Type className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                          <Code className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-4 ml-4 px-3 py-1.5 rounded-lg hover:bg-accent border border-transparent hover:border-border transition-all cursor-pointer">
                          <div className="flex items-center gap-2">
                             <Sparkles className="h-4 w-4 text-primary" />
                             <span className="text-xs font-bold text-foreground">AI Tools</span>
                          </div>
                          <div className="flex items-center gap-2 border-l border-border pl-4">
                             <Layout className="h-4 w-4 text-primary" />
                             <span className="text-xs font-bold text-foreground">Templates</span>
                          </div>
                          <div className="flex items-center gap-2 border-l border-border pl-4">
                             <Sparkles className="h-4 w-4 text-primary" />
                             <span className="text-xs font-bold text-foreground">Variables</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground text-xs font-medium mr-2">
                      <span>42 words</span>
                      <span>280 characters</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Other tabs remain placeholders */}
          <TabsContent value="analytics" className="mt-0">
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
              {/* Top Bar - Status & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Status:</span>
                    <span className="text-sm font-black text-foreground bg-secondary px-3 py-1 rounded-md">Draft</span>
                  </div>
                  <div className="w-48 h-2 bg-secondary rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full w-full bg-chart-green shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                    <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-[8px] font-black text-white mix-blend-difference">100%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="h-9 gap-2 font-bold text-xs border-border bg-card/40 hover:bg-primary/10 hover:border-primary/30 transition-all">
                    <ShieldCheck className="h-3.5 w-3.5" /> Diagnose
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 gap-2 font-bold text-xs border-border bg-card/40 hover:bg-primary/10 hover:border-primary/30 transition-all">
                    <Share className="h-3.5 w-3.5" /> Share
                  </Button>
                  <div className="relative">
                    <select className="bg-card/40 border border-border rounded-lg h-9 pl-3 pr-8 text-xs font-bold text-foreground outline-none focus:ring-1 focus:ring-primary/40 appearance-none cursor-pointer">
                      <option>Last 4 weeks</option>
                      <option>Last 7 days</option>
                      <option>All time</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  <Button variant="ghost" size="icon" className="h-9 w-9 border border-border bg-card/40 hover:bg-primary/10 transition-all">
                    <Settings className="h-4 w-4 text-foreground" />
                  </Button>
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { label: "Sequence started", value: "-", sub: "" },
                  { label: "Open rate", value: "Disabled", sub: "", status: "disabled" },
                  { label: "Click rate", value: "0%", sub: "-", status: "neutral" },
                  { label: "Opportunities", value: "0", sub: "$0", status: "neutral" },
                  { label: "Conversions", value: "0", sub: "$0", status: "neutral" }
                ].map((metric, i) => (
                  <div key={i} className="bg-card/40 border border-border p-6 rounded-2xl shadow-sm hover:border-primary/30 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{metric.label}</span>
                      <AlertCircle className="h-3.5 w-3.5 text-muted-foreground/50 cursor-pointer hover:text-primary transition-colors" />
                    </div>
                    <div className="flex items-end gap-2">
                      <span className={`text-2xl font-black ${metric.status === 'disabled' ? 'text-muted-foreground/50' : 'text-foreground'}`}>
                        {metric.value}
                      </span>
                      {metric.sub && <span className="text-sm font-bold text-muted-foreground mb-1">| {metric.sub}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* No Data Banner */}
              <div className="p-4 border border-border bg-card/20 rounded-xl text-center">
                <p className="text-xs font-bold text-muted-foreground py-2 uppercase tracking-tighter italic">
                  No data available for specified time
                </p>
              </div>

              {/* Bottom Tabs Section */}
              <div className="bg-card/40 border border-border rounded-2xl p-8 min-h-[300px] shadow-xl">
                <div className="flex items-center gap-8 border-b border-border pb-4 mb-8">
                  <button className="text-sm font-black text-primary border-b-2 border-primary pb-4 -mb-[18px] relative z-10 px-2 transition-all">
                    Step Analytics
                  </button>
                  <button className="text-sm font-bold text-muted-foreground hover:text-foreground pb-4 -mb-[18px] px-2 transition-all">
                    Activity
                  </button>
                </div>
                
                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                  <div className="text-4xl mb-6">👋</div>
                  <p className="text-sm font-bold text-muted-foreground text-center max-w-xs leading-relaxed">
                    Step analytics will appear here once the campaign is published
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="schedule" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              {/* Left Sidebar Schedule List */}
              <div className="lg:col-span-1 border border-border bg-card/20 rounded-2xl overflow-hidden flex flex-col shadow-sm animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Start</span>
                      <span className="mx-1 text-border">|</span>
                      <span className="font-bold text-primary">Now</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">End</span>
                      <span className="mx-1 text-border">|</span>
                      <span className="font-bold text-primary">No end date</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {schedules.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setActiveScheduleId(s.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                          activeScheduleId === s.id
                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                            : "border-border bg-background/50 hover:border-primary/40"
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${activeScheduleId === s.id ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          <Calendar className="h-4 w-4" />
                        </div>
                        <span className={`text-sm font-bold truncate ${activeScheduleId === s.id ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {s.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={addSchedule}
                    variant="outline"
                    className="w-full h-11 border-dashed border-2 hover:border-primary hover:bg-primary/5 gap-2 font-bold text-muted-foreground hover:text-primary transition-all active:scale-95 text-xs uppercase tracking-wider"
                  >
                    Add schedule
                  </Button>
                </div>
              </div>

              {/* Main Schedule Editor */}
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-card/40 rounded-2xl border border-border p-8 space-y-8 animate-in fade-in zoom-in-95 duration-500 shadow-xl">
                  {/* Schedule Name */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground">Schedule Name</h3>
                    <input
                      type="text"
                      className="w-full bg-background border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary/50 text-foreground font-medium outline-none transition-all shadow-inner"
                      value={activeSchedule.name}
                      onChange={(e) => updateSchedule(activeSchedule.id, { name: e.target.value })}
                      placeholder="Enter schedule name"
                    />
                  </div>

                  {/* Timing */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground">Timing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">From</label>
                        <select
                          className="w-full bg-background border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary/50 text-foreground font-medium outline-none appearance-none cursor-pointer"
                          value={activeSchedule.fromTime}
                          onChange={(e) => updateSchedule(activeSchedule.id, { fromTime: e.target.value })}
                        >
                          {["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">To</label>
                        <select
                          className="w-full bg-background border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary/50 text-foreground font-medium outline-none appearance-none cursor-pointer"
                          value={activeSchedule.toTime}
                          onChange={(e) => updateSchedule(activeSchedule.id, { toTime: e.target.value })}
                        >
                          {["5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Timezone</label>
                        <select
                          className="w-full bg-background border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary/50 text-foreground font-medium outline-none appearance-none cursor-pointer"
                          value={activeSchedule.timezone}
                          onChange={(e) => updateSchedule(activeSchedule.id, { timezone: e.target.value })}
                        >
                          <option>Eastern Time (US & Canada) (UTC-04:00)</option>
                          <option>IST (India Standard Time) (UTC+05:30)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Days */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground">Days</h3>
                    <div className="flex flex-wrap gap-6 p-6 rounded-2xl bg-background/50 border border-border/50">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <label key={day} className="flex items-center gap-3 cursor-pointer group">
                          <div
                            onClick={() => toggleDay(day)}
                            className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                              activeSchedule.days.includes(day)
                                ? "bg-primary border-primary"
                                : "bg-background border-border group-hover:border-primary/50"
                            }`}
                          >
                            {activeSchedule.days.includes(day) && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                          </div>
                          <span className={`text-sm font-semibold transition-colors ${activeSchedule.days.includes(day) ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground/80'}`}>
                            {day}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button className="h-12 px-10 gap-2 font-bold text-lg bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl transition-all active:scale-95">
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="options" className="mt-0">
            <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Accounts to use */}
              <div className="bg-card/40 rounded-2xl border border-border p-8 py-10 shadow-xl flex items-start justify-between gap-12">
                <div className="space-y-2 flex-1">
                  <h3 className="text-lg font-bold text-foreground">Accounts to use</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Select one or more accounts to send emails from</p>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="relative">
                    <select className="w-full bg-background border border-border rounded-xl p-4 pr-10 focus:ring-2 focus:ring-primary/50 text-foreground font-medium outline-none appearance-none cursor-pointer shadow-inner">
                      <option>Select...</option>
                      <option>sales@oyesell.com</option>
                      <option>support@oyesell.com</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                  </div>
                  <button className="text-sm font-bold text-primary hover:underline flex items-center gap-2 ml-1">
                     <Plus className="h-4 w-4" /> Connect new email account
                  </button>
                </div>
              </div>

              {/* Stop sending on reply */}
              <div className="bg-card/40 rounded-2xl border border-border p-8 py-10 shadow-xl flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground">Stop sending emails on reply</h3>
                  <p className="text-sm text-muted-foreground">Stop sending emails to a lead if a response has been received</p>
                </div>
                <div className="flex bg-background/50 p-1.5 rounded-xl border border-border">
                  <button 
                    onClick={() => setOptions({ ...options, stopOnReply: false })}
                    className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${!options.stopOnReply ? 'bg-secondary text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Disable
                  </button>
                  <button 
                    onClick={() => setOptions({ ...options, stopOnReply: true })}
                    className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${options.stopOnReply ? 'bg-chart-green text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Enable
                  </button>
                </div>
              </div>

              {/* Open Tracking */}
              <div className="bg-card/40 rounded-2xl border border-border p-8 py-10 shadow-xl flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground">Open Tracking</h3>
                  <p className="text-sm text-muted-foreground">Track email opens</p>
                </div>
                <div className="flex items-center gap-8">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div 
                      onClick={() => setOptions({ ...options, linkTracking: !options.linkTracking })}
                      className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${options.linkTracking ? 'bg-primary border-primary' : 'bg-background border-border group-hover:border-primary/50'}`}
                    >
                      {options.linkTracking && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                    </div>
                    <span className="text-sm font-bold text-foreground">Link tracking</span>
                  </label>
                  <div className="flex bg-background/50 p-1.5 rounded-xl border border-border">
                    <button 
                       onClick={() => setOptions({ ...options, openTracking: false })}
                       className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${!options.openTracking ? 'bg-secondary text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      Disable
                    </button>
                    <button 
                       onClick={() => setOptions({ ...options, openTracking: true })}
                       className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${options.openTracking ? 'bg-chart-green text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      Enable
                    </button>
                  </div>
                </div>
              </div>

              {/* Delivery Optimization */}
              <div className="bg-card/40 rounded-2xl border border-border p-8 py-10 shadow-xl flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-foreground">Delivery Optimization</h3>
                    <span className="text-[10px] bg-chart-green/10 text-chart-green px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-chart-green/20">Recommended</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Disables open tracking</p>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer group justify-end">
                    <span className="text-sm font-bold text-foreground">Send emails as text-only (no HTML)</span>
                    <div 
                      onClick={() => setOptions({ ...options, textOnly: !options.textOnly })}
                      className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${options.textOnly ? 'bg-primary border-primary' : 'bg-background border-border group-hover:border-primary/50'}`}
                    >
                      {options.textOnly && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group justify-end">
                    <span className="text-sm font-bold text-foreground flex items-center gap-2">
                      Send first email as text-only 
                      <span className="text-[9px] bg-chart-orange text-black px-1.5 py-0.5 rounded-sm font-black italic">PRO</span>
                    </span>
                    <div 
                      onClick={() => setOptions({ ...options, firstEmailTextOnly: !options.firstEmailTextOnly })}
                      className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${options.firstEmailTextOnly ? 'bg-primary border-primary' : 'bg-background border-border group-hover:border-primary/50'}`}
                    >
                      {options.firstEmailTextOnly && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                    </div>
                  </label>
                </div>
              </div>

              {/* Daily Limit */}
              <div className="bg-card/40 rounded-2xl border border-border p-8 py-10 shadow-xl flex items-center justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground">Daily Limit</h3>
                  <p className="text-sm text-muted-foreground">Max number of emails to send per day for this campaign</p>
                </div>
                <div className="w-32">
                  <input 
                    type="number" 
                    className="w-full bg-background border border-border rounded-xl p-4 text-center text-foreground font-black text-xl focus:ring-2 focus:ring-primary/50 outline-none shadow-inner"
                    value={options.dailyLimit}
                    onChange={(e) => setOptions({ ...options, dailyLimit: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              {/* Advanced Options Toggle */}
              <div className="flex justify-center pt-8">
                <button 
                  onClick={() => setOptions({ ...options, showAdvanced: !options.showAdvanced })}
                  className="flex items-center gap-2 px-6 py-3 rounded-full border border-primary/30 bg-primary/5 text-primary font-bold hover:bg-primary/10 transition-all group"
                >
                  <div className={`w-2 h-2 rounded-full bg-primary ${options.showAdvanced ? 'animate-pulse' : ''}`} />
                  {options.showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${options.showAdvanced ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <div className="pt-12">
                <Button className="w-full h-14 text-xl font-bold bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 rounded-2xl transition-all active:scale-[0.98]">
                  Save Campaign Settings
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
    </div>
  );
}
