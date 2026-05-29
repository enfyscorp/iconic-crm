import React, { useState, useMemo } from "react";
import { 
  Users, ShieldAlert, BarChart3, Building2, Briefcase, 
  Layers, PhoneCall, Calendar, Search, Plus, TrendingUp, 
  DollarSign, MapPin, Shield, FileText, Clock, LogOut, Lock, Mail
} from "lucide-react";

// ─── SYSTEM DATA SETTINGS ───────────────────────────────────────────────────
const ROLES = ["Admin", "Branch Manager", "Team Lead", "Telecaller", "Field Agent"];
const BRANCHES = ["Madurai", "Chennai South", "Chennai North", "Coimbatore"];
const SOURCES = ["Website", "IVR", "Referral", "Walk-in", "Social Media", "99acres", "MagicBricks"];
const STATUSES = ["New", "Contacted", "Interested", "Site Visit Scheduled", "Site Visit Done", "Negotiation", "Converted", "Not Interested", "On Hold"];
const BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "Villa"];

const USERS_REGISTRY = [
  { id: 1, name: "Arjun Sharma", avatar: "AS", role: "Admin", branch: "All Branches", email: "admin@iconic.in", pass: "admin123", phone: "98400 00001", active: true },
  { id: 2, name: "Priya Nair", avatar: "PN", role: "Branch Manager", branch: "Madurai", email: "manager@iconic.in", pass: "manager123", phone: "98400 00002", active: true },
  { id: 3, name: "Karthik Rajan", avatar: "KR", role: "Team Lead", branch: "Madurai", email: "lead@iconic.in", pass: "lead123", phone: "98400 00003", active: true },
  { id: 4, name: "Divya Menon", avatar: "DM", role: "Telecaller", branch: "Madurai", email: "caller@iconic.in", pass: "caller123", phone: "98400 00004", active: true },
  { id: 5, name: "Rohan Das", avatar: "RD", role: "Field Agent", branch: "Madurai", email: "agent@iconic.in", pass: "agent123", phone: "98400 00005", active: true },
];

const INITIAL_PROJECTS = [
  { id: 1, name: "Vishal Virinchi Apartments", branch: "Madurai", location: "Bypass Road", units: 10, sold: 2, type: "Apartment", status: "Active", price: "65L" },
  { id: 2, name: "ICONIC Lakeview", branch: "Chennai South", location: "Velachery", units: 120, sold: 45, type: "Apartment", status: "Active", price: "72L" },
  { id: 3, name: "ICONIC Serenity", branch: "Chennai South", location: "Sholinganallur", units: 80, sold: 62, type: "Apartment", status: "Active", price: "85L" },
  { id: 4, name: "ICONIC Greens", branch: "Coimbatore", location: "Saravanampatti", units: 60, sold: 18, type: "Villa", status: "Pre-launch", price: "120L" },
];

const INITIAL_LEADS = [
  { id: 1, name: "Suresh Kumar", phone: "98400 11234", email: "suresh@gmail.com", source: "99acres", assignedTo: "Rohan Das", branch: "Madurai", status: "Interested", bhk: "3 BHK", budget: 85, project: "Vishal Virinchi Apartments", notes: "Prefers higher floors.", svDate: "", svNotes: "", history: [{ date: "2026-05-15", by: "Divya Menon", action: "Inquiry recorded." }] },
  { id: 2, name: "Lakshmi Rao", phone: "99400 22345", email: "lakshmi@yahoo.com", source: "IVR", assignedTo: "Rohan Das", branch: "Madurai", status: "Site Visit Scheduled", bhk: "2 BHK", budget: 68, project: "Vishal Virinchi Apartments", notes: "Wants family car parking slots.", svDate: "", svNotes: "", history: [{ date: "2026-05-20", by: "Divya Menon", action: "Site visit confirmed." }] },
  { id: 3, name: "Vijay Anand", phone: "97400 33456", email: "vijay@outlook.com", source: "Referral", assignedTo: "Divya Menon", branch: "Madurai", status: "New", bhk: "4 BHK", budget: 140, project: "ICONIC Greens", notes: "Looking for independent villa structure.", svDate: "", svNotes: "", history: [{ date: "2026-05-28", by: "System Gateway", action: "Lead ingestion completed." }] },
  { id: 4, name: "Meena Selvam", phone: "96400 44567", email: "meena@gmail.com", source: "Walk-in", assignedTo: "Rohan Das", branch: "Madurai", status: "Negotiation", bhk: "3 BHK", budget: 90, project: "Vishal Virinchi Apartments", notes: "Negotiating terminal pricing structures.", svDate: "2026-05-21", svNotes: "Completed walkthrough.", history: [{ date: "2026-05-21", by: "Rohan Das", action: "Physical tour finalized." }] },
  { id: 5, name: "Ramesh Babu", phone: "93400 77890", email: "ramesh@gmail.com", source: "MagicBricks", assignedTo: "Divya Menon", branch: "Madurai", status: "Converted", bhk: "2 BHK", budget: 75, project: "Vishal Virinchi Apartments", notes: "Closed deal closure standard.", svDate: "2026-05-10", svNotes: "Advance tokens processed.", history: [{ date: "2026-05-12", by: "Priya Nair", action: "Converted to formal booked unit account." }] },
];

const SC = {
  New:                    { bg: "rgba(59,130,246,0.1)", text: "#60a5fa", border: "rgba(59,130,246,0.2)" },
  Contacted:              { bg: "rgba(245,158,11,0.1)", text: "#fbbf24", border: "rgba(245,158,11,0.2)" },
  Interested:             { bg: "rgba(16,185,129,0.1)", text: "#34d399", border: "rgba(16,185,129,0.2)" },
  "Site Visit Scheduled": { bg: "rgba(139,92,246,0.1)", text: "#a78bfa", border: "rgba(139,92,246,0.2)" },
  "Site Visit Done":      { bg: "rgba(20,184,166,0.1)", text: "#2dd4bf", border: "rgba(20,184,166,0.2)" },
  Negotiation:            { bg: "rgba(236,72,153,0.1)", text: "#f472b6", border: "rgba(236,72,153,0.2)" },
  Converted:              { bg: "rgba(52,211,153,0.15)", text: "#34d399", border: "rgba(52,211,153,0.3)" },
  "Not Interested":       { bg: "rgba(239,68,68,0.1)", text: "#f87171", border: "rgba(239,68,68,0.2)" },
  "On Hold":              { bg: "rgba(107,114,128,0.1)", text: "#9ca3af", border: "rgba(107,114,128,0.2)" },
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(null); 
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("dashboard");
  const [globalSearch, setGlobalSearch] = useState("");

  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [users, setUsers] = useState(USERS_REGISTRY);
  const [projects] = useState(INITIAL_PROJECTS);

  const [selectedLead, setSelectedLead] = useState(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const [newLeadForm, setNewLeadForm] = useState({ name: "", phone: "", email: "", source: "Website", assignedTo: "Rohan Das", branch: "Madurai", status: "New", bhk: "3 BHK", location: "Bypass Road", budget: 75, project: "Vishal Virinchi Apartments", notes: "" });
  const [newUserForm, setNewUserForm] = useState({ name: "", role: "Telecaller", branch: "Madurai", email: "", phone: "", pass: "iconic123" });

  const [svDate, setSvDate] = useState("");
  const [svNotes, setSvNotes] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const account = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase().trim() && u.pass === loginPassword);
    if (account) {
      setCurrentUser(account);
      setLoginError("");
    } else {
      setLoginError("Invalid clearance email parameters or secure password match mismatch.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginEmail("");
    setLoginPassword("");
    setActiveTab("dashboard");
  };

  const processedLeads = useMemo(() => {
    if (!currentUser) return [];
    
    let roleFiltered = leads;
    if (currentUser.role === "Telecaller") {
      roleFiltered = leads.filter(l => l.assignedTo === "Divya Menon" || l.status === "New");
    } else if (currentUser.role === "Field Agent") {
      roleFiltered = leads.filter(l => l.assignedTo === "Rohan Das");
    }

    if (!globalSearch.trim()) return roleFiltered;
    const term = globalSearch.toLowerCase();
    return roleFiltered.filter(l => 
      l.name.toLowerCase().includes(term) || 
      l.phone.includes(term) || 
      l.project.toLowerCase().includes(term) || 
      l.status.toLowerCase().includes(term)
    );
  }, [leads, currentUser, globalSearch]);

  const handleCreateLead = (e) => {
    e.preventDefault();
    const created = {
      ...newLeadForm,
      id: Date.now(),
      svDate: "",
      svNotes: "",
      history: [{ date: new Date().toISOString().split("T")[0], by: currentUser.name, action: "Lead recorded." }]
    };
    setLeads([created, ...leads]);
    setIsLeadModalOpen(false);
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    const created = {
      ...newUserForm,
      id: Date.now(),
      avatar: newUserForm.name.split(" ").map(n => n[0]).join("").toUpperCase(),
      active: true
    };
    setUsers([...users, created]);
    setIsUserModalOpen(false);
  };

  const executeStatusTransition = (leadId, nextStatus) => {
    if (nextStatus === "Site Visit Done") {
      const target = leads.find(l => l.id === leadId);
      if (target && (!target.svDate || !target.svNotes.trim())) {
        alert("🔒 Compliance Guardrail Triggered: Walkthrough validation files must be uploaded before moving state blocks.");
        return;
      }
    }
    setLeads(leads.map(l => l.id === leadId ? {
      ...l, status: nextStatus,
      history: [...l.history, { date: new Date().toISOString().split("T")[0], by: currentUser.name, action: `Milestone modified to: ${nextStatus}` }]
    } : l));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased">
        <div className="sm:mx-auto w-full max-w-md text-center space-y-2">
          <div className="flex justify-center"><Building2 className="h-12 w-12 text-indigo-500" /></div>
          <h2 className="text-3xl font-black tracking-tight text-white">ICONIC PROJECTS</h2>
          <p className="text-sm text-slate-400">Enterprise CRM Authentication Access Portal</p>
        </div>

        <div className="mt-8 sm:mx-auto w-full max-w-md">
          <div className="bg-slate-950 py-8 px-4 border border-slate-800 rounded-xl shadow-2xl sm:px-10 space-y-6">
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-slate-400 font-bold uppercase tracking-wide">Corporate Account Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500" placeholder="e.g. admin@iconic.in" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-400 font-bold uppercase tracking-wide">Passcode Credentials</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500" placeholder="••••••••" />
                </div>
              </div>

              {loginError && <p className="text-rose-400 font-medium font-mono text-[11px] bg-rose-500/10 p-2.5 rounded border border-rose-500/20">⚠️ {loginError}</p>}

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2.5 rounded-lg uppercase tracking-wide transition-colors shadow-lg">Verify Passkey & Authorize Viewport</button>
            </form>

            <div className="bg-slate-900 p-4 rounded-lg border border-slate-850 space-y-2 text-[11px] text-slate-400">
              <p className="font-bold text-slate-300 border-b border-slate-800 pb-1 uppercase tracking-wide">System Test Clearance Keys:</p>
              <p>• Admin: <span className="text-indigo-400 font-mono font-bold">admin@iconic.in</span> (pass: admin123)</p>
              <p>• Telecaller: <span className="text-indigo-400 font-mono font-bold">caller@iconic.in</span> (pass: caller123)</p>
              <p>• Field Runner: <span className="text-indigo-400 font-mono font-bold">agent@iconic.in</span> (pass: agent123)</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans antialiased overflow-hidden">
      
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
            <Building2 className="h-6 w-6 text-indigo-500" />
            <span className="font-black text-sm tracking-wider text-white">ICONIC PROJECTS</span>
          </div>
          <nav className="p-4 space-y-1">
            <button onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeTab === "dashboard" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              <Layers className="h-4 w-4" /> VISUAL DASHBOARDS
            </button>
            <button onClick={() => setActiveTab("leads")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeTab === "leads" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              <PhoneCall className="h-4 w-4" /> LEAD ECOSYSTEM ({processedLeads.length})
            </button>
            <button onClick={() => setActiveTab("projects")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeTab === "projects" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              <Building2 className="h-4 w-4" /> ASSET PORTFOLIO
            </button>
            {["Admin", "Branch Manager"].includes(currentUser.role) && (
              <button onClick={() => setActiveTab("users")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeTab === "users" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
                <Users className="h-4 w-4" /> SYSTEM GOVERNANCE
              </button>
            )}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3">
          <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-850">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-indigo-600 text-[11px] font-black flex items-center justify-center text-white">{currentUser.avatar}</div>
              <div className="w-28 overflow-hidden text-ellipsis">
                <p className="text-[11px] font-black text-slate-200 truncate">{currentUser.name}</p>
                <p className="text-[9px] text-indigo-400 font-bold tracking-wide uppercase truncate">{currentUser.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-rose-400 transition-colors" title="De-authorize session">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-8 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input type="text" value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} placeholder="Live Lookup Engine: Type name, project, status..." className="w-full bg-slate-900 border border-slate-850 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 tracking-wide font-medium" />
            {globalSearch && <button onClick={() => setGlobalSearch("")} className="absolute right-3 top-2 text-slate-500 hover:text-slate-200 text-xs font-bold">✕</button>}
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Office Scope: <span className="font-bold text-slate-200">{currentUser.branch}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">{currentUser.role} Analytical Dashboard View</h1>
                <p className="text-xs text-slate-400 mt-1">Real-time performance matrices and visual graph charts for ICONIC Projects operations.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Ingestion Scope <Briefcase className="h-4 w-4 text-indigo-400" /></p>
                  <p className="text-3xl font-black text-white mt-1">{processedLeads.length}</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Secured Revenue <DollarSign className="h-4 w-4 text-emerald-400" /></p>
                  <p className="text-3xl font-black text-emerald-400 mt-1">₹{processedLeads.filter(l => l.status === "Converted").reduce((a,c)=>a+c.budget, 0)}L</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Negotiation Funnel <TrendingUp className="h-4 w-4 text-pink-400" /></p>
                  <p className="text-3xl font-black text-white mt-1">{processedLeads.filter(l => l.status === "Negotiation").length}</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">SLA Adherence <Clock className="h-4 w-4 text-sky-400" /></p>
                  <p className="text-3xl font-black text-sky-400 mt-1">100%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-indigo-400" /> Pipeline Milestone Distribution Weight (Visual Graph)</h3>
                  <div className="space-y-4">
                    {["New", "Interested", "Site Visit Scheduled", "Negotiation", "Converted"].map(st => {
                      const share = leads.filter(l => l.status === st).length;
                      const pct = Math.min((share / leads.length) * 100, 100) || 0;
                      return (
                        <div key={st} className="flex items-center gap-4 text-xs font-medium">
                          <div className="w-36 text-slate-400 truncate">{st}</div>
                          <div className="flex-1 bg-slate-900 h-6 rounded-md overflow-hidden border border-slate-850 relative flex items-center">
                            <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                            <span className="absolute left-3 text-[10px] font-bold font-mono text-slate-200">{share} Accounts ({Math.round(pct)}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2"><FileText className="h-4 w-4 text-sky-400" /> Platform Attribution Share</h3>
                    <div className="space-y-4">
                      {["99acres", "MagicBricks", "Website", "Walk-in"].map(src => {
                        const count = leads.filter(l => l.source === src).length;
                        const scale = (count / leads.length) * 100 || 0;
                        return (
                          <div key={src} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-slate-400">{src}</span>
                              <span className="text-slate-300 font-mono font-bold">{count}</span>
                            </div>
                            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-850">
                              <div className="bg-sky-400 h-full rounded-full" style={{ width: `${scale}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === "leads" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Active Accounts Master Ledger</h1>
                  <p className="text-xs text-slate-400 mt-1">Filtered columns showing {processedLeads.length} live records.</p>
                </div>
                {["Admin", "Branch Manager", "Team Lead"].includes(currentUser.role) && (
                  <button onClick={() => setIsLeadModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors">
                    <Plus className="h-4 w-4" /> CAPTURE LEAD RECORD
                  </button>
                )}
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="p-4">Client Contact Profiling</th>
                        <th className="p-4">Project Context Variant</th>
                        <th className="p-4">Marketing Source</th>
                        <th className="p-4">Assigned Agent</th>
                        <th className="p-4">Funnel Milestone</th>
                        <th className="p-4 text-right">Target Capital</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {processedLeads.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500 font-medium italic">No active ledger rows matching current lookup search strings.</td>
                        </tr>
                      ) : (
                        processedLeads.map(l => (
                          <tr key={l.id} className="hover:bg-slate-900/40 transition-all">
                            <td className="p-4 font-bold text-white cursor-pointer" onClick={() => setSelectedLead(l)}>
                              <p className="text-sm">{l.name}</p>
                              <p className="text-[11px] text-slate-500 font-mono mt-0.5">{l.phone} • {l.email}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-semibold text-slate-200">{l.project}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">{l.bhk} — {l.branch}</p>
                            </td>
                            <td className="p-4">
                              <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-400 font-medium">{l.source}</span>
                            </td>
                            <td className="p-4 text-slate-400 font-medium">{l.assignedTo}</td>
                            <td className="p-4">
                              <select value={l.status} onChange={(e) => executeStatusTransition(l.id, e.target.value)} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] font-bold text-slate-300 focus:outline-none cursor-pointer">
                                {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                              </select>
                            </td>
                            <td className="p-4 text-right font-mono font-bold text-emerald-400 text-sm">₹{l.budget}L</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Ecosystem Asset Inventory</h1>
                <p className="text-xs text-slate-400 mt-1">Available layout capacities mapped for standard real estate transformations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(p => (
                  <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-bold text-white">{p.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {p.location}</p>
                      </div>
                      <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">{p.status}</span>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-850 grid grid-cols-2 gap-2 text-xs font-medium text-slate-300">
                      <div><p className="text-slate-500 text-[10px] uppercase">Starting Base Allocation</p><p className="text-white font-bold mt-0.5">₹{p.price}</p></div>
                      <div><p className="text-slate-500 text-[10px] uppercase">Sold Units Rate</p><p className="text-emerald-400 font-bold mt-0.5">{p.sold} / {p.units} Units</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Identity Governance Controls</h1>
                  <p className="text-xs text-slate-400 mt-1">Safely authorize system seats and passcode structures.</p>
                </div>
                <button onClick={() => setIsUserModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-2">
                  <Plus className="h-4 w-4" /> PROVISION USER SEAT
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="p-4">Personnel Identity Name</th>
                      <th className="p-4">Clearance Role</th>
                      <th className="p-4">Regional Gateway Area</th>
                      <th className="p-4">Simulated Password Passcode</th>
                      <th className="p-4 text-right">Status State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-300">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-900/30">
                        <td className="p-4 font-bold text-white text-sm">{u.name} <br/><span className="text-[10px] font-mono text-slate-500 font-normal">{u.email}</span></td>
                        <td className="p-4 font-semibold text-indigo-400 flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> {u.role}</td>
                        <td className="p-4 text-slate-400 font-medium">{u.branch}</td>
                        <td className="p-4 font-mono font-bold text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 w-fit">{u.pass}</td>
                        <td className="p-4 text-right"><span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20">Authorized Active</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end" onClick={() => setSelectedLead(null)}>
          <div className="bg-slate-950 w-[500px] border-l border-slate-800 h-full flex flex-col p-6 overflow-y-auto space-y-6" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-slate-900 pb-4 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-black text-white">{selectedLead.name}</h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedLead.phone} • {selectedLead.email}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-slate-500 hover:text-white font-bold text-sm">✕</button>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 space-y-4 text-xs">
              <p className="text-[11px] uppercase font-black text-slate-300 tracking-wider flex items-center gap-1.5"><ShieldAlert className="h-4 w-4 text-indigo-400" /> Walkthrough Compliance Fields</p>
              
              <div className="space-y-1">
                <label className="text-slate-500 font-bold text-[10px]">Verification Tour Date</label>
                <input type="date" value={svDate} onChange={(e) => setSvDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-300 font-mono text-xs focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold text-[10px]">Observations Notes Log</label>
                <textarea rows={3} value={svNotes} onChange={(e) => setSvNotes(e.target.value)} placeholder="Enter walkthrough feedback..." className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-300 text-xs focus:outline-none" />
              </div>
              <button type="button" onClick={() => {
                if(!svDate || !svNotes.trim()) { alert("All verification parameters required."); return; }
                setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, svDate, svNotes, status: "Site Visit Done" } : l));
                setSelectedLead(null);
                setSvDate(""); setSvNotes("");
              }} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded text-xs transition-colors">Commit Verification File Logs</button>
            </div>
          </div>
        </div>
      )}

      {isLeadModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h2 className="text-base font-black text-white tracking-wide">Capture Incoming Client Data</h2>
              <button onClick={() => setIsLeadModalOpen(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Client Name *</label>
                  <input type="text" required value={newLeadForm.name} onChange={(e)=>setNewLeadForm({...newLeadForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-200 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Source Channel Hub</label>
                  <select value={newLeadForm.source} onChange={(e)=>setNewLeadForm({...newLeadForm, source: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-300 focus:outline-none">
                    {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Phone Matrix *</label>
                  <input type="text" required value={newLeadForm.phone} onChange={(e)=>setNewLeadForm({...newLeadForm, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-200 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Email Endpoint</label>
                  <input type="email" value={newLeadForm.email} onChange={(e)=>setNewLeadForm({...newLeadForm, email: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-200 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">BHK Variant</label>
                  <select value={newLeadForm.bhk} onChange={(e)=>setNewLeadForm({...newLeadForm, bhk: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-300 focus:outline-none">
                    {BHK_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Budget (Lakhs)</label>
                  <input type="number" value={newLeadForm.budget} onChange={(e)=>setNewLeadForm({...newLeadForm, budget: parseInt(e.target.value)||0})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-200 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Project Name</label>
                  <select value={newLeadForm.project} onChange={(e)=>setNewLeadForm({...newLeadForm, project: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-300 focus:outline-none">
                    {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg shadow-lg transition-colors text-xs uppercase tracking-wider">Commit Record to Active Pipeline</button>
            </form>
          </div>
        </div>
      )}

      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h2 className="text-base font-black text-white tracking-wide">Provision Clearance Authorization Pass</h2>
              <button onClick={() => setIsUserModalOpen(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Personnel Legal Name *</label>
                <input type="text" required value={newUserForm.name} onChange={(e)=>setNewUserForm({...newUserForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-200 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Privilege Tier Role</label>
                  <select value={newUserForm.role} onChange={(e)=>setNewUserForm({...newUserForm, role: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-300 focus:outline-none">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Area Branch Scope</label>
                  <select value={newUserForm.branch} onChange={(e)=>setNewUserForm({...newUserForm, branch: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-300 focus:outline-none">
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Corporate Authentication Email *</label>
                <input type="email" required value={newUserForm.email} onChange={(e)=>setNewUserForm({...newUserForm, email: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-200 focus:outline-none" placeholder="name@iconic.in" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Gateway Phone *</label>
                  <input type="text" required value={newUserForm.phone} onChange={(e)=>setNewUserForm({...newUserForm, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-200 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Portal Password Passcode *</label>
                  <input type="text" required value={newUserForm.pass} onChange={(e)=>setNewUserForm({...newUserForm, pass: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-amber-400 font-mono font-bold focus:outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg shadow-lg transition-colors text-xs uppercase tracking-wider mt-2">Deploy Identity Credentials Pass</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
