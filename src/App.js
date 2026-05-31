import React, { useState, useMemo } from "react";
import { 
  Users, ShieldAlert, BarChart3, Building2, Briefcase, 
  Layers, PhoneCall, Calendar, Search, Plus, TrendingUp, 
  DollarSign, MapPin, Shield, Clock, LogOut, Lock, 
  Mail, CheckCircle2, UserPlus, Trash2, Edit2, X, Bell, 
  AlertTriangle, Download, Upload, Info, FileSpreadsheet, Check,
  Menu, ArrowRight, Home, FileText
} from "lucide-react";
import { 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

// ─── STATIC BRAND LOGO ROUTING DIRECTORY ──────────────────────────────────
const DESAM_LOGO_ASSET = "/DESAM-NEW-LOGO.png";

// ─── CONSTANT STATIC DATA REGISTRIES ──────────────────────────────────────
const INITIAL_ROLES = ["Admin", "Manager", "Executive", "Telecaller"];

const INITIAL_SOURCES = [
  "Website", "Meta Ads", "Google Ads", "Direct Enquiry", "Walk-In", 
  "Reference", "Expo / Event", "Own Leads", "WhatsApp Campaign", "Property Portals"
];

const INITIAL_STATUSES = [
  "New", "Assigned", "Contacted", "Follow-Up", "Site Visit Planned", 
  "Site Visit Completed", "Negotiation", "Booking Pending", "Booking Confirmed", 
  "Closed", "Not Interested", "RNR", "Switched Off", "Wrong Number"
];

const PROJECT_STATUSES = ["Upcoming", "Pre-Launch", "Ongoing", "Completed", "Sold-Out"];

const BRANCHES = ["Madurai Desk", "Chennai South", "Chennai North", "Coimbatore"];
const PROJECT_TYPES = ["Apartment", "Villa", "Plot"];

const TEAMS_REGISTRY = {
  "Madurai Desk": "Team Alpha (Madurai Core)",
  "Chennai South": "Team Delta (Chennai Hub)",
  "Coimbatore": "Team Orion (CBE Vistas)",
  "Chennai North": "Team Beta (Chennai North)"
};

const INITIAL_USERS = [
  { id: 101, name: "Shaj", email: "admin@desam", pass: "saamrat@123", role: "Admin", branch: "All Branches", phone: "9840000001", active: true, avatar: "S" },
  { id: 101, name: "Digital Marketing", email: "dm@desam", pass: "m@rketing", role: "Admin", branch: "All Branches", phone: "9840000001", active: true, avatar: "S" },
  { id: 102, name: "Jibril", email: "jibril@desam", pass: "angel@26", role: "Manager", branch: "Madurai Desk", phone: "9840000002", active: true, avatar: "J" },
  { id: 103, name: "AryaLakshmi", email: "arya@lakshmi", pass: "manager123", role: "Manager", branch: "Madurai Desk", phone: "9840000003", active: true, avatar: "A" },
  { id: 104, name: "Rohini", email: "rohini@desam", pass: "rohu@desam", role: "Executive", branch: "Madurai Desk", phone: "9840000004", active: true, avatar: "R" },
  { id: 105, name: "Priyadarshini", email: "priya@desam", pass: "agent123", role: "Executive", branch: "Madurai Desk", phone: "9840000005", active: true, avatar: "P" },
  { id: 106, name: "Arun", email: "arun@desam", pass: "arun@desam", role: "Executive", branch: "Madurai Desk", phone: "9840000006", active: true, avatar: "A" },
  { id: 107, name: "Sumathi", email: "sumathi@desam", pass: "caller123", role: "Telecaller", branch: "Madurai Desk", phone: "9840000007", active: true, avatar: "S" },
  { id: 108, name: "Shakila", email: "shakila@desam", pass: "caller123", role: "Telecaller", branch: "Madurai Desk", phone: "9840000008", active: true, avatar: "S" },
  { id: 109, name: "Gowshika", email: "gowshika@desam", pass: "caller123", role: "Telecaller", branch: "Madurai Desk", phone: "9840000009", active: true, avatar: "G" },
];

const INITIAL_PROJECTS = [
  { id: 1, name: "Desam Garden", location: "Madurai Bypass", branch: "Madurai Desk", type: "Plot", price: 25, units: 80, sold: 15, status: "Ongoing" },
  { id: 2, name: "Fairland", location: "Uthangudi, Madurai", branch: "Madurai Desk", type: "Villa", price: 95, units: 35, sold: 8, status: "Ongoing" },
  { id: 3, name: "Vishal Virinchi", location: "Bypass Road, Madurai", branch: "Madurai Desk", type: "Apartment", price: 65, units: 10, sold: 2, status: "Ongoing" },
  { id: 4, name: "GK Apartments", location: "Velachery, Chennai", branch: "Chennai South", type: "Apartment", price: 85, units: 120, sold: 45, status: "Completed" },
  { id: 5, name: "Anbu Desam", location: "Saravanampatti, CBE", branch: "Coimbatore", type: "Villa", price: 140, units: 40, sold: 12, status: "Pre-Launch" },
];

const INITIAL_LEADS = [
  { id: 1001, name: "Suresh Kumar", phone: "9840011234", altPhone: "9840011235", email: "suresh@gmail.com", location: "Madurai", branch: "Madurai Desk", project: "Vishal Virinchi", budget: 65, source: "Website", assignedTo: "Rohini", assignedByRole: "Manager", status: "Follow-Up", notes: "Prefers higher floors.", dateCreated: "2026-05-10", lastFollowUp: "2026-05-25", nextFollowUp: "2026-05-29", history: [{ date: "2026-05-25", by: "Rohini", action: "Follow-up conversation done. Discussing financing pathways and bank loan eligibility matrices." }, { date: "2026-05-15", by: "Sumathi", action: "Called client. Expressed keen interest in structural layouts. Requested site layout blueprints via WhatsApp." }], bookingUnit: "", bookingAmount: 0, bookingMode: "", bookingDate: "", regPending: false, regCompleted: false, siteVisitTentativeDate: "" },
  { id: 1002, name: "Lakshmi Rao", phone: "9940022345", altPhone: "", email: "lakshmi@yahoo.com", location: "Chennai", branch: "Chennai South", project: "GK Apartments", budget: 85, source: "Meta Ads", assignedTo: "Unassigned", assignedByRole: "", status: "New", notes: "Arranging transportation for family walkthrough.", dateCreated: "2026-05-12", lastFollowUp: "2026-05-28", nextFollowUp: "2026-05-29", history: [{ date: "2026-05-28", by: "System Master", action: "Initial lead automated validation complete." }], bookingUnit: "", bookingAmount: 0, bookingMode: "", bookingDate: "", regPending: false, regCompleted: false, siteVisitTentativeDate: "" },
  { id: 1003, name: "Vijay Anand", phone: "9740033456", altPhone: "", email: "vijay@outlook.com", location: "Madurai", branch: "Madurai Desk", project: "Desam Garden", budget: 30, source: "Google Ads", assignedTo: "Jibril", assignedByRole: "Admin", status: "New", notes: "Premium corner plot structural interest.", dateCreated: "2026-05-29", lastFollowUp: "None", nextFollowUp: "2026-05-29", history: [{ date: "2026-05-29", by: "Shaj", action: "Admin deployed tracking parameters directly to Manager Jibril view queue." }], bookingUnit: "", bookingAmount: 0, bookingMode: "", bookingDate: "", regPending: false, regCompleted: false, siteVisitTentativeDate: "" },
  { id: 1004, name: "Meena Selvam", phone: "9640044567", altPhone: "9640044568", email: "meena@gmail.com", location: "Madurai", branch: "Madurai Desk", project: "Fairland", budget: 95, source: "Walk-In", assignedTo: "Unassigned", assignedByRole: "", status: "Booking Confirmed", notes: "Token collected cleanly.", dateCreated: "2026-04-20", lastFollowUp: "2026-05-20", nextFollowUp: "2026-05-29", history: [{ date: "2026-05-20", by: "Priyadarshini", action: "Initial walkthrough context established." }], bookingUnit: "Villa 12", bookingAmount: 500000, bookingMode: "Cheque", bookingDate: "2026-05-20", regPending: true, regCompleted: false, siteVisitTentativeDate: "" },
];

const SC = {
  New:                    { bg: "rgba(59,130,246,0.1)", text: "#60a5fa", border: "rgba(59,130,246,0.2)" },
  Assigned:               { bg: "rgba(16,185,129,0.1)", text: "#34d399", border: "rgba(16,185,129,0.2)" },
  Contacted:              { bg: "rgba(245,158,11,0.1)", text: "#fbbf24", border: "rgba(245,158,11,0.2)" },
  "Follow-Up":            { bg: "rgba(236,72,153,0.1)", text: "#f472b6", border: "rgba(236,72,153,0.2)" },
  "Site Visit Planned":   { bg: "rgba(139,92,246,0.1)", text: "#a78bfa", border: "rgba(139,92,246,0.2)" },
  "Booking Confirmed":    { bg: "rgba(52,211,153,0.15)", text: "#34d399", border: "rgba(52,211,153,0.3)" },
  Closed:                 { bg: "rgba(107,114,128,0.1)", text: "#9ca3af", border: "rgba(107,114,128,0.2)" },
  "Not Interested":       { bg: "rgba(239,68,68,0.1)", text: "#ef4444", border: "rgba(239,68,68,0.2)" },
  "RNR":                  { bg: "rgba(156,163,175,0.1)", text: "#9ca3af", border: "rgba(156,163,175,0.2)" },
  "Switched Off":         { bg: "rgba(156,163,175,0.1)", text: "#9ca3af", border: "rgba(156,163,175,0.2)" },
  "Wrong Number":         { bg: "rgba(248,113,113,0.1)", text: "#f87171", border: "rgba(248,113,113,0.2)" },
};

const PSC = {
  "Upcoming":             { bg: "rgba(147,197,253,0.15)", text: "#93c5fd" },
  "Pre-Launch":           { bg: "rgba(244,114,182,0.15)", text: "#f472b6" },
  "Ongoing":              { bg: "rgba(251,191,36,0.15)",  text: "#fbbf24" },
  "Completed":            { bg: "rgba(52,211,153,0.15)",  text: "#34d399" },
  "Sold-Out":             { bg: "rgba(239,68,68,0.15)",   text: "#ef4444" },
};

// Colors for Pie Chart
const PIE_COLORS = ['#ea580c', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#f59e0b', '#64748b', '#14b8a6', '#ef4444', '#06b6d4'];

export default function App() {
  const TODAY_STR = "2026-05-31";

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
  
  // Custom Date Reporting States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);

  const [selectedLead, setSelectedLead] = useState(null);
  const [importText, setImportText] = useState("");

  const [customPopup, setCustomPopup] = useState({ isOpen: false, leadId: null, targetValue: "", type: "status", title: "", message: "" });
  const [toastNotification, setToastNotification] = useState({ isVisible: false, message: "" });

  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const [newLeadForm, setNewLeadForm] = useState({ name: "", phone: "", altPhone: "", email: "", location: "", project: "Desam Garden", budget: 25, source: "Website", assignedTo: "Unassigned", notes: "" });
  const [newProjectForm, setNewProjectForm] = useState({ name: "", location: "", branch: "Madurai Desk", type: "Plot", price: 30, units: 50, sold: 0, status: "Pre-Launch" });
  
  const [newUserForm, setNewUserForm] = useState({ name: "", emailPrefix: "", pass: "", role: "Executive", branch: "Madurai Desk", phone: "" });

  const [duplicateConflictRecord, setDuplicateConflictRecord] = useState(null); 

  const [followUpNotes, setFollowUpNotes] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");

  const [svDate, setSvDate] = useState("");
  const [svFeedback, setSvFeedback] = useState("");
  const [svFamily, setSvFamily] = useState("");

  const [bkUnit, setBkUnit] = useState("");
  const [bkAmount, setBkAmount] = useState("");

  const [tentativeWalkthroughDateInput, setTentativeWalkthroughDateInput] = useState("");

  // ─── NEW STATES FOR EDITING USERS ─────────────────────────────────────────
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editUserForm, setEditUserForm] = useState(null);

  // ─── UTILITY NORMALIZATION FUNCTION ───────────────────────────────────────
  const stripAndNormalizeContactDigits = (val) => {
    if (!val) return "";
    return val.toString().replace(/\s+/g, "").replace(/\D/g, "");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    triggerToastAlert("Copied to clipboard!");
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
    if (currentUser.role === "Admin") return leads.filter(l => l.assignedTo === "Unassigned" || l.status === "Site Visit Planned");
    
    if (currentUser.role === "Manager") {
      return leads.filter(l => 
        l.branch === currentUser.branch && 
        (l.assignedTo === "Unassigned" || l.assignedTo === currentUser.name || l.status === "Site Visit Planned")
      );
    }
    if (currentUser.role === "Executive" || currentUser.role === "Telecaller") {
      return leads.filter(l => l.assignedTo === currentUser.name);
    }
    return [];
  }, [leads, currentUser]);

  const unattendedManagerAlerts = useMemo(() => {
    if (!currentUser || currentUser.role !== "Manager") return [];
    return leads.filter(l => {
      if (l.branch !== currentUser.branch) return false;
      if (l.status !== "New") return false;
      const createdDate = new Date(l.dateCreated);
      const today = new Date(TODAY_STR);
      const diffTime = today - createdDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return diffDays >= 2;
    });
  }, [leads, currentUser]);

  // ─── ANALYTICS CHARTS DATA COMPUTATION ────────────────────────────────────
  const chartDataSource = useMemo(() => {
    const counts = {};
    processedLeads.forEach(l => { counts[l.source] = (counts[l.source] || 0) + 1; });
    return Object.keys(counts).map(key => ({ name: key, count: counts[key] })).sort((a, b) => b.count - a.count);
  }, [processedLeads]);

  const chartDataStatus = useMemo(() => {
    const counts = {};
    processedLeads.forEach(l => { counts[l.status] = (counts[l.status] || 0) + 1; });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [processedLeads]);

  const chartDataProject = useMemo(() => {
    const counts = {};
    processedLeads.forEach(l => { counts[l.project] = (counts[l.project] || 0) + 1; });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [processedLeads]);

  const chartDataExecutive = useMemo(() => {
    const counts = {};
    processedLeads.forEach(l => { 
      if (l.assignedTo && l.assignedTo !== "Unassigned") {
        counts[l.assignedTo] = (counts[l.assignedTo] || 0) + 1; 
      }
    });
    return Object.keys(counts).map(key => ({ name: key, count: counts[key] })).sort((a, b) => b.count - a.count);
  }, [processedLeads]);

  const chartDataTrend = useMemo(() => {
    const counts = {};
    processedLeads.forEach(l => { counts[l.dateCreated] = (counts[l.dateCreated] || 0) + 1; });
    return Object.keys(counts).sort().map(date => ({ date, leads: counts[date] }));
  }, [processedLeads]);

  const conversionRate = useMemo(() => {
    const booked = processedLeads.filter(l => ["Booking Confirmed", "Closed"].includes(l.status)).length;
    return processedLeads.length > 0 ? Math.round((booked / processedLeads.length) * 100) : 0;
  }, [processedLeads]);

  // ─── NEW: DATE RANGE EXECUTIVE SUMMARY REPORT MATRIX ──────────────────────
  const executiveSummaryData = useMemo(() => {
    const execMap = {};
    
    // Pre-populate with all relevant visible users to show 0s if they have no leads in period
    visibleUsers.forEach(u => {
      if (["Executive", "Telecaller"].includes(u.role)) {
        execMap[u.name] = { name: u.name, total: 0, new: 0, active: 0, siteVisits: 0, bookings: 0, dead: 0 };
      }
    });
    // Add an Unassigned bucket
    execMap["Unassigned"] = { name: "Unassigned", total: 0, new: 0, active: 0, siteVisits: 0, bookings: 0, dead: 0 };

    processedLeads.forEach(l => {
      const exec = l.assignedTo || "Unassigned";
      if (!execMap[exec]) {
        execMap[exec] = { name: exec, total: 0, new: 0, active: 0, siteVisits: 0, bookings: 0, dead: 0 };
      }
      
      execMap[exec].total += 1;
      
      if (l.status === "New") {
        execMap[exec].new += 1;
      } else if (["Assigned", "Contacted", "Follow-Up", "Negotiation"].includes(l.status)) {
        execMap[exec].active += 1;
      } else if (["Site Visit Planned", "Site Visit Completed"].includes(l.status)) {
        execMap[exec].siteVisits += 1;
      } else if (["Booking Pending", "Booking Confirmed", "Closed"].includes(l.status)) {
        execMap[exec].bookings += 1;
      } else if (["Not Interested", "RNR", "Switched Off", "Wrong Number"].includes(l.status)) {
        execMap[exec].dead += 1;
      }
    });

    // Filter out rows that have 0 total leads unless they are part of the team's visible active roster
    return Object.values(execMap)
      .filter(e => e.total > 0 || visibleUsers.some(u => u.name === e.name))
      .sort((a, b) => b.total - a.total);
  }, [processedLeads, visibleUsers]);

  // ─── NEW ANALYTICS LOGIC ──────────────────────────────────────────────────
  const sourcewiseAnalysis = useMemo(() => {
    const data = {};
    processedLeads.forEach(l => {
      if (!data[l.source]) data[l.source] = { total: 0 };
      data[l.source].total += 1;
    });
    return Object.entries(data).sort((a, b) => b[1].total - a[1].total);
  }, [processedLeads]);

  const projectwiseAnalysis = useMemo(() => {
    const data = {};
    processedLeads.forEach(l => {
      if (!data[l.project]) data[l.project] = { total: 0, converted: 0 };
      data[l.project].total += 1;
      if (["Booking Confirmed", "Closed"].includes(l.status)) data[l.project].converted += 1;
    });
    return Object.entries(data);
  }, [processedLeads]);

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
      action: `Transformed active pipeline milestone to state tracked tier [${targetStatus}].`
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

  const handleProjectStatusChange = (projectId, targetStatus) => {
    setProjects(projects.map(p => p.id === projectId ? { ...p, status: targetStatus } : p));
    triggerToastAlert(`Project track shifted to ${targetStatus}`);
  };

  const commitTentativeWalkthroughPlan = (e) => {
    e.preventDefault();
    if (!tentativeWalkthroughDateInput) return;

    const plannedHistoryLog = {
      date: TODAY_STR,
      by: currentUser.name,
      action: `[SITE VISIT PLANNED ALERT]: Walkthrough itinerary drafted. Scheduled tentative review date target set to: ${tentativeWalkthroughDateInput}. Dashboard reminders dispatched to executive and manager panels.`
    };

    setLeads(leads.map(l => l.id === selectedLead.id ? {
      ...l,
      status: "Site Visit Planned",
      siteVisitTentativeDate: tentativeWalkthroughDateInput,
      history: [plannedHistoryLog, ...l.history]
    } : l));

    setSelectedLead(prev => ({
      ...prev,
      status: "Site Visit Planned",
      siteVisitTentativeDate: tentativeWalkthroughDateInput,
      history: [plannedHistoryLog, ...prev.history]
    }));

    setTentativeWalkthroughDateInput("");
    triggerToastAlert("Tentative date saved and metrics broadcasted.");
  };

  // ─── DATA EXPORT TRIGGER METHODS ──────────────────────────────────────────
  const executeDataExportSequence = (formatType) => {
    if (processedLeads.length === 0) {
      triggerToastAlert("No scoped logs available to compile.");
      return;
    }

    const titleHeaders = ["Lead ID", "Customer Name", "Phone", "Email", "Project Context", "Budget (Lakhs)", "Source Channel", "Assigned Agent", "Pipeline Milestone Status", "Date Captured"];
    
    const contentRows = processedLeads.map(l => [
      l.id, l.name, l.phone, l.email || "N/A", l.project, `${l.budget}L`, l.source, l.assignedTo, l.status, l.dateCreated
    ]);

    let rawOutputBuffer = "";
    let fileMimeType = "text/plain;charset=utf-8;";
    let calculatedExtension = "txt";

    if (formatType === "csv" || formatType === "excel") {
      const formatCSVCell = (val) => {
        const textVal = val === null ? "" : String(val);
        return textVal.includes(",") || textVal.includes("\n") || textVal.includes('"') 
          ? `"${textVal.replace(/"/g, '""')}"` 
          : textVal;
      };
      
      const csvLines = [
        titleHeaders.map(formatCSVCell).join(","),
        ...contentRows.map(row => row.map(formatCSVCell).join(","))
      ];
      
      rawOutputBuffer = csvLines.join("\n");
      fileMimeType = "text/csv;charset=utf-8;";
      calculatedExtension = formatType === "excel" ? "xlsx" : "csv"; 
    } 
    else if (formatType === "pdf") {
      let pdfLayoutText = `========================================================================\n`;
      pdfLayoutText += `                  DESAM DEVELOPERS - PERFORMANCE LEDGER AUDIT\n`;
      pdfLayoutText += `                  Report Compiled On: ${TODAY_STR} By: ${currentUser.name}\n`;
      pdfLayoutText += `========================================================================\n\n`;
      
      contentRows.forEach((row, i) => {
        pdfLayoutText += `${i + 1}. CLIENT PROFILE: ${row[1]}\n`;
        pdfLayoutText += `   ---------------------------------------------------------------------\n`;
        pdfLayoutText += `   • Phone: ${row[2]} | Email: ${row[3]}\n`;
        pdfLayoutText += `   • Scheme Context: ${row[4]} | Budget Allocation: ${row[5]}\n`;
        pdfLayoutText += `   • Channel Source: ${row[6]} | Routed Seat: ${row[7]}\n`;
        pdfLayoutText += `   • Milestone Phase: [${row[8]}] | Logged Inbound: ${row[9]}\n\n`;
      });
      
      pdfLayoutText += `========================================================================\n`;
      pdfLayoutText += `               End of Compiled Parameters Ledger — Desam Core Systems\n`;
      
      rawOutputBuffer = pdfLayoutText;
      fileMimeType = "text/plain;charset=utf-8;";
      calculatedExtension = "txt";
    }

    try {
      const targetBlob = new Blob([rawOutputBuffer], { type: fileMimeType });
      const temporaryLink = document.createElement("a");
      const transientURL = URL.createObjectURL(targetBlob);
      
      temporaryLink.href = transientURL;
      temporaryLink.setAttribute("download", `Desam_Pipeline_Matrix_Export_${TODAY_STR}.${calculatedExtension}`);
      document.body.appendChild(temporaryLink);
      
      temporaryLink.click();
      
      document.body.removeChild(temporaryLink);
      URL.revokeObjectURL(transientURL);
      
      triggerToastAlert(`File downloaded successfully: .${calculatedExtension.toUpperCase()}`);
    } catch (exportError) {
      alert(`Local File Generation Exception: ${exportError.message}`);
    }
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
            history: [{ date: TODAY_STR, by: currentUser.name, action: "Ingested via Excel copy-paste system matrix." }],
            siteVisitTentativeDate: ""
          });
        }
      });
      if (newlyIngestedLeads.length > 0) {
        setLeads([...newlyIngestedLeads, ...leads]);
        triggerToastAlert(`Successfully imported ${newlyIngestedLeads.length} leads.`);
        setImportText("");
      }
    } catch (err) {
      alert(`Parsing Exception: ${err.message}`);
    }
  };

  // ─── NEW USER MANAGEMENT HANDLERS ──────────────────────────────────────────
  const handleCreateUserSubmit = (e) => {
    e.preventDefault();
    const cleanPrefix = newUserForm.emailPrefix.trim().toLowerCase();
    const createdUser = {
      id: Date.now(),
      name: newUserForm.name.trim(),
      email: `${cleanPrefix}@desam`,
      pass: newUserForm.pass,
      role: newUserForm.role,
      branch: newUserForm.role === "Admin" ? "All Branches" : newUserForm.branch,
      phone: stripAndNormalizeContactDigits(newUserForm.phone) || "9840000000",
      active: true,
      avatar: newUserForm.name.charAt(0).toUpperCase()
    };
    setUsers([...users, createdUser]);
    setNewUserForm({ name: "", emailPrefix: "", pass: "", role: "Executive", branch: "Madurai Desk", phone: "" });
    triggerToastAlert(`Profile for ${createdUser.name} built cleanly.`);
  };

  const handleDeleteUser = (userId) => {
    if (userId === currentUser.id) {
      triggerToastAlert("Cannot delete your own active session account.");
      return;
    }
    setUsers(users.filter(u => u.id !== userId));
    triggerToastAlert("Corporate profile permanently removed.");
  };

  const openEditUserModal = (user) => {
    setEditUserForm({ ...user });
    setIsEditUserModalOpen(true);
  };

  const handleUpdateUserSubmit = (e) => {
    e.preventDefault();
    const cleanPrefix = editUserForm.email.split('@')[0].trim().toLowerCase();
    const updatedUser = {
      ...editUserForm,
      name: editUserForm.name.trim(),
      email: `${cleanPrefix}@desam`,
      branch: editUserForm.role === "Admin" ? "All Branches" : editUserForm.branch,
      phone: stripAndNormalizeContactDigits(editUserForm.phone) || "9840000000",
      avatar: editUserForm.name.charAt(0).toUpperCase()
    };
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    setIsEditUserModalOpen(false);
    setEditUserForm(null);
    triggerToastAlert(`Profile for ${updatedUser.name} updated successfully.`);
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
          history: [{ date: TODAY_STR, by: currentUser.name, action: `[Follow-Up Entry]: ${followUpNotes.trim()} (Next review scheduled for: ${nextFollowUpDate})` }, ...l.history]
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
      bookingUnit: "", bookingAmount: 0, bookingMode: "", bookingDate: "", regPending: false, regCompleted: false, siteVisitTentativeDate: "",
      history: [{ date: TODAY_STR, by: currentUser.name, action: "Lead Record Captured cleanly without internal spacing vectors." }]
    };
    
    setLeads([created, ...leads]); 
    setIsLeadModalOpen(false);
    setNewLeadForm({ name: "", phone: "", altPhone: "", email: "", location: "", project: "Desam Garden", budget: 25, source: "Website", assignedTo: "Unassigned", notes: "" });
    triggerToastAlert("New customer captured cleanly.");
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    const createdProj = {
      ...newProjectForm,
      id: Date.now(),
      price: parseInt(newProjectForm.price) || 0,
      units: parseInt(newProjectForm.units) || 0,
      sold: parseInt(newProjectForm.sold) || 0,
    };
    setProjects([createdProj, ...projects]);
    setIsProjectModalOpen(false);
    setNewProjectForm({ name: "", location: "", branch: "Madurai Desk", type: "Plot", price: 30, units: 50, sold: 0, status: "Pre-Launch" });
    triggerToastAlert(`Project "${createdProj.name}" compiled successfully.`);
  };

  const commitSiteWalkthroughLog = () => {
    setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, status: "Site Visit Completed", history: [{ date: svDate, by: currentUser.name, action: `[Walkthrough Matrix Validation]: Tour executed cleanly with family co-buyers (${svFamily}). Response details: ${svFeedback}` }, ...l.history] } : l));
    setSelectedLead(null);
    triggerToastAlert("Site walkthrough registered successfully.");
  };

  const commitFinancialBookingLog = () => {
    setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, status: "Booking Confirmed", bookingUnit: bkUnit, history: [{ date: TODAY_STR, by: currentUser.name, action: `[Advance Token Secured]: Formally allocated unit block [${bkUnit}] with secured deposit validation.` }, ...l.history] } : l));
    setSelectedLead(null);
    triggerToastAlert("Advance token payment captured.");
  };

  const SidebarContent = () => (
    <>
      <div>
        <div className="h-20 flex items-center px-5 border-b border-slate-800 bg-slate-950">
          <img 
            src={DESAM_LOGO_ASSET} 
            alt="Desam Developers Pvt Ltd" 
            className="h-11 w-auto object-contain max-w-[220px]" 
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
        <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-855">
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
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-slate-900 hover:bg-slate-855 rounded-xl border border-slate-800 text-slate-200 transition-colors">
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

              {/* MANAGER ALERT: UNATTENDED LEADS */}
              {unattendedManagerAlerts.length > 0 && (
                <div className="bg-rose-950/40 border border-rose-500/30 p-4 lg:p-5 rounded-2xl flex items-start gap-4 shadow-xl">
                  <div className="bg-rose-500/20 p-2 rounded-full border border-rose-500/30 mt-0.5">
                    <AlertTriangle className="h-5 w-5 text-rose-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-rose-400 font-black text-xs uppercase tracking-wider">Unattended Leads Alert</h3>
                    <p className="text-rose-200/70 text-xs mt-1.5 leading-relaxed font-medium">
                      You have <span className="text-rose-400 font-bold">{unattendedManagerAlerts.length}</span> leads in "New" status that have been unattended for over 48 hours. Please review and route them to available executives immediately to maintain pipeline velocity.
                    </p>
                  </div>
                </div>
              )}

              {/* DYNAMIC ACTION DESK */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 lg:p-6 space-y-4">
                <h2 className="text-xs font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                  <Bell className="h-4 w-4" /> 
                  {currentUser.role === "Executive" || currentUser.role === "Telecaller" ? "MY ACTIVE PIPELINE TASKS" : "DIRECT INBOUND DEPLOYMENT QUEUE / SITE VISITS"}
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

                        {l.status === "Site Visit Planned" && l.siteVisitTentativeDate && (
                          <div className="absolute top-0 right-0 bg-purple-600 text-[9px] font-mono font-black tracking-wider uppercase px-2.5 py-0.5 rounded-bl text-white flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> SV DATE: {l.siteVisitTentativeDate}
                          </div>
                        )}

                        <div>
                          <div className="flex justify-between items-start pr-16">
                            <h4 className="font-bold text-white text-sm cursor-pointer hover:text-orange-400 transition-all" onClick={() => setSelectedLead(l)}>{l.name}</h4>
                            <span className="text-[9px] bg-slate-950 border border-slate-855 text-slate-400 px-2 py-0.5 rounded font-mono font-bold">{l.source}</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
  <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Scoped Pipelines <Briefcase className="h-4 w-4 text-orange-400" /></p>
    <p className="text-3xl font-black text-white mt-1">{processedLeads.length}</p>
  </div>
  <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Conversions <CheckCircle2 className="h-4 w-4 text-emerald-400" /></p>
    <p className="text-3xl font-black text-emerald-400 mt-1">{processedLeads.filter(l => ["Booking Confirmed","Closed"].includes(l.status)).length}</p>
  </div>
  <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Rate (%) <TrendingUp className="h-4 w-4 text-blue-400" /></p>
    <p className="text-3xl font-black text-blue-400 mt-1">{conversionRate}%</p>
  </div>
  <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Volume <DollarSign className="h-4 w-4 text-orange-400" /></p>
    <p className="text-3xl font-black text-white mt-1">₹{processedLeads.reduce((a,c)=>a+c.budget, 0)}L</p>
  </div>
  <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Site Visits <Calendar className="h-4 w-4 text-amber-400" /></p>
    <p className="text-3xl font-black text-amber-400 mt-1">{processedLeads.filter(l => l.status === "Site Visit Completed").length}</p>
  </div>
</div>
              {/* 5-PANEL ANALYTICS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* 1. Bar Chart: Leads by Source */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl col-span-1 lg:col-span-2 shadow-xl">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Lead Acquisition by Source</h3>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartDataSource} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} angle={-35} textAnchor="end" />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '11px', color: '#f8fafc' }} itemStyle={{ color: '#ea580c', fontWeight: 'bold' }} cursor={{ fill: '#1e293b' }} />
                        <Bar dataKey="count" fill="#ea580c" radius={[4, 4, 0, 0]} barSize={28} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Pie Chart: Pipeline Status */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl shadow-xl flex flex-col">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Pipeline Distribution</h3>
                  <div className="h-[280px] w-full relative flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartDataStatus} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={4} dataKey="value" stroke="none">
                          {chartDataStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '11px', color: '#f8fafc' }} itemStyle={{ fontWeight: 'bold' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-black text-white">{processedLeads.length}</span>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Total Leads</span>
                    </div>
                  </div>
                </div>

                {/* 3. Bar Chart: Executive Performance */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl col-span-1 lg:col-span-2 shadow-xl">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Executive Lead Allocation (Performance Base)</h3>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartDataExecutive} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} angle={-35} textAnchor="end" />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '11px', color: '#f8fafc' }} itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }} cursor={{ fill: '#1e293b' }} />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={28} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 4. Pie Chart: Project-Wise Breakdown */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl shadow-xl flex flex-col">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Project Demand Split</h3>
                  <div className="h-[280px] w-full relative flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartDataProject} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                          {chartDataProject.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[(index + 3) % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '11px', color: '#f8fafc' }} itemStyle={{ fontWeight: 'bold' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 5. Line Chart: Acquisition Trend */}
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl col-span-1 lg:col-span-3 shadow-xl">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Lead Generation Timeline Trend</h3>
                  <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartDataTrend} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', fontSize: '11px', color: '#f8fafc' }} itemStyle={{ color: '#10b981', fontWeight: 'bold' }} />
                        <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6, stroke: '#0f172a', strokeWidth: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
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
  <div className="flex items-center gap-2 mt-0.5">
    <p className="text-[11px] text-slate-500 font-mono">{l.phone}</p>
    <button onClick={() => copyToClipboard(l.phone)} className="text-slate-600 hover:text-orange-500">
      <Search className="h-3 w-3" />
    </button>
  </div>
  {(new Date(TODAY_STR) - new Date(l.lastFollowUp || l.dateCreated)) / (1000 * 3600 * 24) > 7 && (
    <span className="text-[9px] bg-rose-500/10 text-rose-500 font-black px-1.5 py-0.5 rounded uppercase tracking-wider mt-1 block w-fit">Stale Lead</span>
  )}
</td>                            <td className="p-4">
                              <p className="font-semibold text-slate-200">{l.project}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5 font-mono">Captured: {l.dateCreated}</p>
                            </td>
                            <td className="p-4">
                              <span className="bg-slate-900 border border-slate-855 text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold font-mono">{l.source}</span>
                            </td>
                            
                            <td className="p-4">
                              {["Admin", "Manager"].includes(currentUser.role) ? (
                                <select value={l.assignedTo} onChange={(e) => requestOwnerAssignmentPopup(l.id, e.target.value)} className="bg-slate-900 border border-slate-800 text-slate-200 rounded px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-orange-500 cursor-pointer max-w-[170px]">
                                  <option value="Unassigned">⚠️ Select Staff Member</option>
                                  <optgroup label="Corporate Managers">
                                    {users.filter(u => u.role === "Manager").map(u => (
                                      <option key={u.id} value={u.name}>{u.name} (Mgr)</option>
                                    ))}
                                  </optgroup>
                                  <optgroup label="Regional Roster Staff">
                                    {users.filter(u => ["Executive", "Telecaller"].includes(u.role)).map(u => (
                                      <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                                    ))}
                                  </optgroup>
                                </select>
                              ) : (
                                <span className="font-semibold text-slate-400 flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-slate-600" /> {l.assignedTo}</span>
                              )}
                            </td>

                            <td className="p-4">
                              <div className="flex flex-col gap-1">
                                <select value={l.status} onChange={(e) => requestStatusTransitionPopup(l.id, e.target.value)} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 font-bold text-xs text-slate-300 focus:outline-none cursor-pointer" style={{ color: SC[l.status]?.text || "#FFF" }}>
                                  {statuses.map(st => <option key={st} value={st}>{st}</option>)}
                                </select>
                                {l.status === "Site Visit Planned" && l.siteVisitTentativeDate && (
                                  <span className="text-[9px] text-purple-400 font-mono font-bold pl-1">📅 Planned: {l.siteVisitTentativeDate}</span>
                                )}
                              </div>
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
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">Corporate Asset Registry</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Track property inventory capacities, sales volume, and structural workflows.</p>
                </div>
                {currentUser.role === "Admin" && (
                  <button onClick={() => setIsProjectModalOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md w-fit">
                    <Plus className="h-4 w-4" /> Add Project
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleProjects.map(p => (
                  <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 relative overflow-hidden shadow-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-black text-white flex items-center gap-1.5"><Home className="h-4 w-4 text-slate-500" /> {p.name}</h3>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3 text-slate-600" /> {p.location} • <span className="font-bold text-orange-400">{p.branch}</span></p>
                      </div>
                      
                      {["Admin", "Manager"].includes(currentUser.role) ? (
                        <select 
                          value={p.status} 
                          onChange={(e) => handleProjectStatusChange(p.id, e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[10px] font-black focus:outline-none cursor-pointer"
                          style={{ color: PSC[p.status]?.text || "#FFF" }}
                        >
                          {PROJECT_STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                        </select>
                      ) : (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider" style={{ backgroundColor: PSC[p.status]?.bg, color: PSC[p.status]?.text }}>
                          {p.status}
                        </span>
                      )}
                    </div>

                    <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-855 text-xs space-y-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 font-medium">Inventory Structure Type:</span>
                        <span className="font-bold text-slate-300 uppercase tracking-wide bg-slate-950 px-1.5 py-0.5 rounded text-[10px]">{p.type}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 font-medium">Base Starting Capital:</span>
                        <span className="font-mono font-bold text-emerald-400">₹{p.price}L</span>
                      </div>
                      <div className="pt-1.5 border-t border-slate-850">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1">
                          <span>UNITS SOLD: {p.sold} / {p.units}</span>
                          <span className="font-mono text-orange-400">{Math.round((p.sold / p.units) * 100) || 0}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-orange-600 to-amber-400 h-full transition-all duration-500" style={{ width: `${(p.sold / p.units) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEWPORT 4: ADMIN HUB */}
          {activeTab === "users" && currentUser.role === "Admin" && (
            <div className="space-y-8 animate-fadeIn">
              
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl col-span-1 md:col-span-3">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider text-orange-400">
                    <Users className="h-4 w-4" /> Active Corporate Roster
                  </h3>
                  <p className="text-xs text-slate-400">Manage, modify, or revoke access for deployed team members.</p>
                </div>
                <div className="overflow-x-auto w-full pt-2">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-slate-500 font-bold border-b border-slate-900 uppercase">
                        <th className="pb-2">Personnel</th>
                        <th className="pb-2">Role & Branch</th>
                        <th className="pb-2">Contact Context</th>
                        <th className="pb-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-900/20 transition-all">
                          <td className="py-3 font-bold text-white flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-orange-400">{u.avatar}</div>
                            <div>
                              <p>{u.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono font-normal">ID: {u.id}</p>
                            </div>
                          </td>
                          <td className="py-3">
                            <p className="font-semibold text-orange-400">{u.role}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{u.branch}</p>
                          </td>
                          <td className="py-3 font-mono text-slate-400">
                            <p>{u.phone}</p>
                            <p className="text-[10px]">{u.email}</p>
                          </td>
                          <td className="py-3 text-right space-x-2">
                            <button onClick={() => openEditUserModal(u)} className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded border border-slate-800 transition-colors" title="Edit Profile">
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded border border-rose-500/20 transition-colors" title="Revoke Access">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl h-fit">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider text-orange-400">
                      <UserPlus className="h-4 w-4" /> Deploy New Corporate Profile
                    </h3>
                    <p className="text-xs text-slate-400">Build access credentials and assign tracking branch parameters into the localized memory store database.</p>
                  </div>

                  <form onSubmit={handleCreateUserSubmit} className="space-y-4 text-xs pt-1">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold">Full Name *</label>
                      <input type="text" required value={newUserForm.name} onChange={(e)=>setNewUserForm({...newUserForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-orange-500" placeholder="e.g. Anand R" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold">Username Prefix *</label>
                      <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden focus-within:border-orange-500">
                        <input type="text" required value={newUserForm.emailPrefix} onChange={(e)=>setNewUserForm({...newUserForm, emailPrefix: e.target.value})} className="w-full bg-transparent p-2.5 text-slate-200 focus:outline-none text-right pr-1" placeholder="anand" />
                        <span className="text-slate-500 font-bold pr-3 pl-1 shrink-0 font-mono">@desam</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold">Security Password *</label>
                      <input type="password" required value={newUserForm.pass} onChange={(e)=>setNewUserForm({...newUserForm, pass: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none" placeholder="••••••••" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold">System Privilege Level</label>
                        <select value={newUserForm.role} onChange={(e)=>setNewUserForm({...newUserForm, role: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-300 focus:outline-none">
                          {INITIAL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold">Branch Roster Boundary</label>
                        <select value={newUserForm.branch} disabled={newUserForm.role === "Admin"} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-300 focus:outline-none disabled:opacity-40">
                          {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold">Contact Phone Number</label>
                      <input type="text" value={newUserForm.phone} onChange={(e)=>setNewUserForm({...newUserForm, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 font-mono" placeholder="9840011234" />
                    </div>

                    <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-md mt-1">
                      Compile Profile Authorization
                    </button>
                  </form>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl h-fit">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider text-orange-400"><Upload className="h-4 w-4" /> SpreadSheet Excel/CSV Ingestion Engine</h3>
                    <p className="text-xs text-slate-400">Bulk map customer data streams. Paste matching rows directly using tabular block separations (`Name`, `Phone`, `Email`, `Project Name`).</p>
                  </div>

                  <form onSubmit={handleDataImportSubmit} className="space-y-4 pt-1">
                    <textarea 
                      rows={5} 
                      value={importText} 
                      onChange={(e)=>setImportText(e.target.value)} 
                      placeholder="Suresh Kumar&#9;9840011234&#9;suresh@gmail.com&#9;Vishal Virinchi&#9;Madurai&#9;65&#10;Lakshmi Rao&#9;9940022345&#9;lakshmi@yahoo.com&#9;GK Apartments&#9;Chennai&#9;85" 
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-mono leading-relaxed" 
                    />
                    <div className="bg-slate-900/40 border border-slate-855 rounded-xl p-3 flex gap-3 items-start text-xs text-slate-400">
                      <Info className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                      <p className="leading-relaxed">Verify that the spelling of your values under the **Project Name** column accurately maps into your static system project catalogs to prevent automatic routing warnings.</p>
                    </div>
                    <button type="submit" className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg">
                      <FileSpreadsheet className="h-4 w-4" /> Deploy Mass Ingestion Engine
                    </button>
                  </form>
                </div>
              </div>

            </div>
          )}

          {/* VIEWPORT 5: REPORTS CONSOLE */}
          {activeTab === "reports" && (
    <div className="space-y-8 animate-fadeIn w-full pb-20">
      {/* HEADER & EXPORT CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start md:items-center gap-4 w-full">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Performance Matrix Engine</h1>
          <p className="text-xs text-slate-400 mt-0.5">Audit overall corporate lead acquisition metrics and regional conversion curves.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap text-xs font-bold tracking-wide">
          <button onClick={() => executeDataExportSequence("excel")} className="flex items-center gap-1.5 bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-500/20 text-emerald-400 hover:text-white px-3 py-2 rounded-xl transition-all">
            <FileSpreadsheet className="h-3.5 w-3.5" /> EXCEL (.XLSX)
          </button>
          <button onClick={() => executeDataExportSequence("csv")} className="flex items-center gap-1.5 bg-blue-600/10 hover:bg-blue-600 border border-blue-500/20 text-blue-400 hover:text-white px-3 py-2 rounded-xl transition-all">
            <Upload className="h-3.5 w-3.5 transform rotate-180" /> CSV
          </button>
          <button onClick={() => executeDataExportSequence("pdf")} className="flex items-center gap-1.5 bg-rose-600/10 hover:bg-rose-600 border border-rose-500/20 text-rose-400 hover:text-white px-3 py-2 rounded-xl transition-all">
            <FileText className="h-3.5 w-3.5" /> PRINT-TEXT REPORT
          </button>
        </div>
      </div>

      {/* SOURCEWISE PERFORMANCE MATRIX */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-black text-orange-400 mb-4 uppercase tracking-widest">Lead Source Performance Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase">
                <th className="p-3">Source Channel</th>
                <th className="p-3 text-center">Total Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              {sourcewiseAnalysis.map(([source, stats]) => (
                <tr key={source} className="hover:bg-slate-900/50">
                  <td className="p-3 font-bold text-white">{source}</td>
                  <td className="p-3 text-center font-mono font-bold text-lg">{stats.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PROJECT CONVERSION EFFICIENCY */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-black text-emerald-400 mb-4 uppercase tracking-widest">Project Conversion Efficiency</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectwiseAnalysis.map(([project, stats]) => (
            <div key={project} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{project}</p>
              <div className="flex justify-between items-end">
                 <span className="text-2xl font-black text-white">{stats.converted}/{stats.total}</span>
                 <span className="text-[10px] font-mono text-emerald-500 font-bold">
                   {stats.total > 0 ? Math.round((stats.converted / stats.total) * 100) : 0}% Conversion
                 </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EXECUTIVE PIPELINE SUMMARY */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-xl">
        <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider text-orange-400 mb-4">
          <BarChart3 className="h-4 w-4" /> Executive Pipeline Summary Report
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-slate-500 font-bold border-b border-slate-900 uppercase">
                <th className="pb-2 pl-2">Executive Name</th>
                <th className="pb-2 text-center text-blue-400">Total</th>
                <th className="pb-2 text-center text-emerald-400">Bookings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-300">
              {executiveSummaryData.map((exec, idx) => (
                <tr key={idx} className="hover:bg-slate-900/20">
                  <td className="py-3 pl-2 font-bold text-white">{exec.name}</td>
                  <td className="py-3 text-center font-mono font-bold text-blue-400">{exec.total}</td>
                  <td className="py-3 text-center font-mono font-black text-emerald-400">{exec.bookings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )}

    {/* NEW SOURCEWISE PERFORMANCE MATRIX */}
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <h3 className="text-sm font-black text-orange-400 mb-4 uppercase tracking-widest">Lead Source Performance Matrix</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500 uppercase">
              <th className="p-3">Source Channel</th>
              <th className="p-3 text-center">Total Volume</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900 text-slate-300">
            {sourcewiseAnalysis.map(([source, stats]) => (
              <tr key={source} className="hover:bg-slate-900/50">
                <td className="p-3 font-bold text-white">{source}</td>
                <td className="p-3 text-center font-mono font-bold text-lg">{stats.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* NEW PROJECT CONVERSION EFFICIENCY */}
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <h3 className="text-sm font-black text-emerald-400 mb-4 uppercase tracking-widest">Project Conversion Efficiency</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projectwiseAnalysis.map(([project, stats]) => (
          <div key={project} className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{project}</p>
            <div className="flex justify-between items-end">
               <span className="text-2xl font-black text-white">{stats.converted}/{stats.total}</span>
               <span className="text-[10px] font-mono text-emerald-500 font-bold">
                 {stats.total > 0 ? Math.round((stats.converted / stats.total) * 100) : 0}% Conversion
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* EXECUTIVE PIPELINE SUMMARY */}
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-xl">
      <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider text-orange-400 mb-4">
        <BarChart3 className="h-4 w-4" /> Executive Pipeline Summary Report
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="text-slate-500 font-bold border-b border-slate-900 uppercase">
              <th className="pb-2 pl-2">Executive Name</th>
              <th className="pb-2 text-center text-blue-400">Total</th>
              <th className="pb-2 text-center text-emerald-400">Bookings</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900 text-slate-300">
            {executiveSummaryData.map((exec, idx) => (
              <tr key={idx} className="hover:bg-slate-900/20">
                <td className="py-3 pl-2 font-bold text-white">{exec.name}</td>
                <td className="py-3 text-center font-mono font-bold text-blue-400">{exec.total}</td>
                <td className="py-3 text-center font-mono font-black text-emerald-400">{exec.bookings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}
                
                {/* DATE RANGE REPORTING OPTION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-4 border-b border-slate-800/60">
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-orange-500" /> Report Start Date</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-orange-500 font-mono cursor-pointer" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-orange-500" /> Report End Date</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-orange-500 font-mono cursor-pointer" />
                  </div>
                </div>

                {/* EXISTING FILTERS */}
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
                      {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
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

              {/* NEW SECTION: EXECUTIVE PIPELINE SUMMARY REPORT (Date Filtered) */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-xl w-full animate-fadeIn">
                <div className="space-y-0.5 mb-4">
                  <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider text-orange-400">
                    <BarChart3 className="h-4 w-4" /> Executive Pipeline Summary Report
                  </h3>
                  <p className="text-xs text-slate-400">Aggregated breakdown of lead stages by assigned personnel based on the selected date parameters.</p>
                </div>
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="text-slate-500 font-bold border-b border-slate-900 uppercase">
                        <th className="pb-2 pl-2">Executive Name</th>
                        <th className="pb-2 text-center text-blue-400">Total Leads</th>
                        <th className="pb-2 text-center text-slate-300">Untouched (New)</th>
                        <th className="pb-2 text-center text-amber-400">Active Follow-up</th>
                        <th className="pb-2 text-center text-purple-400">Site Visits</th>
                        <th className="pb-2 text-center text-emerald-400">Bookings / Closed</th>
                        <th className="pb-2 text-center text-rose-400">Dead / Lost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {executiveSummaryData.map((exec, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/20">
                          <td className="py-3 pl-2 font-bold text-white">{exec.name}</td>
                          <td className="py-3 text-center font-mono font-bold text-blue-400">{exec.total}</td>
                          <td className="py-3 text-center font-mono">{exec.new}</td>
                          <td className="py-3 text-center font-mono text-amber-400/80">{exec.active}</td>
                          <td className="py-3 text-center font-mono text-purple-400/80">{exec.siteVisits}</td>
                          <td className="py-3 text-center font-mono font-black text-emerald-400">{exec.bookings}</td>
                          <td className="py-3 text-center font-mono text-rose-400/80">{exec.dead}</td>
                        </tr>
                      ))}
                      {executiveSummaryData.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-500 font-semibold italic">No data available for the selected parameters.</td>
                        </tr>
                      )}
                    </tbody>
                    {executiveSummaryData.length > 0 && (
                      <tfoot className="bg-slate-900/50 border-t border-slate-800 font-black">
                        <tr>
                          <td className="py-3 pl-2 text-white">SYSTEM AGGREGATE TOTALS</td>
                          <td className="py-3 text-center font-mono text-blue-400">{executiveSummaryData.reduce((acc, curr) => acc + curr.total, 0)}</td>
                          <td className="py-3 text-center font-mono">{executiveSummaryData.reduce((acc, curr) => acc + curr.new, 0)}</td>
                          <td className="py-3 text-center font-mono text-amber-400/80">{executiveSummaryData.reduce((acc, curr) => acc + curr.active, 0)}</td>
                          <td className="py-3 text-center font-mono text-purple-400/80">{executiveSummaryData.reduce((acc, curr) => acc + curr.siteVisits, 0)}</td>
                          <td className="py-3 text-center font-mono text-emerald-400">{executiveSummaryData.reduce((acc, curr) => acc + curr.bookings, 0)}</td>
                          <td className="py-3 text-center font-mono text-rose-400/80">{executiveSummaryData.reduce((acc, curr) => acc + curr.dead, 0)}</td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>

              {/* EXISTING LEDGER TABLE */}
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
              <button onClick={() => setCustomPopup({ isOpen: false, leadId: null, targetValue: "", type: "status", title: "", message: "" })} className="w-full bg-slate-900 hover:bg-slate-855 border border-slate-800 text-slate-400 hover:text-white py-2.5 rounded-xl transition-all">✕ Discard</button>
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

      {/* DIALOG EDIT USER RECORD */}
      {isEditUserModalOpen && editUserForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h2 className="text-base font-black text-white tracking-wide uppercase">Modify Corporate Profile</h2>
              <button onClick={() => { setIsEditUserModalOpen(false); setEditUserForm(null); }} className="text-slate-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUpdateUserSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Full Name *</label>
                <input type="text" required value={editUserForm.name} onChange={(e)=>setEditUserForm({...editUserForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-orange-500" />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Username / Email Prefix *</label>
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden focus-within:border-orange-500">
                  <input type="text" required value={editUserForm.email.split('@')[0]} onChange={(e)=>setEditUserForm({...editUserForm, email: `${e.target.value}@desam`})} className="w-full bg-transparent p-2.5 text-slate-200 focus:outline-none text-right pr-1" />
                  <span className="text-slate-500 font-bold pr-3 pl-1 shrink-0 font-mono">@desam</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Security Password *</label>
                <input type="password" required value={editUserForm.pass} onChange={(e)=>setEditUserForm({...editUserForm, pass: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">System Privilege Level</label>
                  <select value={editUserForm.role} onChange={(e)=>setEditUserForm({...editUserForm, role: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-300 focus:outline-none">
                    {INITIAL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Branch Roster Boundary</label>
                  <select value={editUserForm.branch} disabled={editUserForm.role === "Admin"} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-300 focus:outline-none disabled:opacity-40">
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Contact Phone Number</label>
                <input type="text" value={editUserForm.phone} onChange={(e)=>setEditUserForm({...editUserForm, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 font-mono" />
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white font-black py-3 rounded-xl uppercase tracking-wider transition-all shadow-md mt-2">
                Update Profile Authorization
              </button>
            </form>
          </div>
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
                <h3 className="text-xl font-black text-white">{selectedLead.name}</h3>
                <p className="text-xs text-slate-500 tracking-wide font-mono">Reference ID: #{selectedLead.id} • Assigned Agent: <span className="text-slate-300 font-bold">{selectedLead.assignedTo}</span></p>
                {selectedLead.siteVisitTentativeDate && (
                  <p className="text-xs font-black text-purple-400 mt-1 flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-xl w-fit">
                    <Calendar className="h-3.5 w-3.5" /> TENTATIVE WALKTHROUGH SCHEDULED FOR: {selectedLead.siteVisitTentativeDate}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">Milestone Status Track</label>
                  <select 
                    value={selectedLead.status} 
                    onChange={(e) => handleInlineMilestoneStatusChange(selectedLead.id, e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-black focus:outline-none focus:border-orange-500 cursor-pointer min-w-[150px]"
                    style={{ color: SC[selectedLead.status]?.text || "#FFF" }}
                  >
                    {statuses.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>

                {["Admin", "Manager"].includes(currentUser.role) && (
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">Staff Assignment Router</label>
                    <select 
                      value={selectedLead.assignedTo} 
                      onChange={(e) => requestOwnerAssignmentPopup(selectedLead.id, e.target.value)} 
                      className="bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3 py-1.5 text-xs font-black focus:outline-none focus:border-orange-500 cursor-pointer min-w-[180px]"
                    >
                      <option value="Unassigned">⚠️ Route Allocation Entity</option>
                      <optgroup label="Corporate Managers">
                        {users.filter(u => u.role === "Manager").map(u => (
                          <option key={u.id} value={u.name}>{u.name} (Mgr)</option>
                        ))}
                      </optgroup>
                      <optgroup label="Regional Roster Staff">
                        {users.filter(u => ["Executive", "Telecaller"].includes(u.role)).map(u => (
                          <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                )}
                <button onClick={() => setSelectedLead(null)} className="text-slate-500 hover:text-white font-bold text-sm bg-slate-900 border border-slate-855 p-2 rounded-xl mt-4 self-end">✕</button>
              </div>
            </div>

            {selectedLead.status === "Site Visit Planned" && (
              <form onSubmit={commitTentativeWalkthroughPlan} className="bg-purple-950/40 p-4 border border-purple-500/30 rounded-xl space-y-3 animate-slideDown text-xs">
                <div className="flex items-center gap-2 text-purple-400 font-black tracking-wide uppercase">
                  <Calendar className="h-4 w-4" /> Log Tentative Site Visit Date Parameters
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Tentative Target Walkthrough Date *</label>
                  <div className="flex gap-2">
                    <input 
                      type="date" 
                      required 
                      min={TODAY_STR}
                      value={tentativeWalkthroughDateInput} 
                      onChange={(e) => setTentativeWalkthroughDateInput(e.target.value)} 
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 font-mono focus:outline-none focus:border-purple-500 cursor-pointer" 
                    />
                    <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-black px-5 rounded-xl uppercase tracking-wider transition-colors shadow-md">
                      Save Itinerary
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* DIRECT CONTACT CHANNELS ACCESSIBILITY BAR */}
            <div className="bg-slate-900/80 p-4 border border-slate-855 rounded-xl space-y-2 text-xs">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Client Communication Channels</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-200">
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-855">
                  <span className="text-slate-500 font-mono font-bold text-[9px] uppercase">Primary:</span>
                  <span className="font-mono font-bold text-orange-400">{selectedLead.phone}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-855">
                  <span className="text-slate-500 font-mono font-bold text-[9px] uppercase">Alternate:</span>
                  <span className="font-mono text-slate-300">{selectedLead.altPhone || "Not Logged"}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-855 col-span-1 sm:col-span-2">
                  <span className="text-slate-500 font-mono font-bold text-[9px] uppercase">Email Address:</span>
                  <span className="font-medium text-slate-300 truncate">{selectedLead.email || "No digital address recorded"}</span>
                </div>
              </div>
            </div>

            {/* INFOGRAPHIC TREE GRAPH TIMELINE DESIGN */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" /> INTERACTION TIMELINE JOURNAL
                </h4>
                <span className="text-[10px] bg-slate-900 text-slate-400 px-2.5 py-0.5 rounded-full border border-slate-800 font-mono font-bold">
                  {selectedLead.history?.length || 0} Entries
                </span>
              </div>
              
              <div className="relative max-h-[280px] overflow-y-auto pr-2 scrollbar-thin space-y-0 pt-2 pl-2">
                <div className="absolute left-[56px] top-0 bottom-4 w-1.5 bg-gradient-to-b from-rose-500 via-orange-500 via-amber-500 to-teal-400 rounded-full"></div>
                
                {selectedLead.history && selectedLead.history.length > 0 ? (
                  selectedLead.history.map((log, index) => {
                    const stepNumber = selectedLead.history.length - index;
                    const stepString = stepNumber < 10 ? `0${stepNumber}` : `${stepNumber}`;
                    
                    const colorMap = [
                      { text: "text-rose-500", border: "border-rose-500/30", bg: "bg-rose-500", nodeRing: "ring-rose-500/20" },
                      { text: "text-orange-500", border: "border-orange-500/30", bg: "bg-orange-500", nodeRing: "ring-orange-500/20" },
                      { text: "text-amber-500", border: "border-amber-500/30", bg: "bg-amber-400", nodeRing: "ring-amber-500/20" },
                      { text: "text-teal-400", border: "border-teal-400/30", bg: "bg-teal-400", nodeRing: "ring-teal-400/20" }
                    ][index % 4];

                    return (
                      <div key={index} className="flex gap-4 items-center pb-5 last:pb-2 group animate-fadeIn">
                        <div className={`w-10 font-mono font-black text-xs text-right tracking-wider pr-1 shrink-0 ${colorMap.text}`}>STEP</div>
                        <div className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center font-black text-[10px] text-slate-950 ring-4 shadow-md z-10 font-mono ${colorMap.bg} ${colorMap.nodeRing}`}>{stepString}</div>
                        <div className={`flex-1 bg-slate-900/50 border ${colorMap.border} p-3 rounded-xl relative hover:bg-slate-900 transition-all space-y-1`}>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                            <h5 className="font-black text-white text-[11px] uppercase tracking-wide">Log Origin: <span className={colorMap.text}>{log.by}</span></h5>
                            <span className="text-[9px] font-bold text-slate-500 font-mono bg-slate-950 px-1.5 py-0.5 rounded">{log.date}</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed font-sans font-medium pl-1.5 border-l border-slate-800">{log.action}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500 italic text-center py-6">No workflow trail tracked inside state storage parameters yet.</p>
                )}
              </div>
            </div>

            {/* PRIVILEGE ACTIONS DETAILED OVERVIEWS */}
            {!["Admin", "Manager"].includes(currentUser.role) && (
              <div className="space-y-5 text-xs">
                <div className="bg-slate-900 p-4 border border-slate-855 rounded-xl grid grid-cols-2 gap-4 font-semibold text-slate-300">
                  <div><p className="text-slate-500 text-[10px] font-bold uppercase">Project Context</p><p className="text-white mt-0.5 font-bold">{selectedLead.project}</p></div>
                  <div><p className="text-slate-500 text-[10px] font-bold uppercase">Financial Intent</p><p className="text-emerald-400 mt-0.5 font-bold font-mono">₹{selectedLead.budget}L Base</p></div>
                  <div className="col-span-2"><p className="text-slate-500 text-[10px] font-bold uppercase">Initial Requirements Notes</p><p className="text-slate-300 font-normal mt-0.5 italic">"{selectedLead.notes || 'No custom details logged.'}"</p></div>
                </div>

                <form onSubmit={commitManualFollowUpReport} className="bg-slate-900/50 p-4 border border-slate-855 rounded-xl space-y-3">
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

                <div className="bg-slate-900/50 p-4 border border-slate-855 rounded-xl space-y-3">
                  <p className="text-[11px] font-black uppercase text-amber-400 tracking-wider">Verify Physical Site Walkthrough</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1"><label className="text-slate-400 text-[10px]">Tour Date</label><input type="date" value={svDate} onChange={(e)=>setSvDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200 font-mono" /></div>
                    <div className="space-y-1"><label className="text-slate-400 text-[10px]">Attended Family Co-Buyers</label><input type="text" value={svFamily} onChange={(e)=>setSvFamily(e.target.value)} placeholder=" Spouse" className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200" /></div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-top text-[10px]">Site Walkthrough Feedback Notes *</label>
                    <textarea rows={1} value={svFeedback} onChange={(e)=>setSvFeedback(e.target.value)} placeholder="Enter design layout parameters..." className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none" />
                  </div>
                  <button type="button" onClick={commitSiteWalkthroughLog} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 rounded-xl uppercase tracking-wider">Commit Walkthrough Verification</button>
                </div>

                <div className="bg-slate-900/50 p-4 border border-slate-855 rounded-xl space-y-3">
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

            {duplicateConflictRecord && (
              <div className="absolute inset-x-6 top-16 bottom-6 bg-slate-950/95 border border-rose-500/40 rounded-xl p-5 z-20 flex flex-col justify-between space-y-3 backdrop-blur-md animate-scaleUp">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 font-black tracking-wide text-xs">
                    <AlertTriangle className="h-5 w-5 animate-bounce" /> ⚠️ WARNING: DUPLICATE PHONE NUMBER DETECTED
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    The contact number <span className="text-white font-black font-mono bg-slate-900 px-1.5 py-0.5 rounded">{duplicateConflictRecord.phone}</span> is already logged inside the database.
                  </p>
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-rose-300 font-semibold">Existing Customer:</span>
                      <span className="text-white font-bold">{duplicateConflictRecord.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-rose-300 font-semibold">Assigned Handler:</span>
                      <span className="text-white font-bold">{duplicateConflictRecord.assignedTo}</span>
                    </div>
                  </div>
                </div>
                <button type="button" onClick={() => setDuplicateConflictRecord(null)} className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 rounded-xl uppercase transition-colors">Modify Entry Parameters</button>
              </div>
            )}

            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Client Target Name *</label>
                  <input type="text" required value={newLeadForm.name} onChange={(e)=>setNewLeadForm({...newLeadForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-orange-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Attribution Channel Source</label>
                  <select value={newLeadForm.source} onChange={(e)=>setNewLeadForm({...newLeadForm, source: e.target.value})} className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-xl text-slate-300 focus:outline-none">
                    {sources.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Primary Contact Phone *</label>
                  <input 
                    type="text" 
                    required 
                    value={newLeadForm.phone} 
                    onChange={(e) => handlePhoneInputChange(e.target.value, false)} 
                    placeholder="e.g. 9840011234"
                    className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-xl text-slate-200 font-mono font-bold tracking-wider focus:outline-none focus:border-orange-500" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Alternate Contact Number</label>
                  <input 
                    type="text" 
                    value={newLeadForm.altPhone} 
                    onChange={(e) => handlePhoneInputChange(e.target.value, true)} 
                    className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-xl text-slate-200 font-mono focus:outline-none focus:border-orange-500" 
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Target Project</label>
                <select value={newLeadForm.project} onChange={(e)=>setNewLeadForm({...newLeadForm, project: e.target.value})} className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-xl text-slate-300 focus:outline-none">
                  {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              
              <button type="submit" disabled={!!duplicateConflictRecord} className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black py-3 rounded-xl uppercase tracking-wider shadow-lg disabled:opacity-40">Commit Ingest Record</button>
            </form>
          </div>
        </div>
      )}

      {/* DIALOG NEW CORPORATE PROJECT INGEST BLOCK */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <h2 className="text-base font-black text-white tracking-wide uppercase">Add New Corporate Project Asset</h2>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Project Name *</label>
                <input type="text" required value={newProjectForm.name} onChange={(e)=>setNewProjectForm({...newProjectForm, name: e.target.value})} className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-orange-500" placeholder="e.g. Vishal Virinchi Phase II" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Location Parameter *</label>
                  <input type="text" required value={newProjectForm.location} onChange={(e)=>setNewProjectForm({...newProjectForm, location: e.target.value})} className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-xl text-slate-200 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Allocated Team Desk Branch</label>
                  <select value={newProjectForm.branch} onChange={(e)=>setNewProjectForm({...newProjectForm, branch: e.target.value})} className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-xl text-slate-300 focus:outline-none">
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Scheme Type</label>
                  <select value={newProjectForm.type} onChange={(e)=>setNewProjectForm({...newProjectForm, type: e.target.value})} className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-xl text-slate-300 focus:outline-none">
                    {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Base Price (₹ Lakhs)</label>
                  <input type="number" value={newProjectForm.price} onChange={(e)=>setNewProjectForm({...newProjectForm, price: e.target.value})} className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-xl text-slate-200 font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Live Lifecycle Track</label>
                  <select value={newProjectForm.status} onChange={(e)=>setNewProjectForm({...newProjectForm, status: e.target.value})} className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-xl text-slate-300 focus:outline-none">
                    {PROJECT_STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Total Stock Units</label>
                  <input type="number" value={newProjectForm.units} onChange={(e)=>setNewProjectForm({...newProjectForm, units: e.target.value})} className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-xl text-slate-200" />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Initial Sold Units</label>
                  <input type="number" value={newProjectForm.sold} onChange={(e)=>setNewProjectForm({...newProjectForm, sold: e.target.value})} className="w-full bg-slate-900 border border-slate-855 p-2.5 rounded-xl text-slate-200" />
                </div>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black py-3 rounded-xl uppercase tracking-wider shadow-lg">Deploy Project Asset</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
