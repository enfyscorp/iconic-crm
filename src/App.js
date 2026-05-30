import React, { useState, useMemo } from "react";
import { 
  Users, ShieldAlert, BarChart3, Building2, Briefcase, 
  Layers, PhoneCall, Calendar, Search, Plus, TrendingUp, 
  DollarSign, MapPin, Shield, Clock, LogOut, Lock, 
  Mail, CheckCircle2, UserPlus, Trash2, Edit2, X, Bell, 
  AlertTriangle, Download, Upload, Info, FileSpreadsheet, Check,
  Menu, ArrowRight
} from "lucide-react";

// ─── AUTHENTIC DESAM BRANDING EMBEDDED DATA STRING ────────────────────────
const DESAM_LOGO_ASSET = "data:image/png;base64,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ळे header context ───
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
  { id: 101, name: "Arjun Sharma", email: "admin@desam.in", pass: "admin123", role: "Admin", branch: "All Branches", phone: "9840000001", active: true, avatar: "A" },
  { id: 102, name: "Jibril", email: "jibril@desam.in", pass: "manager123", role: "Manager", branch: "Madurai Desk", phone: "9840000002", active: true, avatar: "J" },
  { id: 103, name: "AryaLakshmi", email: "aryalakshmi@desam.in", pass: "manager123", role: "Manager", branch: "Chennai South", phone: "9840000003", active: true, avatar: "A" },
  { id: 104, name: "Rohini", email: "rohini@desam.in", pass: "agent123", role: "Executive", branch: "Madurai Desk", phone: "9840000004", active: true, avatar: "R" },
  { id: 105, name: "Priyadarshini", email: "priya@desam.in", pass: "agent123", role: "Executive", branch: "Madurai Desk", phone: "9840000005", active: true, avatar: "P" },
  { id: 106, name: "Arun", email: "arun@desam.in", pass: "agent123", role: "Executive", branch: "Chennai South", phone: "9840000006", active: true, avatar: "A" },
  { id: 107, name: "Sumathi", email: "sumathi@desam.in", pass: "caller123", role: "Telecaller", branch: "Madurai Desk", phone: "9840000007", active: true, avatar: "S" },
  { id: 108, name: "Shakila", email: "shakila@desam.in", pass: "caller123", role: "Telecaller", branch: "Madurai Desk", phone: "9840000008", active: true, avatar: "S" },
  { id: 109, name: "Gowshika", email: "gowshika@desam.in", pass: "caller123", role: "Telecaller", branch: "Chennai South", phone: "9840000009", active: true, avatar: "G" },
];

const INITIAL_PROJECTS = [
  { id: 1, name: "Desam Garden", location: "Madurai Bypass", branch: "Madurai Desk", type: "Plot", price: 25, units: 80, sold: 15, status: "Active" },
  { id: 2, name: "Fairland", location: "Uthangudi, Madurai", branch: "Madurai Desk", type: "Villa", price: 95, units: 35, sold: 8, status: "Active" },
  { id: 3, name: "Vishal Virinchi", location: "Bypass Road, Madurai", branch: "Madurai Desk", type: "Apartment", price: 65, units: 10, sold: 2, status: "Active" },
  { id: 4, name: "GK Apartments", location: "Velachery, Chennai", branch: "Chennai South", type: "Apartment", price: 85, units: 120, sold: 45, status: "Active" },
  { id: 5, name: "Anbu Desam", location: "Saravanampatti, CBE", branch: "Coimbatore", type: "Villa", price: 140, units: 40, sold: 12, status: "Pre-launch" },
];

const INITIAL_LEADS = [
  { id: 1001, name: "Suresh Kumar", phone: "9840011234", altPhone: "9840011235", email: "suresh@gmail.com", location: "Madurai", branch: "Madurai Desk", project: "Vishal Virinchi", budget: 65, source: "Website", assignedTo: "Rohini", assignedByRole: "Manager", status: "Interested", notes: "Prefers higher floors.", dateCreated: "2026-05-10", lastFollowUp: "2026-05-25", nextFollowUp: "2026-05-29", history: [{ date: "2026-05-25", by: "Rohini", action: "Follow-up conversation done. Discussing financing pathways and bank loan eligibility matrices." }, { date: "2026-05-15", by: "Sumathi", action: "Called client. Expressed keen interest in structural layouts. Requested site layout blueprints via WhatsApp." }], bookingUnit: "", bookingAmount: 0, bookingMode: "", bookingDate: "", regPending: false, regCompleted: false },
  { id: 1002, name: "Lakshmi Rao", phone: "9940022345", altPhone: "", email: "lakshmi@yahoo.com", location: "Chennai", branch: "Chennai South", project: "GK Apartments", budget: 85, source: "Meta Ads", assignedTo: "Unassigned", assignedByRole: "", status: "New", notes: "Arranging transportation for family walkthrough.", dateCreated: "2026-05-12", lastFollowUp: "2026-05-28", nextFollowUp: "2026-05-29", history: [{ date: "2026-05-28", by: "System Master", action: "Initial lead automated validation complete." }], bookingUnit: "", bookingAmount: 0, bookingMode: "", bookingDate: "", regPending: false, regCompleted: false },
  { id: 1003, name: "Vijay Anand", phone: "9740033456", altPhone: "", email: "vijay@outlook.com", location: "Madurai", branch: "Madurai Desk", project: "Desam Garden", budget: 30, source: "Google Ads", assignedTo: "Jibril", assignedByRole: "Admin", status: "New", notes: "Premium corner plot structural interest.", dateCreated: "2026-05-29", lastFollowUp: "None", nextFollowUp: "2026-05-29", history: [{ date: "2026-05-29", by: "Arjun Sharma", action: "Admin deployed tracking parameters directly to Manager Jibril view queue." }], bookingUnit: "", bookingAmount: 0, bookingMode: "", bookingDate: "", regPending: false, regCompleted: false },
  { id: 1004, name: "Meena Selvam", phone: "9640044567", altPhone: "9640044568", email: "meena@gmail.com", location: "Madurai", branch: "Madurai Desk", project: "Fairland", budget: 95, source: "Walk-In", assignedTo: "Unassigned", assignedByRole: "", status: "New", notes: "Token collected cleanly.", dateCreated: "2026-04-20", lastFollowUp: "2026-05-20", nextFollowUp: "2026-05-29", history: [{ date: "2026-05-20", by: "Priyadarshini", action: "Initial walkthrough context established." }], bookingUnit: "Villa 12", bookingAmount: 500000, bookingMode: "Cheque", bookingDate: "2026-05-20", regPending: true, regCompleted: false },
];

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
  const [importText, setImportText] = useState("");
  const [showImportWizard, setShowImportWizard] = useState(false);

  const [customPopup, setCustomPopup] = useState({ isOpen: false, leadId: null, targetValue: "", type: "status", title: "", message: "" });
  const [toastNotification, setToastNotification] = useState({ isVisible: false, message: "" });

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  const [newLeadForm, setNewLeadForm] = useState({ name: "", phone: "", altPhone: "", email: "", location: "", project: "Desam Garden", budget: 25, source: "Website", assignedTo: "Unassigned", notes: "" });
  const [duplicateConflictRecord, setDuplicateConflictRecord] = useState(null); 

  const [followUpNotes, setFollowUpNotes] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");

  const [svDate, setSvDate] = useState("");
  const [svFeedback, setSvFeedback] = useState("");
  const [svFamily, setSvFamily] = useState("");

  const [bkUnit, setBkUnit] = useState("");
  const [bkAmount, setBkAmount] = useState("");

  // ─── UTILITY NORMALIZATION FUNCTION ───────────────────────────────────────
  const stripAndNormalizeContactDigits = (val) => {
    if (!val) return "";
    return val.toString().replace(/\s+/g, "").replace(/\D/g, "");
  };

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
    
    if (["Admin", "Manager"].includes(currentUser.role)) {
      if (filterExecutive !== "All") result = result.filter(l => l.assignedTo === filterExecutive);
    }

    if (startDate) result = result.filter(l => l.dateCreated >= startDate);
    if (endDate) result = result.filter(l => l.dateCreated <= endDate);

    return result;
  }, [leads, currentUser, globalSearch, filterSource, filterStatus, filterProject, filterExecutive, startDate, endDate]);

  const dashboardActionQueueLeads = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === "Admin") return leads.filter(l => l.assignedTo === "Unassigned");
    if (currentUser.role === "Manager") {
      return leads.filter(l => l.branch === currentUser.branch && (l.assignedTo === "Unassigned" || l.assignedTo === currentUser.name));
    }
    if (currentUser.role === "Executive" || currentUser.role === "Telecaller") {
      return leads.filter(l => l.assignedTo === currentUser.name);
    }
    return [];
  }, [leads, currentUser]);

  // ─── LIVE DUPLICATION VALIDATION LISTENER HOOK ────────────────────────────
  const handlePhoneInputChange = (inputRawValue, isAlternateField = false) => {
    const fullyCleanDigits = stripAndNormalizeContactDigits(inputRawValue);
    
    if (isAlternateField) {
      setNewLeadForm({ ...newLeadForm, altPhone: fullyCleanDigits });
    } else {
      setNewLeadForm({ ...newLeadForm, phone: fullyCleanDigits });
      
      if (fullyCleanDigits.length >= 10) {
        const matchedDuplicate = leads.find(l => stripAndNormalizeContactDigits(l.phone) === fullyCleanDigits);
        if (matchedDuplicate) {
          setDuplicateConflictRecord(matchedDuplicate);
          return;
        }
      }
      setDuplicateConflictRecord(null);
    }
  };

  const handleInlineMilestoneStatusChange = (leadId, targetStatus) => {
    const updatedHistoryLog = {
      date: TODAY_STR,
      by: currentUser.name,
      action: `INLINE MODIFIER: Transformed tracking milestone to [${targetStatus}].`
    };

    setLeads(leads.map(l => l.id === leadId ? {
      ...l,
      status: targetStatus,
      history: [updatedHistoryLog, ...l.history]
    } : l));

    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => ({
        ...prev,
        status: targetStatus,
        history: [updatedHistoryLog, ...prev.history]
      }));
    }
    triggerToastAlert(`Milestone set to ${targetStatus}`);
  };

  // ─── GENERAL OPERATIONS HANDLERS ──────────────────────────────────────────
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
      setLoginError("Invalid profile matching credential set.");
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
      message: `Are you sure you want to transition "${target.name}" to the "${nextStatus}" track?`
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
      message: `Delegate tracking parameters for client "${target.name}" to team member "${personnelName}"?`
    });
  };

  const confirmCustomPopupAction = () => {
    const { leadId, targetValue, type } = customPopup;
    if (type === "status") {
      setLeads(leads.map(l => l.id === leadId ? {
        ...l, status: targetValue,
        history: [{ date: TODAY_STR, by: currentUser.name, action: `Milestone status shifted manually to: ${targetValue}` }, ...l.history]
      } : l));
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: targetValue, history: [{ date: TODAY_STR, by: currentUser.name, action: `Milestone status shifted manually to: ${targetValue}` }, ...selectedLead.history] });
      }
      triggerToastAlert("Pipeline status successfully updated.");
    } else if (type === "assign") {
      setLeads(leads.map(l => l.id === leadId ? {
        ...l, 
        assignedTo: targetValue, 
        assignedByRole: currentUser.role, 
        status: targetValue === "Unassigned" ? "New" : "Assigned",
        history: [{ date: TODAY_STR, by: currentUser.name, action: `Routed lead to team desk: ${targetValue} (${currentUser.role})` }, ...l.history]
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
          const parsedPhone = stripAndNormalizeContactDigits(columns[1] || "00000");
          newlyIngestedLeads.push({
            id: Date.now() + Math.floor(Math.random() * 10000),
            name: columns[0] || "Spreadsheet Lead",
            phone: parsedPhone,
            email: columns[2] || "",
            project: columns[3] || "Vishal Virinchi",
            location: columns[4] || "Inbound",
            budget: parseInt(columns[5]) || 65,
            source: columns[6] || "Website",
            assignedTo: "Unassigned",
            assignedByRole: "",
            status: "New",
            branch: branchHome, 
            dateCreated: TODAY_STR,
            lastFollowUp: "None",
            nextFollowUp: TODAY_STR,
            history: [{ date: TODAY_STR, by: currentUser.name, action: "Ingested via Excel copy-paste system matrix." }]
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

  const commitManualFollowUpReport = (e) => {
    e.preventDefault();
    if (!followUpNotes.trim() || !nextFollowUpDate) return;
    const updated = leads.map(l => {
      if (l.id === selectedLead.id) {
        const obj = {
          ...l, 
          status: "Contacted", 
          lastFollowUp: TODAY_STR, 
          nextFollowUp: nextFollowUpDate,
          history: [{ date: TODAY_STR, by: currentUser.name, action: `FOLLOW-UP LOG ENTRY: ${followUpNotes.trim()} (Next: ${nextFollowUpDate})` }, ...l.history]
        };
        setSelectedLead(obj);
        return obj;
      }
      return l;
    });
    setLeads(updated); setFollowUpNotes(""); setNextFollowUpDate("");
    triggerToastAlert("Follow-up log successfully written.");
  };

  const handleCreateLead = (e) => {
    e.preventDefault();
    const finalizedCleanPhone = stripAndNormalizeContactDigits(newLeadForm.phone);
    const databaseDoubleCheck = leads.find(l => stripAndNormalizeContactDigits(l.phone) === finalizedCleanPhone);
    
    if (databaseDoubleCheck) {
      setDuplicateConflictRecord(databaseDoubleCheck);
      return;
    }

    const created = {
      ...newLeadForm,
      id: Date.now(),
      phone: finalizedCleanPhone,
      altPhone: stripAndNormalizeContactDigits(newLeadForm.altPhone),
      branch: currentUser.role === "Admin" ? "Madurai Desk" : currentUser.branch,
      dateCreated: TODAY_STR, lastFollowUp: "None", nextFollowUp: TODAY_STR, assignedByRole: "",
      bookingUnit: "", bookingAmount: 0, bookingMode: "", bookingDate: "", regPending: false, regCompleted: false,
      history: [{ date: TODAY_STR, by: currentUser.name, action: "Lead Record Captured cleanly without internal spacing vectors." }]
    };
    
    setLeads([created, ...leads]); 
    setIsLeadModalOpen(false);
    setNewLeadForm({ name: "", phone: "", altPhone: "", email: "", location: "", project: "Desam Garden", budget: 25, source: "Website", assignedTo: "Unassigned", notes: "" });
    triggerToastAlert("New customer captured cleanly.");
  };

  const commitSiteWalkthroughLog = () => {
    setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, status: "Site Visit Completed", history: [{ date: svDate, by: currentUser.name, action: `SITE WALKTHROUGH CONFIRMED: Completed walkthrough. Feedback notes: ${svFeedback}` }, ...l.history] } : l));
    setSelectedLead(null);
    triggerToastAlert("Site walkthrough registered successfully.");
  };

  const commitFinancialBookingLog = () => {
    setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, status: "Booking Confirmed", bookingUnit: bkUnit, history: [{ date: TODAY_STR, by: currentUser.name, action: `ADVANCE SECURED: Allocated block unit [${bkUnit}].` }, ...l.history] } : l));
    setSelectedLead(null);
    triggerToastAlert("Advance token payment captured.");
  };

  const SidebarContent = () => (
    <>
      <div>
        <div className="h-16 flex items-center px-4 border-b border-slate-800 bg-slate-950">
          <img 
            src={DESAM_LOGO_ASSET} 
            alt="Desam Developers Pvt Ltd" 
            className="h-10 w-auto object-contain max-w-[210px]" 
          />
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

  // ─── LOGIN SCREEN (FIXED ENTIRELY FOR CHARACTERS SUBMISSION) ─────────────
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased text-slate-200">
        <div className="sm:mx-auto w-full max-w-md text-center space-y-4">
          <div className="flex justify-center mb-2">
            <img 
              src={DESAM_LOGO_ASSET} 
              alt="Desam Developers Logo" 
              className="h-16 w-auto object-contain drop-shadow-lg" 
            />
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secure Operational Control Platform</p>
        </div>
        <div className="mt-6 sm:mx-auto w-full max-w-md px-4">
          <div className="bg-slate-950 py-8 px-6 border border-slate-800 rounded-2xl shadow-2xl space-y-6">
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold uppercase tracking-wide">Username</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input 
                    type="text" 
                    required 
                    value={loginEmail} 
                    onChange={(e) => setLoginEmail(e.target.value)} 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500" 
                    placeholder="Enter Username" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold uppercase tracking-wide">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input 
                    type="password" 
                    required 
                    value={loginPassword} 
                    onChange={(e) => setLoginPassword(e.target.value)} 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>

              {loginError && <p className="text-rose-400 font-bold bg-rose-500/10 p-2.5 rounded border border-rose-500/20">{loginError}</p>}
              <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white font-black py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-lg">Authorize Access</button>
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
          <aside className="w-64 bg-slate-950 border-r border-slate-800 flex-col justify-between h-full animate-slideRight flex">
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
              <input type="text" value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} placeholder="Live context query filtering search..." className="w-full bg-slate-900 border border-slate-855 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500" />
            </div>
          </div>
          
          <div className="text-xs text-slate-300 font-bold bg-slate-900 px-3 sm:px-4 py-2 border border-slate-800 rounded-xl shadow-inner truncate max-w-[200px] sm:max-w-none">
            Welcome, <span className="text-orange-400 font-black">{currentUser.name}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 w-full">
          
          {/* VIEWPORT 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950 p-6 border border-slate-800 rounded-2xl">
                <div>
                  <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">Team Operations Center</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time active workspace dashboard engine processing routed requests.</p>
                </div>
              </div>

              {/* DYNAMIC ACTION DESK */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 lg:p-6 space-y-4">
                <h2 className="text-xs font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                  <Bell className="h-4 w-4" /> 
                  {currentUser.role === "Executive" || currentUser.role === "Telecaller" ? "MY ACTIVE PIPELINE TASKS" : "DIRECT INBOUND DEPLOYMENT QUEUE"}
                </h2>
                
                {dashboardActionQueueLeads.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dashboardActionQueueLeads.map(l => (
                      <div key={l.id} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-3 relative overflow-hidden">
                        
                        {l.assignedByRole === "Admin" && currentUser.role === "Manager" && (
                          <div className="absolute top-0 right-0 bg-rose-600 text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded-bl text-white animate-pulse">
                            ⭐ Admin Priority
                          </div>
                        )}

                        <div>
                          <div className="flex justify-between items-start pr-16">
                            <h4 className="font-bold text-white text-sm cursor-pointer hover:text-orange-400 transition-all" onClick={() => setSelectedLead(l)}>{l.name}</h4>
                            <span className="text-[9px] bg-slate-950 border border-slate-850 text-slate-400 px-2 py-0.5 rounded font-mono font-bold">{l.source}</span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono mt-1">{l.phone}</p>
                          <p className="text-[11px] font-semibold text-orange-400 mt-0.5">{l.project}</p>
                          <div className="mt-2 flex gap-1.5 items-center">
                            <span className="text-[9px] px-2 py-0.5 font-bold uppercase rounded" style={{ backgroundColor: SC[l.status]?.bg || "rgba(255,255,255,0.05)", color: SC[l.status]?.text || "#FFF" }}>
                              {l.status}
                            </span>
                          </div>
                        </div>
                        
                        <button onClick={() => setSelectedLead(l)} className="w-full bg-orange-600/10 hover:bg-orange-600 border border-orange-500/20 text-[10px] text-orange-400 hover:text-white font-black py-1.5 rounded-lg tracking-wide uppercase transition-all">
                          {["Manager", "Admin"].includes(currentUser.role) ? "⚡ Delegate Out" : "📝 Open Workspace File"}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic p-4 bg-slate-900/40 rounded-xl border border-slate-900">Your visual dashboard deployment list is clean.</p>
                )}
              </div>

              {/* CORE METRIC TILES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Scoped Pipelines <Briefcase className="h-4 w-4 text-orange-400" /></p>
                  <p className="text-3xl font-black text-white mt-1">{processedLeads.length}</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Confirmed Conversions <CheckCircle2 className="h-4 w-4 text-emerald-400" /></p>
                  <p className="text-3xl font-black text-emerald-400 mt-1">{processedLeads.filter(l => ["Booking Confirmed","Closed"].includes(l.status)).length}</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Capitalized Volume <DollarSign className="h-4 w-4 text-orange-400" /></p>
                  <p className="text-3xl font-black text-white mt-1">₹{processedLeads.reduce((a,c)=>a+c.budget, 0)}L</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Site Visits Done <Calendar className="h-4 w-4 text-amber-400" /></p>
                  <p className="text-3xl font-black text-amber-400 mt-1">{processedLeads.filter(l => l.status === "Site Visit Completed").length}</p>
                </div>
              </div>
            </div>
          )}

          {/* VIEWPORT 2: LEAD TRACKING ROWS */}
          {activeTab === "leads" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Active Team Lead Channels</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Track property interaction vectors inside your regional territory parameters.</p>
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
                        <th className="p-4 min-w-[160px]">Team Assignment Destination</th>
                        <th className="p-4">Milestone Track Status</th>
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
                                <select value={l.assignedTo} onChange={(e) => requestOwnerAssignmentPopup(l.id, e.target.value)} className="bg-slate-900 border border-slate-800 text-slate-200 rounded px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-orange-500 cursor-pointer max-w-[170px]">
                                  <option value="Unassigned">⚠️ Select Staff Member</option>
                                  {currentUser.role === "Admin" && (
                                    <optgroup label="Branch Managers">
                                      {users.filter(u => u.role === "Manager").map(u => (
                                        <option key={u.id} value={u.name}>{u.name} (Mgr)</option>
                                      ))}
                                    </optgroup>
                                  )}
                                  <optgroup label="Regional Roster Staff">
                                    {visibleUsers.filter(u => ["Executive", "Telecaller"].includes(u.role)).map(u => (
                                      <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                                    ))}
                                  </optgroup>
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

          {/* VIEWPORT 3: PROJECTS MASTER */}
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

          {/* VIEWPORT 4: ADMIN CONSOLE */}
          {activeTab === "users" && currentUser.role === "Admin" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="bg-slate-950 border border-orange-500/20 rounded-2xl p-4 lg:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black text-white flex items-center gap-2"><Upload className="h-4 w-4 text-orange-500" /> SpreadSheet Data Ingestion Engine</h3>
                    <p className="text-xs text-slate-400">Import leads directly via copying and pasting columns from Excel/CSV.</p>
                  </div>
                </div>

                <form onSubmit={handleDataImportSubmit} className="space-y-3">
                  <textarea rows={3} value={importText} onChange={(e)=>setImportText(e.target.value)} placeholder="Paste Excel/CSV rows directly here..." className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-mono" />
                  <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md w-fit">
                    <Upload className="h-4 w-4" /> Deploy Ingestion
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* VIEWPORT 5: REPORTS CONSOLE */}
          {activeTab === "reports" && (
            <div className="space-y-6 animate-fadeIn w-full">
              <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4 w-full">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Performance Matrix Engine</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {["Executive", "Telecaller"].includes(currentUser.role) 
                      ? "Isolated tracking ledger tracking your personal pipelines conversions cleanly."
                      : "Audit corporate performance analytics curves across regional pipelines."
                    }
                  </p>
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

                  {["Admin", "Manager"].includes(currentUser.role) && (
                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Executive Allocation</label>
                      <select value={filterExecutive} onChange={(e) => setFilterExecutive(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none">
                        <option value="All">All Executives</option>
                        {visibleUsers.filter(u => ["Executive", "Telecaller"].includes(u.role)).map(u => (
                          <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                        ))}
                      </select>
                    </div>
                  )}
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
                        {["Admin", "Manager"].includes(currentUser.role) && <th className="pb-2">Assigned Agent</th>}
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
                          {["Admin", "Manager"].includes(currentUser.role) && <td className="py-3 text-slate-400 font-semibold">{l.assignedTo}</td>}
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

      {/* POPUP CONFIRMATION INTERFACES */}
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

      {/* DUAL ROLE WORKSPACE MODAL CONTAINER */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setSelectedLead(null)}>
          <div className="bg-slate-950 border border-slate-800 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl p-6 space-y-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            
            <div className="border-b border-slate-900 pb-3 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] bg-orange-600 font-mono font-black px-2 py-0.5 rounded text-white uppercase tracking-wider">
                  {["Admin", "Manager"].includes(currentUser.role) ? "Direct Assignment Hub" : "Lead Context Dossier"}
                </span>
                h3 className="text-xl font-black text-white">{selectedLead.name}</h3>
                <p className="text-xs text-slate-500 tracking-wide font-mono">Reference ID: #{selectedLead.id} • Assigned Agent: <span className="text-slate-300 font-bold">{selectedLead.assignedTo}</span></p>
              </div>
              
              {/* INLINE STATUS TRACK MODIFIER */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">Milestone Status Track</label>
                <div className="flex items-center gap-2">
                  <select 
                    value={selectedLead.status} 
                    onChange={(e) => handleInlineMilestoneStatusChange(selectedLead.id, e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-black focus:outline-none focus:border-orange-500 cursor-pointer min-w-[160px]"
                    style={{ color: SC[selectedLead.status]?.text || "#FFF" }}
                  >
                    {statuses.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                  <button onClick={() => setSelectedLead(null)} className="text-slate-500 hover:text-white font-bold text-sm bg-slate-900 border border-slate-850 p-2 rounded-xl">✕</button>
                </div>
              </div>
            </div>

            {/* DIRECT CONTACT CHANNELS ACCESSIBILITY BAR */}
            <div className="bg-slate-900/80 p-4 border border-slate-850 rounded-xl space-y-2 text-xs">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Client Communication Channels</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-200">
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-850">
                  <span className="text-slate-500 font-mono font-bold text-[9px] uppercase">Primary:</span>
                  <span className="font-mono font-bold text-orange-400">{selectedLead.phone}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-850">
                  <span className="text-slate-500 font-mono font-bold text-[9px] uppercase">Alternate:</span>
                  <span className="font-mono text-slate-300">{selectedLead.altPhone || "Not Logged"}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-850 col-span-1 sm:col-span-2">
                  <span className="text-slate-500 font-mono font-bold text-[9px] uppercase">Email Address:</span>
                  <span className="font-medium text-slate-300 truncate">{selectedLead.email || "No digital address recorded"}</span>
                </div>
              </div>
            </div>

            {/* ─── INFOGRAPHIC TREE GRAPH TIMELINE DESIGN (LAST UPDATE FIRST) ─── */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" /> INTERACTION TIMELINE tracking JOURNAL
                </h4>
                <span className="text-[10px] bg-slate-900 text-slate-400 px-2.5 py-0.5 rounded-full border border-slate-800 font-mono">
                  {selectedLead.history?.length || 0} Total Footprints
                </span>
              </div>
              
              <div className="relative max-h-[260px] overflow-y-auto pr-2 scrollbar-thin space-y-0 pt-2">
                {/* Visual Backbone Thread Core Line */}
                <div className="absolute left-[23px] top-0 bottom-4 w-1 bg-gradient-to-b from-orange-600 via-amber-500 to-emerald-500 rounded-full"></div>
                
                {selectedLead.history && selectedLead.history.length > 0 ? (
                  selectedLead.history.map((log, index) => {
                    const stepNumber = selectedLead.history.length - index;
                    
                    const stepBadgeColors = [
                      "bg-orange-600 ring-orange-500/20 text-white",
                      "bg-amber-500 ring-amber-500/20 text-slate-950",
                      "bg-yellow-500 ring-yellow-500/20 text-slate-950",
                      "bg-emerald-500 ring-emerald-500/20 text-white"
                    ][index % 4];

                    return (
                      <div key={index} className="flex gap-6 items-start pb-6 last:pb-2 group animate-fadeIn">
                        
                        {/* Blueprint Step Circle Node */}
                        <div className={`h-12 w-12 rounded-full flex-shrink-0 flex items-center justify-center font-black text-sm ring-8 shadow-md transition-transform group-hover:scale-105 ${stepBadgeColors} z-10 font-mono`}>
                          {stepNumber < 10 ? `0${stepNumber}` : stepNumber}
                        </div>
                        
                        {/* Blueprint Right Node Body Text block */}
                        <div className="flex-1 bg-slate-900/60 border border-slate-850 p-4 rounded-2xl relative hover:bg-slate-900 hover:border-slate-700 transition-all space-y-1.5 shadow-inner">
                          {/* Triangle pointer indicator */}
                          <div className="absolute left-[-6px] top-4 h-3 w-3 bg-slate-900 border-l border-b border-slate-850 transform rotate-45 group-hover:bg-slate-900 group-hover:border-slate-700"></div>
                          
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                            <h5 className="font-black text-white text-xs uppercase tracking-wide flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                              Agent Action Desk: <span className="text-orange-400 font-mono ml-0.5">{log.by}</span>
                            </h5>
                            <span className="text-[10px] font-bold text-slate-500 font-mono bg-slate-950/80 px-2 py-0.5 rounded border border-slate-900">{log.date}</span>
                          </div>
                          
                          <p className="text-slate-300 text-[11px] leading-relaxed font-sans font-medium pl-3 border-l-2 border-slate-800 mt-1">
                            {log.action}
                          </p>
                        </div>
                        
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500 italic text-center py-6">No workflow trail tracked inside state storage parameters yet.</p>
                )}
              </div>
            </div>

            {/* PRIVILEGE ACTIONS */}
            {["Admin", "Manager"].includes(currentUser.role) ? (
              <div className="space-y-4 text-xs pt-1">
                <div className="bg-slate-900 p-3.5 border border-slate-850 rounded-xl text-slate-400">
                  <p className="font-bold text-slate-300">Project Target Context: <span className="text-white">{selectedLead.project}</span></p>
                  <p className="mt-1 font-medium">Source Acquisition: <span className="text-slate-300 font-mono">{selectedLead.source}</span></p>
                </div>
                <div className="space-y-2">
                  <label className="text-slate-400 font-bold uppercase tracking-wide">Select Roster Target to Route Lead</label>
                  <select value={selectedLead.assignedTo} onChange={(e) => requestOwnerAssignmentPopup(selectedLead.id, e.target.value)} className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl p-3 text-xs font-bold focus:outline-none focus:border-orange-500 cursor-pointer">
                    <option value="Unassigned">⚠️ Choose Active Target Entity</option>
                    {visibleUsers.filter(u => ["Executive", "Telecaller"].includes(u.role)).map(u => (
                      <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-5 text-xs">
                <div className="bg-slate-900 p-4 border border-slate-850 rounded-xl grid grid-cols-2 gap-4 font-semibold text-slate-300">
                  <div><p className="text-slate-500 text-[10px] font-bold uppercase">Project Context</p><p className="text-white mt-0.5 font-bold">{selectedLead.project}</p></div>
                  <div><p className="text-slate-500 text-[10px] font-bold uppercase">Financial Intent</p><p className="text-emerald-400 mt-0.5 font-bold font-mono">₹{selectedLead.budget}L Base</p></div>
                  <div className="col-span-2"><p className="text-slate-500 text-[10px] font-bold uppercase">Initial Requirements Notes</p><p className="text-slate-300 font-normal mt-0.5 italic">"{selectedLead.notes || 'No custom details logged.'}"</p></div>
                </div>

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
                  <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-2 rounded-xl text-xs uppercase tracking-wider transition-all">Write Follow-up Entry</button>
                </form>

                <div className="bg-slate-900/50 p-4 border border-slate-850 rounded-xl space-y-3">
                  <p className="text-[11px] font-black uppercase text-amber-400 tracking-wider">Verify Physical Site Walkthrough</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1"><label className="text-slate-400 text-[10px]">Tour Date</label><input type="date" value={svDate} onChange={(e)=>setSvDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200 font-mono" /></div>
                    <div className="space-y-1"><label className="text-slate-400 text-[10px]">Attended Family Co-Buyers</label><input type="text" value={svFamily} onChange={(e)=>setSvFamily(e.target.value)} placeholder=" Spouse" className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200" /></div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 text-[10px]">Site Walkthrough Feedback Notes *</label>
                    <textarea rows={1} value={svFeedback} onChange={(e)=>setSvFeedback(e.target.value)} placeholder="Enter design layout parameters..." className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none" />
                  </div>
                  <button type="button" onClick={commitSiteWalkthroughLog} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 rounded-xl uppercase tracking-wider">Commit Walkthrough Verification</button>
                </div>

                <div className="bg-slate-900/50 p-4 border border-slate-850 rounded-xl space-y-3">
                  <p className="text-[11px] font-black uppercase text-emerald-400 tracking-wider">Secure Advance Token Booking Ingestion</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1"><label className="text-slate-400 text-[10px]">Unit Designation *</label><input type="text" value={bkUnit} onChange={(e)=>setBkUnit(e.target.value)} placeholder="e.g. Plot 42" className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200" /></div>
                    <div className="space-y-1"><label className="text-slate-400 text-[10px]">Token Amount (₹) *</label><input type="number" value={bkAmount} onChange={(e)=>setBkAmount(e.target.value)} placeholder="INR Value" className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-emerald-400 font-bold focus:outline-none" /></div>
                  </div>
                  <button type="button" onClick={commitFinancialBookingLog} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-1.5 rounded-xl uppercase tracking-wider">Secure Unit Allocation Ledger</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DIALOG NEW LEAD RECORDS INGEST CARDS */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl relative">
            
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h2 className="text-base font-black text-white tracking-wide uppercase">Capture Customer Profile Ingestion</h2>
              <button onClick={() => { setIsLeadModalOpen(false); setDuplicateConflictRecord(null); }} className="text-slate-500 hover:text-white">✕</button>
            </div>

            {/* DUCELLATION BLOCKS */}
            {duplicateConflictRecord && (
              <div className="absolute inset-x-6 top-16 bottom-6 bg-slate-950/95 border border-rose-500/40 rounded-xl p-5 z-20 flex flex-col justify-between space-y-3 backdrop-blur-md animate-scaleUp">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 font-black tracking-wide text-xs">
                    <AlertTriangle className="h-5 w-5 animate-bounce" /> ⚠️ WARNING: DUPLICATE PHONE NUMBER DETECTED
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    The contact number <span className="text-white font-black font-mono bg-slate-900 px-1.5 py-0.5 rounded">{duplicateConflictRecord.phone}</span> is already logged inside the Desam centralized lead ledger database:
                  </p>
                  
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-850 text-[11px] grid grid-cols-2 gap-3.5 font-semibold text-slate-300">
                    <div><span className="text-slate-500 block text-[9px] uppercase font-bold">Client Name</span><span className="text-white font-bold">{duplicateConflictRecord.name}</span></div>
                    <div><span className="text-slate-500 block text-[9px] uppercase font-bold">Target Scheme</span><span className="text-orange-400 font-bold">{duplicateConflictRecord.project}</span></div>
                    <div><span className="text-slate-500 block text-[9px] uppercase font-bold">Current Milestone</span><span className="text-blue-400 font-bold">{duplicateConflictRecord.status}</span></div>
                    <div><span className="text-slate-500 block text-[9px] uppercase font-bold">Assigned Staff Seat</span><span className="text-white font-bold">{duplicateConflictRecord.assignedTo}</span></div>
                  </div>
                </div>

                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-2.5 rounded-lg text-[10px] font-bold text-center uppercase tracking-wide">
                  Ingestion Blocked to Maintain High-Accuracy Ledger Integrity.
                </div>
              </div>
            )}

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Client Target Name *</label>
                  <input type="text" required value={newLeadForm.name} onChange={(e)=>setNewLeadForm({...newLeadForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-orange-500" />
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
                  <label className="text-slate-400 font-semibold">Primary Contact Phone (Strict Digit Format) *</label>
                  <input 
                    type="text" 
                    required 
                    value={newLeadForm.phone} 
                    onChange={(e) => handlePhoneInputChange(e.target.value, false)} 
                    placeholder="e.g. 9840011234"
                    className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 font-mono font-bold tracking-wider focus:outline-none focus:border-orange-500" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Alternate Contact Number</label>
                  <input 
                    type="text" 
                    value={newLeadForm.altPhone} 
                    onChange={(e) => handlePhoneInputChange(e.target.value, true)} 
                    placeholder="Optional fallback digit string"
                    className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 font-mono focus:outline-none focus:border-orange-500" 
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Email Contact Parameters <span className="text-slate-500 text-[10px] italic">(Optional)</span></label>
                <input type="email" value={newLeadForm.email} onChange={(e)=>setNewLeadForm({...newLeadForm, email: e.target.value})} className="w-full bg-slate-900 border border-slate-850 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-orange-500" placeholder="client@domain.com" />
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
              
              <button 
                type="submit" 
                disabled={!!duplicateConflictRecord}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white font-black py-3 rounded-xl uppercase tracking-wider shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Commit Ingest Record
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
