import { useState, useRef, useEffect } from "react";
import {
  Search, X, ChevronDown, ChevronUp, MapPin, Mail, Phone, Linkedin,
  Building2, Users, Filter, Download, LayoutList, LayoutGrid, Table2,
  CheckSquare, Square, Star, Plus, MoreHorizontal, Eye, Bookmark,
  Zap, Shield, AlertCircle, Sliders, Briefcase, Globe, GraduationCap,
  Clock, ChevronRight, ArrowUpDown, FileText, UserCheck, SlidersHorizontal,
  RefreshCw, ExternalLink, BarChart2, Check, Sparkles, TrendingUp, Laptop,
  Bot, MessageSquare, Command, UserPlus, PlusCircle, SearchCode, History, Send,
  Settings, Terminal, Fingerprint, Globe2, Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NO_SCROLLBAR_STYLE = `
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`;

// ─── Types ──────────────────────────────────────────────────────────────────
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  leads?: any[];
  suggestions?: string[];
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_CONTACTS = [
  { id: "1", name: "Alexandra Chen", title: "VP of Sales", company: "TechNova Inc.", location: "San Francisco, CA", industry: "SaaS", seniority: "VP", department: "Sales", companySize: "201-500", email: "verified", phone: "available", linkedinUrl: true, avatar: "AC", avatarColor: "from-violet-500 to-purple-600", yearsAtCompany: 3, pastRoles: ["Director of Sales @ Stripe", "Sales Manager @ Salesforce"], skills: ["Enterprise Sales", "CRM", "Revenue Operations"], education: "MBA – Stanford GSB", intentScore: 92, technologies: ["Salesforce", "Slack", "Zoom"] },
  { id: "2", name: "Marcus Williams", title: "Chief Revenue Officer", company: "Growthify", location: "New York, NY", industry: "MarTech", seniority: "C-Level", department: "Sales", companySize: "51-200", email: "available", phone: "unavailable", linkedinUrl: true, avatar: "MW", avatarColor: "from-blue-500 to-cyan-600", yearsAtCompany: 2, pastRoles: ["VP Revenue @ HubSpot"], skills: ["SaaS GTM", "Pipeline Management"], education: "BS – Wharton", intentScore: 78, technologies: ["HubSpot", "Segment", "Amplitude"] },
  { id: "3", name: "Sofia Patel", title: "Head of Marketing", company: "CloudBridge", location: "Austin, TX", industry: "Cloud Infrastructure", seniority: "Director", department: "Marketing", companySize: "501-1000", email: "verified", phone: "verified", linkedinUrl: true, avatar: "SP", avatarColor: "from-pink-500 to-rose-600", yearsAtCompany: 4, pastRoles: ["Sr. Marketing Manager @ AWS", "Growth Lead @ Twilio"], skills: ["Demand Gen", "ABM", "Paid Media"], education: "BA – UT Austin", intentScore: 85, technologies: ["AWS", "Terraform", "Marketo"] },
  { id: "4", name: "James Thornton", title: "Director of Engineering", company: "DataSync Labs", location: "Seattle, WA", industry: "Data & Analytics", seniority: "Director", department: "Engineering", companySize: "11-50", email: "unavailable", phone: "unavailable", linkedinUrl: false, avatar: "JT", avatarColor: "from-emerald-500 to-teal-600", yearsAtCompany: 1, pastRoles: ["Staff Engineer @ Google"], skills: ["Distributed Systems", "Kafka", "Kubernetes"], education: "MS CS – Carnegie Mellon", intentScore: 45, technologies: ["Kafka", "Kubernetes", "PostgreSQL"] },
  { id: "5", name: "Priya Nair", title: "CEO & Co-Founder", company: "FinEdge AI", location: "Boston, MA", industry: "FinTech", seniority: "C-Level", department: "Executive", companySize: "1-10", email: "verified", phone: "available", linkedinUrl: true, avatar: "PN", avatarColor: "from-amber-500 to-orange-600", yearsAtCompany: 5, pastRoles: ["Product Lead @ Goldman Sachs"], skills: ["AI/ML", "FinTech", "Product Strategy"], education: "MBA – Harvard", intentScore: 98, technologies: ["OpenAI", "Pinecone", "Vercel"] },
  { id: "6", name: "Lucas Ferreira", title: "Sales Manager", company: "OutreachPro", location: "Chicago, IL", industry: "SaaS", seniority: "Manager", department: "Sales", companySize: "51-200", email: "available", phone: "available", linkedinUrl: true, avatar: "LF", avatarColor: "from-indigo-500 to-blue-600", yearsAtCompany: 2, pastRoles: ["AE @ Outreach.io"], skills: ["Cold Outreach", "MEDDIC", "Salesforce"], education: "BS – Northwestern", intentScore: 62, technologies: ["Outreach", "Salesforce", "Gong"] },
  { id: "7", name: "Rachel Kim", title: "VP of Product", company: "Nexlify", location: "Los Angeles, CA", industry: "E-Commerce", seniority: "VP", department: "Product", companySize: "201-500", email: "verified", phone: "unavailable", linkedinUrl: true, avatar: "RK", avatarColor: "from-fuchsia-500 to-purple-600", yearsAtCompany: 3, pastRoles: ["Sr PM @ Shopify", "PM @ Amazon"], skills: ["Product Roadmap", "A/B Testing", "OKRs"], education: "BS – MIT", intentScore: 88, technologies: ["Shopify", "Klaviyo", "Hotjar"] },
  { id: "8", name: "Daniel Park", title: "CFO", company: "ScaleUp Ventures", location: "Denver, CO", industry: "Venture Capital", seniority: "C-Level", department: "Finance", companySize: "1-10", email: "available", phone: "available", linkedinUrl: true, avatar: "DP", avatarColor: "from-sky-500 to-blue-600", yearsAtCompany: 6, pastRoles: ["Finance Director @ a16z"], skills: ["Financial Modeling", "M&A", "Fundraising"], education: "MBA – Kellogg", intentScore: 71, technologies: ["QuickBooks", "Carta", "Excel"] },
];

const INDUSTRIES = ["SaaS", "MarTech", "FinTech", "E-Commerce", "Cloud Infrastructure", "Data & Analytics", "Venture Capital", "Healthcare", "EdTech"];
const DEPARTMENTS = ["Sales", "Marketing", "Engineering", "Finance", "HR", "Product", "Executive", "Operations"];
const SENIORITY = ["C-Level", "VP", "Director", "Manager", "Entry Level"];
const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5000+"];
const COUNTRIES = ["United States", "United Kingdom", "Canada", "Germany", "France", "India", "Australia"];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusBadge({ status, type }: { status: string; type: "email" | "phone" }) {
  const icon = type === "email" ? <Mail className="h-3 w-3" /> : <Phone className="h-3 w-3" />;
  if (status === "verified") return (
    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm shadow-emerald-500/5">
      <Check className="h-2.5 w-2.5" /> {type === "email" ? "Email Verified" : "Phone Verified"}
    </span>
  );
  if (status === "available") return (
    <button className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all cursor-pointer shadow-sm shadow-amber-500/5 active:scale-95">
      <Zap className="h-2.5 w-2.5" /> Reveal {type === "email" ? "Email" : "Phone"}
    </button>
  );
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground border border-border/50">
      <Shield className="h-2.5 w-2.5" /> Unavailable
    </span>
  );
}

function IntentBadge({ score }: { score: number }) {
  const color = score > 80 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : score > 50 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-slate-400 bg-slate-500/10 border-slate-500/20";
  const label = score > 80 ? "High" : score > 50 ? "Medium" : "Low";
  
  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-tighter ${color}`}>
      <TrendingUp className="h-2.5 w-2.5" />
      <span>{label} Intent</span>
      <span className="opacity-50">{score}%</span>
    </div>
  );
}

function FilterSection({ title, children, defaultOpen = true, icon: Icon }: { title: string; children: React.ReactNode; defaultOpen?: boolean; icon?: any }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/40 pb-4">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full py-3.5 text-xs font-bold text-foreground/80 hover:text-primary transition-colors group">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />}
          {title}
        </div>
        {open ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground/50" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/50" />}
      </button>
      {open && <div className="space-y-3 mt-1 animate-in slide-in-from-top-2 duration-200">{children}</div>}
    </div>
  );
}

function MultiSelectPills({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button key={opt} onClick={() => onChange(active ? selected.filter(s => s !== opt) : [...selected, opt])}
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${active ? "bg-primary/20 border-primary/40 text-primary" : "bg-card/40 border-border/60 text-muted-foreground hover:border-primary/30 hover:text-foreground"}`}>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function ContactCard({ contact, selected, onSelect, onView, view }: any) {
  const [hovered, setHovered] = useState(false);
  
  if (view === "grid") {
    return (
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        className="bg-card/40 border border-border/50 rounded-2xl p-5 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all relative group cursor-pointer backdrop-blur-sm overflow-hidden"
        onClick={() => onView(contact)}>
        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <IntentBadge score={contact.intentScore} />
        </div>
        <div className="absolute top-3 left-3" onClick={e => { e.stopPropagation(); onSelect(contact.id); }}>
          {selected ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4 text-muted-foreground/30 hover:text-primary transition-colors" />}
        </div>
        <div className="flex flex-col items-center text-center gap-3 pt-4">
          <div className="relative">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${contact.avatarColor} flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-background group-hover:scale-105 transition-transform`}>
              {contact.avatar}
            </div>
            {contact.linkedinUrl && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-md p-0.5 shadow-md">
                <Linkedin className="h-3 w-3 text-[#0A66C2]" />
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{contact.name}</p>
            <p className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider mt-0.5">{contact.title}</p>
            <div className="flex items-center gap-1 justify-center mt-1">
              <Building2 className="h-3 w-3 text-muted-foreground/60" />
              <p className="text-xs font-semibold text-foreground/70">{contact.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
            <MapPin className="h-3 w-3" />{contact.location}
          </div>
          <div className="flex flex-wrap gap-1 justify-center mt-1">
            <StatusBadge status={contact.email} type="email" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="bg-card/30 border border-border/40 rounded-2xl p-4 hover:border-primary/40 hover:bg-card/50 hover:shadow-xl hover:shadow-primary/5 transition-all group relative backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div onClick={e => { e.stopPropagation(); onSelect(contact.id); }} className="cursor-pointer">
            {selected ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4 text-muted-foreground/30 hover:text-primary transition-colors" />}
          </div>
          <div className="relative">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${contact.avatarColor} flex items-center justify-center text-white font-black text-base shadow-md group-hover:scale-105 transition-transform`}>
              {contact.avatar}
            </div>
            {contact.linkedinUrl && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-md p-0.5 shadow-sm">
                <Linkedin className="h-2.5 w-2.5 text-[#0A66C2]" />
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => onView(contact)} className="font-black text-foreground text-base tracking-tight hover:text-primary transition-colors">{contact.name}</button>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-secondary/80 text-muted-foreground uppercase">{contact.seniority}</span>
                  <IntentBadge score={contact.intentScore} />
                </div>
              </div>
              <p className="text-xs font-bold text-muted-foreground/80 mt-0.5 leading-snug">
                {contact.title} <span className="text-muted-foreground/40 font-medium lowercase italic">at</span> <span className="text-foreground/80">{contact.company}</span>
              </p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground/70"><MapPin className="h-3 w-3 text-muted-foreground/40" />{contact.location}</span>
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground/70"><Building2 className="h-3 w-3 text-muted-foreground/40" />{contact.companySize}</span>
                <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground/70"><Briefcase className="h-3 w-3 text-muted-foreground/40" />{contact.department}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={() => onView(contact)}><Eye className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-amber-400 hover:bg-amber-400/10"><Star className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-card"><MoreHorizontal className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 flex-wrap border-t border-border/30 pt-3">
            <StatusBadge status={contact.email} type="email" />
            <StatusBadge status={contact.phone} type="phone" />
            <div className="flex items-center gap-1 ml-auto">
              {contact.technologies.slice(0, 2).map((tech: string) => (
                <span key={tech} className="text-[9px] font-black px-1.5 py-0.5 rounded border border-border/50 bg-card/40 text-muted-foreground">{tech}</span>
              ))}
              {contact.technologies.length > 2 && <span className="text-[9px] font-black px-1.5 py-0.5 text-muted-foreground">+{contact.technologies.length - 2}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function DetailModal({ contact, onClose }: { contact: any; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-[#0A0A0F] border border-white/5 w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 max-h-[95vh] flex flex-col">
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="relative p-8 border-b border-white/5 flex items-start justify-between gap-6 z-10">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className={`w-24 h-24 rounded-[28px] bg-gradient-to-br ${contact.avatarColor} flex items-center justify-center text-white font-black text-3xl shadow-2xl ring-4 ring-white/5`}>
                {contact.avatar}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-xl p-1.5 shadow-xl ring-2 ring-black">
                <Linkedin className="h-5 w-5 text-[#0A66C2]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-3xl font-black text-white tracking-tight">{contact.name}</h2>
                <IntentBadge score={contact.intentScore} />
              </div>
              <p className="text-base font-bold text-white/50 mt-1">{contact.title} <span className="text-white/20 px-1">/</span> {contact.company}</p>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <span className="flex items-center gap-1.5 text-sm font-medium text-white/40"><MapPin className="h-4 w-4 text-primary/60" />{contact.location}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">{contact.seniority}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="h-10 w-10 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all transform hover:rotate-90 flex-shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="relative overflow-y-auto flex-1 p-8 space-y-8 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/[0.03] rounded-3xl p-6 border border-white/5">
                  <div className="flex items-center gap-2 mb-5">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Contact Details</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between group cursor-pointer">
                      <span className="flex items-center gap-3 text-sm font-bold text-white/60 group-hover:text-white transition-colors"><Mail className="h-4 w-4 text-white/20" /> Email</span>
                      <StatusBadge status={contact.email} type="email" />
                    </div>
                    <div className="flex items-center justify-between group cursor-pointer">
                      <span className="flex items-center gap-3 text-sm font-bold text-white/60 group-hover:text-white transition-colors"><Phone className="h-4 w-4 text-white/20" /> Phone</span>
                      <StatusBadge status={contact.phone} type="phone" />
                    </div>
                  </div>
                </div>
                <div className="bg-white/[0.03] rounded-3xl p-6 border border-white/5">
                  <div className="flex items-center gap-2 mb-5">
                    <Building2 className="h-4 w-4 text-amber-500" />
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Company Insights</p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-white flex items-center gap-2">{contact.company} <ExternalLink className="h-3 w-3 text-white/20" /></p>
                    <div className="flex items-center gap-4 text-xs font-medium text-white/50 bg-white/5 p-2 rounded-xl">
                      <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {contact.companySize}</div>
                      <div className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> {contact.industry}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Career Path</p>
                </div>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-white/10">
                  <div className="relative">
                    <div className="absolute -left-7 top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20" />
                    <p className="text-base font-bold text-white">{contact.title}</p>
                    <p className="text-sm font-medium text-white/40">{contact.company} · Present · {contact.yearsAtCompany}y</p>
                  </div>
                  {contact.pastRoles.map((role: string, i: number) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-7 top-1.5 w-3 h-3 rounded-full bg-white/10 ring-4 ring-transparent" />
                      <p className="text-sm font-bold text-white/70">{role.split(" @ ")[0]}</p>
                      <p className="text-xs font-medium text-white/40">{role.split(" @ ")[1]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                <div className="flex items-center gap-2 mb-5">
                  <Laptop className="h-4 w-4 text-primary" />
                  <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em]">Tech Stack</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {contact.technologies.map((tech: string) => (
                    <span key={tech} className="text-xs font-bold px-3 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 lowercase">
                      #{tech.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-white/[0.03] rounded-3xl p-6 border border-white/5">
                <div className="flex items-center gap-2 mb-5">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Core Expertise</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {contact.skills.map((s: string) => (
                    <span key={s} className="text-[11px] font-bold px-3 py-1 rounded-lg bg-card text-white/60 border border-white/5 hover:border-white/20 transition-colors cursor-default">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative p-6 border-t border-white/5 flex items-center gap-4 flex-wrap z-10 bg-black/40 backdrop-blur-md">
          <Button className="h-12 px-8 gap-2 bg-primary hover:bg-primary/90 text-white font-black text-sm shadow-xl shadow-primary/20 rounded-2xl transform active:scale-95 transition-all">
            <Plus className="h-4 w-4" /> Add to List
          </Button>
          <Button variant="outline" className="h-12 px-6 gap-2 border-white/10 text-white font-bold hover:bg-white/5 rounded-2xl uppercase tracking-wider text-xs">
            <Download className="h-4 w-4" /> Export Profile
          </Button>
        </div>
      </div>
    </div>
  );
}

function AiAssistantLanding({ onAction }: { onAction: (s: string) => void }) {
  const actions = [
    { icon: UserPlus, label: "Build your target audience", color: "text-blue-400" },
    { icon: SearchCode, label: "Create signal-based sequence", color: "text-purple-400" },
    { icon: Fingerprint, label: "Executive persona research", color: "text-emerald-400" },
    { icon: Globe2, label: "Identify highest-responding personas", color: "text-amber-400" },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center px-4 animate-in fade-in zoom-in duration-700 py-6">
      <div className="relative mb-1">
        <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full animate-pulse" />
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#14141A] to-[#0A0A0F] border border-white/10 flex items-center justify-center shadow-2xl">
          <Bot className="h-5 w-5 text-primary" strokeWidth={1.5} />
        </div>
      </div>
      
      <h2 className="text-lg font-black text-white tracking-tight mb-0.5">
        AI Assistant
      </h2>
      <p className="text-white/40 font-medium mb-4 text-[12px]">
        Search people, companies, or automate outreach.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => onAction(action.label)}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all text-left group"
          >
            <div className={cn("w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform", action.color)}>
              <action.icon className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-white/70 group-hover:text-white transition-colors">
              {action.label}
            </span>
          </button>
        ))}
      </div>
      
      <Button variant="ghost" className="mt-4 text-white/30 hover:text-white text-[10px] font-black uppercase tracking-widest gap-2">
        View more <ChevronRight className="h-2.5 w-2.5" />
      </Button>
    </div>
  );
}

function ChatMessage({ message, onViewLead }: { message: Message; onViewLead: (l: any) => void }) {
  const isAi = message.role === "assistant";
  
  return (
    <div className={cn("flex gap-3 mb-6 animate-in slide-in-from-bottom-2 duration-300", !isAi && "flex-row-reverse")}>
      <div className={cn(
        "w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-1 shadow-lg",
        isAi ? "bg-primary text-white" : "bg-white/10 text-white/60"
      )}>
        {isAi ? <Bot className="h-4 w-4" /> : <div className="text-[10px] font-black">YOU</div>}
      </div>
      
      <div className={cn("flex flex-col max-w-[85%]", !isAi && "items-end")}>
        <div className={cn(
          "px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm",
          isAi 
            ? "bg-[#14141A] border border-white/5 text-white/90" 
            : "bg-primary/10 border border-primary/20 text-primary-foreground"
        )}>
          {message.content}
        </div>
        
        {message.leads && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 w-full">
            {message.leads.map(lead => (
              <div 
                key={lead.id} 
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:border-primary/40 transition-all group flex items-center gap-3 cursor-pointer"
                onClick={() => onViewLead(lead)}
              >
                <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-black text-xs", lead.avatarColor)}>
                  {lead.avatar}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white text-sm truncate">{lead.name}</p>
                  <p className="text-[10px] text-white/40 truncate">{lead.title} @ {lead.company}</p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="h-4 w-4 text-primary" />
                </div>
              </div>
            ))}
          </div>
        )}

        {message.suggestions && (
          <div className="flex flex-wrap gap-2 mt-4">
            {message.suggestions.map(s => (
              <button key={s} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-bold text-white/40 hover:text-white hover:border-primary/40 transition-all">
                {s}
              </button>
            ))}
          </div>
        )}
        
        <span className="text-[10px] font-medium text-white/20 mt-2 uppercase tracking-tighter">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function People() {
  const [credits] = useState({ used: 550, total: 1000 });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid" | "table">("list");
  const [detailContact, setDetailContact] = useState<any>(null);

  // Filter state
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedSeniority, setSelectedSeniority] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const activeFilterCount = selectedCountries.length + selectedSeniority.length + selectedDepartments.length + selectedIndustries.length + selectedSizes.length + (titleFilter ? 1 : 0) + (companyFilter ? 1 : 0) + (cityFilter ? 1 : 0);

  const clearAll = () => {
    setSelectedCountries([]); setSelectedSeniority([]); setSelectedDepartments([]);
    setSelectedIndustries([]); setSelectedSizes([]); setTitleFilter("");
    setCompanyFilter(""); setCityFilter("");
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string = inputMessage) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI parsing
    setTimeout(() => {
      const query = text.toLowerCase();
      let filtered = [...MOCK_CONTACTS];
      
      // Basic NLP simulation
      if (query.includes("founder") || query.includes("ceo") || selectedSeniority.includes("C-Level")) {
        filtered = filtered.filter(c => c.seniority === "C-Level" || c.title.toLowerCase().includes("founder"));
      }
      if (query.includes("san francisco") || query.includes("sf") || cityFilter.toLowerCase().includes("san francisco")) {
        filtered = filtered.filter(c => c.location.toLowerCase().includes("san francisco"));
      }
      if (query.includes("london") || cityFilter.toLowerCase().includes("london")) {
        filtered = filtered.filter(c => c.location.toLowerCase().includes("london"));
      }
      if (query.includes("technova") || companyFilter.toLowerCase().includes("technova")) {
        filtered = filtered.filter(c => c.company.toLowerCase().includes("technova"));
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: filtered.length > 0 
          ? `I found ${filtered.length} leads matching your ${activeFilterCount > 0 ? 'filters and ' : ''}criteria. Here are the best matches:`
          : "I couldn't find any leads matching those exact criteria. Would you like to broaden your search?",
        timestamp: new Date(),
        leads: filtered.length > 0 ? filtered : undefined,
        suggestions: filtered.length === 0 ? ["Show all founders", "Leads in San Francisco", "Marketing Directors"] : undefined
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const creditPct = (credits.used / credits.total) * 100;
  const creditLow = creditPct > 85;

  return (
    <div className="flex flex-col h-full bg-[#060608] text-foreground transition-all duration-500 overflow-hidden">
      <style>{NO_SCROLLBAR_STYLE}</style>
      {/* ── Top Bar (Navigation) ── */}
      <div className="flex items-center justify-between px-6 h-12 border-b border-white/[0.03] bg-black/40 backdrop-blur-xl z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <h1 className="text-sm font-black uppercase tracking-widest">AI Assistant</h1>
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/20">BETA</span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-1">
            <History className="h-4 w-4 text-white/20" />
            <span className="text-xs font-bold text-white/40">Recent Activity</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/5 bg-white/[0.02]">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-[10px] font-black">{credits.used}/{credits.total} CREDITS</span>
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-white/5 text-white/40">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* ── Filter Sidebar (Left) ── */}
        <aside className={cn(
          "flex-shrink-0 border-r border-white/5 bg-[#0A0A0F] overflow-y-auto transition-all duration-300 custom-scrollbar",
          showFilters ? "w-[280px]" : "w-0 opacity-0 pointer-events-none"
        )}>
          <div className="p-4 space-y-1">
            <div className="flex items-center justify-between mb-4 px-2 pt-2">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                <h3 className="font-black text-[10px] text-white uppercase tracking-widest">Filters</h3>
              </div>
              {activeFilterCount > 0 && (
                <button onClick={clearAll} className="text-[9px] font-black text-white/20 hover:text-red-400 transition-colors uppercase tracking-widest">Reset</button>
              )}
            </div>

            <FilterSection title="Lists" icon={LayoutList} defaultOpen={false}>
              <div className="px-2 pb-2"><p className="text-[10px] text-white/20">No lists available</p></div>
            </FilterSection>

            <FilterSection title="Persona" icon={Users} defaultOpen={false}>
              <div className="px-2">
                <Button variant="outline" className="w-full h-8 border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest gap-2">
                  <Plus className="h-3 w-3" /> New Persona
                </Button>
              </div>
            </FilterSection>

            <FilterSection title="Job Titles" icon={Briefcase}>
              <input 
                type="text" placeholder="Search titles..." value={titleFilter} onChange={e => setTitleFilter(e.target.value)}
                className="w-full bg-[#14141A] border border-white/5 rounded-lg px-3 py-1.5 text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all font-medium" 
              />
              <div className="space-y-2 pt-2">
                <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Seniority</p>
                <MultiSelectPills options={SENIORITY} selected={selectedSeniority} onChange={setSelectedSeniority} />
              </div>
            </FilterSection>

            <FilterSection title="Company" icon={Building2} defaultOpen={false}>
              <input 
                type="text" placeholder="Company..." value={companyFilter} onChange={e => setCompanyFilter(e.target.value)}
                className="w-full bg-[#14141A] border border-white/5 rounded-lg px-3 py-1.5 text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all font-medium" 
              />
            </FilterSection>

            <FilterSection title="Location" icon={MapPin}>
              <input 
                type="text" placeholder="City..." value={cityFilter} onChange={e => setCityFilter(e.target.value)}
                className="w-full bg-[#14141A] border border-white/5 rounded-lg px-3 py-1.5 text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-all font-medium" 
              />
            </FilterSection>

            <FilterSection title="Industry" icon={Globe}>
              <MultiSelectPills options={INDUSTRIES} selected={selectedIndustries} onChange={setSelectedIndustries} />
            </FilterSection>

            <FilterSection title="Company Size" icon={Users} defaultOpen={false}>
              <MultiSelectPills options={COMPANY_SIZES} selected={selectedSizes} onChange={setSelectedSizes} />
            </FilterSection>

            <FilterSection title="Email Status" icon={Mail} defaultOpen={false}>
              <div className="flex flex-wrap gap-1.5">
                {["Verified", "Guaranteed", "Requested"].map(status => (
                  <button key={status} className="text-[10px] font-bold px-2 py-1 rounded-md border border-white/5 bg-white/5 text-white/40 hover:text-white transition-colors">
                    {status}
                  </button>
                ))}
              </div>
            </FilterSection>
          </div>
        </aside>

        {/* ── Main Chat Container ── */}
        <main className="flex-1 flex flex-col relative bg-[#060608]">
          <div className="flex items-center gap-2 px-6 py-2 border-b border-white/[0.03] bg-black/20">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest transition-colors",
                showFilters ? "text-primary bg-primary/10" : "text-white/40 hover:text-white"
              )}
            >
              <Filter className="h-3 w-3" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-20 py-2"
          >
            {messages.length === 0 ? (
              <AiAssistantLanding onAction={(text) => handleSendMessage(text)} />
            ) : (
              <div className="max-w-4xl mx-auto w-full">
                {messages.map(msg => (
                  <ChatMessage key={msg.id} message={msg} onViewLead={setDetailContact} />
                ))}
                {isTyping && (
                  <div className="flex gap-4 mb-8 animate-in fade-in duration-300">
                    <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg">
                      <Bot className="h-4 w-4 animate-pulse" />
                    </div>
                    <div className="bg-[#14141A] border border-white/5 px-5 py-3.5 rounded-2xl flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Chat Input Bar (Apollo Style) ── */}
          <div className="p-4 md:p-6 md:pb-8 pointer-events-none">
            <div className="max-w-3xl mx-auto w-full pointer-events-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/5 to-violet-500/20 rounded-[32px] blur-xl opacity-0 group-focus-within:opacity-100 transition duration-700" />
                <div className="relative bg-[#0F0F13]/80 backdrop-blur-2xl border border-white/10 rounded-[28px] p-2 shadow-2xl transition-all group-focus-within:border-primary/40">
                  <div className="flex items-start gap-2 px-4 py-2">
                    <textarea
                      rows={1}
                      placeholder="What can I help you do?"
                      className="w-full bg-transparent border-none pt-1 pb-2 text-sm focus:outline-none focus:ring-0 text-white placeholder:text-white/20 font-medium resize-none min-h-[40px] max-h-[200px]"
                      value={inputMessage}
                      onChange={e => setInputMessage(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <div className="flex items-center gap-2 pb-1">
                      <Button 
                        size="icon" 
                        disabled={!inputMessage.trim() || isTyping}
                        onClick={() => handleSendMessage()}
                        className={cn(
                          "h-10 w-10 rounded-2xl transition-all transform active:scale-95",
                          inputMessage.trim() ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white/5 text-white/20"
                        )}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Bottom Toolbelt */}
                  <div className="flex items-center justify-between px-3 py-1 border-t border-white/5 mt-0.5">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                        <Terminal className="h-2.5 w-2.5" /> Context
                      </button>
                      <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">
                        <Lightbulb className="h-2.5 w-2.5" /> Samples
                      </button>
                    </div>
                    <div className="text-[9px] font-black text-white/10 tracking-widest uppercase">
                      4 Chats Left
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ── Detail Modal ── */}
      {detailContact && (
        <DetailModal 
          contact={detailContact} 
          onClose={() => setDetailContact(null)} 
        />
      )}
    </div>
  );
}
