import React, { useState, useMemo } from "react";
import { 
  Users, ShieldAlert, BarChart3, Building2, Briefcase, 
  Layers, PhoneCall, Calendar, Search, Plus, TrendingUp, 
  DollarSign, MapPin, Shield, FileText, Clock, LogOut, Lock, 
  Mail, CheckCircle2, UserPlus, Trash2, Edit2, X, Bell, AlertTriangle
} from "lucide-react";

// ─── SYSTEM CONFIGURATIONS & ENUMS ──────────────────────────────────────────
const INITIAL_ROLES = ["Admin", "Manager", "Executive", "Telecaller"];

const INITIAL_SOURCES = [
  "Website", "Meta Ads", "Google Ads", "Direct Enquiry", "Walk-In", 
  "Reference", "Expo / Event", "Own Leads", "WhatsApp Campaign", "Property Portals"
];

const INITIAL_STATUSES = [
  "New", "Assigned", "Contacted", "Follow-Up", "Site Visit Planned", 
  "Site Visit Completed", "Negotiation", "Booking Pending", "Booking Confirmed", "Closed"
];

const BRANCHES = ["Madurai Desk", "Chennai South", "Chennai North", "Coimbatore"];
const PROJECT_TYPES = ["Apartment", "Villa", "Plot"];

const INITIAL_USERS = [
  { id: 101, name: "Arjun Sharma", email: "admin@iconic.in", pass: "admin123", role: "Admin", branch: "All Branches", phone: "98400 00001", active: true },
  { id: 102, name: "Priya Nair", email: "manager@iconic.in", pass: "manager123", role: "Manager", branch: "Madurai Desk", phone: "98400 00002", active: true },
  { id: 103, name: "Rohan Das", email: "executive@iconic.in", pass: "agent123", role: "Executive", branch: "Madurai Desk", phone: "98400 00003", active: true },
  { id: 104, name: "Divya Menon", email: "caller@iconic.in", pass: "caller123", role: "Telecaller", branch: "Madurai Desk", phone: "98400 00004", active: true },
];

const INITIAL_PROJECTS = [
  { id: 1, name: "Vishal Virinchi Apartments", location: "Madurai Bypass", branch: "Madurai Desk", type: "Apartment", price: 65, units: 10, sold: 2, status: "Active" },
  { id: 2, name: "ICONIC Lakeview Oasis", location: "Velachery, Chennai", branch: "Chennai South", type: "Apartment", price: 85, units: 120, sold: 45, status: "Active" },
  { id: 3, name: "ICONIC Greens Enclave", location: "Saravanampatti, CBE", branch: "Coimbatore", type: "Villa", price: 140, units: 40, sold: 12, status: "Pre-launch" },
];

const INITIAL_LEADS = [
  { id: 1001, name: "Suresh Kumar", phone: "98400 11234", altPhone: "98400 11235", email: "suresh@gmail.com", location: "Madurai", branch: "Madurai Desk", project: "Vishal Virinchi Apartments", budget: 85, source: "Website", assignedTo: "Rohan Das", status: "Interested", notes: "Prefers higher floors.", dateCreated: "2026-05-10", lastFollowUp: "2026-05-25", nextFollowUp: "2026-05-29", history: [{ date: "2026-05-15", by: "Divya Menon", action: "Initial entry Ingestion completed." }], bookingUnit: "", bookingAmount: 0, bookingMode: "", bookingDate: "", regPending: false, regCompleted: false },
  { id: 1002, name: "Lakshmi Rao", phone: "99400 22345", altPhone: "", email: "lakshmi@yahoo.com", location: "Chennai", branch: "Chennai South", project: "ICONIC Lakeview Oasis", budget: 72, source: "Meta Ads", assignedTo: "Unassigned", status: "Site Visit Planned", notes: "Arranging transportation for family site walkthrough.", dateCreated: "2026-05-12", lastFollowUp: "2026-05-28", nextFollowUp: "2026-06-02", history: [{ date: "2026-05-28", by: "System Master", action: "Site visit tour routing planned." }], bookingUnit: "", bookingAmount: 0, bookingMode: "", bookingDate: "", regPending: false, regCompleted: false },
  { id: 1003, name: "Vijay Anand", phone: "97400 33456", altPhone: "", email: "vijay@outlook.com", location: "Coimbatore", branch: "Coimbatore", project: "ICONIC Greens Enclave", budget: 140, source: "Google Ads", assignedTo: "Unassigned", status: "New", notes: "Looking for independent premium duplex villa row structure.", dateCreated: "2026-05-29", lastFollowUp: "None", nextFollowUp: "2026-05-29", history: [{ date: "2026-05-29", by: "Auto Capture", action: "Landing page conversion captured." }], bookingUnit: "", bookingAmount: 0, bookingMode: "", bookingDate: "", regPending: false, regCompleted: false },
  { id: 1004, name: "Meena Selvam", phone: "96400 44567", altPhone: "96400 44568", email: "meena@gmail.com", location: "Madurai", branch: "Madurai Desk", project: "Vishal Virinchi Apartments", budget: 65, source: "Walk-In", assignedTo: "Rohan Das", status: "Booking Confirmed", notes: "Token collected cleanly.", dateCreated: "2026-04-20", lastFollowUp: "2026-05-20", nextFollowUp: "None", history: [{ date: "2026-05-20", by: "Rohan Das", action: "Booking validated." }], bookingUnit: "A-402", bookingAmount: 500000, bookingMode: "Cheque", bookingDate: "2026-05-20", regPending: true, regCompleted: false },
];

const SC = {
  New:                    { bg: "rgba(59,130,246,0.1)", text: "#60a5fa", border: "rgba(59,130,246,0.2)" },
  Contacted:              { bg: "rgba(245,158,11,0.1)", text: "#fbbf24", border: "rgba(245,158,11,0.2)" },
  Interested:             { bg: "rgba(16,185,129,0.1)", text: "#34d399", border: "rgba(16,185,129,0.2)" },
  "Site Visit Planned":   { bg: "rgba(139,92,246,0.1)", text: "#a78bfa", border: "rgba(139,92,246,0.2)" },
  "Site Visit Completed": { bg: "rgba(20,184,166,0.1)", text: "#2dd4bf", border: "rgba(20,184,166,0.2)" },
  Negotiation:            { bg: "rgba(236,72,153,0.1)", text: "#f472b6", border: "rgba(236,72,153,0.2)" },
  "Booking Confirmed":    { bg: "rgba(52,211,153,0.15)", text: "#34d399", border: "rgba(52,211,153,0.3)" },
  Closed:                 { bg: "rgba(107,114,128,0.1)", text: "#9ca3af", border: "rgba(107,114,128,0.2)" },
};

export default function App() {
  const TODAY_STR = "2026-05-29"; // Synchronized system reference timestamp

  const [currentUser, setCurrentUser] = useState(null); 
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("dashboard"); 
  const [globalSearch, setGlobalSearch] = useState("");

  // System Attributor Collections Managed via Admin Controls
  const [sources, setSources] = useState(INITIAL_SOURCES);
  const [statuses, setStatuses] = useState(INITIAL_STATUSES);
  const [newSourceInput, setNewSourceInput] = useState("");
  const [newStatusInput, setNewStatusInput] = useState("");

  // Report Filter Master Engine Values
  const [filterSource, setFilterSource] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterProject, setFilterProject] = useState("All");
  const [filterExecutive, setFilterExecutive] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Main System State Memory
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);

  const [selectedLead, setSelectedLead] = useState(null);
  const [editingUser, setEditingUser] = useState(null); 

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Forms Binding Controllers
  const [newLeadForm, setNewLeadForm] = useState({ name: "", phone: "", altPhone: "", email: "", location: "", project: "Vishal Virinchi Apartments", budget: 65, source: "Website", assignedTo: "Unassigned", notes: "" });
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", pass: "iconic123", role: "Executive", branch: "Madurai Desk", phone: "" });
  const [newProjectForm, setNewProjectForm] = useState({ name: "", location: "", type: "Apartment", price: 50, units: 10 });

  // Direct Inbound Follow-Up Interaction Logs State
  const [followUpNotes, setFollowUpNotes] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");

  const [svDate, setSvDate] = useState("");
  const [svFeedback, setSvFeedback] = useState("");
  const [svFamily, setSvFamily] = useState("");
  const [svProbability, setSvProbability] = useState("High");

  const [bkUnit, setBkUnit] = useState("");
  const [bkAmount, setBkAmount] = useState("");
  const [bkMode, setBkMode] = useState("Cheque");
  const [bkDate, setBkDate] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const account = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase().trim() && u.pass === loginPassword && u.active);
    if (account) {
      setCurrentUser(account);
      setLoginError("");
    } else {
      setLoginError("Invalid clearance email or passcode authentication key parameter.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginEmail("");
    setLoginPassword("");
    setGlobalSearch("");
    setActiveTab("dashboard");
  };

  // ─── ROLE ACCESS DATA ISOLATION METRIC COMPUTATIONS ───────────────────────
  const visibleProjects = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === "Admin") return projects;
    return projects.filter(p => p.branch === currentUser.branch);
  }, [projects, currentUser]);

  const visibleUsers = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === "Admin") return users;
    return users.filter(u => u.branch === currentUser.branch);
  }, [users, currentUser]);

  const processedLeads = useMemo(() => {
    if (!currentUser) return [];
    
    let result = leads;

    if (currentUser.role === "Manager") {
      result = leads.filter(l => l.branch === currentUser.branch);
    } else if (currentUser.role === "Executive") {
      result = leads.filter(l => l.assignedTo === currentUser.name);
    } else if (currentUser.role === "Telecaller") {
      result = leads.filter(l => l.assignedTo === currentUser.name || (l.status === "New" && l.branch === currentUser.branch));
    }

    if (globalSearch.trim()) {
      const term = globalSearch.toLowerCase();
      result = result.filter(l => 
        l.name.toLowerCase().includes(term) || 
        l.phone.includes(term) || 
        l.project.toLowerCase().includes(term) || 
        l.status.toLowerCase().includes(term)
      );
    }

    if (filterSource !== "All") result = result.filter(l => l.source === filterSource);
    if (filterStatus !== "All") result = result.filter(l => l.status === filterStatus);
    if (filterProject !== "All") result = result.filter(l => l.project === filterProject);
    if (filterExecutive !== "All") result = result.filter(l => l.assignedTo === filterExecutive);

    if (startDate) result = result.filter(l => l.dateCreated >= startDate);
    if (endDate) result = result.filter(l => l.dateCreated <= endDate);

    return result;
  }, [leads, currentUser, globalSearch, filterSource, filterStatus, filterProject, filterExecutive, startDate, endDate]);

  // Daily Follow-Up Reminder Queue
  const dailyFollowUpLeads = useMemo(() => {
    return processedLeads.filter(l => l.nextFollowUp === TODAY_STR);
  }, [processedLeads]);

  // Admin Injection Form Submissions
  const handleAddSource = (e) => {
    e.preventDefault();
    if (newSourceInput.trim() && !sources.includes(newSourceInput.trim())) {
      setSources([...sources, newSourceInput.trim()]);
      setNewSourceInput("");
    }
  };

  const handleAddStatus = (e) => {
    e.preventDefault();
    if (newStatusInput.trim() && !statuses.includes(newStatusInput.trim())) {
      setStatuses([...statuses, newStatusInput.trim()]);
      setNewStatusInput("");
    }
  };

  const handleCreateLead = (e) => {
    e.preventDefault();
    const created = {
      ...newLeadForm,
      id: Date.now(),
      branch: currentUser.role === "Admin" ? "Madurai Desk" : currentUser.branch,
      dateCreated: TODAY_STR,
      lastFollowUp: "None",
      nextFollowUp: TODAY_STR, // Auto-bind entry checklist alert queue
      bookingUnit: "", bookingAmount: 0, bookingMode: "", bookingDate: "", regPending: false, regCompleted: false,
      history: [{ date: TODAY_STR, by: currentUser.name, action: "Lead recorded inside system channels." }]
    };
    setLeads([created, ...leads]);
    setIsLeadModalOpen(false);
    setNewLeadForm({ name: "", phone: "", altPhone: "", email: "", location: "", project: "Vishal Virinchi Apartments", budget: 65, source: "Website", assignedTo: "Unassigned", notes: "" });
  };

  // ─── CRITICAL: CONFIRMATION PROMPT GATE INTERCEPTOR ───────────────────────
  const executeStatusTransition = (leadId, nextStatus) => {
    const target = leads.find(l => l.id === leadId);
    if (!target) return;

    const validationConfirmation = window.confirm(
      `CRITICAL CONFIRMATION: Are you sure you want to shift client workflow profile "${target.name}" from current milestone "${target.status}" into next tracking segment "${nextStatus}"?`
    );

    if (validationConfirmation) {
      setLeads(leads.map(l => l.id === leadId ? {
        ...l, status: nextStatus,
        history: [...l.history, { date: TODAY_STR, by: currentUser.name, action: `Pipeline milestone modified to: ${nextStatus}` }]
      } : l));
      
      // Keep state contextual mirror clean if selected sidebar profile row matches active context
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: nextStatus });
      }
    }
  };

  // ─── CRITICAL: SYSTEM CHRONOLOGY FOLLOW-UP INTERACTION TRACKING ENGINE ─────
  const commitManualFollowUpReport = (e) => {
    e.preventDefault();
    if (!followUpNotes.trim() || !nextFollowUpDate) {
      alert("Validation Gate Error: Detailed summary records and clear next follow-up dates are mandatory parameters.");
      return;
    }

    const updatedLeads = leads.map(l => {
      if (l.id === selectedLead.id) {
        const revisedObject = {
          ...l,
          lastFollowUp: TODAY_STR,
          nextFollowUp: nextFollowUpDate,
          history: [
            ...l.history,
            { date: TODAY_STR, by: currentUser.name, action: `LOGGED INTERACTION SUMMARY: ${followUpNotes.trim()} (Next Follow-up coordinated for: ${nextFollowUpDate})` }
          ]
        };
        setSelectedLead(revisedObject); // Flush detail modal layout views dynamically
        return revisedObject;
      }
      return l;
    });

    setLeads(updatedLeads);
    setFollowUpNotes("");
    setNextFollowUpDate("");
    alert("Follow-up logs written successfully.");
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
    setNewUserForm({ name: "", email: "", pass: "iconic123", role: "Executive", branch: "Madurai Desk", phone: "" });
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
  };

  const handleDeleteUser = (userId) => {
    if (userId === currentUser.id) {
      alert("Security Block: Administrative sessions cannot delete their own system validation tokens.");
      return;
    }
    if (window.confirm("Confirm deletion of user?")) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    const created = {
      ...newProjectForm,
      id: Date.now(),
      branch: "Madurai Desk",
      sold: 0,
      status: "Active"
    };
    setProjects([...projects, created]);
    setIsProjectModalOpen(false);
    setNewProjectForm({ name: "", location: "", type: "Apartment", price: 50, units: 10 });
  };

  const assignLeadOwner = (leadId, ownerName) => {
    setLeads(leads.map(l => l.id === leadId ? {
      ...l, assignedTo: ownerName, status: ownerName === "Unassigned" ? "New" : "Assigned",
      history: [...l.history, { date: TODAY_STR, by: currentUser.name, action: `Lead ownership assigned to: ${ownerName}` }]
    } : l));
  };

  const commitSiteWalkthroughLog = () => {
    if (!svDate || !svFeedback.trim()) {
      alert("All fields are mandatory.");
      return;
    }
    setLeads(leads.map(l => l.id === selectedLead.id ? {
      ...l, status: "Site Visit Completed", lastFollowUp: svDate,
      history: [...l.history, { date: svDate, by: currentUser.name, action: `Site visit logged. Family: ${svFamily || "Self"}. Notes: ${svFeedback}` }]
    } : l));
    setSelectedLead(null); setSvFeedback(""); setSvDate(""); setSvFamily("");
  };

  const commitFinancialBookingLog = () => {
    if (!bkUnit || !bkAmount || !bkDate) {
      alert("All operational parameters are required.");
      return;
    }
    setLeads(leads.map(l => l.id === selectedLead.id ? {
      ...l, status: "Booking Confirmed", bookingUnit: bkUnit, bookingAmount: parseFloat(bkAmount), bookingMode: bkMode, bookingDate: bkDate, regPending: true,
      history: [...l.history, { date: bkDate, by: currentUser.name, action: `Unit ${bkUnit} confirmed with advance token of ₹${bkAmount}` }]
    } : l));
    setProjects(projects.map(p => p.name === selectedLead.project ? { ...p, sold: p.sold + 1 } : p));
    setSelectedLead(null); setBkUnit(""); setBkAmount(""); setBkDate("");
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans antialiased overflow-hidden">
      
      {/* NAVIGATION RAIL CONTROL BAR */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
            <Building2 className="h-6 w-6 text-indigo-500" />
            <span className="font-black text-sm tracking-widest text-white">ICONIC CRM</span>
          </div>
          <nav className="p-4 space-y-1">
            <button onClick={() => setActiveTab("dashboard")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${activeTab === "dashboard" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              <Layers className="h-4 w-4" /> VISUAL DASHBOARD
            </button>
            <button onClick={() => setActiveTab("leads")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${activeTab === "leads" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              <PhoneCall className="h-4 w-4" /> LEAD CHANNELS
            </button>
            <button onClick={() => setActiveTab("projects")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${activeTab === "projects" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              <Building2 className="h-4 w-4" /> PROJECT MASTER
            </button>
            {currentUser.role === "Admin" && (
              <button onClick={() => setActiveTab("users")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${activeTab === "users" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
                <Users className="h-4 w-4" /> SYSTEM CONTROL HUB
              </button>
            )}
            <button onClick={() => setActiveTab("reports")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${activeTab === "reports" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              <BarChart3 className="h-4 w-4" /> MATRIX REPORTS
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-850">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="h-7 w-7 rounded-lg bg-indigo-600 font-black text-xs flex items-center justify-center text-white flex-shrink-0">{currentUser.avatar}</div>
              <div className="truncate w-24">
                <p className="text-xs font-bold text-slate-200 truncate">{currentUser.name}</p>
                <p className="text-[9px] text-indigo-400 font-black tracking-wider uppercase truncate">{currentUser.role}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-rose-400 transition-colors ml-1">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-8 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input type="text" value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} placeholder="Live context search by name, phone, project or phase..." className="w-full bg-slate-900 border border-slate-850 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500" />
          </div>
          <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1.5 border border-slate-850 rounded-xl font-mono">
            System Date Context: <span className="text-indigo-400 font-bold">{TODAY_STR}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          
          {/* VIEWPORT 1: PERFORMANCE DASHBOARD AND DAILY ACTION MATRICES */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950 p-6 border border-slate-800 rounded-2xl">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">{currentUser.role} Control Panel</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time action queues scoped exclusively under authorization nodes.</p>
                </div>
                
                {/* ─── MANDATORY ACTION ATTENTION CONTROLLER BLOCKS ─── */}
                <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 px-4 py-3 rounded-xl animate-pulse">
                  <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-black text-amber-400 uppercase tracking-wide">Follow-Ups Pending Today</p>
                    <p className="text-[11px] text-slate-300 font-medium font-mono">{dailyFollowUpLeads.length} critical actions require logging updates.</p>
                  </div>
                </div>
              </div>

              {/* ACTION TASK LIST RADAR - ACTION DOCK GRID ROW */}
              {dailyFollowUpLeads.length > 0 && (
                <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 space-y-4">
                  <h2 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2"><Bell className="h-4 w-4" /> URGENT MANDATORY TRACKING QUEUE</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dailyFollowUpLeads.map(l => (
                      <div key={l.id} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-white text-sm cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => setSelectedLead(l)}>{l.name}</h4>
                            <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded uppercase tracking-wider">{l.source}</span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono mt-1">{l.phone} • {l.project}</p>
                          <p className="text-[11px] text-slate-500 italic mt-2 truncate">"{l.notes || 'No notes mapped.'}"</p>
                        </div>
                        <button onClick={() => setSelectedLead(l)} className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 hover:text-white font-bold py-1.5 rounded-lg tracking-wide uppercase transition-all">
                          Open Client Profile & Log Interaction
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* KPI CARD SCORE TILES GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Leads Inbound Scope <Briefcase className="h-4 w-4 text-indigo-400" /></p>
                  <p className="text-3xl font-black text-white mt-1">{processedLeads.length}</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Confirmed Bookings <CheckCircle2 className="h-4 w-4 text-emerald-400" /></p>
                  <p className="text-3xl font-black text-emerald-400 mt-1">{processedLeads.filter(l => ["Booking Confirmed","Closed"].includes(l.status)).length}</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Pipeline Capital Value <DollarSign className="h-4 w-4 text-indigo-400" /></p>
                  <p className="text-3xl font-black text-white mt-1">₹{processedLeads.reduce((a,c)=>a+c.budget, 0)}L</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Field Visits Arranged <Calendar className="h-4 w-4 text-amber-400" /></p>
                  <p className="text-3xl font-black text-amber-400 mt-1">{processedLeads.filter(l => l.status === "Site Visit Planned").length}</p>
                </div>
              </div>
            </div>
          )}

          {/* VIEWPORT 2: LEAD CHANNELS STORAGE AND DRILLDOWN TABLE MAPS */}
          {activeTab === "leads" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Active Inbound Lead Ledger</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Isolated layout columns monitoring customer pipeline movement states.</p>
                </div>
                <button onClick={() => setIsLeadModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-4 py-2 rounded-xl text-xs transition-colors">
                  <Plus className="h-4 w-4" /> INGEST RECORD
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="p-4">Customer Contact Info</th>
                        <th className="p-4">Project Context</th>
                        <th className="p-4">Channel Origin</th>
                        <th className="p-4">Owner Assignment</th>
                        <th className="p-4">Pipeline Phase Milestone</th>
                        <th className="p-4 text-right">Target Budget</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {processedLeads.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-slate-500 font-semibold italic">No active records match the current filters.</td>
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
                              <p className="text-[11px] text-slate-500 mt-0.5 font-mono">Captured: {l.dateCreated}</p>
                            </td>
                            <td className="p-4">
                              <span className="bg-slate-900 border border-slate-850 text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold font-mono">{l.source}</span>
                            </td>
                            <td className="p-4">
                              {["Admin", "Manager"].includes(currentUser.role) ? (
                                <select value={l.assignedTo} onChange={(e) => assignLeadOwner(l.id, e.target.value)} className="bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1 text-xs focus:outline-none">
                                  <option value="Unassigned">Unassigned</option>
                                  {visibleUsers.filter(u => u.role === "Executive").map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                                </select>
                              ) : (
                                <span className="font-semibold text-slate-400">{l.assignedTo}</span>
                              )}
                            </td>
                            <td className="p-4">
                              <select value={l.status} onChange={(e) => executeStatusTransition(l.id, e.target.value)} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 font-bold text-xs text-slate-300 focus:outline-none cursor-pointer animate-none" style={{ color: SC[l.status]?.text || "#FFF" }}>
                                {statuses.map(st => <option key={st} value={st}>{st}</option>)}
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

          {/* VIEWPORT 3: PROJECTS MASTER PORTFOLIOS CONTAINER */}
          {activeTab === "projects" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Ecosystem Asset Registry Portfolio Matrix</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Track active real estate unit configurations based on branch scopes.</p>
                </div>
                {currentUser.role === "Admin" && (
                  <button onClick={() => setIsProjectModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-4 py-2 rounded-xl text-xs transition-colors">
                    <Plus className="h-4 w-4" /> PROVISION SCHEME ASSET
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleProjects.map(p => (
                  <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-black text-white">{p.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3 text-slate-600" /> {p.location} • <span className="font-semibold text-indigo-400">{p.branch}</span></p>
                      </div>
                      <span className="text-[10px] font-black bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded uppercase tracking-wider">{p.status}</span>
                    </div>
                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-850 grid grid-cols-2 gap-2 text-xs font-semibold text-slate-300">
                      <div><p className="text-slate-500 text-[10px] font-bold uppercase">Avg Valuation</p><p className="text-white font-mono font-black mt-0.5">₹{p.price}L Base</p></div>
                      <div><p className="text-slate-500 text-[10px] font-bold uppercase">Inventory Sold</p><p className="text-emerald-400 font-bold mt-0.5">{p.sold} / {p.units} Units</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEWPORT 4: ADMIN ADVANCED PRIVILEGE TIERS SYSTEM CONTROL HUB */}
          {activeTab === "users" && currentUser.role === "Admin" && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* EXTRA SYSTEM CONTROLS FOR ATTRIBUTE ENUM EXPANSIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SOURCE MODIFIER PANEL */}
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <h3 className="text-xs font-black uppercase text-indigo-400 tracking-wider">Expand Lead Source Attribution Hub</h3>
                  <form onSubmit={handleAddSource} className="flex gap-2">
                    <input type="text" value={newSourceInput} onChange={(e)=>setNewSourceInput(e.target.value)} placeholder="e.g. Newspaper Ad, Radio, etc." className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none" />
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-1.5 rounded-xl text-xs uppercase tracking-wider transition-colors">Inject</button>
                  </form>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {sources.map(s => <span key={s} className="bg-slate-900 border border-slate-850 text-slate-400 px-2.5 py-1 rounded text-[10px] font-bold font-mono">{s}</span>)}
                  </div>
                </div>

                {/* STATUS MILESTONE MODIFIER PANEL */}
                <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <h3 className="text-xs font-black uppercase text-indigo-400 tracking-wider">Expand Pipeline Phase Milestones</h3>
                  <form onSubmit={handleAddStatus} className="flex gap-2">
                    <input type="text" value={newStatusInput} onChange={(e)=>setNewStatusInput(e.target.value)} placeholder="e.g. Legal Verified, Document Shared, etc." className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none" />
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-1.5 rounded-xl text-xs uppercase tracking-wider transition-colors">Inject</button>
                  </form>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {statuses.map(st => <span key={st} className="bg-slate-900 border border-slate-850 text-slate-400 px-2.5 py-1 rounded text-[10px] font-bold font-mono">{st}</span>)}
                  </div>
                </div>
              </div>

              {/* CORE TEAM SEATS REGISTER TABLE MAPS */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Active Identity Passes Registry</h3>
                  <button onClick={() => setIsUserModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-4 py-2 rounded-xl text-xs transition-colors">
                    <UserPlus className="h-4 w-4" /> CREATE USER
                  </button>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="p-4">Personnel Identity Name</th>
                        <th className="p-4">Clearance Role</th>
                        <th className="p-4">Regional Scope Office</th>
                        <th className="p-4">Account Password</th>
                        <th className="p-4 text-center">Administrative Controls</th>
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
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => setEditingUser(u)} className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors"><Edit2 className="h-3.5 w-3.5" /></button>
                              <button onClick={() => handleDeleteUser(u.id)} className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEWPORT 5: MATRIX REPORTS (Featuring Clearable Pop-Up Custom Calendar Nodes) */}
          {activeTab === "reports" && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Ecosystem Analytics Filtering Engine</h1>
                <p className="text-xs text-slate-400 mt-0.5">Isolate channels, source attributions, and chronological tracking parameters instantly.</p>
              </div>

              {/* FILTER PANELS CONTAINER BOX */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Source Channel Hub</label>
                    <select value={filterSource} onChange={(e) => setFilterSource(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none">
                      <option value="All">All Sources</option>
                      {sources.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Pipeline Phase Status</label>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none">
                      <option value="All">All Statuses</option>
                      {statuses.map(st => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Target Asset Scheme</label>
                    <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none">
                      <option value="All">All Projects</option>
                      {visibleProjects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Executive Allocation</label>
                    <select value={filterExecutive} onChange={(e) => setFilterExecutive(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none">
                      <option value="All">All Executives</option>
                      {visibleUsers.filter(u => u.role === "Executive").map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* ─── ENHANCED: CLEARABLE POP-UP DATE RANGE CALENDARS CHRONO CORE ─── */}
                <div className="border-t border-slate-900 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px] flex justify-between items-center">
                      Chronological From Date
                      {startDate && <button onClick={()=>setStartDate("")} className="text-indigo-400 hover:text-rose-400 font-bold flex items-center gap-0.5 font-mono text-[9px] uppercase"><X className="h-3 w-3" /> Clear</button>}
                    </label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px] flex justify-between items-center">
                      Chronological To Date
                      {endDate && <button onClick={()=>setEndDate("")} className="text-indigo-400 hover:text-rose-400 font-bold flex items-center gap-0.5 font-mono text-[9px] uppercase"><X className="h-3 w-3" /> Clear</button>}
                    </label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono" />
                  </div>
                </div>
              </div>

              {/* ROW DISPLAY MATRIX DISPLAY CORE BOX */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center border-b border-slate-850 pb-3 mb-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Isolated Output Rows ({processedLeads.length} Matches)</h3>
                  <button onClick={() => { setFilterSource("All"); setFilterStatus("All"); setFilterProject("All"); setFilterExecutive("All"); setStartDate(""); setEndDate(""); }} className="text-indigo-400 hover:text-white text-xs font-bold font-mono">Clear Matrix Settings</button>
                </div>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-500 font-bold border-b border-slate-900 uppercase">
                        <th className="pb-2">Client Entity</th>
                        <th className="pb-2">Target Scheme</th>
                        <th className="pb-2">Channel Origin</th>
                        <th className="pb-2">Assigned Agent</th>
                        <th className="pb-2">Pipeline Phase</th>
                        <th className="pb-2 text-right">Budget Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {processedLeads.map(l => (
                        <tr key={l.id} className="hover:bg-slate-900/20">
                          <td className="py-3 font-bold text-white cursor-pointer hover:text-indigo-400" onClick={() => setSelectedLead(l)}>
                            <p>{l.name}</p>
                            <p className="text-[10px] text-slate-500 font-normal font-mono">{l.dateCreated}</p>
                          </td>
                          <td className="py-3 font-medium">{l.project}</td>
                          <td className="py-3 font-mono text-slate-400">{l.source}</td>
                          <td className="py-3 text-slate-400 font-semibold">{l.assignedTo}</td>
                          <td className="py-3 font-black" style={{ color: SC[l.status]?.text }}>{l.status}</td>
                          <td className="py-3 text-right font-mono font-bold text-emerald-400">₹{l.budget}L</td>
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

      {/* ─── DETAILED COMPREHENSIVE DOSSIER ACCOUNT TIMELINE OVERLAY DRAWER ─── */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end" onClick={() => setSelectedLead(null)}>
          <div className="bg-slate-950 w-[540px] border-l border-slate-800 h-full flex flex-col p-6 overflow-y-auto space-y-6" onClick={(e) => e.stopPropagation()}>
            <div className="border-b border-slate-900 pb-4 flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-indigo-600 font-mono font-black px-2 py-0.5 rounded text-white tracking-wider">COMPREHENSIVE PROFILE RECORD FOR PATH DOSSIER #{selectedLead.id}</span>
                <h2 className="text-xl font-black text-white mt-1.5 cursor-default">{selectedLead.name}</h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedLead.phone} • {selectedLead.email || 'No email shared'}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-slate-500 hover:text-white font-bold text-sm">✕</button>
            </div>

            {/* PIPELINE DATA CARD STATS REVIEWS */}
            <div className="bg-slate-900 p-4 border border-slate-850 rounded-xl grid grid-cols-2 gap-4 text-xs font-semibold">
              <div><p className="text-slate-500 uppercase tracking-wide text-[9px]">Target Project Scheme</p><p className="text-white mt-0.5 text-sm font-bold">{selectedLead.project}</p></div>
              <div><p className="text-slate-500 uppercase tracking-wide text-[9px]">Current Allocation Owner</p><p className="text-indigo-400 mt-0.5 text-sm font-bold">{selectedLead.assignedTo}</p></div>
              <div>
                <p className="text-slate-500 uppercase tracking-wide text-[9px]">Pipeline Phase Milestone</p>
                <select value={selectedLead.status} onChange={(e) => executeStatusTransition(selectedLead.id, e.target.value)} className="bg-slate-950 border border-slate-800 p-1 rounded mt-1 font-bold text-xs text-slate-300 focus:outline-none cursor-pointer">
                  {statuses.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
              <div><p className="text-slate-500 uppercase tracking-wide text-[9px]">Next Mandatory Follow-Up Date</p><p className="text-amber-400 mt-1 text-sm font-mono font-black uppercase flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {selectedLead.nextFollowUp || "None Scheduled"}</p></div>
            </div>

            {/* ─── DYNAMIC INGESTION INTERACTION MODULE FOR LOGGING FOLLOWUPS ─── */}
            <form onSubmit={commitManualFollowUpReport} className="bg-slate-900 p-4 border border-slate-850 rounded-2xl space-y-4 text-xs">
              <p className="text-[11px] font-black uppercase text-indigo-400 tracking-wider flex items-center gap-2"><PhoneCall className="h-4 w-4" /> Log New Follow-Up Interaction</p>
              <div className="space-y-1">
                <label className="text-slate-400 font-bold text-[10px]">Detailed Interaction Summary Notes *</label>
                <textarea rows={2} required value={followUpNotes} onChange={(e)=>setFollowUpNotes(e.target.value)} placeholder="Mandatory log entry data to record phone call/meeting response content parameters completely..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 mt-0.5 focus:outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-bold text-[10px]">Coordinated Next Follow-Up Pop-up Calendar Date *</label>
                <input type="date" required min={TODAY_STR} value={nextFollowUpDate} onChange={(e)=>setNextFollowUpDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 mt-0.5 focus:outline-none font-mono" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg">Commit Follow-Up Log Summary</button>
            </form>

            {/* WORKFLOW DRAWER SUBS: SITE TOUR WALKTHROUGH CHECKLISTS */}
            <div className="bg-slate-900/40 p-4 border border-slate-850 rounded-2xl space-y-4 text-xs">
              <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-amber-500" /> Sequence Action: Site Tour Verification Log</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><label className="text-slate-500 font-bold text-[10px]">Walkthrough Date</label><input type="date" value={svDate} onChange={(e)=>setSvDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 mt-0.5 text-slate-300 focus:outline-none font-mono" /></div>
                <div className="space-y-1"><label className="text-slate-500 font-bold text-[10px]">Co-Buyers Family Attended</label><input type="text" value={svFamily} onChange={(e)=>setSvFamily(e.target.value)} placeholder="e.g. Spouse" className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 mt-0.5 text-slate-300 focus:outline-none" /></div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-500 font-bold text-[10px]">Client Response Evaluation Logs *</label>
                <textarea rows={1} value={svFeedback} onChange={(e)=>setSvFeedback(e.target.value)} placeholder="Notes for site validation gates..." className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-300 mt-0.5 focus:outline-none" />
              </div>
              <button type="button" onClick={commitSiteWalkthroughLog} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 rounded-xl text-xs transition-colors">Commit Site Visit Verification</button>
            </div>

            {/* WORKFLOW DRAWER SUBS: ADVANCED FINANCIAL DEPOSIT BOOKINGS FORMS */}
            <div className="bg-slate-900/40 p-4 border border-slate-850 rounded-2xl space-y-4 text-xs">
              <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Sequence Action: Financial Token Booking Ingestion</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><label className="text-slate-500 font-bold text-[10px]">Unit Designation Code *</label><input type="text" value={bkUnit} onChange={(e)=>setBkUnit(e.target.value)} placeholder="e.g. Flat 4A" className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 mt-0.5 text-slate-300 focus:outline-none" /></div>
                <div className="space-y-1"><label className="text-slate-500 font-bold text-[10px]">Token Amount Processed (₹) *</label><input type="number" value={bkAmount} onChange={(e)=>setBkAmount(e.target.value)} placeholder="INR Value" className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 mt-0.5 text-emerald-400 font-bold focus:outline-none" /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Payment Method</label>
                  <select value={bkMode} onChange={(e)=>setBkMode(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 mt-0.5 text-slate-300 focus:outline-none">
                    <option value="Cheque">Bank Cheque</option><option value="NEFT/RTGS">NEFT / RTGS Wire</option>
                  </select>
                </div>
                <div className="space-y-1"><label className="text-slate-500 font-bold text-[10px]">Settlement Booking Date</label><input type="date" value={bkDate} onChange={(e)=>setBkDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 mt-0.5 text-slate-300 focus:outline-none font-mono" /></div>
              </div>
              <button type="button" onClick={commitFinancialBookingLog} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-1.5 rounded-xl text-xs uppercase tracking-wider transition-colors">Secure Unit Allocation</button>
            </div>

            {/* CHRONOLOGICAL DOSSIER EVENT MATRIX AUDITING TRAILS */}
            <div className="space-y-3 pt-2 text-xs">
              <p className="text-[10px] font-black text-slate-400 tracking-wider uppercase border-b border-slate-900 pb-1">Historical Operation Activity Trails (Dossier Timeline View)</p>
              <div className="border-l border-indigo-500 pl-4 space-y-4 ml-1 pt-1">
                {selectedLead.history.map((h, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-indigo-400 shadow-md shadow-indigo-500/50"></div>
                    <p className="text-[10px] text-slate-500 font-bold font-mono">{h.date} — Logged by: {h.by}</p>
                    <p className="text-xs text-slate-300 font-medium mt-0.5">{h.action}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* DIALOG FRAMES BLOCKS: INGEST NEW CUSTOMER PROFILE */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h2 className="text-base font-black text-white tracking-wide">Capture Customer Profile Ingestion</h2>
              <button onClick={() => setIsLeadModalOpen(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Client Target Name *</label>
                  <input type="text" required value={newLeadForm.name} onChange={(e)=>setNewLeadForm({...newLeadForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Attribution Channel Source</label>
                  <select value={newLeadForm.source} onChange={(e)=>setNewLeadForm({...newLeadForm, source: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-300 focus:outline-none">
                    {sources.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Primary Contact Phone *</label>
                  <input type="text" required value={newLeadForm.phone} onChange={(e)=>setNewLeadForm({...newLeadForm, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Alternate Contact Number</label>
                  <input type="text" value={newLeadForm.altPhone} onChange={(e)=>setNewLeadForm({...newLeadForm, altPhone: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Location Zone</label>
                  <input type="text" value={newLeadForm.location} onChange={(e)=>setNewLeadForm({...newLeadForm, location: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Financial Intent (Lakhs)</label>
                  <input type="number" value={newLeadForm.budget} onChange={(e)=>setNewLeadForm({...newLeadForm, budget: parseInt(e.target.value)||0})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Target Project</label>
                  <select value={newLeadForm.project} onChange={(e)=>setNewLeadForm({...newLeadForm, project: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-300 focus:outline-none">
                    {visibleProjects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Inquiry Requirement Remarks Summary</label>
                <textarea rows={2} value={newLeadForm.notes} onChange={(e)=>setNewLeadForm({...newLeadForm, notes: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 focus:outline-none" />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl uppercase tracking-wider shadow-lg transition-all">Commit Lead Block Data to Live Channels</button>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG FRAMES BLOCKS: CREATE NEW USER IDENTITY NODE */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h2 className="text-base font-black text-white tracking-wide">Provision Identity Access Pass Node</h2>
              <button onClick={() => setIsUserModalOpen(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div><label className="text-slate-400 font-semibold">Personnel Full Name *</label><input type="text" required value={newUserForm.name} onChange={(e)=>setNewUserForm({...newUserForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 mt-0.5 focus:outline-none" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-semibold">Clearance privilege Tier</label>
                  <select value={newUserForm.role} onChange={(e)=>setNewUserForm({...newUserForm, role: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-300 mt-0.5 focus:outline-none">
                    {INITIAL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-semibold">Office Branch Scope</label>
                  <select value={newUserForm.branch} onChange={(e)=>setNewUserForm({...newUserForm, branch: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-300 mt-0.5 focus:outline-none">
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="text-slate-400 font-semibold">Corporate Authentication Email *</label><input type="email" required value={newUserForm.email} onChange={(e)=>setNewUserForm({...newUserForm, email: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 mt-0.5 focus:outline-none" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-slate-400 font-semibold">Mobile Phone</label><input type="text" required value={newUserForm.phone} onChange={(e)=>setNewUserForm({...newUserForm, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 mt-0.5 focus:outline-none" /></div>
                <div><label className="text-slate-400 font-semibold">Passcode Access Key *</label><input type="text" required value={newUserForm.pass} onChange={(e)=>setNewUserForm({...newUserForm, pass: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-amber-400 font-mono font-bold mt-0.5 focus:outline-none" /></div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl uppercase tracking-wider text-[11px] mt-2 transition-colors">Deploy User Credentials Pass</button>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG FRAMES BLOCKS: MODIFY USER PASS DEPLOYMENT */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h2 className="text-base font-black text-white tracking-wide">Modify Account Clearance Parameters</h2>
              <button onClick={() => setEditingUser(null)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleUpdateUser} className="space-y-3 text-xs">
              <div><label className="text-slate-400 font-semibold">Personnel Full Name *</label><input type="text" required value={editingUser.name} onChange={(e)=>setEditingUser({...editingUser, name: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 mt-0.5 focus:outline-none" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-semibold">Clearance Privilege Tier</label>
                  <select value={editingUser.role} onChange={(e)=>setEditingUser({...editingUser, role: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-300 mt-0.5 focus:outline-none">
                    {INITIAL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-semibold">Office Branch Scope</label>
                  <select value={editingUser.branch} onChange={(e)=>setEditingUser({...editingUser, branch: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-300 mt-0.5 focus:outline-none">
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="text-slate-400 font-semibold">Corporate Authentication Email *</label><input type="email" required value={editingUser.email} onChange={(e)=>setEditingUser({...editingUser, email: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 mt-0.5 focus:outline-none" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-slate-400 font-semibold">Mobile Phone</label><input type="text" required value={editingUser.phone} onChange={(e)=>setEditingUser({...editingUser, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 mt-0.5 focus:outline-none" /></div>
                <div><label className="text-slate-400 font-semibold">Passcode Access Key *</label><input type="text" required value={editingUser.pass} onChange={(e)=>setEditingUser({...editingUser, pass: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-amber-400 font-mono font-bold mt-0.5 focus:outline-none" /></div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl uppercase tracking-wider text-[11px] mt-2 transition-colors">Save Clearance Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG FRAMES BLOCKS: PROVISION PROJECTS MASTER ASSET */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h2 className="text-base font-black text-white tracking-wide">Provision Real Estate Scheme Project</h2>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div><label className="text-slate-400 font-semibold">Project Name *</label><input type="text" required value={newProjectForm.name} onChange={(e)=>setNewProjectForm({...newProjectForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 mt-0.5 focus:outline-none" /></div>
              <div><label className="text-slate-400 font-semibold">Location Address</label><input type="text" required value={newProjectForm.location} onChange={(e)=>setNewProjectForm({...newProjectForm, location: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 mt-0.5 focus:outline-none" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-semibold">Build Type</label>
                  <select value={newProjectForm.type} onChange={(e)=>setNewProjectForm({...newProjectForm, type: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-300 mt-0.5 focus:outline-none">
                    {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div><label className="text-slate-400 font-semibold">Avg Price Unit (Lakhs)</label><input type="number" required value={newProjectForm.price} onChange={(e)=>setNewProjectForm({...newProjectForm, price: parseInt(e.target.value)||0})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 mt-0.5 focus:outline-none" /></div>
              </div>
              <div><label className="text-slate-400 font-semibold">Total Unit Capacity</label><input type="number" required value={newProjectForm.units} onChange={(e)=>setNewProjectForm({...newProjectForm, units: parseInt(e.target.value)||0})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 mt-0.5 focus:outline-none" /></div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl uppercase tracking-wider text-[11px] mt-2 transition-colors">Commit Project Base Scheme</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
