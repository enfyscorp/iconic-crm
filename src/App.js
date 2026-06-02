import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
import { supabase } from "./supabaseClient"; // ─── INTEGRATED BACKEND BRIDGE ───
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
const HARDCODED_ADMINS = [];

// ─── BOOTSTRAP DATA COPIED FOR SYSTEM RESERVES ────────────────────────────
const BOOTSTRAP_NON_ADMIN_USERS = [
  { id: 102, name: "Jibril", email: "jibril@desam", role: "Manager", branch: "Madurai Desk", phone: "9840000002", active: true, avatar: "J" },
  { id: 103, name: "AryaLakshmi", email: "arya@lakshmi", role: "Manager", branch: "Madurai Desk", phone: "9840000003", active: true, avatar: "A" },
  { id: 104, name: "Rohini", email: "rohini@desam", role: "Executive", branch: "Madurai Desk", phone: "9840000004", active: true, avatar: "R" },
  { id: 105, name: "Priyadarshini", email: "priya@desam", role: "Executive", branch: "Madurai Desk", phone: "9840000005", active: true, avatar: "P" },
  { id: 106, name: "Arun", email: "arun@desam", role: "Executive", branch: "Madurai Desk", phone: "9840000006", active: true, avatar: "A" },
  { id: 107, name: "Sumathi", email: "sumathi@desam", role: "Telecaller", branch: "Madurai Desk", phone: "9840000007", active: true, avatar: "S" },
  { id: 108, name: "Shakila", email: "shakila@desam", role: "Telecaller", branch: "Madurai Desk", phone: "9840000008", active: true, avatar: "S" },
  { id: 109, name: "Gowshika", email: "gowshika@desam", role: "Telecaller", branch: "Madurai Desk", phone: "9840000009", active: true, avatar: "G" },
];

const BOOTSTRAP_PROJECTS = [
  { id: 1, name: "Desam Garden", location: "Madurai Bypass", branch: "Madurai Desk", type: "Plot", price: 25, units: 80, sold: 15, status: "Ongoing" },
  { id: 2, name: "Fairland", location: "Uthangudi, Madurai", branch: "Madurai Desk", type: "Villa", price: 95, units: 35, sold: 8, status: "Ongoing" },
  { id: 3, name: "Vishal Virinchi", location: "Bypass Road, Madurai", branch: "Madurai Desk", type: "Apartment", price: 65, units: 10, sold: 2, status: "Ongoing" },
  { id: 4, name: "GK Apartments", location: "Velachery, Chennai", branch: "Chennai South", type: "Apartment", price: 85, units: 120, sold: 45, status: "Completed" },
  { id: 5, name: "Anbu Desam", location: "Saravanampatti, CBE", branch: "Coimbatore", type: "Villa", price: 140, units: 40, sold: 12, status: "Pre-Launch" },
  { id: 6, name: "Alagar Homes", location: "Alagar Kovil Road, Madurai", branch: "Madurai Desk", type: "Apartment", price: 55, units: 60, sold: 10, status: "Ongoing" },
];

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
const makeSecureToken = (bytesLength = 16) => {
  const bytes = new Uint8Array(bytesLength);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
};

const makeRecoveryCode = () => {
  const raw = makeSecureToken(9).toUpperCase();
  return `${raw.slice(0, 6)}-${raw.slice(6, 12)}-${raw.slice(12, 18)}`;
};

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}

async function makePasswordFields(password) {
  const passwordSalt = makeSecureToken();
  const passwordHash = await sha256Hex(`${passwordSalt}:${password}`);
  return { passwordSalt, passwordHash };
}

async function verifyPassword(user, password) {
  if (!user?.passwordSalt || !user?.passwordHash) return false;
  const hash = await sha256Hex(`${user.passwordSalt}:${password}`);
  return hash === user.passwordHash;
}

async function makeRecoveryFields(recoveryCode) {
  const recoverySalt = makeSecureToken();
  const recoveryHash = await sha256Hex(`${recoverySalt}:${recoveryCode.trim().toUpperCase()}`);
  return { recoverySalt, recoveryHash };
}

async function verifyRecoveryCode(user, recoveryCode) {
  if (!user?.recoverySalt || !user?.recoveryHash) return false;
  const hash = await sha256Hex(`${user.recoverySalt}:${recoveryCode.trim().toUpperCase()}`);
  return hash === user.recoveryHash;
}

async function migratePlainPasswords(rawUsers) {
  let changed = false;
  const users = [];
  for (const rawUser of rawUsers || []) {
    const { pass, ...user } = rawUser;
    if (pass && !user.passwordHash) {
      users.push({ ...user, ...(await makePasswordFields(pass)) });
      changed = true;
    } else {
      users.push(user);
      if (pass) changed = true;
    }
  }
  return { users, changed };
}

function isSupabaseAdminUser(user) {
  const role = String(user?.app_metadata?.role || "").toLowerCase();
  return role === "admin" || user?.app_metadata?.is_admin === true;
}

function authUserToAdmin(user) {
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "Admin";
  return {
    id: user.id,
    name: displayName,
    email: user.email,
    role: "Admin",
    branch: "All Branches",
    phone: user?.phone || "",
    active: true,
    avatar: displayName.charAt(0).toUpperCase(),
    authProvider: "supabase",
  };
}

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
  const [callState, setCallState] = useState("idle");
  const [callDuration, setCallDuration] = useState(0);
  const [feedback, setFeedback] = useState({ rating: 0, notes: "", outcome: "Contacted", followUpDate: "" });
  const timerRef = useRef(null);

  const startCall = () => {
    if (!phone) return;
    window.location.href = `tel:${phone}`;
    setCallState("calling");
    setCallDuration(0);
    timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
  };

  const endCall = () => {
    clearInterval(timerRef.current);
    setCallState("feedback");
  };

  const saveFeedback = () => {
    if (onFeedbackSaved) {
      onFeedbackSaved({ ...feedback, callDuration, calledAt: new Date().toISOString(), phone, leadName });
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

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <>
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

      {callState === "feedback" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[300] flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
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
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Call Quality</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setFeedback(f => ({ ...f, rating: star }))} className="transition-transform hover:scale-110">
                      <Star className={`h-7 w-7 transition-colors ${feedback.rating >= star ? "text-amber-400 fill-amber-400" : "text-slate-700"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Call Outcome</label>
                <select value={feedback.outcome} onChange={e => setFeedback(f => ({ ...f, outcome: e.target.value }))} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Next Follow-up Date</label>
                <input type="date" value={feedback.followUpDate} min={TODAY_STR} onChange={e => setFeedback(f => ({ ...f, followUpDate: e.target.value }))} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Notes</label>
                <textarea rows={2} value={feedback.notes} onChange={e => setFeedback(f => ({ ...f, notes: e.target.value }))} placeholder="What was discussed? Any next steps?" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button onClick={dismiss} className="py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">Skip</button>
                <button onClick={saveFeedback} className="py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 text-white transition-all shadow-lg">Save Feedback</button>
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
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(req.otp).catch(() => {});
    }
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
        <h3 className="text-sm font-black text-orange-400 flex items-center gap-2 uppercase tracking-wider mb-4"><KeyRound className="h-4 w-4" /> Password Reset Requests</h3>
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <div className="h-12 w-12 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center"><ShieldCheck className="h-5 w-5 text-slate-600" /></div>
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
          {active.length > 0 && <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse">{active.length} PENDING</span>}
        </h3>
        {expired.length > 0 && (
          <button onClick={handleClearExpired} className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1 border border-slate-800 px-2.5 py-1.5 rounded-lg bg-slate-900 transition-colors">
            <Trash2 className="h-3 w-3" /> Clear expired
          </button>
        )}
      </div>
      {active.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2">
          <Info className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-[11px] text-amber-300/80 leading-relaxed">Share the OTP below with the user <span className="font-black text-amber-200">directly (in-person or by phone)</span>. They will enter it in the password reset screen. No email required.</p>
        </div>
      )}
      {active.length > 0 && (
        <div className="space-y-4">
          {active.map(req => (
            <div key={req.id} className="bg-slate-900/60 border border-orange-500/20 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-black text-orange-400 text-sm flex-shrink-0">{req.userName.charAt(0).toUpperCase()}</div>
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
              <div className="bg-slate-950 border-2 border-orange-500/30 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">One-Time Password — Share with user</p>
                  <p className="text-3xl font-black text-white tracking-[0.4em] font-mono mt-1">{req.otp}</p>
                </div>
                <button onClick={() => copyOtp(req)} className={`p-2.5 rounded-xl border transition-all ${copiedId === req.id ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white"}`} title="Copy OTP">
                  {copiedId === req.id ? <Check className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[9px] text-slate-600 font-mono">Requested: {new Date(req.requestedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
      {expired.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-wider">Expired / Used</p>
          {expired.map(req => (
            <div key={req.id} className="bg-slate-900/30 border border-slate-800/60 rounded-xl p-3 flex items-center gap-3 opacity-50">
              <div className="h-7 w-7 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-xs flex-shrink-0">{req.userName.charAt(0).toUpperCase()}</div>
              <div className="flex-1 min-w-0"><p className="text-[11px] font-bold text-slate-400">{req.userName}</p><p className="text-[10px] text-slate-600 font-mono">{req.userEmail}</p></div>
              <span className="text-[9px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded font-black uppercase">{req.consumed ? "Used" : "Expired"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ADMIN LOGIN RESET POPUP ─────────────────────────────────────────────
function AdminLoginResetPopup({ count, onGoToHub, onDismiss }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[500] flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-orange-500/30 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-900/30 to-slate-900 border-b border-slate-800 p-5 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center animate-pulse"><KeyRound className="h-5 w-5 text-rose-400" /></div>
          <div><h3 className="text-sm font-black text-white uppercase tracking-wide">Reset Requests Pending</h3><p className="text-[10px] text-slate-400 mt-0.5">Requires your attention</p></div>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-rose-950/30 border border-rose-500/20 rounded-xl p-4 text-center space-y-2">
            <p className="text-4xl font-black text-rose-400">{count}</p>
            <p className="text-xs font-bold text-slate-300">{count === 1 ? "user has" : "users have"} requested a password reset.</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">Go to System Control Hub to view the OTPs and share them with the users directly.</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onDismiss} className="py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">Later</button>
            <button onClick={onGoToHub} className="py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white transition-all shadow-lg flex items-center justify-center gap-1.5"><ArrowRight className="h-3.5 w-3.5" /> Go to Hub</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PASSWORD RESET MODAL ─────────────────────────────────────────────────
function AdminSetupPanel() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased text-slate-200">
      <div className="sm:mx-auto w-full max-w-md px-4">
        <div className="bg-slate-950 py-8 px-6 border border-slate-800 rounded-2xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <ShieldAlert className="h-10 w-10 text-rose-400 mx-auto" />
            <h1 className="text-lg font-black text-white uppercase tracking-wide">Admin Not Configured</h1>
            <p className="text-xs text-slate-500 leading-relaxed">This CRM is locked because no backend admin account exists. Admin accounts cannot be created from this public page.</p>
          </div>
          <div className="bg-rose-950/30 border border-rose-500/20 rounded-xl p-4 space-y-2">
            <p className="text-[10px] font-black text-rose-300 uppercase tracking-wider">Backend setup required</p>
            <p className="text-xs text-rose-100/70 leading-relaxed">Ask the developer or database admin to create the first admin record privately in the backend. After that, this screen will become the normal login page on every device.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminRecoveryModal({ users, setUsers, onClose }) {
  const [form, setForm] = useState({ recoveryCode: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) { setError("Admin password must be at least 8 characters."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    const admins = users.filter(u => u.role === "Admin");
    let matched = null;
    for (const admin of admins) {
      if (await verifyRecoveryCode(admin, form.recoveryCode)) {
        matched = admin;
        break;
      }
    }
    if (!matched) { setError("Recovery code did not match any admin account."); return; }
    const newRecoveryCode = makeRecoveryCode();
    const email = form.email.trim().toLowerCase();
    if (users.some(u => u.id !== matched.id && u.email.toLowerCase() === email)) {
      setError("That username already exists.");
      return;
    }
    const updatedAdmin = {
      ...matched,
      email,
      ...(await makePasswordFields(form.password)),
      ...(await makeRecoveryFields(newRecoveryCode)),
    };
    await setUsers(users.map(u => u.id === matched.id ? updatedAdmin : u));
    setForm({ recoveryCode: newRecoveryCode, email: "", password: "", confirm: "" });
    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[250] flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2"><KeyRound className="h-4 w-4 text-orange-400" /> Admin Recovery</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-1.5 hover:bg-slate-900 rounded-lg"><X className="h-5 w-5" /></button>
        </div>
        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <input type="text" required value={form.recoveryCode} onChange={e=>setForm({...form,recoveryCode:e.target.value.toUpperCase()})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500 font-mono" placeholder="Recovery code" />
            <input type="text" required value={form.email} onChange={e=>setForm({...form,email:e.target.value.toLowerCase().replace(/\s/g,'')})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500 font-mono" placeholder="New admin username" />
            <input type="password" required minLength={8} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500" placeholder="New admin password" />
            <input type="password" required minLength={8} value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500" placeholder="Confirm password" />
            {error && <p className="text-rose-400 font-bold bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">{error}</p>}
            <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white font-black py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-lg">Reset Admin</button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4">
              <p className="text-[10px] text-emerald-400 uppercase font-black tracking-wider">New Recovery Code</p>
              <p className="text-xl font-black text-white font-mono tracking-widest mt-2">{form.recoveryCode}</p>
            </div>
            <p className="text-xs text-slate-400">Admin login was reset. Keep this new recovery code privately.</p>
            <button onClick={onClose} className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-black py-2.5 rounded-xl uppercase tracking-wider transition-all">Back to Login</button>
          </div>
        )}
      </div>
    </div>
  );
}

function PasswordResetModal({ users, setUsers, resetRequests, setResetRequests, onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [currentReqId, setCurrentReqId] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpTimeLeft, setOtpTimeLeft] = useState(300);
  const [otpExpiry, setOtpExpiry] = useState(null);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [targetUser, setTargetUser] = useState(null);

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

  const handleEmailSubmit = (e) => {
    e.preventDefault(); setError("");
    const trimmed = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === trimmed && u.active);
    if (!found) { setError("No active account found with this username."); return; }
    if (found.role === "Admin") { setError("Admin password recovery is handled in Supabase Auth."); return; }
    setTargetUser(found);
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiry = Date.now() + 5 * 60 * 1000;
    const reqId = Date.now();
    const newReq = { id: reqId, userName: found.name, userEmail: found.email, userRole: found.role, otp: code, requestedAt: Date.now(), expiresAt: expiry, consumed: false };
    setResetRequests(prev => [newReq, ...prev]);
    setCurrentReqId(reqId); setOtpExpiry(expiry); setOtpTimeLeft(300); setStep(2);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault(); setError("");
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
    const newReq = { id: reqId, userName: targetUser.name, userEmail: targetUser.email, userRole: targetUser.role, otp: code, requestedAt: Date.now(), expiresAt: expiry, consumed: false };
    setResetRequests(prev => [newReq, ...prev]);
    setCurrentReqId(reqId); setOtpExpiry(expiry); setOtpTimeLeft(300); setOtp(""); setError("");
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (newPass.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (newPass !== confirmPass) { setError("Passwords do not match."); return; }
    const passwordFields = await makePasswordFields(newPass);
    setUsers(users.map(u => u.id === targetUser.id ? { ...u, ...passwordFields } : u));
    setStep(4);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center"><ShieldCheck className="h-5 w-5 text-orange-400" /></div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wide">Password Reset</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">{step===1&&"Enter your account username"}{step===2&&"Contact admin for your OTP"}{step===3&&"Set a new password"}{step===4&&"Reset complete"}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-1.5 hover:bg-slate-900 rounded-lg"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex items-center justify-between px-6 py-3 bg-slate-900/40 border-b border-slate-800/60">
          {[1,2,3,4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${step > s ? "bg-emerald-500 text-white" : step === s ? "bg-orange-500 text-white ring-4 ring-orange-500/20" : "bg-slate-800 text-slate-500"}`}>
                {step > s ? <Check className="h-3 w-3" /> : s}
              </div>
              {s < 4 && <div className={`h-0.5 w-8 sm:w-14 rounded-full transition-all ${step > s ? "bg-emerald-500/60" : "bg-slate-800"} `} />}
            </div>
          ))}
        </div>
        <div className="p-6 space-y-5">
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-4 text-xs">
              <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-3 flex items-start gap-2"><Info className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" /><p className="text-[11px] text-blue-300/80 leading-relaxed">Enter your <span className="font-black text-blue-200">account username</span>. A one-time code will be sent to your <span className="font-black text-blue-200">system admin</span> — contact them to receive it.</p></div>
              <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Account Username</label><div className="relative"><Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" /><input type="text" required value={email} onChange={e=>{setEmail(e.target.value);setError("");}} className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500 font-mono" placeholder="username@desam" autoComplete="off"/></div></div>
              {error && <p className="text-rose-400 font-bold bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20 flex items-center gap-2"><AlertCircle className="h-4 w-4 shrink-0"/>{error}</p>}
              <button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white font-black py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-lg text-xs">Request Reset</button>
            </form>
          )}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-4 text-xs">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center font-bold text-orange-400 text-xs flex-shrink-0">{targetUser?.name.charAt(0).toUpperCase()}</div>
                <div><p className="text-[11px] font-bold text-white">Reset requested for: <span className="text-orange-400">{targetUser?.name}</span></p><p className="text-[10px] text-slate-500 font-mono">{targetUser?.email}</p></div>
              </div>
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2"><div className="h-7 w-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400"/></div><p className="text-[11px] text-emerald-200 font-bold">Request forwarded to Admin Panel</p></div>
                <p className="text-[10px] text-emerald-400/70 pl-9 leading-relaxed"><span className="font-black text-emerald-300">Contact your System Administrator</span> to get the 6-digit OTP code. Expires in:</p>
                <div className={`pl-9 font-mono font-black text-lg ${otpTimeLeft < 60 ? "text-rose-400 animate-pulse" : "text-emerald-300"}`}>{formatTime(otpTimeLeft)}</div>
              </div>
              <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">6-Digit OTP (from Admin)</label><input type="text" required maxLength={6} value={otp} onChange={e=>{setOtp(e.target.value.replace(/\D/g,""));setError("");}} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-orange-500 font-mono font-black text-center text-2xl tracking-[0.5em]" placeholder="——————" autoComplete="one-time-code"/></div>
              {error && <p className="text-rose-400 font-bold bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20 flex items-center gap-2"><AlertCircle className="h-4 w-4 shrink-0"/>{error}</p>}
              <button type="submit" disabled={otp.length < 6 || otpTimeLeft === 0} className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-lg text-xs">Verify OTP</button>
              <div className="flex items-center justify-between pt-1">
                <button type="button" onClick={() => { setStep(1); setError(""); setOtp(""); }} className="text-slate-500 hover:text-slate-300 text-[11px] font-bold flex items-center gap-1 transition-colors"><ArrowLeft className="h-3 w-3" /> Back</button>
                {otpTimeLeft === 0 ? <button type="button" onClick={handleResendOtp} className="text-orange-400 hover:text-orange-300 text-[11px] font-black flex items-center gap-1 transition-colors"><RotateCcw className="h-3 w-3" /> Request New OTP</button> : <span className="text-slate-600 text-[10px] font-mono">Resend after expiry</span>}
              </div>
            </form>
          )}
          {step === 3 && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" /><p className="text-[11px] text-emerald-300/80 leading-relaxed">Identity verified for <span className="font-black text-emerald-200">{targetUser?.name}</span>. Choose a strong new password — minimum 6 characters.</p></div>
              <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">New Password</label><div className="relative"><Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500"/><input type="password" required minLength={6} value={newPass} onChange={e=>{setNewPass(e.target.value);setError("");}} className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500" placeholder="Min. 6 characters"/></div></div>
              <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Confirm New Password</label><div className="relative"><Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500"/><input type="password" required value={confirmPass} onChange={e=>{setConfirmPass(e.target.value);setError("");}} className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500" placeholder="Re-enter password"/></div>{newPass && confirmPass && <p className={`text-[10px] font-bold flex items-center gap-1 ${newPass===confirmPass?"text-emerald-400":"text-rose-400"}`}>{newPass===confirmPass?<><Check className="h-3 w-3"/> Passwords match</>:<><X className="h-3 w-3"/> Passwords do not match</>}</p>}</div>
              {error && <p className="text-rose-400 font-bold bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20 flex items-center gap-2"><AlertCircle className="h-4 w-4 shrink-0"/>{error}</p>}
              <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 text-white font-black py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-lg text-xs">Set New Password</button>
            </form>
          )}
          {step === 4 && (
            <div className="text-center space-y-5 py-4">
              <div className="flex justify-center"><div className="h-20 w-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center"><CheckCircle2 className="h-10 w-10 text-emerald-400"/></div></div>
              <div className="space-y-1.5"><h4 className="text-base font-black text-white">Password Updated!</h4><p className="text-xs text-slate-400">Password for <span className="font-bold text-slate-200">{targetUser?.name}</span> has been successfully reset.</p></div>
              <button onClick={onClose} className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white font-black py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-lg text-xs">Back to Login</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP COMPONENT
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
  const [adminUsers, setAdminUsersState] = useState([]);
  const [nonAdminUsers, setNonAdminUsersState] = useState([]);
  const [projects, setProjectsState] = useState([]);
  const [activityLogs, setActivityLogsState] = useState([]);
  const [resetRequests, setResetRequestsState] = useState([]);

  const users = useMemo(() => [...adminUsers, ...nonAdminUsers], [adminUsers, nonAdminUsers]);

  const persistState = useCallback(async (key, value) => {
    try {
      const { error } = await supabase
        .from("crm_state_store")
        .upsert({ key, value }, { onConflict: "key" });
      if (error) throw error;
      localStorage.setItem(`crm_state_store:${key}`, JSON.stringify(value));
    } catch (err) {
      console.error(`Failed to save ${key}:`, err);
      const message = typeof err?.message === "string" ? err.message : JSON.stringify(err || {});
      window.dispatchEvent(new CustomEvent("crm-backend-error", { detail: { key, message } }));
      try {
        localStorage.setItem(`crm_state_store:${key}`, JSON.stringify(value));
      } catch {}
    }
  }, []);

  const readLocalState = useCallback((key, fallback) => {
    try {
      const raw = localStorage.getItem(`crm_state_store:${key}`);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }, []);

  // ─── SUPABASE COUPLING WRAPPERS ───
  const setLeads = useCallback(async (val) => {
    const data = typeof val === "function" ? val(leads) : val;
    setLeadsState(data);
    await persistState("leads", data);
  }, [leads, persistState]);

  const setUsers = useCallback(async (val) => {
    const allData = typeof val === "function" ? val(users) : val;
    const admins = allData.filter(u => u.role === "Admin");
    const nonAdmins = allData.filter(u => u.role !== "Admin");
    setAdminUsersState(admins);
    setNonAdminUsersState(nonAdmins);
    await persistState("admin_users", admins);
    await persistState("non_admin_users", nonAdmins);
  }, [users, persistState]);

  const setProjects = useCallback(async (val) => {
    const data = typeof val === "function" ? val(projects) : val;
    setProjectsState(data);
    await persistState("projects", data);
  }, [projects, persistState]);

  const setActivityLogsStateWrapped = useCallback((val) => {
    setActivityLogsState(prev => {
      const data = typeof val === "function" ? val(prev) : val;
      persistState("activity_logs", data);
      return data;
    });
  }, [persistState]);

  const setResetRequests = useCallback((val) => {
    setResetRequestsState(prev => {
      const data = typeof val === "function" ? val(prev) : val;
      persistState("reset_requests", data);
      return data;
    });
  }, [persistState]);

  const refreshLeadsFromBackend = useCallback(async () => {
    try {
      const { data: dbRows, error } = await supabase.from("crm_state_store").select("*");
      if (error) throw error;
      const stateMap = {};
      if (Array.isArray(dbRows)) {
        dbRows.forEach(row => { stateMap[row.key] = row.value; });
      }
      if (Array.isArray(stateMap["leads"])) setLeadsState(stateMap["leads"]);
      if (Array.isArray(stateMap["non_admin_users"])) {
        const migrated = await migratePlainPasswords(stateMap["non_admin_users"]);
        setNonAdminUsersState(migrated.users);
        if (migrated.changed) persistState("non_admin_users", migrated.users);
      }
      if (Array.isArray(stateMap["reset_requests"])) setResetRequestsState(stateMap["reset_requests"]);
    } catch (err) {
      console.error("Failed to refresh backend state:", err);
    }
  }, [persistState]);

  // ─── LOAD INITIAL STATE FROM SUPABASE ───
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { data: dbRows, error } = await supabase.from("crm_state_store").select("*");
        if (error) throw error;
        const stateMap = {};
        if (Array.isArray(dbRows)) {
          dbRows.forEach(row => { stateMap[row.key] = row.value; });
        }

        let admins = Array.isArray(stateMap["admin_users"]) ? stateMap["admin_users"] : readLocalState("admin_users", []);
        let nonAdmins = Array.isArray(stateMap["non_admin_users"]) ? stateMap["non_admin_users"] : null;
        const localNonAdmins = readLocalState("non_admin_users", []);
        let mergedLocalStaff = false;
        if (nonAdmins) {
          const backendIds = new Set(nonAdmins.map(u => u.id));
          const backendEmails = new Set(nonAdmins.map(u => (u.email || "").toLowerCase()));
          const localOnlyUsers = localNonAdmins.filter(u => !backendIds.has(u.id) && !backendEmails.has((u.email || "").toLowerCase()));
          if (localOnlyUsers.length) {
            nonAdmins = [...nonAdmins, ...localOnlyUsers];
            mergedLocalStaff = true;
          }
        } else {
          nonAdmins = localNonAdmins.length ? localNonAdmins : BOOTSTRAP_NON_ADMIN_USERS;
        }
        const adminMigration = await migratePlainPasswords(admins);
        const nonAdminMigration = await migratePlainPasswords(nonAdmins);
        admins = adminMigration.users;
        nonAdmins = nonAdminMigration.users;
        if (adminMigration.changed) await persistState("admin_users", admins);
        if (nonAdminMigration.changed || mergedLocalStaff || !stateMap["non_admin_users"]) await persistState("non_admin_users", nonAdmins);
        let p = Array.isArray(stateMap["projects"]) ? stateMap["projects"] : null;
        if (!p) {
          p = readLocalState("projects", BOOTSTRAP_PROJECTS);
          await persistState("projects", p);
        }
        const l = Array.isArray(stateMap["leads"]) ? stateMap["leads"] : readLocalState("leads", []);
        const a = Array.isArray(stateMap["activity_logs"]) ? stateMap["activity_logs"] : readLocalState("activity_logs", []);
        const r = Array.isArray(stateMap["reset_requests"]) ? stateMap["reset_requests"] : readLocalState("reset_requests", []);

        if (!isMounted) return;
        setAdminUsersState(admins);
        setNonAdminUsersState(nonAdmins);
        setProjectsState(p);
        setLeadsState(l);
        setActivityLogsState(a);
        setResetRequestsState(r);
        const { data: sessionData } = await supabase.auth.getSession();
        if (isSupabaseAdminUser(sessionData?.session?.user)) {
          setCurrentUser(authUserToAdmin(sessionData.session.user));
        }
      } catch (err) {
        console.error("Failed to load Supabase state, using local fallback:", err);
        if (!isMounted) return;
        const fallbackAdmins = await migratePlainPasswords(readLocalState("admin_users", []));
        const fallbackNonAdmins = await migratePlainPasswords(readLocalState("non_admin_users", BOOTSTRAP_NON_ADMIN_USERS));
        setAdminUsersState(fallbackAdmins.users);
        if (fallbackAdmins.changed) persistState("admin_users", fallbackAdmins.users);
        if (fallbackNonAdmins.changed) persistState("non_admin_users", fallbackNonAdmins.users);
        setNonAdminUsersState(fallbackNonAdmins.users);
        setProjectsState(readLocalState("projects", BOOTSTRAP_PROJECTS));
        setLeadsState(readLocalState("leads", []));
        setActivityLogsState(readLocalState("activity_logs", []));
        setResetRequestsState(readLocalState("reset_requests", []));
        const { data: sessionData } = await supabase.auth.getSession();
        if (isSupabaseAdminUser(sessionData?.session?.user)) {
          setCurrentUser(authUserToAdmin(sessionData.session.user));
        }
      } finally {
        if (isMounted) setStorageReady(true);
      }
    })();
    return () => { isMounted = false; };
  }, [persistState, readLocalState]);

  useEffect(() => {
    if (!storageReady || !currentUser) return;
    refreshLeadsFromBackend();
    const intervalId = window.setInterval(refreshLeadsFromBackend, 2000);
    const refreshWhenVisible = () => {
      if (!document.hidden) refreshLeadsFromBackend();
    };
    document.addEventListener("visibilitychange", refreshWhenVisible);
    window.addEventListener("focus", refreshLeadsFromBackend);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      window.removeEventListener("focus", refreshLeadsFromBackend);
    };
  }, [storageReady, currentUser, refreshLeadsFromBackend]);

  const [selectedLead, setSelectedLead] = useState(null);
  const [importText, setImportText] = useState("");
  const [customPopup, setCustomPopup] = useState({ isOpen:false, leadId:null, targetValue:"", type:"status", title:"", message:"" });
  const [toastNotification, setToastNotification] = useState({ isVisible:false, message:"" });
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isActivityLogModalOpen, setIsActivityLogModalOpen] = useState(false);
  const [dismissedAssignmentNotices, setDismissedAssignmentNotices] = useState([]);
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

  useEffect(() => {
    if (!currentUser) {
      setDismissedAssignmentNotices([]);
      return;
    }
    try {
      const raw = localStorage.getItem(`crm_assignment_notices:${currentUser.id}`);
      setDismissedAssignmentNotices(raw ? JSON.parse(raw) : []);
    } catch {
      setDismissedAssignmentNotices([]);
    }
  }, [currentUser]);

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
  const copyToClipboard = (text) => { if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).catch(() => {}); triggerToastAlert("Copied!"); };
  const triggerToastAlert = (msg) => { setToastNotification({isVisible:true,message:msg}); setTimeout(()=>setToastNotification({isVisible:false,message:""}),3500); };

  useEffect(() => {
    const showBackendError = (event) => {
      const key = event.detail?.key || "data";
      triggerToastAlert(`Backend save failed for ${key}. Check Supabase table/RLS.`);
    };
    window.addEventListener("crm-backend-error", showBackendError);
    return () => window.removeEventListener("crm-backend-error", showBackendError);
  }, []);

  useEffect(() => {
    if (!currentUser || currentUser.role === "Admin") return;
    const latest = nonAdminUsers.find(u => u.id === currentUser.id);
    if (!latest) return;
    if (latest.active === false || latest.email !== currentUser.email || latest.passwordHash !== currentUser.passwordHash) {
      setCurrentUser(null);
      setLoginEmail("");
      setLoginPassword("");
      setGlobalSearch("");
      setActiveTab("dashboard");
      setNavHistory([]);
      setIsMobileMenuOpen(false);
      setLoginError("Your login was changed by Admin. Please login again.");
    } else if (latest.name !== currentUser.name || latest.role !== currentUser.role || latest.branch !== currentUser.branch) {
      setCurrentUser(latest);
    }
  }, [currentUser, nonAdminUsers]);

  const visibleProjects = useMemo(()=>{ if(!currentUser)return[]; if(currentUser.role==="Admin")return projects; return projects.filter(p=>p.branch===currentUser.branch); },[projects,currentUser]);
  const visibleUsers = useMemo(()=>{ if(!currentUser)return[]; if(currentUser.role==="Admin")return users; return users.filter(u=>u.branch===currentUser.branch); },[users,currentUser]);
  const assignableUsers = useMemo(()=>visibleUsers.filter(u=>["Manager","Executive","Telecaller"].includes(u.role)&&u.active),[visibleUsers]);
  const isAssignedToCurrentUser = useCallback((lead) => {
    if (!currentUser || !lead) return false;
    return lead.assignedToId === currentUser.id || lead.assignedTo === currentUser.name || lead.assignedTo === currentUser.email;
  }, [currentUser]);

  useEffect(() => {
    if (!visibleProjects.length) return;
    setNewLeadForm(prev => prev.project ? prev : { ...prev, project: visibleProjects[0].name });
    setNewActivityForm(prev => prev.project ? prev : { ...prev, project: visibleProjects[0].name });
  }, [visibleProjects]);

  const processedLeads = useMemo(()=>{
    if(!currentUser)return[];
    let result=leads;
    if(currentUser.role==="Manager")result=leads.filter(l=>l.branch===currentUser.branch);
    else if(["Executive","Telecaller"].includes(currentUser.role))result=leads.filter(isAssignedToCurrentUser);
    if(globalSearch.trim()){const t=globalSearch.toLowerCase();result=result.filter(l=>l.name.toLowerCase().includes(t)||l.phone.includes(t)||l.project.toLowerCase().includes(t)||l.status.toLowerCase().includes(t));}
    if(filterSource!=="All")result=result.filter(l=>l.source===filterSource);
    if(filterStatus!=="All")result=result.filter(l=>l.status===filterStatus);
    if(filterProject!=="All")result=result.filter(l=>l.project===filterProject);
    if(["Admin","Manager"].includes(currentUser.role)&&filterExecutive!=="All")result=result.filter(l=>l.assignedTo===filterExecutive);
    if(startDate)result=result.filter(l=>l.dateCreated>=startDate);
    if(endDate)result=result.filter(l=>l.dateCreated<=endDate);
    return result;
  },[leads,currentUser,isAssignedToCurrentUser,globalSearch,filterSource,filterStatus,filterProject,filterExecutive,startDate,endDate]);

  const filteredActivityLogs = useMemo(()=>{
    let logs=activityLogs;
    if(currentUser&&!["Admin","Manager"].includes(currentUser.role))logs=logs.filter(l=>l.executive===currentUser.name);
    if(actFilterExec!=="All")logs=logs.filter(l=>l.executive===actFilterExec);
    if(actFilterProject!=="All")logs=logs.filter(l=>l.project===actFilterProject);
    if(actFilterSource!=="All")logs=logs.filter(l=>l.source===actFilterSource);
    if(actFilterStatus!=="All")logs=logs.filter(l=>l.callStatus===actFilterStatus);
    if(actStartDate)logs=logs.filter(l=>l.date>=actStartDate);
    if(actEndDate)logs=logs.filter(l=>l.date<=actEndDate);
    return [...logs].sort((a,b)=>b.date.localeCompare(a.date));
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
    if(currentUser.role==="Manager")return leads.filter(l=>l.branch===currentUser.branch&&(l.assignedTo==="Unassigned"||isAssignedToCurrentUser(l)||l.status==="Site Visit Planned"));
    if(["Executive","Telecaller"].includes(currentUser.role))return leads.filter(isAssignedToCurrentUser);
    return[];
  },[leads,currentUser,isAssignedToCurrentUser]);

  const priorityAssignedLeads = useMemo(() => {
    if (!currentUser || currentUser.role === "Admin") return [];
    return leads
      .filter(l => isAssignedToCurrentUser(l) && l.assignedTo !== "Unassigned" && l.assignedAt && !dismissedAssignmentNotices.includes(`${l.id}:${l.assignedAt}`))
      .sort((a,b)=>(b.assignedAt||0)-(a.assignedAt||0));
  }, [leads, currentUser, isAssignedToCurrentUser, dismissedAssignmentNotices]);

  const dueFollowUpLeads = useMemo(() => {
    if (!currentUser) return [];
    return processedLeads
      .filter(l => l.nextFollowUp && l.nextFollowUp !== "None" && l.nextFollowUp <= TODAY_STR && !["New","Assigned","Closed","Booking Confirmed","Not Interested","Wrong Number"].includes(l.status))
      .sort((a,b)=>a.nextFollowUp.localeCompare(b.nextFollowUp));
  }, [processedLeads, currentUser, TODAY_STR]);

  const appointmentReminderLeads = useMemo(() => {
    if (!currentUser) return [];
    return processedLeads
      .filter(l => l.siteVisitTentativeDate && l.siteVisitTentativeDate <= TODAY_STR && l.status === "Site Visit Planned")
      .sort((a,b)=>a.siteVisitTentativeDate.localeCompare(b.siteVisitTentativeDate));
  }, [processedLeads, currentUser, TODAY_STR]);

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
    const ext=formatType==="excel"?"xlsx":"csv";
    let blob;
    if (formatType === "excel") {
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Activity Report");
      const buffer = XLSX.write(wb, { bookType:"xlsx", type:"array" });
      blob = new Blob([buffer], { type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    } else {
      const fmtCell=(val)=>{const s=val===null||val===undefined?"":String(val);return s.includes(",")||s.includes('"')||s.includes("\n")?`"${s.replace(/"/g,'""')}"`:s;};
      const buffer=[headers.map(fmtCell).join(","),...rows.map(r=>r.map(fmtCell).join(","))].join("\n");
      blob=new Blob([buffer],{type:"text/csv;charset=utf-8;"});
    }
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.setAttribute("download",`Desam_Activity_Report_${TODAY_STR}.${ext}`);document.body.appendChild(a);a.click();URL.revokeObjectURL(a.href);document.body.removeChild(a);
    triggerToastAlert(`Exported as .${ext.toUpperCase()}`);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    const emailOrUsername = loginEmail.toLowerCase().trim();
    const allUsers = users.filter(u => u.role !== "Admin");
    const found = allUsers.find(u => u.email.toLowerCase() === emailOrUsername && u.active);
    if (found) {
      const acc = await verifyPassword(found, loginPassword) ? found : null;
      if (acc) {
        setCurrentUser(acc);
        setLoginError("");
        triggerToastAlert(`Welcome, ${acc.name}!`);
        return;
      }
      setLoginError("Invalid credentials.");
      return;
    }
    if (emailOrUsername.includes("@")) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailOrUsername,
        password: loginPassword,
      });
      if (data?.user) {
        if (!isSupabaseAdminUser(data.user)) {
          await supabase.auth.signOut();
          setLoginError("This Supabase account is not marked as Admin.");
          return;
        }
        const admin = authUserToAdmin(data.user);
        setCurrentUser(admin);
        triggerToastAlert(`Welcome, ${admin.name}!`);
        setTimeout(() => window.location.reload(), 250);
        return;
      }
      if (error?.message) {
        setLoginError(error.message);
        return;
      }
    }
    setLoginError("Invalid credentials.");
  };

  const handleLogout=async()=>{ await supabase.auth.signOut(); setCurrentUser(null);setLoginEmail("");setLoginPassword("");setGlobalSearch("");setActiveTab("dashboard");setNavHistory([]);setIsMobileMenuOpen(false); };

  const requestStatusTransitionPopup=(leadId,nextStatus)=>{ const t=leads.find(l=>l.id===leadId); if(!t)return; setCustomPopup({isOpen:true,leadId,targetValue:nextStatus,type:"status",title:"Confirm Status Shift",message:`Transition "${t.name}" to "${nextStatus}"?`}); };
  const requestOwnerAssignmentPopup=(leadId,personnelName)=>{ const t=leads.find(l=>l.id===leadId); if(!t)return; setCustomPopup({isOpen:true,leadId,targetValue:personnelName,type:"assign",title:"Confirm Assignment",message:`Assign "${t.name}" to "${personnelName}"?`}); };

  const confirmCustomPopupAction=()=>{
    const{leadId,targetValue,type}=customPopup;
    if(type==="status"){const log={date:TODAY_STR,by:currentUser.name,action:`Status updated to: ${targetValue}`};const updated=leads.map(l=>l.id===leadId?{...l,status:targetValue,history:[log,...l.history]}:l);setLeads(updated);if(selectedLead&&selectedLead.id===leadId)setSelectedLead({...selectedLead,status:targetValue,history:[log,...selectedLead.history]});triggerToastAlert("Status updated.");}
    else if(type==="assign"){
      const assignedUser = users.find(u => u.name === targetValue);
      const newBranch = assignedUser ? assignedUser.branch : leads.find(l=>l.id===leadId)?.branch;
      const log={date:TODAY_STR,by:currentUser.name,action:`Assigned to: ${targetValue}`};
      const updated=leads.map(l=>l.id===leadId?{...l,assignedTo:targetValue,assignedToId:assignedUser?.id||null,assignedAt:assignedUser?Date.now():null,assignedByRole:currentUser.role,branch:newBranch||l.branch,status:targetValue==="Unassigned"?"New":"Assigned",history:[log,...l.history]}:l);
      setLeads(updated);setSelectedLead(null);triggerToastAlert(`Assigned to ${targetValue}`);
    }
    setCustomPopup({isOpen:false,leadId:null,targetValue:"",type:"status",title:"",message:""});
  };

  const handleDataImportSubmit=async (e)=>{ e.preventDefault(); if(!importText.trim())return; try{ const lines=importText.split("\n").map(l=>l.trim()).filter(Boolean); const newLeads=[]; lines.forEach(line=>{const cols=line.split("\t"); if(cols.length>=4){const matchedProj=projects.find(p=>p.name.toLowerCase()===(cols[3]||"").toLowerCase().trim()); const branchHome=matchedProj?matchedProj.branch:"Madurai Desk"; newLeads.push({id:Date.now()+Math.floor(Math.random()*10000),name:cols[0]||"Lead",phone:stripPhone(cols[1]||"00000"),email:cols[2]||"",project:cols[3]||"",location:cols[4]||"Inbound",budget:parseInt(cols[5])||25,source:cols[6]||"Website",assignedTo:"Unassigned",assignedToId:null,assignedByRole:"",status:"New",branch:branchHome,dateCreated:TODAY_STR,lastFollowUp:"None",nextFollowUp:TODAY_STR,history:[{date:TODAY_STR,by:currentUser.name,action:"Imported via paste."}],siteVisitTentativeDate:"",bookingUnit:"",bookingAmount:0,bookingMode:"",bookingDate:"",regPending:false,regCompleted:false});}});if(newLeads.length>0){setLeads([...newLeads,...leads]);triggerToastAlert(`Imported ${newLeads.length} leads.`);setImportText("");}
  }catch(err){alert(err.message);} };

  const handleCreateUserSubmit=async (e)=>{ e.preventDefault(); const prefix=newUserForm.emailPrefix.trim().toLowerCase(); const role = newUserForm.role; if (role === "Admin") { triggerToastAlert("Use Admin Recovery or create another admin from secure backend controls."); return; } if(users.some(u=>u.email.toLowerCase()===`${prefix}@desam`)){triggerToastAlert("That username already exists.");return;} const u={id:Date.now(),name:newUserForm.name.trim(),email:`${prefix}@desam`,...(await makePasswordFields(newUserForm.pass)),role,branch:newUserForm.branch,phone:stripPhone(newUserForm.phone)||"9840000000",active:true,avatar:newUserForm.name.charAt(0).toUpperCase()}; setUsers([...users, u]); setNewUserForm({name:"",emailPrefix:"",pass:"",role:"Executive",branch:"Madurai Desk",phone:""}); triggerToastAlert(`Profile for ${u.name} created.`); };

  const handleDeleteUser=async (userId)=>{
    if(userId===currentUser.id){triggerToastAlert("Cannot delete your own account.");return;}
    if(HARDCODED_ADMINS.some(a=>a.id===userId)){triggerToastAlert("Admin accounts cannot be deleted here.");return;}
    setUsers(users.filter(u => u.id !== userId));
    triggerToastAlert("Profile removed.");
  };

  const openEditUserModal=(user)=>{
    if(HARDCODED_ADMINS.some(a=>a.id===user.id)){triggerToastAlert("Admin credentials are managed separately.");return;}
    setEditUserForm({...user,newPassword:"",confirmNewPassword:""}); setIsEditUserModalOpen(true);
  };

  const handleUpdateUserSubmit=async (e)=>{ e.preventDefault();
    const passwordValue = editUserForm.newPassword || "";
    if (passwordValue && passwordValue.length < 6) { triggerToastAlert("Password must be at least 6 characters."); return; }
    if (passwordValue && passwordValue !== editUserForm.confirmNewPassword) { triggerToastAlert("Passwords do not match."); return; }
    const prefix=editUserForm.email.split('@')[0].trim().toLowerCase();
    const { newPassword, confirmNewPassword, ...cleanForm } = editUserForm;
    const passwordFields = passwordValue ? await makePasswordFields(passwordValue) : {};
    const u={...cleanForm,...passwordFields,name:cleanForm.name.trim(),email:`${prefix}@desam`,branch:cleanForm.role==="Admin"?"All Branches":cleanForm.branch,phone:stripPhone(cleanForm.phone)||"9840000000",avatar:cleanForm.name.charAt(0).toUpperCase(),active:cleanForm.active!==false};
    setUsers(users.map(x => x.id === u.id ? u : x));
    setIsEditUserModalOpen(false);setEditUserForm(null); triggerToastAlert(`Profile for ${u.name} updated.`); };

  const commitManualFollowUpReport=(e)=>{ e.preventDefault(); if(!followUpNotes.trim()||!nextFollowUpDate)return; const updated=leads.map(l=>{ if(l.id===selectedLead.id){const obj={...l,status:"Contacted",lastFollowUp:TODAY_STR,nextFollowUp:nextFollowUpDate,history:[{date:TODAY_STR,by:currentUser.name,action:`[Follow-Up]: ${followUpNotes.trim()} (Next: ${nextFollowUpDate})`},...l.history]};setSelectedLead(obj);return obj;}return l;}); setLeads(updated); setFollowUpNotes("");setNextFollowUpDate(""); triggerToastAlert("Follow-up logged."); };

  const handleCreateLead=(e)=>{ e.preventDefault(); const phone=stripPhone(newLeadForm.phone); const dup=leads.find(l=>stripPhone(l.phone)===phone); if(dup){setDuplicateConflictRecord(dup);return;}
    const assignedUser = newLeadForm.assignedTo && newLeadForm.assignedTo !== "Unassigned" ? users.find(u => u.name === newLeadForm.assignedTo) : null;
    const projBranch = projects.find(p=>p.name===newLeadForm.project)?.branch || currentUser.branch || "Madurai Desk";
    const leadBranch = assignedUser ? assignedUser.branch : projBranch;
    const created={...newLeadForm,id:Date.now(),phone,altPhone:stripPhone(newLeadForm.altPhone),branch:leadBranch,dateCreated:TODAY_STR,lastFollowUp:"None",nextFollowUp:TODAY_STR,assignedToId:assignedUser?.id||null,assignedAt:assignedUser?Date.now():null,assignedByRole:currentUser.role,bookingUnit:"",bookingAmount:0,bookingMode:"",bookingDate:"",regPending:false,regCompleted:false,siteVisitTentativeDate:"",status:newLeadForm.assignedTo&&newLeadForm.assignedTo!=="Unassigned"?"Assigned":"New",history:[{date:TODAY_STR,by:currentUser.name,action:"Lead captured."+(newLeadForm.assignedTo&&newLeadForm.assignedTo!=="Unassigned"?` Assigned to ${newLeadForm.assignedTo}.`:"")}]};
    setLeads([created,...leads]); setIsLeadModalOpen(false); setNewLeadForm({name:"",phone:"",altPhone:"",email:"",location:"",project:projects[0]?.name||"",budget:25,source:"Website",assignedTo:"Unassigned",notes:""}); triggerToastAlert("Lead created."); };

  const handleCreateProject=(e)=>{ e.preventDefault(); const p={...newProjectForm,id:Date.now(),price:parseInt(newProjectForm.price)||0,units:parseInt(newProjectForm.units)||0,sold:parseInt(newProjectForm.sold)||0}; setProjects([p,...projects]); setIsProjectModalOpen(false); setNewProjectForm({name:"",location:"",branch:"Madurai Desk",type:"Plot",price:30,units:50,sold:0,status:"Pre-Launch"}); triggerToastAlert(`Project "${p.name}" added.`); };
  const handleCreateActivityLog=(e)=>{ e.preventDefault(); const log={...newActivityForm,id:Date.now(),executive:["Admin","Manager"].includes(currentUser.role)?newActivityForm.executive:currentUser.name,callsMade:parseInt(newActivityForm.callsMade)||0,followup:parseInt(newActivityForm.followup)||0,siteVisit:parseInt(newActivityForm.siteVisit)||0,booking:parseInt(newActivityForm.booking)||0,registration:parseInt(newActivityForm.registration)||0,cancellation:parseInt(newActivityForm.cancellation)||0,collection:parseInt(newActivityForm.collection)||0}; setActivityLogsStateWrapped(prev=>[log,...prev]); setIsActivityLogModalOpen(false); setNewActivityForm({date:TODAY_STR,executive:"",project:projects[0]?.name||"",source:"Own Leads",callsMade:0,callStatus:"Warm",followup:0,siteVisit:0,booking:0,registration:0,cancellation:0,collection:0,remark:""}); triggerToastAlert("Activity log saved."); };

  const commitSiteWalkthroughLog=()=>{ const updated=leads.map(l=>l.id===selectedLead.id?{...l,status:"Site Visit Completed",history:[{date:svDate,by:currentUser.name,action:`[Site Visit]: Family: ${svFamily}. Feedback: ${svFeedback}`},...l.history]}:l); setLeads(updated); setSelectedLead(null); triggerToastAlert("Site visit logged."); };
  const commitFinancialBookingLog=()=>{ const updated=leads.map(l=>l.id===selectedLead.id?{...l,status:"Booking Confirmed",bookingUnit:bkUnit,history:[{date:TODAY_STR,by:currentUser.name,action:`[Booking]: Unit [${bkUnit}] booked.`},...l.history]}:l); setLeads(updated); setSelectedLead(null); triggerToastAlert("Booking logged."); };

  const handleCallFeedback = (leadId, feedbackData) => {
    const { notes, outcome, followUpDate, callDuration } = feedbackData;
    const log = { date: TODAY_STR, by: currentUser.name, action: `[Mobile Call]: Duration ${Math.floor(callDuration/60)}m${callDuration%60}s. Outcome: ${outcome}.${notes ? ` Notes: ${notes}` : ""}${followUpDate ? ` Next follow-up: ${followUpDate}` : ""}` };
    const updated = leads.map(l => { if (l.id !== leadId) return l; return { ...l, status: outcome || l.status, lastFollowUp: TODAY_STR, nextFollowUp: followUpDate || l.nextFollowUp, history: [log, ...l.history] }; });
    setLeads(updated);
    if (selectedLead && selectedLead.id === leadId) { setSelectedLead(prev => ({ ...prev, status: outcome || prev.status, history: [log, ...prev.history] })); }
    triggerToastAlert("Call feedback saved.");
  };

  const activeResetCount = useMemo(() => resetRequests.filter(r => r.expiresAt > Date.now() && !r.consumed).length, [resetRequests]);
  const dismissAssignmentNotice = (lead) => {
    if (!currentUser || !lead) return;
    const noticeId = `${lead.id}:${lead.assignedAt}`;
    setDismissedAssignmentNotices(prev => {
      const next = prev.includes(noticeId) ? prev : [...prev, noticeId];
      try { localStorage.setItem(`crm_assignment_notices:${currentUser.id}`, JSON.stringify(next)); } catch {}
      return next;
    });
  };

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
              {activeResetCount > 0 && <span className="ml-auto bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full animate-pulse">{activeResetCount}</span>}
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

  if (!storageReady) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <img src={DESAM_LOGO_ASSET} alt="Desam" className="h-14 w-auto object-contain animate-pulse"/>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Loading CRM…</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased text-slate-200">
        {showResetModal && <PasswordResetModal users={users} setUsers={setUsers} resetRequests={resetRequests} setResetRequests={setResetRequests} onClose={() => setShowResetModal(false)} />}
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
              <button onClick={() => setShowResetModal(true)} className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-orange-400 transition-colors font-bold uppercase tracking-wide"><KeyRound className="h-3.5 w-3.5" /> Forgot Password?</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans antialiased overflow-hidden relative">

      {showAdminLoginPopup && currentUser?.role === "Admin" && activeResetCount > 0 && (
        <AdminLoginResetPopup count={activeResetCount} onGoToHub={() => { setShowAdminLoginPopup(false); navigateTo("users"); }} onDismiss={() => setShowAdminLoginPopup(false)} />
      )}

      {priorityAssignedLeads.length>0&&(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[450] flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-orange-500/30 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-orange-950/30 border-b border-orange-500/20 p-5 flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center"><Bell className="h-5 w-5 text-orange-400 animate-pulse"/></div>
              <div><h3 className="text-sm font-black text-white uppercase tracking-wide">Priority Lead Assigned</h3><p className="text-[10px] text-orange-200/70 mt-0.5">New lead requires your attention</p></div>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
                <p className="text-base font-black text-white">{priorityAssignedLeads[0].name}</p>
                <div className="grid grid-cols-2 gap-3 mt-3 text-[10px]">
                  <div><p className="text-slate-500 font-bold uppercase tracking-wider">Phone</p><p className="text-slate-200 font-mono mt-0.5">{priorityAssignedLeads[0].phone}</p></div>
                  <div><p className="text-slate-500 font-bold uppercase tracking-wider">Project</p><p className="text-orange-400 font-bold mt-0.5 truncate">{priorityAssignedLeads[0].project}</p></div>
                  <div><p className="text-slate-500 font-bold uppercase tracking-wider">Source</p><p className="text-slate-300 font-bold mt-0.5">{priorityAssignedLeads[0].source}</p></div>
                  <div><p className="text-slate-500 font-bold uppercase tracking-wider">Budget</p><p className="text-emerald-400 font-mono font-black mt-0.5">₹{priorityAssignedLeads[0].budget}L</p></div>
                </div>
              </div>
              {priorityAssignedLeads.length>1&&<p className="text-[11px] text-slate-500 font-bold text-center">{priorityAssignedLeads.length-1} more new assignment{priorityAssignedLeads.length>2?"s":""} waiting.</p>}
              <div className="grid grid-cols-2 gap-3">
                <button onClick={()=>dismissAssignmentNotice(priorityAssignedLeads[0])} className="py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">Acknowledge</button>
                <button onClick={()=>{const lead=priorityAssignedLeads[0];dismissAssignmentNotice(lead);setSelectedLead(lead);}} className="py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white shadow-lg transition-all">Open Lead</button>
              </div>
            </div>
          </div>
        </div>
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
              {(dueFollowUpLeads.length>0||appointmentReminderLeads.length>0)&&(
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="bg-slate-950 border border-blue-500/30 rounded-2xl p-5 shadow-xl">
                    <h2 className="text-xs font-black text-blue-400 flex items-center gap-2 uppercase tracking-wider mb-4"><Clock className="h-4 w-4"/> Follow-Up Reminders</h2>
                    <div className="space-y-2">
                      {dueFollowUpLeads.length===0?<p className="text-xs text-slate-500 font-bold py-3">No due follow-ups.</p>:dueFollowUpLeads.slice(0,5).map(l=><button key={l.id} onClick={()=>setSelectedLead(l)} className="w-full text-left bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-xl p-3 transition-colors"><div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="text-xs font-black text-white truncate">{l.name}</p><p className="text-[10px] text-slate-500 font-mono mt-0.5">{l.phone}</p></div><span className={`text-[10px] font-black font-mono ${l.nextFollowUp<TODAY_STR?"text-rose-400":"text-amber-400"}`}>{l.nextFollowUp}</span></div></button>)}
                    </div>
                  </div>
                  <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-5 shadow-xl">
                    <h2 className="text-xs font-black text-amber-400 flex items-center gap-2 uppercase tracking-wider mb-4"><Calendar className="h-4 w-4"/> Appointment Reminders</h2>
                    <div className="space-y-2">
                      {appointmentReminderLeads.length===0?<p className="text-xs text-slate-500 font-bold py-3">No due appointments.</p>:appointmentReminderLeads.slice(0,5).map(l=><button key={l.id} onClick={()=>setSelectedLead(l)} className="w-full text-left bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-xl p-3 transition-colors"><div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="text-xs font-black text-white truncate">{l.name}</p><p className="text-[10px] text-slate-500 mt-0.5 truncate">{l.project}</p></div><span className={`text-[10px] font-black font-mono ${l.siteVisitTentativeDate<TODAY_STR?"text-rose-400":"text-amber-400"}`}>{l.siteVisitTentativeDate}</span></div></button>)}
                    </div>
                  </div>
                </div>
              )}
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
                <h2 className="text-xs font-black text-orange-400 flex items-center gap-2 uppercase tracking-wider"><Activity className="h-4 w-4"/> Action Queue</h2>
                  <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
                    <table className="w-full text-left text-[10px]">
                      <thead className="border-b border-slate-800 text-slate-500 uppercase font-bold">
                        <tr><th className="p-3">Lead Info</th><th className="p-3">Project</th><th className="p-3">Status</th><th className="p-3 text-right">Action</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {dashboardActionQueueLeads.length===0?<tr><td colSpan="4" className="p-4 text-center text-slate-600 font-medium">No immediate actions pending.</td></tr>:dashboardActionQueueLeads.slice(0,10).map(l=><tr key={l.id} className="hover:bg-slate-900/60"><td className="p-3"><p className="font-black text-white text-xs">{l.name}</p><p className="text-slate-500 font-mono mt-0.5">{l.phone}</p></td><td className="p-3 font-bold text-orange-400">{l.project}</td><td className="p-3"><span className="px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider" style={{backgroundColor:SC[l.status]?.bg,color:SC[l.status]?.text,border:`1px solid ${SC[l.status]?.border}`}}>{l.status}</span></td><td className="p-3 text-right"><button onClick={()=>setSelectedLead(l)} className="text-xs font-black text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-700">View</button></td></tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          {/* ═══ LEADS TAB ══════════════════════════════════════════════ */}
          {activeTab==="leads"&&(
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 p-5 border border-slate-800 rounded-2xl shadow-xl">
                <div><h1 className="text-lg lg:text-xl font-black text-white flex items-center gap-2"><PhoneCall className="h-5 w-5 text-orange-500"/> Lead Management</h1><p className="text-[10px] text-slate-500 mt-1">{processedLeads.length} leads found based on current filters.</p></div>
                <button onClick={()=>{setDuplicateConflictRecord(null);setNewLeadForm(prev=>({...prev,project:prev.project||visibleProjects[0]?.name||""}));setIsLeadModalOpen(true);}} className="w-full sm:w-auto bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white font-black text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"><Plus className="h-4 w-4"/> New Lead</button>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-wrap gap-3 text-xs shadow-lg">
                <select value={filterSource} onChange={e=>setFilterSource(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-orange-500 flex-1 min-w-[140px]"><option value="All">All Sources</option>{SOURCES.map(s=><option key={s} value={s}>{s}</option>)}</select>
                <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-orange-500 flex-1 min-w-[140px]"><option value="All">All Statuses</option>{STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select>
                <select value={filterProject} onChange={e=>setFilterProject(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-orange-500 flex-1 min-w-[140px]"><option value="All">All Projects</option>{visibleProjects.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select>
                {["Admin","Manager"].includes(currentUser.role)&&<select value={filterExecutive} onChange={e=>setFilterExecutive(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-orange-500 flex-1 min-w-[140px]"><option value="All">All Assignees</option><option value="Unassigned">Unassigned</option>{assignableUsers.map(u=><option key={u.id} value={u.name}>{u.name}</option>)}</select>}
                <div className="flex items-center gap-2 flex-1 min-w-[200px]"><input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-orange-500 font-mono text-[10px]"/><span className="text-slate-600">-</span><input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-orange-500 font-mono text-[10px]"/></div>
                {(filterSource!=="All"||filterStatus!=="All"||filterProject!=="All"||filterExecutive!=="All"||startDate||endDate)&&<button onClick={()=>{setFilterSource("All");setFilterStatus("All");setFilterProject("All");setFilterExecutive("All");setStartDate("");setEndDate("");}} className="text-orange-400 hover:text-orange-300 font-bold px-3 py-2 border border-orange-500/30 rounded-lg flex items-center gap-1 bg-orange-500/10"><X className="h-3.5 w-3.5"/> Clear</button>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {processedLeads.map(lead=>(
                  <div key={lead.id} onClick={()=>setSelectedLead(lead)} className="bg-slate-950 border border-slate-800 rounded-xl p-4 hover:border-orange-500/50 cursor-pointer transition-all shadow-md group relative">
                     {lead.status==="New"&&<div className="absolute top-0 right-0 h-2.5 w-2.5 bg-blue-500 rounded-full animate-ping mt-3 mr-3"/>}
                     <div className="flex justify-between items-start mb-3">
                       <div><h3 className="text-sm font-black text-white group-hover:text-orange-400 transition-colors">{lead.name}</h3><div className="flex items-center gap-1.5 mt-1"><Phone className="h-3 w-3 text-slate-500"/><span className="text-[11px] text-slate-400 font-mono">{lead.phone}</span></div></div>
                       <span className="px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider" style={{backgroundColor:SC[lead.status]?.bg,color:SC[lead.status]?.text,border:`1px solid ${SC[lead.status]?.border}`}}>{lead.status}</span>
                     </div>
                     <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4 p-3 bg-slate-900/50 rounded-lg border border-slate-800/50">
                       <div><p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Project</p><p className="text-xs text-orange-400 font-bold truncate" title={lead.project}>{lead.project}</p></div>
                       <div><p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Budget</p><p className="text-xs text-slate-300 font-mono font-bold">₹{lead.budget}L</p></div>
                       <div><p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Assigned</p><p className="text-xs text-slate-300 font-bold truncate">{lead.assignedTo}</p></div>
                       <div><p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Source</p><p className="text-xs text-slate-400 truncate">{lead.source}</p></div>
                     </div>
                     <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-800/60">
                       <div onClick={e=>e.stopPropagation()}><MobileCallButton phone={lead.phone} leadName={lead.name} onFeedbackSaved={(f)=>handleCallFeedback(lead.id, f)} currentUser={currentUser} TODAY_STR={TODAY_STR} /></div>
                       <div className="text-right">
                         <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Next Follow-Up</p>
                         <p className={`text-xs font-mono font-black mt-0.5 ${lead.nextFollowUp===TODAY_STR?"text-amber-400 animate-pulse":lead.nextFollowUp<TODAY_STR?"text-rose-400":"text-emerald-400"}`}>{lead.nextFollowUp==="None"?"Not Set":lead.nextFollowUp}</p>
                       </div>
                     </div>
                  </div>
                ))}
                {processedLeads.length===0&&<div className="col-span-full flex flex-col items-center justify-center py-16 bg-slate-950/40 border border-slate-800 border-dashed rounded-2xl"><div className="inline-flex h-12 w-12 rounded-full bg-slate-900 border border-slate-800 items-center justify-center mb-3"><Search className="h-5 w-5 text-slate-600"/></div><p className="text-slate-500 text-xs font-bold uppercase tracking-wider">No leads match filters</p><button onClick={()=>{setFilterSource("All");setFilterStatus("All");setFilterProject("All");setFilterExecutive("All");setStartDate("");setEndDate("");}} className="mt-3 text-[10px] text-orange-400 hover:text-orange-300 font-bold uppercase tracking-wider">Clear all filters</button></div>}
              </div>
            </div>
          )}

          {/* ═══ ACTIVITY LOGS TAB ════════════════════════════════════════ */}
          {activeTab==="activity"&&(
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 p-5 border border-slate-800 rounded-2xl shadow-xl">
                <div><h1 className="text-lg lg:text-xl font-black text-white flex items-center gap-2"><ClipboardList className="h-5 w-5 text-emerald-500"/> Activity Tracker</h1><p className="text-[10px] text-slate-500 mt-1">{filteredActivityLogs.length} verified logs recorded.</p></div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button onClick={()=>executeDataExportSequence("excel")} className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 font-black text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg"><Download className="h-4 w-4"/> Export</button>
                  <button onClick={()=>{setNewActivityForm(prev=>({...prev,project:prev.project||visibleProjects[0]?.name||""}));setIsActivityLogModalOpen(true);}} className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"><Plus className="h-4 w-4"/> Log Activity</button>
                </div>
              </div>
              {["Admin","Manager"].includes(currentUser.role)&&<ExcelImportPanel activityLogs={activityLogs} setActivityLogs={setActivityLogsStateWrapped} triggerToastAlert={triggerToastAlert}/>}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 text-xs">
                 <div className="flex flex-wrap gap-3">
                   {["Admin","Manager"].includes(currentUser.role)&&<select value={actFilterExec} onChange={e=>setActFilterExec(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500 flex-1 min-w-[120px]"><option value="All">All Executives</option>{visibleUsers.map(u=><option key={u.id} value={u.name}>{u.name}</option>)}</select>}
                   <select value={actFilterProject} onChange={e=>setActFilterProject(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500 flex-1 min-w-[120px]"><option value="All">All Projects</option>{visibleProjects.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select>
                   <select value={actFilterSource} onChange={e=>setActFilterSource(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500 flex-1 min-w-[120px]"><option value="All">All Sources</option>{SOURCES.map(s=><option key={s} value={s}>{s}</option>)}</select>
                   <div className="flex items-center gap-2 flex-1 min-w-[200px]"><input type="date" value={actStartDate} onChange={e=>setActStartDate(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500 font-mono"/><span className="text-slate-600">-</span><input type="date" value={actEndDate} onChange={e=>setActEndDate(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500 font-mono"/></div>
                   {(actFilterExec!=="All"||actFilterProject!=="All"||actFilterSource!=="All"||actFilterStatus!=="All"||actStartDate||actEndDate)&&<button onClick={()=>{setActFilterExec("All");setActFilterProject("All");setActFilterSource("All");setActFilterStatus("All");setActStartDate("");setActEndDate("");}} className="text-emerald-400 hover:text-emerald-300 font-bold px-3 py-2 border border-emerald-500/30 rounded-lg flex items-center gap-1 bg-emerald-500/10"><X className="h-3.5 w-3.5"/> Clear</button>}
                 </div>
                 <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/40">
                   <table className="w-full text-left text-[10px] whitespace-nowrap">
                     <thead className="border-b border-slate-800 text-slate-500 uppercase font-bold bg-slate-950">
                       <tr><th className="p-3">Date</th><th className="p-3">Executive</th><th className="p-3">Project</th><th className="p-3">Source</th><th className="p-3 text-center">Calls</th><th className="p-3 text-center">Status</th><th className="p-3 text-center">FU</th><th className="p-3 text-center">SV</th><th className="p-3 text-center">BK</th><th className="p-3">Remark</th></tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800">
                       {filteredActivityLogs.length===0?<tr><td colSpan="10" className="p-6 text-center text-slate-500 font-bold uppercase tracking-wider">No activity logs found</td></tr>:filteredActivityLogs.map((log,i)=>(
                         <tr key={log.id||i} className="hover:bg-slate-800/50 transition-colors">
                           <td className="p-3 font-mono text-slate-400">{log.date}</td>
                           <td className="p-3 font-bold text-white">{log.executive}</td>
                           <td className="p-3 text-orange-400 font-bold">{log.project}</td>
                           <td className="p-3 text-slate-400">{log.source}</td>
                           <td className="p-3 text-center font-mono font-black text-white">{log.callsMade}</td>
                           <td className="p-3 text-center"><span className={`px-2 py-0.5 rounded border text-[9px] font-black uppercase ${log.callStatus==="Warm"?"bg-amber-500/10 text-amber-400 border-amber-500/20":log.callStatus==="Cold"?"bg-blue-500/10 text-blue-400 border-blue-500/20":"bg-slate-800 text-slate-400 border-slate-700"}`}>{log.callStatus}</span></td>
                           <td className="p-3 text-center text-blue-400 font-bold">{log.followup||"-"}</td>
                           <td className="p-3 text-center text-emerald-400 font-bold">{log.siteVisit||"-"}</td>
                           <td className="p-3 text-center text-purple-400 font-bold">{log.booking||"-"}</td>
                           <td className="p-3 text-slate-400 max-w-[150px] truncate" title={log.remark}>{log.remark||"-"}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
              </div>
            </div>
          )}

          {/* ═══ PROJECTS TAB ═════════════════════════════════════════════ */}
          {activeTab==="projects"&&(
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 p-5 border border-slate-800 rounded-2xl shadow-xl">
                <div><h1 className="text-lg lg:text-xl font-black text-white flex items-center gap-2"><Building2 className="h-5 w-5 text-purple-500"/> Project Master</h1><p className="text-[10px] text-slate-500 mt-1">{visibleProjects.length} active projects in system.</p></div>
                {["Admin","Manager"].includes(currentUser.role)&&<button onClick={()=>setIsProjectModalOpen(true)} className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 text-white font-black text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"><Plus className="h-4 w-4"/> New Project</button>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {visibleProjects.map(proj=>{
                  const prjLeads = leads.filter(l=>l.project===proj.name);
                  const booked = prjLeads.filter(l=>["Booking Confirmed","Closed"].includes(l.status)).length;
                  const revenue = booked * proj.price;
                  return (
                    <div key={proj.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-purple-500/50 transition-colors group">
                      <div className="flex justify-between items-start mb-4">
                        <div><h3 className="text-base font-black text-white group-hover:text-purple-400 transition-colors">{proj.name}</h3><div className="flex items-center gap-1.5 mt-1 text-slate-500"><MapPin className="h-3.5 w-3.5"/><span className="text-[11px] truncate max-w-[180px]">{proj.location}</span></div></div>
                        <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider" style={{backgroundColor:PSC[proj.status]?.bg,color:PSC[proj.status]?.text}}>{proj.status}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3"><p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Type</p><p className="text-sm font-black text-white mt-0.5">{proj.type}</p></div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3"><p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Base Price</p><p className="text-sm font-black text-emerald-400 mt-0.5 font-mono">₹{proj.price}L</p></div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3"><p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Inventory</p><p className="text-sm font-black text-white mt-0.5">{proj.sold} / <span className="text-slate-500">{proj.units}</span></p></div>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3"><p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Est. Revenue</p><p className="text-sm font-black text-purple-400 mt-0.5 font-mono">₹{revenue}L</p></div>
                      </div>
                      {["Admin","Manager"].includes(currentUser.role)&&(
                        <div className="flex gap-2">
                          <select value={proj.status} onChange={(e)=>handleProjectStatusChange(proj.id,e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-[10px] font-bold text-slate-300 focus:outline-none focus:border-purple-500 uppercase tracking-wider">{PROJECT_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══ REPORTS TAB ══════════════════════════════════════════════ */}
          {activeTab==="reports"&&(
            <div className="space-y-6">
              <div className="bg-slate-950 p-6 border border-slate-800 rounded-2xl shadow-xl">
                <h1 className="text-xl font-black text-white flex items-center gap-2 mb-1"><BarChart3 className="h-6 w-6 text-blue-500"/> Matrix Intelligence</h1>
                <p className="text-xs text-slate-500">Comprehensive analytical insights generated from system activity.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl"><h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2"><TrendingUp className="h-4 w-4"/> Daily Activity Trajectory</h3><div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={callsTrendData} margin={{top:5,right:20,left:-20,bottom:5}}><defs><linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/><XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false}/><YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false}/><Tooltip contentStyle={{backgroundColor:'#0f172a',border:'1px solid #1e293b',borderRadius:'12px',fontSize:'12px',color:'#fff'}} itemStyle={{fontWeight:'900'}}/><Legend wrapperStyle={{fontSize:'10px',fontWeight:'700',paddingTop:'10px'}}/><Area type="monotone" dataKey="calls" name="Total Calls" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCalls)"/><Line type="monotone" dataKey="siteVisits" name="Site Visits" stroke="#10b981" strokeWidth={3} dot={{r:4}}/><Line type="monotone" dataKey="bookings" name="Bookings" stroke="#8b5cf6" strokeWidth={3} dot={{r:4}}/></ComposedChart></ResponsiveContainer></div></div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl"><h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2"><PieChart className="h-4 w-4"/> Source Origination Share</h3><div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={sourcewisePieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={4} dataKey="value">{sourcewisePieData.map((entry,index)=><Cell key={`cell-${index}`} fill={PIE_COLORS[index%PIE_COLORS.length]} stroke="rgba(0,0,0,0.2)"/>)}</Pie><Tooltip contentStyle={{backgroundColor:'#0f172a',border:'1px solid #1e293b',borderRadius:'12px',fontSize:'12px',color:'#fff'}} itemStyle={{fontWeight:'900'}}/><Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize:'10px',fontWeight:'700'}}/></PieChart></ResponsiveContainer></div></div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl col-span-1 lg:col-span-2"><h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2"><Users className="h-4 w-4"/> Executive Matrix Board</h3><div className="overflow-x-auto"><table className="w-full text-left text-[10px] whitespace-nowrap"><thead className="border-b border-slate-800 text-slate-500 uppercase font-bold"><tr><th className="p-3">Personnel</th><th className="p-3 text-center">Calls</th><th className="p-3 text-center">Followup</th><th className="p-3 text-center text-emerald-400">Site Visits</th><th className="p-3 text-center text-purple-400">Bookings</th><th className="p-3 text-center text-amber-400">Reg.</th><th className="p-3 text-center text-rose-400">Cxl.</th><th className="p-3 text-center text-blue-400">Coll.</th></tr></thead><tbody className="divide-y divide-slate-800">{execDetailedMatrix.map(e=><tr key={e.name} className="hover:bg-slate-900/40"><td className="p-3 font-black text-white">{e.name}</td><td className="p-3 text-center font-mono">{e.calls}</td><td className="p-3 text-center font-mono">{e.followups}</td><td className="p-3 text-center font-mono text-emerald-400">{e.siteVisits}</td><td className="p-3 text-center font-mono text-purple-400">{e.bookings}</td><td className="p-3 text-center font-mono text-amber-400">{e.registrations}</td><td className="p-3 text-center font-mono text-rose-400">{e.cancellations}</td><td className="p-3 text-center font-mono text-blue-400">{e.collection}</td></tr>)}</tbody></table></div></div>
              </div>
            </div>
          )}

          {/* ═══ SYSTEM CONTROL HUB (Admin Only) ═════════════════════════ */}
          {activeTab==="users"&&currentUser.role==="Admin"&&(
            <div className="space-y-6">
              <div className="bg-slate-950 p-6 border border-rose-500/30 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Shield className="h-32 w-32 text-rose-500"/></div>
                <h1 className="text-xl lg:text-2xl font-black text-white flex items-center gap-3 mb-2 relative z-10"><ShieldCheck className="h-7 w-7 text-rose-500"/> System Control Hub</h1>
                <p className="text-xs text-slate-400 max-w-2xl relative z-10">Administrative panel for managing personnel access, credential resets, and cross-branch assignments.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-slate-800 pb-4"><Users className="h-4 w-4 text-blue-500"/> Personnel Directory</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {users.map(u=>(
                        <div key={u.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-start gap-4 hover:border-slate-700 transition-colors group">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black text-lg shadow-inner flex-shrink-0 ${u.role==="Admin"?"bg-rose-500/10 text-rose-500 border border-rose-500/20":u.role==="Manager"?"bg-purple-500/10 text-purple-500 border border-purple-500/20":"bg-blue-500/10 text-blue-500 border border-blue-500/20"}`}>{u.avatar}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between"><h4 className="text-sm font-black text-white truncate">{u.name}</h4>{u.role!=="Admin"&&<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={()=>openEditUserModal(u)} className="p-1.5 text-slate-500 hover:text-blue-400 bg-slate-950 rounded-lg border border-slate-800"><Edit2 className="h-3 w-3"/></button><button onClick={()=>handleDeleteUser(u.id)} className="p-1.5 text-slate-500 hover:text-rose-400 bg-slate-950 rounded-lg border border-slate-800"><Trash2 className="h-3 w-3"/></button></div>}</div>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">{u.email}</p>
                            <div className="flex items-center gap-2 mt-2"><span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${u.role==="Admin"?"bg-rose-500/10 text-rose-400 border-rose-500/20":u.role==="Manager"?"bg-purple-500/10 text-purple-400 border-purple-500/20":"bg-slate-800 text-slate-400 border-slate-700"}`}>{u.role}</span><span className="text-[9px] text-slate-500 font-bold truncate">{u.branch}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <AdminResetRequestsPanel resetRequests={resetRequests} setResetRequests={setResetRequests} triggerToastAlert={triggerToastAlert} />
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-slate-800 pb-4"><UserPlus className="h-4 w-4 text-emerald-500"/> Provision Identity</h3>
                    <form onSubmit={handleCreateUserSubmit} className="space-y-4 text-xs">
                      <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Full Name</label><input type="text" required value={newUserForm.name} onChange={e=>setNewUserForm({...newUserForm,name:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-rose-500" placeholder="e.g. John Doe"/></div>
                      <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Username Prefix</label><div className="flex items-center"><input type="text" required value={newUserForm.emailPrefix} onChange={e=>setNewUserForm({...newUserForm,emailPrefix:e.target.value.replace(/\s+/g,'').toLowerCase()})} className="w-full bg-slate-900 border border-slate-800 rounded-l-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-rose-500 font-mono" placeholder="john"/><span className="bg-slate-800 border border-slate-800 border-l-0 rounded-r-xl px-3 py-2.5 text-slate-500 font-mono font-bold">@desam</span></div></div>
                      <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Initial Password</label><input type="password" required minLength={6} value={newUserForm.pass} onChange={e=>setNewUserForm({...newUserForm,pass:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-rose-500" placeholder="Minimum 6 characters"/></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Role</label><select value={newUserForm.role} onChange={e=>setNewUserForm({...newUserForm,role:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-rose-500"><option value="Manager">Manager</option><option value="Executive">Executive</option><option value="Telecaller">Telecaller</option></select></div>
                        <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Branch</label><select value={newUserForm.branch} onChange={e=>setNewUserForm({...newUserForm,branch:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-rose-500">{BRANCHES.map(b=><option key={b} value={b}>{b}</option>)}</select></div>
                      </div>
                      <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Phone Number</label><input type="tel" value={newUserForm.phone} onChange={e=>setNewUserForm({...newUserForm,phone:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-rose-500 font-mono" placeholder="10-digit number"/></div>
                      <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 text-white font-black py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-lg mt-2 flex items-center justify-center gap-2"><UserPlus className="h-4 w-4"/> Provision User</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ═══ MODALS & OVERLAYS ════════════════════════════════════════════ */}
      {selectedLead&&(
        <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] lg:w-[500px] bg-slate-950 border-l border-slate-800 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
          <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
            <div><h2 className="text-lg font-black text-white flex items-center gap-2">{selectedLead.name}</h2><p className="text-[10px] text-slate-400 font-mono mt-0.5">{selectedLead.phone} {selectedLead.altPhone&&` / ${selectedLead.altPhone}`}</p></div>
            <button onClick={()=>setSelectedLead(null)} className="text-slate-500 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-colors"><X className="h-5 w-5"/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-950">
             <div className="grid grid-cols-2 gap-3 text-xs">
               <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl"><p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Status</p><div className="mt-1 flex items-center justify-between"><span className="font-black" style={{color:SC[selectedLead.status]?.text}}>{selectedLead.status}</span><button onClick={()=>requestStatusTransitionPopup(selectedLead.id,"Closed")} className="text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded transition-colors">Edit</button></div></div>
               <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl"><p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Assigned</p>{["Admin","Manager"].includes(currentUser.role)?<select value={selectedLead.assignedTo||"Unassigned"} onChange={e=>requestOwnerAssignmentPopup(selectedLead.id,e.target.value)} className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-200 focus:outline-none focus:border-orange-500"><option value="Unassigned">Unassigned</option>{assignableUsers.map(u=><option key={u.id} value={u.name}>{u.name} ({u.role})</option>)}</select>:<p className="font-bold text-white truncate mt-1">{selectedLead.assignedTo}</p>}</div>
               <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl"><p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Project / Budget</p><p className="font-bold text-orange-400 mt-1 truncate">{selectedLead.project} <span className="text-slate-500 mx-1">•</span> <span className="font-mono text-emerald-400">₹{selectedLead.budget}L</span></p></div>
               <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl"><p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Source</p><p className="font-bold text-slate-300 mt-1 truncate">{selectedLead.source}</p></div>
             </div>
             <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2"><Activity className="h-4 w-4 text-blue-400"/><h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Action Center</h3></div>
                <div className="grid grid-cols-2 gap-2">
                  <MobileCallButton phone={selectedLead.phone} leadName={selectedLead.name} onFeedbackSaved={(f)=>handleCallFeedback(selectedLead.id, f)} currentUser={currentUser} TODAY_STR={TODAY_STR} />
                  <a href={`https://wa.me/91${stripPhone(selectedLead.phone)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all shadow-md"><MessageSquare className="h-3.5 w-3.5"/> WhatsApp</a>
                </div>
                <form onSubmit={commitManualFollowUpReport} className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 space-y-3">
                  <textarea value={followUpNotes} onChange={e=>setFollowUpNotes(e.target.value)} required rows={2} placeholder="Quick follow-up notes..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-none"/>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1"><label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Next Follow-up</label><input type="date" required value={nextFollowUpDate} min={TODAY_STR} onChange={e=>setNextFollowUpDate(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 font-mono mt-0.5"/></div>
                    <button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"><Send className="h-3 w-3"/> Log</button>
                  </div>
                </form>
             </div>
             <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2"><Calendar className="h-4 w-4 text-orange-400"/><h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Timeline</h3></div>
                <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
                  {selectedLead.history?.map((h,i)=>(
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border border-slate-700 bg-slate-900 text-slate-500 group-[.is-active]:text-orange-400 group-[.is-active]:border-orange-500/50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"><div className="h-1.5 w-1.5 bg-current rounded-full"/></div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border border-slate-800 bg-slate-900/60 shadow text-xs">
                        <div className="flex items-center justify-between mb-1"><span className="font-black text-slate-300">{h.by}</span><span className="font-mono text-[9px] text-slate-500">{h.date}</span></div>
                        <p className="text-slate-400 leading-relaxed">{h.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {isLeadModalOpen&&(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
             <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-gradient-to-r from-orange-900/20 to-transparent">
               <h2 className="text-lg font-black text-white flex items-center gap-2"><UserPlus className="h-5 w-5 text-orange-500"/> Capture New Lead</h2>
               <button onClick={()=>setIsLeadModalOpen(false)} className="text-slate-500 hover:text-white p-2 hover:bg-slate-900 rounded-xl transition-colors"><X className="h-5 w-5"/></button>
             </div>
             <form onSubmit={handleCreateLead} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
                {duplicateConflictRecord&&<div className="bg-rose-950/40 border border-rose-500/30 p-3 rounded-xl flex items-start gap-3"><AlertTriangle className="h-5 w-5 text-rose-500 mt-0.5 shrink-0"/><div><p className="font-bold text-rose-400">Potential Duplicate Found!</p><p className="text-rose-200/70 mt-1 mb-2">Lead <strong>{duplicateConflictRecord.name}</strong> exists with this number. Status: {duplicateConflictRecord.status}. Assigned to: {duplicateConflictRecord.assignedTo}.</p><button type="button" onClick={()=>{setSelectedLead(duplicateConflictRecord);setIsLeadModalOpen(false);setDuplicateConflictRecord(null);}} className="text-[10px] font-black uppercase tracking-wider bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 px-3 py-1.5 rounded-lg transition-colors border border-rose-500/30">View Existing Lead</button></div></div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Full Name *</label><input type="text" required value={newLeadForm.name} onChange={e=>setNewLeadForm({...newLeadForm,name:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500"/></div>
                  <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Primary Phone *</label><input type="tel" required value={newLeadForm.phone} onChange={e=>handlePhoneInputChange(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500 font-mono"/></div>
                  <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Alt Phone</label><input type="tel" value={newLeadForm.altPhone} onChange={e=>handlePhoneInputChange(e.target.value,true)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500 font-mono"/></div>
                  <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Email Address</label><input type="email" value={newLeadForm.email} onChange={e=>setNewLeadForm({...newLeadForm,email:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500 font-mono"/></div>
                  <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Location / Area *</label><input type="text" required value={newLeadForm.location} onChange={e=>setNewLeadForm({...newLeadForm,location:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500"/></div>
                  <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Interest Project *</label><select required value={newLeadForm.project} onChange={e=>setNewLeadForm({...newLeadForm,project:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-orange-500">{visibleProjects.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select></div>
                  <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Budget (₹ Lakhs) *</label><input type="number" required min="5" value={newLeadForm.budget} onChange={e=>setNewLeadForm({...newLeadForm,budget:parseInt(e.target.value)||0})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500 font-mono"/></div>
                  <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Lead Source *</label><select required value={newLeadForm.source} onChange={e=>setNewLeadForm({...newLeadForm,source:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-orange-500">{SOURCES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                  {["Admin","Manager"].includes(currentUser.role)&&<div className="space-y-1.5 sm:col-span-2"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Assign To</label><select value={newLeadForm.assignedTo} onChange={e=>setNewLeadForm({...newLeadForm,assignedTo:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-orange-500"><option value="Unassigned">Leave Unassigned (Pool)</option>{assignableUsers.map(u=><option key={u.id} value={u.name}>{u.name} ({u.role} - {u.branch})</option>)}</select></div>}
                  <div className="space-y-1.5 sm:col-span-2"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Initial Notes / Remarks</label><textarea rows={3} value={newLeadForm.notes} onChange={e=>setNewLeadForm({...newLeadForm,notes:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500 resize-none"/></div>
                </div>
                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3"><button type="button" onClick={()=>setIsLeadModalOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">Cancel</button><button type="submit" disabled={!!duplicateConflictRecord} className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg transition-all flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/> Save Lead</button></div>
             </form>
          </div>
        </div>
      )}

      {isActivityLogModalOpen&&(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-gradient-to-r from-emerald-900/20 to-transparent">
              <h2 className="text-lg font-black text-white flex items-center gap-2"><ClipboardList className="h-5 w-5 text-emerald-500"/> Submit Daily Activity Log</h2>
              <button onClick={()=>setIsActivityLogModalOpen(false)} className="text-slate-500 hover:text-white p-2 hover:bg-slate-900 rounded-xl transition-colors"><X className="h-5 w-5"/></button>
            </div>
            <form onSubmit={handleCreateActivityLog} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Log Date</label><input type="date" required value={newActivityForm.date} max={TODAY_STR} onChange={e=>setNewActivityForm({...newActivityForm,date:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"/></div>
                {["Admin","Manager"].includes(currentUser.role)?<div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Executive</label><select required value={newActivityForm.executive} onChange={e=>setNewActivityForm({...newActivityForm,executive:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500"><option value="">Select Executive...</option>{visibleUsers.map(u=><option key={u.id} value={u.name}>{u.name}</option>)}</select></div>:<div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Executive</label><input type="text" readOnly value={currentUser.name} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 text-slate-400 cursor-not-allowed"/></div>}
                <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Project Base</label><select required value={newActivityForm.project} onChange={e=>setNewActivityForm({...newActivityForm,project:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500">{visibleProjects.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select></div>
                <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Primary Source</label><select required value={newActivityForm.source} onChange={e=>setNewActivityForm({...newActivityForm,source:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500">{SOURCES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Calls Made</label><input type="number" min="0" required value={newActivityForm.callsMade} onChange={e=>setNewActivityForm({...newActivityForm,callsMade:parseInt(e.target.value)||0})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"/></div>
                <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Call Status</label><select required value={newActivityForm.callStatus} onChange={e=>setNewActivityForm({...newActivityForm,callStatus:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500">{CALL_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Outcome Metrics</h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  <div className="space-y-1 text-center"><label className="text-slate-400 font-bold text-[9px] uppercase">Followups</label><input type="number" min="0" value={newActivityForm.followup} onChange={e=>setNewActivityForm({...newActivityForm,followup:parseInt(e.target.value)||0})} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 text-center text-blue-400 font-mono focus:outline-none focus:border-emerald-500"/></div>
                  <div className="space-y-1 text-center"><label className="text-slate-400 font-bold text-[9px] uppercase">Site Visit</label><input type="number" min="0" value={newActivityForm.siteVisit} onChange={e=>setNewActivityForm({...newActivityForm,siteVisit:parseInt(e.target.value)||0})} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 text-center text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"/></div>
                  <div className="space-y-1 text-center"><label className="text-slate-400 font-bold text-[9px] uppercase">Booking</label><input type="number" min="0" value={newActivityForm.booking} onChange={e=>setNewActivityForm({...newActivityForm,booking:parseInt(e.target.value)||0})} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 text-center text-purple-400 font-mono focus:outline-none focus:border-emerald-500"/></div>
                  <div className="space-y-1 text-center"><label className="text-slate-400 font-bold text-[9px] uppercase">Reg.</label><input type="number" min="0" value={newActivityForm.registration} onChange={e=>setNewActivityForm({...newActivityForm,registration:parseInt(e.target.value)||0})} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 text-center text-amber-400 font-mono focus:outline-none focus:border-emerald-500"/></div>
                  <div className="space-y-1 text-center"><label className="text-slate-400 font-bold text-[9px] uppercase">Cancel.</label><input type="number" min="0" value={newActivityForm.cancellation} onChange={e=>setNewActivityForm({...newActivityForm,cancellation:parseInt(e.target.value)||0})} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 text-center text-rose-400 font-mono focus:outline-none focus:border-emerald-500"/></div>
                  <div className="space-y-1 text-center"><label className="text-slate-400 font-bold text-[9px] uppercase">Collect.</label><input type="number" min="0" value={newActivityForm.collection} onChange={e=>setNewActivityForm({...newActivityForm,collection:parseInt(e.target.value)||0})} className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 text-center text-cyan-400 font-mono focus:outline-none focus:border-emerald-500" title="Collection Amount"/></div>
                </div>
              </div>
              <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">End of Day Remarks</label><textarea rows={2} value={newActivityForm.remark} onChange={e=>setNewActivityForm({...newActivityForm,remark:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"/></div>
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3"><button type="button" onClick={()=>setIsActivityLogModalOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">Cancel</button><button type="submit" className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 text-white shadow-lg transition-all flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/> Save Log</button></div>
            </form>
          </div>
        </div>
      )}

      {isProjectModalOpen&&(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-gradient-to-r from-purple-900/20 to-transparent">
              <h2 className="text-lg font-black text-white flex items-center gap-2"><Building2 className="h-5 w-5 text-purple-500"/> Create Project</h2>
              <button onClick={()=>setIsProjectModalOpen(false)} className="text-slate-500 hover:text-white p-2 hover:bg-slate-900 rounded-xl transition-colors"><X className="h-5 w-5"/></button>
            </div>
            <form onSubmit={handleCreateProject} className="p-6 space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Project Name *</label><input type="text" required value={newProjectForm.name} onChange={e=>setNewProjectForm({...newProjectForm,name:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500"/></div>
                <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Location *</label><input type="text" required value={newProjectForm.location} onChange={e=>setNewProjectForm({...newProjectForm,location:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500"/></div>
                <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Branch / Region</label><select value={newProjectForm.branch} onChange={e=>setNewProjectForm({...newProjectForm,branch:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-purple-500">{BRANCHES.map(b=><option key={b} value={b}>{b}</option>)}</select></div>
                <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Project Type</label><select value={newProjectForm.type} onChange={e=>setNewProjectForm({...newProjectForm,type:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-purple-500">{PROJECT_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
                <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Base Price (₹ Lakhs)</label><input type="number" required min="1" value={newProjectForm.price} onChange={e=>setNewProjectForm({...newProjectForm,price:parseInt(e.target.value)||0})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500 font-mono"/></div>
                <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Total Units / Plots</label><input type="number" required min="1" value={newProjectForm.units} onChange={e=>setNewProjectForm({...newProjectForm,units:parseInt(e.target.value)||0})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500 font-mono"/></div>
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3"><button type="button" onClick={()=>setIsProjectModalOpen(false)} className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">Cancel</button><button type="submit" className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 text-white shadow-lg transition-all flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/> Initialize Project</button></div>
            </form>
          </div>
        </div>
      )}

      {isEditUserModalOpen&&editUserForm&&(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h2 className="text-lg font-black text-white flex items-center gap-2"><Edit2 className="h-5 w-5 text-blue-500"/> Edit Personnel Info</h2>
              <button onClick={()=>{setIsEditUserModalOpen(false);setEditUserForm(null);}} className="text-slate-500 hover:text-white p-2 hover:bg-slate-900 rounded-xl transition-colors"><X className="h-5 w-5"/></button>
            </div>
            <form onSubmit={handleUpdateUserSubmit} className="p-6 space-y-4 text-xs overflow-y-auto">
              <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Full Name</label><input type="text" required value={editUserForm.name} onChange={e=>setEditUserForm({...editUserForm,name:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500"/></div>
              <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Username / Email</label><input type="text" required value={editUserForm.email} onChange={e=>setEditUserForm({...editUserForm,email:e.target.value.toLowerCase().replace(/\s/g,'')})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"/></div>
              <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Phone Number</label><input type="tel" required value={editUserForm.phone} onChange={e=>setEditUserForm({...editUserForm,phone:stripPhone(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"/></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Role</label><select value={editUserForm.role} onChange={e=>setEditUserForm({...editUserForm,role:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-blue-500"><option value="Manager">Manager</option><option value="Executive">Executive</option><option value="Telecaller">Telecaller</option></select></div>
                <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Branch</label><select value={editUserForm.branch} onChange={e=>setEditUserForm({...editUserForm,branch:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-blue-500">{BRANCHES.map(b=><option key={b} value={b}>{b}</option>)}</select></div>
              </div>
              <label className="flex items-center justify-between gap-3 bg-slate-900/70 border border-slate-800 rounded-xl px-3 py-2.5 cursor-pointer">
                <span><span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wide">Login Active</span><span className="block text-[10px] text-slate-600 mt-0.5">Turn off to block this staff login.</span></span>
                <input type="checkbox" checked={editUserForm.active!==false} onChange={e=>setEditUserForm({...editUserForm,active:e.target.checked})} className="h-4 w-4 accent-blue-600"/>
              </label>
              <div className="bg-blue-950/20 border border-blue-500/20 rounded-xl p-3 space-y-3">
                <p className="text-[10px] text-blue-300 font-black uppercase tracking-wider flex items-center gap-1.5"><KeyRound className="h-3.5 w-3.5"/> Change Password</p>
                <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">New Password</label><input type="password" minLength={6} value={editUserForm.newPassword||""} onChange={e=>setEditUserForm({...editUserForm,newPassword:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500" placeholder="Leave blank to keep current password"/></div>
                <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Confirm New Password</label><input type="password" value={editUserForm.confirmNewPassword||""} onChange={e=>setEditUserForm({...editUserForm,confirmNewPassword:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500" placeholder="Re-enter new password"/></div>
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3"><button type="button" onClick={()=>{setIsEditUserModalOpen(false);setEditUserForm(null);}} className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">Cancel</button><button type="submit" className="px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all">Save Changes</button></div>
            </form>
          </div>
        </div>
      )}

      {customPopup.isOpen&&(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center space-y-5">
            <div className="mx-auto w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-2"><AlertCircle className="h-6 w-6 text-orange-400"/></div>
            <div><h3 className="text-lg font-black text-white">{customPopup.title}</h3><p className="text-xs text-slate-400 mt-2 leading-relaxed">{customPopup.message}</p></div>
            <div className="grid grid-cols-2 gap-3 pt-2"><button onClick={()=>setCustomPopup({isOpen:false,leadId:null,targetValue:"",type:"status",title:"",message:""})} className="py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">Cancel</button><button onClick={confirmCustomPopupAction} className="py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 text-white shadow-lg transition-all">Confirm</button></div>
          </div>
        </div>
      )}

      {toastNotification.isVisible&&(
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] animate-bounce"><div className="bg-slate-800 border border-slate-700 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-400"/><span className="text-xs font-black tracking-wide">{toastNotification.message}</span></div></div>
      )}
    </div>
  );
}
