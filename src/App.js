import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
import {
  Users, ShieldAlert, BarChart3, Building2, Briefcase,
  Layers, PhoneCall, Calendar, Search, Plus, TrendingUp,
  DollarSign, MapPin, Shield, Clock, LogOut, Lock,
  Mail, CheckCircle2, UserPlus, Trash2, Edit2, X, Bell,
  AlertTriangle, Download, Upload, Info, FileSpreadsheet, Check,
  Menu, ArrowRight, Home, FileText, ArrowLeft, ClipboardList,
  Phone, UserCheck, BookOpen, Banknote, XCircle, Activity,
  Table2, Eye, RefreshCw, AlertCircle, HelpCircle, KeyRound,
  ShieldCheck, RotateCcw, Send, PhoneOff, Star, MessageSquare
} from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Area
} from "recharts";

// ─── BRAND ────────────────────────────────────────────────────────────────
const DESAM_LOGO_ASSET = "/DESAM-NEW-LOGO.png";

const ADMIN_SUPPORT_EMAIL = "enfyscorp@gmail.com";
const maskEmail = (email) => {
  if (!email) return "••••@desam";
  const [local, domain] = email.split("@");
  if (!local || local.length <= 2) return `••@${domain}`;
  return `${local[0]}${"•".repeat(Math.max(local.length - 2, 2))}${local[local.length - 1]}@${domain}`;
};

// ─── STATIC CONSTANTS ─────────────────────────────────────────────────────
const ROLES = ["Admin", "Manager", "Executive", "Telecaller"];
const SOURCES = [
  "Website","Meta Ads","Google Ads","Direct Enquiry","Walk-In",
  "Reference","Expo / Event","Own Leads","WhatsApp Campaign","Property Portals",
  "99acres","Just Dial","Olx","Office Leads","924000"
];
const STATUSES = [
  "New","Assigned","Contacted","Follow-Up","Site Visit Planned",
  "Site Visit Completed","Negotiation","Booking Pending","Booking Confirmed",
  "Closed","Not Interested","RNR","Switched Off","Wrong Number"
];
const PROJECT_STATUSES = ["Upcoming","Pre-Launch","Ongoing","Completed","Sold-Out"];
const BRANCHES = ["Madurai Desk","Chennai South","Chennai North","Coimbatore"];
const PROJECT_TYPES = ["Apartment","Villa","Plot"];
const CALL_STATUSES = ["Warm","Cold","Not Reachable","Callback Requested"];
const PIE_COLORS = ['#ea580c','#3b82f6','#10b981','#8b5cf6','#ec4899','#f59e0b','#64748b','#14b8a6','#ef4444','#06b6d4','#a3e635','#fb923c'];

// ─── ADMIN CREDENTIALS (hardcoded — never stored in DB) ───────────────────
// Only these two admins are kept in code. All other users come from storage.
const HARDCODED_ADMINS = [
  { id: 101, name: "Shaj", email: "admin@desam", pass: "saamrat@123", role: "Admin", branch: "All Branches", phone: "9840000001", active: true, avatar: "S" },
  { id: 110, name: "Digital Marketing", email: "dm@desam", pass: "m@rketing", role: "Admin", branch: "All Branches", phone: "9840000001", active: true, avatar: "D" },
];

// ─── BOOTSTRAP NON-ADMIN USERS (loaded once into storage if empty) ────────
const BOOTSTRAP_NON_ADMIN_USERS = [
  { id: 102, name: "Jibril", email: "jibril@desam", pass: "angel@26", role: "Manager", branch: "Madurai Desk", phone: "9840000002", active: true, avatar: "J" },
  { id: 103, name: "AryaLakshmi", email: "arya@lakshmi", pass: "manager123", role: "Manager", branch: "Madurai Desk", phone: "9840000003", active: true, avatar: "A" },
  { id: 104, name: "Rohini", email: "rohini@desam", pass: "rohu@desam", role: "Executive", branch: "Madurai Desk", phone: "9840000004", active: true, avatar: "R" },
  { id: 105, name: "Priyadarshini", email: "priya@desam", pass: "agent123", role: "Executive", branch: "Madurai Desk", phone: "9840000005", active: true, avatar: "P" },
  { id: 106, name: "Arun", email: "arun@desam", pass: "arun@desam", role: "Executive", branch: "Madurai Desk", phone: "9840000006", active: true, avatar: "A" },
  { id: 107, name: "Sumathi", email: "sumathi@desam", pass: "caller123", role: "Telecaller", branch: "Madurai Desk", phone: "9840000007", active: true, avatar: "S" },
  { id: 108, name: "Shakila", email: "shakila@desam", pass: "caller123", role: "Telecaller", branch: "Madurai Desk", phone: "9840000008", active: true, avatar: "S" },
  { id: 109, name: "Gowshika", email: "gowshika@desam", pass: "caller123", role: "Telecaller", branch: "Madurai Desk", phone: "9840000009", active: true, avatar: "G" },
];

const BOOTSTRAP_PROJECTS = [
  { id: 1, name: "Desam Garden", location: "Madurai Bypass", branch: "Madurai Desk", type: "Plot", price: 25, units: 80, sold: 15, status: "Ongoing" },
  { id: 2, name: "Fairland", location: "Uthangudi, Madurai", branch: "Madurai Desk", type: "Villa", price: 95, units: 35, sold: 8, status: "Ongoing" },
  { id: 3, name: "Vishal Virinchi", location: "Bypass Road, Madurai", branch: "Madurai Desk", type: "Apartment", price: 65, units: 10, sold: 2, status: "Ongoing" },
  { id: 4, name: "GK Apartments", location: "Velachery, Chennai", branch: "Chennai South", type: "Apartment", price: 85, units: 120, sold: 45, status: "Completed" },
  { id: 5, name: "Anbu Desam", location: "Saravanampatti, CBE", branch: "Coimbatore", type: "Villa", price: 140, units: 40, sold: 12, status: "Pre-Launch" },
  { id: 6, name: "Alagar Homes", location: "Alagar Kovil Road, Madurai", branch: "Madurai Desk", type: "Apartment", price: 55, units: 60, sold: 10, status: "Ongoing" },
];

// ─── STORAGE HELPERS ──────────────────────────────────────────────────────
const SK = {
  nonAdminUsers: "desam_crm_non_admin_users",  // Only non-admin users in storage
  projects: "desam_crm_projects",
  leads: "desam_crm_leads",
  activityLogs: "desam_crm_activity_logs",
  resetRequests: "desam_crm_reset_requests",
};

async function storageGet(key) {
  try {
    const r = await window.storage.get(key);
    return r ? JSON.parse(r.value) : null;
  } catch { return null; }
}
async function storageSet(key, value) {
  try { await window.storage.set(key, JSON.stringify(value)); } catch {}
}

// ─── STATUS COLORS ────────────────────────────────────────────────────────
const SC = {
  New: { bg: "rgba(59,130,246,0.1)", text: "#60a5fa", border: "rgba(59,130,246,0.2)" },
  Assigned: { bg: "rgba(16,185,129,0.1)", text: "#34d399", border: "rgba(16,185,129,0.2)" },
  Contacted: { bg: "rgba(245,158,11,0.1)", text: "#fbbf24", border: "rgba(245,158,11,0.2)" },
  "Follow-Up": { bg: "rgba(236,72,153,0.1)", text: "#f472b6", border: "rgba(236,72,153,0.2)" },
  "Site Visit Planned": { bg: "rgba(139,92,246,0.1)", text: "#a78bfa", border: "rgba(139,92,246,0.2)" },
  "Booking Confirmed": { bg: "rgba(52,211,153,0.15)", text: "#34d399", border: "rgba(52,211,153,0.3)" },
  Closed: { bg: "rgba(107,114,128,0.1)", text: "#9ca3af", border: "rgba(107,114,128,0.2)" },
  "Not Interested": { bg: "rgba(239,68,68,0.1)", text: "#ef4444", border: "rgba(239,68,68,0.2)" },
  RNR: { bg: "rgba(156,163,175,0.1)", text: "#9ca3af", border: "rgba(156,163,175,0.2)" },
  "Switched Off": { bg: "rgba(156,163,175,0.1)", text: "#9ca3af", border: "rgba(156,163,175,0.2)" },
  "Wrong Number": { bg: "rgba(248,113,113,0.1)", text: "#f87171", border: "rgba(248,113,113,0.2)" },
};
const PSC = {
  Upcoming: { bg: "rgba(147,197,253,0.15)", text: "#93c5fd" },
  "Pre-Launch": { bg: "rgba(244,114,182,0.15)", text: "#f472b6" },
  Ongoing: { bg: "rgba(251,191,36,0.15)", text: "#fbbf24" },
  Completed: { bg: "rgba(52,211,153,0.15)", text: "#34d399" },
  "Sold-Out": { bg: "rgba(239,68,68,0.15)", text: "#ef4444" },
};

// ─── EXCEL DATE PARSER ────────────────────────────────────────────────────
const MONTH_MAP = { jan:"01",feb:"02",mar:"03",apr:"04",may:"05",jun:"06",jul:"07",aug:"08",sep:"09",oct:"10",nov:"11",dec:"12" };
function parseExcelDate(raw, defaultYear = "2026") {
  if (!raw && raw !== 0) return "";
  if (typeof raw === "number") {
    try { const d = XLSX.SSF.parse_date_code(raw); if (d) return `${d.y||parseInt(defaultYear)}-${String(d.m).padStart(2,"0")}-${String(d.d).padStart(2,"0")}`; } catch {}
    return "";
  }
  const str = String(raw).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const m1 = str.match(/^(\d{1,2})[-\/\s]([A-Za-z]+)(?:[-\/\s](\d{2,4}))?$/);
  if (m1) { const day=String(m1[1]).padStart(2,"0"); const mon=MONTH_MAP[m1[2].toLowerCase().slice(0,3)]||"01"; let yr=defaultYear; if(m1[3]){yr=m1[3].length===2?"20"+m1[3]:m1[3];} return `${yr}-${mon}-${day}`; }
  const m2 = str.match(/^([A-Za-z]+)[-\/\s](\d{1,2})(?:[-\/\s](\d{2,4}))?$/);
  if (m2) { const mon=MONTH_MAP[m2[1].toLowerCase().slice(0,3)]||"01"; const day=String(m2[2]).padStart(2,"0"); let yr=defaultYear; if(m2[3])yr=m2[3].length===2?"20"+m2[3]:m2[3]; return `${yr}-${mon}-${day}`; }
  const m3 = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (m3) { const yr=m3[3].length===2?"20"+m3[3]:m3[3]; return `${yr}-${String(m3[2]).padStart(2,"0")}-${String(m3[1]).padStart(2,"0")}`; }
  return str;
}
function normaliseSource(raw) {
  if (!raw) return "Own Leads"; const s=String(raw).trim(); const lower=s.toLowerCase();
  if(lower.includes("walk"))return "Walk-In"; if(lower.includes("99"))return "99acres"; if(lower.includes("just"))return "Just Dial";
  if(lower.includes("meta")||lower.includes("fb")||lower.includes("facebook"))return "Meta Ads"; if(lower.includes("google"))return "Google Ads";
  if(lower.includes("website"))return "Website"; if(lower.includes("olx"))return "Olx"; if(lower.includes("office"))return "Office Leads";
  if(lower.includes("whatsapp"))return "WhatsApp Campaign"; if(lower.includes("portal"))return "Property Portals";
  if(lower.includes("expo")||lower.includes("event"))return "Expo / Event"; if(lower.includes("direct")||lower.includes("enquiry"))return "Direct Enquiry";
  if(lower.includes("reference")||lower.includes("ref"))return "Reference"; if(lower.includes("924"))return "924000";
  return s||"Own Leads";
}
function normaliseCallStatus(raw) {
  if (!raw) return "Warm"; const s=String(raw).trim().toLowerCase();
  if(s.includes("cold"))return "Cold"; if(s.includes("not")||s.includes("reach"))return "Not Reachable"; if(s.includes("call")||s.includes("back"))return "Callback Requested";
  return "Warm";
}

// ─── MOBILE DETECTION ────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.innerWidth <= 768
    );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// ─── KPI TILE ─────────────────────────────────────────────────────────────
const KpiTile = ({ label, value, icon, color, sub }) => (
  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col gap-1">
    <div className="flex justify-between items-start">
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider leading-tight">{label}</p>
      <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${color}20` }}>
        {React.cloneElement(icon, { className: "h-3.5 w-3.5", style: { color } })}
      </div>
    </div>
    <p className="text-2xl font-black" style={{ color }}>{value}</p>
    {sub && <p className="text-[9px] text-slate-500 font-medium">{sub}</p>}
  </div>
);

// ─── MOBILE CALL BUTTON + FEEDBACK POPUP ─────────────────────────────────
function MobileCallButton({ phone, leadName, onFeedbackSaved, currentUser, TODAY_STR }) {
  const [callState, setCallState] = useState("idle"); // idle | calling | feedback
  const [callDuration, setCallDuration] = useState(0);
  const [feedback, setFeedback] = useState({ rating: 0, notes: "", outcome: "Contacted", followUpDate: "" });
  const timerRef = useRef(null);

  const startCall = () => {
    if (!phone) return;
    // Initiate phone call
    window.location.href = `tel:${phone}`;
    setCallState("calling");
    setCallDuration(0);
    // Start a timer to track how long since call was initiated
    timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
  };

  const endCall = () => {
    clearInterval(timerRef.current);
    setCallState("feedback");
  };

  const saveFeedback = () => {
    if (onFeedbackSaved) {
      onFeedbackSaved({
        ...feedback,
        callDuration,
        calledAt: new Date().toISOString(),
        phone,
        leadName,
      });
    }
    setCallState("idle");
    setFeedback({ rating: 0, notes: "", outcome: "Contacted", followUpDate: "" });
    setCallDuration(0);
  };

  const dismiss = () => {
    clearInterval(timerRef.current);
    setCallState("idle");
    setFeedback({ rating: 0, notes: "", outcome: "Contacted", followUpDate: "" });
    setCallDuration(0);
  };

  const formatDur = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <>
      {/* Call Button */}
      <button
        onClick={callState === "idle" ? startCall : endCall}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all shadow-md ${
          callState === "calling"
            ? "bg-rose-600 hover:bg-rose-700 text-white animate-pulse"
            : "bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-400 hover:text-white"
        }`}
        title={callState === "calling" ? "End call & give feedback" : `Call ${phone}`}
      >
        {callState === "calling" ? (
          <><PhoneOff className="h-3.5 w-3.5" /> End Call {callDuration > 0 && `(${formatDur(callDuration)})`}</>
        ) : (
          <><Phone className="h-3.5 w-3.5" /> Call</>
        )}
      </button>

      {/* Post-Call Feedback Popup */}
      {callState === "feedback" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[300] flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-900/40 to-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Call Feedback</h3>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {leadName} • {phone}
                    {callDuration > 0 && <span className="text-emerald-400 ml-1">• {formatDur(callDuration)}</span>}
                  </p>
                </div>
              </div>
              <button onClick={dismiss} className="text-slate-500 hover:text-white p-1.5 hover:bg-slate-900 rounded-lg transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Star Rating */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Call Quality</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setFeedback(f => ({ ...f, rating: star }))}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          feedback.rating >= star ? "text-amber-400 fill-amber-400" : "text-slate-700"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Outcome */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Call Outcome</label>
                <select
                  value={feedback.outcome}
                  onChange={e => setFeedback(f => ({ ...f, outcome: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Follow-up date */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Next Follow-up Date</label>
                <input
                  type="date"
                  value={feedback.followUpDate}
                  min={TODAY_STR}
                  onChange={e => setFeedback(f => ({ ...f, followUpDate: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Notes</label>
                <textarea
                  rows={2}
                  value={feedback.notes}
                  onChange={e => setFeedback(f => ({ ...f, notes: e.target.value }))}
                  placeholder="What was discussed? Any next steps?"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={dismiss}
                  className="py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={saveFeedback}
                  className="py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 text-white transition-all shadow-lg"
                >
                  Save Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── EXCEL IMPORT PANEL ───────────────────────────────────────────────────
function ExcelImportPanel({ activityLogs, setActivityLogs, triggerToastAlert }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [parseErrors, setParseErrors] = useState([]);
  const [yearOverride, setYearOverride] = useState("2026");
  const [replaceMode, setReplaceMode] = useState("append");
  const [isDragging, setIsDragging] = useState(false);

  const resetState = () => { setPreview(null); setParseErrors([]); if (fileRef.current) fileRef.current.value = ""; };

  const mapRowToLog = useCallback((row, idx) => {
    const errors = [];
    const get = (arrIdx, ...keys) => {
      if (Array.isArray(row)) return row[arrIdx];
      for (const k of keys) { if (row[k] !== undefined && row[k] !== null && row[k] !== "") return row[k]; }
      return undefined;
    };
    const rawDate = get(0,"Date","DATE","date");
    const dateStr = parseExcelDate(rawDate, yearOverride);
    if (!dateStr) errors.push(`Row ${idx+2}: date "${rawDate}" could not be parsed`);
    const executive = String(get(1,"Executive/Tel","Executive","EXECUTIVE","Tel","executive")||"").trim();
    if (!executive) errors.push(`Row ${idx+2}: executive name is blank`);
    const project = String(get(2,"Project","PROJECT","project")||"").trim();
    const source = normaliseSource(get(3,"Source","SOURCE","source"));
    const callsMade = parseInt(get(4,"Calls made","Calls Made","CALLS MADE","calls_made","callsMade")||0)||0;
    const callStatus = normaliseCallStatus(get(5,"Status","Call Status","CALL STATUS","callStatus","status"));
    const followup = parseInt(get(6,"Followup","Follow up","FOLLOWUP","followup")||0)||0;
    const siteVisit = parseInt(get(7,"Site visit","Site Visit","SITE VISIT","siteVisit")||0)||0;
    const booking = parseInt(get(8,"Booking","BOOKING","booking")||0)||0;
    const registration = parseInt(get(9,"Registration","REGISTRATION","registration")||0)||0;
    const cancellation = parseInt(get(10,"Cancellation","CANCELLATION","cancellation")||0)||0;
    const collection = parseInt(get(11,"Collection","COLLECTION","collection")||0)||0;
    const remark = String(get(12,"Remark","REMARK","remark","Remarks","REMARKS")||"").trim();
    return { log:{ id:Date.now()+idx+Math.floor(Math.random()*9999), date:dateStr, executive, project, source, callsMade, callStatus, followup, siteVisit, booking, registration, cancellation, collection, remark }, errors };
  }, [yearOverride]);

  const parseFile = useCallback((file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type:"array", cellDates:false });
        let sheetName = wb.SheetNames[0];
        for (const sn of wb.SheetNames) { if (sn.toLowerCase()==="data") { sheetName=sn; break; } }
        const ws = wb.Sheets[sheetName];
        const rawRows = XLSX.utils.sheet_to_json(ws,{ header:1, raw:true, defval:"", blankrows:false });
        if (rawRows.length < 2) { setParseErrors(["File appears empty or has only a header row."]); setPreview(null); return; }
        const headerRow = rawRows[0];
        const firstCellIsHeader = typeof headerRow[0]==="string" && isNaN(headerRow[0]) && !/^\d{1,2}[-\/]/.test(String(headerRow[0]).trim());
        const dataRows = firstCellIsHeader ? rawRows.slice(1) : rawRows;
        const allErrors = []; const parsed = [];
        dataRows.forEach((row, idx) => {
          if (row.every(c=>c===""||c===null||c===undefined)) return;
          const { log, errors } = mapRowToLog(row, idx);
          allErrors.push(...errors);
          if (log.executive && log.date) parsed.push(log);
        });
        setParseErrors(allErrors.slice(0,20));
        setPreview({ rows:parsed, sheetName, totalRaw:dataRows.length });
      } catch (err) { setParseErrors([`Failed to read file: ${err.message}`]); setPreview(null); }
    };
    reader.readAsArrayBuffer(file);
  }, [mapRowToLog]);

  const handleFileChange = (e) => { const file = e.target.files?.[0]; if (file) parseFile(file); };
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); const file=e.dataTransfer.files?.[0]; if(file) parseFile(file); };

  const confirmImport = () => {
    if (!preview || preview.rows.length === 0) return;
    let updated;
    if (replaceMode === "replace") {
      updated = preview.rows;
      triggerToastAlert(`Replaced all activity logs with ${preview.rows.length} imported records.`);
    } else {
      const existingKeys = new Set(activityLogs.map(l=>`${l.date}|${l.executive}|${l.project}|${l.source}|${l.callsMade}`));
      const newRows = preview.rows.filter(r=>!existingKeys.has(`${r.date}|${r.executive}|${r.project}|${r.source}|${r.callsMade}`));
      updated = [...activityLogs, ...newRows];
      const skipped = preview.rows.length - newRows.length;
      triggerToastAlert(`Imported ${newRows.length} records${skipped?`, skipped ${skipped} duplicates`:""}.`);
    }
    setActivityLogs(updated);
    resetState();
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-orange-400 flex items-center gap-2 uppercase tracking-wider"><FileSpreadsheet className="h-4 w-4" /> Excel Database Import</h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Upload Activity Log Excel (.xlsx/.xls/.csv) — auto-detects "Data" sheet</p>
        </div>
        {preview && <button onClick={resetState} className="text-xs text-slate-500 hover:text-white flex items-center gap-1 border border-slate-800 px-3 py-1.5 rounded-lg bg-slate-900 transition-colors"><RefreshCw className="h-3.5 w-3.5" /> Reset</button>}
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="space-y-1"><label className="text-slate-500 font-bold uppercase text-[9px] tracking-wider">Default Year</label><select value={yearOverride} onChange={e=>setYearOverride(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none">{["2024","2025","2026","2027"].map(y=><option key={y} value={y}>{y}</option>)}</select></div>
        <div className="space-y-1"><label className="text-slate-500 font-bold uppercase text-[9px] tracking-wider">Import Mode</label><select value={replaceMode} onChange={e=>setReplaceMode(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"><option value="append">Append (skip duplicates)</option><option value="replace">⚠️ Replace all existing logs</option></select></div>
      </div>
      {!preview && (
        <div onDragOver={e=>{e.preventDefault();setIsDragging(true);}} onDragLeave={()=>setIsDragging(false)} onDrop={handleDrop} onClick={()=>fileRef.current?.click()} className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragging?"border-orange-500 bg-orange-500/5":"border-slate-700 hover:border-orange-500/60 hover:bg-slate-900/60"}`}>
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileChange} className="hidden" />
          <div className="flex flex-col items-center gap-3">
            <div className="h-14 w-14 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center"><Upload className="h-6 w-6 text-orange-400" /></div>
            <div><p className="text-sm font-black text-white">Drop your Excel file here</p><p className="text-[11px] text-slate-500 mt-1">or click to browse — supports .xlsx, .xls, .csv</p></div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-[10px] text-slate-400 font-mono">Date · Executive/Tel · Project · Source · Calls made · Status · Followup · Site visit · Booking · Registration · Cancellation · Collection · Remark</div>
          </div>
        </div>
      )}
      {parseErrors.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 space-y-1.5">
          <p className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Parse Warnings ({parseErrors.length})</p>
          {parseErrors.map((e,i)=><p key={i} className="text-[10px] text-amber-200/70 font-mono pl-2">{e}</p>)}
        </div>
      )}
      {preview && preview.rows.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black px-3 py-1 rounded-lg">✓ {preview.rows.length} rows ready</span>
            <span className="text-slate-500">sheet: <span className="text-slate-300 font-bold">"{preview.sheetName}"</span></span>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
            <table className="w-full text-[10px] border-collapse">
              <thead><tr className="border-b border-slate-800 text-slate-500 uppercase font-bold"><th className="p-2 text-left">Date</th><th className="p-2 text-left">Executive</th><th className="p-2 text-left">Project</th><th className="p-2 text-left">Source</th><th className="p-2 text-center">Calls</th><th className="p-2 text-center">Status</th><th className="p-2 text-center">FU</th><th className="p-2 text-center">SV</th><th className="p-2 text-center">BK</th><th className="p-2 text-center">Reg</th><th className="p-2 text-left min-w-[140px]">Remark</th></tr></thead>
              <tbody className="divide-y divide-slate-900">{preview.rows.slice(0,10).map((r,i)=><tr key={i} className="hover:bg-slate-900/60"><td className="p-2 font-mono text-slate-400">{r.date}</td><td className="p-2 font-bold text-white">{r.executive}</td><td className="p-2 text-orange-400">{r.project}</td><td className="p-2 text-slate-400">{r.source}</td><td className="p-2 text-center font-mono font-bold text-white">{r.callsMade}</td><td className="p-2 text-center"><span className={`px-1.5 py-0.5 rounded font-black ${r.callStatus==="Warm"?"bg-amber-500/10 text-amber-400":"bg-slate-700/30 text-slate-400"}`}>{r.callStatus}</span></td><td className="p-2 text-center text-blue-400">{r.followup||""}</td><td className="p-2 text-center text-emerald-400">{r.siteVisit||""}</td><td className="p-2 text-center text-purple-400">{r.booking||""}</td><td className="p-2 text-center text-amber-400">{r.registration||""}</td><td className="p-2 text-slate-400 max-w-[140px] truncate" title={r.remark}>{r.remark}</td></tr>)}</tbody>
            </table>
            {preview.rows.length > 10 && <p className="text-center text-[10px] text-slate-500 py-2 border-t border-slate-800">… and {preview.rows.length-10} more rows</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={resetState} className="py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">✕ Cancel</button>
            <button onClick={confirmImport} className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg text-white ${replaceMode==="replace"?"bg-rose-600 hover:bg-rose-700":"bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700"}`}>{replaceMode==="replace"?`⚠️ Replace with ${preview.rows.length} Records`:`✓ Import ${preview.rows.length} Records`}</button>
          </div>
        </div>
      )}
      {preview && preview.rows.length === 0 && (
        <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-4 text-center">
          <AlertCircle className="h-6 w-6 text-rose-400 mx-auto mb-2" />
          <p className="text-xs font-bold text-rose-400">No valid rows found.</p>
          <button onClick={resetState} className="mt-3 text-xs text-orange-400 hover:text-orange-300 font-bold">Try another file</button>
        </div>
      )}
    </div>
  );
}

// ─── ADMIN RESET REQUESTS PANEL ───────────────────────────────────────────
// Shows pending reset requests. Admin can see user info + generated OTP to
// hand over in-person or by phone. No email needed.
function AdminResetRequestsPanel({ resetRequests, setResetRequests, triggerToastAlert }) {
  const [copiedId, setCopiedId] = useState(null);
  const now = Date.now();
  const active = resetRequests.filter(r => r.expiresAt > now && !r.consumed);
  const expired = resetRequests.filter(r => r.expiresAt <= now || r.consumed);

  const formatTimeLeft = (expiresAt) => {
    const left = Math.max(0, Math.floor((expiresAt - now) / 1000));
    if (left === 0) return "Expired";
    return `${String(Math.floor(left/60)).padStart(2,"0")}:${String(left%60).padStart(2,"0")}`;
  };

  const copyOtp = (req) => {
    navigator.clipboard.writeText(req.otp);
    setCopiedId(req.id);
    triggerToastAlert("OTP copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearExpired = () => {
    const updated = resetRequests.filter(r => r.expiresAt > now && !r.consumed);
    setResetRequests(updated);
    triggerToastAlert("Expired/consumed requests cleared.");
  };

  if (resetRequests.length === 0) {
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <h3 className="text-sm font-black text-orange-400 flex items-center gap-2 uppercase tracking-wider mb-4">
          <KeyRound className="h-4 w-4" /> Password Reset Requests
        </h3>
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <div className="h-12 w-12 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-slate-600" />
          </div>
          <p className="text-xs text-slate-500 font-medium">No pending reset requests.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-orange-400 flex items-center gap-2 uppercase tracking-wider">
          <KeyRound className="h-4 w-4" /> Password Reset Requests
          {active.length > 0 && (
            <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse">
              {active.length} PENDING
            </span>
          )}
        </h3>
        {expired.length > 0 && (
          <button onClick={handleClearExpired} className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1 border border-slate-800 px-2.5 py-1.5 rounded-lg bg-slate-900 transition-colors">
            <Trash2 className="h-3 w-3" /> Clear expired
          </button>
        )}
      </div>

      {/* Instructions banner */}
      {active.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2">
          <Info className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-amber-300/80 leading-relaxed">
            Share the OTP below with the user <span className="font-black text-amber-200">directly (in-person or by phone)</span>. They will enter it in the password reset screen. No email required.
          </p>
        </div>
      )}

      {/* Active Requests */}
      {active.length > 0 && (
        <div className="space-y-4">
          {active.map(req => (
            <div key={req.id} className="bg-slate-900/60 border border-orange-500/20 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-black text-orange-400 text-sm flex-shrink-0">
                    {req.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">{req.userName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{req.userEmail}</p>
                    <p className="text-[9px] text-slate-600 mt-0.5 font-bold uppercase tracking-wider">{req.userRole}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[9px] text-slate-500 uppercase font-bold">Expires in</p>
                  <p className="text-sm font-black text-amber-400 font-mono">{formatTimeLeft(req.expiresAt)}</p>
                </div>
              </div>

              {/* OTP Display — large and prominent */}
              <div className="bg-slate-950 border-2 border-orange-500/30 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">One-Time Password — Share with user</p>
                  <p className="text-3xl font-black text-white tracking-[0.4em] font-mono mt-1">{req.otp}</p>
                </div>
                <button
                  onClick={() => copyOtp(req)}
                  className={`p-2.5 rounded-xl border transition-all ${
                    copiedId === req.id
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                      : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white"
                  }`}
                  title="Copy OTP"
                >
                  {copiedId === req.id ? <Check className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                </button>
              </div>

              <p className="text-[9px] text-slate-600 font-mono">
                Requested: {new Date(req.requestedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Expired / Consumed */}
      {expired.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Expired / Used</p>
          {expired.map(req => (
            <div key={req.id} className="bg-slate-900/30 border border-slate-800/60 rounded-xl p-3 flex items-center gap-3 opacity-50">
              <div className="h-7 w-7 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-xs flex-shrink-0">
                {req.userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-400">{req.userName}</p>
                <p className="text-[10px] text-slate-600 font-mono">{req.userEmail}</p>
              </div>
              <span className="text-[9px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded font-black uppercase">
                {req.consumed ? "Used" : "Expired"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ADMIN LOGIN RESET POPUP ─────────────────────────────────────────────
// Shown when admin logs in and there are pending reset requests
function AdminLoginResetPopup({ count, onGoToHub, onDismiss }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[500] flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-orange-500/30 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-900/30 to-slate-900 border-b border-slate-800 p-5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center animate-pulse">
            <KeyRound className="h-5 w-5 text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wide">Reset Requests Pending</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Requires your attention</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-rose-950/30 border border-rose-500/20 rounded-xl p-4 text-center space-y-2">
            <p className="text-4xl font-black text-rose-400">{count}</p>
            <p className="text-xs font-bold text-slate-300">
              {count === 1 ? "user has" : "users have"} requested a password reset.
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Go to System Control Hub to view the OTPs and share them with the users directly.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onDismiss}
              className="py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              Later
            </button>
            <button
              onClick={onGoToHub}
              className="py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white transition-all shadow-lg flex items-center justify-center gap-1.5"
            >
              <ArrowRight className="h-3.5 w-3.5" /> Go to Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PASSWORD RESET MODAL ─────────────────────────────────────────────────
// Simplified: Step 1 = username, Step 2 = OTP (get from admin directly), Step 3 = new pass, Step 4 = done
// No email/phone OTP dispatch — request goes straight to admin panel.
function PasswordResetModal({ users, setUsers, resetRequests, setResetRequests, onClose }) {
  const [step, setStep] = useState(1); // 1=username, 2=wait+enter OTP, 3=newpass, 4=done
  const [email, setEmail] = useState("");
  const [currentReqId, setCurrentReqId] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpTimeLeft, setOtpTimeLeft] = useState(300);
  const [otpExpiry, setOtpExpiry] = useState(null);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [targetUser, setTargetUser] = useState(null);

  // Live countdown
  useEffect(() => {
    if (step !== 2 || !otpExpiry) return;
    const interval = setInterval(() => {
      const left = Math.max(0, Math.floor((otpExpiry - Date.now()) / 1000));
      setOtpTimeLeft(left);
      if (left === 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, otpExpiry]);

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  // Step 1: verify username — pushes request to admin panel immediately
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError("");
    const trimmed = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === trimmed && u.active);
    if (!found) { setError("No active account found with this username."); return; }
    setTargetUser(found);

    // Generate OTP & push to admin panel right away
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiry = Date.now() + 5 * 60 * 1000;
    const reqId = Date.now();

    const newReq = {
      id: reqId,
      userName: found.name,
      userEmail: found.email,
      userRole: found.role,
      otp: code,
      requestedAt: Date.now(),
      expiresAt: expiry,
      consumed: false,
    };

    setResetRequests(prev => [newReq, ...prev]);
    setCurrentReqId(reqId);
    setOtpExpiry(expiry);
    setOtpTimeLeft(300);
    setStep(2);
  };

  // Step 2: verify OTP the user received from admin
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (otpTimeLeft === 0) { setError("OTP has expired. Please start over."); return; }
    const req = resetRequests.find(r => r.id === currentReqId);
    if (!req || req.otp !== otp.trim()) { setError("Incorrect OTP. Please check with your admin and try again."); return; }
    setResetRequests(prev => prev.map(r => r.id === currentReqId ? { ...r, consumed: true } : r));
    setStep(3);
  };

  const handleResendOtp = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiry = Date.now() + 5 * 60 * 1000;
    const reqId = Date.now();
    const newReq = {
      id: reqId,
      userName: targetUser.name,
      userEmail: targetUser.email,
      userRole: targetUser.role,
      otp: code,
      requestedAt: Date.now(),
      expiresAt: expiry,
      consumed: false,
    };
    setResetRequests(prev => [newReq, ...prev]);
    setCurrentReqId(reqId);
    setOtpExpiry(expiry);
    setOtpTimeLeft(300);
    setOtp("");
    setError("");
  };

  // Step 3: new password
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (newPass.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (newPass !== confirmPass) { setError("Passwords do not match."); return; }
    setUsers(users.map(u => u.id === targetUser.id ? { ...u, pass: newPass } : u));
    setStep(4);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wide">Password Reset</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {step === 1 && "Enter your account username"}
                {step === 2 && "Contact admin for your OTP"}
                {step === 3 && "Set a new password"}
                {step === 4 && "Reset complete"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1.5 hover:bg-slate-900 rounded-lg"><X className="h-5 w-5" /></button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-900/40 border-b border-slate-800/60">
          {[1,2,3,4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                step > s ? "bg-emerald-500 text-white" :
                step === s ? "bg-orange-500 text-white ring-4 ring-orange-500/20" :
                "bg-slate-800 text-slate-500"
              }`}>
                {step > s ? <Check className="h-3 w-3" /> : s}
              </div>
              {s < 4 && <div className={`h-0.5 w-8 sm:w-14 rounded-full transition-all ${step > s ? "bg-emerald-500/60" : "bg-slate-800"}`} />}
            </div>
          ))}
        </div>

        <div className="p-6 space-y-5">

          {/* ── STEP 1: Username ── */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-4 text-xs">
              <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-3 flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-blue-300/80 leading-relaxed">
                  Enter your <span className="font-black text-blue-200">account username</span>. A one-time code will be sent to your <span className="font-black text-blue-200">system admin</span> — contact them to receive it.
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Account Username</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text" required value={email}
                    onChange={e => { setEmail(e.target.value); setError(""); }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500 font-mono"
                    placeholder="username@desam" autoComplete="off"
                  />
                </div>
              </div>
              {error && <p className="text-rose-400 font-bold bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20 flex items-center gap-2"><AlertCircle className="h-4 w-4 shrink-0" />{error}</p>}
              <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white font-black py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-lg text-xs">
                Request Reset
              </button>
            </form>
          )}

          {/* ── STEP 2: Wait for admin + enter OTP ── */}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-4 text-xs">
              {/* User card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-bold text-orange-400 text-xs flex-shrink-0">
                  {targetUser?.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white">Reset requested for: <span className="text-orange-400">{targetUser?.name}</span></p>
                  <p className="text-[10px] text-slate-500 font-mono">{targetUser?.email}</p>
                </div>
              </div>

              {/* Admin notification banner */}
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <p className="text-[11px] text-emerald-200 font-bold">
                    Request forwarded to Admin Panel
                  </p>
                </div>
                <p className="text-[10px] text-emerald-400/70 pl-9 leading-relaxed">
                  Your admin has been notified. <span className="font-black text-emerald-300">Contact your System Administrator</span> to get the 6-digit OTP code. Expires in:
                </p>
                <div className={`pl-9 font-mono font-black text-lg ${otpTimeLeft < 60 ? "text-rose-400 animate-pulse" : "text-emerald-300"}`}>
                  {formatTime(otpTimeLeft)}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">6-Digit OTP (from Admin)</label>
                <input
                  type="text" required maxLength={6}
                  value={otp}
                  onChange={e => { setOtp(e.target.value.replace(/\D/g,"")); setError(""); }}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-orange-500 font-mono font-black text-center text-2xl tracking-[0.5em]"
                  placeholder="——————"
                  autoComplete="one-time-code"
                />
              </div>

              {error && <p className="text-rose-400 font-bold bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20 flex items-center gap-2"><AlertCircle className="h-4 w-4 shrink-0" />{error}</p>}

              <button type="submit" disabled={otp.length < 6 || otpTimeLeft === 0} className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-lg text-xs">
                Verify OTP
              </button>

              <div className="flex items-center justify-between pt-1">
                <button type="button" onClick={() => { setStep(1); setError(""); setOtp(""); }} className="text-slate-500 hover:text-slate-300 text-[11px] font-bold flex items-center gap-1 transition-colors">
                  <ArrowLeft className="h-3 w-3" /> Back
                </button>
                {otpTimeLeft === 0 ? (
                  <button type="button" onClick={handleResendOtp} className="text-orange-400 hover:text-orange-300 text-[11px] font-black flex items-center gap-1 transition-colors">
                    <RotateCcw className="h-3 w-3" /> Request New OTP
                  </button>
                ) : (
                  <span className="text-slate-600 text-[10px] font-mono">Resend after expiry</span>
                )}
              </div>
            </form>
          )}

          {/* ── STEP 3: New Password ── */}
          {step === 3 && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-emerald-300/80 leading-relaxed">
                  Identity verified for <span className="font-black text-emerald-200">{targetUser?.name}</span>. Choose a strong new password — minimum 6 characters.
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input type="password" required minLength={6} value={newPass} onChange={e => { setNewPass(e.target.value); setError(""); }} className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500" placeholder="Min. 6 characters" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input type="password" required value={confirmPass} onChange={e => { setConfirmPass(e.target.value); setError(""); }} className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500" placeholder="Re-enter password" />
                </div>
                {newPass && confirmPass && (
                  <p className={`text-[10px] font-bold flex items-center gap-1 ${newPass === confirmPass ? "text-emerald-400" : "text-rose-400"}`}>
                    {newPass === confirmPass ? <><Check className="h-3 w-3" /> Passwords match</> : <><X className="h-3 w-3" /> Passwords do not match</>}
                  </p>
                )}
              </div>
              {error && <p className="text-rose-400 font-bold bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20 flex items-center gap-2"><AlertCircle className="h-4 w-4 shrink-0" />{error}</p>}
              <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 text-white font-black py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-lg text-xs">
                Set New Password
              </button>
            </form>
          )}

          {/* ── STEP 4: Success ── */}
          {step === 4 && (
            <div className="text-center space-y-5 py-4">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                </div>
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-black text-white">Password Updated!</h4>
                <p className="text-xs text-slate-400">
                  Password for <span className="font-bold text-slate-200">{targetUser?.name}</span> has been successfully reset. You can now log in with the new credentials.
                </p>
              </div>
              <button onClick={onClose} className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white font-black py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-lg text-xs">
                Back to Login
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const TODAY_STR = new Date().toISOString().slice(0,10);
  const isMobile = useIsMobile();

  const [storageReady, setStorageReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  // Admin login popup — shown once after admin logs in if there are pending reset requests
  const [showAdminLoginPopup, setShowAdminLoginPopup] = useState(false);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [navHistory, setNavHistory] = useState([]);
  const [globalSearch, setGlobalSearch] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [filterSource, setFilterSource] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterProject, setFilterProject] = useState("All");
  const [filterExecutive, setFilterExecutive] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [actFilterExec, setActFilterExec] = useState("All");
  const [actFilterProject, setActFilterProject] = useState("All");
  const [actFilterSource, setActFilterSource] = useState("All");
  const [actFilterStatus, setActFilterStatus] = useState("All");
  const [actStartDate, setActStartDate] = useState("");
  const [actEndDate, setActEndDate] = useState("");

  const [leads, setLeadsState] = useState([]);
  // nonAdminUsers: all non-admin users from storage
  const [nonAdminUsers, setNonAdminUsersState] = useState([]);
  const [projects, setProjectsState] = useState([]);
  const [activityLogs, setActivityLogsState] = useState([]);
  const [resetRequests, setResetRequestsState] = useState([]);

  // ── Merged users view: hardcoded admins + DB non-admins ──────────────────
  const users = useMemo(() => [...HARDCODED_ADMINS, ...nonAdminUsers], [nonAdminUsers]);

  const setLeads = useCallback((val) => { const data = typeof val === "function" ? val(leads) : val; setLeadsState(data); storageSet(SK.leads, data); }, [leads]);

  // setUsers: only persists the non-admin subset; admins stay in code
  const setUsers = useCallback((val) => {
    const allData = typeof val === "function" ? val(users) : val;
    const nonAdmins = allData.filter(u => u.role !== "Admin");
    setNonAdminUsersState(nonAdmins);
    storageSet(SK.nonAdminUsers, nonAdmins);
  }, [users]);

  const setProjects = useCallback((val) => { const data = typeof val === "function" ? val(projects) : val; setProjectsState(data); storageSet(SK.projects, data); }, [projects]);
  const setActivityLogs = useCallback((val) => { const data = typeof val === "function" ? val(activityLogs) : val; setActivityLogsState(data); storageSet(SK.activityLogs, data); }, [activityLogs]);
  const setResetRequests = useCallback((val) => {
    setResetRequestsState(prev => {
      const data = typeof val === "function" ? val(prev) : val;
      storageSet(SK.resetRequests, data);
      return data;
    });
  }, []);

  // Bootstrap: load non-admin users from storage (or seed from bootstrap)
  useEffect(() => {
    (async () => {
      let nonAdmins = await storageGet(SK.nonAdminUsers);
      // Migration: if old key "desam_crm_users" exists, migrate non-admins from it
      if (!nonAdmins) {
        const oldUsers = await storageGet("desam_crm_users");
        if (oldUsers) {
          nonAdmins = oldUsers.filter(u => u.role !== "Admin");
        } else {
          nonAdmins = BOOTSTRAP_NON_ADMIN_USERS;
        }
        await storageSet(SK.nonAdminUsers, nonAdmins);
      }

      let p = await storageGet(SK.projects);
      let l = await storageGet(SK.leads);
      let a = await storageGet(SK.activityLogs);
      let r = await storageGet(SK.resetRequests);

      if (!p) { p = BOOTSTRAP_PROJECTS; await storageSet(SK.projects, p); }
      if (!l) { l = []; await storageSet(SK.leads, l); }
      if (!a) { a = []; await storageSet(SK.activityLogs, a); }
      if (!r) { r = []; await storageSet(SK.resetRequests, r); }

      setNonAdminUsersState(nonAdmins);
      setProjectsState(p);
      setLeadsState(l);
      setActivityLogsState(a);
      setResetRequestsState(r);
      setStorageReady(true);
    })();
  }, []);

  const [selectedLead, setSelectedLead] = useState(null);
  const [importText, setImportText] = useState("");
  const [customPopup, setCustomPopup] = useState({ isOpen:false, leadId:null, targetValue:"", type:"status", title:"", message:"" });
  const [toastNotification, setToastNotification] = useState({ isVisible:false, message:"" });
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isActivityLogModalOpen, setIsActivityLogModalOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({ name:"", phone:"", altPhone:"", email:"", location:"", project:"", budget:25, source:"Website", assignedTo:"Unassigned", notes:"" });
  const [newProjectForm, setNewProjectForm] = useState({ name:"", location:"", branch:"Madurai Desk", type:"Plot", price:30, units:50, sold:0, status:"Pre-Launch" });
  const [newUserForm, setNewUserForm] = useState({ name:"", emailPrefix:"", pass:"", role:"Executive", branch:"Madurai Desk", phone:"" });
  const [newActivityForm, setNewActivityForm] = useState({ date:TODAY_STR, executive:"", project:"", source:"Own Leads", callsMade:0, callStatus:"Warm", followup:0, siteVisit:0, booking:0, registration:0, cancellation:0, collection:0, remark:"" });
  const [duplicateConflictRecord, setDuplicateConflictRecord] = useState(null);
  const [followUpNotes, setFollowUpNotes] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [svDate, setSvDate] = useState("");
  const [svFeedback, setSvFeedback] = useState("");
  const [svFamily, setSvFamily] = useState("");
  const [bkUnit, setBkUnit] = useState("");
  const [bkAmount, setBkAmount] = useState("");
  const [tentativeWalkthroughDateInput, setTentativeWalkthroughDateInput] = useState("");
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editUserForm, setEditUserForm] = useState(null);

  const setActivityLogsWrapped = useCallback((val) => {
    setActivityLogsState(prev => {
      const data = typeof val === "function" ? val(prev) : val;
      storageSet(SK.activityLogs, data);
      return data;
    });
  }, []);

  const navigateTo = useCallback((tab) => { setNavHistory(prev=>[...prev,activeTab]); setActiveTab(tab); setIsMobileMenuOpen(false); }, [activeTab]);
  const navigateBack = useCallback(() => {
    setNavHistory(prev => { if(prev.length===0)return prev; const h=[...prev]; const last=h.pop(); setActiveTab(last); return h; });
  }, []);

  useEffect(() => {
    window.history.pushState({inApp:true},"");
    const h=()=>{ window.history.pushState({inApp:true},""); if(navHistory.length>0){setNavHistory(prev=>{const h=[...prev];const l=h.pop();setActiveTab(l);return h;});}};
    window.addEventListener("popstate",h);
    return ()=>window.removeEventListener("popstate",h);
  }, [navHistory]);

  const stripPhone = (val) => { if(!val)return""; return val.toString().replace(/\s+/g,"").replace(/\D/g,""); };
  const copyToClipboard = (text) => { navigator.clipboard.writeText(text); triggerToastAlert("Copied!"); };
  const triggerToastAlert = (msg) => { setToastNotification({isVisible:true,message:msg}); setTimeout(()=>setToastNotification({isVisible:false,message:""}),3500); };

  const visibleProjects = useMemo(()=>{ if(!currentUser)return[]; if(currentUser.role==="Admin")return projects; return projects.filter(p=>p.branch===currentUser.branch); },[projects,currentUser]);
  const visibleUsers = useMemo(()=>{ if(!currentUser)return[]; if(currentUser.role==="Admin")return users; return users.filter(u=>u.branch===currentUser.branch); },[users,currentUser]);

  const processedLeads = useMemo(()=>{
    if(!currentUser)return[];
    let result=leads;
    if(currentUser.role==="Manager")result=leads.filter(l=>l.branch===currentUser.branch);
    else if(["Executive","Telecaller"].includes(currentUser.role))result=leads.filter(l=>l.assignedTo===currentUser.name);
    if(globalSearch.trim()){const t=globalSearch.toLowerCase();result=result.filter(l=>l.name.toLowerCase().includes(t)||l.phone.includes(t)||l.project.toLowerCase().includes(t)||l.status.toLowerCase().includes(t));}
    if(filterSource!=="All")result=result.filter(l=>l.source===filterSource);
    if(filterStatus!=="All")result=result.filter(l=>l.status===filterStatus);
    if(filterProject!=="All")result=result.filter(l=>l.project===filterProject);
    if(["Admin","Manager"].includes(currentUser.role)&&filterExecutive!=="All")result=result.filter(l=>l.assignedTo===filterExecutive);
    if(startDate)result=result.filter(l=>l.dateCreated>=startDate);
    if(endDate)result=result.filter(l=>l.dateCreated<=endDate);
    return result;
  },[leads,currentUser,globalSearch,filterSource,filterStatus,filterProject,filterExecutive,startDate,endDate]);

  const filteredActivityLogs = useMemo(()=>{
    let logs=activityLogs;
    if(currentUser&&!["Admin","Manager"].includes(currentUser.role))logs=logs.filter(l=>l.executive===currentUser.name);
    if(actFilterExec!=="All")logs=logs.filter(l=>l.executive===actFilterExec);
    if(actFilterProject!=="All")logs=logs.filter(l=>l.project===actFilterProject);
    if(actFilterSource!=="All")logs=logs.filter(l=>l.source===actFilterSource);
    if(actFilterStatus!=="All")logs=logs.filter(l=>l.callStatus===actFilterStatus);
    if(actStartDate)logs=logs.filter(l=>l.date>=actStartDate);
    if(actEndDate)logs=logs.filter(l=>l.date<=actEndDate);
    return logs.sort((a,b)=>b.date.localeCompare(a.date));
  },[activityLogs,currentUser,actFilterExec,actFilterProject,actFilterSource,actFilterStatus,actStartDate,actEndDate]);

  const activityKPIs = useMemo(()=>{
    const totalCalls=filteredActivityLogs.reduce((s,l)=>s+(l.callsMade||0),0);
    const totalFollowups=filteredActivityLogs.reduce((s,l)=>s+(l.followup||0),0);
    const totalSiteVisits=filteredActivityLogs.reduce((s,l)=>s+(l.siteVisit||0),0);
    const totalBookings=filteredActivityLogs.reduce((s,l)=>s+(l.booking||0),0);
    const totalRegistrations=filteredActivityLogs.reduce((s,l)=>s+(l.registration||0),0);
    const totalCancellations=filteredActivityLogs.reduce((s,l)=>s+(l.cancellation||0),0);
    const totalCollection=filteredActivityLogs.reduce((s,l)=>s+(l.collection||0),0);
    const convRate=totalCalls>0?((totalBookings/totalCalls)*100).toFixed(1):0;
    return{totalCalls,totalFollowups,totalSiteVisits,totalBookings,totalRegistrations,totalCancellations,totalCollection,convRate};
  },[filteredActivityLogs]);

  const callsTrendData = useMemo(()=>{ const map={}; filteredActivityLogs.forEach(l=>{if(!map[l.date])map[l.date]={date:l.date,calls:0,followups:0,siteVisits:0,bookings:0};map[l.date].calls+=l.callsMade||0;map[l.date].followups+=l.followup||0;map[l.date].siteVisits+=l.siteVisit||0;map[l.date].bookings+=l.booking||0;}); return Object.values(map).sort((a,b)=>a.date.localeCompare(b.date)); },[filteredActivityLogs]);
  const projectPerfData = useMemo(()=>{ const map={}; filteredActivityLogs.forEach(l=>{if(!map[l.project])map[l.project]={project:l.project,calls:0,followups:0,siteVisits:0,bookings:0};map[l.project].calls+=l.callsMade||0;map[l.project].followups+=l.followup||0;map[l.project].siteVisits+=l.siteVisit||0;map[l.project].bookings+=l.booking||0;}); return Object.values(map).sort((a,b)=>b.calls-a.calls); },[filteredActivityLogs]);
  const sourcewisePieData = useMemo(()=>{ const map={}; filteredActivityLogs.forEach(l=>{if(!map[l.source])map[l.source]=0;map[l.source]+=l.callsMade||0;}); return Object.entries(map).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value); },[filteredActivityLogs]);
  const execPerfChartData = useMemo(()=>{ const map={}; filteredActivityLogs.forEach(l=>{if(!map[l.executive])map[l.executive]={name:l.executive,calls:0,followups:0,siteVisits:0,bookings:0};map[l.executive].calls+=l.callsMade||0;map[l.executive].followups+=l.followup||0;map[l.executive].siteVisits+=l.siteVisit||0;map[l.executive].bookings+=l.booking||0;}); return Object.values(map).sort((a,b)=>b.calls-a.calls); },[filteredActivityLogs]);
  const execDetailedMatrix = useMemo(()=>{ const map={}; filteredActivityLogs.forEach(l=>{if(!map[l.executive])map[l.executive]={name:l.executive,calls:0,followups:0,siteVisits:0,bookings:0,registrations:0,cancellations:0,collection:0};map[l.executive].calls+=l.callsMade||0;map[l.executive].followups+=l.followup||0;map[l.executive].siteVisits+=l.siteVisit||0;map[l.executive].bookings+=l.booking||0;map[l.executive].registrations+=l.registration||0;map[l.executive].cancellations+=l.cancellation||0;map[l.executive].collection+=l.collection||0;}); return Object.values(map).sort((a,b)=>b.calls-a.calls); },[filteredActivityLogs]);

  const reportSummaryMatrix = useMemo(()=>{
    const projectNames=[...new Set(filteredActivityLogs.map(l=>l.project))].sort();
    const metrics=["Calls made","Followup","Site Visit","Booking","Registration","Cancellation"];
    const data={};metrics.forEach(m=>{data[m]={};projectNames.forEach(p=>{data[m][p]=0;});});
    filteredActivityLogs.forEach(l=>{ data["Calls made"][l.project]=(data["Calls made"][l.project]||0)+(l.callsMade||0); data["Followup"][l.project]=(data["Followup"][l.project]||0)+(l.followup||0); data["Site Visit"][l.project]=(data["Site Visit"][l.project]||0)+(l.siteVisit||0); data["Booking"][l.project]=(data["Booking"][l.project]||0)+(l.booking||0); data["Registration"][l.project]=(data["Registration"][l.project]||0)+(l.registration||0); data["Cancellation"][l.project]=(data["Cancellation"][l.project]||0)+(l.cancellation||0); });
    return{metrics,projectNames,data};
  },[filteredActivityLogs]);

  const sourcewiseMatrix = useMemo(()=>{ const execNames=[...new Set(filteredActivityLogs.map(l=>l.executive))].sort(); const srcNames=[...new Set(filteredActivityLogs.map(l=>l.source))].sort(); const data={}; srcNames.forEach(s=>{data[s]={};execNames.forEach(e=>{data[s][e]=0;})}); let srcTotals={}; filteredActivityLogs.forEach(l=>{if(data[l.source])data[l.source][l.executive]=(data[l.source][l.executive]||0)+(l.callsMade||0);srcTotals[l.source]=(srcTotals[l.source]||0)+(l.callsMade||0);}); return{execNames,srcNames,data,srcTotals}; },[filteredActivityLogs]);
  const projectwiseMatrix = useMemo(()=>{ const execNames=[...new Set(filteredActivityLogs.map(l=>l.executive))].sort(); const projNames=[...new Set(filteredActivityLogs.map(l=>l.project))].sort(); const data={}; projNames.forEach(p=>{data[p]={};execNames.forEach(e=>{data[p][e]=0;})}); let projTotals={}; filteredActivityLogs.forEach(l=>{if(data[l.project])data[l.project][l.executive]=(data[l.project][l.executive]||0)+(l.callsMade||0);projTotals[l.project]=(projTotals[l.project]||0)+(l.callsMade||0);}); return{execNames,projNames,data,projTotals}; },[filteredActivityLogs]);

  const dashboardActionQueueLeads = useMemo(()=>{
    if(!currentUser)return[];
    if(currentUser.role==="Admin")return leads.filter(l=>l.assignedTo==="Unassigned"||l.status==="Site Visit Planned");
    if(currentUser.role==="Manager")return leads.filter(l=>l.branch===currentUser.branch&&(l.assignedTo==="Unassigned"||l.assignedTo===currentUser.name||l.status==="Site Visit Planned"));
    if(["Executive","Telecaller"].includes(currentUser.role))return leads.filter(l=>l.assignedTo===currentUser.name);
    return[];
  },[leads,currentUser]);

  const unattendedManagerAlerts = useMemo(()=>{
    if(!currentUser||currentUser.role!=="Manager")return[];
    return leads.filter(l=>{ if(l.branch!==currentUser.branch||l.status!=="New")return false; return(new Date(TODAY_STR)-new Date(l.dateCreated))/(1000*60*60*24)>=2; });
  },[leads,currentUser]);

  const conversionRate = useMemo(()=>{ const booked=processedLeads.filter(l=>["Booking Confirmed","Closed"].includes(l.status)).length; return processedLeads.length>0?Math.round((booked/processedLeads.length)*100):0; },[processedLeads]);
  const executiveSummaryData = useMemo(()=>{ const execMap={}; visibleUsers.forEach(u=>{if(["Executive","Telecaller"].includes(u.role))execMap[u.name]={name:u.name,total:0,new:0,active:0,siteVisits:0,bookings:0,dead:0};}); execMap["Unassigned"]={name:"Unassigned",total:0,new:0,active:0,siteVisits:0,bookings:0,dead:0}; processedLeads.forEach(l=>{const exec=l.assignedTo||"Unassigned";if(!execMap[exec])execMap[exec]={name:exec,total:0,new:0,active:0,siteVisits:0,bookings:0,dead:0};execMap[exec].total+=1;if(l.status==="New")execMap[exec].new+=1;else if(["Assigned","Contacted","Follow-Up","Negotiation"].includes(l.status))execMap[exec].active+=1;else if(["Site Visit Planned","Site Visit Completed"].includes(l.status))execMap[exec].siteVisits+=1;else if(["Booking Pending","Booking Confirmed","Closed"].includes(l.status))execMap[exec].bookings+=1;else if(["Not Interested","RNR","Switched Off","Wrong Number"].includes(l.status))execMap[exec].dead+=1;}); return Object.values(execMap).filter(e=>e.total>0||visibleUsers.some(u=>u.name===e.name)).sort((a,b)=>b.total-a.total); },[processedLeads,visibleUsers]);
  const sourcewiseAnalysis = useMemo(()=>{ const data={}; processedLeads.forEach(l=>{if(!data[l.source])data[l.source]={total:0};data[l.source].total+=1;}); return Object.entries(data).sort((a,b)=>b[1].total-a[1].total); },[processedLeads]);
  const projectwiseAnalysis = useMemo(()=>{ const data={}; processedLeads.forEach(l=>{if(!data[l.project])data[l.project]={total:0,converted:0};data[l.project].total+=1;if(["Booking Confirmed","Closed"].includes(l.status))data[l.project].converted+=1;}); return Object.entries(data); },[processedLeads]);

  const handlePhoneInputChange = (val, isAlt=false) => {
    const clean=stripPhone(val);
    if(isAlt){setNewLeadForm({...newLeadForm,altPhone:clean});return;}
    setNewLeadForm({...newLeadForm,phone:clean});
    if(clean.length>=10){const dup=leads.find(l=>stripPhone(l.phone)===clean);if(dup){setDuplicateConflictRecord(dup);return;}}
    setDuplicateConflictRecord(null);
  };

  const handleInlineMilestoneStatusChange = (leadId, targetStatus) => {
    const log={date:TODAY_STR,by:currentUser.name,action:`Milestone shifted to [${targetStatus}].`};
    const updated=leads.map(l=>l.id===leadId?{...l,status:targetStatus,history:[log,...l.history]}:l);
    setLeads(updated);
    if(selectedLead&&selectedLead.id===leadId)setSelectedLead(prev=>({...prev,status:targetStatus,history:[log,...prev.history]}));
    triggerToastAlert(`Milestone set to ${targetStatus}`);
  };
  const handleProjectStatusChange=(projectId,targetStatus)=>{ const updated=projects.map(p=>p.id===projectId?{...p,status:targetStatus}:p); setProjects(updated); triggerToastAlert(`Project status: ${targetStatus}`); };
  const commitTentativeWalkthroughPlan=(e)=>{ e.preventDefault(); if(!tentativeWalkthroughDateInput)return; const log={date:TODAY_STR,by:currentUser.name,action:`[SITE VISIT PLANNED]: Date set to ${tentativeWalkthroughDateInput}.`}; const updated=leads.map(l=>l.id===selectedLead.id?{...l,status:"Site Visit Planned",siteVisitTentativeDate:tentativeWalkthroughDateInput,history:[log,...l.history]}:l); setLeads(updated); setSelectedLead(prev=>({...prev,status:"Site Visit Planned",siteVisitTentativeDate:tentativeWalkthroughDateInput,history:[log,...prev.history]})); setTentativeWalkthroughDateInput(""); triggerToastAlert("Tentative date saved."); };

  const executeDataExportSequence=(formatType)=>{
    if(filteredActivityLogs.length===0){triggerToastAlert("No data to export.");return;}
    const headers=["Date","Executive","Project","Source","Calls Made","Call Status","Followup","Site Visit","Booking","Registration","Cancellation","Collection","Remark"];
    const rows=filteredActivityLogs.map(l=>[l.date,l.executive,l.project,l.source,l.callsMade,l.callStatus,l.followup,l.siteVisit,l.booking,l.registration,l.cancellation,l.collection,l.remark]);
    const fmtCell=(val)=>{const s=val===null?"":String(val);return s.includes(",")||s.includes('"')?`"${s.replace(/"/g,'""')}"`:s;};
    const buffer=[headers.map(fmtCell).join(","),...rows.map(r=>r.map(fmtCell).join(","))].join("\n");
    const ext=formatType==="excel"?"xlsx":"csv";
    const blob=new Blob([buffer],{type:"text/csv;charset=utf-8;"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.setAttribute("download",`Desam_Activity_Report_${TODAY_STR}.${ext}`);document.body.appendChild(a);a.click();document.body.removeChild(a);
    triggerToastAlert(`Exported as .${ext.toUpperCase()}`);
  };

  // ── LOGIN: admins checked against hardcoded list first, then storage users ──
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const allUsers = [...HARDCODED_ADMINS, ...nonAdminUsers];
    const acc = allUsers.find(u => u.email.toLowerCase() === loginEmail.toLowerCase().trim() && u.pass === loginPassword && u.active);
    if (acc) {
      setCurrentUser(acc);
      setLoginError("");
      triggerToastAlert(`Welcome, ${acc.name}!`);
      // Show popup to admin if there are pending reset requests
      if (acc.role === "Admin") {
        const pendingCount = resetRequests.filter(r => r.expiresAt > Date.now() && !r.consumed).length;
        if (pendingCount > 0) setShowAdminLoginPopup(true);
      }
    } else {
      setLoginError("Invalid credentials.");
    }
  };

  const handleLogout=()=>{ setCurrentUser(null);setLoginEmail("");setLoginPassword("");setGlobalSearch("");setActiveTab("dashboard");setNavHistory([]);setIsMobileMenuOpen(false); };

  const requestStatusTransitionPopup=(leadId,nextStatus)=>{ const t=leads.find(l=>l.id===leadId); if(!t)return; setCustomPopup({isOpen:true,leadId,targetValue:nextStatus,type:"status",title:"Confirm Status Shift",message:`Transition "${t.name}" to "${nextStatus}"?`}); };
  const requestOwnerAssignmentPopup=(leadId,personnelName)=>{ const t=leads.find(l=>l.id===leadId); if(!t)return; setCustomPopup({isOpen:true,leadId,targetValue:personnelName,type:"assign",title:"Confirm Assignment",message:`Assign "${t.name}" to "${personnelName}"?`}); };

  const confirmCustomPopupAction=()=>{
    const{leadId,targetValue,type}=customPopup;
    if(type==="status"){const log={date:TODAY_STR,by:currentUser.name,action:`Status updated to: ${targetValue}`};const updated=leads.map(l=>l.id===leadId?{...l,status:targetValue,history:[log,...l.history]}:l);setLeads(updated);if(selectedLead&&selectedLead.id===leadId)setSelectedLead({...selectedLead,status:targetValue,history:[log,...selectedLead.history]});triggerToastAlert("Status updated.");}
    else if(type==="assign"){const log={date:TODAY_STR,by:currentUser.name,action:`Assigned to: ${targetValue}`};const updated=leads.map(l=>l.id===leadId?{...l,assignedTo:targetValue,assignedByRole:currentUser.role,status:targetValue==="Unassigned"?"New":"Assigned",history:[log,...l.history]}:l);setLeads(updated);setSelectedLead(null);triggerToastAlert(`Assigned to ${targetValue}`);}
    setCustomPopup({isOpen:false,leadId:null,targetValue:"",type:"status",title:"",message:""});
  };

  const handleDataImportSubmit=(e)=>{ e.preventDefault(); if(!importText.trim())return; try{ const lines=importText.split("\n").map(l=>l.trim()).filter(Boolean); const newLeads=[]; lines.forEach(line=>{const cols=line.split("\t"); if(cols.length>=4){const matchedProj=projects.find(p=>p.name.toLowerCase()===(cols[3]||"").toLowerCase().trim()); const branchHome=matchedProj?matchedProj.branch:"Madurai Desk"; newLeads.push({id:Date.now()+Math.floor(Math.random()*10000),name:cols[0]||"Lead",phone:stripPhone(cols[1]||"00000"),email:cols[2]||"",project:cols[3]||"",location:cols[4]||"Inbound",budget:parseInt(cols[5])||25,source:cols[6]||"Website",assignedTo:"Unassigned",assignedByRole:"",status:"New",branch:branchHome,dateCreated:TODAY_STR,lastFollowUp:"None",nextFollowUp:TODAY_STR,history:[{date:TODAY_STR,by:currentUser.name,action:"Imported via paste."}],siteVisitTentativeDate:"",bookingUnit:"",bookingAmount:0,bookingMode:"",bookingDate:"",regPending:false,regCompleted:false});}});if(newLeads.length>0){setLeads([...newLeads,...leads]);triggerToastAlert(`Imported ${newLeads.length} leads.`);setImportText("");}
  }catch(err){alert(err.message);} };

  // Create user: only allow non-admin; admins are hardcoded
  const handleCreateUserSubmit=(e)=>{ e.preventDefault(); const prefix=newUserForm.emailPrefix.trim().toLowerCase(); const role = newUserForm.role; if (role === "Admin") { triggerToastAlert("Admin accounts cannot be created here."); return; } const u={id:Date.now(),name:newUserForm.name.trim(),email:`${prefix}@desam`,pass:newUserForm.pass,role,branch:newUserForm.branch,phone:stripPhone(newUserForm.phone)||"9840000000",active:true,avatar:newUserForm.name.charAt(0).toUpperCase()}; setNonAdminUsersState(prev => { const updated = [...prev, u]; storageSet(SK.nonAdminUsers, updated); return updated; }); setNewUserForm({name:"",emailPrefix:"",pass:"",role:"Executive",branch:"Madurai Desk",phone:""}); triggerToastAlert(`Profile for ${u.name} created.`); };

  const handleDeleteUser=(userId)=>{
    if(userId===currentUser.id){triggerToastAlert("Cannot delete your own account.");return;}
    // Check if it's a hardcoded admin
    if(HARDCODED_ADMINS.some(a=>a.id===userId)){triggerToastAlert("Admin accounts cannot be deleted here.");return;}
    setNonAdminUsersState(prev => { const updated = prev.filter(u => u.id !== userId); storageSet(SK.nonAdminUsers, updated); return updated; });
    triggerToastAlert("Profile removed.");
  };

  const openEditUserModal=(user)=>{
    if(HARDCODED_ADMINS.some(a=>a.id===user.id)){triggerToastAlert("Admin credentials are managed separately.");return;}
    setEditUserForm({...user}); setIsEditUserModalOpen(true);
  };

  const handleUpdateUserSubmit=(e)=>{ e.preventDefault(); const prefix=editUserForm.email.split('@')[0].trim().toLowerCase(); const u={...editUserForm,name:editUserForm.name.trim(),email:`${prefix}@desam`,branch:editUserForm.role==="Admin"?"All Branches":editUserForm.branch,phone:stripPhone(editUserForm.phone)||"9840000000",avatar:editUserForm.name.charAt(0).toUpperCase()};
    setNonAdminUsersState(prev => { const updated = prev.map(x => x.id === u.id ? u : x); storageSet(SK.nonAdminUsers, updated); return updated; });
    setIsEditUserModalOpen(false);setEditUserForm(null); triggerToastAlert(`Profile for ${u.name} updated.`); };

  const commitManualFollowUpReport=(e)=>{ e.preventDefault(); if(!followUpNotes.trim()||!nextFollowUpDate)return; const updated=leads.map(l=>{ if(l.id===selectedLead.id){const obj={...l,status:"Contacted",lastFollowUp:TODAY_STR,nextFollowUp:nextFollowUpDate,history:[{date:TODAY_STR,by:currentUser.name,action:`[Follow-Up]: ${followUpNotes.trim()} (Next: ${nextFollowUpDate})`},...l.history]};setSelectedLead(obj);return obj;}return l;}); setLeads(updated); setFollowUpNotes("");setNextFollowUpDate(""); triggerToastAlert("Follow-up logged."); };

  const handleCreateLead=(e)=>{ e.preventDefault(); const phone=stripPhone(newLeadForm.phone); const dup=leads.find(l=>stripPhone(l.phone)===phone); if(dup){setDuplicateConflictRecord(dup);return;} const projBranch=projects.find(p=>p.name===newLeadForm.project)?.branch||currentUser.branch||"Madurai Desk"; const created={...newLeadForm,id:Date.now(),phone,altPhone:stripPhone(newLeadForm.altPhone),branch:projBranch,dateCreated:TODAY_STR,lastFollowUp:"None",nextFollowUp:TODAY_STR,assignedByRole:"",bookingUnit:"",bookingAmount:0,bookingMode:"",bookingDate:"",regPending:false,regCompleted:false,siteVisitTentativeDate:"",status:newLeadForm.assignedTo&&newLeadForm.assignedTo!=="Unassigned"?"Assigned":"New",history:[{date:TODAY_STR,by:currentUser.name,action:"Lead captured."+(newLeadForm.assignedTo&&newLeadForm.assignedTo!=="Unassigned"?` Assigned to ${newLeadForm.assignedTo}.`:"")}]}; setLeads([created,...leads]); setIsLeadModalOpen(false); setNewLeadForm({name:"",phone:"",altPhone:"",email:"",location:"",project:projects[0]?.name||"",budget:25,source:"Website",assignedTo:"Unassigned",notes:""}); triggerToastAlert("Lead created."); };
  const handleCreateProject=(e)=>{ e.preventDefault(); const p={...newProjectForm,id:Date.now(),price:parseInt(newProjectForm.price)||0,units:parseInt(newProjectForm.units)||0,sold:parseInt(newProjectForm.sold)||0}; setProjects([p,...projects]); setIsProjectModalOpen(false); setNewProjectForm({name:"",location:"",branch:"Madurai Desk",type:"Plot",price:30,units:50,sold:0,status:"Pre-Launch"}); triggerToastAlert(`Project "${p.name}" added.`); };
  const handleCreateActivityLog=(e)=>{ e.preventDefault(); const log={...newActivityForm,id:Date.now(),executive:["Admin","Manager"].includes(currentUser.role)?newActivityForm.executive:currentUser.name,callsMade:parseInt(newActivityForm.callsMade)||0,followup:parseInt(newActivityForm.followup)||0,siteVisit:parseInt(newActivityForm.siteVisit)||0,booking:parseInt(newActivityForm.booking)||0,registration:parseInt(newActivityForm.registration)||0,cancellation:parseInt(newActivityForm.cancellation)||0,collection:parseInt(newActivityForm.collection)||0}; setActivityLogsWrapped(prev=>[log,...prev]); setIsActivityLogModalOpen(false); setNewActivityForm({date:TODAY_STR,executive:"",project:projects[0]?.name||"",source:"Own Leads",callsMade:0,callStatus:"Warm",followup:0,siteVisit:0,booking:0,registration:0,cancellation:0,collection:0,remark:""}); triggerToastAlert("Activity log saved."); };

  const commitSiteWalkthroughLog=()=>{ const updated=leads.map(l=>l.id===selectedLead.id?{...l,status:"Site Visit Completed",history:[{date:svDate,by:currentUser.name,action:`[Site Visit]: Family: ${svFamily}. Feedback: ${svFeedback}`},...l.history]}:l); setLeads(updated); setSelectedLead(null); triggerToastAlert("Site visit logged."); };
  const commitFinancialBookingLog=()=>{ const updated=leads.map(l=>l.id===selectedLead.id?{...l,status:"Booking Confirmed",bookingUnit:bkUnit,history:[{date:TODAY_STR,by:currentUser.name,action:`[Booking]: Unit [${bkUnit}] booked.`},...l.history]}:l); setLeads(updated); setSelectedLead(null); triggerToastAlert("Booking logged."); };

  // Handle mobile call feedback: logs as a follow-up on the lead
  const handleCallFeedback = (leadId, feedbackData) => {
    const { notes, outcome, followUpDate, callDuration, leadName } = feedbackData;
    const log = {
      date: TODAY_STR,
      by: currentUser.name,
      action: `[Mobile Call]: Duration ${Math.floor(callDuration/60)}m${callDuration%60}s. Outcome: ${outcome}.${notes ? ` Notes: ${notes}` : ""}${followUpDate ? ` Next follow-up: ${followUpDate}` : ""}`
    };
    const updated = leads.map(l => {
      if (l.id !== leadId) return l;
      return {
        ...l,
        status: outcome || l.status,
        lastFollowUp: TODAY_STR,
        nextFollowUp: followUpDate || l.nextFollowUp,
        history: [log, ...l.history]
      };
    });
    setLeads(updated);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => ({ ...prev, status: outcome || prev.status, history: [log, ...prev.history] }));
    }
    triggerToastAlert("Call feedback saved.");
  };

  // Count active reset requests
  const activeResetCount = useMemo(() => resetRequests.filter(r => r.expiresAt > Date.now() && !r.consumed).length, [resetRequests]);

  const navItems = [
    {id:"dashboard",icon:<Layers/>,label:"DASHBOARD"},
    {id:"leads",icon:<PhoneCall/>,label:"LEAD CHANNELS"},
    {id:"activity",icon:<ClipboardList/>,label:"ACTIVITY LOGS"},
    {id:"projects",icon:<Building2/>,label:"PROJECT MASTER"},
    {id:"reports",icon:<BarChart3/>,label:"MATRIX REPORTS"},
  ];

  const SidebarContent=()=>(
    <>
      <div>
        <div className="h-20 flex items-center px-5 border-b border-slate-800 bg-slate-950"><img src={DESAM_LOGO_ASSET} alt="Desam" className="h-11 w-auto object-contain max-w-[220px]"/></div>
        <nav className="p-4 space-y-1">
          {navItems.map(item=>(
            <button key={item.id} onClick={()=>navigateTo(item.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${activeTab===item.id?"bg-orange-600 text-white shadow-lg":"text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              {React.cloneElement(item.icon,{className:"h-4 w-4"})} {item.label}
            </button>
          ))}
          {currentUser?.role==="Admin"&&(
            <button onClick={()=>navigateTo("users")} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${activeTab==="users"?"bg-orange-600 text-white shadow-lg":"text-slate-400 hover:bg-slate-900 hover:text-white"}`}>
              <Users className="h-4 w-4"/>
              <span>SYSTEM CONTROL HUB</span>
              {activeResetCount > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse">{activeResetCount}</span>
              )}
            </button>
          )}
        </nav>
      </div>
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-7 w-7 rounded-lg bg-orange-600 font-black text-xs flex items-center justify-center text-white flex-shrink-0">{currentUser?.avatar}</div>
            <div className="truncate w-24"><p className="text-xs font-bold text-slate-200 truncate">{currentUser?.name}</p><p className="text-[9px] text-orange-400 font-black tracking-wider uppercase truncate">{currentUser?.role}</p></div>
          </div>
          <button onClick={handleLogout} className="text-slate-500 hover:text-rose-400 transition-colors ml-1"><LogOut className="h-4 w-4"/></button>
        </div>
      </div>
    </>
  );

  // ── LOADING ───────────────────────────────────────────────────────────────
  if (!storageReady) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <img src={DESAM_LOGO_ASSET} alt="Desam" className="h-14 w-auto object-contain animate-pulse"/>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Loading CRM…</p>
      </div>
    );
  }

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased text-slate-200">
        {showResetModal && (
          <PasswordResetModal
            users={users}
            setUsers={setUsers}
            resetRequests={resetRequests}
            setResetRequests={setResetRequests}
            onClose={() => setShowResetModal(false)}
          />
        )}
        <div className="sm:mx-auto w-full max-w-md text-center space-y-4">
          <div className="flex justify-center mb-2"><img src={DESAM_LOGO_ASSET} alt="Desam Developers Logo" className="h-16 w-auto object-contain drop-shadow-lg"/></div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secure Operational Control Platform</p>
        </div>
        <div className="mt-6 sm:mx-auto w-full max-w-md px-4">
          <div className="bg-slate-950 py-8 px-6 border border-slate-800 rounded-2xl shadow-2xl space-y-6">
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide">Username</label><div className="relative"><Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500"/><input type="text" required value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500" placeholder="Enter Username"/></div></div>
              <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide">Password</label><div className="relative"><Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500"/><input type="password" required value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500" placeholder="••••••••"/></div></div>
              {loginError&&<p className="text-rose-400 font-bold bg-rose-500/10 p-2.5 rounded border border-rose-500/20">{loginError}</p>}
              <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white font-black py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-lg">Authorize Access</button>
            </form>
            <div className="pt-2 border-t border-slate-900 flex justify-center">
              <button onClick={() => setShowResetModal(true)} className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-orange-400 transition-colors font-bold uppercase tracking-wide">
                <KeyRound className="h-3.5 w-3.5" /> Forgot Password?
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN APP ──────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans antialiased overflow-hidden relative">

      {/* Admin Login Reset Popup */}
      {showAdminLoginPopup && currentUser?.role === "Admin" && activeResetCount > 0 && (
        <AdminLoginResetPopup
          count={activeResetCount}
          onGoToHub={() => { setShowAdminLoginPopup(false); navigateTo("users"); }}
          onDismiss={() => setShowAdminLoginPopup(false)}
        />
      )}

      <aside className="hidden lg:flex w-64 bg-slate-950 border-r border-slate-800 flex-col justify-between h-full flex-shrink-0"><SidebarContent/></aside>
      {isMobileMenuOpen&&(<div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm"><aside className="w-64 bg-slate-950 border-r border-slate-800 flex-col justify-between h-full flex"><SidebarContent/></aside><div className="flex-1" onClick={()=>setIsMobileMenuOpen(false)}></div></div>)}

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 lg:px-8 z-10 gap-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={()=>setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-200 transition-colors"><Menu className="h-5 w-5"/></button>
            {navHistory.length>0&&(<button onClick={navigateBack} className="flex items-center gap-1.5 p-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wide"><ArrowLeft className="h-4 w-4"/><span className="hidden sm:inline">Back</span></button>)}
            <div className="relative w-48 sm:w-80 hidden sm:block"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500"/><input type="text" value={globalSearch} onChange={e=>setGlobalSearch(e.target.value)} placeholder="Search leads..." className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500"/></div>
          </div>
          <div className="flex items-center gap-3">
            {currentUser.role === "Admin" && activeResetCount > 0 && (
              <button onClick={() => navigateTo("users")} className="relative flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl hover:bg-rose-500/20 transition-colors">
                <KeyRound className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{activeResetCount} Reset{activeResetCount > 1 ? "s" : ""} Pending</span>
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-rose-500 rounded-full animate-ping" />
              </button>
            )}
            <div className="text-xs text-slate-300 font-bold bg-slate-900 px-3 sm:px-4 py-2 border border-slate-800 rounded-xl shadow-inner truncate max-w-[200px] sm:max-w-none">Welcome, <span className="text-orange-400 font-black">{currentUser.name}</span></div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8 w-full">

          {/* ═══ DASHBOARD ══════════════════════════════════════════════ */}
          {activeTab==="dashboard"&&(
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-950 p-6 border border-slate-800 rounded-2xl">
                <div><h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">Sales Performance Dashboard</h1><p className="text-xs text-slate-400 mt-0.5">Real-time activity & lead pipeline overview.</p></div>
              </div>
              {unattendedManagerAlerts.length>0&&(<div className="bg-rose-950/40 border border-rose-500/30 p-4 lg:p-5 rounded-2xl flex items-start gap-4 shadow-xl"><div className="bg-rose-500/20 p-2 rounded-full border border-rose-500/30 mt-0.5"><AlertTriangle className="h-5 w-5 text-rose-500 animate-pulse"/></div><div><h3 className="text-rose-400 font-black text-xs uppercase tracking-wider">Unattended Leads Alert</h3><p className="text-rose-200/70 text-xs mt-1.5 font-medium">{unattendedManagerAlerts.length} leads in "New" status unattended for 48+ hours.</p></div></div>)}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                <KpiTile label="Total Calls" value={activityKPIs.totalCalls.toLocaleString()} icon={<Phone/>} color="#ea580c"/>
                <KpiTile label="Followups" value={activityKPIs.totalFollowups.toLocaleString()} icon={<PhoneCall/>} color="#3b82f6"/>
                <KpiTile label="Site Visits" value={activityKPIs.totalSiteVisits} icon={<MapPin/>} color="#10b981"/>
                <KpiTile label="Bookings" value={activityKPIs.totalBookings} icon={<BookOpen/>} color="#8b5cf6"/>
                <KpiTile label="Registration" value={activityKPIs.totalRegistrations} icon={<UserCheck/>} color="#f59e0b"/>
                <KpiTile label="Cancellation" value={activityKPIs.totalCancellations} icon={<XCircle/>} color="#ef4444"/>
                <KpiTile label="Collection" value={`₹${activityKPIs.totalCollection}L`} icon={<Banknote/>} color="#06b6d4"/>
                <KpiTile label="Conversion %" value={`${activityKPIs.convRate}%`} icon={<TrendingUp/>} color="#a3e635"/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Scoped Leads <Briefcase className="h-4 w-4 text-orange-400"/></p><p className="text-3xl font-black text-white mt-1">{processedLeads.length}</p></div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Conversions <CheckCircle2 className="h-4 w-4 text-emerald-400"/></p><p className="text-3xl font-black text-emerald-400 mt-1">{processedLeads.filter(l=>["Booking Confirmed","Closed"].includes(l.status)).length}</p></div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Conv Rate <TrendingUp className="h-4 w-4 text-blue-400"/></p><p className="text-3xl font-black text-blue-400 mt-1">{conversionRate}%</p></div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Budget Vol <DollarSign className="h-4 w-4 text-orange-400"/></p><p className="text-3xl font-black text-white mt-1">₹{processedLeads.reduce((a,c)=>a+c.budget,0)}L</p></div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Site Visits <Calendar className="h-4 w-4 text-amber-400"/></p><p className="text-3xl font-black text-amber-400 mt-1">{processedLeads.filter(l=>l.status==="Site Visit Completed").length}</p></div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 lg:p-6 space-y-4">
                <h2 className="text-xs font-black text-orange-400 uppercase tracking-widest flex items-center gap-2"><Bell className="h-4 w-4"/>{["Executive","Telecaller"].includes(currentUser.role)?"MY ACTIVE PIPELINE":"DEPLOYMENT QUEUE / SITE VISITS"}</h2>
                {dashboardActionQueueLeads.length>0?(
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dashboardActionQueueLeads.map(l=>(
                      <div key={l.id} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-3 relative overflow-hidden">
                        {l.assignedByRole==="Admin"&&currentUser.role==="Manager"&&<div className="absolute top-0 right-0 bg-rose-600 text-[8px] font-black tracking-wider uppercase px-2 py-0.5 rounded-bl text-white animate-pulse">⭐ Admin Priority</div>}
                        {l.status==="Site Visit Planned"&&l.siteVisitTentativeDate&&<div className="absolute top-0 right-0 bg-purple-600 text-[9px] font-mono font-black tracking-wider uppercase px-2.5 py-0.5 rounded-bl text-white flex items-center gap-1"><Calendar className="h-3 w-3"/> SV: {l.siteVisitTentativeDate}</div>}
                        <div>
                          <div className="flex justify-between items-start pr-16"><h4 className="font-bold text-white text-sm cursor-pointer hover:text-orange-400 transition-all" onClick={()=>setSelectedLead(l)}>{l.name}</h4><span className="text-[9px] bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono font-bold">{l.source}</span></div>
                          <p className="text-xs text-slate-400 font-mono mt-1">{l.phone}</p>
                          <p className="text-[11px] font-semibold text-orange-400 mt-0.5">{l.project}</p>
                          <div className="mt-2"><span className="text-[9px] px-2 py-0.5 font-bold uppercase rounded" style={{backgroundColor:SC[l.status]?.bg||"rgba(255,255,255,0.05)",color:SC[l.status]?.text||"#FFF"}}>{l.status}</span></div>
                        </div>
                        <div className="flex gap-2">
                          {/* Mobile call button on lead cards */}
                          {isMobile && ["Executive","Telecaller"].includes(currentUser.role) && (
                            <MobileCallButton
                              phone={l.phone}
                              leadName={l.name}
                              TODAY_STR={TODAY_STR}
                              currentUser={currentUser}
                              onFeedbackSaved={(fb) => handleCallFeedback(l.id, fb)}
                            />
                          )}
                          <button onClick={()=>setSelectedLead(l)} className="flex-1 bg-orange-600/10 hover:bg-orange-600 border border-orange-500/20 text-[10px] text-orange-400 hover:text-white font-black py-1.5 rounded-lg tracking-wide uppercase transition-all">{["Manager","Admin"].includes(currentUser.role)?"⚡ Delegate":"📝 Open Workspace"}</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ):<p className="text-xs text-slate-500 italic p-4 bg-slate-900/40 rounded-xl border border-slate-900">Queue is clear.</p>}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl col-span-1 lg:col-span-2 shadow-xl">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Calls Trend (Daily)</h3>
                  <div className="h-[260px] w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={callsTrendData} margin={{top:10,right:10,left:-20,bottom:20}}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/><XAxis dataKey="date" tick={{fontSize:9,fill:'#64748b'}} axisLine={false} tickLine={false} angle={-35} textAnchor="end"/><YAxis tick={{fontSize:10,fill:'#64748b'}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{backgroundColor:'#0f172a',borderColor:'#1e293b',borderRadius:'8px',fontSize:'11px',color:'#f8fafc'}}/><Legend wrapperStyle={{fontSize:'10px'}}/><Line type="monotone" dataKey="calls" stroke="#ea580c" strokeWidth={2.5} dot={{r:3}} name="Calls"/><Line type="monotone" dataKey="followups" stroke="#3b82f6" strokeWidth={2} dot={{r:2}} name="Followups"/><Line type="monotone" dataKey="siteVisits" stroke="#10b981" strokeWidth={2} dot={{r:2}} name="Site Visits"/><Line type="monotone" dataKey="bookings" stroke="#8b5cf6" strokeWidth={2} dot={{r:2}} name="Bookings"/></LineChart></ResponsiveContainer></div>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl shadow-xl flex flex-col">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Sourcewise Analysis</h3>
                  <div className="h-[200px] w-full relative"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={sourcewisePieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">{sourcewisePieData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}</Pie><Tooltip contentStyle={{backgroundColor:'#0f172a',borderColor:'#1e293b',borderRadius:'8px',fontSize:'11px',color:'#f8fafc'}}/></PieChart></ResponsiveContainer></div>
                  <div className="mt-2 flex flex-wrap gap-1.5">{sourcewisePieData.slice(0,6).map((s,i)=><div key={s.name} className="flex items-center gap-1 text-[9px] text-slate-400"><div className="h-2 w-2 rounded-full" style={{backgroundColor:PIE_COLORS[i%PIE_COLORS.length]}}></div><span className="truncate max-w-[60px]">{s.name}</span></div>)}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl shadow-xl"><h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Project Performance</h3><div className="h-[260px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={projectPerfData} margin={{top:10,right:10,left:-20,bottom:20}}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/><XAxis dataKey="project" tick={{fontSize:9,fill:'#64748b'}} axisLine={false} tickLine={false} angle={-30} textAnchor="end"/><YAxis tick={{fontSize:10,fill:'#64748b'}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{backgroundColor:'#0f172a',borderColor:'#1e293b',borderRadius:'8px',fontSize:'11px',color:'#f8fafc'}}/><Bar dataKey="calls" fill="#ea580c" radius={[3,3,0,0]} barSize={20} name="Calls"/><Bar dataKey="followups" fill="#3b82f6" radius={[3,3,0,0]} barSize={20} name="Followups"/></BarChart></ResponsiveContainer></div></div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl shadow-xl"><h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Executive Performance — MTD</h3><div className="h-[260px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={execPerfChartData} margin={{top:10,right:10,left:-20,bottom:20}}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/><XAxis dataKey="name" tick={{fontSize:9,fill:'#64748b'}} axisLine={false} tickLine={false} angle={-30} textAnchor="end"/><YAxis tick={{fontSize:10,fill:'#64748b'}} axisLine={false} tickLine={false}/><Tooltip contentStyle={{backgroundColor:'#0f172a',borderColor:'#1e293b',borderRadius:'8px',fontSize:'11px',color:'#f8fafc'}}/><Bar dataKey="calls" fill="#ea580c" radius={[3,3,0,0]} barSize={18} name="Calls"/><Bar dataKey="siteVisits" fill="#10b981" radius={[3,3,0,0]} barSize={18} name="Site Visits"/><Bar dataKey="bookings" fill="#8b5cf6" radius={[3,3,0,0]} barSize={18} name="Bookings"/></BarChart></ResponsiveContainer></div></div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Executivewise Detailed Report</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead><tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]"><th className="pb-2 pl-2">Executive</th><th className="pb-2 text-center text-orange-400">Calls</th><th className="pb-2 text-center text-blue-400">Followups</th><th className="pb-2 text-center text-emerald-400">Site Visits</th><th className="pb-2 text-center text-purple-400">Bookings</th><th className="pb-2 text-center text-amber-400">Regi.</th></tr></thead>
                    <tbody className="divide-y divide-slate-900">
                      {execDetailedMatrix.map((e,i)=><tr key={i} className="hover:bg-slate-900/20"><td className="py-2.5 pl-2 font-bold text-white">{e.name}</td><td className="py-2.5 text-center font-mono font-bold text-orange-400">{e.calls.toLocaleString()}</td><td className="py-2.5 text-center font-mono text-blue-400">{e.followups}</td><td className="py-2.5 text-center font-mono text-emerald-400">{e.siteVisits}</td><td className="py-2.5 text-center font-mono text-purple-400">{e.bookings}</td><td className="py-2.5 text-center font-mono text-amber-400">{e.registrations}</td></tr>)}
                      {execDetailedMatrix.length>0&&(<tr className="border-t border-slate-700 font-black text-[11px]"><td className="py-2.5 pl-2 text-white">TOTAL</td><td className="py-2.5 text-center font-mono text-orange-400">{execDetailedMatrix.reduce((s,e)=>s+e.calls,0).toLocaleString()}</td><td className="py-2.5 text-center font-mono text-blue-400">{execDetailedMatrix.reduce((s,e)=>s+e.followups,0)}</td><td className="py-2.5 text-center font-mono text-emerald-400">{execDetailedMatrix.reduce((s,e)=>s+e.siteVisits,0)}</td><td className="py-2.5 text-center font-mono text-purple-400">{execDetailedMatrix.reduce((s,e)=>s+e.bookings,0)}</td><td className="py-2.5 text-center font-mono text-amber-400">{execDetailedMatrix.reduce((s,e)=>s+e.registrations,0)}</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══ LEADS ══════════════════════════════════════════════════ */}
          {activeTab==="leads"&&(
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div><h1 className="text-2xl font-black text-white tracking-tight">Active Lead Channels</h1><p className="text-xs text-slate-400 mt-0.5">Track property interaction vectors inside your regional territory.</p></div>
                <button onClick={()=>{setNewLeadForm({name:"",phone:"",altPhone:"",email:"",location:"",project:projects[0]?.name||"",budget:25,source:"Website",assignedTo:"Unassigned",notes:""});setDuplicateConflictRecord(null);setIsLeadModalOpen(true);}} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-black px-4 py-2 rounded-xl text-xs transition-colors shadow-md w-fit"><Plus className="h-4 w-4"/> INGEST RECORD</button>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl w-full">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead><tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider"><th className="p-4 min-w-[150px]">Customer</th><th className="p-4 min-w-[150px]">Project</th><th className="p-4">Source</th><th className="p-4 min-w-[160px]">Assigned To</th><th className="p-4">Status</th><th className="p-4 text-right">Budget</th></tr></thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {processedLeads.length===0?(<tr><td colSpan={6} className="p-12 text-center text-slate-500 italic">No leads found.</td></tr>):processedLeads.map(l=>(
                        <tr key={l.id} className="hover:bg-slate-900/30 transition-all">
                          <td className="p-4">
                            <p className="font-bold text-white text-sm cursor-pointer hover:text-orange-400 transition-colors" onClick={()=>setSelectedLead(l)}>{l.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-[11px] text-slate-500 font-mono">{l.phone}</p>
                              <button onClick={()=>copyToClipboard(l.phone)} className="text-slate-600 hover:text-orange-500"><Search className="h-3 w-3"/></button>
                              {/* Mobile call button inline in leads table */}
                              {isMobile && ["Executive","Telecaller"].includes(currentUser.role) && (
                                <MobileCallButton
                                  phone={l.phone}
                                  leadName={l.name}
                                  TODAY_STR={TODAY_STR}
                                  currentUser={currentUser}
                                  onFeedbackSaved={(fb) => handleCallFeedback(l.id, fb)}
                                />
                              )}
                            </div>
                            {(new Date(TODAY_STR)-new Date(l.lastFollowUp||l.dateCreated))/(1000*3600*24)>7&&(<span className="text-[9px] bg-rose-500/10 text-rose-500 font-black px-1.5 py-0.5 rounded uppercase tracking-wider mt-1 block w-fit">Stale Lead</span>)}
                          </td>
                          <td className="p-4"><p className="font-semibold text-slate-200">{l.project}</p><p className="text-[11px] text-slate-500 mt-0.5 font-mono">{l.dateCreated}</p></td>
                          <td className="p-4"><span className="bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold font-mono">{l.source}</span></td>
                          <td className="p-4">{["Admin","Manager"].includes(currentUser.role)?(<select value={l.assignedTo} onChange={e=>requestOwnerAssignmentPopup(l.id,e.target.value)} className="bg-slate-900 border border-slate-800 text-slate-200 rounded px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-orange-500 cursor-pointer max-w-[170px]"><option value="Unassigned">⚠️ Select Staff</option><optgroup label="Managers">{users.filter(u=>u.role==="Manager").map(u=><option key={u.id} value={u.name}>{u.name} (Mgr)</option>)}</optgroup><optgroup label="Staff">{users.filter(u=>["Executive","Telecaller"].includes(u.role)).map(u=><option key={u.id} value={u.name}>{u.name} ({u.role})</option>)}</optgroup></select>):(<span className="font-semibold text-slate-400 flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-slate-600"/> {l.assignedTo}</span>)}</td>
                          <td className="p-4"><div className="flex flex-col gap-1"><select value={l.status} onChange={e=>requestStatusTransitionPopup(l.id,e.target.value)} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 font-bold text-xs text-slate-300 focus:outline-none cursor-pointer" style={{color:SC[l.status]?.text||"#FFF"}}>{STATUSES.map(st=><option key={st} value={st}>{st}</option>)}</select>{l.status==="Site Visit Planned"&&l.siteVisitTentativeDate&&<span className="text-[9px] text-purple-400 font-mono font-bold pl-1">📅 {l.siteVisitTentativeDate}</span>}</div></td>
                          <td className="p-4 text-right font-mono font-bold text-emerald-400 text-sm">₹{l.budget}L</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══ ACTIVITY LOGS ══════════════════════════════════════════ */}
          {activeTab==="activity"&&(
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div><h1 className="text-2xl font-black text-white tracking-tight">Daily Activity Logs</h1><p className="text-xs text-slate-400 mt-0.5">Log daily calls, follow-ups, site visits, bookings and registrations.</p></div>
                <button onClick={()=>{setNewActivityForm({date:TODAY_STR,executive:"",project:projects[0]?.name||"",source:"Own Leads",callsMade:0,callStatus:"Warm",followup:0,siteVisit:0,booking:0,registration:0,cancellation:0,collection:0,remark:""});setIsActivityLogModalOpen(true);}} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-black px-4 py-2 rounded-xl text-xs transition-colors shadow-md w-fit"><Plus className="h-4 w-4"/> ADD ACTIVITY LOG</button>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 lg:p-5 shadow-xl">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                  <div className="space-y-1"><label className="text-slate-500 font-bold uppercase text-[9px]">From</label><input type="date" value={actStartDate} onChange={e=>setActStartDate(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-orange-500 font-mono"/></div>
                  <div className="space-y-1"><label className="text-slate-500 font-bold uppercase text-[9px]">To</label><input type="date" value={actEndDate} onChange={e=>setActEndDate(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-orange-500 font-mono"/></div>
                  {["Admin","Manager"].includes(currentUser.role)&&(<div className="space-y-1"><label className="text-slate-500 font-bold uppercase text-[9px]">Executive</label><select value={actFilterExec} onChange={e=>setActFilterExec(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"><option value="All">All</option>{[...new Set(activityLogs.map(l=>l.executive))].sort().map(e=><option key={e} value={e}>{e}</option>)}</select></div>)}
                  <div className="space-y-1"><label className="text-slate-500 font-bold uppercase text-[9px]">Project</label><select value={actFilterProject} onChange={e=>setActFilterProject(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"><option value="All">All</option>{projects.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select></div>
                  <div className="space-y-1"><label className="text-slate-500 font-bold uppercase text-[9px]">Source</label><select value={actFilterSource} onChange={e=>setActFilterSource(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"><option value="All">All</option>{SOURCES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                  <div className="space-y-1"><label className="text-slate-500 font-bold uppercase text-[9px]">Call Status</label><select value={actFilterStatus} onChange={e=>setActFilterStatus(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"><option value="All">All</option>{CALL_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                <KpiTile label="Total Calls" value={activityKPIs.totalCalls.toLocaleString()} icon={<Phone/>} color="#ea580c"/>
                <KpiTile label="Followups" value={activityKPIs.totalFollowups.toLocaleString()} icon={<PhoneCall/>} color="#3b82f6"/>
                <KpiTile label="Site Visits" value={activityKPIs.totalSiteVisits} icon={<MapPin/>} color="#10b981"/>
                <KpiTile label="Bookings" value={activityKPIs.totalBookings} icon={<BookBook/>} color="#8b5cf6"/>
                <KpiTile label="Registration" value={activityKPIs.totalRegistrations} icon={<UserCheck/>} color="#f59e0b"/>
                <KpiTile label="Cancellation" value={activityKPIs.totalCancellations} icon={<XCircle/>} color="#ef4444"/>
                <KpiTile label="Collection" value={`₹${activityKPIs.totalCollection}L`} icon={<Banknote/>} color="#06b6d4"/>
                <KpiTile label="Conversion %" value={`${activityKPIs.convRate}%`} icon={<TrendingUp/>} color="#a3e635"/>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl w-full">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead><tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]"><th className="p-3">Date</th><th className="p-3">Executive/Tel</th><th className="p-3">Project</th><th className="p-3">Source</th><th className="p-3 text-center">Calls</th><th className="p-3">Status</th><th className="p-3 text-center">Followup</th><th className="p-3 text-center">Site Visit</th><th className="p-3 text-center">Booking</th><th className="p-3 text-center">Regist.</th><th className="p-3 text-center">Cancel.</th><th className="p-3 min-w-[200px]">Remark</th></tr></thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {filteredActivityLogs.length===0?(<tr><td colSpan={12} className="p-10 text-center text-slate-500 italic">No activity logs found.</td></tr>):filteredActivityLogs.map(l=>(
                        <tr key={l.id} className="hover:bg-slate-900/30 transition-all">
                          <td className="p-3 font-mono text-slate-400 text-[11px]">{l.date}</td><td className="p-3 font-bold text-white">{l.executive}</td><td className="p-3 text-orange-400 font-semibold">{l.project}</td><td className="p-3"><span className="bg-slate-900 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[10px] font-mono">{l.source}</span></td><td className="p-3 text-center font-mono font-bold text-white">{l.callsMade}</td><td className="p-3"><span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase ${l.callStatus==="Warm"?"bg-amber-500/10 text-amber-400":"bg-slate-700/30 text-slate-400"}`}>{l.callStatus}</span></td><td className="p-3 text-center font-mono text-blue-400">{l.followup||""}</td><td className="p-3 text-center font-mono text-emerald-400">{l.siteVisit||""}</td><td className="p-3 text-center font-mono text-purple-400">{l.booking||""}</td><td className="p-3 text-center font-mono text-amber-400">{l.registration||""}</td><td className="p-3 text-center font-mono text-rose-400">{l.cancellation||""}</td><td className="p-3 text-[11px] text-slate-400 max-w-xs truncate" title={l.remark}>{l.remark}</td>
                        </tr>
                      ))}
                    </tbody>
                    {filteredActivityLogs.length>0&&(<tfoot className="bg-slate-900/50 border-t border-slate-800 font-black text-[11px]"><tr><td className="p-3 text-white" colSpan={4}>TOTALS</td><td className="p-3 text-center font-mono text-white">{filteredActivityLogs.reduce((s,l)=>s+(l.callsMade||0),0)}</td><td className="p-3"></td><td className="p-3 text-center font-mono text-blue-400">{filteredActivityLogs.reduce((s,l)=>s+(l.followup||0),0)}</td><td className="p-3 text-center font-mono text-emerald-400">{filteredActivityLogs.reduce((s,l)=>s+(l.siteVisit||0),0)}</td><td className="p-3 text-center font-mono text-purple-400">{filteredActivityLogs.reduce((s,l)=>s+(l.booking||0),0)}</td><td className="p-3 text-center font-mono text-amber-400">{filteredActivityLogs.reduce((s,l)=>s+(l.registration||0),0)}</td><td className="p-3 text-center font-mono text-rose-400">{filteredActivityLogs.reduce((s,l)=>s+(l.cancellation||0),0)}</td><td className="p-3"></td></tr></tfoot>)}
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══ PROJECTS ═══════════════════════════════════════════════ */}
          {activeTab==="projects"&&(
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div><h1 className="text-2xl font-black text-white tracking-tight">Corporate Asset Registry</h1><p className="text-xs text-slate-400 mt-0.5">Track property inventory capacities and structural workflows.</p></div>
                {currentUser.role==="Admin"&&(<button onClick={()=>setIsProjectModalOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md w-fit"><Plus className="h-4 w-4"/> Add Project</button>)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleProjects.map(p=>(
                  <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 relative overflow-hidden shadow-xl">
                    <div className="flex justify-between items-start">
                      <div><h3 className="text-sm font-black text-white flex items-center gap-1.5"><Home className="h-4 w-4 text-slate-500"/> {p.name}</h3><p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3 text-slate-600"/> {p.location} • <span className="font-bold text-orange-400">{p.branch}</span></p></div>
                      {["Admin","Manager"].includes(currentUser.role)?(<select value={p.status} onChange={e=>handleProjectStatusChange(p.id,e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[10px] font-black focus:outline-none cursor-pointer" style={{color:PSC[p.status]?.text||"#FFF"}}>{PROJECT_STATUSES.map(st=><option key={st} value={st}>{st}</option>)}</select>):(<span className="text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider" style={{backgroundColor:PSC[p.status]?.bg,color:PSC[p.status]?.text}}>{p.status}</span>)}
                    </div>
                    <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 text-xs space-y-2">
                      <div className="flex justify-between items-center text-[11px]"><span className="text-slate-500">Type:</span><span className="font-bold text-slate-300 uppercase bg-slate-950 px-1.5 py-0.5 rounded text-[10px]">{p.type}</span></div>
                      <div className="flex justify-between items-center text-[11px]"><span className="text-slate-500">Starting Price:</span><span className="font-mono font-bold text-emerald-400">₹{p.price}L</span></div>
                      <div className="pt-1.5 border-t border-slate-800"><div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1"><span>SOLD: {p.sold} / {p.units}</span><span className="font-mono text-orange-400">{Math.round((p.sold/p.units)*100)||0}%</span></div><div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden"><div className="bg-gradient-to-r from-orange-600 to-amber-400 h-full transition-all duration-500" style={{width:`${(p.sold/p.units)*100}%`}}></div></div></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ REPORTS ════════════════════════════════════════════════ */}
          {activeTab==="reports"&&(
            <div className="space-y-8 pb-20">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start md:items-center gap-4 w-full">
                <div><h1 className="text-2xl font-black text-white tracking-tight">Performance Matrix Engine</h1><p className="text-xs text-slate-400 mt-0.5">Full Excel-style report with filters, summary matrix, executivewise, sourcewise & projectwise breakdowns.</p></div>
                <div className="flex items-center gap-2 flex-wrap text-xs font-bold tracking-wide">
                  <button onClick={()=>executeDataExportSequence("excel")} className="flex items-center gap-1.5 bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-500/20 text-emerald-400 hover:text-white px-3 py-2 rounded-xl transition-all"><FileSpreadsheet className="h-3.5 w-3.5"/> EXCEL</button>
                  <button onClick={()=>executeDataExportSequence("csv")} className="flex items-center gap-1.5 bg-blue-600/10 hover:bg-blue-600 border border-blue-500/20 text-blue-400 hover:text-white px-3 py-2 rounded-xl transition-all"><Upload className="h-3.5 w-3.5 transform rotate-180"/> CSV</button>
                </div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 lg:p-6 space-y-4 shadow-xl">
                <h3 className="text-xs font-black text-orange-400 uppercase tracking-widest">Filter Panel</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-4 border-b border-slate-800/60">
                  <div className="space-y-1"><label className="text-slate-500 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-orange-500"/> From Date</label><input type="date" value={actStartDate} onChange={e=>setActStartDate(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-orange-500 font-mono cursor-pointer"/></div>
                  <div className="space-y-1"><label className="text-slate-500 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-orange-500"/> To Date</label><input type="date" value={actEndDate} onChange={e=>setActEndDate(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-orange-500 font-mono cursor-pointer"/></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {["Admin","Manager"].includes(currentUser.role)&&(<div className="space-y-1"><label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Executive</label><select value={actFilterExec} onChange={e=>setActFilterExec(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"><option value="All">All Executives</option>{[...new Set(activityLogs.map(l=>l.executive))].sort().map(e=><option key={e} value={e}>{e}</option>)}</select></div>)}
                  <div className="space-y-1"><label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Project</label><select value={actFilterProject} onChange={e=>setActFilterProject(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"><option value="All">All Projects</option>{projects.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select></div>
                  <div className="space-y-1"><label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Source</label><select value={actFilterSource} onChange={e=>setActFilterSource(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"><option value="All">All Sources</option>{SOURCES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                  <div className="space-y-1"><label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Call Status</label><select value={actFilterStatus} onChange={e=>setActFilterStatus(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none"><option value="All">All Status</option>{CALL_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                <KpiTile label="Total Calls" value={activityKPIs.totalCalls.toLocaleString()} icon={<Phone/>} color="#ea580c"/>
                <KpiTile label="Followups" value={activityKPIs.totalFollowups.toLocaleString()} icon={<PhoneCall/>} color="#3b82f6"/>
                <KpiTile label="Site Visits" value={activityKPIs.totalSiteVisits} icon={<MapPin/>} color="#10b981"/>
                <KpiTile label="Bookings" value={activityKPIs.totalBookings} icon={<BookOpen/>} color="#8b5cf6"/>
                <KpiTile label="Registration" value={activityKPIs.totalRegistrations} icon={<UserCheck/>} color="#f59e0b"/>
                <KpiTile label="Cancellation" value={activityKPIs.totalCancellations} icon={<XCircle/>} color="#ef4444"/>
                <KpiTile label="Collection" value={`₹${activityKPIs.totalCollection}L`} icon={<Banknote/>} color="#06b6d4"/>
                <KpiTile label="Conversion %" value={`${activityKPIs.convRate}%`} icon={<TrendingUp/>} color="#a3e635"/>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-xl">
                <h3 className="text-sm font-black text-orange-400 mb-4 uppercase tracking-widest">Summary — Projectwise Metrics</h3>
                <div className="overflow-x-auto"><table className="w-full text-left text-xs border-collapse"><thead><tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]"><th className="p-3 min-w-[130px] bg-slate-900/50">Metric</th>{reportSummaryMatrix.projectNames.map(p=><th key={p} className="p-3 text-center min-w-[100px] bg-slate-900/50">{p}</th>)}<th className="p-3 text-center bg-slate-900/80 text-white font-black">TOTAL</th></tr></thead><tbody className="divide-y divide-slate-900">{reportSummaryMatrix.metrics.map((metric,mi)=>{const rowTotal=reportSummaryMatrix.projectNames.reduce((s,p)=>s+(reportSummaryMatrix.data[metric]?.[p]||0),0);const colors=["text-orange-400","text-blue-400","text-emerald-400","text-purple-400","text-amber-400","text-rose-400"];return(<tr key={metric} className="hover:bg-slate-900/30"><td className={`p-3 font-black uppercase tracking-wide text-[10px] ${colors[mi%colors.length]}`}>{metric}</td>{reportSummaryMatrix.projectNames.map(p=><td key={p} className="p-3 text-center font-mono text-slate-300">{reportSummaryMatrix.data[metric]?.[p]||""}</td>)}<td className={`p-3 text-center font-mono font-black ${colors[mi%colors.length]}`}>{rowTotal||""}</td></tr>)})}</tbody></table></div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-xl">
                <h3 className="text-sm font-black text-blue-400 mb-4 uppercase tracking-widest">Executivewise Performance Matrix</h3>
                <div className="overflow-x-auto"><table className="w-full text-left text-xs border-collapse"><thead><tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]"><th className="p-3 bg-slate-900/50 min-w-[120px]">Metric</th>{execDetailedMatrix.map(e=><th key={e.name} className="p-3 text-center bg-slate-900/50 min-w-[90px]">{e.name}</th>)}<th className="p-3 text-center bg-slate-900/80 text-white font-black">TOTAL</th></tr></thead><tbody className="divide-y divide-slate-900">{[{key:"calls",label:"Calls made",color:"text-orange-400"},{key:"followups",label:"Followup",color:"text-blue-400"},{key:"siteVisits",label:"Site visit",color:"text-emerald-400"},{key:"bookings",label:"Booking",color:"text-purple-400"},{key:"registrations",label:"Registration",color:"text-amber-400"},{key:"cancellations",label:"Cancellation",color:"text-rose-400"}].map(row=>(<tr key={row.key} className="hover:bg-slate-900/30"><td className={`p-3 font-black uppercase tracking-wide text-[10px] ${row.color}`}>{row.label}</td>{execDetailedMatrix.map(e=><td key={e.name} className="p-3 text-center font-mono text-slate-300">{e[row.key]||""}</td>)}<td className={`p-3 text-center font-mono font-black ${row.color}`}>{execDetailedMatrix.reduce((s,e)=>s+(e[row.key]||0),0)||""}</td></tr>))}</tbody></table></div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-xl">
                <h3 className="text-sm font-black text-emerald-400 mb-4 uppercase tracking-widest">Sourcewise — Calls by Executive</h3>
                <div className="overflow-x-auto"><table className="w-full text-left text-xs border-collapse"><thead><tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]"><th className="p-3 bg-slate-900/50 min-w-[120px]">Source</th>{sourcewiseMatrix.execNames.map(e=><th key={e} className="p-3 text-center bg-slate-900/50 min-w-[80px]">{e}</th>)}<th className="p-3 text-center bg-slate-900/80 text-white font-black">TOTAL</th></tr></thead><tbody className="divide-y divide-slate-900">{sourcewiseMatrix.srcNames.map(src=>(<tr key={src} className="hover:bg-slate-900/30"><td className="p-3 font-bold text-slate-300">{src}</td>{sourcewiseMatrix.execNames.map(e=><td key={e} className="p-3 text-center font-mono text-slate-400">{sourcewiseMatrix.data[src]?.[e]||""}</td>)}<td className="p-3 text-center font-mono font-black text-white">{sourcewiseMatrix.srcTotals[src]||""}</td></tr>))}<tr className="border-t border-slate-700 font-black text-[11px]"><td className="p-3 text-white">TOTAL</td>{sourcewiseMatrix.execNames.map(e=><td key={e} className="p-3 text-center font-mono text-orange-400">{sourcewiseMatrix.srcNames.reduce((s,src)=>s+(sourcewiseMatrix.data[src]?.[e]||0),0)||""}</td>)}<td className="p-3 text-center font-mono text-orange-400">{Object.values(sourcewiseMatrix.srcTotals).reduce((s,v)=>s+v,0)||""}</td></tr></tbody></table></div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 lg:p-6 shadow-xl">
                <h3 className="text-sm font-black text-amber-400 mb-4 uppercase tracking-widest">Projectwise — Calls by Executive</h3>
                <div className="overflow-x-auto"><table className="w-full text-left text-xs border-collapse"><thead><tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]"><th className="p-3 bg-slate-900/50 min-w-[130px]">Project</th>{projectwiseMatrix.execNames.map(e=><th key={e} className="p-3 text-center bg-slate-900/50 min-w-[80px]">{e}</th>)}<th className="p-3 text-center bg-slate-900/80 text-white font-black">TOTAL</th></tr></thead><tbody className="divide-y divide-slate-900">{projectwiseMatrix.projNames.map(proj=>(<tr key={proj} className="hover:bg-slate-900/30"><td className="p-3 font-bold text-orange-400">{proj}</td>{projectwiseMatrix.execNames.map(e=><td key={e} className="p-3 text-center font-mono text-slate-400">{projectwiseMatrix.data[proj]?.[e]||""}</td>)}<td className="p-3 text-center font-mono font-black text-white">{projectwiseMatrix.projTotals[proj]||""}</td></tr>))}<tr className="border-t border-slate-700 font-black text-[11px]"><td className="p-3 text-white">TOTAL</td>{projectwiseMatrix.execNames.map(e=><td key={e} className="p-3 text-center font-mono text-amber-400">{projectwiseMatrix.projNames.reduce((s,proj)=>s+(projectwiseMatrix.data[proj]?.[e]||0),0)||""}</td>)}<td className="p-3 text-center font-mono text-amber-400">{Object.values(projectwiseMatrix.projTotals).reduce((s,v)=>s+v,0)||""}</td></tr></tbody></table></div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <h3 className="text-sm font-black text-orange-400 flex items-center gap-2 uppercase tracking-wider mb-4"><BarChart3 className="h-4 w-4"/> Executive Pipeline Summary</h3>
                <div className="overflow-x-auto w-full"><table className="w-full text-left text-xs border-collapse"><thead><tr className="text-slate-500 font-bold border-b border-slate-900 uppercase"><th className="pb-2 pl-2">Executive</th><th className="pb-2 text-center text-blue-400">Total</th><th className="pb-2 text-center">Untouched</th><th className="pb-2 text-center text-amber-400">Active</th><th className="pb-2 text-center text-purple-400">Site Visits</th><th className="pb-2 text-center text-emerald-400">Bookings</th><th className="pb-2 text-center text-rose-400">Dead</th></tr></thead><tbody className="divide-y divide-slate-900 text-slate-300">{executiveSummaryData.map((exec,idx)=>(<tr key={idx} className="hover:bg-slate-900/20"><td className="py-3 pl-2 font-bold text-white">{exec.name}</td><td className="py-3 text-center font-mono font-bold text-blue-400">{exec.total}</td><td className="py-3 text-center font-mono">{exec.new}</td><td className="py-3 text-center font-mono text-amber-400/80">{exec.active}</td><td className="py-3 text-center font-mono text-purple-400/80">{exec.siteVisits}</td><td className="py-3 text-center font-mono font-black text-emerald-400">{exec.bookings}</td><td className="py-3 text-center font-mono text-rose-400/80">{exec.dead}</td></tr>))}</tbody>{executiveSummaryData.length>0&&(<tfoot className="bg-slate-900/50 border-t border-slate-800 font-black"><tr><td className="py-3 pl-2 text-white">TOTALS</td><td className="py-3 text-center font-mono text-blue-400">{executiveSummaryData.reduce((a,c)=>a+c.total,0)}</td><td className="py-3 text-center font-mono">{executiveSummaryData.reduce((a,c)=>a+c.new,0)}</td><td className="py-3 text-center font-mono text-amber-400/80">{executiveSummaryData.reduce((a,c)=>a+c.active,0)}</td><td className="py-3 text-center font-mono text-purple-400/80">{executiveSummaryData.reduce((a,c)=>a+c.siteVisits,0)}</td><td className="py-3 text-center font-mono text-emerald-400">{executiveSummaryData.reduce((a,c)=>a+c.bookings,0)}</td><td className="py-3 text-center font-mono text-rose-400/80">{executiveSummaryData.reduce((a,c)=>a+c.dead,0)}</td></tr></tfoot>)}</table></div>
              </div>
            </div>
          )}

          {/* ═══ SYSTEM CONTROL HUB ════════════════════════════════════ */}
          {activeTab==="users"&&currentUser.role==="Admin"&&(
            <div className="space-y-8">
              {/* Password Reset Requests always at top of hub */}
              <AdminResetRequestsPanel
                resetRequests={resetRequests}
                setResetRequests={setResetRequests}
                triggerToastAlert={triggerToastAlert}
              />

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
                <div>
                  <h3 className="text-sm font-black text-orange-400 flex items-center gap-2 uppercase tracking-wider"><Users className="h-4 w-4"/> Active Corporate Roster</h3>
                  <p className="text-xs text-slate-400">Manage, modify, or revoke access for deployed team members.</p>
                  <div className="mt-2 bg-blue-950/30 border border-blue-500/20 rounded-xl p-2.5 flex items-start gap-2">
                    <Info className="h-3.5 w-3.5 text-blue-400 mt-0.5 shrink-0"/>
                    <p className="text-[10px] text-blue-300/70">Admin accounts (Shaj, Digital Marketing) are managed separately and not editable here. All other user credentials are stored securely in the database.</p>
                  </div>
                </div>
                <div className="overflow-x-auto w-full pt-2">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead><tr className="text-slate-500 font-bold border-b border-slate-900 uppercase"><th className="pb-2">Personnel</th><th className="pb-2">Role & Branch</th><th className="pb-2">Contact</th><th className="pb-2 text-right">Actions</th></tr></thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {users.map(u=>{
                        const isHardcodedAdmin = HARDCODED_ADMINS.some(a => a.id === u.id);
                        return (
                          <tr key={u.id} className={`hover:bg-slate-900/20 transition-all ${isHardcodedAdmin ? "opacity-60" : ""}`}>
                            <td className="py-3 font-bold text-white">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-orange-400">{u.avatar}</div>
                                <div>
                                  <p>{u.name} {isHardcodedAdmin && <span className="text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-black ml-1">SYSTEM</span>}</p>
                                  <p className="text-[10px] text-slate-500 font-mono font-normal">ID: {u.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3"><p className="font-semibold text-orange-400">{u.role}</p><p className="text-[10px] text-slate-400 font-mono">{u.branch}</p></td>
                            <td className="py-3 font-mono text-slate-400"><p>{u.phone}</p><p className="text-[10px]">{u.email}</p></td>
                            <td className="py-3 text-right space-x-2">
                              {!isHardcodedAdmin ? (
                                <>
                                  <button onClick={()=>openEditUserModal(u)} className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded border border-slate-800 transition-colors"><Edit2 className="h-3.5 w-3.5"/></button>
                                  <button onClick={()=>handleDeleteUser(u.id)} className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded border border-rose-500/20 transition-colors"><Trash2 className="h-3.5 w-3.5"/></button>
                                </>
                              ) : (
                                <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider px-2">Protected</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl h-fit">
                  <h3 className="text-sm font-black text-orange-400 flex items-center gap-2 uppercase tracking-wider"><UserPlus className="h-4 w-4"/> Deploy New Profile</h3>
                  <form onSubmit={handleCreateUserSubmit} className="space-y-4 text-xs pt-1">
                    <div className="space-y-1"><label className="text-slate-400 font-bold">Full Name *</label><input type="text" required value={newUserForm.name} onChange={e=>setNewUserForm({...newUserForm,name:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-orange-500"/></div>
                    <div className="space-y-1"><label className="text-slate-400 font-bold">Username Prefix *</label><div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden focus-within:border-orange-500"><input type="text" required value={newUserForm.emailPrefix} onChange={e=>setNewUserForm({...newUserForm,emailPrefix:e.target.value})} className="w-full bg-transparent p-2.5 text-slate-200 focus:outline-none text-right pr-1" placeholder="username"/><span className="text-slate-500 font-bold pr-3 pl-1 shrink-0 font-mono">@desam</span></div></div>
                    <div className="space-y-1"><label className="text-slate-400 font-bold">Password *</label><input type="password" required value={newUserForm.pass} onChange={e=>setNewUserForm({...newUserForm,pass:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"/></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1"><label className="text-slate-400 font-bold">Role</label><select value={newUserForm.role} onChange={e=>setNewUserForm({...newUserForm,role:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-300 focus:outline-none">{ROLES.filter(r=>r!=="Admin").map(r=><option key={r} value={r}>{r}</option>)}</select></div>
                      <div className="space-y-1"><label className="text-slate-400 font-bold">Branch</label><select value={newUserForm.branch} onChange={e=>setNewUserForm({...newUserForm,branch:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-300 focus:outline-none">{BRANCHES.map(b=><option key={b} value={b}>{b}</option>)}</select></div>
                    </div>
                    <div className="space-y-1"><label className="text-slate-400 font-bold">Phone</label><input type="text" value={newUserForm.phone} onChange={e=>setNewUserForm({...newUserForm,phone:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 font-mono"/></div>
                    <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-md mt-1">Create Profile</button>
                  </form>
                </div>
                <div className="space-y-6">
                  <ExcelImportPanel activityLogs={activityLogs} setActivityLogs={setActivityLogsWrapped} triggerToastAlert={triggerToastAlert}/>
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
                    <h3 className="text-sm font-black text-slate-500 flex items-center gap-2 uppercase tracking-wider"><Upload className="h-4 w-4"/> Lead Paste Import (Tab-Separated)</h3>
                    <form onSubmit={handleDataImportSubmit} className="space-y-4 pt-1">
                      <textarea rows={4} value={importText} onChange={e=>setImportText(e.target.value)} placeholder={"Name\tPhone\tEmail\tProject\tLocation\tBudget\tSource"} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-mono leading-relaxed"/>
                      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-3 flex gap-3 items-start text-xs text-slate-400"><Info className="h-4 w-4 text-orange-500 mt-0.5 shrink-0"/><p>Tab-separated paste from Excel. Columns: Name, Phone, Email, Project, Location, Budget, Source</p></div>
                      <button type="submit" className="w-full flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all"><FileSpreadsheet className="h-4 w-4"/> Import Leads (paste)</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── CONFIRMATION POPUP ── */}
      {customPopup.isOpen&&(<div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"><div className="bg-slate-950 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl text-center"><div className="h-12 w-12 bg-orange-500/10 text-orange-500 border border-orange-500/20 rounded-full flex items-center justify-center mx-auto"><ShieldAlert className="h-6 w-6"/></div><div className="space-y-1.5"><h3 className="text-base font-black text-white tracking-wide uppercase">{customPopup.title}</h3><p className="text-xs text-slate-400 leading-relaxed font-medium">{customPopup.message}</p></div><div className="grid grid-cols-2 gap-2.5 pt-2 text-xs uppercase font-black tracking-wider"><button onClick={()=>setCustomPopup({isOpen:false,leadId:null,targetValue:"",type:"status",title:"",message:""})} className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white py-2.5 rounded-xl transition-all">✕ Cancel</button><button onClick={confirmCustomPopupAction} className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white py-2.5 rounded-xl transition-all shadow-md">✓ Confirm</button></div></div></div>)}

      {/* ── TOAST ── */}
      {toastNotification.isVisible&&(<div className="fixed bottom-6 right-6 bg-slate-950 border border-emerald-500/40 text-emerald-400 font-bold px-4 py-3 rounded-xl shadow-2xl z-[110] flex items-center gap-2 text-xs uppercase tracking-wide"><div className="h-5 w-5 bg-emerald-500/10 rounded-full flex items-center justify-center"><Check className="h-3 w-3"/></div>{toastNotification.message}</div>)}

      {/* ── EDIT USER MODAL ── */}
      {isEditUserModalOpen&&editUserForm&&(<div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl relative"><div className="flex justify-between items-center border-b border-slate-900 pb-3"><h2 className="text-base font-black text-white tracking-wide uppercase">Edit Profile</h2><button onClick={()=>{setIsEditUserModalOpen(false);setEditUserForm(null);}} className="text-slate-500 hover:text-white">✕</button></div><form onSubmit={handleUpdateUserSubmit} className="space-y-4 text-xs"><div className="space-y-1"><label className="text-slate-400 font-bold">Full Name *</label><input type="text" required value={editUserForm.name} onChange={e=>setEditUserForm({...editUserForm,name:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-orange-500"/></div><div className="space-y-1"><label className="text-slate-400 font-bold">Username Prefix *</label><div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl overflow-hidden focus-within:border-orange-500"><input type="text" required value={editUserForm.email.split('@')[0]} onChange={e=>setEditUserForm({...editUserForm,email:`${e.target.value}@desam`})} className="w-full bg-transparent p-2.5 text-slate-200 focus:outline-none text-right pr-1"/><span className="text-slate-500 font-bold pr-3 pl-1 shrink-0 font-mono">@desam</span></div></div><div className="space-y-1"><label className="text-slate-400 font-bold">Password *</label><input type="password" required value={editUserForm.pass} onChange={e=>setEditUserForm({...editUserForm,pass:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none"/></div><div className="grid grid-cols-2 gap-3"><div className="space-y-1"><label className="text-slate-400 font-bold">Role</label><select value={editUserForm.role} onChange={e=>setEditUserForm({...editUserForm,role:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-300 focus:outline-none">{ROLES.filter(r=>r!=="Admin").map(r=><option key={r} value={r}>{r}</option>)}</select></div><div className="space-y-1"><label className="text-slate-400 font-bold">Branch</label><select value={editUserForm.branch} onChange={e=>setEditUserForm({...editUserForm,branch:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-300 focus:outline-none">{BRANCHES.map(b=><option key={b} value={b}>{b}</option>)}</select></div></div><div className="space-y-1"><label className="text-slate-400 font-bold">Phone</label><input type="text" value={editUserForm.phone} onChange={e=>setEditUserForm({...editUserForm,phone:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 font-mono"/></div><button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white font-black py-3 rounded-xl uppercase tracking-wider transition-all shadow-md mt-2">Update Profile</button></form></div></div>)}

      {/* ── LEAD DETAIL MODAL ── */}
      {selectedLead&&(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={()=>setSelectedLead(null)}>
          <div className="bg-slate-950 border border-slate-800 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl p-6 space-y-6 shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="border-b border-slate-900 pb-3 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] bg-orange-600 font-mono font-black px-2 py-0.5 rounded text-white uppercase tracking-wider">{["Admin","Manager"].includes(currentUser.role)?"Assignment Hub":"Lead Dossier"}</span>
                <h3 className="text-xl font-black text-white">{selectedLead.name}</h3>
                <p className="text-xs text-slate-500 tracking-wide font-mono">#{selectedLead.id} • Assigned: <span className="text-slate-300 font-bold">{selectedLead.assignedTo}</span></p>
                {selectedLead.siteVisitTentativeDate&&<p className="text-xs font-black text-purple-400 mt-1 flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-xl w-fit"><Calendar className="h-3.5 w-3.5"/> WALKTHROUGH: {selectedLead.siteVisitTentativeDate}</p>}
              </div>
              <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                <div className="space-y-1"><label className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">Status</label><select value={selectedLead.status} onChange={e=>handleInlineMilestoneStatusChange(selectedLead.id,e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-black focus:outline-none focus:border-orange-500 cursor-pointer min-w-[150px]" style={{color:SC[selectedLead.status]?.text||"#FFF"}}>{STATUSES.map(st=><option key={st} value={st}>{st}</option>)}</select></div>
                {["Admin","Manager"].includes(currentUser.role)&&(<div className="space-y-1"><label className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">Assign To</label><select value={selectedLead.assignedTo} onChange={e=>requestOwnerAssignmentPopup(selectedLead.id,e.target.value)} className="bg-slate-900 border border-slate-800 text-slate-100 rounded-xl px-3 py-1.5 text-xs font-black focus:outline-none focus:border-orange-500 cursor-pointer min-w-[180px]"><option value="Unassigned">⚠️ Select Staff</option><optgroup label="Managers">{users.filter(u=>u.role==="Manager").map(u=><option key={u.id} value={u.name}>{u.name} (Mgr)</option>)}</optgroup><optgroup label="Staff">{users.filter(u=>["Executive","Telecaller"].includes(u.role)).map(u=><option key={u.id} value={u.name}>{u.name} ({u.role})</option>)}</optgroup></select></div>)}
                <button onClick={()=>setSelectedLead(null)} className="text-slate-500 hover:text-white font-bold bg-slate-900 border border-slate-800 p-2 rounded-xl mt-4 self-end">✕</button>
              </div>
            </div>
            {selectedLead.status==="Site Visit Planned"&&(<form onSubmit={commitTentativeWalkthroughPlan} className="bg-purple-950/40 p-4 border border-purple-500/30 rounded-xl space-y-3 text-xs"><div className="flex items-center gap-2 text-purple-400 font-black tracking-wide uppercase"><Calendar className="h-4 w-4"/> Set Tentative Site Visit Date</div><div className="flex gap-2"><input type="date" required min={TODAY_STR} value={tentativeWalkthroughDateInput} onChange={e=>setTentativeWalkthroughDateInput(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 font-mono focus:outline-none focus:border-purple-500 cursor-pointer"/><button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-black px-5 rounded-xl uppercase tracking-wider transition-colors shadow-md">Save</button></div></form>)}
            <div className="bg-slate-900/80 p-4 border border-slate-800 rounded-xl space-y-2 text-xs">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Contact Info</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-200">
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 font-mono font-bold text-[9px] uppercase">Primary:</span>
                  <span className="font-mono font-bold text-orange-400">{selectedLead.phone}</span>
                  {/* Mobile call button in lead detail */}
                  {isMobile && (
                    <MobileCallButton
                      phone={selectedLead.phone}
                      leadName={selectedLead.name}
                      TODAY_STR={TODAY_STR}
                      currentUser={currentUser}
                      onFeedbackSaved={(fb) => handleCallFeedback(selectedLead.id, fb)}
                    />
                  )}
                </div>
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800"><span className="text-slate-500 font-mono font-bold text-[9px] uppercase">Alt:</span><span className="font-mono text-slate-300">{selectedLead.altPhone||"—"}</span></div>
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 col-span-2"><span className="text-slate-500 font-mono font-bold text-[9px] uppercase">Email:</span><span className="font-medium text-slate-300 truncate">{selectedLead.email||"—"}</span></div>
              </div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="flex items-center justify-between"><h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"><Clock className="h-4 w-4 text-orange-500"/> INTERACTION TIMELINE</h4><span className="text-[10px] bg-slate-900 text-slate-400 px-2.5 py-0.5 rounded-full border border-slate-800 font-mono font-bold">{selectedLead.history?.length||0} Entries</span></div>
              <div className="relative max-h-[280px] overflow-y-auto pr-2 space-y-0 pt-2 pl-2">
                <div className="absolute left-[56px] top-0 bottom-4 w-1.5 bg-gradient-to-b from-rose-500 via-orange-500 via-amber-500 to-teal-400 rounded-full"></div>
                {selectedLead.history&&selectedLead.history.length>0?selectedLead.history.map((log,index)=>{
                  const stepNumber=selectedLead.history.length-index; const stepString=stepNumber<10?`0${stepNumber}`:`${stepNumber}`;
                  const colorMap=[{text:"text-rose-500",border:"border-rose-500/30",bg:"bg-rose-500",nodeRing:"ring-rose-500/20"},{text:"text-orange-500",border:"border-orange-500/30",bg:"bg-orange-500",nodeRing:"ring-orange-500/20"},{text:"text-amber-500",border:"border-amber-500/30",bg:"bg-amber-400",nodeRing:"ring-amber-500/20"},{text:"text-teal-400",border:"border-teal-400/30",bg:"bg-teal-400",nodeRing:"ring-teal-400/20"}][index%4];
                  return(<div key={index} className="flex gap-4 items-center pb-5 last:pb-2 group"><div className={`w-10 font-mono font-black text-xs text-right tracking-wider pr-1 shrink-0 ${colorMap.text}`}>STEP</div><div className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center font-black text-[10px] text-slate-950 ring-4 shadow-md z-10 font-mono ${colorMap.bg} ${colorMap.nodeRing}`}>{stepString}</div><div className={`flex-1 bg-slate-900/50 border ${colorMap.border} p-3 rounded-xl space-y-1 hover:bg-slate-900 transition-all`}><div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1"><h5 className="font-black text-white text-[11px] uppercase tracking-wide">By: <span className={colorMap.text}>{log.by}</span></h5><span className="text-[9px] font-bold text-slate-500 font-mono bg-slate-950 px-1.5 py-0.5 rounded">{log.date}</span></div><p className="text-slate-300 text-[11px] leading-relaxed font-medium pl-1.5 border-l border-slate-800">{log.action}</p></div></div>);
                }):<p className="text-xs text-slate-500 italic text-center py-6">No history yet.</p>}
              </div>
            </div>
            {!["Admin","Manager"].includes(currentUser.role)&&(
              <div className="space-y-5 text-xs">
                <div className="bg-slate-900 p-4 border border-slate-800 rounded-xl grid grid-cols-2 gap-4 font-semibold text-slate-300"><div><p className="text-slate-500 text-[10px] font-bold uppercase">Project</p><p className="text-white mt-0.5 font-bold">{selectedLead.project}</p></div><div><p className="text-slate-500 text-[10px] font-bold uppercase">Budget</p><p className="text-emerald-400 mt-0.5 font-bold font-mono">₹{selectedLead.budget}L</p></div><div className="col-span-2"><p className="text-slate-500 text-[10px] font-bold uppercase">Notes</p><p className="text-slate-300 font-normal mt-0.5 italic">"{selectedLead.notes||'None.'}"</p></div></div>
                <form onSubmit={commitManualFollowUpReport} className="bg-slate-900/50 p-4 border border-slate-800 rounded-xl space-y-3"><p className="text-[11px] font-black uppercase text-orange-400 tracking-wider">Log Follow-Up</p><div className="space-y-1"><label className="text-slate-400 font-medium text-[10px]">Notes *</label><textarea rows={2} required value={followUpNotes} onChange={e=>setFollowUpNotes(e.target.value)} placeholder="Conversation summary..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:outline-none"/></div><div className="space-y-1"><label className="text-slate-400 font-medium text-[10px]">Next Follow-up Date *</label><input type="date" required min={TODAY_STR} value={nextFollowUpDate} onChange={e=>setNextFollowUpDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:outline-none font-mono cursor-pointer"/></div><button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black py-2 rounded-xl text-xs uppercase tracking-wider transition-all">Log Follow-up</button></form>
                <div className="bg-slate-900/50 p-4 border border-slate-800 rounded-xl space-y-3"><p className="text-[11px] font-black uppercase text-amber-400 tracking-wider">Log Site Visit</p><div className="grid grid-cols-2 gap-2"><div className="space-y-1"><label className="text-slate-400 text-[10px]">Visit Date</label><input type="date" value={svDate} onChange={e=>setSvDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200 font-mono"/></div><div className="space-y-1"><label className="text-slate-400 text-[10px]">Family / Co-Buyers</label><input type="text" value={svFamily} onChange={e=>setSvFamily(e.target.value)} placeholder="Spouse, etc." className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200"/></div></div><div className="space-y-1"><label className="text-slate-400 text-[10px]">Feedback *</label><textarea rows={1} value={svFeedback} onChange={e=>setSvFeedback(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 focus:outline-none"/></div><button type="button" onClick={commitSiteWalkthroughLog} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-1.5 rounded-xl uppercase tracking-wider">Confirm Site Visit</button></div>
                <div className="bg-slate-900/50 p-4 border border-slate-800 rounded-xl space-y-3"><p className="text-[11px] font-black uppercase text-emerald-400 tracking-wider">Secure Booking</p><div className="grid grid-cols-2 gap-2"><div className="space-y-1"><label className="text-slate-400 text-[10px]">Unit *</label><input type="text" value={bkUnit} onChange={e=>setBkUnit(e.target.value)} placeholder="e.g. Plot 42" className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-slate-200"/></div><div className="space-y-1"><label className="text-slate-400 text-[10px]">Amount (₹) *</label><input type="number" value={bkAmount} onChange={e=>setBkAmount(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-emerald-400 font-bold focus:outline-none"/></div></div><button type="button" onClick={commitFinancialBookingLog} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-1.5 rounded-xl uppercase tracking-wider">Confirm Booking</button></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── NEW LEAD MODAL ── */}
      {isLeadModalOpen&&(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-slate-900 pb-3"><h2 className="text-base font-black text-white tracking-wide uppercase">Add New Lead</h2><button onClick={()=>{setIsLeadModalOpen(false);setDuplicateConflictRecord(null);}} className="text-slate-500 hover:text-white">✕</button></div>
            {duplicateConflictRecord&&(
              <div className="absolute inset-x-6 top-16 bottom-6 bg-slate-950/95 border border-rose-500/40 rounded-xl p-5 z-20 flex flex-col justify-between space-y-3 backdrop-blur-md">
                <div className="space-y-3"><div className="flex items-center gap-2 text-rose-400 font-black tracking-wide text-xs"><AlertTriangle className="h-5 w-5 animate-bounce"/> DUPLICATE DETECTED</div><p className="text-slate-400 text-[11px]">Phone <span className="text-white font-black font-mono bg-slate-900 px-1.5 py-0.5 rounded">{duplicateConflictRecord.phone}</span> already exists.</p><div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 space-y-1.5 text-xs"><div className="flex justify-between"><span className="text-rose-300">Customer:</span><span className="text-white font-bold">{duplicateConflictRecord.name}</span></div><div className="flex justify-between"><span className="text-rose-300">Assigned:</span><span className="text-white font-bold">{duplicateConflictRecord.assignedTo}</span></div></div></div>
                <button type="button" onClick={()=>setDuplicateConflictRecord(null)} className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 rounded-xl uppercase transition-colors">Edit Number</button>
              </div>
            )}
            <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><label className="text-slate-400 font-semibold">Name *</label><input type="text" required value={newLeadForm.name} onChange={e=>setNewLeadForm({...newLeadForm,name:e.target.value})} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-orange-500"/></div>
                <div className="space-y-1"><label className="text-slate-400 font-semibold">Source</label><select value={newLeadForm.source} onChange={e=>setNewLeadForm({...newLeadForm,source:e.target.value})} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-300 focus:outline-none">{SOURCES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><label className="text-slate-400 font-semibold">Primary Phone *</label><input type="text" required value={newLeadForm.phone} onChange={e=>handlePhoneInputChange(e.target.value,false)} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-200 font-mono font-bold focus:outline-none focus:border-orange-500"/></div>
                <div className="space-y-1"><label className="text-slate-400 font-semibold">Alt Phone</label><input type="text" value={newLeadForm.altPhone} onChange={e=>handlePhoneInputChange(e.target.value,true)} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-200 font-mono focus:outline-none focus:border-orange-500"/></div>
              </div>
              <div className="space-y-1"><label className="text-slate-400 font-semibold">Project</label><select value={newLeadForm.project} onChange={e=>setNewLeadForm({...newLeadForm,project:e.target.value})} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-300 focus:outline-none">{projects.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select></div>
              {currentUser.role==="Admin"&&(
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold flex items-center gap-1.5"><UserCheck className="h-3.5 w-3.5 text-orange-400"/> Assign To</label>
                  <select value={newLeadForm.assignedTo} onChange={e=>setNewLeadForm({...newLeadForm,assignedTo:e.target.value})} className="w-full bg-slate-900 border border-orange-500/30 p-2.5 rounded-xl text-slate-300 focus:outline-none focus:border-orange-500">
                    <option value="Unassigned">⚠️ Leave Unassigned</option>
                    <optgroup label="Managers">{users.filter(u=>u.role==="Manager").map(u=><option key={u.id} value={u.name}>{u.name} (Manager)</option>)}</optgroup>
                    <optgroup label="Executives">{users.filter(u=>u.role==="Executive").map(u=><option key={u.id} value={u.name}>{u.name} (Executive)</option>)}</optgroup>
                    <optgroup label="Telecallers">{users.filter(u=>u.role==="Telecaller").map(u=><option key={u.id} value={u.name}>{u.name} (Telecaller)</option>)}</optgroup>
                  </select>
                  {newLeadForm.assignedTo&&newLeadForm.assignedTo!=="Unassigned"&&(
                    <p className="text-[10px] text-orange-400 font-bold flex items-center gap-1 mt-0.5"><Check className="h-3 w-3"/> Lead will be directly assigned to <span className="text-white">{newLeadForm.assignedTo}</span></p>
                  )}
                </div>
              )}
              <button type="submit" disabled={!!duplicateConflictRecord} className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black py-3 rounded-xl uppercase tracking-wider shadow-lg disabled:opacity-40">Save Lead</button>
            </form>
          </div>
        </div>
      )}

      {/* ── NEW PROJECT MODAL ── */}
      {isProjectModalOpen&&(<div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl"><div className="flex justify-between items-center border-b border-slate-900 pb-3"><h2 className="text-base font-black text-white tracking-wide uppercase">Add New Project</h2><button onClick={()=>setIsProjectModalOpen(false)} className="text-slate-500 hover:text-white">✕</button></div><form onSubmit={handleCreateProject} className="space-y-4 text-xs"><div className="space-y-1"><label className="text-slate-400 font-semibold">Project Name *</label><input type="text" required value={newProjectForm.name} onChange={e=>setNewProjectForm({...newProjectForm,name:e.target.value})} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-orange-500"/></div><div className="grid grid-cols-2 gap-3"><div className="space-y-1"><label className="text-slate-400 font-semibold">Location *</label><input type="text" required value={newProjectForm.location} onChange={e=>setNewProjectForm({...newProjectForm,location:e.target.value})} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-200 focus:outline-none"/></div><div className="space-y-1"><label className="text-slate-400 font-semibold">Branch</label><select value={newProjectForm.branch} onChange={e=>setNewProjectForm({...newProjectForm,branch:e.target.value})} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-300 focus:outline-none">{BRANCHES.map(b=><option key={b} value={b}>{b}</option>)}</select></div></div><div className="grid grid-cols-3 gap-2"><div className="space-y-1"><label className="text-slate-400 font-semibold">Type</label><select value={newProjectForm.type} onChange={e=>setNewProjectForm({...newProjectForm,type:e.target.value})} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-300 focus:outline-none">{PROJECT_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div><div className="space-y-1"><label className="text-slate-400 font-semibold">Price (₹L)</label><input type="number" value={newProjectForm.price} onChange={e=>setNewProjectForm({...newProjectForm,price:e.target.value})} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-200 font-mono"/></div><div className="space-y-1"><label className="text-slate-400 font-semibold">Status</label><select value={newProjectForm.status} onChange={e=>setNewProjectForm({...newProjectForm,status:e.target.value})} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-300 focus:outline-none">{PROJECT_STATUSES.map(st=><option key={st} value={st}>{st}</option>)}</select></div></div><div className="grid grid-cols-2 gap-3"><div className="space-y-1"><label className="text-slate-400 font-semibold">Total Units</label><input type="number" value={newProjectForm.units} onChange={e=>setNewProjectForm({...newProjectForm,units:e.target.value})} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-200"/></div><div className="space-y-1"><label className="text-slate-400 font-semibold">Sold Units</label><input type="number" value={newProjectForm.sold} onChange={e=>setNewProjectForm({...newProjectForm,sold:e.target.value})} className="w-full bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-slate-200"/></div></div><button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black py-3 rounded-xl uppercase tracking-wider shadow-lg">Add Project</button></form></div></div>)}

      {/* ── ADD ACTIVITY LOG MODAL ── */}
      {isActivityLogModalOpen&&(<div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"><div className="flex justify-between items-center border-b border-slate-900 pb-3"><h2 className="text-base font-black text-white tracking-wide uppercase">Add Daily Activity Log</h2><button onClick={()=>setIsActivityLogModalOpen(false)} className="text-slate-500 hover:text-white">✕</button></div><form onSubmit={handleCreateActivityLog} className="space-y-4 text-xs"><div className="grid grid-cols-2 gap-3"><div className="space-y-1"><label className="text-slate-400 font-bold">Date *</label><input type="date" required value={newActivityForm.date} onChange={e=>setNewActivityForm({...newActivityForm,date:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 font-mono focus:outline-none focus:border-orange-500"/></div><div className="space-y-1"><label className="text-slate-400 font-bold">Executive/Telecaller *</label>{["Admin","Manager"].includes(currentUser.role)?(<select value={newActivityForm.executive} onChange={e=>setNewActivityForm({...newActivityForm,executive:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-300 focus:outline-none" required><option value="">Select Executive</option>{users.filter(u=>["Executive","Telecaller","Manager"].includes(u.role)).map(u=><option key={u.id} value={u.name}>{u.name} ({u.role})</option>)}</select>):(<input type="text" value={currentUser.name} disabled className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-2.5 text-slate-400 opacity-70"/>)}</div></div><div className="grid grid-cols-2 gap-3"><div className="space-y-1"><label className="text-slate-400 font-bold">Project *</label><select required value={newActivityForm.project} onChange={e=>setNewActivityForm({...newActivityForm,project:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-300 focus:outline-none">{projects.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select></div><div className="space-y-1"><label className="text-slate-400 font-bold">Source *</label><select required value={newActivityForm.source} onChange={e=>setNewActivityForm({...newActivityForm,source:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-300 focus:outline-none">{SOURCES.map(s=><option key={s} value={s}>{s}</option>)}</select></div></div><div className="grid grid-cols-2 gap-3"><div className="space-y-1"><label className="text-slate-400 font-bold">Calls Made</label><input type="number" min="0" value={newActivityForm.callsMade} onChange={e=>setNewActivityForm({...newActivityForm,callsMade:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 font-mono focus:outline-none"/></div><div className="space-y-1"><label className="text-slate-400 font-bold">Call Status</label><select value={newActivityForm.callStatus} onChange={e=>setNewActivityForm({...newActivityForm,callStatus:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-300 focus:outline-none">{CALL_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select></div></div><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">{[{key:"followup",label:"Followup",color:"text-blue-400"},{key:"siteVisit",label:"Site Visit",color:"text-emerald-400"},{key:"booking",label:"Booking",color:"text-purple-400"},{key:"registration",label:"Registration",color:"text-amber-400"},{key:"cancellation",label:"Cancellation",color:"text-rose-400"},{key:"collection",label:"Collection (₹L)",color:"text-cyan-400"}].map(f=>(<div key={f.key} className="space-y-1"><label className={`font-bold text-[10px] uppercase ${f.color}`}>{f.label}</label><input type="number" min="0" value={newActivityForm[f.key]} onChange={e=>setNewActivityForm({...newActivityForm,[f.key]:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 font-mono focus:outline-none focus:border-orange-500"/></div>))}</div><div className="space-y-1"><label className="text-slate-400 font-bold">Remark</label><textarea rows={2} value={newActivityForm.remark} onChange={e=>setNewActivityForm({...newActivityForm,remark:e.target.value})} placeholder="Notes about calls, follow-ups, or client feedback..." className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-orange-500"/></div><button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white font-black py-3 rounded-xl uppercase tracking-wider shadow-lg">Save Activity Log</button></form></div></div>)}

    </div>
  );
}
