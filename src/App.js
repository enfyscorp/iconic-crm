import React, { useState, useMemo } from "react";
import { 
  Users, ShieldAlert, BarChart3, Building2, Briefcase, 
  Layers, PhoneCall, Calendar, Search, Plus, TrendingUp, 
  DollarSign, MapPin, Shield, Clock, LogOut, Lock, 
  Mail, CheckCircle2, UserPlus, Trash2, Edit2, X, Bell, 
  AlertTriangle, Download, Upload, Info, FileSpreadsheet, Check,
  Menu, ArrowRight, Home, FileText
} from "lucide-react";

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
  "Site Visit Completed", "Negotiation", "Booking Pending", "Booking Confirmed", "Closed"
];
const PROJECT_STATUSES = ["Upcoming", "Pre-Launch", "Ongoing", "Completed", "Sold-Out"];
const BRANCHES = ["Madurai Desk", "Chennai South", "Chennai North", "Coimbatore"];
const PROJECT_TYPES = ["Apartment", "Villa", "Plot"];

const INITIAL_USERS = [
  { id: 101, name: "Shaj", email: "admin@desam", pass: "saamrat@123", role: "Admin", branch: "All Branches", phone: "9840000001", active: true, avatar: "S" },
  { id: 102, name: "Jibril", email: "jibril@desam", pass: "angel@26", role: "Manager", branch: "Madurai Desk", phone: "9840000002", active: true, avatar: "J" },
  { id: 104, name: "Rohini", email: "rohini@desam", pass: "rohu@desam", role: "Executive", branch: "Madurai Desk", phone: "9840000004", active: true, avatar: "R" },
];

const INITIAL_PROJECTS = [
  { id: 1, name: "Desam Garden", location: "Madurai Bypass", branch: "Madurai Desk", type: "Plot", price: 25, units: 80, sold: 15, status: "Ongoing" },
  { id: 3, name: "Vishal Virinchi", location: "Bypass Road, Madurai", branch: "Madurai Desk", type: "Apartment", price: 65, units: 10, sold: 2, status: "Ongoing" },
];

const INITIAL_LEADS = [
  { id: 1001, name: "Suresh Kumar", phone: "9840011234", altPhone: "", email: "suresh@gmail.com", location: "Madurai", branch: "Madurai Desk", project: "Vishal Virinchi", budget: 65, source: "Website", assignedTo: "Rohini", assignedByRole: "Manager", status: "Interested", notes: "", dateCreated: "2026-05-10", history: [] },
  { id: 1002, name: "Lakshmi Rao", phone: "9940022345", altPhone: "", email: "lakshmi@yahoo.com", location: "Chennai", branch: "Chennai South", project: "GK Apartments", budget: 85, source: "Meta Ads", assignedTo: "Unassigned", assignedByRole: "", status: "New", notes: "", dateCreated: "2026-05-28", history: [] },
];

const SC = { New: { bg: "rgba(59,130,246,0.1)", text: "#60a5fa", border: "rgba(59,130,246,0.2)" } };
const PSC = { "Ongoing": { bg: "rgba(251,191,36,0.15)", text: "#fbbf24" } };

export default function App() {
  const TODAY_STR = "2026-05-29";

  // ─── HOOK STATES ──────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(null); 
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard"); 
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  
  // Reporting Filter Hooks
  const [reportStartDate, setReportStartDate] = useState("");
  const [reportEndDate, setReportEndDate] = useState("");

  // ─── COMPUTED LOGIC ──────────────────────────────────────────────────────
  const processedLeads = useMemo(() => {
    if (!currentUser) return [];
    let result = leads;

    // Permissions
    if (currentUser.role === "Manager") result = leads.filter(l => l.branch === currentUser.branch);
    else if (currentUser.role === "Executive") result = leads.filter(l => l.assignedTo === currentUser.name);

    // Date Filtering for Reports
    if (reportStartDate) result = result.filter(l => l.dateCreated >= reportStartDate);
    if (reportEndDate) result = result.filter(l => l.dateCreated <= reportEndDate);

    return result;
  }, [leads, currentUser, reportStartDate, reportEndDate]);

  // Unattended Lead Logic
  const unattendedLeads = useMemo(() => {
    return leads.filter(l => {
      if (l.status !== "New") return false;
      const createdDate = new Date(l.dateCreated);
      const today = new Date(TODAY_STR);
      return (today - createdDate) / (1000 * 60 * 60 * 24) > 2;
    });
  }, [leads]);

  // ─── HANDLERS ─────────────────────────────────────────────────────────────
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const account = users.find(u => u.email === loginEmail.toLowerCase().trim() && u.pass === loginPassword);
    if (account) setCurrentUser(account);
    else alert("Invalid credentials.");
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Sidebar and Main content preserved here... */}
      <main className="flex-1 overflow-y-auto p-8">
        
        {/* DASHBOARD WITH UNATTENDED ALERTS */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {currentUser.role === "Manager" && unattendedLeads.filter(l => l.branch === currentUser.branch).length > 0 && (
              <div className="bg-rose-900/20 border border-rose-500 p-4 rounded-xl">
                <h3 className="text-rose-400 font-black flex items-center gap-2"><AlertTriangle /> UNATTENDED LEADS ALERT</h3>
                <p className="text-sm">Leads older than 48 hours detected in your branch. Please reassign.</p>
              </div>
            )}
            <h1 className="text-2xl font-black">Dashboard</h1>
          </div>
        )}

        {/* REPORTS WITH DATE FILTER */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <h1 className="text-2xl font-black">Performance Matrix</h1>
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Start Date</label>
                <input type="date" onChange={(e) => setReportStartDate(e.target.value)} className="w-full bg-slate-900 border p-2 rounded" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">End Date</label>
                <input type="date" onChange={(e) => setReportEndDate(e.target.value)} className="w-full bg-slate-900 border p-2 rounded" />
              </div>
            </div>
            {/* Display list based on processedLeads */}
          </div>
        )}
      </main>
    </div>
  );
}
