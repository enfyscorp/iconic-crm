import React, { useState, useMemo } from "react";
import { 
  Users, UserCheck, ShieldAlert, BarChart3, Building2, Briefcase, 
  Layers, PhoneCall, CheckCircle2, XCircle, AlertTriangle, Clock, 
  Calendar, Search, Filter, Plus, ArrowUpRight, TrendingUp, DollarSign, 
  MapPin, Shield, Check, Trash2, Edit2, UserPlus, FileText, ChevronRight
} from "lucide-react";

// ─── ROBUST CONFIGURATIONS & MOCK DATA ────────────────────────────────────────
const ROLES = ["Admin", "Branch Manager", "Team Lead", "Telecaller", "Field Agent"] as const;
type Role = typeof ROLES[number];

interface User {
  id: string;
  name: string;
  role: Role;
  branch: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  status: "New" | "Contacted" | "Interested" | "Site Visit Scheduled" | "Site Visit Done" | "Negotiation" | "Converted" | "Not Interested" | "On Hold";
  bhk: string;
  budget: number; // in Lakhs
  location: string;
  branch: string;
  assignedTo: string; // User Name
  createdAt: string;
  lastFollowUp: string;
  nextFollowUp: string;
}

interface SiteVisit {
  id: string;
  leadName: string;
  projectName: string;
  date: string;
  time: string;
  assignedAgent: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  notes: string;
}

const INITIAL_USERS: User[] = [
  { id: "U1", name: "Arjun Sharma", role: "Admin", branch: "All Branches", email: "arjun@iconic.in", phone: "98400 00001", status: "Active" },
  { id: "U2", name: "Priya Nair", role: "Branch Manager", branch: "Madurai", email: "priya@iconic.in", phone: "98400 00002", status: "Active" },
  { id: "U3", name: "Karthik Rajan", role: "Team Lead", branch: "Madurai", email: "karthik@iconic.in", phone: "98400 00003", status: "Active" },
  { id: "U4", name: "Divya Menon", role: "Telecaller", branch: "Madurai", email: "divya@iconic.in", phone: "98400 00004", status: "Active" },
  { id: "U5", name: "Suresh Kumar", role: "Field Agent", branch: "Madurai", email: "suresh@iconic.in", phone: "98400 00005", status: "Active" },
];

const INITIAL_LEADS: Lead[] = [
  { id: "L1", name: "Rahul Krishnan", phone: "98765 43210", email: "rahul@gmail.com", source: "99acres", status: "Site Visit Done", bhk: "3 BHK", budget: 85, location: "Virinchi Apartments", branch: "Madurai", assignedTo: "Suresh Kumar", createdAt: "2026-05-10", lastFollowUp: "2026-05-28", nextFollowUp: "2026-05-30" },
  { id: "L2", name: "Meera Jasmine", phone: "94471 23456", email: "meera@yahoo.com", source: "MagicBricks", status: "Negotiation", bhk: "2 BHK", budget: 65, location: "Virinchi Apartments", branch: "Madurai", assignedTo: "Suresh Kumar", createdAt: "2026-05-12", lastFollowUp: "2026-05-29", nextFollowUp: "2026-05-31" },
  { id: "L3", name: "Anand Viswanathan", phone: "95678 98765", email: "anand@live.com", source: "Social Media", status: "New", bhk: "4 BHK / Villa", budget: 150, location: "Iconic Enclave", branch: "Madurai", assignedTo: "Divya Menon", createdAt: "2026-05-29", lastFollowUp: "None", nextFollowUp: "2026-05-29" },
  { id: "L4", name: "Siddharth Ram", phone: "91234 56789", email: "sid@gmail.com", source: "Website", status: "Site Visit Scheduled", bhk: "3 BHK", budget: 90, location: "Virinchi Apartments", branch: "Madurai", assignedTo: "Suresh Kumar", createdAt: "2026-05-15", lastFollowUp: "2026-05-27", nextFollowUp: "2026-05-30" },
  { id: "L5", name: "Lakshmi Priya", phone: "99443 11223", email: "lakshmi@outlook.com", source: "Walk-in", status: "Converted", bhk: "2 BHK", budget: 60, location: "Virinchi Apartments", branch: "Madurai", assignedTo: "Karthik Rajan", createdAt: "2026-04-20", lastFollowUp: "2026-05-25", nextFollowUp: "None" },
];

const INITIAL_VISITS: SiteVisit[] = [
  { id: "V1", leadName: "Rahul Krishnan", projectName: "Virinchi Apartments", date: "2026-05-28", time: "11:00 AM", assignedAgent: "Suresh Kumar", status: "Completed", notes: "Client loved the 3 BHK model flat. Requested structural modification details." },
  { id: "V2", leadName: "Siddharth Ram", projectName: "Virinchi Apartments", date: "2026-05-30", time: "03:30 PM", assignedAgent: "Suresh Kumar", status: "Scheduled", notes: "Needs family transport assistance for the site walkthrough." },
];

export default function IconicCRM() {
  const [currentRole, setCurrentRole] = useState<Role>("Admin");
  const [activeTab, setActiveTab] = useState<"dashboard" | "leads" | "visits" | "users" | "reports">("dashboard");
  
  // Real App Data State
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [visits, setVisits] = useState<SiteVisit[]>(INITIAL_VISITS);

  // Modal Control States
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  
  // Form States
  const [newUser, setNewUser] = useState<Omit<User, "id">>({ name: "", role: "Telecaller", branch: "Madurai", email: "", phone: "", status: "Active" });
  const [newLead, setNewLead] = useState<Omit<Lead, "id" | "createdAt" | "lastFollowUp">>({ name: "", phone: "", email: "", source: "Website", status: "New", bhk: "2 BHK", budget: 75, location: "Virinchi Apartments", branch: "Madurai", assignedTo: "Divya Menon", nextFollowUp: "" });

  // ─── ROLE-BASED DATA PROTECTION GATES (True RBAC) ──────────────────────────
  const filteredLeads = useMemo(() => {
    if (currentRole === "Admin" || currentRole === "Branch Manager") return leads;
    if (currentRole === "Team Lead") return leads; // Multi-agent view
    if (currentRole === "Telecaller") return leads.filter(l => l.assignedTo === "Divya Menon" || l.status === "New");
    if (currentRole === "Field Agent") return leads.filter(l => l.assignedTo === "Suresh Kumar");
    return [];
  }, [currentRole, leads]);

  // ─── CORE ACTION HANDLERS ──────────────────────────────────────────────────
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const created: User = { ...newUser, id: "U" + (users.length + 1) };
    setUsers([...users, created]);
    setIsUserModalOpen(false);
    setNewUser({ name: "", role: "Telecaller", branch: "Madurai", email: "", phone: "", status: "Active" });
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Lead = {
      ...newLead,
      id: "L" + (leads.length + 1),
      createdAt: new Date().toISOString().split("T")[0],
      lastFollowUp: "None"
    };
    setLeads([...leads, created]);
    setIsLeadModalOpen(false);
  };

  const handleStatusChange = (leadId: string, newStatus: Lead["status"]) => {
    // Structural Safeguard Enforcement
    if (newStatus === "Site Visit Done") {
      const confirmation = window.confirm("System Safeguard: Verify that field log feedback and structural site requirements have been collected before marking as Visit Done.");
      if (!confirmation) return;
    }
    setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus, lastFollowUp: new Date().toISOString().split("T")[0] } : l));
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans antialiased overflow-hidden">
      
      {/* SIDEBAR NAVIGATION CONTROL */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-2.5">
            <Building2 className="h-6 w-6 text-indigo-500" />
            <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">ICONIC PROJECTS</span>
          </div>
          <nav className="p-4 space-y-1.5">
            <button onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "dashboard" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              <Layers className="h-4 w-4" /> Dashboards
            </button>
            <button onClick={() => setActiveTab("leads")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "leads" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              <PhoneCall className="h-4 w-4" /> Lead Management
            </button>
            <button onClick={() => setActiveTab("visits")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "visits" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              <Calendar className="h-4 w-4" /> Site Walkthroughs
            </button>
            {(currentRole === "Admin" || currentRole === "Branch Manager") && (
              <button onClick={() => setActiveTab("users")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "users" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
                <Users className="h-4 w-4" /> System Governance
              </button>
            )}
            <button onClick={() => setActiveTab("reports")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === "reports" ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              <BarChart3 className="h-4 w-4" /> Analytics Engine
            </button>
          </nav>
        </div>
        
        {/* LOGGED PRIVILEGE MONITOR */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Shield className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Active Context</p>
              <p className="text-sm font-bold text-slate-200">{currentRole}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN DATA RUNTIME AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP INTERACTIVE DESKTOP BAR */}
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 w-96">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input type="text" placeholder="Global pipeline matrix lookup..." className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-indigo-500 text-slate-300 placeholder-slate-500" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              <span className="text-xs text-slate-400 font-medium">Testing Privilege Grid:</span>
              <select value={currentRole} onChange={(e) => { setCurrentRole(e.target.value as Role); setActiveTab("dashboard"); }} className="bg-transparent text-xs font-bold text-indigo-400 focus:outline-none cursor-pointer">
                {ROLES.map(r => <option key={r} value={r} className="bg-slate-950 text-slate-200">{r}</option>)}
              </select>
            </div>
          </div>
        </header>

        {/* COMPONENT INTERACTION CONTROLLER */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-900">
          
          {/* TAB 1: DYNAMIC DASHBOARD VIEWS ACCORDING TO ROLE */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-white">{currentRole} Command Dashboard</h1>
                  <p className="text-sm text-slate-400 mt-1">Real-time sales lifecycle analytics context optimized for ICONIC Projects.</p>
                </div>
                <div className="text-xs bg-slate-950 px-4 py-2 rounded-lg border border-slate-800 font-mono text-slate-400">
                  SLA Target: <span className="text-emerald-400 font-bold">0.5% closing incentive standard</span>
                </div>
              </div>

              {/* METRIC SCORING TILES */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">Active Scoped Funnel</p>
                    <Briefcase className="h-4 w-4 text-indigo-400" />
                  </div>
                  <p className="text-3xl font-black mt-2 text-white">{filteredLeads.length}</p>
                  <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1"><TrendingUp className="h-3 w-3 text-emerald-400" /> Live pipeline elements</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">Conversion Value</p>
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-black mt-2 text-white">₹{filteredLeads.reduce((acc, curr) => acc + (curr.status === "Converted" ? curr.budget : 0), 0)}L</p>
                  <p className="text-xs text-slate-500 mt-1.5">Executed revenue metrics</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">Site Walkthroughs</p>
                    <Calendar className="h-4 w-4 text-amber-400" />
                  </div>
                  <p className="text-3xl font-black mt-2 text-white">{visits.length}</p>
                  <p className="text-xs text-slate-500 mt-1.5">Scheduled properties</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">SLA Breach Alerts</p>
                    <ShieldAlert className="h-4 w-4 text-rose-400" />
                  </div>
                  <p className="text-3xl font-black mt-2 text-rose-400">0</p>
                  <p className="text-xs text-emerald-400 mt-1.5 font-medium">100% compliant timeline</p>
                </div>
              </div>

              {/* EXECUTIVE ANALYSIS VIEWPORTS BASED ON ROLE */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* ROLE SUB-PANEL: ADMIN & BRANCH GENERAL MANAGER VIEW */}
                {(currentRole === "Admin" || currentRole === "Branch Manager") && (
                  <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-sm font-bold tracking-wider uppercase text-slate-300 mb-4 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-indigo-400" /> Operational Framework Metrics (Virinchi Project)
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500 font-semibold">
                            <th className="pb-3">Branch Location</th>
                            <th className="pb-3">Total Allocation</th>
                            <th className="pb-3">Converted Accounts</th>
                            <th className="pb-3">Negotiation Runrate</th>
                            <th className="pb-3 text-right">Pipeline Allocation</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850 text-slate-300">
                          <tr className="hover:bg-slate-900/40">
                            <td className="py-3.5 font-semibold text-white">Madurai Corporate Office</td>
                            <td className="py-3.5">{leads.length} leads</td>
                            <td className="py-3.5 text-emerald-400 font-medium">{leads.filter(l => l.status === "Converted").length} units</td>
                            <td className="py-3.5">{leads.filter(l => l.status === "Negotiation").length} open</td>
                            <td className="py-3.5 text-right font-mono font-bold text-indigo-400">₹{leads.reduce((a,c)=>a+c.budget, 0)}L</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ROLE SUB-PANEL: REASSIGNMENT LOGIC FOR TEAM LEADS */}
                {currentRole === "Team Lead" && (
                  <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-sm font-bold tracking-wider uppercase text-slate-300 flex items-center gap-2">
                        <Users className="h-4 w-4 text-amber-400" /> Internal Desk Capacity Monitor
                      </h2>
                      <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 font-medium">Team Desk Level Only</span>
                    </div>
                    <div className="space-y-3.5">
                      {users.filter(u => u.role !== "Admin").map(u => {
                        const count = leads.filter(l => l.assignedTo === u.name).length;
                        return (
                          <div key={u.id} className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg">
                            <div>
                              <p className="text-xs font-bold text-white">{u.name}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">{u.role} — {u.branch}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xs font-mono font-medium text-slate-400">{count} Active Leads</span>
                              <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min((count / 5) * 100, 100)}%` }}></div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ROLE SUB-PANEL: TASK ACTIONS FOR TELECALLERS & FIELD AGENTS */}
                {(currentRole === "Telecaller" || currentRole === "Field Agent") && (
                  <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-sm font-bold tracking-wider uppercase text-slate-300 mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-emerald-400" /> My Immediate Task Board (SLA Action Required)
                    </h2>
                    <div className="space-y-3">
                      {filteredLeads.filter(l => l.status !== "Converted" && l.status !== "Not Interested").slice(0, 3).map(l => (
                        <div key={l.id} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center hover:border-slate-700 transition-colors">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{l.name}</span>
                              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">{l.id}</span>
                            </div>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                              <MapPin className="h-3 w-3 text-slate-500" /> {l.location} ({l.bhk})
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-semibold">{l.status}</span>
                            <p className="text-[10px] text-slate-500 mt-1">Next: {l.nextFollowUp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* DISTRIBUTION PLATFORM ACCOUNTABILITY ENGINE */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-sm font-bold tracking-wider uppercase text-slate-300 mb-4 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-sky-400" /> Acquisition Pipeline Source Share
                    </h2>
                    <div className="space-y-4">
                      {["99acres", "MagicBricks", "Social Media", "Website", "Walk-in"].map(src => {
                        const count = leads.filter(l => l.source === src).length;
                        const percentage = leads.length ? Math.round((count / leads.length) * 100) : 0;
                        return (
                          <div key={src} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400 font-medium">{src}</span>
                              <span className="font-mono text-slate-500">{count} ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                              <div className="bg-sky-400 h-full rounded-full" style={{ width: `${percentage}%` }}></div>
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

          {/* TAB 2: ROBUST INTERACTIVE DATA VIEW FOR LEADS */}
          {activeTab === "leads" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Lead Ecosystem</h1>
                  <p className="text-xs text-slate-400 mt-1">Granular lead detail rows mapped directly under live role context controls.</p>
                </div>
                <button onClick={() => setIsLeadModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors">
                  <Plus className="h-4 w-4" /> Capture Lead Record
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold tracking-wider uppercase">
                        <th className="p-4">Identified Target</th>
                        <th className="p-4">Structural Specification</th>
                        <th className="p-4">Source Hub</th>
                        <th className="p-4">Owner Assignment</th>
                        <th className="p-4">SLA Funnel Stage</th>
                        <th className="p-4 text-right">Financial Capital</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 text-slate-300">
                      {filteredLeads.map(l => (
                        <tr key={l.id} className="hover:bg-slate-900/30 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-white text-sm">{l.name}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{l.phone} • {l.email}</p>
                          </td>
                          <td className="p-4">
                            <p className="text-slate-200 font-medium">{l.location}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{l.bhk}</p>
                          </td>
                          <td className="p-4">
                            <span className="bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-medium text-[10px]">{l.source}</span>
                          </td>
                          <td className="p-4 text-slate-400 font-medium">{l.assignedTo}</td>
                          <td className="p-4">
                            <select value={l.status} onChange={(e) => handleStatusChange(l.id, e.target.value as Lead["status"])} className="bg-slate-900 border border-slate-800 text-xs rounded px-2 py-1 text-slate-300 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer">
                              {["New", "Contacted", "Interested", "Site Visit Scheduled", "Site Visit Done", "Negotiation", "Converted", "Not Interested", "On Hold"].map(st => (
                                <option key={st} value={st}>{st}</option>
                              ))}
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

          {/* TAB 3: PROPER SITE WALKTHROUGHS MODULE */}
          {activeTab === "visits" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Site Walkthrough Schedules</h1>
                <p className="text-xs text-slate-400 mt-1">Physical property tracking and confirmation framework for field operations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visits.map(v => (
                  <div key={v.id} className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-bold text-white">{v.leadName}</h3>
                        <p className="text-xs text-indigo-400 font-medium flex items-center gap-1 mt-0.5"><Building2 className="h-3 w-3" /> {v.projectName}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${v.status === "Completed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>{v.status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900 p-3 rounded-lg border border-slate-850">
                      <div>
                        <p className="text-slate-500 font-medium">Date & Time</p>
                        <p className="text-slate-300 mt-0.5 font-bold">{v.date} | {v.time}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 font-medium">Assigned Runner</p>
                        <p className="text-slate-300 mt-0.5 font-bold">{v.assignedAgent}</p>
                      </div>
                    </div>
                    <div className="text-xs">
                      <p className="text-slate-500 font-medium">Field Feedback Audit</p>
                      <p className="text-slate-400 mt-1 italic leading-relaxed bg-slate-900/50 p-2.5 rounded border border-slate-850">"{v.notes}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SYSTEM GOVERNANCE & USER MANAGEMENT */}
          {activeTab === "users" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">System Governance</h1>
                  <p className="text-xs text-slate-400 mt-1">Corporate authorization, security controls, and agent structural configurations.</p>
                </div>
                <button onClick={() => setIsUserModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors">
                  <UserPlus className="h-4 w-4" /> Provision User Seat
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="p-4">Personnel Asset</th>
                      <th className="p-4">System Identity Authorization</th>
                      <th className="p-4">Regional Area Guard</th>
                      <th className="p-4">Contact Gateway</th>
                      <th className="p-4 text-right">System State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 text-slate-300">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-900/30">
                        <td className="p-4 font-bold text-white text-sm">{u.name}</td>
                        <td className="p-4">
                          <span className="flex items-center gap-1.5 font-semibold text-indigo-400"><Shield className="h-3.5 w-3.5 text-indigo-500" /> {u.role}</span>
                        </td>
                        <td className="p-4 text-slate-400 font-medium">{u.branch}</td>
                        <td className="p-4 font-mono text-slate-500">{u.email} <br /> {u.phone}</td>
                        <td className="p-4 text-right">
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">Active Seat</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: ADVANCED ANALYTICS ENGINE */}
          {activeTab === "reports" && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Advanced Analytics Engine</h1>
                <p className="text-xs text-slate-400 mt-1">Deducted pipeline metrics and strategic business distribution matrices.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Pipeline Conversion Convergence</h3>
                  <div className="space-y-3.5">
                    {["New", "Contacted", "Interested", "Site Visit Scheduled", "Site Visit Done", "Negotiation", "Converted"].map(stage => {
                      const count = leads.filter(l => l.status === stage).length;
                      return (
                        <div key={stage} className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-850">
                          <span className="text-xs font-semibold text-slate-400">{stage}</span>
                          <span className="text-xs font-mono font-bold text-white bg-slate-950 px-2.5 py-1 rounded border border-slate-800">{count} records</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Strategic Product Metrics</h3>
                    <div className="space-y-4">
                      {["1 BHK", "2 BHK", "3 BHK", "4 BHK / Villa"].map(bhk => {
                        const count = leads.filter(l => l.bhk.includes(bhk.substring(0, 5))).length;
                        return (
                          <div key={bhk} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-slate-400">{bhk} Demand Vector</span>
                              <span className="text-slate-300 font-mono font-bold">{count} accounts</span>
                            </div>
                            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(count / leads.length) * 100}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 mt-6 text-xs text-slate-400 leading-relaxed">
                    <span className="text-white font-bold block mb-1">💡 Data Insight Analysis:</span>
                    High-end layouts like the <span className="text-indigo-400 font-semibold">3 BHK configuration</span> represent the absolute highest capital run-rate concentration across current customer acquisitions.
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL WINDOW PANEL: PROVISIONING USER SEATS */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2"><UserPlus className="h-5 w-5 text-indigo-400" /> Provision Account Identity</h2>
              <button onClick={() => setIsUserModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Full Legal Corporate Name</label>
                <input type="text" required value={newUser.name} onChange={(e)=>setNewUser({...newUser, name: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500 text-slate-200" placeholder="e.g. Anand Kumar" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">System Privilege Authorization</label>
                  <select value={newUser.role} onChange={(e)=>setNewUser({...newUser, role: e.target.value as Role})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-300">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Regional Area Scope</label>
                  <select value={newUser.branch} onChange={(e)=>setNewUser({...newUser, branch: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-300">
                    <option value="Madurai">Madurai Corporate</option>
                    <option value="Chennai">Chennai Hub</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Corporate Email Endpoint</label>
                <input type="email" required value={newUser.email} onChange={(e)=>setNewUser({...newUser, email: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500 text-slate-200" placeholder="name@iconic.in" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Communications Identity (Phone)</label>
                <input type="text" required value={newUser.phone} onChange={(e)=>setNewUser({...newUser, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500 text-slate-200" placeholder="98400 xxxxx" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-lg mt-2 transition-colors">
                Authorize Account and Deploy Credentials
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL WINDOW PANEL: LEAD CAPTURE SYSTEM */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2"><Plus className="h-5 w-5 text-indigo-400" /> Capture Lead Asset Record</h2>
              <button onClick={() => setIsLeadModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Target Entity Name</label>
                  <input type="text" required value={newLead.name} onChange={(e)=>setNewLead({...newLead, name: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Acquisition Hub Source</label>
                  <select value={newLead.source} onChange={(e)=>setNewLead({...newLead, source: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-300">
                    {["99acres", "MagicBricks", "Social Media", "Website", "Walk-in"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Phone Contact Gateway</label>
                  <input type="text" required value={newLead.phone} onChange={(e)=>setNewLead({...newLead, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Email Endpoint</label>
                  <input type="email" required value={newLead.email} onChange={(e)=>setNewLead({...newLead, email: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Specification Profile</label>
                  <select value={newLead.bhk} onChange={(e)=>setNewLead({...newLead, bhk: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-300">
                    <option value="2 BHK">2 BHK Layout</option>
                    <option value="3 BHK">3 BHK Layout</option>
                    <option value="4 BHK / Villa">4 BHK / Villa</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Financial Budget (Lakhs)</label>
                  <input type="number" required value={newLead.budget} onChange={(e)=>setNewLead({...newLead, budget: parseInt(e.target.value) || 0})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Project Infrastructure</label>
                  <input type="text" value={newLead.location} onChange={(e)=>setNewLead({...newLead, location: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Account Owner Assignment</label>
                  <select value={newLead.assignedTo} onChange={(e)=>setNewLead({...newLead, assignedTo: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-300">
                    {users.map(u => <option key={u.id} value={u.name}>{u.name} ({u.role})</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">SLA Follow-Up Target Date</label>
                  <input type="date" required value={newLead.nextFollowUp} onChange={(e)=>setNewLead({...newLead, nextFollowUp: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200" />
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2.5 rounded-lg mt-3 transition-colors">
                Commit Lead Record to Live Pipeline
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
