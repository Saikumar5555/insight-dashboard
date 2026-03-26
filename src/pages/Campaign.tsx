import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Play, MoreHorizontal, Plus, UserPlus, ChevronLeft, AlertCircle, FileText, Search, Mail, Upload, Globe, Check, Trash2, Sparkles, Eye, Save, Layout, Type, Link as LinkIcon, Image as ImageIcon, Code, X, Send, ShieldCheck, ChevronDown, List, Calendar, Share, Settings, Edit2, Pause, HeartCrack, CheckCircle2, Infinity as InfinityIcon, ArrowRight, BarChart3, Users, GitBranch, SearchIcon, Clock, Terminal, Copy, Download, RefreshCw, Bot, Phone, CheckSquare, Linkedin, MessageSquare, Eye as ViewIcon, Zap, Scissors, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

type StepType = 'automatic_email' | 'manual_email' | 'phone_call' | 'action_item' | 'linkedin_connect' | 'linkedin_message' | 'linkedin_view' | 'linkedin_interact';

interface SequenceStep {
  id: string;
  type: StepType;
  subject?: string;
  body?: string;
  delay: number;
  delayUnit: string;
  priority?: 'Low' | 'Medium' | 'High';
}

interface Schedule {
  id: string;
  name: string;
  fromTime: string;
  toTime: string;
  timezone: string;
  days: string[];
}

type LeadStatus = 'Cold' | 'Approaching' | 'Replied' | 'Interested' | 'Not Interested' | 'Unresponsive';

interface CampaignLead {
  id: string;
  name: string;
  email: string;
  company: string;
  status: LeadStatus;
  lastContacted: string | null;
}

export default function Campaign() {
  const [view, setView] = useState<"list" | "details">("details");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All statuses");
  const [campaigns, setCampaigns] = useState<any[]>([
    { id: "edtech-001", name: "EdTech Growth 2025", status: "Active", leads: 154, sent: 89, opened: 45, clicked: 12, replied: 8, opportunities: 3 }
  ]);
  const [tab, setTab] = useState("leads");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createMode, setCreateMode] = useState<"select" | "manual" | "ai">("select");
  const [newCampaignName, setNewCampaignName] = useState("");
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>("edtech-001");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [renameCampaignId, setRenameCampaignId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState("");

  // AI Form state
  const [aiCompanyName, setAiCompanyName] = useState("");
  const [aiPainPoints, setAiPainPoints] = useState(["", "", ""]);
  const [aiValueProps, setAiValueProps] = useState(["", "", ""]);
  const [aiCta, setAiCta] = useState("");
  const [aiCompanyOverview, setAiCompanyOverview] = useState("");
  const [aiAdditionalContext, setAiAdditionalContext] = useState("");
  const [aiSocialProof, setAiSocialProof] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [showAdditionalInputs, setShowAdditionalInputs] = useState(false);
  
  // Sequence state
  const [steps, setSteps] = useState<SequenceStep[]>([
    {
      id: "s1",
      type: "automatic_email",
      subject: "Helping {{company}} accelerate EdTech sales in 2025",
      body: "Hi {{first_name}},\n\nI noticed {{company}} is focusing on digital learning innovation - curious how you're handling the long decision-making cycles in the EdTech space?\n\nMost EdTech sales teams lose 40% of deals due to complex cycles involving multiple stakeholders. We help teams like yours navigate these ecosystems more effectively.\n\nDo you have 10 minutes next week to discuss your 2025 growth goals?\n\nBest,\n[Your Name]",
      delay: 1,
      delayUnit: "Days"
    },
    {
      id: "s2",
      type: "linkedin_connect",
      body: "Hi {{first_name}}, I've been following {{company}}'s work in the EdTech space and would love to connect and share some insights on sales cycle optimization for growth-stage platforms.",
      delay: 2,
      delayUnit: "Days"
    },
    {
      id: "s3",
      type: "automatic_email",
      subject: "Case Study: Reducing EdTech sales cycles by 50%",
      body: "Hi {{first_name}},\n\nFollowing up on my last email - I wanted to share this case study on how a similar EdTech company reduced their sales cycle from 180 to 90 days by targeting high-intent stakeholders earlier.\n\n[Link to Case Study: EdTech Velocity]\n\nHope you find it useful for {{company}}'s strategy!\n\nBest,\n[Your Name]",
      delay: 2,
      delayUnit: "Days"
    },
    {
      id: "s4",
      type: "linkedin_message",
      subject: "Quick question regarding {{company}}",
      body: "Hi {{first_name}}, saw your recent post about student engagement! Really insightful. Just sent you an email with a case study on sales velocity that might interest you given your role as {{title}}.",
      delay: 2,
      delayUnit: "Days"
    },
    {
      id: "s5",
      type: "automatic_email",
      subject: "What other EdTech leaders are saying",
      body: "Hi {{first_name}},\n\nWe've helped teams at MasterClass and Coursera boost their conversion rates by 30% without increasing their SDR headcount.\n\n\"The ROI was immediate. We scaled our outreach while maintaining the high level of personalization EdTech buyers expect.\"\n\nWould you be open to a quick 15-min discovery call on Thursday?\n\nBest,\n[Your Name]",
      delay: 3,
      delayUnit: "Days"
    },
    {
      id: "s6",
      type: "phone_call",
      priority: "High",
      body: "Leave voicemail referencing previous touches. Mention specific relevance to their role as {{title}} at {{company}}. Focus on the 'Sales Velocity' case study sent on Day 5.",
      delay: 4,
      delayUnit: "Days"
    },
    {
      id: "s7",
      type: "automatic_email",
      subject: "Should I close your file?",
      body: "Hi {{first_name}},\n\nI haven't heard back, so I'm assuming now isn't the best time to discuss {{company}}'s sales outreach strategy. I'll close your file for now to keep your inbox clean.\n\nIf anything changes or if you're looking to scale in H2, feel free to reach out!\n\nBest,\n[Your Name]",
      delay: 3,
      delayUnit: "Days"
    },
    {
      id: "s8",
      type: "linkedin_message",
      body: "No pressure at all {{first_name}}, but here's one final resource: 'EdTech Sales Benchmarks 2025'. Wishing you and the team at {{company}} the best of luck this year!",
      delay: 4,
      delayUnit: "Days"
    }
  ]);
  const [showAddStepDropdown, setShowAddStepDropdown] = useState(false);
  const [activeStepId, setActiveStepId] = useState("s1");
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
    textOnlySequence: false,
    firstEmailTextOnly: false,
    dailyLimit: 30,
    showAdvanced: false
  });

  // Leads State
  const [leads, setLeads] = useState<CampaignLead[]>([
    { id: "l1", name: "Sarah Jenkins", email: "s.jenkins@coursera.org", company: "Coursera", status: "Interested", lastContacted: "2 hours ago" },
    { id: "l2", name: "Michael Chen", email: "m.chen@udacity.com", company: "Udacity", status: "Cold", lastContacted: null },
    { id: "l3", name: "Emily Rodriguez", email: "emily.r@khanacademy.org", company: "Khan Academy", status: "Replied", lastContacted: "1 day ago" },
    { id: "l4", name: "David Park", email: "d.park@duolingo.com", company: "Duolingo", status: "Approaching", lastContacted: "3 hours ago" },
    { id: "l5", name: "Jessica Wu", email: "jessica.wu@masterclass.com", company: "MasterClass", status: "Cold", lastContacted: null },
    { id: "l6", name: "Robert Taylor", email: "r.taylor@byjus.com", company: "Byju's", status: "Unresponsive", lastContacted: "5 days ago" },
    { id: "l7", name: "Amanda Lee", email: "amanda.lee@quizlet.com", company: "Quizlet", status: "Interested", lastContacted: "12 hours ago" },
    { id: "l8", name: "Thomas Wright", email: "t.wright@kahoot.com", company: "Kahoot!", status: "Cold", lastContacted: null },
    { id: "l9", name: "Sophie Martin", email: "s.martin@babbel.com", company: "Babbel", status: "Replied", lastContacted: "Yesterday" },
    { id: "l10", name: "Kevin Jones", email: "k.jones@skillshare.com", company: "Skillshare", status: "Approaching", lastContacted: "4 hours ago" }
  ]);
  const [isSequenceActive, setIsSequenceActive] = useState(false);
  const [showAddLeadsDropdown, setShowAddLeadsDropdown] = useState(false);
  const [activeImportModal, setActiveImportModal] = useState<string | null>(null);
  const [leadFilters, setLeadFilters] = useState({
    status: "All",
    search: ""
  });
  const [showLeadFilters, setShowLeadFilters] = useState(false);

  // Import Modal States
  const [importStep, setImportStep] = useState(1);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  
  const stepsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    stepsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (tab === "sequences") {
      scrollToBottom();
    }
  }, [steps.length]);

  const navigate = useNavigate();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeCampaign = campaigns.find(c => c.id === activeCampaignId);
  const activeStep = steps.find(s => s.id === activeStepId) || steps[0] || { subject: "", body: "" };
  const activeSchedule = schedules.find(s => s.id === activeScheduleId) || schedules[0];

  const updateStep = (id: string, updates: Partial<SequenceStep>) => {
    setSteps(steps.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addStep = (type: StepType) => {
    const newId = Date.now().toString();
    const newStep: SequenceStep = { 
      id: newId, 
      type: type,
      delay: 1, 
      delayUnit: "Days" 
    };

    if (type === 'automatic_email' || type === 'manual_email' || type === 'linkedin_message') {
      newStep.subject = type === 'automatic_email' ? "" : "<Subject>";
      newStep.body = "";
    } else if (type === 'linkedin_connect') {
      newStep.body = "Hi {{first_name}}, I'd love to connect!";
    } else if (type === 'phone_call') {
      newStep.priority = 'Medium';
      newStep.body = "";
    }

    setSteps([...steps, newStep]);
    setActiveStepId(newId);
    setShowAddStepDropdown(false);
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



  const filteredCampaigns = selectedStatus === "All statuses" 
    ? campaigns 
    : campaigns.filter(c => c.status === selectedStatus);

  if (view === "list") {
    return (
      <div className="space-y-8 pt-8 px-8 min-h-full pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center justify-between bg-white/[0.03] backdrop-blur-2xl p-4 rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/5 relative z-20">
          <div className="relative w-96 group">
            <div className="absolute inset-0 bg-primary/5 rounded-xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              className="w-full bg-[#0F0F13] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 text-white placeholder:text-white/20 transition-all shadow-inner"
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
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] text-sm font-bold text-white/70 hover:text-white transition-all">
              <Clock className="h-4 w-4 text-white/30" />
              Newest first <ChevronDown className="h-4 w-4 text-white/30" />
            </button>
            <div className="h-8 w-px bg-white/5 mx-1" />
            <Button variant="ghost" className="gap-2 text-white/50 hover:text-white hover:bg-white/5 px-3">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button variant="ghost" className="gap-2 text-white/50 hover:text-white hover:bg-white/5 px-3">
              <RefreshCw className="h-4 w-4" /> Sync
            </Button>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black px-6 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all duration-300 rounded-xl hover:scale-105"
            >
              <Plus className="h-4 w-4" /> Add New
            </Button>
          </div>
        </div>

        <div className="border border-white/5 bg-white/[0.02] rounded-3xl overflow-visible shadow-2xl backdrop-blur-sm mt-4">
          <div className="grid grid-cols-12 gap-4 p-5 border-b border-white/5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
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
            <div className="py-24 text-center flex flex-col items-center justify-center bg-white/[0.01] animate-in fade-in duration-700">
              <div className="relative mb-6">
                <div className="absolute -inset-6 bg-primary/10 blur-3xl rounded-full" />
                <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 flex items-center justify-center shadow-2xl">
                  <GitBranch className="h-10 w-10 text-white/20" />
                </div>
              </div>
              <p className="font-black text-2xl text-white tracking-tight mb-2">No campaigns yet</p>
              <p className="max-w-xs text-white/40 text-sm mb-8 font-medium">Create your first campaign and start reaching out to leads with AI power.</p>
              <Button 
                onClick={() => setShowCreateModal(true)} 
                className="gap-3 bg-primary text-primary-foreground hover:bg-primary/90 font-black px-8 h-14 rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="h-5 w-5" /> Create Your First Campaign
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
                  className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/[0.04] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer group relative ${openDropdownId === camp.id ? 'z-50' : 'z-10'} border-b border-white/[0.05] last:border-0`}
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
                  <div className="col-span-2 text-primary font-bold">{camp.sent > 0 ? `${Math.round((camp.replied / camp.sent) * 100)}%` : "-"}</div>
                  <div className="col-span-1 text-muted-foreground font-medium">{camp.sent || "-"}</div>
                  <div className="col-span-1 text-muted-foreground font-medium">{camp.clicked || "-"}</div>
                  <div className="col-span-1 text-muted-foreground font-medium">{camp.replied || "-"}</div>
                  <div className="col-span-2 flex items-center justify-between relative">
                    <span className="text-foreground font-bold">{camp.opportunities || "0"}</span>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm animate-in fade-in duration-300 p-4">
            <div className={`bg-[#111116]/90 backdrop-blur-2xl border border-white/10 w-full ${createMode === "ai" ? "max-w-5xl" : "max-w-2xl"} rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300 relative flex flex-col max-h-[90vh]`}>
              
              {createMode === "ai" ? (
                <div className="flex flex-1 overflow-hidden">
                  {/* Left Sidebar */}
                  <div className="w-[35%] bg-gradient-to-b from-[#2D235C]/80 to-[#1A1535]/80 backdrop-blur-3xl p-10 flex flex-col relative overflow-hidden border-r border-white/5">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center gap-2 text-white/80 mb-10">
                        <Sparkles className="h-4 w-4 text-primary- foreground" />
                        <span className="text-xs font-bold tracking-wide uppercase opacity-70">Oyesell AI-powered</span>
                      </div>
                      
                      <h2 className="text-3xl font-black text-white leading-tight mb-6">
                        Let AI assist with your sequences
                      </h2>
                      
                      <p className="text-white/60 text-base leading-relaxed mb-auto">
                        Use Oyesell AI to generate a complete campaign with sequential contact points to engage target audiences at scale.
                      </p>
                      
                      {/* Illustration Placeholder */}
                      <div className="relative w-full aspect-square flex items-center justify-center translate-y-10 scale-125">
                         <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                         <div className="relative">
                            <div className="w-40 h-48 bg-[#9B8AFB] rounded-2xl flex flex-col items-center justify-center shadow-2xl overflow-hidden border border-white/20">
                               <div className="w-full h-1/2 bg-[#8B5CF6] flex items-center justify-center">
                                  <Bot className="h-16 w-16 text-white opacity-40" />
                               </div>
                               <div className="flex-1 w-full bg-[#E5E7EB] p-4 flex flex-col gap-2">
                                  <div className="w-full h-2 bg-gray-300 rounded" />
                                  <div className="w-2/3 h-2 bg-gray-300 rounded" />
                               </div>
                            </div>
                            <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-[#8B5CF6] flex items-center justify-center shadow-xl border-4 border-[#2D235C]">
                               <Sparkles className="h-8 w-8 text-white" />
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Content */}
                  <div className="flex-1 flex flex-col bg-[#111116]">
                    <div className="p-6 border-b border-white/5 flex items-center justify-end">
                      <Button variant="ghost" size="icon" onClick={() => { setShowCreateModal(false); setCreateMode("select"); }} className="hover:bg-white/10 text-white/70 hover:text-white rounded-full">
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                      <h3 className="text-xl font-bold text-white mb-6">Review your company information</h3>
                      
                      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex gap-4 mb-8 shadow-inner">
                        <AlertCircle className="h-5 w-5 text-primary/60 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-white/50 leading-relaxed">
                          Oyesell will try to pre-fill the sections below using your existing information. We recommend editing as needed to help generate higher quality content. This content will be used only for this sequence, and won't impact other team members' work.
                        </p>
                      </div>
                      
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <label className="text-sm font-bold text-white flex items-center gap-1">
                            Company or product name<span className="text-red-500">*</span>
                          </label>
                          <p className="text-xs text-white/30">Add your company, product, or service name.</p>
                          <input 
                            type="text" 
                            placeholder="E.g. intelliod.com"
                            className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.05] transition-all duration-300 shadow-inner"
                            value={aiCompanyName}
                            onChange={(e) => setAiCompanyName(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <label className="text-sm font-bold text-white flex items-center gap-1">
                            Customer pain points<span className="text-red-500">*</span>
                          </label>
                          <p className="text-xs text-white/30">Add at least 3 pain points your product or service is solving.</p>
                          <textarea 
                            placeholder="E.g. Too much manual work finding prospects and creating personalized outreaches"
                            className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.05] transition-all duration-300 shadow-inner h-32 resize-none"
                            value={aiPainPoints.join("\n")}
                            onChange={(e) => setAiPainPoints(e.target.value.split("\n"))}
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <label className="text-sm font-bold text-white flex items-center gap-1">
                            Value proposition<span className="text-red-500">*</span>
                          </label>
                          <p className="text-xs text-white/30">Add at least 3 benefits of using your product/service.</p>
                          <textarea 
                            placeholder="E.g. End-to-end sales funnel automation"
                            className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.05] transition-all duration-300 shadow-inner h-32 resize-none"
                            value={aiValueProps.join("\n")}
                            onChange={(e) => setAiValueProps(e.target.value.split("\n"))}
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <label className="text-sm font-bold text-white flex items-center gap-1">
                            Call-to-action<span className="text-red-500">*</span>
                          </label>
                          <p className="text-xs text-white/30">Add an action you want the recipient to take. E.g. Book a meeting</p>
                          <textarea 
                            placeholder="E.g. Book a demo"
                            className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.05] transition-all duration-300 shadow-inner h-32 resize-none"
                            value={aiCta}
                            onChange={(e) => setAiCta(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <button 
                            onClick={() => setShowAdditionalInputs(!showAdditionalInputs)}
                            className="flex items-center gap-2 text-primary font-bold text-sm hover:text-primary/80 transition-colors"
                          >
                            {showAdditionalInputs ? "Hide additional inputs" : "Show additional inputs"}
                            <ChevronDown className={`h-4 w-4 transition-transform ${showAdditionalInputs ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                        
                        {showAdditionalInputs && (
                          <div className="space-y-8 animate-in slide-in-from-top-2 duration-300">
                             <div className="space-y-3">
                              <label className="text-sm font-bold text-white">Company overview</label>
                              <p className="text-xs text-white/30">Add a brief description of what your company or product does.</p>
                              <textarea 
                                placeholder="E.g. The only data intelligence and sales engagement platform you'll ever need"
                                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.05] transition-all duration-300 shadow-inner h-32 resize-none"
                                value={aiCompanyOverview}
                                onChange={(e) => setAiCompanyOverview(e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-3">
                              <label className="text-sm font-bold text-white">Additional context</label>
                              <p className="text-xs text-white/30">Add other details, such as a customer quote, to enhance the content.</p>
                              <textarea 
                                placeholder='E.g. "Oyesell made it easy for me to test out different content to land the perfect email messages." -John Smith'
                                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.05] transition-all duration-300 shadow-inner h-32 resize-none"
                                value={aiAdditionalContext}
                                onChange={(e) => setAiAdditionalContext(e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-3">
                              <label className="text-sm font-bold text-white">Social proof</label>
                              <p className="text-xs text-white/30">Add customer quotes or stats that build credibility.</p>
                              <textarea 
                                placeholder="What case studies and results can you mention?"
                                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/[0.05] transition-all duration-300 shadow-inner h-32 resize-none"
                                value={aiSocialProof}
                                onChange={(e) => setAiSocialProof(e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Fixed Footer */}
                    <div className="p-4 border-t border-white/5 bg-[#111116] flex items-center justify-end gap-3 px-10 py-6">
                      <Button 
                        variant="ghost" 
                        onClick={() => { setShowCreateModal(false); setCreateMode("select"); }}
                        className="text-white/60 hover:text-white hover:bg-white/5 font-bold h-11 px-6 rounded-xl"
                      >
                        Cancel
                      </Button>
                      <Button
                        className="h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20"
                        disabled={
                          !aiCompanyName.trim() ||
                          aiPainPoints.filter(p => p.trim()).length < 1 ||
                          aiValueProps.filter(v => v.trim()).length < 1 ||
                          !aiCta.trim() ||
                          aiGenerating
                        }
                        onClick={() => {
                          setAiGenerating(true);
                          setTimeout(() => {
                            const newId = Date.now().toString();
                            const campaignName = aiCompanyName ? `${aiCompanyName} Campaign` : "AI Campaign";
                            setCampaigns(prev => [...prev, { id: newId, name: campaignName, status: "Draft" }]);
                            setActiveCampaignId(newId);
                            setShowCreateModal(false);
                            setCreateMode("select");
                            setAiGenerating(false);
                            setAiCompanyName(""); setAiPainPoints(["","",""]); setAiValueProps(["","",""]);
                            setAiCta(""); setAiCompanyOverview(""); setAiAdditionalContext(""); setAiSocialProof("");
                            setView("details");
                            showToast("AI Campaign generated successfully! ✨");
                          }, 1800);
                        }}
                      >
                        {aiGenerating ? (
                           <><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Generating...</>
                        ) : (
                          <><Sparkles className="h-4 w-4" /> Generate new sequence</>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
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
                          className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20 rounded-xl transition-all"
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
                  </div>
                </>
              )}
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
              <div className="flex items-center gap-2 mr-4">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isSequenceActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {isSequenceActive ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => {
                    if (!isSequenceActive) {
                      if (leads.length === 0) {
                        showToast("Add contacts before activating!");
                        return;
                      }
                      if (steps.length === 0) {
                        showToast("Add sequence steps before activating!");
                        return;
                      }
                      setIsSequenceActive(true);
                      showToast("Sequence activated! 🚀");
                    } else {
                      setIsSequenceActive(false);
                      showToast("Sequence paused.");
                    }
                  }}
                  className={`w-10 h-5 rounded-full relative transition-all duration-300 ${isSequenceActive ? 'bg-primary' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${isSequenceActive ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
              <Button size="sm" className="gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20" onClick={() => showToast("Campaign resumed!")}>
                <Play className="h-3 w-3 fill-current" /> Resume campaign
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-accent border-border/50">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="leads" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6 pb-20 pt-4 px-4 max-w-[1400px] mx-auto">
              {/* Top Bar Navigation */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-4 shadow-xl backdrop-blur-md relative z-30">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setShowLeadFilters(!showLeadFilters)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all ${showLeadFilters ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-white/5 border-white/10 text-white/50 hover:text-white'}`}
                  >
                    <Sliders className="h-3.5 w-3.5" />
                    {showLeadFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>

                  <div className="flex items-center gap-4 border-l border-white/10 pl-6 h-8">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em]">Total</span>
                      <span className="text-sm font-black text-white">{leads.length}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.15em]">Replied</span>
                      <span className="text-sm font-black text-emerald-400">{leads.filter(l => l.status === 'Replied').length}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-blue-500/50 uppercase tracking-[0.15em]">Approaching</span>
                      <span className="text-sm font-black text-blue-400">{leads.filter(l => l.status === 'Approaching').length}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Button 
                      onClick={() => setShowAddLeadsDropdown(!showAddLeadsDropdown)}
                      className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-black px-5 h-10 shadow-lg shadow-primary/20 rounded-xl"
                    >
                      <UserPlus className="h-4 w-4" /> Add Contacts
                    </Button>
                    
                    {showAddLeadsDropdown && (
                      <div className="absolute right-0 top-full mt-2 w-64 rounded-[20px] border border-white/10 shadow-3xl bg-[#0F0F13] overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-2 space-y-1">
                          {[
                            { id: 'search', label: 'Prospect Searcher', icon: SearchIcon, color: 'text-purple-400', desc: 'Find from 250M+ pool' },
                            { id: 'csv', label: 'Upload CSV', icon: Upload, color: 'text-blue-400', desc: 'Import your spreadsheet' },
                            { id: 'list', label: 'Select List', icon: List, color: 'text-emerald-400', desc: 'Use existing contact lists' },
                            { id: 'ai', label: 'Automate (AI)', icon: Bot, color: 'text-amber-400', desc: 'AI-driven persona search' },
                          ].map((opt) => (
                            <button 
                              key={opt.id} 
                              onClick={() => { setActiveImportModal(opt.id); setShowAddLeadsDropdown(false); setImportStep(1); }} 
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-xl hover:bg-white/5 transition-colors group"
                            >
                              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <opt.icon className={`h-4 w-4 ${opt.color}`} />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[11px] font-black text-white uppercase tracking-wider">{opt.label}</div>
                                <div className="text-[9px] font-medium text-white/30 truncate">{opt.desc}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable Filters Section */}
              {showLeadFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/[0.01] border border-white/5 rounded-2xl p-6 animate-in slide-in-from-top-4 duration-300">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/20 uppercase tracking-widest pl-1">Search Contacts</label>
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
                        <input 
                          type="text" 
                          placeholder="Name, email, company..." 
                          className="w-full bg-black/40 border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary/40 transition-all font-medium"
                          value={leadFilters.search}
                          onChange={(e) => setLeadFilters({...leadFilters, search: e.target.value})}
                        />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/20 uppercase tracking-widest pl-1">Status Filter</label>
                     <select 
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary/40 transition-all font-medium appearance-none"
                        value={leadFilters.status}
                        onChange={(e) => setLeadFilters({...leadFilters, status: e.target.value})}
                     >
                       <option value="All">All Statuses</option>
                       <option value="Cold">Cold</option>
                       <option value="Approaching">Approaching</option>
                       <option value="Replied">Replied</option>
                       <option value="Interested">Interested</option>
                     </select>
                   </div>
                </div>
              )}

              {leads.length === 0 ? (
                /* Empty State */
                <div className="py-24 text-center flex flex-col items-center justify-center bg-white/[0.01] border border-dashed border-white/10 rounded-[40px] animate-in fade-in duration-700">
                  <div className="relative mb-6">
                    <div className="absolute -inset-10 bg-primary/5 blur-[80px] rounded-full" />
                    <div className="relative w-24 h-24 rounded-[32px] bg-gradient-to-br from-[#1A1A24] to-[#0A0A0F] border border-white/10 flex items-center justify-center shadow-2xl group overflow-hidden">
                       <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                       <Users className="h-10 w-10 text-white/20" />
                       {isSequenceActive && <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-ping" />}
                    </div>
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight mb-2 uppercase">No records found</h2>
                  <p className="max-w-xs text-white/30 text-[13px] mb-8 font-medium leading-relaxed">
                    Start by adding contacts to your sequence. You can import from our B2B database, upload a CSV, or use AI.
                  </p>
                  <Button 
                    onClick={() => setShowAddLeadsDropdown(true)}
                    className="gap-3 bg-white text-black hover:bg-white/90 font-black px-10 h-14 rounded-2xl shadow-2xl shadow-white/5 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-xs"
                  >
                    <Plus className="h-5 w-5" /> Add First Contacts
                  </Button>
                </div>
              ) : (
                /* Contacts Table */
                <div className="bg-[#0A0A0F] border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm relative z-10">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-white/[0.02] border-b border-white/5">
                          <th className="p-5 text-left text-[10px] font-black text-white/30 uppercase tracking-[0.2em] w-12">
                            <div className="w-4 h-4 rounded border border-white/10 flex items-center justify-center" />
                          </th>
                          <th className="p-5 text-left text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Name</th>
                          <th className="p-5 text-left text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Email</th>
                          <th className="p-5 text-left text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Company</th>
                          <th className="p-5 text-left text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Status</th>
                          <th className="p-5 text-left text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Last Contacted</th>
                          <th className="p-5 text-right text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03]">
                        {leads
                          .filter(l => leadFilters.status === 'All' || l.status === leadFilters.status)
                          .filter(l => !leadFilters.search || 
                            l.name.toLowerCase().includes(leadFilters.search.toLowerCase()) ||
                            l.email.toLowerCase().includes(leadFilters.search.toLowerCase()) ||
                            l.company.toLowerCase().includes(leadFilters.search.toLowerCase())
                          )
                          .map((lead) => (
                          <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="p-5">
                              <div className="w-4 h-4 rounded border border-white/10 group-hover:border-primary/50 transition-colors" />
                            </td>
                            <td className="p-5">
                              <span className="font-bold text-sm text-white">{lead.name}</span>
                            </td>
                            <td className="p-5">
                              <span className="text-xs font-medium text-white/50">{lead.email}</span>
                            </td>
                            <td className="p-5">
                              <span className="text-xs font-medium text-white/50">{lead.company}</span>
                            </td>
                            <td className="p-5">
                              {lead.status === 'Cold' && <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-tighter">Cold</span>}
                              {lead.status === 'Approaching' && <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-tighter">Approaching</span>}
                              {lead.status === 'Replied' && <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-tighter">Replied</span>}
                              {lead.status === 'Interested' && <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary uppercase tracking-tighter">Interested</span>}
                              {lead.status === 'Not Interested' && <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-black text-red-500 uppercase tracking-tighter">Not Interested</span>}
                              {lead.status === 'Unresponsive' && <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black text-amber-500 uppercase tracking-tighter">Unresponsive</span>}
                            </td>
                            <td className="p-5">
                              <span className="text-[11px] font-medium text-white/30">{lead.lastContacted || 'Never'}</span>
                            </td>
                            <td className="p-5 text-right relative">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-white/20 hover:text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdownId(openDropdownId === lead.id ? null : lead.id);
                                }}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                              
                              {openDropdownId === lead.id && (
                                <div className="absolute right-8 top-full -mt-2 w-48 rounded-xl border border-white/10 shadow-2xl bg-[#111116] overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-200">
                                  <div className="p-1.5 space-y-0.5">
                                    <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors">
                                      <Pause className="h-3.5 w-3.5" /> Pause
                                    </button>
                                    <button 
                                      className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-lg hover:bg-white/5 text-red-500/70 hover:text-red-500 transition-colors"
                                      onClick={() => setLeads(leads.filter(l => l.id !== lead.id))}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" /> Remove
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-colors">
                                      <ViewIcon className="h-3.5 w-3.5" /> View Activity
                                    </button>
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Import Modals */}
            {activeImportModal && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                <div className="bg-[#0F0F13] border border-white/10 w-full max-w-3xl rounded-[32px] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-300 relative flex flex-col max-h-[90vh]">
                  
                  {/* Modal Header */}
                  <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                        {activeImportModal === 'search' && 'Prospect Searcher'}
                        {activeImportModal === 'csv' && 'Upload CSV'}
                        {activeImportModal === 'list' && 'Select List'}
                        {activeImportModal === 'ai' && 'Automate (AI)'}
                      </h2>
                      <p className="text-xs text-white/30 font-medium mt-1">
                        {activeImportModal === 'search' && 'Search through our global pool of over 250 million prospects'}
                        {activeImportModal === 'csv' && 'Import your existing contacts via CSV spreadsheet'}
                        {activeImportModal === 'list' && 'Choose from one of your previously saved contact lists'}
                        {activeImportModal === 'ai' && 'Our AI will find prospects matching your ICP automatically'}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setActiveImportModal(null)} className="h-10 w-10 text-white/30 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                      <X className="h-6 w-6" />
                    </Button>
                  </div>

                  {/* Modal Content - CSV Flow Example */}
                  {activeImportModal === 'csv' && (
                    <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                      {/* Steps Indicator */}
                      <div className="flex items-center justify-center mb-12 relative max-w-sm mx-auto">
                         <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5 -translate-y-1/2 z-0" />
                         {[1, 4].map((s, idx) => (
                           <div key={s} className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all duration-500 ${importStep >= s ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-[#1A1A24] text-white/20 border border-white/10'}`}>
                             {importStep > s ? <Check className="h-4 w-4" /> : (idx + 1)}
                             <div className="absolute top-full mt-2 text-[9px] font-black uppercase tracking-widest whitespace-nowrap text-center w-max opacity-60">
                               {s === 1 && 'Upload'}
                               {s === 4 && 'Import'}
                             </div>
                           </div>
                         ))}
                      </div>

                      {importStep === 1 && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                          <div 
                            className="border-2 border-dashed border-white/10 rounded-[32px] p-20 flex flex-col items-center justify-center gap-4 bg-white/[0.01] hover:bg-white/[0.02] hover:border-primary/40 transition-all cursor-pointer group"
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = '.csv';
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) { setCsvFile(file); setImportStep(4); }
                              };
                              input.click();
                            }}
                          >
                             <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform">
                               <Upload className="h-8 w-8 text-white/20 group-hover:text-primary transition-colors" />
                             </div>
                             <div className="text-center">
                               <p className="text-sm font-black text-white">Drag & drop CSV file or click to browse</p>
                               <p className="text-[11px] font-medium text-white/20 mt-1">UTF-8 encoded CSV files are recommended</p>
                             </div>
                          </div>
                        </div>
                      )}

                      {/* Step 2 and 3 removed to simplify flow */}

                      {importStep === 4 && (
                        <div className="text-center py-10 animate-in zoom-in-95 duration-500">
                           <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                              <Check className="h-10 w-10 text-emerald-500" />
                           </div>
                           <h3 className="text-xl font-black text-white uppercase mb-2">Ready to Import</h3>
                           <p className="text-sm text-white/40 mb-8 max-w-xs mx-auto">We found 150 contacts in your CSV file. Are you sure you want to import them?</p>
                           <Button 
                             onClick={() => {
                               const mockLeads: CampaignLead[] = [
                                 { id: '1', name: 'John Doe', email: 'john@example.com', company: 'Acme Inc', status: 'Cold', lastContacted: null },
                                 { id: '2', name: 'Jane Smith', email: 'jane@test.com', company: 'Global Tech', status: 'Approaching', lastContacted: null },
                                 { id: '3', name: 'Mike Ross', email: 'mike@ross.com', company: 'Pearson Hardman', status: 'Replied', lastContacted: '2 hours ago' }
                               ];
                               // Use the mock leads we created earlier but add more to reach 150 count
                               const importedLeads: CampaignLead[] = [
                                 ...leads,
                                 { id: 'imp-1', name: 'James Wilson', email: 'j.wilson@udemy.com', company: 'Udemy', status: 'Cold' as LeadStatus, lastContacted: null },
                                 { id: 'imp-2', name: 'Lisa Chen', email: 'lisa@edx.org', company: 'edX', status: 'Cold' as LeadStatus, lastContacted: null }
                               ];
                               setLeads(importedLeads);
                               setActiveImportModal(null);
                               setTab("sequences");
                               showToast("150 Contacts imported successfully! ⚡ Redirecting to sequence...");
                             }}
                             className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl shadow-xl shadow-emerald-500/10"
                           >
                             Import 150 Contacts
                           </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Prospect Searcher Flow */}
                  {activeImportModal === 'search' && (
                    <div className="flex-1 flex overflow-hidden">
                       {/* Filters Panel (Left) */}
                       <div className="w-72 border-r border-white/5 bg-white/[0.01] p-6 space-y-6 overflow-y-auto custom-scrollbar">
                          <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Job Title</label>
                            <input type="text" placeholder="e.g. VP Sales" className="w-full bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white" />
                          </div>
                          <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Company</label>
                            <input type="text" placeholder="e.g. Google" className="w-full bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white" />
                          </div>
                          <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Location</label>
                            <input type="text" placeholder="e.g. New York" className="w-full bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white" />
                          </div>
                          <Button className="w-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest h-10">Search</Button>
                       </div>

                       {/* Results Table (Right) */}
                       <div className="flex-1 flex flex-col min-w-0">
                          <div className="flex-1 overflow-y-auto custom-scrollbar">
                             <table className="w-full border-collapse">
                                <thead className="sticky top-0 bg-[#0F0F13] z-10">
                                   <tr className="border-b border-white/5 text-[9px] font-black uppercase text-white/20 tracking-widest">
                                      <th className="p-4 text-left w-12"><div className="w-4 h-4 rounded border border-white/10" /></th>
                                      <th className="p-4 text-left">Prospect</th>
                                      <th className="p-4 text-left">Title</th>
                                      <th className="p-4 text-left">Company</th>
                                   </tr>
                                </thead>
                                <tbody>
                                   {[
                                      { name: 'Sarah Connor', title: 'VP Sales', company: 'Cyberdyne Systems' },
                                      { name: 'John Matrix', title: 'Sales Director', company: 'Commando Inc' },
                                      { name: 'Ellen Ripley', title: 'Marketing Lead', company: 'Weyland-Yutani' }
                                   ].map((res, i) => (
                                     <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] text-xs transition-colors">
                                       <td className="p-4 text-left"><div className="w-4 h-4 rounded border border-white/10" /></td>
                                       <td className="p-4 font-bold text-white">{res.name}</td>
                                       <td className="p-4 text-white/40">{res.title}</td>
                                       <td className="p-4 text-white/40">{res.company}</td>
                                     </tr>
                                   ))}
                                </tbody>
                             </table>
                          </div>
                          <div className="p-6 border-t border-white/5 flex justify-between items-center px-8">
                             <div className="text-[10px] font-black text-white/20 uppercase tracking-widest">3 selected</div>
                             <Button 
                                onClick={() => {
                                  const newLeads: CampaignLead[] = [
                                    { id: '101', name: 'Sarah Connor', email: 'sarah@cyberdyne.com', company: 'Cyberdyne Systems', status: 'Cold', lastContacted: null },
                                    { id: '102', name: 'John Matrix', email: 'john@commando.com', company: 'Commando Inc', status: 'Cold', lastContacted: null },
                                    { id: '103', name: 'Ellen Ripley', email: 'ellen@weyland.com', company: 'Weyland-Yutani', status: 'Cold', lastContacted: null }
                                  ];
                                  setLeads([...leads, ...newLeads]);
                                  setActiveImportModal(null);
                                  showToast("3 Prospects added to sequence!");
                                }}
                                className="bg-primary text-white font-black rounded-xl h-10 px-8 text-xs uppercase tracking-widest"
                             >
                               Add Selected
                             </Button>
                          </div>
                       </div>
                    </div>
                  )}

                  {/* Automate (AI) Flow */}
                  {activeImportModal === 'ai' && (
                    <div className="flex-1 overflow-y-auto p-10 custom-scrollbar animate-in fade-in duration-500">
                      <div className="max-w-xl mx-auto space-y-8">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Ideal Customer Persona (ICP)</label>
                           <textarea 
                             placeholder="e.g. Mid-to-late stage B2B SaaS founders in the marketing technology space"
                             className="w-full bg-[#1A1A24] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-primary/40 h-32 resize-none transition-all placeholder:text-white/10"
                           />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Industry</label>
                              <input type="text" placeholder="e.g. SaaS" className="w-full bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-3 text-xs text-white" />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Role</label>
                              <input type="text" placeholder="e.g. CEO, Founder" className="w-full bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-3 text-xs text-white" />
                           </div>
                        </div>

                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-white/30 uppercase tracking-widest pl-1">Location</label>
                           <input type="text" placeholder="e.g. United States, Europe" className="w-full bg-[#1A1A24] border border-white/10 rounded-xl px-4 py-3 text-xs text-white" />
                        </div>

                        <Button 
                          className="w-full h-14 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black rounded-2xl shadow-2xl shadow-primary/20 uppercase tracking-[0.2em] text-[11px] group"
                          onClick={() => {
                            showToast("AI is hunting for prospects... 🤖✨");
                            setTimeout(() => {
                              const aiLeads: CampaignLead[] = [
                                { id: 'ai-1', name: 'James Dyson', email: 'james@dyson.com', company: 'Dyson Ltd', status: 'Cold', lastContacted: null },
                                { id: 'ai-2', name: 'Whitney Wolfe Herd', email: 'whitney@bumble.com', company: 'Bumble', status: 'Cold', lastContacted: null }
                              ];
                              setLeads([...leads, ...aiLeads]);
                              setActiveImportModal(null);
                              showToast("AI found 2 matching prospects!");
                            }, 2000);
                          }}
                        >
                          <Sparkles className="h-4 w-4 mr-3 group-hover:rotate-12 transition-transform" />
                          Start Automation
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Select List Flow */}
                  {activeImportModal === 'list' && (
                    <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { name: 'Q1 Outreach', count: 450, date: '2 days ago' },
                            { name: 'SaaS CEOs', count: 120, date: '1 week ago' },
                            { name: 'Tech Events 2024', count: 890, date: '3 weeks ago' }
                          ].map((list, i) => (
                            <div 
                              key={i} 
                              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-primary/10 hover:border-primary/30 transition-all group cursor-pointer"
                              onClick={() => {
                                setLeads([...leads, { id: `list-${i}`, name: 'List Contact', email: 'list@example.com', company: list.name, status: 'Cold', lastContacted: null }]);
                                setActiveImportModal(null);
                                showToast(`${list.name} contacts added!`);
                              }}
                            >
                               <div className="flex items-center justify-between mb-4">
                                  <List className="h-5 w-5 text-emerald-400" />
                                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{list.date}</span>
                               </div>
                               <h3 className="font-black text-white uppercase tracking-tight">{list.name}</h3>
                               <p className="text-[11px] text-white/30 font-bold mt-1 uppercase tracking-widest">{list.count} contacts</p>
                            </div>
                          ))}
                       </div>
                    </div>
                  )}

                  {/* Placeholder for other flows */}
                  {activeImportModal !== 'csv' && activeImportModal !== 'search' && activeImportModal !== 'ai' && activeImportModal !== 'list' && (
                    <div className="p-20 text-center space-y-4">
                       <Bot className="h-12 w-12 text-white/10 mx-auto" />
                       <p className="text-white/40 font-bold tracking-widest text-xs uppercase">{activeImportModal} flow coming soon</p>
                       <Button variant="outline" onClick={() => setActiveImportModal(null)} className="border-white/10 text-white/60 hover:text-white">Close</Button>
                    </div>
                  )}

                  {/* Modal Footer */}
                  {importStep < 4 && activeImportModal === 'csv' && (
                    <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-between items-center px-10">
                       <button onClick={() => setImportStep(Math.max(1, importStep - 1))} className="text-[10px] font-black uppercase text-white/30 hover:text-white transition-colors">Back</button>
                       <p className="text-[9px] font-black text-white/10 uppercase tracking-widest">Step {importStep} of 4</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sequences" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`max-w-3xl mx-auto space-y-4 pb-20 pt-4 ${steps.length === 0 ? 'flex flex-col items-center justify-center min-h-[450px] border border-dashed border-border/20 rounded-[32px] bg-card/5 mt-8' : ''}`}>
              {steps.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-black text-foreground tracking-tight">Sequence Builder</h2>
                      <p className="text-sm text-muted-foreground font-medium">Design your automated outreach flow.</p>
                    </div>
                    <div className="relative">
                      <Button 
                        onClick={() => setShowAddStepDropdown(!showAddStepDropdown)} 
                        className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 rounded-xl h-10 px-5"
                      >
                        <Plus className="h-4 w-4" /> Add Step
                      </Button>

                      {showAddStepDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-border shadow-2xl bg-[#1a1a20] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                          <div className="p-1.5 space-y-0.5">
                            {[
                              { id: 'automatic_email', label: 'Automatic email', icon: Mail, color: 'text-blue-400' },
                              { id: 'manual_email', label: 'Manual email', icon: Edit2, color: 'text-emerald-400' },
                              { id: 'phone_call', label: 'Phone call', icon: Phone, color: 'text-yellow-500' },
                              { id: 'action_item', label: 'Action item', icon: CheckSquare, color: 'text-purple-400' },
                            ].map((opt) => (
                              <button key={opt.id} onClick={() => addStep(opt.id as StepType)} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/5 text-foreground transition-colors text-left">
                                <opt.icon className={`h-4 w-4 ${opt.color}`} /> {opt.label}
                              </button>
                            ))}
                            <div className="h-px bg-white/5 my-1" />
                            {[
                              { id: 'linkedin_connect', label: 'LinkedIn - connection request', icon: Linkedin },
                              { id: 'linkedin_message', label: 'LinkedIn - send message', icon: MessageSquare },
                              { id: 'linkedin_view', label: 'LinkedIn - view profile', icon: ViewIcon },
                              { id: 'linkedin_interact', label: 'LinkedIn - interact with post', icon: Zap }
                            ].map((opt) => (
                              <button key={opt.id} onClick={() => addStep(opt.id as StepType)} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-white/5 text-foreground transition-colors text-left">
                                <opt.icon className="h-4 w-4 text-blue-500" /> {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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
                            <h3 className="font-bold text-foreground text-sm uppercase tracking-wide flex items-center gap-2">
                              {step.type === 'automatic_email' && <><Mail className="h-3.5 w-3.5 text-blue-400" /> Automatic email</>}
                              {step.type === 'manual_email' && <><Edit2 className="h-3.5 w-3.5 text-emerald-400" /> Manual email</>}
                              {step.type === 'phone_call' && <><Phone className="h-3.5 w-3.5 text-yellow-500" /> Phone call</>}
                              {step.type === 'action_item' && <><CheckSquare className="h-3.5 w-3.5 text-purple-400" /> Action item</>}
                              {step.type === 'linkedin_connect' && <><Linkedin className="h-3.5 w-3.5 text-blue-500" /> LinkedIn Connect</>}
                              {step.type === 'linkedin_message' && <><MessageSquare className="h-3.5 w-3.5 text-blue-500" /> LinkedIn Message</>}
                              {step.type === 'linkedin_view' && <><ViewIcon className="h-3.5 w-3.5 text-blue-500" /> LinkedIn View</>}
                              {step.type === 'linkedin_interact' && <><Zap className="h-3.5 w-3.5 text-blue-500" /> LinkedIn Interact</>}
                            </h3>
                          </div>
                          <div className="flex items-center gap-4">
                            {step.type === 'phone_call' && (
                              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60">
                                <Clock className="h-3 w-3" />
                                Schedules task immediately with due date in 30 minutes
                              </div>
                            )}
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
                        </div>

                        {activeStepId === step.id ? (
                          <div className="space-y-6 animate-in zoom-in-95 duration-200 mt-6 border-t border-border/50 pt-6">
                            {step.type === 'phone_call' ? (
                              <>
                                <div className="space-y-2.5">
                                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                                    Task priority <span className="text-destructive">*</span>
                                  </label>
                                  <div className="max-w-[240px]">
                                    <select 
                                      className="w-full bg-background/50 border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground font-bold transition-all shadow-inner cursor-pointer"
                                      value={step.priority || 'Medium'}
                                      onChange={(e) => updateStep(step.id, { priority: e.target.value as 'Low' | 'Medium' | 'High' })}
                                    >
                                      <option>Low</option>
                                      <option>Medium</option>
                                      <option>High</option>
                                    </select>
                                  </div>
                                </div>
                                
                                <div className="space-y-2.5">
                                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">Task note</label>
                                  <div className="relative group border border-border rounded-2xl bg-background/50 focus-within:ring-2 focus-within:ring-primary/50 transition-all overflow-hidden">
                                    <textarea 
                                      placeholder="e.g. Ask prospects about their pain points and share our compatibility case study with them" 
                                      className="w-full h-48 bg-transparent p-5 text-foreground text-sm resize-none custom-scrollbar font-medium outline-none leading-relaxed"
                                      value={step.body || ""}
                                      onChange={(e) => updateStep(step.id, { body: e.target.value })}
                                    />
                                    <div className="px-3 pb-3 flex items-center gap-1">
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-white/5">
                                        <Code className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-white/5">
                                        <Scissors className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4 pt-2">
                                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Write with AI</p>
                                  <Button variant="outline" className="h-12 px-5 rounded-2xl border border-border bg-background/30 hover:bg-primary/5 hover:border-primary/30 text-foreground font-bold gap-3 transition-all active:scale-95">
                                    <Bot className="h-5 w-5 text-primary" />
                                    Personalized call guide
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <>
                                {(step.type === 'automatic_email' || step.type === 'manual_email' || step.type === 'linkedin_message') && (
                                  <input 
                                    type="text" 
                                    placeholder={step.type === 'linkedin_message' ? "Message Subject (Optional)" : "Subject line"}
                                    className="w-full bg-background/50 border border-border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground font-bold transition-all shadow-inner"
                                    value={step.subject || ""}
                                    onChange={(e) => updateStep(step.id, { subject: e.target.value })}
                                  />
                                )}
                                <textarea 
                                  placeholder={
                                    step.type === 'action_item' ? "Task description..." : 
                                    step.type === 'linkedin_view' ? "Instructions for profile viewing..." : 
                                    "Write your message here..."
                                  } 
                                  className="w-full h-56 bg-background/50 border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground text-sm resize-none custom-scrollbar font-medium shadow-inner leading-relaxed"
                                  value={step.body || ""}
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
                              </>
                            )}

                            <div className="pt-4 border-t border-border/30">
                              <Button 
                                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                                onClick={() => setActiveStepId("")}
                              >
                                Save Changes
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="bg-background/40 rounded-xl p-5 border border-border/40 cursor-pointer hover:bg-background/60 transition-colors shadow-inner mt-2 group"
                            onClick={() => setActiveStepId(step.id)}
                          >
                            {step.type === 'phone_call' && (
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                  step.priority === 'High' ? 'bg-destructive/10 text-destructive' : 
                                  step.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : 
                                  'bg-blue-500/10 text-blue-500'
                                }`}>
                                  {step.priority || 'Medium'} Priority
                                </span>
                              </div>
                            )}
                            {(step.type === 'automatic_email' || step.type === 'manual_email' || step.type === 'linkedin_message') && (
                              <p className="text-sm font-bold text-foreground mb-2 truncate group-hover:text-primary transition-colors">{step.subject || "(No subject set)"}</p>
                            )}
                            <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-2">{step.body || "Click to configure this step..."}</p>
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
                  <div ref={stepsEndRef} />
                </>
              ) : (
                <div className="text-center animate-in fade-in zoom-in-95 duration-500 py-12">
                  <div className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 flex items-center justify-center shadow-2xl mx-auto mb-8 relative">
                    <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full" />
                    <Layout className="h-10 w-10 text-primary relative z-10" />
                  </div>
                  <h3 className="text-3xl font-black text-foreground mb-3 tracking-tight">Your sequence is empty</h3>
                  <p className="text-muted-foreground text-base mb-10 max-w-sm mx-auto font-medium leading-relaxed">Add steps to build your automated outreach sequence and engage with your leads at scale.</p>
                  
                  <div className="relative inline-block">
                    <Button 
                      onClick={() => setShowAddStepDropdown(!showAddStepDropdown)} 
                      className="gap-3 bg-primary text-primary-foreground hover:bg-primary/90 font-black px-12 h-16 rounded-2xl shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 text-lg"
                    >
                      <Plus className="h-6 w-6" /> Add a step
                    </Button>

                    {showAddStepDropdown && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-6 w-80 rounded-[24px] border border-border shadow-[0_25px_60px_rgba(0,0,0,0.6)] bg-[#1a1a24] overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="p-2.5 space-y-1">
                          {[
                            { id: 'automatic_email', label: 'Automatic email', icon: Mail, color: 'text-blue-400' },
                            { id: 'manual_email', label: 'Manual email', icon: Edit2, color: 'text-emerald-400' },
                            { id: 'phone_call', label: 'Phone call', icon: Phone, color: 'text-yellow-500' },
                            { id: 'action_item', label: 'Action item', icon: CheckSquare, color: 'text-purple-400' },
                          ].map((opt) => (
                            <button key={opt.id} onClick={() => addStep(opt.id as StepType)} className="w-full flex items-center gap-4 px-4 py-3.5 text-sm font-bold rounded-xl hover:bg-white/10 text-foreground transition-all group text-left">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <opt.icon className={`h-4.5 w-4.5 ${opt.color} group-hover:scale-110 transition-transform`} />
                              </div>
                              {opt.label}
                            </button>
                          ))}
                          <div className="h-px bg-white/5 my-2.5 mx-3" />
                          {[
                            { id: 'linkedin_connect', label: 'LinkedIn Connect', icon: Linkedin },
                            { id: 'linkedin_message', label: 'LinkedIn Message', icon: MessageSquare },
                            { id: 'linkedin_view', label: 'LinkedIn View', icon: ViewIcon },
                            { id: 'linkedin_interact', label: 'LinkedIn Interact', icon: Zap }
                          ].map((opt) => (
                            <button key={opt.id} onClick={() => addStep(opt.id as StepType)} className="w-full flex items-center gap-4 px-4 py-3.5 text-sm font-bold rounded-xl hover:bg-white/10 text-foreground transition-all group text-left">
                              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                <opt.icon className="h-4.5 w-4.5 text-blue-500 group-hover:scale-110 transition-transform" />
                              </div>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                  { label: "Sequences Sent", value: activeCampaign?.sent || "0", sub: `Total ${activeCampaign?.leads || 0} leads`, status: "neutral" },
                  { label: "Open Rate", value: activeCampaign?.sent ? `${Math.round((activeCampaign.opened / activeCampaign.sent) * 100)}%` : "0%", sub: `${activeCampaign?.opened || 0} opened`, status: "neutral" },
                  { label: "Click Rate", value: activeCampaign?.sent ? `${Math.round((activeCampaign.clicked / activeCampaign.sent) * 100)}%` : "0%", sub: `${activeCampaign?.clicked || 0} clicked`, status: "neutral" },
                  { label: "Reply Rate", value: activeCampaign?.sent ? `${Math.round((activeCampaign.replied / activeCampaign.sent) * 100)}%` : "0%", sub: `${activeCampaign?.replied || 0} replied`, status: "neutral" },
                  { label: "Opportunities", value: activeCampaign?.opportunities || "0", sub: `$${(activeCampaign?.opportunities || 0) * 5000} pipeline`, status: "good" }
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
