import React, { useState, useMemo } from "react";
import { 
  Users, ShieldAlert, BarChart3, Building2, Briefcase, 
  Layers, PhoneCall, Calendar, Search, Plus, TrendingUp, 
  DollarSign, MapPin, Shield, Clock, LogOut, Lock, 
  Mail, CheckCircle2, UserPlus, Trash2, Edit2, X, Bell, 
  AlertTriangle, Download, Upload, Info, FileSpreadsheet, Check,
  Menu
} from "lucide-react";

// ─── CONSTANT STATIC REGISTRIES ───────────────────────────────────────────
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

const TEAMS_REGISTRY = {
  "Madurai Desk": "Team Alpha (Madurai Core)",
  "Chennai South": "Team Delta (Chennai Hub)",
  "Coimbatore": "Team Orion (CBE Vistas)",
  "Chennai North": "Team Beta (Chennai North)"
};

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
  { id: 1002, name: "Lakshmi Rao", phone: "99400 22345", altPhone: "", email: "lakshmi@yahoo.com", location: "Chennai", branch: "Chennai South", project: "ICONIC Lakeview Oasis", budget: 72, source: "Meta Ads", assignedTo: "Unassigned", status: "New", notes: "Arranging transportation for family walkthrough.", dateCreated: "2026-05-12", lastFollowUp: "2026-05-28", nextFollowUp: "2026-05-29", history: [{ date: "2026-05-28", by: "System Master", action: "Site visit tour routing planned." }], bookingUnit: "", bookingAmount: 0, bookingMode: "", bookingDate: "", regPending: false, regCompleted: false },
  { id: 1003, name: "Vijay Anand", phone: "97400 33456", altPhone: "", email: "vijay@outlook.com", location: "Coimbatore", branch: "Coimbatore", project: "ICONIC Greens Enclave", budget: 140, source: "Google Ads", assignedTo: "Unassigned", status: "New", notes: "Premium duplex villa layout structural interest.", dateCreated: "2026-05-29", lastFollowUp: "None", nextFollowUp: "2026-05-29", history: [{ date: "2026-05-29", by: "Auto Capture", action: "Landing page conversion captured." }], bookingUnit: "", bookingAmount: 0, bookingMode: "", bookingDate: "", regPending: false, regCompleted: false },
  { id: 1004, name: "Meena Selvam", phone: "96400 44567", altPhone: "96400 44568", email: "meena@gmail.com", location: "Madurai", branch: "Madurai Desk", project: "Vishal Virinchi Apartments", budget: 65, source: "Walk-In", assignedTo: "Unassigned", status: "New", notes: "Token collected cleanly.", dateCreated: "2026-04-20", lastFollowUp: "2026-05-20", nextFollowUp: "2026-05-29", history: [{ date: "2026-05-20", by: "Rohan Das", action: "Booking validated." }], bookingUnit: "A-402", bookingAmount: 500000, bookingMode: "Cheque", bookingDate: "2026-05-20", regPending: true, regCompleted: false },
];

const SC = {
  New:                    { bg: "rgba(59,130,246,0.1)", text: "#60a5fa", border: "rgba(59,130,246,0.2)" },
  Assigned:               { bg: "rgba(16,185,129,0.1)", text: "#34d399", border: "rgba(16,185,129,0.2)" },
  Contacted:              { bg: "rgba(245,158,11,0.1)", text: "#fbbf24", border: "rgba(245,158,11,0.2)" },
  "Site Visit Planned":   { bg: "rgba(139,92,246,0.1)", text: "#a78bfa", border: "rgba(139,92,246,0.2)" },
  "Booking Confirmed":    { bg: "rgba(52,211,153,0.15)", text: "#34d399", border: "rgba(52,211,153,0.3)" },
  Closed:                 { bg: "rgba(107,114,128,0.1)", text: "#9ca3af", border: "rgba(107,114,128,0.2)" },
};

export default function App() {
  const TODAY_STR = "2026-05-29";

  // ─── HOOK STATES ──────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(null); 
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("dashboard"); 
  const [globalSearch, setGlobalSearch] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [sources, setSources] = useState(INITIAL_SOURCES);
  const [statuses, setStatuses] = useState(INITIAL_STATUSES);
  const [newSourceInput, setNewSourceInput] = useState("");
  const [newStatusInput, setNewStatusInput] = useState("");

  const [filterSource, setFilterSource] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterProject, setFilterProject] = useState("All");
  const [filterExecutive, setFilterExecutive] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);

  const [selectedLead, setSelectedLead] = useState(null);
  const [editingUser, setEditingUser] = useState(null); 
  const [importText, setImportText] = useState("");
  const [showImportWizard, setShowImportWizard] = useState(false);

  const [customPopup, setCustomPopup] = useState({ isOpen: false, leadId: null, targetValue: "", type: "status", title: "", message: "" });
  const [toastNotification, setToastNotification] = useState({ isVisible: false, message: "" });

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const [newLeadForm, setNewLeadForm] = useState({ name: "", phone: "", altPhone: "", email: "", location: "", project: "Vishal Virinchi Apartments", budget: 65, source: "Website", assignedTo: "Unassigned", notes: "" });
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", pass: "iconic123", role: "Executive", branch: "Madurai Desk", phone: "" });
  const [newProjectForm, setNewProjectForm] = useState({ name: "", location: "", type: "Apartment", price: 50, units: 10 });

  const [followUpNotes, setFollowUpNotes] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");

  const [svDate, setSvDate] = useState("");
  const [svFeedback, setSvFeedback] = useState("");
  const [svFamily, setSvFamily] = useState("");

  const [bkUnit, setBkUnit] = useState("");
  const [bkAmount, setBkAmount] = useState("");
  const [bkMode, setBkMode] = useState("Cheque");
  const [bkDate, setBkDate] = useState("");

  // ─── MEMOIZED DATA COMPUTATIONS ───────────────────────────────────────────
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
    } else if (currentUser.role === "Executive" || currentUser.role === "Telecaller") {
      result = leads.filter(l => l.assignedTo === currentUser.name);
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

  const dailyFollowUpLeads = useMemo(() => {
    return processedLeads.filter(l => l.nextFollowUp === TODAY_STR && l.assignedTo === "Unassigned");
  }, [processedLeads, TODAY_STR]);

  // ─── HANDLERS ─────────────────────────────────────────────────────────────
  const triggerToastAlert = (msg) => {
    setToastNotification({ isVisible: true, message: msg });
    setTimeout(() => setToastNotification({ isVisible: false, message: "" }), 3500);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const account = users.find(u => u.email.toLowerCase() === loginEmail.toLowerCase().trim() && u.pass === loginPassword && u.active);
    if (account) {
      setCurrentUser(account);
      setLoginError("");
      triggerToastAlert(`Welcome back, ${account.name}!`);
    } else {
      setLoginError("Invalid clearance email or passcode authentication pairing.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginEmail("");
    setLoginPassword("");
    setGlobalSearch("");
    setActiveTab("dashboard");
    setIsMobileMenuOpen(false);
  };

  const requestStatusTransitionPopup = (leadId, nextStatus) => {
    const target = leads.find(l => l.id === leadId);
    if (!target) return;
    setCustomPopup({
      isOpen: true,
      leadId,
      targetValue: nextStatus,
      type: "status",
      title: "Confirm Status Shift",
      message: `Are you sure you want to transition "${target.name}" to the "${nextStatus}" milestone tracker?`
    });
  };

  const requestOwnerAssignmentPopup = (leadId, personnelName) => {
    const target = leads.find(l => l.id === leadId);
    if (!target) return;
    setCustomPopup({
      isOpen: true,
      leadId,
      targetValue: personnelName,
      type: "assign",
      title: "Confirm Lead Allocation",
      message: `Delegate tracking and active follow-up parameters for client "${target.name}" to team member "${personnelName}"?`
    });
  };

  const confirmCustomPopupAction = () => {
    const { leadId, targetValue, type } = customPopup;
    if (type === "status") {
      setLeads(leads.map(l => l.id === leadId ? {
        ...l, status: targetValue,
        history: [...l.history, { date: TODAY_STR, by: currentUser.name, action: `Milestone updated to: ${targetValue}` }]
      } : l));
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: targetValue });
      }
      triggerToastAlert("Pipeline status successfully updated.");
    } else if (type === "assign") {
      setLeads(leads.map(l => l.id === leadId ? {
        ...l, 
        assignedTo: targetValue, 
        status: targetValue === "Unassigned" ? "New" : "Assigned",
        nextFollowUp: targetValue === "Unassigned" ? TODAY_STR : "Assigned out to Executive",
        history: [...l.history, { date: TODAY_STR, by: currentUser.name, action: `Routed lead to team desk: ${targetValue}` }]
      } : l));
      setSelectedLead(null);
      triggerToastAlert(`Lead assigned to ${targetValue}`);
    }
    setCustomPopup({ isOpen: false, leadId: null, targetValue: "", type: "status", title: "", message: "" });
  };

  const handleDataImportSubmit = (e) => {
    e.preventDefault();
    if (!importText.trim()) return;
    try {
      const lines = importText.split("\n").map(l => l.trim()).filter(Boolean);
      const newlyIngestedLeads = [];
      lines.forEach(line => {
        const columns = line.split("\t");
        if (columns.length >= 4) {
          const matchedProj = projects.find(p => p.name.toLowerCase() === (columns[3] || "").toLowerCase().trim());
          const branchHome = matchedProj ? matchedProj.branch : "Madurai Desk";
          newlyIngestedLeads.push({
            id: Date.now() + Math.floor(Math.random() * 10000),
            name: columns[0] || "Spreadsheet Lead",
            phone: columns[1] || "00000",
            email: columns[2] || "",
            project: columns[3] || "Vishal Virinchi Apartments",
            location: columns[4] || "Inbound",
            budget: parseInt(columns[5]) || 65,
            source: columns[6] || "Website",
            assignedTo: "Unassigned",
            status: "New",
            branch: branchHome, 
            dateCreated: TODAY_STR,
            lastFollowUp: "None",
            nextFollowUp: TODAY_STR,
            history: [{ date: TODAY_STR, by: currentUser.name, action: "Ingested via excel copy-paste tool." }]
          });
        }
      });
      if (newlyIngestedLeads.length > 0) {
        setLeads([...newlyIngestedLeads, ...leads]);
        triggerToastAlert(`Successfully imported ${newlyIngestedLeads.length} leads.`);
        setImportText("");
        setShowImportWizard(false);
      }
    } catch (err) {
      alert(`Parsing Exception: ${err.message}`);
    }
  };

  const exportDataPipeline = (formatType) => {
    if (processedLeads.length === 0) return;
    const headers = ["Client Name", "Phone", "Email", "Project", "Source", "Agent", "Milestone", "Budget"];
    const rows = processedLeads.map(l => [l.name, l.phone, l.email, l.project, l.source, l.assignedTo, l.status, `Rs.${l.budget}L`]);
    if (formatType === "csv" || formatType === "excel") {
      const delim = formatType === "csv" ? "," : "\t";
      const contentStr = [headers.join(delim), ...rows.map(r => r.join(delim))].join("\n");
      const blob = new Blob([contentStr], { type: "text/plain;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `Desam_Export_${TODAY_STR}.${formatType === "csv" ? "csv" : "xls"}`);
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
    } else if (formatType === "pdf") {
      let w = window.open("", "_blank");
      w.document.write(`<html><head><style>body{font-family:sans-serif;padding:20px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ddd;padding:8px;font-size:11px;}</style></head><body><h2>Desam Developers Export Matrix</h2><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(d=>`<td>${d}</td>`).join("")}</tr>`).join("")}</tbody></table><script>window.print();</script></body></html>`);
      w.document.close();
    }
  };

  const commitManualFollowUpReport = (e) => {
    e.preventDefault();
    if (!followUpNotes.trim() || !nextFollowUpDate) return;
    const updated = leads.map(l => {
      if (l.id === selectedLead.id) {
        const obj = {
          ...l, 
          status: "Contacted", // Upgrade status marker cleanly out of new/assigned gate upon log entry submission
          lastFollowUp: TODAY_STR, 
          nextFollowUp: nextFollowUpDate,
          history: [...l.history, { date: TODAY_STR, by: currentUser.name, action: `LOG: ${followUpNotes.trim()} (Next Scheduled Check: ${nextFollowUpDate})` }]
        };
        setSelectedLead(obj);
        return obj;
      }
      return l;
    });
    setLeads(updated); setFollowUpNotes(""); setNextFollowUpDate("");
    triggerToastAlert("Follow-up successfully logged into client file dossier.");
  };

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
      ...newLeadForm, id: Date.now(), branch: currentUser.role === "Admin" ? "Madurai Desk" : currentUser.branch,
      dateCreated: TODAY_STR, lastFollowUp: "None", nextFollowUp: TODAY_STR,
      bookingUnit: "", bookingAmount: 0, bookingMode: "", bookingDate: "", regPending: false, regCompleted: false,
      history: [{ date: TODAY_STR, by: currentUser.name, action: "Lead Ingested." }]
    };
    setLeads([created, ...leads]); setIsLeadModalOpen(false);
    setNewLeadForm({ name: "", phone: "", altPhone: "", email: "", location: "", project: "Vishal Virinchi Apartments", budget: 65, source: "Website", assignedTo: "Unassigned", notes: "" });
    triggerToastAlert("New customer workflow profile captured cleanly.");
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    const created = { ...newUserForm, id: Date.now(), avatar: newUserForm.name[0], active: true };
    setUsers([...users, created]); setIsUserModalOpen(false);
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    setUsers(users.map(u => u.id === editingUser.id ? editingUser : u)); setEditingUser(null);
  };

  const handleDeleteUser = (id) => {
    if (id === currentUser.id) return;
    if (window.confirm("Delete account seat?")) setUsers(users.filter(u => u.id !== id));
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    const created = { ...newProjectForm, id: Date.now(), branch: "Madurai Desk", sold: 0, status: "Active" };
    setProjects([...projects, created]); setIsProjectModalOpen(false);
  };

  const commitSiteWalkthroughLog = () => {
    setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, status: "Site Visit Completed", history: [...l.history, { date: svDate, by: currentUser.name, action: `Visit Done. Notes: ${svFeedback}` }] } : l));
    setSelectedLead(null);
    triggerToastAlert("Site walkthrough registered successfully.");
  };

  const commitFinancialBookingLog = () => {
    setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, status: "Booking Confirmed", bookingUnit: bkUnit } : l));
    setSelectedLead(null);
    triggerToastAlert("Advance token payment captured.");
  };

  // REUSABLE SIDEBAR COMPONENT STRUCT
  const SidebarContent = () => (
    <>
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-gradient-to-tr from-orange-600 to-orange-500 flex items-center justify-center rounded-xl text-sm font-black text-white shadow-md">DD</div>
            <div className="leading-tight">
              <span className="font-black text-xs tracking-wider text-white block">DESAM</span>
              <span className="text-[9px] font-bold text-slate-400 tracking-widest block uppercase">DEVELOPERS</span>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          <button onClick={() => { setActiveTab("dashboard"); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${activeTab === "dashboard" ? "bg-orange-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
            <Layers className="h-4 w-4" /> VISUAL DASHBOARD
          </button>
          <button onClick={() => { setActiveTab("leads"); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${activeTab === "leads" ? "bg-orange-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
            <PhoneCall className="h-4 w-4" /> LEAD CHANNELS
          </button>
          <button onClick={() => { setActiveTab("projects"); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${activeTab === "projects" ? "bg-orange-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
            <Building2 className="h-4 w-4" /> PROJECT MASTER
          </button>
          {currentUser.role === "Admin" && (
            <button onClick={() => { setActiveTab("users"); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${activeTab === "users" ? "bg-orange-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              <Users className="h-4 w-4" /> SYSTEM CONTROL HUB
            </button>
          )}
          <button onClick={() => { setActiveTab("reports"); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${activeTab === "reports" ? "bg-orange-600 text-white shadow-lg" : "text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
            <BarChart3 className="h-4 w-4" /> MATRIX REPORTS
          </button>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-850">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-7 w-7 rounded-lg bg-orange-600 font-black text-xs flex items-center justify-center text-white flex-shrink-0">{currentUser.avatar}</div>
            <div className="truncate w-24">
              <p className="text-xs font-bold text-slate-200 truncate">{currentUser.name}</p>
              <p className="text-[9px] text-orange-400 font-black tracking-wider uppercase truncate">{currentUser.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-slate-500 hover:text-rose-400 transition-colors ml-1">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased text-slate-200">
        <div className="sm:mx-auto w-full max-w-md text-center space-y-3">
          <div className="h-12 w-12 bg-gradient-to-tr from-orange-600 to-orange-500 flex items-center justify-center rounded-2xl text-base font-black text-white shadow-xl mx-auto">DD</div>
          <h2 className="text-2xl font-black text-white tracking-wide uppercase">DESAM DEVELOPERS PVT LTD</h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secure Control Platform</p>
        </div>
        <div className="mt-6 sm:mx-auto w-full max-w-md px-4">
          <div className="bg-slate-950 py-8 px-6 border border-slate-800 rounded-2xl shadow-2xl space-y-6">
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold uppercase tracking-wide">Corporate Clearance Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500" placeholder="manager@iconic.in" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold uppercase tracking-wide">Passcode Clearance Key</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500" placeholder="••••••••" />
                </div>
              </div>
              {loginError && <p className="text-rose-400 font-bold bg-rose-500/10 p-2.5 rounded border border-rose-500/20">{loginError}</p>}
              <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white font-black py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-lg">Authorize Clearance</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans antialiased overflow-hidden relative">
      
      <aside className="hidden lg:flex w-64 bg-slate-950 border-r border-slate-800 flex-col justify-between h-full flex-shrink-0">
        <SidebarContent />
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
          <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between h-full animate-slideRight">
            <SidebarContent />
          </aside>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 lg:px-8 z-10 gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800 text-slate-200 transition-colors">
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative w-48 sm:w-80 hidden sm:block">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input type="text" value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} placeholder="Live context query filtering search..." className="w-full bg-slate-900 border border-slate-850 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500" />
            </div>
          </div>
          
          <div className="text-xs text-slate-300 font-bold bg-slate-900 px-3 sm:px-4 py-2 border border-slate-800 rounded-xl shadow-inner truncate max-w-[200px] sm:max-w-none">
            Welcome, <span className="text-orange-400 font-black">{currentUser.name}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 w-full">
          
          {/* VIEWPORT 1: VISUAL DASHBOARD SUMMARY STATS */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950 p-6 border border-slate-800 rounded-2xl">
                <div>
                  <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">Team Operations Center</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time analytical graphs mapping team conversions across your allocated team branch.</p>
                </div>
                
                {dailyFollowUpLeads.length > 0 && (
                  <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 px-4 py-3 rounded-xl">
                    <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-black text-amber-400 uppercase tracking-wide">New Inbound Leads Pending</p>
                      <p className="text-[11px] text-slate-300 font-mono font-bold">{dailyFollowUpLeads.length} items require delegation steps.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* UNASSIGNED DIRECT DEPLOYMENT DESK */}
              {dailyFollowUpLeads.length > 0 && (
                <div className="bg-slate-950 border border-amber-500/20 rounded-2xl p-4 lg:p-6 space-y-4">
                  <h2 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2"><Bell className="h-4 w-4" /> DIRECT DEPLOYMENT DESK</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dailyFollowUpLeads.map(l => (
                      <div key={l.id} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-white text-sm cursor-pointer hover:text-orange-400 transition-all" onClick={() => setSelectedLead(l)}>{l.name}</h4>
                            <span className="text-[9px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded font-mono font-bold">{l.source}</span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono mt-1">{l.phone} • {l.project}</p>
                        </div>
                        <button onClick={() => setSelectedLead(l)} className="w-full bg-orange-600/10 hover:bg-orange-600 border border-orange-500/20 text-[10px] text-orange-400 hover:text-white font-black py-1.5 rounded-lg tracking-wide uppercase transition-all">
                          ⚡ Assign to Executive
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Total Pipeline Count <Briefcase className="h-4 w-4 text-orange-400" /></p>
                  <p className="text-3xl font-black text-white mt-1">{processedLeads.length}</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Confirmed Conversions <CheckCircle2 className="h-4 w-4 text-emerald-400" /></p>
                  <p className="text-3xl font-black text-emerald-400 mt-1">{processedLeads.filter(l => ["Booking Confirmed","Closed"].includes(l.status)).length}</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Pipeline Capital Value <DollarSign className="h-4 w-4 text-orange-400" /></p>
                  <p className="text-3xl font-black text-white mt-1">₹{processedLeads.reduce((a,c)=>a+c.budget, 0)}L</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Visits Completed <Calendar className="h-4 w-4 text-amber-400" /></p>
                  <p className="text-3xl font-black text-amber-400 mt-1">{processedLeads.filter(l => l.status === "Site Visit Planned").length}</p>
                </div>
              </div>

              {/* GRAPHS CHARTS SUBGRID PLOTS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-orange-500" /> Milestone Weight (Bar Chart)</h3>
                  <div className="space-y-4">
                    {["New", "Assigned", "Contacted", "Booking Confirmed"].map(st => {
                      const shareCount = processedLeads.filter(l => l.status === st).length;
                      const pct = Math.min((shareCount / Math.max(processedLeads.length, 1)) * 100, 100);
                      return (
                        <div key={st} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold text-slate-400"><span>{st}</span><span className="font-mono">{shareCount} accounts</span></div>
                          <div className="w-full bg-slate-900 h-6 border border-slate-850 rounded-lg overflow-hidden relative flex items-center">
                            <div className="bg-gradient-to-r from-orange-600 to-orange-500 h-full" style={{ width: `${pct || 3}%` }}></div>
                            <span className="absolute left-2 text-[10px] font-mono font-black text-white">{Math.round(pct)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-emerald-400" /> Attribution Share (Pie Chart)</h3>
                    <div className="flex justify-center items-center py-4">
                      <div className="h-28 w-28 rounded-full border border-slate-800 shadow-xl relative" style={{ background: "conic-gradient(#ea580c 0% 45%, #10b981 45% 75%, #3b82f6 75% 100%)" }}>
                        <div className="absolute inset-7 bg-slate-950 rounded-full border border-slate-900 flex items-center justify-center text-[10px] font-mono font-black text-slate-400">CHANNELS</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-400 border-t border-slate-900 pt-3">
                    <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-orange-600"></div> Website (45%)</div>
                    <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-emerald-500"></div> Meta Ads (30%)</div>
                    <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-blue-500"></div> Google Ads (25%)</div>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2"><Clock className="h-4 w-4 text-orange-400" /> Progress Curve (Line Chart)</h3>
                    <div className="h-28 flex items-end justify-between gap-2 border-b border-l border-slate-850 px-2 pb-1 font-mono">
                      <div className="w-full flex flex-col items-center gap-1">
                        <div className="w-1.5 bg-orange-500 h-14 rounded-t relative group"></div>
                        <span className="text-[8px] text-slate-500 font-bold uppercase">Mar</span>
                      </div>
                      <div className="w-full flex flex-col items-center gap-1">
                        <div className="w-1.5 bg-orange-500 h-20 rounded-t relative group"></div>
                        <span className="text-[8px] text-slate-500 font-bold uppercase">Apr</span>
                      </div>
                      <div className="w-full flex flex-col items-center gap-1">
                        <div className="w-1.5 bg-gradient-to-t from-orange-600 to-orange-500 h-24 rounded-t relative group"></div>
                        <span className="text-[8px] text-orange-400 font-black uppercase">May</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEWPORT 2: LEAD TRACKING ROWS CHANNEL MASTER */}
          {activeTab === "leads" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Active Team Lead Channels</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Managers assign inbound project requests directly to their specialized field executive agents here.</p>
                </div>
                <button onClick={() => setIsLeadModalOpen(true)} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-black px-4 py-2 rounded-xl text-xs transition-colors shadow-md w-fit">
                  <Plus className="h-4 w-4" /> INGEST RECORD
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl w-full">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="p-4 min-w-[150px]">Customer Contact Info</th>
                        <th className="p-4 min-w-[150px]">Project Context Scope</th>
                        <th className="p-4">Source</th>
                        <th className="p-4 min-w-[160px]">Team Executive Assignment Gate</th>
                        <th className="p-4">Pipeline Phase Milestone</th>
                        <th className="p-4 text-right">Target Budget</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {processedLeads.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-12 text-center text-slate-500 font-semibold italic">No active profiles inside tracking query bounds.</td>
                        </tr>
                      ) : (
                        processedLeads.map(l => (
                          <tr key={l.id} className="hover:bg-slate-900/30 transition-all">
                            <td className="p-4">
                              <p className="font-bold text-white text-sm cursor-pointer hover:text-orange-400 transition-colors" onClick={() => setSelectedLead(l)}>{l.name}</p>
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
                                <select value={l.assignedTo} onChange={(e) => requestOwnerAssignmentPopup(l.id, e.target.value)} className="bg-slate-900 border border-slate-800 text-slate-200 rounded px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-orange-500 cursor-pointer max-w-[150px]">
                                  <option value="Unassigned">⚠️ Select Executive</option>
                                  {visibleUsers.filter(u => ["Executive", "Telecaller"].includes(u.role)).map(u => (
                                    <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                                  ))}
                                </select>
                              ) : (
                                <span className="font-semibold text-slate-400 flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-slate-600" /> {l.assignedTo}</span>
                              )}
                            </td>

                            <td className="p-4">
                              <select value={l.status} onChange={(e) => requestStatusTransitionPopup(l.id, e.target.value)} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 font-bold text-xs text-slate-300 focus:outline-none cursor-pointer" style={{ color: SC[l.status]?.text || "#FFF" }}>
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

          {/* VIEWPORT 3: PROJECTS MASTER INVENTORIES */}
          {activeTab === "projects" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Corporate Asset Master Registry</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Track property inventory capacity volumes mapped across regional team scopes.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleProjects.map(p => (
                  <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-black text-white">{p.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3 text-slate-600" /> {p.location} • <span className="font-bold text-orange-400">{p.branch} ({TEAMS_REGISTRY[p.branch] || "Unassigned team"})</span></p>
                      </div>
                      <span className="text-[10px] font-black bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded uppercase tracking-wider">{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEWPORT 4: ADMIN SPREADSHEET IMPORTERS CONSOLE */}
          {activeTab === "users" && currentUser.role === "Admin" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="bg-slate-950 border border-orange-500/20 rounded-2xl p-4 lg:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black text-white flex items-center gap-2"><Upload className="h-4 w-4 text-orange-500" /> SpreadSheet Data Ingestion Engine</h3>
                    <p className="text-xs text-slate-400">Import hundreds of leads directly via copying and pasting columns from Microsoft Excel/CSV.</p>
                  </div>
                  <button onClick={() => setShowImportWizard(!showImportWizard)} className="flex items-center gap-1.5 border border-slate-800 hover:border-slate-700 bg-slate-900 px-3 py-1.5 rounded-xl text-xs font-bold font-mono text-slate-300 transition-all w-fit">
                    <Info className="h-4 w-4" /> {showImportWizard ? "Hide Guide" : "Show Blueprint"}
                  </button>
                </div>

                {showImportWizard && (
                  <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl space-y-3 text-xs text-slate-300 animate-fadeIn">
                    <p className="font-bold text-orange-400 flex items-center gap-1"><FileSpreadsheet className="h-4 w-4" /> Mandatory Tab-Separated Spreadsheet Columns Layout Order:</p>
                    <div className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-slate-400 border border-slate-850 overflow-x-auto whitespace-nowrap">
                      Client Name [TAB] Mobile Phone [TAB] Corporate Email [TAB] Target Project [TAB] Location [TAB] Budget Number [TAB] Source Channel
                    </div>
                  </div>
                )}

                <form onSubmit={handleDataImportSubmit} className="space-y-3">
                  <textarea rows={3} value={importText} onChange={(e)=>setImportText(e.target.value)} placeholder="Paste Excel/CSV table content grid in here..." className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-mono" />
                  <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md w-fit">
                    <Upload className="h-4 w-4" /> Deploy Spreadsheet Ingestion
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* VIEWPORT 5: CALENDAR REPORT ENGINES MATRIX */}
          {activeTab === "reports" && (
            <div className="space-y-6 animate-fadeIn w-full">
              <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4 w-full">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Performance Matrix Engine</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Isolate historical metrics and execute clean downstream file downloads instantly.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-2 border border-slate-800 rounded-xl shadow-lg w-fit">
                  <span className="text-[9px] font-black tracking-wider text-slate-500 uppercase px-2">Export Scope:</span>
                  <button onClick={() => exportDataPipeline("excel")} className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded text-[11px] font-mono transition-all"><Download className="h-3.5 w-3.5 text-emerald-500" /> XLS</button>
                  <button onClick={() => exportDataPipeline("csv")} className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded text-[11px] font-mono transition-all"><Download className="h-3.5 w-3.5 text-sky-400" /> CSV</button>
                  <button onClick={() => exportDataPipeline("pdf")} className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded text-[11px] font-mono transition-all"><Download className="h-3.5 w-3.5 text-rose-400" /> PDF</button>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-4 lg:p-5 rounded-xl space-y-4 text-xs w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
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

                <div className="border-t border-slate-900 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px] flex justify-between items-center">
                      Chronological From Date
                      {startDate && <button onClick={()=>setStartDate("")} className="text-orange-400 hover:text-rose-400 font-bold flex items-center gap-0.5 font-mono text-[9px] uppercase"><X className="h-3 w-3" /> Clear</button>}
                    </label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-orange-500 font-mono cursor-pointer" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px] flex justify-between items-center">
                      Chronological To Date
                      {endDate && <button onClick={()=>setEndDate("")} className="text-orange-400 hover:text-rose-400 font-bold flex items-center gap-0.5 font-mono text-[9px] uppercase"><X className="h-3 w-3" /> Clear</button>}
                    </label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-orange-500 font-mono cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-xl w-full">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-slate-500 font-bold border-b border-slate-900 uppercase">
                        <th className="pb-2 min-w-[140px]">Client Entity</th>
                        <th className="pb-2 min-w-[140px]">Target Scheme</th>
                        <th className="pb-2">Channel Origin</th>
                        <th className="pb-2">Assigned Agent</th>
                        <th className="pb-2">Pipeline Phase</th>
                        <th className="pb-2 text-right">Budget Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {processedLeads.map(l => (
                        <tr key={l.id} className="hover:bg-slate-900/20">
                          <td className="py-3 font-bold text-white cursor-pointer hover:text-orange-400" onClick={() => setSelectedLead(l)}>
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

      {/* TOAST SYSTEM POPUPS MODALS */}
      {customPopup.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl text-center">
            <div className="h-12 w-12 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-black text-white tracking-wide uppercase">{customPopup.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">{customPopup.message}</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs uppercase font-black tracking-wider">
              <button onClick={() => setCustomPopup({ isOpen: false, leadId: null, targetValue: "", type: "status", title: "", message: "" })} className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white py-2.5 rounded-xl transition-all">✕ Discard</button>
              <button onClick={confirmCustomPopupAction} className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white py-2.5 rounded-xl transition-all shadow-md">✓ Confirm Action</button>
            </div>
          </div>
        </div>
      )}

      {toastNotification.isVisible && (
        <div className="fixed bottom-6 right-6 bg-slate-950 border border-emerald-500/40 text-emerald-400 font-bold px-4 py-3 rounded-xl shadow-2xl z-[110] flex items-center gap-2 text-xs animate-fadeIn uppercase tracking-wide">
          <div className="h-5 w-5 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center"><Check className="h-3 w-3" /></div>
          {toastNotification.message}
        </div>
      )}

      {/* ─── ROLE ACCESS ADAPTIVE INTERACTION SWITCH CONTAINER GATEWAY ─── */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setSelectedLead(null)}>
          <div className="bg-slate-950 border border-slate-800 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 space-y-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            
            <div className="border-b border-slate-900 pb-3 flex justify-between items-start">
              <div className="space-y-0.5">
                <span className="text-[10px] bg-orange-600 font-mono font-black px-2 py-0.5 rounded text-white uppercase tracking-wider">
                  {currentUser.role === "Manager" ? "Direct Assignment Hub" : "Executive Workspace Portfolio"}
                </span>
                <h3 className="text-base font-black text-white">{selectedLead.name}</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedLead.phone} • {selectedLead.email || "No email logged"}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-slate-500 hover:text-white font-bold text-sm">✕</button>
            </div>

            {/* CASE A: LOGGED PRIVILEGE IS A MANAGER ➔ DISPLAY ONLY ASSIGNMENT GATES */}
            {currentUser.role === "Manager" ? (
              <div className="space-y-2 text-xs">
                <label className="text-slate-400 font-bold uppercase tracking-wide">Select Team Member to Delegate Ownership</label>
                <select value={selectedLead.assignedTo} onChange={(e) => requestOwnerAssignmentPopup(selectedLead.id, e.target.value)} className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-orange-500 cursor-pointer">
                  <option value="Unassigned">⚠️ Choose Active Field Executive</option>
                  {visibleUsers.filter(u => ["Executive", "Telecaller"].includes(u.role)).map(u => (
                    <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 italic pt-1">Assigning a team member immediately removes this lead from your dashboard queue list.</p>
              </div>
            ) : (
              
              /* CASE B: LOGGED PRIVILEGE IS AN EXECUTIVE/TELECALLER ➔ DISPLAY THE DETAILED UPDATE DOSSIER PANEL */
              <div className="space-y-5 text-xs">
                <div className="bg-slate-900 p-4 border border-slate-850 rounded-xl grid grid-cols-2 gap-4 font-semibold text-slate-300">
                  <div><p className="text-slate-500 text-[10px] font-bold uppercase">Project Context</p><p className="text-white mt-0.5 font-bold">{selectedLead.project}</p></div>
                  <div><p className="text-slate-500 text-[10px] font-bold uppercase">Current Track Status</p><p className="text-orange-400 mt-0.5 font-bold">{selectedLead.status}</p></div>
                  <div className="col-span-2"><p className="text-slate-500 text-[10px] font-bold uppercase">Assigned Inbound Client Notes</p><p className="text-slate-300 font-normal mt-0.5 italic">"{selectedLead.notes || 'No standard entry logs added yet.'}"</p></div>
                </div>

                {/* INTERACTION FOLLOWUP REPORT LOGGER */}
                <form onSubmit={commitManualFollowUpReport} className="bg-slate-900/50 p-4 border border-slate-850 rounded-xl space-y-3">
                  <p className="text-[11px] font-black uppercase text-orange-400 tracking-wider">Log Conversation Timeline History</p>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium text-[10px]">Follow-up Summary Notes *</label>
                    <textarea rows={2} required value={followUpNotes} onChange={(e)=>setFollowUpNotes(e.target.value)} placeholder="Type conversation outcomes completely..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium text-[10px]">Slated Next Interaction Date *</label>
                    <input type="date" required min={TODAY_STR} value={nextFollowUpDate} onChange={(e)=>setNextFollowUpDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:outline-none font-mono cursor-pointer" />
                  </div>
                  <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-2 rounded-xl text-xs uppercase tracking-wider transition-all">Write Workflow Entry</button>
                </form>

                {/* SITE VISIT TIMELINE MARKERS */}
                <div className="bg-slate-900/50 p-4 border border-slate-850 rounded-xl space-y-3">
                  <p className="text-[11px] font-black uppercase text-amber-400 tracking-wider">Verify Physical Site Walkthrough</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1"><label className="text-slate-400 text-[10px]">Tour Date</label><input type="date" value={svDate} onChange={(e)=>setSvDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200 font-mono" /></div>
                    <div className="space-y-1"><label className="text-slate-400 text-[10px]">Attended Family Co-Buyers</label><input type="text" value={svFamily} onChange={(e)=>setSvFamily(e.target.value)} placeholder=" Spouse" className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200" /></div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 text-[10px]">Site Walkthrough Feedback Notes *</label>
                    <textarea rows={1} value={svFeedback} onChange={(e)=>setSvFeedback(e.target.value)} placeholder="Enter design layout likes/dislikes parameters..." className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none" />
                  </div>
                  <button type="button" onClick={commitSiteWalkthroughLog} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 rounded-xl uppercase tracking-wider">Commit Walkthrough Verification</button>
                </div>

                {/* ADVANCE BOOKING TOKEN CAPTURE INGESTIONS */}
                <div className="bg-slate-900/50 p-4 border border-slate-850 rounded-xl space-y-3">
                  <p className="text-[11px] font-black uppercase text-emerald-400 tracking-wider">Secure Advance Token Booking Ingestion</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1"><label className="text-slate-400 text-[10px]">Unit Code Designation *</label><input type="text" value={bkUnit} onChange={(e)=>setBkUnit(e.target.value)} placeholder="e.g. Apartment A-402" className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200" /></div>
                    <div className="space-y-1"><label className="text-slate-400 text-[10px]">Token Amount Cleared (₹) *</label><input type="number" value={bkAmount} onChange={(e)=>setBkAmount(e.target.value)} placeholder="INR Value" className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-emerald-400 font-bold focus:outline-none" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-slate-400 text-[10px]">Settlement Method</label>
                      <select value={bkMode} onChange={(e)=>setBkMode(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-300 focus:outline-none">
                        <option value="Cheque">Bank Cheque</option><option value="Wire Transfer">NEFT / RTGS Wire</option>
                      </select>
                    </div>
                    <div className="space-y-1"><label className="text-slate-400 text-[10px]">Payment Date</label><input type="date" value={bkDate} onChange={(e)=>setBkDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200 font-mono" /></div>
                  </div>
                  <button type="button" onClick={commitFinancialBookingLog} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-1.5 rounded-xl uppercase tracking-wider">Secure Unit Allocation Ledger</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DIALOG NEW INGEST CAPTURE PORTALS */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
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
              
              {/* OPTIONAL EMAIL LOG MATRIX FIELD */}
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Email Contact Parameters <span className="text-slate-500 text-[10px] italic">(Optional Entry Row)</span></label>
                <input type="email" value={newLeadForm.email} onChange={(e)=>setNewLeadForm({...newLeadForm, email: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 focus:outline-none" placeholder="client@domain.com" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Location Zone</label>
                  <input type="text" value={newLeadForm.location} onChange={(e)=>setNewLeadForm({...newLeadForm, location: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Target Project</label>
                  <select value={newLeadForm.project} onChange={(e)=>setNewLeadForm({...newLeadForm, project: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-300 focus:outline-none">
                    {visibleProjects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white font-black py-3 rounded-xl uppercase tracking-wider shadow-lg transition-all">Commit Ingest Record</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
