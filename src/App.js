import React, { useState, useMemo } from "react";
import { 
  Users, ShieldAlert, BarChart3, Building2, Briefcase, 
  Layers, PhoneCall, Calendar, Search, Plus, TrendingUp, 
  DollarSign, MapPin, Shield, FileText, Clock, UserCheck
} from "lucide-react";

// ─── DATA CONFIGURATIONS & INITIAL STATES ───────────────────────────────────
const ROLES = ["Admin", "Branch Manager", "Team Lead", "Telecaller", "Field Agent"];
const BRANCHES = ["Madurai", "Chennai South", "Chennai North", "Coimbatore"];
const SOURCES = ["Website", "IVR", "Referral", "Walk-in", "Social Media", "99acres", "MagicBricks"];
const STATUSES = ["New", "Contacted", "Interested", "Site Visit Scheduled", "Site Visit Done", "Negotiation", "Converted", "Not Interested", "On Hold"];
const BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "Villa"];

const INITIAL_USERS = [
  { id: 1, name: "Arjun Sharma", avatar: "AS", role: "Admin", branch: "All Branches", email: "arjun@iconic.in", phone: "98400 00001", active: true },
  { id: 2, name: "Priya Nair", avatar: "PN", role: "Branch Manager", branch: "Madurai", email: "priya@iconic.in", phone: "98400 00002", active: true },
  { id: 3, name: "Karthik Rajan", avatar: "KR", role: "Team Lead", branch: "Madurai", email: "karthik@iconic.in", phone: "98400 00003", active: true },
  { id: 4, name: "Divya Menon", avatar: "DM", role: "Telecaller", branch: "Madurai", email: "divya@iconic.in", phone: "98400 00004", active: true },
  { id: 5, name: "Rohan Das", avatar: "RD", role: "Field Agent", branch: "Madurai", email: "rohan@iconic.in", phone: "98400 00005", active: true },
];

const INITIAL_PROJECTS = [
  { id: 1, name: "Vishal Virinchi Apartments", branch: "Madurai", location: "Bypass Road", units: 10, sold: 2, type: "Apartment", status: "Active", price: "₹65L – ₹90L" },
  { id: 2, name: "ICONIC Lakeview", branch: "Chennai South", location: "Velachery", units: 120, sold: 45, type: "Apartment", status: "Active", price: "₹72L – ₹1.1Cr" },
  { id: 3, name: "ICONIC Serenity", branch: "Chennai South", location: "Sholinganallur", units: 80, sold: 62, type: "Apartment", status: "Active", price: "₹85L – ₹1.3Cr" },
  { id: 4, name: "ICONIC Greens", branch: "Coimbatore", location: "Saravanampatti", units: 60, sold: 18, type: "Villa", status: "Pre-launch", price: "₹1.2Cr – ₹1.8Cr" },
];

const INITIAL_LEADS = [
  { id: 1, name: "Suresh Kumar", phone: "98400 11234", email: "suresh@gmail.com", source: "99acres", assignedTo: "Rohan Das", teamLead: "Karthik Rajan", branch: "Madurai", status: "Interested", bhk: "3 BHK", location: "Bypass Road", budget: 85, project: "Vishal Virinchi Apartments", notes: "Ready-to-move near metro framework setup requested.", svDate: "", svNotes: "", history: [{ date: "2026-05-15", by: "Divya Menon", action: "Called – Highly interested in 3BHK model layout." }] },
  { id: 2, name: "Lakshmi Rao", phone: "99400 22345", email: "lakshmi@yahoo.com", source: "IVR", assignedTo: "Rohan Das", teamLead: "Karthik Rajan", branch: "Madurai", status: "Site Visit Scheduled", bhk: "2 BHK", location: "Bypass Road", budget: 68, project: "Vishal Virinchi Apartments", notes: "Prefers lower floor allocations.", svDate: "", svNotes: "", history: [{ date: "2026-05-20", by: "Divya Menon", action: "Site visit confirmed via WhatsApp calendar automation." }] },
  { id: 3, name: "Vijay Anand", phone: "97400 33456", email: "vijay@outlook.com", source: "Referral", assignedTo: "Divya Menon", teamLead: "Karthik Rajan", branch: "Madurai", status: "New", bhk: "4 BHK", location: "Bypass Road", budget: 140, project: "ICONIC Greens", notes: "High net-worth executive buyer status.", svDate: "", svNotes: "", history: [{ date: "2026-05-28", by: "System Gateway", action: "Lead ingestion completed smoothly." }] },
  { id: 4, name: "Meena Selvam", phone: "96400 44567", email: "meena@gmail.com", source: "Walk-in", assignedTo: "Rohan Das", teamLead: "Karthik Rajan", branch: "Madurai", status: "Negotiation", bhk: "3 BHK", location: "Bypass Road", budget: 90, project: "Vishal Virinchi Apartments", notes: "Requesting a 1.5% token adjustments override.", svDate: "2026-05-21", svNotes: "Completed walkthrough. Exceptionally pleased with car parking slots.", history: [{ date: "2026-05-21", by: "Rohan Das", action: "Physical layout tour finalized." }] },
  { id: 5, name: "Ramesh Babu", phone: "93400 77890", email: "ramesh@gmail.com", source: "MagicBricks", assignedTo: "Divya Menon", teamLead: "Karthik Rajan", branch: "Madurai", status: "Converted", bhk: "2 BHK", location: "Bypass Road", budget: 75, project: "Vishal Virinchi Apartments", notes: "Closed deal closure standard.", svDate: "2026-05-10", svNotes: "Token advance received cleanly.", history: [{ date: "2026-05-12", by: "Priya Nair", action: "Converted to formal booked unit account." }] },
];

const INITIAL_VISITS = [
  { id: 1, leadName: "Lakshmi Rao", agent: "Rohan Das", project: "Vishal Virinchi Apartments", date: "2026-06-02", time: "10:30 AM", status: "Scheduled", notes: "Family group visit requested transport support." },
  { id: 2, leadName: "Meena Selvam", agent: "Rohan Das", project: "Vishal Virinchi Apartments", date: "2026-05-21", time: "11:00 AM", status: "Completed", notes: "Excellent feedback gathered." },
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
  const [currentRole, setCurrentRole] = useState("Admin");
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [projects] = useState(INITIAL_PROJECTS);
  const [visits, setVisits] = useState(INITIAL_VISITS);

  const [selectedLead, setSelectedLead] = useState(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const [newLeadForm, setNewLeadForm] = useState({ name: "", phone: "", email: "", source: "Website", assignedTo: "Rohan Das", branch: "Madurai", status: "New", bhk: "3 BHK", location: "", budget: 75, project: "Vishal Virinchi Apartments", notes: "" });
  const [newUserForm, setNewUserForm] = useState({ name: "", role: "Telecaller", branch: "Madurai", email: "", phone: "" });

  const [svDate, setSvDate] = useState("");
  const [svNotes, setSvNotes] = useState("");
  const [svError, setSvError] = useState("");

  const visibleLeads = useMemo(() => {
    if (currentRole === "Admin" || currentRole === "Branch Manager" || currentRole === "Team Lead") {
      return leads;
    }
    if (currentRole === "Telecaller") {
      return leads.filter(l => l.assignedTo === "Divya Menon" || l.status === "New");
    }
    if (currentRole === "Field Agent") {
      return leads.filter(l => l.assignedTo === "Rohan Das");
    }
    return [];
  }, [currentRole, leads]);

  const handleCreateLead = (e) => {
    e.preventDefault();
    const created = {
      ...newLeadForm,
      id: Date.now(),
      teamLead: "Karthik Rajan",
      svDate: "",
      svNotes: "",
      history: [{ date: new Date().toISOString().split("T")[0], by: "System", action: "Lead recorded inside central runtime folder index." }]
    };
    setLeads([created, ...leads]);
    setIsLeadModalOpen(false);
    setNewLeadForm({ name: "", phone: "", email: "", source: "Website", assignedTo: "Rohan Das", branch: "Madurai", status: "New", bhk: "3 BHK", location: "", budget: 75, project: "Vishal Virinchi Apartments", notes: "" });
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
    setNewUserForm({ name: "", role: "Telecaller", branch: "Madurai", email: "", phone: "" });
  };

  const executeStatusTransition = (leadId, nextStatus) => {
    if (nextStatus === "Site Visit Done") {
      const target = leads.find(l => l.id === leadId);
      if (target && (!target.svDate || !target.svNotes.trim())) {
        alert("🔒 Compliance Guardrail Alert: You cannot set state to 'Site Visit Done' without committing the walkthrough verification date and field executive audit logs.");
        return;
      }
    }
    setLeads(leads.map(l => l.id === leadId ? {
      ...l, 
      status: nextStatus,
      history: [...l.history, { date: new Date().toISOString().split("T")[0], by: "Active Context Override", action: `Pipeline milestone modified to: ${nextStatus}` }]
    } : l));
    if (selectedLead?.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: nextStatus } : null);
    }
  };

  const commitSiteVisitAudit = () => {
    if (!svDate || !svNotes.trim()) {
      setSvError("All confirmation input fields are strictly mandatory.");
      return;
    }
    if (!selectedLead) return;
    
    setLeads(leads.map(l => l.id === selectedLead.id ? {
      ...l,
      status: "Site Visit Done",
      svDate,
      svNotes,
      history: [...l.history, { date: new Date().toISOString().split("T")[0], by: "Field Executive Runner", action: `Walkthrough Verified Done on ${svDate}. Notes: ${svNotes}` }]
    } : l));

    setVisits([
      ...visits,
      { id: Date.now(), leadName: selectedLead.name, agent: selectedLead.assignedTo, project: selectedLead.project, date: svDate, time: "12:00 PM", status: "Completed", notes: svNotes }
    ]);

    setSelectedLead(prev => prev ? { ...prev, status: "Site Visit Done", svDate, svNotes } : null);
    setSvDate("");
    setSvNotes("");
    setSvError("");
  };

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
              <Layers className="h-4 w-4" /> DASHBOARDS
            </button>
            <button onClick={() => setActiveTab("leads")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeTab === "leads" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              <PhoneCall className="h-4 w-4" /> LEAD ECOSYSTEM
            </button>
            <button onClick={() => setActiveTab("visits")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeTab === "visits" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              <Calendar className="h-4 w-4" /> SITE WALKTHROUGHS
            </button>
            <button onClick={() => setActiveTab("projects")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeTab === "projects" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              <Building2 className="h-4 w-4" /> ASSET PORTFOLIO
            </button>
            {(currentRole === "Admin" || currentRole === "Branch Manager") && (
              <button onClick={() => setActiveTab("users")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeTab === "users" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
                <Users className="h-4 w-4" /> GOVERNANCE HUBS
              </button>
            )}
            <button onClick={() => setActiveTab("reports")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeTab === "reports" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              <BarChart3 className="h-4 w-4" /> ANALYTICS MATRIX
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-850">
            <Shield className="h-5 w-5 text-indigo-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">SECURE ENVIRONMENT</p>
              <p className="text-xs font-black text-slate-200 tracking-wide">{currentRole}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-8 z-10">
          <div className="relative w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input type="text" placeholder="Global structural search..." className="w-full bg-slate-900 border border-slate-850 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-indigo-500 text-slate-300" />
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Simulate Enterprise Clearance Tier:</span>
            <select value={currentRole} onChange={(e) => { setCurrentRole(e.target.value); setActiveTab("dashboard"); }} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold text-indigo-400 focus:outline-none cursor-pointer">
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">{currentRole} Portal Control Console</h1>
                <p className="text-xs text-slate-400 mt-1">Operational records framework configured securely for ICONIC Projects.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <div className="flex justify-between text-slate-400"><span className="text-[10px] font-bold tracking-wider uppercase">Scoped Live Ingestions</span><Briefcase className="h-4 w-4 text-indigo-400" /></div>
                  <p className="text-2xl font-black text-white mt-1">{visibleLeads.length}</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <div className="flex justify-between text-slate-400"><span className="text-[10px] font-bold tracking-wider uppercase">Closed Booked Capital</span><DollarSign className="h-4 w-4 text-emerald-400" /></div>
                  <p className="text-2xl font-black text-emerald-400 mt-1">₹{visibleLeads.reduce((acc, curr) => acc + (curr.status === "Converted" ? curr.budget : 0), 0)}L</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <div className="flex justify-between text-slate-400"><span className="text-[10px] font-bold tracking-wider uppercase">Active Field Tours</span><Calendar className="h-4 w-4 text-amber-400" /></div>
                  <p className="text-2xl font-black text-white mt-1">{visits.filter(v => v.status === "Scheduled").length}</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <div className="flex justify-between text-slate-400"><span className="text-[10px] font-bold tracking-wider uppercase">Target Conversion Standard</span><TrendingUp className="h-4 w-4 text-sky-400" /></div>
                  <p className="text-2xl font-black text-white mt-1">0.5% incentive</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {(currentRole === "Admin" || currentRole === "Branch Manager") && (
                  <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-indigo-400" /> Enterprise Allocation Run-rate (10-Unit Framework Monitoring)
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500 font-bold">
                            <th className="pb-3">Regional Domain</th>
                            <th className="pb-3">Data Distribution Share</th>
                            <th className="pb-3">Milestone Closures</th>
                            <th className="pb-3 text-right">Aggregate Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900 text-slate-300">
                          <tr>
                            <td className="py-3 font-semibold text-white">Madurai Main Branch</td>
                            <td className="py-3">{leads.length} records</td>
                            <td className="py-3 text-emerald-400 font-bold">{leads.filter(l => l.status === "Converted").length} units secured</td>
                            <td className="py-3 text-right font-mono font-bold text-indigo-400">₹{leads.reduce((a,c)=>a+c.budget,0)}L</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {currentRole === "Team Lead" && (
                  <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4 flex items-center gap-2">
                      <Users className="h-4 w-4 text-amber-400" /> Representative Operation Loads
                    </h2>
                    <div className="space-y-3">
                      {users.filter(u => u.role !== "Admin").map(u => {
                        const count = leads.filter(l => l.assignedTo === u.name).length;
                        return (
                          <div key={u.id} className="p-3 bg-slate-900 border border-slate-850 rounded-xl flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-white">{u.name}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{u.role} — {u.branch}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono text-slate-400">{count} Active Accounts</span>
                              <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-indigo-500 h-full" style={{ width: `${Math.min((count/6)*100, 100)}%` }}></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {(currentRole === "Telecaller" || currentRole === "Field Agent") && (
                  <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-emerald-400" /> Immediate Desk SLA Queues (Follow-Up Pending)
                    </h2>
                    <div className="space-y-3">
                      {visibleLeads.filter(l => l.status !== "Converted" && l.status !== "Not Interested").slice(0, 3).map(l => (
                        <div key={l.id} onClick={() => setSelectedLead(l)} className="p-3 bg-slate-900 border border-slate-850 rounded-xl flex justify-between items-center hover:border-slate-700 transition-colors cursor-pointer">
                          <div>
                            <p className="text-xs font-bold text-white">{l.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{l.project} ({l.bhk})</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded border" style={{ backgroundColor: SC[l.status]?.bg, color: SC[l.status]?.text, borderColor: SC[l.status]?.border }}>{l.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-sky-400" /> Source Funnel Attribution
                    </h2>
                    <div className="space-y-3">
                      {["99acres", "MagicBricks", "Website", "Social Media"].map(src => {
                        const amt = leads.filter(l => l.source === src).length;
                        const pct = Math.round((amt / leads.length) * 100) || 0;
                        return (
                          <div key={src} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-slate-400">{src}</span>
                              <span className="text-slate-500 font-mono">{amt} ({pct}%)</span>
                            </div>
                            <div className="bg-slate-900 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-sky-400 h-full" style={{ width: `${pct}%` }}></div>
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
                  <h1 className="text-2xl font-black text-white tracking-tight">Lead Ecosystem Storage</h1>
                  <p className="text-xs text-slate-400 mt-1">Live data row views secured under automated RBAC verification rules.</p>
                </div>
                {["Admin", "Branch Manager", "Team Lead"].includes(currentRole) && (
                  <button onClick={() => setIsLeadModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors">
                    <Plus className="h-4 w-4" /> INGEST RECORD
                  </button>
                )}
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="p-4">Identified Target</th>
                        <th className="p-4">Structural Context</th>
                        <th className="p-4">Acquisition Hub</th>
                        <th className="p-4">Owner Allocation</th>
                        <th className="p-4">Milestone Stage</th>
                        <th className="p-4 text-right">Target Capital</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {visibleLeads.map(l => (
                        <tr key={l.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-4 font-bold text-white cursor-pointer" onClick={() => setSelectedLead(l)}>
                            <p className="text-sm">{l.name}</p>
                            <p className="text-[11px] text-slate-500 font-mono mt-0.5">{l.phone}</p>
                          </td>
                          <td className="p-4">
                            <p className="font-semibold text-slate-200">{l.project}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{l.bhk} • {l.location}</p>
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "visits" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Site Walkthrough Logs</h1>
                <p className="text-xs text-slate-400 mt-1">Physical verification field assignments managed in real time.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visits.map(v => (
                  <div key={v.id} className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white">{v.leadName}</h3>
                        <p className="text-xs text-indigo-400 font-medium mt-0.5">{v.project}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${v.status === "Completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>{v.status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 bg-slate-900 p-3 rounded-lg border border-slate-850 text-xs text-slate-300 font-medium">
                      <div><p className="text-slate-500 text-[10px] uppercase font-bold">Schedule Timeline</p><p className="mt-0.5 text-white">{v.date} | {v.time}</p></div>
                      <div><p className="text-slate-500 text-[10px] uppercase font-bold">Field Officer</p><p className="mt-0.5 text-white">{v.agent}</p></div>
                    </div>
                    {v.notes && (
                      <div className="text-xs">
                        <p className="text-slate-500 text-[10px] uppercase font-bold">Field Observations Report</p>
                        <p className="text-slate-400 mt-1 italic bg-slate-900 p-2.5 rounded border border-slate-850 leading-relaxed">"{v.notes}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Corporate Asset Infrastructure</h1>
                <p className="text-xs text-slate-400 mt-1">Units inventory breakdown across portfolio metrics.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(p => (
                  <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-bold text-white">{p.name}</h3>
                        <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">{p.status}</span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" /> {p.location}, {p.branch}</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-850 grid grid-cols-2 gap-2 text-xs">
                      <div><p className="text-slate-500">Price Tier Range</p><p className="text-slate-300 font-bold mt-0.5">{p.price}</p></div>
                      <div><p className="text-slate-500">Allocation Sold</p><p className="text-emerald-400 font-bold mt-0.5">{p.sold} / {p.units} Units</p></div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-medium text-slate-400"><span>Structural Capacity Taken</span><span>{Math.round((p.sold/p.units)*100)}%</span></div>
                      <div className="bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: `${(p.sold/p.units)*100}%` }}></div>
                      </div>
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
                  <h1 className="text-2xl font-black text-white tracking-tight">System Identity Governance</h1>
                  <p className="text-xs text-slate-400 mt-1">Management interfaces to safely authorize core corporate user records.</p>
                </div>
                <button onClick={() => setIsUserModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-2">
                  <Plus className="h-4 w-4" /> PROVISION SEAT
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="p-4">Personnel Asset</th>
                      <th className="p-4">Clearance Tier Role</th>
                      <th className="p-4">Regional Gateway Scope</th>
                      <th className="p-4">Communication Details</th>
                      <th className="p-4 text-right">State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-300">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-900/30">
                        <td className="p-4 font-bold text-white text-sm">{u.name}</td>
                        <td className="p-4 font-semibold text-indigo-400 flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> {u.role}</td>
                        <td className="p-4 text-slate-400 font-medium">{u.branch}</td>
                        <td className="p-4 font-mono text-slate-500">{u.email} <br /> {u.phone}</td>
                        <td className="p-4 text-right"><span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20">Authorized Active</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Analytics Optimization Matrix</h1>
                <p className="text-xs text-slate-400 mt-1">Aggregated operational trends compiled to assist company transformations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
                  <h3 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-4">Pipeline Milestones Aggregation</h3>
                  <div className="space-y-3">
                    {STATUSES.map(st => {
                      const amount = leads.filter(l => l.status === st).length;
                      return (
                        <div key={st} className="flex justify-between items-center bg-slate-900 border border-slate-850 rounded-lg p-2.5 text-xs font-medium">
                          <span className="text-slate-400">{st}</span>
                          <span className="bg-slate-950 border border-slate-800 px-3 py-1 rounded text-white font-mono font-bold">{amount} records</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase text-slate-300 tracking-wider mb-4">Configuration Demand Densities</h3>
                    <div className="space-y-4">
                      {BHK_OPTIONS.map(variant => {
                        const count = leads.filter(l => l.bhk === variant).length;
                        const pct = Math.round((count / leads.length) * 100) || 0;
                        return (
                          <div key={variant} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-slate-400">{variant} Strategy Share</span>
                              <span className="text-slate-300 font-mono font-bold">{count} Units</span>
                            </div>
                            <div className="bg-slate-900 h-2 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 h-full" style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="bg-slate-900 p-4 border border-slate-850 rounded-xl text-xs text-slate-400 leading-relaxed mt-6">
                    <span className="font-bold text-white block mb-1">📈 Executive Strategic Directive Note:</span>
                    Current acquisition metrics confirm highest concentration levels centered directly inside the <span className="text-indigo-400 font-bold">3 BHK product tier segment</span>.
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end transition-opacity" onClick={() => setSelectedLead(null)}>
          <div className="bg-slate-950 w-[500px] border-l border-slate-800 h-full flex flex-col justify-between overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div>
              <div className="p-6 border-b border-slate-900 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-black text-white">{selectedLead.name}</h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedLead.phone} • {selectedLead.email}</p>
                </div>
                <button onClick={() => setSelectedLead(null)} className="text-slate-500 hover:text-white font-bold">✕</button>
              </div>

              <div className="p-6 space-y-6 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-850">
                    <p className="text-slate-500 font-bold tracking-wide uppercase text-[10px]">Product Intent</p>
                    <p className="text-slate-200 font-bold text-xs mt-0.5">{selectedLead.project}</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-850">
                    <p className="text-slate-500 font-bold tracking-wide uppercase text-[10px]">Layout Matrix</p>
                    <p className="text-slate-200 font-bold text-xs mt-0.5">{selectedLead.bhk}</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-850">
                    <p className="text-slate-500 font-bold tracking-wide uppercase text-[10px]">Assigned Owner</p>
                    <p className="text-slate-200 font-bold text-xs mt-0.5">{selectedLead.assignedTo}</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-850">
                    <p className="text-slate-500 font-bold tracking-wide uppercase text-[10px]">Financial Intent</p>
                    <p className="text-emerald-400 font-black text-xs mt-0.5">₹{selectedLead.budget} Lakhs</p>
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 space-y-3">
                  <p className="text-[11px] uppercase font-black text-slate-300 tracking-wider flex items-center gap-1.5"><ShieldAlert className="h-4 w-4 text-indigo-400" /> Walkthrough Verification Validation Drawer</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">Both inputs are systematically verified by compliance managers before allowing pipeline tier advancement overrides.</p>
                  
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold text-[10px]">Walkthrough Log Date *</label>
                    <input type="date" value={svDate} onChange={(e) => setSvDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-300 font-mono text-xs focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold text-[10px]">Outcome Audit Notes *</label>
                    <textarea rows={3} value={svNotes} onChange={(e) => setSvNotes(e.target.value)} placeholder="Enter full family feedback or structural alterations requested..." className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-300 text-xs focus:outline-none focus:border-indigo-500" />
                  </div>
                  
                  {svError && <p className="text-[10px] text-rose-400 font-bold font-mono">⚠️ {svError}</p>}
                  
                  {selectedLead.svDate ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold p-2 rounded text-center">✓ Verified Completed: {selectedLead.svDate}</div>
                  ) : (
                    <button type="button" onClick={commitSiteVisitAudit} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded transition-colors text-xs">Verify Walkthrough Complete</button>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold tracking-wider uppercase text-slate-500">System Activity Audit Trail</p>
                  <div className="space-y-2.5 border-l border-slate-800 pl-4 ml-1">
                    {selectedLead.history.map((h, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-indigo-500"></div>
                        <p className="text-[11px] text-slate-500 font-semibold">{h.date} — via {h.by}</p>
                        <p className="text-xs text-slate-300 mt-0.5 font-medium">{h.action}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {isLeadModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h2 className="text-base font-black text-white tracking-wide">Ingest Customer Acquisition Asset</h2>
              <button onClick={() => setIsLeadModalOpen(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Target Client Name *</label>
                  <input type="text" required value={newLeadForm.name} onChange={(e)=>setNewLeadForm({...newLeadForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-200 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Attribution Channel Source</label>
                  <select value={newLeadForm.source} onChange={(e)=>setNewLeadForm({...newLeadForm, source: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-300 focus:outline-none">
                    {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Phone gateway *</label>
                  <input type="text" required value={newLeadForm.phone} onChange={(e)=>setNewLeadForm({...newLeadForm, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-200 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Email Profile</label>
                  <input type="email" value={newLeadForm.email} onChange={(e)=>setNewLeadForm({...newLeadForm, email: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-200 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">BHK Variant Intent</label>
                  <select value={newLeadForm.bhk} onChange={(e)=>setNewLeadForm({...newLeadForm, bhk: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-300 focus:outline-none">
                    {BHK_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Target Capital (Lakhs)</label>
                  <input type="number" value={newLeadForm.budget} onChange={(e)=>setNewLeadForm({...newLeadForm, budget: parseInt(e.target.value)||0})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-200 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Location Zone Preference</label>
                  <input type="text" value={newLeadForm.location} onChange={(e)=>setNewLeadForm({...newLeadForm, location: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-200 focus:outline-none" placeholder="e.g. Bypass Road" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Corporate Asset Allocation Project</label>
                <select value={newLeadForm.project} onChange={(e)=>setNewLeadForm({...newLeadForm, project: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-300 focus:outline-none">
                  {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg shadow-lg transition-colors text-xs uppercase tracking-wider">Commit Ingestion Block to Active Pipelines</button>
            </form>
          </div>
        </div>
      )}

      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h2 className="text-base font-black text-white tracking-wide">Provision Identity Authorization Seat</h2>
              <button onClick={() => setIsUserModalOpen(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Full Officer Legal Name *</label>
                <input type="text" required value={newUserForm.name} onChange={(e)=>setNewUserForm({...newUserForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-200 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Authorization Privilege Role</label>
                  <select value={newUserForm.role} onChange={(e)=>setNewUserForm({...newUserForm, role: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-300 focus:outline-none">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Regional Area Office Scope</label>
                  <select value={newUserForm.branch} onChange={(e)=>setNewUserForm({...newUserForm, branch: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-300 focus:outline-none">
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Corporate Authentication Email *</label>
                <input type="email" required value={newUserForm.email} onChange={(e)=>setNewUserForm({...newUserForm, email: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-200 focus:outline-none" placeholder="name@iconic.in" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Gateway Phone Matrix *</label>
                <input type="text" required value={newUserForm.phone} onChange={(e)=>setNewUserForm({...newUserForm, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2 rounded-lg text-slate-200 focus:outline-none" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg shadow-lg transition-colors text-xs uppercase tracking-wider mt-2">Deploy Live Clearance Pass</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
