import React, { useState, useMemo } from "react";
import { 
  Users, ShieldAlert, BarChart3, Building2, Briefcase, 
  Layers, PhoneCall, Calendar, Search, Plus, TrendingUp, 
  DollarSign, MapPin, Shield, FileText, Clock, LogOut, Lock, 
  Mail, CheckCircle2, AlertTriangle, Filter, Check, Landmark, X, UserPlus
} from "lucide-react";

// ─── CRM CONFIGURATIONS & ENUMS MAPPED FROM WORKFLOW ─────────────────────────
const ROLES = ["Admin", "Manager", "Executive", "Telecaller"];

const SOURCES = [
  "Website", "Meta Ads", "Google Ads", "Direct Enquiry", "Walk-In", 
  "Reference", "Expo / Event", "Own Leads", "WhatsApp Campaign", 
  "Hoardings", "Property Portals", "Broker Reference", "Social Media", "Cold Calling"
];

const PRIMARY_STATUSES = [
  "New", "Assigned", "Contacted", "Follow-Up", "Site Visit Planned", 
  "Site Visit Completed", "Negotiation", "Booking Pending", "Booking Confirmed", 
  "Registration Pending", "Registered", "Closed", "Cancelled", "Dropped", "Future Follow-Up"
];

const SECONDARY_STATUSES = ["Pending", "No Response", "Switched Off", "Busy", "Not Interested", "Future Prospect"];

const BHK_OPTIONS = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "Villa"];
const PROJECT_TYPES = ["Apartment", "Villa", "Plot"];

// ─── MASTER SYSTEM USERS CREDENTIAL REGISTRY ─────────────────────────────────
const INITIAL_USERS = [
  { id: 101, name: "Arjun Sharma", email: "admin@iconic.in", pass: "admin123", role: "Admin", branch: "All Branches", phone: "98400 00001", active: true },
  { id: 102, name: "Priya Nair", email: "manager@iconic.in", pass: "manager123", role: "Manager", branch: "Madurai Desk", phone: "98400 00002", active: true },
  { id: 103, name: "Rohan Das", email: "executive@iconic.in", pass: "agent123", role: "Executive", branch: "Madurai Desk", phone: "98400 00003", active: true },
  { id: 104, name: "Divya Menon", email: "caller@iconic.in", pass: "caller123", role: "Telecaller", branch: "Madurai Desk", phone: "98400 00004", active: true },
];

// ─── INITIAL PROJECT CORES DATA STRUCTURE ────────────────────────────────────
const INITIAL_PROJECTS = [
  { id: 1, name: "Vishal Virinchi Apartments", location: "Madurai Bypass", type: "Apartment", price: 65, units: 10, sold: 2, status: "Active" },
  { id: 2, name: "ICONIC Lakeview Oasis", location: "Velachery, Chennai", type: "Apartment", price: 85, units: 120, sold: 45, status: "Active" },
  { id: 3, name: "ICONIC Greens Enclave", location: "Saravanampatti, CBE", type: "Villa", price: 140, units: 40, sold: 12, status: "Pre-launch" },
];

// ─── INITIAL SYSTEM LEADS BASE DEPLOYMENT ────────────────────────────────────
const INITIAL_LEADS = [
  { id: 1001, name: "Suresh Kumar", phone: "98400 11234", altPhone: "98400 11235", email: "suresh@gmail.com", location: "Madurai", project: "Vishal Virinchi Apartments", budget: 85, source: "99acres", assignedTo: "Rohan Das", status: "Interested", secondaryStatus: "Pending", notes: "Prefers higher floors.", dateCreated: "2026-05-10", lastFollowUp: "2026-05-25", nextFollowUp: "2026-05-30", history: [{ date: "2026-05-15", by: "Divya Menon", action: "Initial entry ingestion completed." }], bookingUnit: "", bookingAmount: 0, bookingMode: "", bookingDate: "", regPending: false, regCompleted: false },
  { id: 1002, name: "Lakshmi Rao", phone: "99400 22345", altPhone: "", email: "lakshmi@yahoo.com", location: "Chennai", project: "ICONIC Lakeview Oasis", budget: 72, source: "Meta Ads", assignedTo: "Rohan Das", status: "Site Visit Planned", secondaryStatus: "Pending", notes: "Arranging transportation for family site walkthrough.", dateCreated: "2026-05-12", lastFollowUp: "2026-05-28", nextFollowUp: "2026-05-31", history: [{ date: "2026-05-28", by: "Rohan Das", action: "Site visit tour routing planned." }], bookingUnit: "", bookingAmount: 0, bookingMode: "", bookingDate: "", regPending: false, regCompleted: false },
  { id: 1003, name: "Vijay Anand", phone: "97400 33456", altPhone: "", email: "vijay@outlook.com", location: "Coimbatore", project: "ICONIC Greens Enclave", budget: 140, source: "Google Ads", assignedTo: "Unassigned", status: "New", secondaryStatus: "Pending", notes: "Looking for independent premium duplex villa row structure.", dateCreated: "2026-05-29", lastFollowUp: "None", nextFollowUp: "2026-05-29", history: [{ date: "2026-05-29", by: "Auto Capture", action: "Landing page conversion captured." }], bookingUnit: "", bookingAmount: 0, bookingMode: "", bookingDate: "", regPending: false, regCompleted: false },
  { id: 1004, name: "Meena Selvam", phone: "96400 44567", altPhone: "96400 44568", email: "meena@gmail.com", location: "Madurai", project: "Vishal Virinchi Apartments", budget: 65, source: "Walk-In", assignedTo: "Rohan Das", status: "Booking Confirmed", secondaryStatus: "Pending", notes: "Token collected cleanly.", dateCreated: "2026-04-20", lastFollowUp: "2026-05-20", nextFollowUp: "None", history: [{ date: "2026-05-20", by: "Rohan Das", action: "Booking validated." }], bookingUnit: "A-402", bookingAmount: 500000, bookingMode: "Cheque", bookingDate: "2026-05-20", regPending: true, regCompleted: false },
];

export default function App() {
  // ─── AUTHENTICATION STATE ENGINES ──────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // ─── WORKSPACE SHELL NAVIGATION & FILTER CONTROLS ──────────────────────────
  const [activeTab, setActiveTab] = useState("dashboard");
  const [globalSearch, setGlobalSearch] = useState("");
  
  // Advanced Filter Parameter Matrix Configurations
  const [filterSource, setFilterSource] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterProject, setFilterProject] = useState("All");
  const [filterExecutive, setFilterExecutive] = useState("All");

  // ─── MASTER RECORD STATE SYSTEMS ───────────────────────────────────────────
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);

  // ─── DIALOG INTERACTION OVERLAYS CONTEXTS ──────────────────────────────────
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // ─── DATA FIELDS FOR CREATION MANAGEMENT STRUCTURES ────────────────────────
  const [newLead, setNewLead] = useState({ name: "", phone: "", altPhone: "", email: "", location: "", project: "Vishal Virinchi Apartments", budget: 65, source: "Website", assignedTo: "Unassigned", notes: "" });
  const [newUser, setNewUser] = useState({ name: "", email: "", pass: "iconic123", role: "Executive", branch: "Madurai Desk", phone: "" });
  const [newProject, setNewProject] = useState({ name: "", location: "", type: "Apartment", price: 50, units: 10 });

  // ─── CONTEXT INPUT TEMPORARIES FOR DIALOG VERIFICATIONS ──────────────────
  const [followUpDate, setFollowUpDate] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [followUpNotes, setFollowUpNotes] = useState("");
  const [followUpType, setFollowUpType] = useState("Call");

  const [svDate, setSvDate] = useState("");
  const [svProject, setSvProject] = useState("");
  const [svFamily, setSvFamily] = useState("");
  const [svFeedback, setSvFeedback] = useState("");
  const [svProbability, setSvProbability] = useState("High");

  const [bkUnit, setBkUnit] = useState("");
  const [bkAmount, setBkAmount] = useState("");
  const [bkMode, setBkMode] = useState("Cheque");
  const [bkDate, setBkDate] = useState("");

  // ─── SECURITY VERIFICATION CREDENTIAL SUBSCRIPTION INTERCEPTOR ─────────────
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const account = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase().trim() && u.pass === loginPassword && u.active);
    if (account) {
      setCurrentUser(account);
      setLoginError("");
    } else {
      setLoginError("Invalid email clearance configurations or secure passcode parameter mismatch.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginEmail("");
    setLoginPassword("");
    setGlobalSearch("");
    setActiveTab("dashboard");
  };

  // ─── DYNAMIC SEARCH & PRIVILEGE GATING (RBAC LAYER COMPLIANCE) ──────────────
  const processedLeads = useMemo(() => {
    if (!currentUser) return [];

    // Step A: Role-Based Authorization Filter
    let result = leads;
    if (currentUser.role === "Executive") {
      result = leads.filter(l => l.assignedTo === currentUser.name);
    } else if (currentUser.role === "Telecaller") {
      result = leads.filter(l => l.assignedTo === currentUser.name || l.status === "New");
    }

    // Step B: Global Search Field Matching Filter
    if (globalSearch.trim()) {
      const term = globalSearch.toLowerCase();
      result = result.filter(l => 
        l.name.toLowerCase().includes(term) ||
        l.phone.includes(term) ||
        l.project.toLowerCase().includes(term) ||
        l.status.toLowerCase().includes(term)
      );
    }

    // Step C: Detailed Reports Tab Parameter Drops Matrix Filters
    if (filterSource !== "All") result = result.filter(l => l.source === filterSource);
    if (filterStatus !== "All") result = result.filter(l => l.status === filterStatus);
    if (filterProject !== "All") result = result.filter(l => l.project === filterProject);
    if (filterExecutive !== "All") result = result.filter(l => l.assignedTo === filterExecutive);

    return result;
  }, [leads, currentUser, globalSearch, filterSource, filterStatus, filterProject, filterExecutive]);

  // ─── MUTATION OPERATIONS LOGIC ACTIONS ─────────────────────────────────────
  const handleCreateLeadSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...newLead,
      id: Date.now(),
      secondaryStatus: "Pending",
      dateCreated: new Date().toISOString().split("T")[0],
      lastFollowUp: "None",
      nextFollowUp: new Date().toISOString().split("T")[0],
      bookingUnit: "", bookingAmount: 0, bookingMode: "", bookingDate: "",
      regPending: false, regCompleted: false,
      history: [{ date: new Date().toISOString().split("T")[0], by: currentUser.name, action: "Lead logged via standard multi-channel workflow entry map." }]
    };
    setLeads([payload, ...leads]);
    setIsLeadModalOpen(false);
    setNewLead({ name: "", phone: "", altPhone: "", email: "", location: "", project: "Vishal Virinchi Apartments", budget: 65, source: "Website", assignedTo: "Unassigned", notes: "" });
  };

  const handleCreateUserSubmit = (e) => {
    e.preventDefault();
    setUsers([...users, { ...newUser, id: Date.now(), avatar: newUser.name.charAt(0).toUpperCase(), active: true }]);
    setIsUserModalOpen(false);
    setNewUser({ name: "", email: "", pass: "iconic123", role: "Executive", branch: "Madurai Desk", phone: "" });
  };

  const handleCreateProjectSubmit = (e) => {
    e.preventDefault();
    setProjects([...projects, { ...newProject, id: Date.now(), sold: 0, status: "Active" }]);
    setIsProjectModalOpen(false);
    setNewProject({ name: "", location: "", type: "Apartment", price: 50, units: 10 });
  };

  const assignLeadOwner = (leadId, ownerName) => {
    setLeads(leads.map(l => l.id === leadId ? {
      ...l, assignedTo: ownerName, status: ownerName === "Unassigned" ? "New" : "Assigned",
      history: [...l.history, { date: new Date().toISOString().split("T")[0], by: currentUser.name, action: `Asset owner assignment routed to: ${ownerName}` }]
    } : l));
  };

  // ─── CLIENT FOLLOW-UP LIFECYCLE MANAGEMENT IMPLEMENTATIONS ─────────────────
  const commitStandardFollowUpLog = () => {
    if (!followUpDate || !nextFollowUpDate || !followUpNotes.trim()) {
      alert("All core sequence metrics are required.");
      return;
    }
    setLeads(leads.map(l => l.id === selectedLead.id ? {
      ...l, status: "Follow-Up", lastFollowUp: followUpDate, nextFollowUp: nextFollowUpDate,
      history: [...l.history, { date: followUpDate, by: currentUser.name, action: `[${followUpType}] - Next: ${nextFollowUpDate}. Notes: ${followUpNotes}` }]
    } : l));
    setSelectedLead(null); setFollowUpNotes("");
  };

  const commitSiteWalkthroughLog = () => {
    if (!svDate || !svProject || !svFeedback.trim()) {
      alert("Validation files are missing.");
      return;
    }
    setLeads(leads.map(l => l.id === selectedLead.id ? {
      ...l, status: "Site Visit Completed", lastFollowUp: svDate,
      history: [...l.history, { date: svDate, by: currentUser.name, action: `Site Walkthrough Verified at ${svProject}. Attended: ${svFamily}. Feedback: ${svFeedback} (${svProbability} probability)` }]
    } : l));
    setSelectedLead(null); setSvFeedback("");
  };

  const commitFinancialBookingLog = () => {
    if (!bkUnit || !bkAmount || !bkDate) {
      alert("All transaction tracking parameters are mandatory.");
      return;
    }
    setLeads(leads.map(l => l.id === selectedLead.id ? {
      ...l, status: "Booking Confirmed", bookingUnit: bkUnit, bookingAmount: parseFloat(bkAmount), bookingMode: bkMode, bookingDate: bkDate, regPending: true,
      history: [...l.history, { date: bkDate, by: currentUser.name, action: `Booking Confirmed for Unit ${bkUnit}. Token value ₹${bkAmount} processed via ${bkMode}.` }]
    } : l));
    
    // Increment sold counter on project master
    setProjects(projects.map(p => p.name === selectedLead.project ? { ...p, sold: p.sold + 1 } : p));
    setSelectedLead(null); setBkUnit(""); setBkAmount("");
  };

  const routeToRegistrationClosure = (leadId, complete) => {
    setLeads(leads.map(l => l.id === leadId ? {
      ...l, status: complete ? "Closed" : "Registration Pending", regPending: !complete, regCompleted: complete,
      history: [...l.history, { date: new Date().toISOString().split("T")[0], by: currentUser.name, action: complete ? "Sale complete. Final legal closure archiving executed." : "Documentation sent to registration scheduler." }]
    } : l));
    if (selectedLead?.id === leadId) setSelectedLead(null);
  };

  // ─── INTERFACE ENVIRONMENT CONDITIONAL PRE-CHECK ───────────────────────────
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased text-slate-200">
        <div className="sm:mx-auto w-full max-w-md text-center space-y-2">
          <Building2 className="h-12 w-12 text-indigo-500 mx-auto" />
          <h2 className="text-3xl font-black text-white tracking-tight">ICONIC PROJECTS</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Enterprise Workflow Solution</p>
        </div>

        <div className="mt-8 sm:mx-auto w-full max-w-md px-4">
          <div className="bg-slate-950 py-8 px-6 border border-slate-800 rounded-2xl shadow-2xl space-y-6">
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold uppercase tracking-wide">Corporate Authentication Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500" placeholder="e.g. admin@iconic.in" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold uppercase tracking-wide">Security Passcode Passkey</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500" placeholder="••••••••" />
                </div>
              </div>

              {loginError && <p className="text-rose-400 font-bold font-mono bg-rose-500/10 p-2.5 rounded border border-rose-500/20">⚠️ {loginError}</p>}
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2.5 rounded-xl uppercase tracking-wider shadow-lg transition-colors">Authorize Workspace Clearance</button>
            </form>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 space-y-2 text-[11px] text-slate-400">
              <p className="font-bold text-slate-300 uppercase tracking-wide border-b border-slate-800 pb-1">Testing Credentials Registry Grid:</p>
              <p>• Admin: <span className="text-indigo-400 font-mono">admin@iconic.in</span> / admin123</p>
              <p>• Manager: <span className="text-indigo-400 font-mono">manager@iconic.in</span> / manager123</p>
              <p>• Executive Agent: <span className="text-indigo-400 font-mono">executive@iconic.in</span> / agent123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans antialiased overflow-hidden">
      
      {/* ─── WORKSPACE MASTER SIDEBAR ────────────────────────────────────────── */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
            <Building2 className="h-6 w-6 text-indigo-500" />
            <span className="font-black text-sm tracking-widest text-white">ICONIC CRM</span>
          </div>
          <nav className="p-4 space-y-1">
            <button onClick={() => { setActiveTab("dashboard"); setGlobalSearch(""); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${activeTab === "dashboard" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              <Layers className="h-4 w-4" /> VISUAL DASHBOARD
            </button>
            <button onClick={() => { setActiveTab("leads"); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${activeTab === "leads" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              <PhoneCall className="h-4 w-4" /> LEAD CHANNELS
            </button>
            <button onClick={() => { setActiveTab("projects"); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${activeTab === "projects" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              <Building2 className="h-4 w-4" /> PROJECT MASTER
            </button>
            {["Admin", "Manager"].includes(currentUser.role) && (
              <button onClick={() => { setActiveTab("users"); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${activeTab === "users" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
                <Users className="h-4 w-4" /> USER SEATS
              </button>
            )}
            <button onClick={() => { setActiveTab("reports"); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${activeTab === "reports" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              <BarChart3 className="h-4 w-4" /> MATRIX REPORTS
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-850">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="h-8 w-8 rounded-xl bg-indigo-600 font-black text-xs flex items-center justify-center text-white flex-shrink-0">{currentUser.avatar}</div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-200 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-indigo-400 font-black tracking-wider uppercase truncate">{currentUser.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-rose-400 transition-colors ml-1" title="Revoke access token">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ─── PRIMARY WORKSPACE MAIN STACK CONTAINER ──────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* CROSS-COLUMN RE-FILTER SEARCH CONSOLE HEADER */}
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-8 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input type="text" value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} placeholder="Cross-column ledger search by name, phone or project..." className="w-full bg-slate-900 border border-slate-850 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-all font-medium" />
            {globalSearch && <button onClick={() => setGlobalSearch("")} className="absolute right-3 top-2 text-slate-500 hover:text-slate-200 font-bold text-xs">✕</button>}
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-850">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Node Secure Clearance: <span className="font-bold text-indigo-400 font-mono">{currentUser.role.toUpperCase()}</span>
          </div>
        </header>

        {/* COMPONENT TAB CONSOLE VIEWER */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-900">
          
          {/* ─── CONSOLE TAB 1: ROLE VISUAL DASHBOARD REPRESENTATIONS ─────────── */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fadeIn">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">{currentUser.role} Management Dashboard</h1>
                <p className="text-xs text-slate-400 mt-0.5">Real-time graphic data summary tracking pipeline lifecycle conversion distributions.</p>
              </div>

              {/* CORE METRICS SCORE TILES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Aggregate Leads Ingested<Briefcase className="h-4 w-4 text-indigo-500" /></p>
                  <p className="text-3xl font-black text-white mt-1">{processedLeads.length}</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Sale Closures Confirmed<CheckCircle2 className="h-4 w-4 text-emerald-500" /></p>
                  <p className="text-3xl font-black text-emerald-400 mt-1">{processedLeads.filter(l => l.status === "Booking Confirmed" || l.status === "Closed").length}</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Revenue Run-Rate Value<DollarSign className="h-4 w-4 text-indigo-400" /></p>
                  <p className="text-3xl font-black text-white mt-1">₹{processedLeads.filter(l => l.status === "Booking Confirmed" || l.status === "Closed").reduce((a,c)=>a+c.budget, 0)}L</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Walkthrough Actions Pending<Clock className="h-4 w-4 text-amber-500" /></p>
                  <p className="text-3xl font-black text-amber-400 mt-1">{processedLeads.filter(l => l.status === "Site Visit Planned").length}</p>
                </div>
              </div>

              {/* PURE RENDERING HIGH GRAPH BAR CHART REPRESENTATIONS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* PIPELINE STAGE GRAPH REPRESENTATION */}
                <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-indigo-500" /> Pipeline Funnel Distribution Weight (Visual representation chart)
                  </h3>
                  <div className="space-y-4">
                    {["New", "Contacted", "Follow-Up", "Site Visit Planned", "Site Visit Completed", "Negotiation", "Booking Confirmed"].map(stage => {
                      const shareCount = leads.filter(l => l.status === stage).length;
                      const ratioPct = Math.min((shareCount / Math.max(leads.length, 1)) * 100, 100);
                      return (
                        <div key={stage} className="flex items-center gap-4 text-xs font-medium">
                          <div className="w-36 text-slate-400 font-semibold truncate">{stage}</div>
                          <div className="flex-1 bg-slate-900 h-7 rounded-lg border border-slate-850 relative flex items-center overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 h-full transition-all duration-500" style={{ width: `${ratioPct || 3}%` }}></div>
                            <span className="absolute left-3 text-[10px] font-black font-mono text-slate-200">{shareCount} accounts ({Math.round(ratioPct)}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* VISUAL SOURCE WEIGHT INSIGHT BAR CHART */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-sky-400" /> Channel Ingestion Shares
                    </h3>
                    <div className="space-y-4">
                      {["Website", "Meta Ads", "Google Ads", "Walk-In"].map(src => {
                        const count = leads.filter(l => l.source === src).length;
                        const pct = (count / Math.max(leads.length, 1)) * 100;
                        return (
                          <div key={src} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-slate-400 font-semibold">{src}</span>
                              <span className="text-slate-300 font-mono font-bold">{count} entries</span>
                            </div>
                            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-850">
                              <div className="bg-sky-400 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="bg-slate-900 p-3.5 border border-slate-850 rounded-xl text-[11px] text-slate-400 leading-relaxed mt-4 font-medium">
                    <span className="font-bold text-white block mb-0.5">💡 System Automation Directive:</span>
                    Closing incentive structures are pinned cleanly at <span className="text-indigo-400 font-bold">0.5% allocation parameters</span> across unit confirmations.
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ─── CONSOLE TAB 2: GRANULAR LEAD CHANNELS SYSTEMS ────────────────── */}
          {activeTab === "leads" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Lead Ecosystem Repository</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Filter, track, and route leads through verification validation sequences.</p>
                </div>
                <button onClick={() => setIsLeadModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-4 py-2 rounded-xl text-xs transition-colors">
                  <Plus className="h-4 w-4" /> INGEST WORKFLOW RECORD
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold tracking-wider uppercase">
                        <th className="p-4">Customer Base Profiling</th>
                        <th className="p-4">Project Context Variant</th>
                        <th className="p-4">Channel Origin</th>
                        <th className="p-4">Owner Allocation</th>
                        <th className="p-4">Workflow Pipeline Status</th>
                        <th className="p-4 text-right">Target Capital</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {processedLeads.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-slate-500 font-semibold italic">No active workflow records found matching requirements.</td>
                        </tr>
                      ) : (
                        processedLeads.map(l => (
                          <tr key={l.id} className="hover:bg-slate-900/30 transition-all">
                            <td className="p-4">
                              <p className="font-bold text-white text-sm cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => setSelectedLead(l)}>{l.name}</p>
                              <p className="text-[11px] text-slate-500 font-mono mt-0.5">{l.phone} • {l.location}</p>
                            </td>
                            <td className="p-4">
                              <p className="font-semibold text-slate-200">{l.project}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5 font-mono">Created: {l.dateCreated}</p>
                            </td>
                            <td className="p-4">
                              <span className="bg-slate-900 border border-slate-850 text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold font-mono">{l.source}</span>
                            </td>
                            <td className="p-4">
                              {["Admin", "Manager"].includes(currentUser.role) ? (
                                <select value={l.assignedTo} onChange={(e) => assignLeadOwner(l.id, e.target.value)} className="bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1 text-xs focus:outline-none">
                                  <option value="Unassigned">Unassigned</option>
                                  {users.filter(u => u.role === "Executive").map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                                </select>
                              ) : (
                                <span className="font-semibold text-slate-400">{l.assignedTo}</span>
                              )}
                            </td>
                            <td className="p-4">
                              <select value={l.status} onChange={(e) => executeStatusTransition(l.id, e.target.value)} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 font-bold text-xs text-slate-300 focus:outline-none cursor-pointer" style={{ color: SC[l.status]?.text }}>
                                {PRIMARY_STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
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

          {/* ─── CONSOLE TAB 3: PROJECT PORTFOLIO MATRIX MASTER ──────────────── */}
          {activeTab === "projects" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Project Master Master-Registry</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Asset structural parameters tracking allocated inventory pools.</p>
                </div>
                {currentUser.role === "Admin" && (
                  <button onClick={() => setIsProjectModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-4 py-2 rounded-xl text-xs transition-colors">
                    <Plus className="h-4 w-4" /> PROVISION ASSET SCHEME
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(p => (
                  <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-black text-white">{p.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3 text-slate-600" /> {p.location}</p>
                      </div>
                      <span className="text-[10px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded uppercase tracking-wider">{p.status}</span>
                    </div>
                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-850 grid grid-cols-2 gap-2 text-xs font-semibold text-slate-300">
                      <div><p className="text-slate-500 text-[10px] font-bold uppercase">Base Valuation</p><p className="text-white font-mono font-black mt-0.5">₹{p.price}L Avg</p></div>
                      <div><p className="text-slate-500 text-[10px] font-bold uppercase">Inventory Sold</p><p className="text-emerald-400 font-bold mt-0.5">{p.sold} / {p.units} Units</p></div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-400"><span>Allocation Capacity Taken</span><span>{Math.round((p.sold / p.units) * 100)}%</span></div>
                      <div className="bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-850">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(p.sold / p.units) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── CONSOLE TAB 4: SECURE USERS GOVERNANCE HUBS ─────────────────── */}
          {activeTab === "users" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">System Identity Governance</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Provision user permission nodes and security clearing codes.</p>
                </div>
                {currentUser.role === "Admin" && (
                  <button onClick={() => setIsUserModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-4 py-2 rounded-xl text-xs transition-colors">
                    <UserPlus className="h-4 w-4" /> PROVISION NODE SEAT
                  </button>
                )}
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="p-4">Personnel Asset Name</th>
                      <th className="p-4">Clearance Role</th>
                      <th className="p-4">Operational Domain Scope</th>
                      <th className="p-4">Gateway Passcode Passkey</th>
                      <th className="p-4 text-right">System State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-300">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-900/30 transition-all">
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-lg bg-slate-800 text-white flex items-center justify-center font-black text-xs">{u.avatar}</div>
                            <div>
                              <p className="font-bold text-white text-sm">{u.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{u.email} • {u.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-black text-indigo-400 flex items-center gap-1.5 py-6 uppercase tracking-wider"><Shield className="h-3.5 w-3.5 text-indigo-500" /> {u.role}</td>
                        <td className="p-4 text-slate-400 font-bold">{u.branch}</td>
                        <td className="p-4 font-mono font-bold text-amber-400 bg-amber-500/5 px-2.5 py-1 rounded border border-amber-500/10 w-fit">{u.pass}</td>
                        <td className="p-4 text-right">
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Authorized Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── CONSOLE TAB 5: FILTERABLE PERFORMANCE MATRIX REPORTS ────────── */}
          {activeTab === "reports" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Analytics Matrix Filtering Engine</h1>
                <p className="text-xs text-slate-400 mt-0.5">Isolate source records, conversions, and target indicators dynamically.</p>
              </div>

              {/* FILTER OVERLAY MATRIX SELECTION TOOL BAR */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-4 gap-3.5 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Source Channel Hub</label>
                  <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none">
                    <option value="All">All Sources</option>
                    {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Pipeline Milestone</label>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none">
                    <option value="All">All Statuses</option>
                    {PRIMARY_STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Asset Scheme Project</label>
                  <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none">
                    <option value="All">All Projects</option>
                    {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Executive Owner</label>
                  <select value={filterExecutive} onChange={(e) => setFilterExecutive(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none">
                    <option value="All">All Executives</option>
                    {users.filter(u => u.role === "Executive").map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                  </select>
                </div>
              </div>

              {/* REPORT ANALYSIS MATRIX FEED DATA ROWS */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                <div className="flex justify-between items-center border-b border-slate-850 pb-3 mb-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Isolated Dataset Output Rows ({processedLeads.length} Matches)</h3>
                  <button onClick={() => { setFilterSource("All"); setFilterStatus("All"); setFilterProject("All"); setFilterExecutive("All"); }} className="text-indigo-400 hover:text-white text-xs font-bold font-mono">Reset Parameters</button>
                </div>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-500 font-bold uppercase border-b border-slate-900">
                        <th className="pb-2">Client Target</th>
                        <th className="pb-2">Project</th>
                        <th className="pb-2">Source</th>
                        <th className="pb-2">Owner Assignment</th>
                        <th className="pb-2">Pipeline Phase</th>
                        <th className="pb-2 text-right">Budget Metric</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {processedLeads.map(l => (
                        <tr key={l.id} className="hover:bg-slate-900/20">
                          <td className="py-2.5 font-bold text-white">{l.name}</td>
                          <td className="py-2.5 font-medium">{l.project}</td>
                          <td className="py-2.5 font-mono text-slate-400">{l.source}</td>
                          <td className="py-2.5 text-slate-400 font-semibold">{l.assignedTo}</td>
                          <td className="py-2.5 font-bold" style={{ color: SC[l.status]?.text }}>{l.status}</td>
                          <td className="py-2.5 text-right font-mono font-bold text-emerald-400">₹{l.budget}L</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ─── DIALOG WINDOW OVERLAY A: ACTION WORKFLOW SEQUENCE LIFECYCLE DRAWER ── */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end animate-fadeIn" onClick={() => setSelectedLead(null)}>
          <div className="bg-slate-950 w-[550px] border-l border-slate-800 h-full flex flex-col justify-between overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div>
              <div className="p-6 border-b border-slate-900 flex justify-between items-start">
                <div>
                  <span className="text-[9px] bg-indigo-600 font-mono font-black text-white px-2 py-0.5 rounded uppercase tracking-wider">Asset Context #{selectedLead.id}</span>
                  <h2 className="text-xl font-black text-white mt-1.5">{selectedLead.name}</h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedLead.phone} • {selectedLead.email}</p>
                </div>
                <button onClick={() => setSelectedLead(null)} className="text-slate-500 hover:text-white font-bold text-sm">✕</button>
              </div>

              {/* SYSTEM SEQUENTIAL INTERACTION ACTIONS DRAWER TABS */}
              <div className="p-6 space-y-6 text-xs">
                
                {/* FLOW SUB-PANEL STEP 1: LOG STANDARD CONTINUOUS TASK FOLLOW-UPS */}
                <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-3">
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5"><Clock className="h-4 w-4 text-indigo-400" /> Stage Flow Segment A: Continuous Sequence Follow-Up Tracking</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-slate-500 font-bold text-[10px]">Sequence Date</label><input type="date" value={followUpDate} onChange={(e)=>setFollowUpDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 mt-0.5 focus:outline-none" /></div>
                    <div><label className="text-slate-500 font-bold text-[10px]">SLA Next Target Date</label><input type="date" value={nextFollowUpDate} onChange={(e)=>setNextFollowUpDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 mt-0.5 focus:outline-none" /></div>
                  </div>
                  <div>
                    <label className="text-slate-500 font-bold text-[10px]">Communication Interface Variant Channel</label>
                    <select value={followUpType} onChange={(e)=>setFollowUpType(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 mt-0.5 text-slate-300 focus:outline-none">
                      <option value="Call">Phone Call</option><option value="WhatsApp">WhatsApp Outpost</option><option value="SMS">SMS Gateway</option><option value="Email">Email Engine</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-500 font-bold text-[10px]">Granular Interaction Discussion Notes</label>
                    <textarea rows={2} value={followUpNotes} onChange={(e)=>setFollowUpNotes(e.target.value)} placeholder="Enter requirement parameters details..." className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-300 mt-0.5 focus:outline-none" />
                  </div>
                  <button type="button" onClick={commitStandardFollowUpLog} className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold py-2 rounded-lg text-white transition-colors">Commit Activity Sequence Follow-Up</button>
                </div>

                {/* FLOW SUB-PANEL STEP 2: PHYSICAL WALKTHROUGH INSPECTION LOGGINGS */}
                <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-3">
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5"><Calendar className="h-4 w-4 text-amber-500" /> Stage Flow Segment B: Physical Layout Site Tour Walkthrough</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-slate-500 font-bold text-[10px]">Tour Tour Date</label><input type="date" value={svDate} onChange={(e)=>setSvDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 mt-0.5 focus:outline-none" /></div>
                    <div><label className="text-slate-500 font-bold text-[10px]">Verified Real Estate Scheme Asset</label><input type="text" value={svProject = selectedLead.project} disabled className="w-full bg-slate-950/40 border border-slate-800 rounded p-1.5 mt-0.5 text-slate-500 font-semibold" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-slate-500 font-bold text-[10px]">Family Attended Co-Buyers</label><input type="text" value={svFamily} onChange={(e)=>setSvFamily(e.target.value)} placeholder="e.g. Spouse & Father" className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 mt-0.5 focus:outline-none" /></div>
                    <div>
                      <label className="text-slate-500 font-bold text-[10px]">Closing Probability Index</label>
                      <select value={svProbability} onChange={(e)=>setSvProbability(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 mt-0.5 text-slate-300 focus:outline-none">
                        <option value="High">High (Hot Lead)</option><option value="Medium">Medium (Warm Lead)</option><option value="Low">Low (Cold Lead)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-500 font-bold text-[10px]">Customer Evaluation Response Feedback Logs *</label>
                    <textarea rows={2} value={svFeedback} onChange={(e)=>setSvFeedback(e.target.value)} placeholder="Mandatory feedback details for compliance validation gate checks..." className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-300 mt-0.5 focus:outline-none" />
                  </div>
                  <button type="button" onClick={commitSiteWalkthroughLog} className="w-full bg-amber-600 hover:bg-amber-700 font-bold py-2 rounded-lg text-white transition-colors">Verify Walkthrough Validation Complete</button>
                </div>

                {/* FLOW SUB-PANEL STEP 3: UNIT SELECTION CASH BOOKING LOGGINGS */}
                <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-3">
                  <p className="text-[11px] font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5"><Landmark className="h-4 w-4 text-emerald-400" /> Stage Flow Segment C: Financial Booking Unit Core Form Ingestion</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className="text-slate-500 font-bold text-[10px]">Unit Number Code *</label><input type="text" value={bkUnit} onChange={(e)=>setBkUnit(e.target.value)} placeholder="e.g. Block A, Flat 402" className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 mt-0.5 focus:outline-none" /></div>
                    <div><label className="text-slate-500 font-bold text-[10px]">Booking Token Collection Value (₹) *</label><input type="number" value={bkAmount} onChange={(e)=>setBkAmount(e.target.value)} placeholder="Amount in INR" className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 mt-0.5 focus:outline-none text-emerald-400 font-bold" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-500 font-bold text-[10px]">Transaction Execution Mode</label>
                      <select value={bkMode} onChange={(e)=>setBkMode(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 mt-0.5 text-slate-300 focus:outline-none">
                        <option value="Cheque">Bank Cheque</option><option value="NEFT/RTGS">NEFT / RTGS Wire</option><option value="Card/POS">POS Terminal Card</option>
                      </select>
                    </div>
                    <div><label className="text-slate-500 font-bold text-[10px]">Booking Validation Settlement Date</label><input type="date" value={bkDate} onChange={(e)=>setBkDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 mt-0.5 focus:outline-none" /></div>
                  </div>
                  <button type="button" onClick={commitFinancialBookingLog} className="w-full bg-emerald-600 hover:bg-emerald-700 font-black py-2 rounded-lg text-white tracking-wide uppercase transition-colors text-[11px]">Commit Ingestion Token and Secure Unit Allocation</button>
                </div>

                {/* FLOW SUB-PANEL STEP 4: LEGAL REGISTRATION FINAL CLOSURE ARCHIVES */}
                {selectedLead.regPending && (
                  <div className="bg-slate-900 border border-dashed border-indigo-500/30 p-4 rounded-xl space-y-3.5">
                    <p className="text-[11px] font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5"><ShieldAlert className="h-4 w-4" /> Stage Flow Segment D: Legal Agreement Registration & Terminal Closure</p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">Advance unit token verified inside system database entries. Choose terminal scheduling action path below:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => routeToRegistrationClosure(selectedLead.id, false)} className="bg-slate-950 border border-slate-800 text-slate-300 font-bold p-2 rounded-lg hover:border-slate-700">Flag Registration Pending</button>
                      <button type="button" onClick={() => routeToRegistrationClosure(selectedLead.id, true)} className="bg-indigo-600 text-white font-black p-2 rounded-lg hover:bg-indigo-700 uppercase tracking-wide">Complete Full Closure Sale</button>
                    </div>
                  </div>
                )}

                {/* STRUCTURAL TIMELINE AUDIT HISTORY ENTRIES VIEWS */}
                <div className="space-y-3 pt-2">
                  <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">System Operation Activity Ingestion Audit Trail</p>
                  <div className="border-l border-slate-800 pl-4 ml-1 space-y-3">
                    {selectedLead.history.map((h, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-indigo-500"></div>
                        <p className="text-[10px] text-slate-500 font-bold font-mono">{h.date} — Executed by {h.by}</p>
                        <p className="text-xs text-slate-300 font-medium mt-0.5">{h.action}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── DIALOG WINDOW OVERLAY B: FORM INGESTION CAPTURE NEW LEADS ──────── */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h2 className="text-base font-black text-white tracking-wide">Capture Target Operational Customer Profile</h2>
              <button onClick={() => setIsLeadModalOpen(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateLeadSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Customer Legal Name *</label>
                  <input type="text" required value={newLead.name} onChange={(e)=>setNewLead({...newLead, name: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Attribution Lead Source Hub</label>
                  <select value={newLead.source} onChange={(e)=>setNewLead({...newLead, source: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-300 focus:outline-none">
                    {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Primary Mobile Number *</label>
                  <input type="text" required value={newLead.phone} onChange={(e)=>setNewLead({...newLead, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Alternate Contact Number</label>
                  <input type="text" value={newLead.altPhone} onChange={(e)=>setNewLead({...newLead, altPhone: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Location Domain</label>
                  <input type="text" value={newLead.location} onChange={(e)=>setNewLead({...newLead, location: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Financial Intent (Lakhs)</label>
                  <input type="number" value={newLead.budget} onChange={(e)=>setNewLead({...newLead, budget: parseInt(e.target.value)||0})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Target Scheme Project</label>
                  <select value={newLead.project} onChange={(e)=>setNewLead({...newLead, project: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-300 focus:outline-none">
                    {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Initial Requirement Remarks Summary</label>
                <textarea rows={2} value={newLead.notes} onChange={(e)=>setNewLead({...newLead, notes: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 focus:outline-none" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl uppercase tracking-wider shadow-lg transition-all">Commit Lead File Block to Active Pipeline Registry</button>
            </form>
          </div>
        </div>
      )}

      {/* ─── DIALOG WINDOW OVERLAY C: PROVISION SYSTEM ACCOUNT SEAT NODES ───── */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h2 className="text-base font-black text-white tracking-wide">Provision Permission Seat Identity</h2>
              <button onClick={() => setIsUserModalOpen(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateUserSubmit} className="space-y-3 text-xs">
              <div><label className="text-slate-400 font-semibold">Personnel Full Name *</label><input type="text" required value={newUser.name} onChange={(e)=>setNewUser({...newUser, name: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 mt-0.5 focus:outline-none" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-semibold">Privilege Tier Node</label>
                  <select value={newUser.role} onChange={(e)=>setNewUser({...newUser, role: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-300 mt-0.5 focus:outline-none">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-semibold">Area Office Domain</label>
                  <select value={newUser.branch} onChange={(e)=>setNewUser({...newUser, branch: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-300 mt-0.5 focus:outline-none">
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="text-slate-400 font-semibold">Corporate Email *</label><input type="email" required value={newUser.email} onChange={(e)=>setNewUser({...newUser, email: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 mt-0.5 focus:outline-none" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-slate-400 font-semibold">Mobile Phone</label><input type="text" required value={newUser.phone} onChange={(e)=>setNewUser({...newUser, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 mt-0.5 focus:outline-none" /></div>
                <div><label className="text-slate-400 font-semibold">Passcode Access Key *</label><input type="text" required value={newUser.pass} onChange={(e)=>setNewUser({...newUser, pass: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-amber-400 font-mono font-bold mt-0.5 focus:outline-none" /></div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl uppercase tracking-wider text-[11px] mt-2 transition-colors">Deploy Infrastructure Clearance Pass</button>
            </form>
          </div>
        </div>
      )}

      {/* ─── DIALOG WINDOW OVERLAY D: PROVISION REAL ESTATE ASSET PROJECTS ──── */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h2 className="text-base font-black text-white tracking-wide">Provision Real Estate Scheme Project</h2>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateProjectSubmit} className="space-y-3 text-xs">
              <div><label className="text-slate-400 font-semibold">Project Core Name *</label><input type="text" required value={newProject.name} onChange={(e)=>setNewProject({...newProject, name: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 mt-0.5 focus:outline-none" /></div>
              <div><label className="text-slate-400 font-semibold">Location Zone Address</label><input type="text" required value={newProject.location} onChange={(e)=>setNewProject({...newProject, location: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 mt-0.5 focus:outline-none" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-semibold">Structural Build Type</label>
                  <select value={newProject.type} onChange={(e)=>setNewProject({...newProject, type: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-300 mt-0.5 focus:outline-none">
                    {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div><label className="text-slate-400 font-semibold">Avg Price Unit (Lakhs)</label><input type="number" required value={newProject.price} onChange={(e)=>setNewProject({...newProject, price: parseInt(e.target.value)||0})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 mt-0.5 focus:outline-none" /></div>
              </div>
              <div><label className="text-slate-400 font-semibold">Total Capacity Unit Allocation</label><input type="number" required value={newProject.units} onChange={(e)=>setNewProject({...newProject, units: parseInt(e.target.value)||0})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 mt-0.5 focus:outline-none" /></div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl uppercase tracking-wider text-[11px] mt-2 transition-colors">Commit Project Base Scheme</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
