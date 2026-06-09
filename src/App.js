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
  Phone, UserCheck, BookOpen, XCircle, Activity,
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
  "Booked","Not Interested","RNR","Switched Off","Wrong Number"
];
const PROJECT_STATUSES = ["Upcoming","Pre-Launch","Ongoing","Completed","Sold-Out"];
const BRANCHES = ["Madurai Desk","Chennai South","Chennai North","Coimbatore"];
const PROJECT_TYPES = ["Apartment","Villa","Plot"];
const CALL_STATUSES = ["Warm","Cold","Not Reachable","Callback Requested"];
const PROSPECT_STATUSES = ["Hot","Warm","Cold"];
const PROSPECT_STATUS_STYLES = {
  Hot: { color:"#f97316", bg:"rgba(249,115,22,0.12)", border:"rgba(249,115,22,0.28)" },
  Warm: { color:"#facc15", bg:"rgba(250,204,21,0.12)", border:"rgba(250,204,21,0.28)" },
  Cold: { color:"#60a5fa", bg:"rgba(96,165,250,0.12)", border:"rgba(96,165,250,0.28)" },
};
const getProspectStatus = (lead) => PROSPECT_STATUSES.includes(lead?.prospectStatus) ? lead.prospectStatus : "Warm";
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
  Booked: { bg: "rgba(52,211,153,0.15)", text: "#34d399", border: "rgba(52,211,153,0.3)" },
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

const pad2 = (value) => String(value).padStart(2, "0");
function getLocalDate(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}
function getLocalTime(date = new Date()) {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}
function getLocalDateTime(date = new Date()) {
  return `${getLocalDate(date)} ${getLocalTime(date)}`;
}
function makeHistoryLog(by, action, date = new Date()) {
  return { date: getLocalDate(date), time: getLocalTime(date), timestamp: date.toISOString(), by, action };
}
function formatDateTimeLabel(item) {
  if (!item) return "";
  const date = item.date || item.dateCreated || "";
  const time = item.time || item.dateCreatedTime || "";
  return [date, time].filter(Boolean).join(" ");
}
function formatReportValue(value) {
  if (typeof value === "number") return value === 0 ? "-" : value;
  if (typeof value === "string" && /^(0|0\.0)%?$/.test(value.trim())) return "-";
  return value;
}
function calculateBookingProductivity(booking, calls) {
  return calls ? `${(((booking || 0) / calls) * 100).toFixed(1)}%` : "0.0%";
}
function isTimestampToday(value) {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  return getLocalDate(date) === getLocalDate();
}
function isFreshLead(lead) {
  return lead?.status === "Assigned" && lead?.assignedTo && lead.assignedTo !== "Unassigned" && isTimestampToday(lead.assignedAt);
}

function CalendarDateInput({ value, onChange, min, max, required = false, className = "", iconClassName = "text-white" }) {
  const inputRef = useRef(null);
  const openPicker = () => {
    const input = inputRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") input.showPicker();
    else input.focus();
  };
  const handleChange = (e) => {
    const next = e.target.value;
    if (min && next && next < min) { onChange(min); return; }
    if (max && next && next > max) { onChange(max); return; }
    onChange(next);
  };
  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="date"
        value={value || ""}
        min={min}
        max={max}
        required={required}
        onChange={handleChange}
        onClick={openPicker}
        onKeyDown={e => e.preventDefault()}
        onPaste={e => e.preventDefault()}
        onDrop={e => e.preventDefault()}
        className={`w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-orange-500 font-mono pr-10 [color-scheme:dark] cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 ${className}`}
      />
      <button type="button" onClick={openPicker} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg bg-slate-800/70 border border-slate-700 hover:bg-slate-700 transition-colors" aria-label="Open calendar">
        <Calendar className={`h-4 w-4 ${iconClassName}`} />
      </button>
    </div>
  );
}

const STATUS_EVENT_CONFIG = {
  Contacted: { dateLabel: "Next Follow-up Date", eventLabel: "Contact Notes / Remark", defaultEvent: "" },
  "Follow-Up": { dateLabel: "Next Follow-up Date", eventLabel: "Follow-up Event / Remark", defaultEvent: "Follow-up scheduled" },
  "Site Visit Planned": { dateLabel: "Site Visit Date", eventLabel: "Site Visit Event / Remark", defaultEvent: "Site visit planned" },
  "Site Visit Completed": { dateLabel: "Site Visit Date", eventLabel: "Site Visit Feedback / Remark", defaultEvent: "Site visit completed" },
  Negotiation: { dateLabel: "Next Follow-up Date", eventLabel: "Negotiation Notes / Remark", defaultEvent: "" },
  "Booking Pending": { dateLabel: "Booking Follow-up Date", eventLabel: "Booking Event / Remark", defaultEvent: "Booking pending" },
  "Booking Confirmed": { dateLabel: "Booking Date", eventLabel: "Booking Details / Remark", defaultEvent: "Booking confirmed" },
  Booked: { dateLabel: "Booking Date", eventLabel: "Booking Notes / Remark", defaultEvent: "" },
  "Not Interested": { eventLabel: "Reason / Remark", defaultEvent: "", dateRequired: false },
  RNR: { dateLabel: "Next Follow-up Date", eventLabel: "RNR Notes / Remark", defaultEvent: "" },
  "Switched Off": { dateLabel: "Next Follow-up Date", eventLabel: "Switched Off Notes / Remark", defaultEvent: "" },
  "Wrong Number": { eventLabel: "Wrong Number Remark", defaultEvent: "", dateRequired: false },
};

function getStatusEventConfig(status) {
  return STATUS_EVENT_CONFIG[status] || null;
}

function getEditableLeadStatus(status) {
  return status === "Closed" ? "Booked" : (status || "New");
}

function normaliseProjectKey(value) {
  return String(value || "").trim().toLowerCase();
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
function MobileCallButton({ phone, leadName, onFeedbackSaved, currentUser, TODAY_STR, prospectStatus = "Warm" }) {
  const [callState, setCallState] = useState("idle");
  const [callDuration, setCallDuration] = useState(0);
  const makeDefaultFeedback = () => ({ rating: 0, notes: "", outcome: "Contacted", followUpDate: "", prospectStatus: PROSPECT_STATUSES.includes(prospectStatus) ? prospectStatus : "Warm" });
  const [feedback, setFeedback] = useState(makeDefaultFeedback);
  const deadCallOutcomes = ["Not Interested", "Wrong Number"];
  const needsFollowUpDate = !deadCallOutcomes.includes(feedback.outcome);
  const timerRef = useRef(null);
  const callStateRef = useRef("idle");
  const callStartedAtRef = useRef(0);

  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  const startCall = () => {
    if (!phone) return;
    setCallState("calling");
    setCallDuration(0);
    setFeedback(makeDefaultFeedback());
    callStartedAtRef.current = Date.now();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    const cleanPhone = String(phone).replace(/\D/g, "");
    if (window.DDConnectAndroid?.startCall) {
      window.DDConnectAndroid.startCall(cleanPhone || phone);
    } else {
      window.location.href = `tel:${phone}`;
    }
  };

  const endCall = () => {
    if (callStateRef.current !== "calling") return;
    clearInterval(timerRef.current);
    timerRef.current = null;
    setCallState("feedback");
  };

  const saveFeedback = () => {
    if (onFeedbackSaved) {
      onFeedbackSaved({ ...feedback, followUpDate: needsFollowUpDate ? feedback.followUpDate : "", callDuration, calledAt: new Date().toISOString(), phone, leadName });
    }
    setCallState("idle");
    setFeedback(makeDefaultFeedback());
    setCallDuration(0);
  };

  const dismiss = () => {
    clearInterval(timerRef.current);
    setCallState("idle");
    setFeedback(makeDefaultFeedback());
    setCallDuration(0);
  };

  const formatDur = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  useEffect(() => {
    const finishCallAfterReturn = () => {
      if (callStateRef.current !== "calling") return;
      const elapsed = Date.now() - callStartedAtRef.current;
      const delay = elapsed < 1500 ? 1500 - elapsed : 0;
      window.setTimeout(() => {
        if (callStateRef.current === "calling") endCall();
      }, delay);
    };
    const handleVisibilityReturn = () => {
      if (!document.hidden) finishCallAfterReturn();
    };
    window.DDConnectCallReturned = finishCallAfterReturn;
    window.addEventListener("dd-connect-call-returned", finishCallAfterReturn);
    window.addEventListener("focus", finishCallAfterReturn);
    window.addEventListener("pageshow", finishCallAfterReturn);
    document.addEventListener("visibilitychange", handleVisibilityReturn);
    return () => {
      if (window.DDConnectCallReturned === finishCallAfterReturn) delete window.DDConnectCallReturned;
      window.removeEventListener("dd-connect-call-returned", finishCallAfterReturn);
      window.removeEventListener("focus", finishCallAfterReturn);
      window.removeEventListener("pageshow", finishCallAfterReturn);
      document.removeEventListener("visibilitychange", handleVisibilityReturn);
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
                <select value={feedback.outcome} onChange={e => setFeedback(f => ({ ...f, outcome: e.target.value, followUpDate: deadCallOutcomes.includes(e.target.value) ? "" : f.followUpDate }))} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Prospect Status</label>
                <select value={feedback.prospectStatus} onChange={e => setFeedback(f => ({ ...f, prospectStatus: e.target.value }))} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500">
                  {PROSPECT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {needsFollowUpDate&&<div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Next Follow-up Date</label>
                <CalendarDateInput value={feedback.followUpDate} min={TODAY_STR} onChange={date => setFeedback(f => ({ ...f, followUpDate: date }))} className="text-xs focus:border-emerald-500" />
              </div>}
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
  const TODAY_STR = getLocalDate();
  const isMobile = useIsMobile();

  const [storageReady, setStorageReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(typeof Notification !== "undefined" ? Notification.permission : "unsupported");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [showAdminLoginPopup, setShowAdminLoginPopup] = useState(false);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [navHistory, setNavHistory] = useState([]);
  const [globalSearch, setGlobalSearch] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAllDashboardNewLeads, setShowAllDashboardNewLeads] = useState(false);
  const [showAllDashboardFollowUps, setShowAllDashboardFollowUps] = useState(false);

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
  const [actStartDate, setActStartDate] = useState(TODAY_STR);
  const [actEndDate, setActEndDate] = useState(TODAY_STR);
  const [activitySearch, setActivitySearch] = useState("");
  const [reportStartDate, setReportStartDate] = useState(`${TODAY_STR.slice(0,7)}-01`);
  const [reportEndDate, setReportEndDate] = useState(TODAY_STR);
  const [selectedMatrixReport, setSelectedMatrixReport] = useState("ExecutiveWise");
  const [expandedRangeReportKey, setExpandedRangeReportKey] = useState("");

  const [leads, setLeadsState] = useState([]);
  const [adminUsers, setAdminUsersState] = useState([]);
  const [nonAdminUsers, setNonAdminUsersState] = useState([]);
  const [projects, setProjectsState] = useState([]);
  const [activityLogs, setActivityLogsState] = useState([]);
  const [whatsappTemplates, setWhatsappTemplatesState] = useState([]);
  const [resetRequests, setResetRequestsState] = useState([]);
  const pendingStateKeysRef = useRef(new Set());
  const stateSaveSeqRef = useRef({});

  const users = useMemo(() => [...adminUsers, ...nonAdminUsers], [adminUsers, nonAdminUsers]);
  const rememberSession = useCallback((user) => {
    try { localStorage.setItem("crm_current_user", JSON.stringify(user)); } catch {}
  }, []);
  const forgetSession = useCallback(() => {
    try { localStorage.removeItem("crm_current_user"); } catch {}
  }, []);

  const persistState = useCallback(async (key, value) => {
    const saveSeq = (stateSaveSeqRef.current[key] || 0) + 1;
    stateSaveSeqRef.current[key] = saveSeq;
    pendingStateKeysRef.current.add(key);
    try {
      const { error } = await supabase
        .from("crm_state_store")
        .upsert({ key, value }, { onConflict: "key" });
      if (error) throw error;
      localStorage.setItem(`crm_state_store:${key}`, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`Failed to save ${key}:`, err);
      const message = typeof err?.message === "string" ? err.message : JSON.stringify(err || {});
      window.dispatchEvent(new CustomEvent("crm-backend-error", { detail: { key, message } }));
      return false;
    } finally {
      if (stateSaveSeqRef.current[key] === saveSeq) {
        pendingStateKeysRef.current.delete(key);
      }
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
    const saved = await persistState("leads", data);
    if (!saved) return false;
    return true;
  }, [leads, persistState]);

  const setUsers = useCallback(async (val) => {
    const allData = typeof val === "function" ? val(users) : val;
    const admins = allData.filter(u => u.role === "Admin");
    const nonAdmins = allData.filter(u => u.role !== "Admin");
    const adminsSaved = await persistState("admin_users", admins);
    const staffSaved = await persistState("non_admin_users", nonAdmins);
    if (!adminsSaved || !staffSaved) return false;
    setAdminUsersState(admins);
    setNonAdminUsersState(nonAdmins);
    return true;
  }, [users, persistState]);

  const setProjects = useCallback(async (val) => {
    const data = typeof val === "function" ? val(projects) : val;
    const saved = await persistState("projects", data);
    if (!saved) return false;
    setProjectsState(data);
    return true;
  }, [projects, persistState]);

  const setActivityLogsStateWrapped = useCallback((val) => {
    setActivityLogsState(prev => {
      const data = typeof val === "function" ? val(prev) : val;
      persistState("activity_logs", data);
      return data;
    });
  }, [persistState]);

  const setWhatsappTemplates = useCallback(async (val) => {
    const data = typeof val === "function" ? val(whatsappTemplates) : val;
    const saved = await persistState("whatsapp_templates", data);
    if (!saved) return false;
    setWhatsappTemplatesState(data);
    return true;
  }, [whatsappTemplates, persistState]);

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
      if (Array.isArray(stateMap["leads"]) && !pendingStateKeysRef.current.has("leads")) setLeadsState(stateMap["leads"]);
      if (Array.isArray(stateMap["projects"]) && !pendingStateKeysRef.current.has("projects")) setProjectsState(stateMap["projects"]);
      if (Array.isArray(stateMap["whatsapp_templates"]) && !pendingStateKeysRef.current.has("whatsapp_templates")) setWhatsappTemplatesState(stateMap["whatsapp_templates"]);
      if (Array.isArray(stateMap["non_admin_users"]) && !pendingStateKeysRef.current.has("non_admin_users")) {
        const migrated = await migratePlainPasswords(stateMap["non_admin_users"]);
        setNonAdminUsersState(migrated.users);
        if (migrated.changed) persistState("non_admin_users", migrated.users);
      }
      if (Array.isArray(stateMap["reset_requests"]) && !pendingStateKeysRef.current.has("reset_requests")) setResetRequestsState(stateMap["reset_requests"]);
    } catch (err) {
      console.error("Failed to refresh backend state:", err);
    }
  }, [persistState]);

  const loadStaffUsersFromBackend = useCallback(async () => {
    const { data: dbRows, error } = await supabase.from("crm_state_store").select("*");
    if (error) throw error;
    const stateMap = {};
    if (Array.isArray(dbRows)) {
      dbRows.forEach(row => { stateMap[row.key] = row.value; });
    }
    if (!Array.isArray(stateMap["non_admin_users"])) return [];
    const migrated = await migratePlainPasswords(stateMap["non_admin_users"]);
    setNonAdminUsersState(migrated.users);
    if (migrated.changed) persistState("non_admin_users", migrated.users);
    return migrated.users;
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

        let admins = Array.isArray(stateMap["admin_users"]) ? stateMap["admin_users"] : [];
        let nonAdmins = Array.isArray(stateMap["non_admin_users"]) ? stateMap["non_admin_users"] : BOOTSTRAP_NON_ADMIN_USERS;
        const adminMigration = await migratePlainPasswords(admins);
        const nonAdminMigration = await migratePlainPasswords(nonAdmins);
        admins = adminMigration.users;
        nonAdmins = nonAdminMigration.users;
        if (adminMigration.changed) await persistState("admin_users", admins);
        if (nonAdminMigration.changed || !stateMap["non_admin_users"]) {
          const staffSaved = await persistState("non_admin_users", nonAdmins);
          if (!staffSaved && !stateMap["non_admin_users"]) nonAdmins = [];
        }
        let p = Array.isArray(stateMap["projects"]) ? stateMap["projects"] : null;
        if (!p) {
          p = BOOTSTRAP_PROJECTS;
          const projectsSaved = await persistState("projects", p);
          if (!projectsSaved) p = [];
        }
        const l = Array.isArray(stateMap["leads"]) ? stateMap["leads"] : [];
        const a = Array.isArray(stateMap["activity_logs"]) ? stateMap["activity_logs"] : [];
        const w = Array.isArray(stateMap["whatsapp_templates"]) ? stateMap["whatsapp_templates"] : [];
        const r = Array.isArray(stateMap["reset_requests"]) ? stateMap["reset_requests"] : [];

        if (!isMounted) return;
        setAdminUsersState(admins);
        setNonAdminUsersState(nonAdmins);
        setProjectsState(p);
        setLeadsState(l);
        setActivityLogsState(a);
        setWhatsappTemplatesState(w);
        setResetRequestsState(r);
        const { data: sessionData } = await supabase.auth.getSession();
        if (isSupabaseAdminUser(sessionData?.session?.user)) {
          const admin = authUserToAdmin(sessionData.session.user);
          setCurrentUser(admin);
          rememberSession(admin);
        } else {
          try {
            const saved = JSON.parse(localStorage.getItem("crm_current_user") || "null");
            if (saved?.role !== "Admin") {
              const latest = nonAdmins.find(u => u.id === saved.id && u.active !== false && u.email === saved.email && u.passwordHash === saved.passwordHash);
              if (latest) setCurrentUser(latest);
              else forgetSession();
            }
          } catch { forgetSession(); }
        }
      } catch (err) {
        console.error("Failed to load Supabase state:", err);
        window.dispatchEvent(new CustomEvent("crm-backend-error", { detail: { key: "initial_load", message: err?.message || "Unable to load Supabase state." } }));
        if (!isMounted) return;
        setAdminUsersState([]);
        setNonAdminUsersState([]);
        setProjectsState([]);
        setLeadsState([]);
        setActivityLogsState([]);
        setWhatsappTemplatesState([]);
        setResetRequestsState([]);
        const { data: sessionData } = await supabase.auth.getSession();
        if (isSupabaseAdminUser(sessionData?.session?.user)) {
          const admin = authUserToAdmin(sessionData.session.user);
          setCurrentUser(admin);
          rememberSession(admin);
        }
      } finally {
        if (isMounted) setStorageReady(true);
      }
    })();
    return () => { isMounted = false; };
  }, [persistState, rememberSession, forgetSession]);

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
  const [leadImportMode, setLeadImportMode] = useState("append");
  const [customPopup, setCustomPopup] = useState({ isOpen:false, leadId:null, targetValue:"", type:"status", title:"", message:"" });
  const [toastNotification, setToastNotification] = useState({ isVisible:false, message:"" });
  const [showExitAppPopup, setShowExitAppPopup] = useState(false);
  const [prospectStatusPopup, setProspectStatusPopup] = useState({ isOpen:false, status:"" });
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isActivityLogModalOpen, setIsActivityLogModalOpen] = useState(false);
  const [dismissedAssignmentNotices, setDismissedAssignmentNotices] = useState([]);
  const [newLeadForm, setNewLeadForm] = useState({ name:"", phone:"", altPhone:"", email:"", location:"", project:"", budget:25, source:"Website", assignedTo:"Unassigned", prospectStatus:"Warm", notes:"" });
  const [newProjectForm, setNewProjectForm] = useState({ name:"", location:"", branch:"Madurai Desk", type:"Plot", price:30, units:50, sold:0, status:"Pre-Launch" });
  const [newUserForm, setNewUserForm] = useState({ name:"", emailPrefix:"", pass:"", role:"Executive", branch:"Madurai Desk", phone:"", managerId:"" });
  const [newActivityForm, setNewActivityForm] = useState({ date:TODAY_STR, executive:"", project:"", source:"Own Leads", callsMade:0, callStatus:"Warm", followup:0, siteVisit:0, booking:0, registration:0, cancellation:0, collection:0, remark:"" });
  const [duplicateConflictRecord, setDuplicateConflictRecord] = useState(null);
  const [svDate, setSvDate] = useState("");
  const [svFeedback, setSvFeedback] = useState("");
  const [svFamily, setSvFamily] = useState("");
  const [bkUnit, setBkUnit] = useState("");
  const [bkAmount, setBkAmount] = useState("");
  const [tentativeWalkthroughDateInput, setTentativeWalkthroughDateInput] = useState("");
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editUserForm, setEditUserForm] = useState(null);
  const [statusEditLeadId, setStatusEditLeadId] = useState(null);
  const [projectEditLeadId, setProjectEditLeadId] = useState(null);
  const [selectedWhatsappTemplateId, setSelectedWhatsappTemplateId] = useState("");
  const [isLeadEditMode, setIsLeadEditMode] = useState(false);
  const [isLeadUpdateSaving, setIsLeadUpdateSaving] = useState(false);
  const [leadEditDraft, setLeadEditDraft] = useState({ status:"", assignedTo:"Unassigned", project:"", source:"", phone:"", altPhone:"", prospectStatus:"Warm", statusEventDate:"", statusEventRemark:"" });
  const [leadStatusEventPopup, setLeadStatusEventPopup] = useState({ isOpen:false, status:"", previousStatus:"", date:"", event:"" });
  const [newWhatsappTemplateForm, setNewWhatsappTemplateForm] = useState({ project:"All", title:"", message:"", imageUrl:"", imageDataUrl:"" });
  const allowBrowserExitRef = useRef(false);
  const notifiedAlertsRef = useRef(new Set());

  useEffect(() => {
    if (!selectedLead) return;
    const latestLead = leads.find(l => l.id === selectedLead.id);
    if (latestLead && latestLead !== selectedLead) setSelectedLead(latestLead);
  }, [leads, selectedLead]);

  useEffect(() => {
    if (!selectedLead) {
      setIsLeadEditMode(false);
      setLeadEditDraft({ status:"", assignedTo:"Unassigned", project:"", source:"", phone:"", altPhone:"", prospectStatus:"Warm", statusEventDate:"", statusEventRemark:"" });
      setLeadStatusEventPopup({ isOpen:false, status:"", previousStatus:"", date:"", event:"" });
      return;
    }
    setIsLeadEditMode(false);
    setLeadEditDraft({
      status: selectedLead.status || "New",
      assignedTo: selectedLead.assignedTo || "Unassigned",
      project: selectedLead.project || "",
      source: selectedLead.source || "Website",
      phone: selectedLead.phone || "",
      altPhone: selectedLead.altPhone || "",
      prospectStatus: getProspectStatus(selectedLead),
      statusEventDate: "",
      statusEventRemark: "",
    });
    setLeadStatusEventPopup({ isOpen:false, status:"", previousStatus:"", date:"", event:"" });
  }, [selectedLead?.id]);

  useEffect(() => {
    setSelectedWhatsappTemplateId("");
  }, [selectedLead?.id, selectedLead?.project]);

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
    if (!currentUser) return;
    window.history.pushState({inApp:true},"");
    const h=()=>{
      if (allowBrowserExitRef.current) return;
      window.history.pushState({inApp:true},"");
      if (selectedLead) { setSelectedLead(null); return; }
      if (isMobileMenuOpen) { setIsMobileMenuOpen(false); return; }
      if(navHistory.length>0){setNavHistory(prev=>{const h=[...prev];const l=h.pop();setActiveTab(l);return h;});return;}
      setShowExitAppPopup(true);
    };
    window.addEventListener("popstate",h);
    return ()=>window.removeEventListener("popstate",h);
  }, [navHistory, currentUser, selectedLead, isMobileMenuOpen]);

  const stripPhone = (val) => { if(!val)return""; return val.toString().replace(/\s+/g,"").replace(/\D/g,""); };
  const copyToClipboard = (text) => { if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).catch(() => {}); triggerToastAlert("Copied!"); };
  const triggerToastAlert = (msg) => { setToastNotification({isVisible:true,message:msg}); setTimeout(()=>setToastNotification({isVisible:false,message:""}),3500); };
  const requestBrowserNotifications = async () => {
    if (typeof Notification === "undefined") { triggerToastAlert("Browser notifications are not supported here."); return; }
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    triggerToastAlert(permission === "granted" ? "Browser notifications enabled." : "Notifications were not enabled.");
  };
  const notifyUser = useCallback((title, body, tag) => {
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    if (!document.hidden) return;
    try { new Notification(title, { body, tag, renotify:false }); } catch {}
  }, []);

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
      forgetSession();
      setLoginError("Your login was changed by Admin. Please login again.");
    } else if (latest.name !== currentUser.name || latest.role !== currentUser.role || latest.branch !== currentUser.branch) {
      setCurrentUser(latest);
      rememberSession(latest);
    }
  }, [currentUser, nonAdminUsers, rememberSession, forgetSession]);

  const visibleProjects = useMemo(()=>{ if(!currentUser)return[]; if(currentUser.role==="Admin")return projects; return projects.filter(p=>p.branch===currentUser.branch); },[projects,currentUser]);
  const managerUsers = useMemo(()=>users.filter(u=>u.role==="Manager"&&u.active!==false),[users]);
  const currentManagerTeamIds = useMemo(()=>{
    if(!currentUser||currentUser.role!=="Manager")return[];
    return [currentUser.id, ...users.filter(u=>u.managerId===currentUser.id).map(u=>u.id)];
  },[users,currentUser]);
  const currentManagerTeamNames = useMemo(()=>{
    if(!currentUser)return[];
    if(currentUser.role!=="Manager")return[];
    return [currentUser.name, ...users.filter(u=>u.managerId===currentUser.id).map(u=>u.name)];
  },[users,currentUser]);
  const visibleUsers = useMemo(()=>{
    if(!currentUser)return[];
    if(currentUser.role==="Admin")return users;
    if(currentUser.role==="Manager")return users.filter(u=>currentManagerTeamIds.includes(u.id)||currentManagerTeamNames.includes(u.name));
    return users.filter(u=>u.id===currentUser.id||u.name===currentUser.name);
  },[users,currentUser,currentManagerTeamIds,currentManagerTeamNames]);
  const assignableUsers = useMemo(()=>visibleUsers.filter(u=>["Manager","Executive","Telecaller"].includes(u.role)&&u.active),[visibleUsers]);
  const selectedLeadWhatsappTemplates = useMemo(()=>{
    if(!selectedLead)return[];
    const leadProjectKey = normaliseProjectKey(selectedLead.project);
    const matches = whatsappTemplates.filter(t=>{
      const templateProjectKey = normaliseProjectKey(t.project || "All");
      return templateProjectKey === "all" || templateProjectKey === leadProjectKey;
    });
    return matches.length ? matches : whatsappTemplates;
  },[whatsappTemplates,selectedLead]);
  const isAssignedToCurrentUser = useCallback((lead) => {
    if (!currentUser || !lead) return false;
    return lead.assignedToId === currentUser.id || lead.assignedTo === currentUser.name || lead.assignedTo === currentUser.email;
  }, [currentUser]);
  const isLeadInCurrentManagerScope = useCallback((lead) => {
    if (!currentUser || currentUser.role !== "Manager" || !lead) return false;
    const assignedToTeam = currentManagerTeamIds.includes(lead.assignedToId) || currentManagerTeamNames.includes(lead.assignedTo);
    const capturedByTeam = (lead.history || []).some(h => currentManagerTeamNames.includes(h.by) && /lead captured|imported/i.test(h.action || ""));
    const isUnassigned = !lead.assignedTo || lead.assignedTo === "Unassigned";
    return assignedToTeam || (isUnassigned && capturedByTeam);
  }, [currentUser, currentManagerTeamIds, currentManagerTeamNames]);

  useEffect(() => {
    if (!visibleProjects.length) return;
    setNewLeadForm(prev => prev.project ? prev : { ...prev, project: visibleProjects[0].name });
    setNewActivityForm(prev => prev.project ? prev : { ...prev, project: visibleProjects[0].name });
  }, [visibleProjects]);

  const processedLeads = useMemo(()=>{
    if(!currentUser)return[];
    let result=leads;
    if(currentUser.role==="Manager")result=leads.filter(isLeadInCurrentManagerScope);
    else if(["Executive","Telecaller"].includes(currentUser.role))result=leads.filter(isAssignedToCurrentUser);
    if(globalSearch.trim()){const t=globalSearch.toLowerCase();result=result.filter(l=>l.name.toLowerCase().includes(t)||l.phone.includes(t)||l.project.toLowerCase().includes(t)||l.status.toLowerCase().includes(t));}
    if(filterSource!=="All")result=result.filter(l=>l.source===filterSource);
    if(filterStatus!=="All")result=result.filter(l=>l.status===filterStatus);
    if(filterProject!=="All")result=result.filter(l=>l.project===filterProject);
    if(["Admin","Manager"].includes(currentUser.role)&&filterExecutive!=="All")result=result.filter(l=>l.assignedTo===filterExecutive);
    if(startDate)result=result.filter(l=>l.dateCreated>=startDate);
    if(endDate)result=result.filter(l=>l.dateCreated<=endDate);
    return result;
  },[leads,currentUser,isAssignedToCurrentUser,isLeadInCurrentManagerScope,globalSearch,filterSource,filterStatus,filterProject,filterExecutive,startDate,endDate]);

  const systemActivityLogs = useMemo(()=>{
    const classify = (action = "") => {
      const text = action.toLowerCase();
      const empty = { callsMade:0, followup:0, siteVisit:0, siteVisitPlanned:0, siteVisitDone:0, booking:0, registration:0, cancellation:0, collection:0 };
      const siteVisitMeta = () => {
        const done = text.includes("completed") || text.includes("done") || text.includes("feedback") || text.includes("family:");
        const planned = !done || text.includes("planned") || text.includes("date set") || text.includes("tentative");
        return { siteVisit: (planned ? 1 : 0) + (done ? 1 : 0), siteVisitPlanned: planned ? 1 : 0, siteVisitDone: done ? 1 : 0 };
      };
      if (text.includes("mobile call")) {
        const followup = text.includes("outcome: follow-up") || text.includes("outcome: negotiation") ? 1 : 0;
        const siteVisitDone = text.includes("outcome: site visit completed") || text.includes("outcome: site visit done");
        const siteVisitPlanned = text.includes("outcome: site visit") && !siteVisitDone ? 1 : 0;
        const siteVisit = siteVisitPlanned + (siteVisitDone ? 1 : 0);
        const booking = text.includes("outcome: booking") || text.includes("outcome: booked") ? 1 : 0;
        return { type:"Call", callStatus:"Call", ...empty, callsMade:1, followup, siteVisit, siteVisitPlanned, siteVisitDone: siteVisitDone ? 1 : 0, booking };
      }
      if (text.includes("contacted")) return { type:"Contacted", callStatus:"Contacted", ...empty, callsMade:1 };
      if (text.includes("follow-up") || text.includes("follow up")) return { type:"Follow-Up", callStatus:"Follow-Up", ...empty, callsMade:1, followup:1 };
      if (text.includes("negotiation")) return { type:"Negotiation", callStatus:"Negotiation", ...empty, callsMade:1, followup:1 };
      if (text.includes("rnr") || text.includes("switched off") || text.includes("wrong number") || text.includes("not interested")) return { type:"Unreachable", callStatus:"Unreachable", ...empty, callsMade:1 };
      if (text.includes("site visit")) return { type:"Site Visit", callStatus:"Site Visit", ...empty, ...siteVisitMeta() };
      if (text.includes("booking")) return { type:"Booking", callStatus:"Booking", ...empty, booking:1 };
      if (text.includes("registration")) return { type:"Registration", callStatus:"Registration", ...empty, registration:1 };
      if (text.includes("cancel")) return { type:"Cancellation", callStatus:"Cancellation", ...empty, cancellation:1 };
      if (text.includes("assigned")) return { type:"Assignment", callStatus:"Assigned", ...empty };
      if (text.includes("lead captured") || text.includes("imported")) return { type:"Lead", callStatus:"Lead", ...empty };
      return { type:"Update", callStatus:"Update", ...empty };
    };
    return leads.flatMap(lead => (lead.history || []).map((h, index) => {
      const meta = classify(h.action);
      return {
        id: `${lead.id}-${index}-${h.date}`,
        leadId: lead.id,
        date: h.date || lead.dateCreated || TODAY_STR,
        time: h.time || lead.dateCreatedTime || "",
        timestamp: h.timestamp || "",
        executive: h.by || lead.assignedTo || "System",
        project: lead.project || "",
        source: lead.source || "",
        leadName: lead.name || "",
        phone: lead.phone || "",
        remark: h.action || "",
        ...meta,
      };
    }));
  }, [leads, TODAY_STR]);

  const filteredActivityLogs = useMemo(()=>{
    let logs=systemActivityLogs;
    if(currentUser&&!["Admin","Manager"].includes(currentUser.role))logs=logs.filter(l=>l.executive===currentUser.name);
    if(currentUser?.role==="Manager")logs=logs.filter(l=>currentManagerTeamNames.includes(l.executive));
    if(actFilterExec!=="All")logs=logs.filter(l=>l.executive===actFilterExec);
    if(actFilterProject!=="All")logs=logs.filter(l=>l.project===actFilterProject);
    if(actFilterSource!=="All")logs=logs.filter(l=>l.source===actFilterSource);
    if(actFilterStatus!=="All")logs=logs.filter(l=>l.callStatus===actFilterStatus);
    if(actStartDate)logs=logs.filter(l=>l.date>=actStartDate);
    if(actEndDate)logs=logs.filter(l=>l.date<=actEndDate);
    if(activitySearch.trim()){const t=activitySearch.toLowerCase();logs=logs.filter(l=>(l.leadName||"").toLowerCase().includes(t)||(l.phone||"").includes(t)||(l.executive||"").toLowerCase().includes(t)||(l.project||"").toLowerCase().includes(t)||(l.remark||"").toLowerCase().includes(t));}
    return [...logs].sort((a,b)=>(`${b.date || ""} ${b.time || ""}`).localeCompare(`${a.date || ""} ${a.time || ""}`));
  },[systemActivityLogs,currentUser,currentManagerTeamNames,actFilterExec,actFilterProject,actFilterSource,actFilterStatus,actStartDate,actEndDate,activitySearch]);

  const customerActivityRows = useMemo(()=>{
    const map = new Map();
    filteredActivityLogs.forEach(log => {
      const key = log.leadId || stripPhone(log.phone) || log.leadName || log.id;
      const current = map.get(key) || {
        id: key,
        leadId: log.leadId,
        lastContactedDate: log.date,
        lastContactedTime: log.time || "",
        executive: log.executive,
        leadName: log.leadName,
        phone: log.phone,
        project: log.project,
        source: log.source,
        callsMade: 0,
        followup: 0,
        siteVisit: 0,
        siteVisitPlanned: 0,
        siteVisitDone: 0,
        booking: 0,
        registration: 0,
        cancellation: 0,
        collection: 0,
        lastRemark: "",
      };
      current.callsMade += log.callsMade || 0;
      current.followup += log.followup || 0;
      current.siteVisit += log.siteVisit || 0;
      current.siteVisitPlanned += log.siteVisitPlanned || 0;
      current.siteVisitDone += log.siteVisitDone || 0;
      current.booking += log.booking || 0;
      current.registration += log.registration || 0;
      current.cancellation += log.cancellation || 0;
      current.collection += log.collection || 0;
      if ((`${log.date || ""} ${log.time || ""}`) >= (`${current.lastContactedDate || ""} ${current.lastContactedTime || ""}`)) {
        current.lastContactedDate = log.date;
        current.lastContactedTime = log.time || "";
        current.lastRemark = log.remark || "";
        current.executive = log.executive || current.executive;
        current.project = log.project || current.project;
        current.source = log.source || current.source;
      }
      map.set(key, current);
    });
    return Array.from(map.values()).sort((a,b)=>(`${b.lastContactedDate||""} ${b.lastContactedTime||""}`).localeCompare(`${a.lastContactedDate||""} ${a.lastContactedTime||""}`));
  },[filteredActivityLogs]);

  const monthStartDate = `${TODAY_STR.slice(0,7)}-01`;
  const isDateInRange = useCallback((date, start, end) => {
    if (!date) return false;
    if (start && date < start) return false;
    if (end && date > end) return false;
    return true;
  }, []);

  const reportScopedActivityLogs = useMemo(()=>{
    let logs = systemActivityLogs;
    if(currentUser&&!["Admin","Manager"].includes(currentUser.role))logs=logs.filter(l=>l.executive===currentUser.name);
    if(currentUser?.role==="Manager")logs=logs.filter(l=>currentManagerTeamNames.includes(l.executive));
    return logs;
  },[systemActivityLogs,currentUser,currentManagerTeamNames]);

  const reportScopedLeads = useMemo(()=>{
    if(!currentUser)return[];
    if(currentUser.role==="Admin")return leads;
    if(currentUser.role==="Manager")return leads.filter(isLeadInCurrentManagerScope);
    return leads.filter(isAssignedToCurrentUser);
  },[leads,currentUser,isAssignedToCurrentUser,isLeadInCurrentManagerScope]);

  const reportPeopleUsers = useMemo(()=>{
    if(!currentUser)return[];
    if(currentUser.role==="Admin")return visibleUsers;
    if(currentUser.role==="Manager")return users.filter(u=>currentManagerTeamNames.includes(u.name));
    return users.filter(u=>u.name===currentUser.name);
  },[currentUser,visibleUsers,users,currentManagerTeamNames]);

  const summarizePeopleActivity = useCallback((logs)=>{
    const map = {};
    reportPeopleUsers.filter(u=>["Manager","Executive","Telecaller"].includes(u.role)).forEach(u=>{
      map[u.name]={name:u.name,role:u.role,calls:0,followup:0,siteVisit:0,siteVisitPlanned:0,siteVisitDone:0,booking:0,registration:0,cancellation:0,productivity:0};
    });
    logs.forEach(l=>{
      const name = l.executive || "System";
      if(!map[name])map[name]={name,role:reportPeopleUsers.find(u=>u.name===name)?.role||"User",calls:0,followup:0,siteVisit:0,siteVisitPlanned:0,siteVisitDone:0,booking:0,registration:0,cancellation:0,productivity:0};
      map[name].calls += l.callsMade || 0;
      map[name].followup += l.followup || 0;
      map[name].siteVisit += l.siteVisit || 0;
      map[name].siteVisitPlanned += l.siteVisitPlanned || 0;
      map[name].siteVisitDone += l.siteVisitDone || 0;
      map[name].booking += l.booking || 0;
      map[name].registration += l.registration || 0;
      map[name].cancellation += l.cancellation || 0;
    });
    return Object.values(map).map(row=>({...row,productivity:calculateBookingProductivity(row.booking,row.calls)})).sort((a,b)=>a.name.localeCompare(b.name));
  },[reportPeopleUsers]);

  const todayPeopleActivitySummary = useMemo(()=>summarizePeopleActivity(reportScopedActivityLogs.filter(l=>l.date===TODAY_STR)),[summarizePeopleActivity,reportScopedActivityLogs,TODAY_STR]);
  const monthPeopleActivitySummary = useMemo(()=>summarizePeopleActivity(reportScopedActivityLogs.filter(l=>isDateInRange(l.date,monthStartDate,TODAY_STR))),[summarizePeopleActivity,reportScopedActivityLogs,isDateInRange,monthStartDate,TODAY_STR]);
  const rangePeopleActivitySummary = useMemo(()=>summarizePeopleActivity(reportScopedActivityLogs.filter(l=>isDateInRange(l.date,reportStartDate,reportEndDate))),[summarizePeopleActivity,reportScopedActivityLogs,isDateInRange,reportStartDate,reportEndDate]);

  const summarizeSourceReport = useCallback((start, end)=>{
    const map = {};
    const ensure = (source) => {
      const key = source || "Unknown";
      if(!map[key])map[key]={source:key,enquirySet:new Set(),siteVisitPlannedSet:new Set(),siteVisitDoneSet:new Set(),bookingSet:new Set(),conversionSet:new Set(),cancellationSet:new Set()};
      return map[key];
    };
    reportScopedLeads.forEach(lead=>{
      if(isDateInRange(lead.dateCreated,start,end))ensure(lead.source).enquirySet.add(lead.id);
    });
    reportScopedActivityLogs.forEach(log=>{
      if(!isDateInRange(log.date,start,end))return;
      const row = ensure(log.source);
      if(log.siteVisitPlanned)row.siteVisitPlannedSet.add(log.leadId || `${log.phone}-${log.leadName}`);
      if(log.siteVisitDone)row.siteVisitDoneSet.add(log.leadId || `${log.phone}-${log.leadName}`);
      if(log.booking)row.bookingSet.add(log.leadId || `${log.phone}-${log.leadName}`);
      if(log.booking || log.registration)row.conversionSet.add(log.leadId || `${log.phone}-${log.leadName}`);
      if(log.cancellation)row.cancellationSet.add(log.leadId || `${log.phone}-${log.leadName}`);
    });
    return Object.values(map).map(row=>{
      const enquiry = row.enquirySet.size;
      const siteVisitPlanned = row.siteVisitPlannedSet.size;
      const siteVisitDone = row.siteVisitDoneSet.size;
      const booking = row.bookingSet.size;
      const conversion = row.conversionSet.size;
      const cancellation = row.cancellationSet.size;
      return { source:row.source, enquiry, siteVisitPlanned, siteVisitDone, siteVisit:siteVisitPlanned+siteVisitDone, booking, conversion, cancellation, percentage: enquiry ? ((conversion/enquiry)*100).toFixed(1) : "0.0" };
    }).sort((a,b)=>b.enquiry-a.enquiry || b.conversion-a.conversion);
  },[reportScopedLeads,reportScopedActivityLogs,isDateInRange]);

  const todaySourceReport = useMemo(()=>summarizeSourceReport(TODAY_STR,TODAY_STR),[summarizeSourceReport,TODAY_STR]);
  const monthSourceReport = useMemo(()=>summarizeSourceReport(monthStartDate,TODAY_STR),[summarizeSourceReport,monthStartDate,TODAY_STR]);
  const rangeSourceReport = useMemo(()=>summarizeSourceReport(reportStartDate,reportEndDate),[summarizeSourceReport,reportStartDate,reportEndDate]);

  const rangeProjectReport = useMemo(()=>{
    const map = {};
    const ensure = (project) => {
      const key = project || "Unknown";
      if(!map[key])map[key]={project:key,enquirySet:new Set(),siteVisitPlannedSet:new Set(),siteVisitDoneSet:new Set(),bookingSet:new Set(),conversionSet:new Set(),cancellationSet:new Set()};
      return map[key];
    };
    reportScopedLeads.forEach(lead=>{ if(isDateInRange(lead.dateCreated,reportStartDate,reportEndDate))ensure(lead.project).enquirySet.add(lead.id); });
    reportScopedActivityLogs.forEach(log=>{
      if(!isDateInRange(log.date,reportStartDate,reportEndDate))return;
      const row=ensure(log.project);
      const id=log.leadId || `${log.phone}-${log.leadName}`;
      if(log.siteVisitPlanned)row.siteVisitPlannedSet.add(id);
      if(log.siteVisitDone)row.siteVisitDoneSet.add(id);
      if(log.booking)row.bookingSet.add(id);
      if(log.booking || log.registration)row.conversionSet.add(id);
      if(log.cancellation)row.cancellationSet.add(id);
    });
    return Object.values(map).map(row=>{
      const enquiry=row.enquirySet.size, siteVisitPlanned=row.siteVisitPlannedSet.size, siteVisitDone=row.siteVisitDoneSet.size, booking=row.bookingSet.size, conversion=row.conversionSet.size, cancellation=row.cancellationSet.size;
      return { project:row.project,enquiry,siteVisitPlanned,siteVisitDone,siteVisit:siteVisitPlanned+siteVisitDone,booking,conversion,cancellation,percentage:enquiry?((conversion/enquiry)*100).toFixed(1):"0.0" };
    }).sort((a,b)=>b.enquiry-a.enquiry || b.conversion-a.conversion);
  },[reportScopedLeads,reportScopedActivityLogs,isDateInRange,reportStartDate,reportEndDate]);

  const rangeSourceProjectReport = useMemo(()=>{
    const map = {};
    reportScopedLeads.forEach(lead=>{
      if(!isDateInRange(lead.dateCreated,reportStartDate,reportEndDate))return;
      const key=`${lead.source||"Unknown"}|${lead.project||"Unknown"}`;
      if(!map[key])map[key]={source:lead.source||"Unknown",project:lead.project||"Unknown",enquirySet:new Set(),siteVisitPlannedSet:new Set(),siteVisitDoneSet:new Set(),bookingSet:new Set(),conversionSet:new Set(),cancellationSet:new Set()};
      map[key].enquirySet.add(lead.id);
    });
    reportScopedActivityLogs.forEach(log=>{
      if(!isDateInRange(log.date,reportStartDate,reportEndDate))return;
      const key=`${log.source||"Unknown"}|${log.project||"Unknown"}`;
      if(!map[key])map[key]={source:log.source||"Unknown",project:log.project||"Unknown",enquirySet:new Set(),siteVisitPlannedSet:new Set(),siteVisitDoneSet:new Set(),bookingSet:new Set(),conversionSet:new Set(),cancellationSet:new Set()};
      const id=log.leadId || `${log.phone}-${log.leadName}`;
      if(log.siteVisitPlanned)map[key].siteVisitPlannedSet.add(id);
      if(log.siteVisitDone)map[key].siteVisitDoneSet.add(id);
      if(log.booking)map[key].bookingSet.add(id);
      if(log.booking || log.registration)map[key].conversionSet.add(id);
      if(log.cancellation)map[key].cancellationSet.add(id);
    });
    return Object.values(map).map(row=>{
      const enquiry=row.enquirySet.size, siteVisitPlanned=row.siteVisitPlannedSet.size, siteVisitDone=row.siteVisitDoneSet.size, booking=row.bookingSet.size, conversion=row.conversionSet.size, cancellation=row.cancellationSet.size;
      return { source:row.source,project:row.project,enquiry,siteVisitPlanned,siteVisitDone,siteVisit:siteVisitPlanned+siteVisitDone,booking,conversion,cancellation,percentage:enquiry?((conversion/enquiry)*100).toFixed(1):"0.0" };
    }).sort((a,b)=>a.source.localeCompare(b.source)||b.enquiry-a.enquiry);
  },[reportScopedLeads,reportScopedActivityLogs,isDateInRange,reportStartDate,reportEndDate]);

  const rangeExecutiveProjectReport = useMemo(()=>{
    const map = {};
    const ensure = (executive, project) => {
      const key = `${executive || "Unassigned"}|${project || "Unknown"}`;
      if(!map[key])map[key]={executive:executive||"Unassigned",project:project||"Unknown",enquirySet:new Set(),calls:0,followup:0,siteVisitPlanned:0,siteVisitDone:0,booking:0,registration:0,cancellation:0,productivity:0};
      return map[key];
    };
    reportScopedLeads.forEach(lead=>{
      if(!isDateInRange(lead.dateCreated,reportStartDate,reportEndDate))return;
      ensure(lead.assignedTo||"Unassigned", lead.project).enquirySet.add(lead.id);
    });
    reportScopedActivityLogs.forEach(log=>{
      if(!isDateInRange(log.date,reportStartDate,reportEndDate))return;
      const row=ensure(log.executive, log.project);
      row.calls += log.callsMade || 0;
      row.followup += log.followup || 0;
      row.siteVisitPlanned += log.siteVisitPlanned || 0;
      row.siteVisitDone += log.siteVisitDone || 0;
      row.booking += log.booking || 0;
      row.registration += log.registration || 0;
      row.cancellation += log.cancellation || 0;
    });
    return Object.values(map).map(row=>({...row,enquiry:row.enquirySet.size,productivity:calculateBookingProductivity(row.booking,row.calls)})).sort((a,b)=>a.executive.localeCompare(b.executive)||a.project.localeCompare(b.project));
  },[reportScopedLeads,reportScopedActivityLogs,isDateInRange,reportStartDate,reportEndDate]);

  const rangeExecutiveSourceReport = useMemo(()=>{
    const map = {};
    const ensure = (executive, source) => {
      const key = `${executive || "Unassigned"}|${source || "Unknown"}`;
      if(!map[key])map[key]={executive:executive||"Unassigned",source:source||"Unknown",enquirySet:new Set(),calls:0,followup:0,siteVisitPlanned:0,siteVisitDone:0,booking:0,registration:0,cancellation:0,productivity:0};
      return map[key];
    };
    reportScopedLeads.forEach(lead=>{
      if(!isDateInRange(lead.dateCreated,reportStartDate,reportEndDate))return;
      ensure(lead.assignedTo||"Unassigned", lead.source).enquirySet.add(lead.id);
    });
    reportScopedActivityLogs.forEach(log=>{
      if(!isDateInRange(log.date,reportStartDate,reportEndDate))return;
      const row=ensure(log.executive, log.source);
      row.calls += log.callsMade || 0;
      row.followup += log.followup || 0;
      row.siteVisitPlanned += log.siteVisitPlanned || 0;
      row.siteVisitDone += log.siteVisitDone || 0;
      row.booking += log.booking || 0;
      row.registration += log.registration || 0;
      row.cancellation += log.cancellation || 0;
    });
    return Object.values(map).map(row=>({...row,enquiry:row.enquirySet.size,productivity:calculateBookingProductivity(row.booking,row.calls)})).sort((a,b)=>a.executive.localeCompare(b.executive)||a.source.localeCompare(b.source));
  },[reportScopedLeads,reportScopedActivityLogs,isDateInRange,reportStartDate,reportEndDate]);

  const buildReportCustomerDetails = useCallback((leadMatcher, logMatcher) => {
    const detailMap = new Map();
    const addLead = (lead) => {
      if (!lead) return;
      detailMap.set(`lead-${lead.id}`, { lead, logs: [] });
    };
    reportScopedLeads.forEach(lead => {
      if (isDateInRange(lead.dateCreated, reportStartDate, reportEndDate) && leadMatcher(lead)) addLead(lead);
    });
    reportScopedActivityLogs.forEach(log => {
      if (!isDateInRange(log.date, reportStartDate, reportEndDate) || !logMatcher(log)) return;
      const matchedLead = reportScopedLeads.find(lead => lead.id === log.leadId) || reportScopedLeads.find(lead => stripPhone(lead.phone) === stripPhone(log.phone));
      if (matchedLead) {
        const key = `lead-${matchedLead.id}`;
        if (!detailMap.has(key)) detailMap.set(key, { lead: matchedLead, logs: [] });
        detailMap.get(key).logs.push(log);
      } else {
        const key = `log-${log.leadId || log.phone || log.id}`;
        const fallbackLead = { id:key, name:log.leadName || "Customer", phone:log.phone || "", project:log.project || "", source:log.source || "", assignedTo:log.executive || "Unassigned", status:log.callStatus || "Activity", dateCreated:log.date, dateCreatedTime:log.time, nextFollowUp:"" };
        if (!detailMap.has(key)) detailMap.set(key, { lead:fallbackLead, logs: [] });
        detailMap.get(key).logs.push(log);
      }
    });
    return Array.from(detailMap.values()).map(({ lead, logs }) => {
      const sortedLogs = [...logs].sort((a,b)=>(`${b.date||""} ${b.time||""}`).localeCompare(`${a.date||""} ${a.time||""}`));
      const lastLog = sortedLogs[0];
      return {
        id: lead.id,
        hasLeadRecord: !String(lead.id).startsWith("log-"),
        name: lead.name || "Customer",
        phone: lead.phone || "",
        project: lead.project || "",
        source: lead.source || "",
        owner: lead.assignedTo || "Unassigned",
        status: lead.status || "Activity",
        enquiryDate: formatDateTimeLabel(lead) || "-",
        followUp: lead.nextFollowUp && lead.nextFollowUp !== "None" ? lead.nextFollowUp : "-",
        lastActivity: lastLog ? formatDateTimeLabel({date:lastLog.date,time:lastLog.time}) : "-",
        remark: lastLog?.remark || lead.notes || "-",
      };
    }).sort((a,b)=>a.name.localeCompare(b.name));
  }, [reportScopedLeads, reportScopedActivityLogs, isDateInRange, reportStartDate, reportEndDate]);

  const dashboardActivityLogs = useMemo(()=>{
    let logs=systemActivityLogs;
    if(currentUser&&!["Admin","Manager"].includes(currentUser.role))logs=logs.filter(l=>l.executive===currentUser.name);
    if(currentUser?.role==="Manager")logs=logs.filter(l=>currentManagerTeamNames.includes(l.executive));
    const visibleLeadIds = new Set(processedLeads.map(l => l.id));
    return logs.filter(l=>l.date===TODAY_STR && visibleLeadIds.has(l.leadId));
  },[systemActivityLogs,currentUser,currentManagerTeamNames,TODAY_STR,processedLeads]);

  const activityKPIs = useMemo(()=>{
    const totalFollowups=dashboardActivityLogs.reduce((s,l)=>s+(l.followup||0),0);
    const callAttemptsByLead = new Map();
    dashboardActivityLogs.forEach(log => {
      if (!(log.callsMade || 0)) return;
      const key = log.leadId || stripPhone(log.phone) || log.leadName || log.id;
      callAttemptsByLead.set(key, (callAttemptsByLead.get(key) || 0) + (log.callsMade || 0));
    });
    const totalCalls = callAttemptsByLead.size;
    const totalFollowupCalls = Array.from(callAttemptsByLead.values()).reduce((sum, count) => sum + Math.max(0, count - 1), 0);
    const totalSiteVisitPlanned=dashboardActivityLogs.reduce((s,l)=>s+(l.siteVisitPlanned||0),0);
    const totalSiteVisitDone=dashboardActivityLogs.reduce((s,l)=>s+(l.siteVisitDone||0),0);
    const totalSiteVisits=totalSiteVisitPlanned+totalSiteVisitDone;
    const totalBookings=dashboardActivityLogs.reduce((s,l)=>s+(l.booking||0),0);
    const totalRegistrations=dashboardActivityLogs.reduce((s,l)=>s+(l.registration||0),0);
    const totalCancellations=dashboardActivityLogs.reduce((s,l)=>s+(l.cancellation||0),0);
    const totalCollection=dashboardActivityLogs.reduce((s,l)=>s+(l.collection||0),0);
    const convRate=totalCalls>0?((totalBookings/totalCalls)*100).toFixed(1):0;
    return{totalCalls,totalFollowups,totalFollowupCalls,totalSiteVisitPlanned,totalSiteVisitDone,totalSiteVisits,totalBookings,totalRegistrations,totalCancellations,totalCollection,convRate};
  },[dashboardActivityLogs]);

  const prospectStatusSummary = useMemo(()=>PROSPECT_STATUSES.map(status => ({
    status,
    count: processedLeads.filter(lead => getProspectStatus(lead) === status).length,
    leads: processedLeads.filter(lead => getProspectStatus(lead) === status),
  })), [processedLeads]);
  const inactiveLeadStatuses = ["Not Interested","RNR","Switched Off","Wrong Number"];
  const activeScopedLeadCount = useMemo(()=>processedLeads.filter(lead => !inactiveLeadStatuses.includes(lead.status)).length, [processedLeads]);
  const inactiveScopedLeadCount = useMemo(()=>processedLeads.filter(lead => inactiveLeadStatuses.includes(lead.status)).length, [processedLeads]);

  const callsTrendData = useMemo(()=>{ const map={}; filteredActivityLogs.forEach(l=>{if(!map[l.date])map[l.date]={date:l.date,calls:0,followups:0,siteVisitPlanned:0,siteVisitDone:0,siteVisits:0,bookings:0};map[l.date].calls+=l.callsMade||0;map[l.date].followups+=l.followup||0;map[l.date].siteVisitPlanned+=l.siteVisitPlanned||0;map[l.date].siteVisitDone+=l.siteVisitDone||0;map[l.date].siteVisits+=l.siteVisit||0;map[l.date].bookings+=l.booking||0;}); return Object.values(map).sort((a,b)=>a.date.localeCompare(b.date)); },[filteredActivityLogs]);
  const projectPerfData = useMemo(()=>{ const map={}; filteredActivityLogs.forEach(l=>{if(!map[l.project])map[l.project]={project:l.project,calls:0,followups:0,siteVisitPlanned:0,siteVisitDone:0,siteVisits:0,bookings:0};map[l.project].calls+=l.callsMade||0;map[l.project].followups+=l.followup||0;map[l.project].siteVisitPlanned+=l.siteVisitPlanned||0;map[l.project].siteVisitDone+=l.siteVisitDone||0;map[l.project].siteVisits+=l.siteVisit||0;map[l.project].bookings+=l.booking||0;}); return Object.values(map).sort((a,b)=>b.calls-a.calls); },[filteredActivityLogs]);
  const sourcewisePieData = useMemo(()=>{ const map={}; filteredActivityLogs.forEach(l=>{if(!map[l.source])map[l.source]=0;map[l.source]+=l.callsMade||0;}); return Object.entries(map).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value); },[filteredActivityLogs]);
  const execPerfChartData = useMemo(()=>{ const map={}; filteredActivityLogs.forEach(l=>{if(!map[l.executive])map[l.executive]={name:l.executive,calls:0,followups:0,siteVisitPlanned:0,siteVisitDone:0,siteVisits:0,bookings:0};map[l.executive].calls+=l.callsMade||0;map[l.executive].followups+=l.followup||0;map[l.executive].siteVisitPlanned+=l.siteVisitPlanned||0;map[l.executive].siteVisitDone+=l.siteVisitDone||0;map[l.executive].siteVisits+=l.siteVisit||0;map[l.executive].bookings+=l.booking||0;}); return Object.values(map).sort((a,b)=>b.calls-a.calls); },[filteredActivityLogs]);
  const execDetailedMatrix = useMemo(()=>{ const map={}; filteredActivityLogs.forEach(l=>{if(!map[l.executive])map[l.executive]={name:l.executive,calls:0,followups:0,siteVisitPlanned:0,siteVisitDone:0,siteVisits:0,bookings:0,registrations:0,cancellations:0,collection:0};map[l.executive].calls+=l.callsMade||0;map[l.executive].followups+=l.followup||0;map[l.executive].siteVisitPlanned+=l.siteVisitPlanned||0;map[l.executive].siteVisitDone+=l.siteVisitDone||0;map[l.executive].siteVisits+=l.siteVisit||0;map[l.executive].bookings+=l.booking||0;map[l.executive].registrations+=l.registration||0;map[l.executive].cancellations+=l.cancellation||0;map[l.executive].collection+=l.collection||0;}); return Object.values(map).sort((a,b)=>b.calls-a.calls); },[filteredActivityLogs]);

  const reportSummaryMatrix = useMemo(()=>{
    const projectNames=[...new Set(filteredActivityLogs.map(l=>l.project))].sort();
    const metrics=["Calls made","Followup","Site Visit Planned","Site Visit Done","Booking","Registration","Cancellation"];
    const data={};metrics.forEach(m=>{data[m]={};projectNames.forEach(p=>{data[m][p]=0;});});
    filteredActivityLogs.forEach(l=>{ data["Calls made"][l.project]=(data["Calls made"][l.project]||0)+(l.callsMade||0); data["Followup"][l.project]=(data["Followup"][l.project]||0)+(l.followup||0); data["Site Visit Planned"][l.project]=(data["Site Visit Planned"][l.project]||0)+(l.siteVisitPlanned||0); data["Site Visit Done"][l.project]=(data["Site Visit Done"][l.project]||0)+(l.siteVisitDone||0); data["Booking"][l.project]=(data["Booking"][l.project]||0)+(l.booking||0); data["Registration"][l.project]=(data["Registration"][l.project]||0)+(l.registration||0); data["Cancellation"][l.project]=(data["Cancellation"][l.project]||0)+(l.cancellation||0); });
    return{metrics,projectNames,data};
  },[filteredActivityLogs]);

  const sourcewiseMatrix = useMemo(()=>{ const execNames=[...new Set(filteredActivityLogs.map(l=>l.executive))].sort(); const srcNames=[...new Set(filteredActivityLogs.map(l=>l.source))].sort(); const data={}; srcNames.forEach(s=>{data[s]={};execNames.forEach(e=>{data[s][e]=0;})}); let srcTotals={}; filteredActivityLogs.forEach(l=>{if(data[l.source])data[l.source][l.executive]=(data[l.source][l.executive]||0)+(l.callsMade||0);srcTotals[l.source]=(srcTotals[l.source]||0)+(l.callsMade||0);}); return{execNames,srcNames,data,srcTotals}; },[filteredActivityLogs]);
  const projectwiseMatrix = useMemo(()=>{ const execNames=[...new Set(filteredActivityLogs.map(l=>l.executive))].sort(); const projNames=[...new Set(filteredActivityLogs.map(l=>l.project))].sort(); const data={}; projNames.forEach(p=>{data[p]={};execNames.forEach(e=>{data[p][e]=0;})}); let projTotals={}; filteredActivityLogs.forEach(l=>{if(data[l.project])data[l.project][l.executive]=(data[l.project][l.executive]||0)+(l.callsMade||0);projTotals[l.project]=(projTotals[l.project]||0)+(l.callsMade||0);}); return{execNames,projNames,data,projTotals}; },[filteredActivityLogs]);

  const dashboardActionQueueLeads = useMemo(()=>{
    if(!currentUser)return[];
    const followUpReminderStatuses = ["Contacted","Follow-Up","Negotiation","RNR","Switched Off"];
    const isImmediateAction = (lead) => (
      lead.assignedTo === "Unassigned" ||
      isFreshLead(lead) ||
      (followUpReminderStatuses.includes(lead.status) && lead.nextFollowUp === TODAY_STR) ||
      (lead.status === "Site Visit Planned" && lead.siteVisitTentativeDate === TODAY_STR)
    );
    if(currentUser.role==="Admin")return leads.filter(isImmediateAction);
    if(currentUser.role==="Manager")return leads.filter(l=>isLeadInCurrentManagerScope(l)&&isImmediateAction(l));
    if(["Executive","Telecaller"].includes(currentUser.role))return leads.filter(l=>isAssignedToCurrentUser(l)&&isImmediateAction(l));
    return[];
  },[leads,currentUser,isAssignedToCurrentUser,isLeadInCurrentManagerScope,TODAY_STR]);

  const newLeadDashboardItems = useMemo(()=>{
    if(!currentUser)return[];
    return processedLeads
      .filter(isFreshLead)
      .sort((a,b)=>(b.createdAt||`${b.dateCreated||""} ${b.dateCreatedTime||""}`).localeCompare(a.createdAt||`${a.dateCreated||""} ${a.dateCreatedTime||""}`));
  },[processedLeads,currentUser]);

  const priorityAssignedLeads = useMemo(() => {
    if (!currentUser || currentUser.role === "Admin") return [];
    return leads
      .filter(l => isAssignedToCurrentUser(l) && isFreshLead(l) && !dismissedAssignmentNotices.includes(`${l.id}:${l.assignedAt}`))
      .sort((a,b)=>(b.assignedAt||0)-(a.assignedAt||0));
  }, [leads, currentUser, isAssignedToCurrentUser, dismissedAssignmentNotices]);

  const dueFollowUpLeads = useMemo(() => {
    if (!currentUser) return [];
    const followUpReminderStatuses = ["Contacted","Follow-Up","Negotiation","RNR","Switched Off"];
    return processedLeads
      .filter(l => followUpReminderStatuses.includes(l.status) && l.nextFollowUp && l.nextFollowUp !== "None" && l.nextFollowUp === TODAY_STR)
      .sort((a,b)=>a.nextFollowUp.localeCompare(b.nextFollowUp));
  }, [processedLeads, currentUser, TODAY_STR]);

  const appointmentReminderLeads = useMemo(() => {
    if (!currentUser) return [];
    return processedLeads
      .filter(l => l.siteVisitTentativeDate && l.siteVisitTentativeDate === TODAY_STR && l.status === "Site Visit Planned")
      .sort((a,b)=>a.siteVisitTentativeDate.localeCompare(b.siteVisitTentativeDate));
  }, [processedLeads, currentUser, TODAY_STR]);

  const unattendedLeadAlerts = useMemo(()=>{
    if(!currentUser)return[];
    const terminalStatuses = ["Closed","Booked","Booking Confirmed","Not Interested","Wrong Number","RNR","Switched Off"];
    const today = new Date(TODAY_STR);
    return leads.filter(l=>{
      if(terminalStatuses.includes(l.status))return false;
      const ageDays = l.dateCreated ? Math.floor((today-new Date(l.dateCreated))/(1000*60*60*24)) : 0;
      const isUnattended = ["New","Assigned"].includes(l.status)&&ageDays>=1;
      if(!isUnattended)return false;
      if(currentUser.role==="Admin")return true;
      if(currentUser.role==="Manager")return isLeadInCurrentManagerScope(l);
      if(["Executive","Telecaller"].includes(currentUser.role))return isAssignedToCurrentUser(l);
      return false;
    }).sort((a,b)=>(a.nextFollowUp||a.dateCreated||"").localeCompare(b.nextFollowUp||b.dateCreated||""));
  },[leads,currentUser,isAssignedToCurrentUser,isLeadInCurrentManagerScope,TODAY_STR]);

  useEffect(() => {
    if (!currentUser || typeof Notification === "undefined" || Notification.permission !== "granted") return;
    const pushOnce = (key, title, body) => {
      if (notifiedAlertsRef.current.has(key)) return;
      notifiedAlertsRef.current.add(key);
      notifyUser(title, body, key);
    };
    priorityAssignedLeads.slice(0,3).forEach(l=>pushOnce(`assigned:${l.id}:${l.assignedAt||""}`, "New lead assigned", `${l.name} - ${l.project}`));
    dueFollowUpLeads.slice(0,3).forEach(l=>pushOnce(`followup:${l.id}:${l.nextFollowUp}`, "Follow-up reminder", `${l.name} is due for follow-up today.`));
    appointmentReminderLeads.slice(0,3).forEach(l=>pushOnce(`appointment:${l.id}:${l.siteVisitTentativeDate}`, "Appointment reminder", `${l.name} has a site visit reminder.`));
    unattendedLeadAlerts.slice(0,3).forEach(l=>pushOnce(`unattended:${l.id}:${l.nextFollowUp||l.dateCreated}`, "Unattended lead", `${l.name} needs attention.`));
  }, [currentUser, priorityAssignedLeads, dueFollowUpLeads, appointmentReminderLeads, unattendedLeadAlerts, notifyUser]);

  const conversionRate = useMemo(()=>{ const booked=processedLeads.filter(l=>["Booking Confirmed","Booked","Closed"].includes(l.status)).length; return processedLeads.length>0?Math.round((booked/processedLeads.length)*100):0; },[processedLeads]);
  const executiveSummaryData = useMemo(()=>{ const execMap={}; visibleUsers.forEach(u=>{if(["Executive","Telecaller"].includes(u.role))execMap[u.name]={name:u.name,total:0,new:0,active:0,siteVisits:0,bookings:0,dead:0};}); execMap["Unassigned"]={name:"Unassigned",total:0,new:0,active:0,siteVisits:0,bookings:0,dead:0}; processedLeads.forEach(l=>{const exec=l.assignedTo||"Unassigned";if(!execMap[exec])execMap[exec]={name:exec,total:0,new:0,active:0,siteVisits:0,bookings:0,dead:0};execMap[exec].total+=1;if(l.status==="New")execMap[exec].new+=1;else if(["Assigned","Contacted","Follow-Up","Negotiation"].includes(l.status))execMap[exec].active+=1;else if(["Site Visit Planned","Site Visit Completed"].includes(l.status))execMap[exec].siteVisits+=1;else if(["Booking Pending","Booking Confirmed","Booked","Closed"].includes(l.status))execMap[exec].bookings+=1;else if(["Not Interested","RNR","Switched Off","Wrong Number"].includes(l.status))execMap[exec].dead+=1;}); return Object.values(execMap).filter(e=>e.total>0||visibleUsers.some(u=>u.name===e.name)).sort((a,b)=>b.total-a.total); },[processedLeads,visibleUsers]);
  const sourcewiseAnalysis = useMemo(()=>{ const data={}; processedLeads.forEach(l=>{if(!data[l.source])data[l.source]={total:0};data[l.source].total+=1;}); return Object.entries(data).sort((a,b)=>b[1].total-a[1].total); },[processedLeads]);
  const projectwiseAnalysis = useMemo(()=>{ const data={}; processedLeads.forEach(l=>{if(!data[l.project])data[l.project]={total:0,converted:0};data[l.project].total+=1;if(["Booking Confirmed","Booked","Closed"].includes(l.status))data[l.project].converted+=1;}); return Object.entries(data); },[processedLeads]);

  const handlePhoneInputChange = (val, isAlt=false) => {
    const clean=stripPhone(val);
    if(isAlt){setNewLeadForm({...newLeadForm,altPhone:clean});return;}
    setNewLeadForm({...newLeadForm,phone:clean});
    if(clean.length>=10){const dup=leads.find(l=>stripPhone(l.phone)===clean);if(dup){setDuplicateConflictRecord(dup);return;}}
    setDuplicateConflictRecord(null);
  };

  const handleInlineMilestoneStatusChange = (leadId, targetStatus) => {
    const log=makeHistoryLog(currentUser.name, `Milestone shifted to [${targetStatus}].`);
    const updated=leads.map(l=>l.id===leadId?{...l,status:targetStatus,history:[log,...(l.history || [])]}:l);
    setLeads(updated);
    if(selectedLead&&selectedLead.id===leadId)setSelectedLead(prev=>({...prev,status:targetStatus,history:[log,...(prev.history || [])]}));
    triggerToastAlert(`Milestone set to ${targetStatus}`);
  };
  const handleProjectStatusChange=(projectId,targetStatus)=>{ if(currentUser?.role!=="Admin"){triggerToastAlert("Only Admin can edit projects.");return;} const updated=projects.map(p=>p.id===projectId?{...p,status:targetStatus}:p); setProjects(updated); triggerToastAlert(`Project status: ${targetStatus}`); };
  const commitTentativeWalkthroughPlan=(e)=>{ e.preventDefault(); if(!tentativeWalkthroughDateInput)return; const log=makeHistoryLog(currentUser.name, `[SITE VISIT PLANNED]: Date set to ${tentativeWalkthroughDateInput}.`); const updated=leads.map(l=>l.id===selectedLead.id?{...l,status:"Site Visit Planned",siteVisitTentativeDate:tentativeWalkthroughDateInput,history:[log,...(l.history || [])]}:l); setLeads(updated); setSelectedLead(prev=>({...prev,status:"Site Visit Planned",siteVisitTentativeDate:tentativeWalkthroughDateInput,history:[log,...(prev.history || [])]})); setTentativeWalkthroughDateInput(""); triggerToastAlert("Tentative date saved."); };

  const handleLeadStatusDropdownChange = async (leadId, targetStatus) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead || lead.status === targetStatus) {
      setStatusEditLeadId(null);
      return;
    }
    const log = makeHistoryLog(currentUser.name, `Status updated to: ${targetStatus}`);
    const updated = leads.map(l => l.id === leadId ? { ...l, status:targetStatus, history:[log, ...(l.history || [])] } : l);
    const saved = await setLeads(updated);
    if(!saved){ triggerToastAlert("Could not save status to Supabase."); return; }
    if(selectedLead?.id === leadId)setSelectedLead(prev => ({ ...prev, status:targetStatus, history:[log, ...(prev.history || [])] }));
    setStatusEditLeadId(null);
    triggerToastAlert("Status updated.");
  };

  const handleLeadProjectChange = async (leadId, projectName) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead || lead.project === projectName) {
      setProjectEditLeadId(null);
      return;
    }
    const project = projects.find(p => p.name === projectName);
    const log = makeHistoryLog(currentUser.name, `Project changed from ${lead.project || "Not set"} to ${projectName}.`);
    const updated = leads.map(l => l.id === leadId ? { ...l, project:projectName, branch:project?.branch || l.branch, history:[log, ...(l.history || [])] } : l);
    const saved = await setLeads(updated);
    if(!saved){ triggerToastAlert("Could not save project change to Supabase."); return; }
    if(selectedLead?.id === leadId)setSelectedLead(prev => ({ ...prev, project:projectName, branch:project?.branch || prev.branch, history:[log, ...(prev.history || [])] }));
    setProjectEditLeadId(null);
    setSelectedWhatsappTemplateId("");
    triggerToastAlert("Project updated.");
  };

  const startLeadDrawerEdit = () => {
    if (!selectedLead) return;
    setLeadEditDraft({
      status: getEditableLeadStatus(selectedLead.status),
      assignedTo: selectedLead.assignedTo || "Unassigned",
      project: selectedLead.project || "",
      source: selectedLead.source || "Website",
      phone: selectedLead.phone || "",
      altPhone: selectedLead.altPhone || "",
      prospectStatus: getProspectStatus(selectedLead),
      statusEventDate: "",
      statusEventRemark: "",
    });
    setIsLeadEditMode(true);
  };

  const cancelLeadDrawerEdit = () => {
    if (selectedLead) {
      setLeadEditDraft({
        status: getEditableLeadStatus(selectedLead.status),
        assignedTo: selectedLead.assignedTo || "Unassigned",
        project: selectedLead.project || "",
        source: selectedLead.source || "Website",
        phone: selectedLead.phone || "",
        altPhone: selectedLead.altPhone || "",
        prospectStatus: getProspectStatus(selectedLead),
        statusEventDate: "",
        statusEventRemark: "",
      });
    }
    setLeadStatusEventPopup({ isOpen:false, status:"", previousStatus:"", date:"", event:"" });
    setIsLeadEditMode(false);
  };

  const getDefaultEventDateForStatus = (status) => {
    if (!selectedLead) return TODAY_STR;
    if (status === "Follow-Up") return selectedLead.nextFollowUp && selectedLead.nextFollowUp !== "None" ? selectedLead.nextFollowUp : TODAY_STR;
    if (["Negotiation","RNR","Switched Off"].includes(status)) return selectedLead.nextFollowUp && selectedLead.nextFollowUp !== "None" ? selectedLead.nextFollowUp : TODAY_STR;
    if (status === "Site Visit Planned" || status === "Site Visit Completed") return selectedLead.siteVisitTentativeDate || TODAY_STR;
    if (status === "Booking Confirmed" || status === "Booking Pending" || status === "Booked") return selectedLead.bookingDate || TODAY_STR;
    return TODAY_STR;
  };

  const handleLeadDraftStatusChange = (status) => {
    const previousStatus = leadEditDraft.status || selectedLead?.status || "New";
    setLeadEditDraft(prev => ({ ...prev, status, statusEventDate:"", statusEventRemark:"" }));
    const config = getStatusEventConfig(status);
    if (config) {
      const needsDate = config.dateRequired !== false;
      setLeadStatusEventPopup({
        isOpen: true,
        status,
        previousStatus,
        date: needsDate ? getDefaultEventDateForStatus(status) : "",
        event: config.defaultEvent || "",
      });
    }
  };

  const cancelLeadStatusEventPopup = () => {
    setLeadEditDraft(prev => ({
      ...prev,
      status: leadStatusEventPopup.previousStatus || selectedLead?.status || "New",
      statusEventDate: "",
      statusEventRemark: "",
    }));
    setLeadStatusEventPopup({ isOpen:false, status:"", previousStatus:"", date:"", event:"" });
  };

  const confirmLeadStatusEventPopup = () => {
    const config = getStatusEventConfig(leadStatusEventPopup.status);
    const needsDate = config?.dateRequired !== false;
    if (config && needsDate && !leadStatusEventPopup.date) {
      triggerToastAlert("Please select the event date.");
      return;
    }
    if (config && needsDate && leadStatusEventPopup.date < TODAY_STR) {
      triggerToastAlert("Please select today or a future date.");
      return;
    }
    if (config && !leadStatusEventPopup.event.trim()) {
      triggerToastAlert("Please enter notes or remarks.");
      return;
    }
    setLeadEditDraft(prev => ({
      ...prev,
      status: leadStatusEventPopup.status,
      statusEventDate: leadStatusEventPopup.date,
      statusEventRemark: leadStatusEventPopup.event.trim() || config?.defaultEvent || "",
    }));
    setLeadStatusEventPopup({ isOpen:false, status:"", previousStatus:"", date:"", event:"" });
  };

  const commitLeadDrawerUpdate = async () => {
    if (!selectedLead || isLeadUpdateSaving) return;
    const currentLead = leads.find(l => l.id === selectedLead.id) || selectedLead;
    const targetStatus = leadEditDraft.status || currentLead.status || "New";
    const targetAssignedTo = ["Admin","Manager"].includes(currentUser.role) ? (leadEditDraft.assignedTo || "Unassigned") : (currentLead.assignedTo || "Unassigned");
    const targetProject = leadEditDraft.project || currentLead.project || "";
    const targetSource = currentUser.role === "Admin" ? (leadEditDraft.source || currentLead.source || "Website") : (currentLead.source || "Website");
    const targetPhone = stripPhone(leadEditDraft.phone || currentLead.phone);
    const targetAltPhone = stripPhone(leadEditDraft.altPhone || "");
    const targetProspectStatus = PROSPECT_STATUSES.includes(leadEditDraft.prospectStatus) ? leadEditDraft.prospectStatus : getProspectStatus(currentLead);
    const assignedUser = targetAssignedTo !== "Unassigned" ? users.find(u => u.name === targetAssignedTo) : null;
    const project = projects.find(p => p.name === targetProject);
    const statusChanged = (currentLead.status || "") !== targetStatus;
    const sourceChanged = (currentLead.source || "") !== targetSource;
    const phoneChanged = stripPhone(currentLead.phone) !== targetPhone;
    const altPhoneChanged = stripPhone(currentLead.altPhone) !== targetAltPhone;
    const prospectStatusChanged = getProspectStatus(currentLead) !== targetProspectStatus;
    if (!targetPhone) {
      triggerToastAlert("Please enter the primary phone number.");
      return;
    }
    const duplicatePhoneLead = leads.find(l => l.id !== currentLead.id && stripPhone(l.phone) === targetPhone);
    if (duplicatePhoneLead) {
      triggerToastAlert(`This phone number already exists for ${duplicatePhoneLead.name}.`);
      return;
    }
    const statusEventConfig = getStatusEventConfig(targetStatus);
    const statusEventNeedsDate = statusEventConfig?.dateRequired !== false;
    if (statusChanged && statusEventConfig && ((statusEventNeedsDate && !leadEditDraft.statusEventDate) || !leadEditDraft.statusEventRemark?.trim())) {
      setLeadStatusEventPopup({
        isOpen: true,
        status: targetStatus,
        previousStatus: currentLead.status || "New",
        date: statusEventNeedsDate ? (leadEditDraft.statusEventDate || getDefaultEventDateForStatus(targetStatus)) : "",
        event: leadEditDraft.statusEventRemark || statusEventConfig.defaultEvent || "",
      });
      triggerToastAlert(statusEventNeedsDate && !leadEditDraft.statusEventDate ? "Please add the event date before saving." : "Please add notes or remarks before saving.");
      return;
    }
    if (statusChanged && statusEventConfig && statusEventNeedsDate && leadEditDraft.statusEventDate < TODAY_STR) {
      triggerToastAlert("Please select today or a future date.");
      return;
    }
    const logs = [];
    if (statusChanged) {
      const eventDate = leadEditDraft.statusEventDate;
      const eventRemark = leadEditDraft.statusEventRemark || statusEventConfig?.defaultEvent || targetStatus;
      let statusAction = `Status updated to: ${targetStatus}`;
      if (statusEventConfig) {
        const datePart = eventDate ? ` Date: ${eventDate}.` : "";
        if (targetStatus === "Contacted") statusAction = `[Contacted]: ${eventRemark}.${datePart}`;
        else if (targetStatus === "Follow-Up") statusAction = `[Follow-Up]: ${eventRemark}.${datePart}`;
        else if (targetStatus === "Negotiation") statusAction = `[Negotiation]: ${eventRemark}.${datePart}`;
        else if (targetStatus.startsWith("Site Visit")) statusAction = `[Site Visit]: ${eventRemark}.${datePart}`;
        else if (targetStatus.startsWith("Booking") || targetStatus === "Booked") statusAction = `[Booking]: ${eventRemark}.${datePart}`;
        else statusAction = `[Status Update]: ${targetStatus}: ${eventRemark}.${datePart}`;
      }
      logs.push(makeHistoryLog(currentUser.name, statusAction));
    }
    if ((currentLead.assignedTo || "Unassigned") !== targetAssignedTo) logs.push(makeHistoryLog(currentUser.name, `Assigned to: ${targetAssignedTo}`));
    if ((currentLead.project || "") !== targetProject) logs.push(makeHistoryLog(currentUser.name, `Project changed from ${currentLead.project || "Not set"} to ${targetProject}.`));
    if (sourceChanged) logs.push(makeHistoryLog(currentUser.name, `Source changed from ${currentLead.source || "Not set"} to ${targetSource}.`));
    if (phoneChanged) logs.push(makeHistoryLog(currentUser.name, `Primary phone changed from ${currentLead.phone || "Not set"} to ${targetPhone}.`));
    if (altPhoneChanged) logs.push(makeHistoryLog(currentUser.name, `Alternate phone changed from ${currentLead.altPhone || "Not set"} to ${targetAltPhone || "Not set"}.`));
    if (prospectStatusChanged) logs.push(makeHistoryLog(currentUser.name, `Prospect status changed from ${getProspectStatus(currentLead)} to ${targetProspectStatus}.`));
    if (!logs.length) {
      setIsLeadEditMode(false);
      setSelectedLead(null);
      return;
    }
    setIsLeadUpdateSaving(true);
    const updated = leads.map(l => {
      if (l.id !== currentLead.id) return l;
      const assignmentChanged = (currentLead.assignedTo || "Unassigned") !== targetAssignedTo;
      const statusWasEdited = statusChanged;
      const nextStatus = statusWasEdited ? targetStatus : assignmentChanged ? (targetAssignedTo === "Unassigned" ? "New" : "Assigned") : l.status;
      return {
        ...l,
        status: nextStatus,
        lastFollowUp: ["Contacted","Follow-Up","Negotiation","RNR","Switched Off"].includes(targetStatus) ? TODAY_STR : l.lastFollowUp,
        nextFollowUp: ["Contacted","Follow-Up","Negotiation","RNR","Switched Off"].includes(targetStatus) && leadEditDraft.statusEventDate ? leadEditDraft.statusEventDate : l.nextFollowUp,
        siteVisitTentativeDate: targetStatus.startsWith("Site Visit") && leadEditDraft.statusEventDate ? leadEditDraft.statusEventDate : l.siteVisitTentativeDate,
        bookingDate: (targetStatus.startsWith("Booking") || targetStatus === "Booked") && leadEditDraft.statusEventDate ? leadEditDraft.statusEventDate : l.bookingDate,
        phone: targetPhone,
        altPhone: targetAltPhone,
        assignedTo: targetAssignedTo,
        assignedToId: assignedUser?.id || null,
        assignedAt: assignmentChanged && assignedUser ? Date.now() : l.assignedAt,
        assignedByRole: assignmentChanged ? currentUser.role : l.assignedByRole,
        project: targetProject,
        source: targetSource,
        prospectStatus: targetProspectStatus,
        branch: assignedUser?.branch || project?.branch || l.branch,
        history: [...logs, ...(l.history || [])],
      };
    });
    const saved = await setLeads(updated);
    setIsLeadUpdateSaving(false);
    if (!saved) {
      triggerToastAlert("Could not save lead update to Supabase.");
      return;
    }
    setIsLeadEditMode(false);
    setSelectedLead(null);
    triggerToastAlert("Lead updated.");
  };

  const handleCreateWhatsappTemplate = async (e) => {
    e.preventDefault();
    if(!newWhatsappTemplateForm.title.trim() || !newWhatsappTemplateForm.message.trim())return;
    const template = {
      id: Date.now(),
      project: newWhatsappTemplateForm.project || "All",
      title: newWhatsappTemplateForm.title.trim(),
      message: newWhatsappTemplateForm.message.trim(),
      imageUrl: newWhatsappTemplateForm.imageUrl.trim(),
      imageDataUrl: newWhatsappTemplateForm.imageDataUrl,
      createdBy: currentUser.name,
      createdAt: TODAY_STR,
    };
    const saved = await setWhatsappTemplates([template, ...whatsappTemplates]);
    if(!saved){ triggerToastAlert("Could not save WhatsApp template."); return; }
    setNewWhatsappTemplateForm({ project:"All", title:"", message:"", imageUrl:"", imageDataUrl:"" });
    triggerToastAlert("WhatsApp template saved.");
  };

  const handleWhatsappTemplateImageUpload = (file) => {
    if(!file)return;
    if(!file.type?.startsWith("image/")){ triggerToastAlert("Please select an image file."); return; }
    if(file.size > 750000){ triggerToastAlert("Please upload an image below 750 KB."); return; }
    const reader = new FileReader();
    reader.onload = () => setNewWhatsappTemplateForm(prev=>({...prev,imageDataUrl:String(reader.result || "")}));
    reader.readAsDataURL(file);
  };

  const handleDeleteWhatsappTemplate = async (templateId) => {
    if(currentUser?.role !== "Admin"){ triggerToastAlert("Only Admin can delete WhatsApp templates."); return; }
    if(!window.confirm("Delete this WhatsApp template?")) return;
    const saved = await setWhatsappTemplates(whatsappTemplates.filter(t => t.id !== templateId));
    if(!saved){ triggerToastAlert("Could not delete WhatsApp template."); return; }
    triggerToastAlert("Template deleted.");
  };

  const buildWhatsappTemplateMessage = (template, lead) => {
    const message = (template?.message || "")
      .replaceAll("{name}", lead?.name || "")
      .replaceAll("{project}", lead?.project || "")
      .replaceAll("{phone}", lead?.phone || "");
    return template?.imageUrl ? `${message}\n\n${template.imageUrl}` : message;
  };

  const handleSendWhatsappTemplate = () => {
    if(!selectedLead || !selectedWhatsappTemplateId)return;
    const template = whatsappTemplates.find(t => String(t.id) === String(selectedWhatsappTemplateId));
    if(!template)return;
    const message = buildWhatsappTemplateMessage(template, selectedLead);
    window.open(`https://wa.me/91${stripPhone(selectedLead.phone)}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  const executeDataExportSequence=(formatType)=>{
    if(customerActivityRows.length===0){triggerToastAlert("No data to export.");return;}
    const headers=["Last Contacted","User","Client","Phone","Project","Source","Calls Made","Followup","SV Planned","SV Done","Booking","Registration","Cancellation","Collection","Last Remark"];
    const rows=customerActivityRows.map(l=>[formatDateTimeLabel({date:l.lastContactedDate,time:l.lastContactedTime}),l.executive,l.leadName,l.phone,l.project,l.source,l.callsMade,l.followup,l.siteVisitPlanned,l.siteVisitDone,l.booking,l.registration,l.cancellation,l.collection,l.lastRemark]);
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
    let allUsers = users.filter(u => u.role !== "Admin");
    if (emailOrUsername.endsWith("@desam")) {
      try {
        allUsers = await loadStaffUsersFromBackend();
      } catch (err) {
        const detail = err?.message || err?.details || err?.hint || JSON.stringify(err || {});
        setLoginError(`Cannot load staff login data from Supabase. ${detail}`);
        return;
      }
    }
    const found = allUsers.find(u => u.email.toLowerCase() === emailOrUsername && u.active);
    if (found) {
      const acc = await verifyPassword(found, loginPassword) ? found : null;
      if (acc) {
        allowBrowserExitRef.current=false;
        setCurrentUser(acc);
        rememberSession(acc);
        setLoginError("");
        triggerToastAlert(`Welcome, ${acc.name}!`);
        return;
      }
      setLoginError("Invalid credentials.");
      return;
    }
    if (emailOrUsername.endsWith("@desam")) {
      setLoginError("Staff login not found. Staff must use user@desam. Admin must use @desamdevelopers.com.");
      return;
    }
    if (emailOrUsername.includes("@")) {
      const isCreatorSuperAdmin = emailOrUsername === ADMIN_SUPPORT_EMAIL;
      if (!emailOrUsername.endsWith("@desamdevelopers.com") && !isCreatorSuperAdmin) {
        setLoginError("Admin login must use @desamdevelopers.com. Staff login must use user@desam.");
        return;
      }
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
        allowBrowserExitRef.current=false;
        setCurrentUser(admin);
        rememberSession(admin);
        triggerToastAlert(`Welcome, ${admin.name}!`);
        return;
      }
      if (error?.message) {
        setLoginError(error.message);
        return;
      }
    }
    setLoginError("Invalid credentials.");
  };

  const handleLogout=async()=>{ allowBrowserExitRef.current=true; await supabase.auth.signOut(); forgetSession(); setCurrentUser(null);setLoginEmail("");setLoginPassword("");setGlobalSearch("");setActiveTab("dashboard");setNavHistory([]);setIsMobileMenuOpen(false); };
  const handleStayInApp=()=>{ setShowExitAppPopup(false); triggerToastAlert("You are still in the CRM."); };
  const handleLeaveApp=()=>{ allowBrowserExitRef.current=true; setShowExitAppPopup(false); window.history.back(); };

  const requestStatusTransitionPopup=(leadId,nextStatus)=>{ const t=leads.find(l=>l.id===leadId); if(!t)return; setCustomPopup({isOpen:true,leadId,targetValue:nextStatus,type:"status",title:"Confirm Status Shift",message:`Transition "${t.name}" to "${nextStatus}"?`}); };
  const requestOwnerAssignmentPopup=(leadId,personnelName)=>{ const t=leads.find(l=>l.id===leadId); if(!t)return; setCustomPopup({isOpen:true,leadId,targetValue:personnelName,type:"assign",title:"Confirm Assignment",message:`Assign "${t.name}" to "${personnelName}"?`}); };

  const confirmCustomPopupAction=async ()=>{
    const{leadId,targetValue,type}=customPopup;
    if(type==="status"){const log=makeHistoryLog(currentUser.name, `Status updated to: ${targetValue}`);const updated=leads.map(l=>l.id===leadId?{...l,status:targetValue,history:[log,...(l.history || [])]}:l);const saved=await setLeads(updated);if(!saved){triggerToastAlert("Could not save status to Supabase.");return;}if(selectedLead&&selectedLead.id===leadId)setSelectedLead({...selectedLead,status:targetValue,history:[log,...(selectedLead.history || [])]});triggerToastAlert("Status updated.");}
    else if(type==="assign"){
      const assignedUser = users.find(u => u.name === targetValue);
      const newBranch = assignedUser ? assignedUser.branch : leads.find(l=>l.id===leadId)?.branch;
      const log=makeHistoryLog(currentUser.name, `Assigned to: ${targetValue}`);
      const updated=leads.map(l=>l.id===leadId?{...l,assignedTo:targetValue,assignedToId:assignedUser?.id||null,assignedAt:assignedUser?Date.now():null,assignedByRole:currentUser.role,branch:newBranch||l.branch,status:targetValue==="Unassigned"?"New":"Assigned",history:[log,...(l.history || [])]}:l);
      const saved=await setLeads(updated);if(!saved){triggerToastAlert("Could not save assignment to Supabase.");return;}setSelectedLead(null);triggerToastAlert(`Assigned to ${targetValue}`);
    }
    setCustomPopup({isOpen:false,leadId:null,targetValue:"",type:"status",title:"",message:""});
  };

  const downloadLeadUploadTemplate=(formatType)=>{
    const headers=["Name","Phone","Email","Project","Location","Budget","Source","AssignedTo","Notes"];
    const sample=["Sample Customer","9876543210","customer@example.com",projects[0]?.name||"Project Name","Madurai","25","Website","Unassigned","Initial remark"];
    let blob; const ext=formatType==="excel"?"xlsx":"csv";
    if(formatType==="excel"){const ws=XLSX.utils.aoa_to_sheet([headers,sample]);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,"Lead Upload");blob=new Blob([XLSX.write(wb,{bookType:"xlsx",type:"array"})],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});}
    else{blob=new Blob([[headers.join(","),sample.join(",")].join("\n")],{type:"text/csv;charset=utf-8;"});}
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`CRM_Lead_Upload_Template.${ext}`;document.body.appendChild(a);a.click();URL.revokeObjectURL(a.href);document.body.removeChild(a);
  };

  const handleDataImportSubmit=async (e)=>{ e.preventDefault(); if(currentUser.role!=="Admin"){triggerToastAlert("Only Admin can upload data.");return;} if(!importText.trim())return; const warning=leadImportMode==="replace"?"This will clean existing leads and replace them with uploaded data. Continue?":"This will append uploaded leads to existing data. Continue?"; if(!window.confirm(warning))return; try{ const lines=importText.split("\n").map(l=>l.trim()).filter(Boolean); const newLeads=[]; lines.forEach((line,idx)=>{const cols=(line.includes("\t")?line.split("\t"):line.split(",")).map(c=>String(c||"").trim()); if(idx===0&&String(cols[0]||"").toLowerCase().includes("name"))return; if(cols.length>=4){const matchedProj=projects.find(p=>p.name.toLowerCase()===(cols[3]||"").toLowerCase().trim()); const branchHome=matchedProj?matchedProj.branch:"Madurai Desk"; const assignedUser=users.find(u=>u.name===(cols[7]||"")); const now=new Date(); newLeads.push({id:Date.now()+Math.floor(Math.random()*10000),name:cols[0]||"Lead",phone:stripPhone(cols[1]||"00000"),email:cols[2]||"",project:cols[3]||"",location:cols[4]||"Inbound",budget:parseInt(cols[5])||25,source:cols[6]||"Website",assignedTo:cols[7]||"Unassigned",assignedToId:assignedUser?.id||null,assignedAt:assignedUser?now.getTime():null,assignedByRole:currentUser.role,status:cols[7]&&cols[7]!=="Unassigned"?"Assigned":"New",prospectStatus:"Warm",branch:assignedUser?.branch||branchHome,dateCreated:getLocalDate(now),dateCreatedTime:getLocalTime(now),createdAt:now.toISOString(),newLeadTag:true,lastFollowUp:"None",nextFollowUp:getLocalDate(now),notes:cols[8]||"",history:[makeHistoryLog(currentUser.name,"Imported via paste.",now)],siteVisitTentativeDate:"",bookingUnit:"",bookingAmount:0,bookingMode:"",bookingDate:"",regPending:false,regCompleted:false});}});if(newLeads.length>0){const saved=await setLeads(leadImportMode==="replace"?newLeads:[...newLeads,...leads]); if(!saved){triggerToastAlert("Could not save imported leads.");return;} triggerToastAlert(`${leadImportMode==="replace"?"Replaced":"Imported"} ${newLeads.length} leads.`);setImportText("");}
  }catch(err){alert(err.message);} };

  const handleCreateUserSubmit=async (e)=>{ e.preventDefault(); const prefix=newUserForm.emailPrefix.trim().toLowerCase(); const role = newUserForm.role; if (role === "Admin") { triggerToastAlert("Use Admin Recovery or create another admin from secure backend controls."); return; } if(users.some(u=>u.email.toLowerCase()===`${prefix}@desam`)){triggerToastAlert("That username already exists.");return;} const manager=managerUsers.find(m=>String(m.id)===String(newUserForm.managerId)); const u={id:Date.now(),name:newUserForm.name.trim(),email:`${prefix}@desam`,...(await makePasswordFields(newUserForm.pass)),role,branch:newUserForm.branch,phone:stripPhone(newUserForm.phone)||"9840000000",active:true,avatar:newUserForm.name.charAt(0).toUpperCase(),managerId:["Executive","Telecaller"].includes(role)?(manager?.id||null):null,managerName:["Executive","Telecaller"].includes(role)?(manager?.name||""): ""}; const saved=await setUsers([...users, u]); if(!saved){triggerToastAlert("Could not save user to Supabase.");return;} setNewUserForm({name:"",emailPrefix:"",pass:"",role:"Executive",branch:"Madurai Desk",phone:"",managerId:""}); triggerToastAlert(`Profile for ${u.name} created.`); };

  const handleDeleteUser=async (userId)=>{
    if(userId===currentUser.id){triggerToastAlert("Cannot delete your own account.");return;}
    if(HARDCODED_ADMINS.some(a=>a.id===userId)){triggerToastAlert("Admin accounts cannot be deleted here.");return;}
    const saved=await setUsers(users.filter(u => u.id !== userId));
    if(!saved){triggerToastAlert("Could not remove user from Supabase.");return;}
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
    const manager=managerUsers.find(m=>String(m.id)===String(cleanForm.managerId));
    const u={...cleanForm,...passwordFields,name:cleanForm.name.trim(),email:`${prefix}@desam`,branch:cleanForm.role==="Admin"?"All Branches":cleanForm.branch,phone:stripPhone(cleanForm.phone)||"9840000000",avatar:cleanForm.name.charAt(0).toUpperCase(),active:cleanForm.active!==false,managerId:["Executive","Telecaller"].includes(cleanForm.role)?(manager?.id||null):null,managerName:["Executive","Telecaller"].includes(cleanForm.role)?(manager?.name||""):""};
    const saved=await setUsers(users.map(x => x.id === u.id ? u : x));
    if(!saved){triggerToastAlert("Could not save user changes to Supabase.");return;}
    setIsEditUserModalOpen(false);setEditUserForm(null); triggerToastAlert(`Profile for ${u.name} updated.`); };

  const handleCreateLead=async (e)=>{ e.preventDefault(); const phone=stripPhone(newLeadForm.phone); const dup=leads.find(l=>stripPhone(l.phone)===phone); if(dup){setDuplicateConflictRecord(dup);return;}
    const assignedUser = newLeadForm.assignedTo && newLeadForm.assignedTo !== "Unassigned" ? users.find(u => u.name === newLeadForm.assignedTo) : null;
    const projBranch = projects.find(p=>p.name===newLeadForm.project)?.branch || currentUser.branch || "Madurai Desk";
    const leadBranch = assignedUser ? assignedUser.branch : projBranch;
    const now = new Date();
    const created={...newLeadForm,prospectStatus:PROSPECT_STATUSES.includes(newLeadForm.prospectStatus)?newLeadForm.prospectStatus:"Warm",id:Date.now(),phone,altPhone:stripPhone(newLeadForm.altPhone),branch:leadBranch,dateCreated:getLocalDate(now),dateCreatedTime:getLocalTime(now),createdAt:now.toISOString(),newLeadTag:true,lastFollowUp:"None",nextFollowUp:getLocalDate(now),assignedToId:assignedUser?.id||null,assignedAt:assignedUser?Date.now():null,assignedByRole:currentUser.role,bookingUnit:"",bookingAmount:0,bookingMode:"",bookingDate:"",regPending:false,regCompleted:false,siteVisitTentativeDate:"",status:newLeadForm.assignedTo&&newLeadForm.assignedTo!=="Unassigned"?"Assigned":"New",history:[makeHistoryLog(currentUser.name, "Lead captured."+(newLeadForm.assignedTo&&newLeadForm.assignedTo!=="Unassigned"?` Assigned to ${newLeadForm.assignedTo}.`:""), now)]};
    const saved=await setLeads([created,...leads]); if(!saved){triggerToastAlert("Could not save lead to Supabase.");return;} setIsLeadModalOpen(false); setNewLeadForm({name:"",phone:"",altPhone:"",email:"",location:"",project:projects[0]?.name||"",budget:25,source:"Website",assignedTo:"Unassigned",prospectStatus:"Warm",notes:""}); triggerToastAlert("Lead created."); };

  const handleCreateProject=(e)=>{ e.preventDefault(); if(currentUser?.role!=="Admin"){triggerToastAlert("Only Admin can add projects.");return;} const p={...newProjectForm,id:Date.now(),price:parseInt(newProjectForm.price)||0,units:parseInt(newProjectForm.units)||0,sold:parseInt(newProjectForm.sold)||0}; setProjects([p,...projects]); setIsProjectModalOpen(false); setNewProjectForm({name:"",location:"",branch:"Madurai Desk",type:"Plot",price:30,units:50,sold:0,status:"Pre-Launch"}); triggerToastAlert(`Project "${p.name}" added.`); };
  const handleCreateActivityLog=(e)=>{ e.preventDefault(); const now=new Date(); const log={...newActivityForm,id:Date.now(),date:newActivityForm.date||getLocalDate(now),time:getLocalTime(now),timestamp:now.toISOString(),executive:["Admin","Manager"].includes(currentUser.role)?newActivityForm.executive:currentUser.name,callsMade:parseInt(newActivityForm.callsMade)||0,followup:parseInt(newActivityForm.followup)||0,siteVisit:parseInt(newActivityForm.siteVisit)||0,booking:parseInt(newActivityForm.booking)||0,registration:parseInt(newActivityForm.registration)||0,cancellation:parseInt(newActivityForm.cancellation)||0,collection:parseInt(newActivityForm.collection)||0}; setActivityLogsStateWrapped(prev=>[log,...prev]); setIsActivityLogModalOpen(false); setNewActivityForm({date:TODAY_STR,executive:"",project:projects[0]?.name||"",source:"Own Leads",callsMade:0,callStatus:"Warm",followup:0,siteVisit:0,booking:0,registration:0,cancellation:0,collection:0,remark:""}); triggerToastAlert("Activity log saved."); };

  const commitSiteWalkthroughLog=()=>{ const log=makeHistoryLog(currentUser.name, `[Site Visit]: Family: ${svFamily}. Feedback: ${svFeedback}`); if(svDate)log.date=svDate; const updated=leads.map(l=>l.id===selectedLead.id?{...l,status:"Site Visit Completed",history:[log,...(l.history || [])]}:l); setLeads(updated); setSelectedLead(null); triggerToastAlert("Site visit logged."); };
  const commitFinancialBookingLog=()=>{ const updated=leads.map(l=>l.id===selectedLead.id?{...l,status:"Booking Confirmed",bookingUnit:bkUnit,history:[makeHistoryLog(currentUser.name, `[Booking]: Unit [${bkUnit}] booked.`),...(l.history || [])]}:l); setLeads(updated); setSelectedLead(null); triggerToastAlert("Booking logged."); };

  const handleCallFeedback = (leadId, feedbackData) => {
    const { notes, outcome, followUpDate, callDuration, prospectStatus } = feedbackData;
    const cleanProspectStatus = PROSPECT_STATUSES.includes(prospectStatus) ? prospectStatus : "Warm";
    const log = makeHistoryLog(currentUser.name, `[Mobile Call]: Duration ${Math.floor(callDuration/60)}m${callDuration%60}s. Outcome: ${outcome}. Prospect: ${cleanProspectStatus}.${notes ? ` Notes: ${notes}` : ""}${followUpDate ? ` Next follow-up: ${followUpDate}` : ""}`);
    const updated = leads.map(l => { if (l.id !== leadId) return l; return { ...l, status: outcome || l.status, prospectStatus: cleanProspectStatus, lastFollowUp: TODAY_STR, nextFollowUp: followUpDate || "None", history: [log, ...(l.history || [])] }; });
    setLeads(updated);
    if (selectedLead && selectedLead.id === leadId) { setSelectedLead(prev => ({ ...prev, status: outcome || prev.status, prospectStatus: cleanProspectStatus, history: [log, ...(prev.history || [])] })); }
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

  const selectedRangeReportTotals = useMemo(()=>{
    const people = rangePeopleActivitySummary.reduce((acc,row)=>{
      acc.calls += row.calls || 0; acc.followup += row.followup || 0; acc.siteVisitPlanned += row.siteVisitPlanned || 0; acc.siteVisitDone += row.siteVisitDone || 0; acc.siteVisit += row.siteVisit || 0; acc.booking += row.booking || 0; acc.registration += row.registration || 0; acc.cancellation += row.cancellation || 0;
      return acc;
    },{calls:0,followup:0,siteVisitPlanned:0,siteVisitDone:0,siteVisit:0,booking:0,registration:0,cancellation:0,productivity:0});
    people.productivity = calculateBookingProductivity(people.booking, people.calls);
    const source = rangeSourceReport.reduce((acc,row)=>{
      acc.enquiry += row.enquiry || 0; acc.siteVisitPlanned += row.siteVisitPlanned || 0; acc.siteVisitDone += row.siteVisitDone || 0; acc.siteVisit += row.siteVisit || 0; acc.conversion += row.conversion || 0;
      return acc;
    },{enquiry:0,siteVisitPlanned:0,siteVisitDone:0,siteVisit:0,conversion:0});
    source.percentage = source.enquiry ? ((source.conversion/source.enquiry)*100).toFixed(1) : "0.0";
    return { people, source };
  },[rangePeopleActivitySummary,rangeSourceReport]);

  const performanceSummaryReport = useMemo(()=>{
    const logs = reportScopedActivityLogs.filter(l=>isDateInRange(l.date,reportStartDate,reportEndDate));
    const peopleNames = [...new Set([
      ...reportPeopleUsers.filter(u=>["Manager","Executive","Telecaller"].includes(u.role)).map(u=>u.name),
      ...logs.map(l=>l.executive).filter(Boolean),
    ])].sort((a,b)=>a.localeCompare(b));
    const fmtCells = (row) => row.map(formatReportValue);
    const makeSection = (title, labels, valueGetter, showTotalsRow = true) => {
      const rows = labels.map(label => {
        const values = peopleNames.map(name => logs.reduce((sum, log) => sum + (log.executive === name ? valueGetter(log, label) : 0), 0));
        return fmtCells([label, ...values, values.reduce((sum, value) => sum + value, 0)]);
      });
      const totals = peopleNames.map(name => logs.reduce((sum, log) => sum + (log.executive === name ? valueGetter(log, "TOTAL") : 0), 0));
      return { title, headers:[title, ...peopleNames, "TOTAL"], rows, totals:showTotalsRow ? fmtCells(["TOTAL", ...totals, totals.reduce((sum, value) => sum + value, 0)]) : null };
    };
    const metricLabels = ["Calls made","Followup","SV Planned","SV Done","Booking","Registration","Cancellation"];
    const metricValue = (log, label) => {
      if(label==="Calls made" || label==="TOTAL")return log.callsMade || 0;
      if(label==="Followup")return log.followup || 0;
      if(label==="SV Planned")return log.siteVisitPlanned || 0;
      if(label==="SV Done")return log.siteVisitDone || 0;
      if(label==="Booking")return log.booking || 0;
      if(label==="Registration")return log.registration || 0;
      if(label==="Cancellation")return log.cancellation || 0;
      return 0;
    };
    const sourceNames = [...new Set([...SOURCES, ...logs.map(l=>l.source).filter(Boolean)])].filter(source => logs.some(log => (log.source || "Unknown") === source && (log.callsMade || 0))).sort((a,b)=>SOURCES.indexOf(a)===-1||SOURCES.indexOf(b)===-1?a.localeCompare(b):SOURCES.indexOf(a)-SOURCES.indexOf(b));
    const projectNames = [...new Set([...projects.map(p=>p.name), ...logs.map(l=>l.project).filter(Boolean)])].filter(project => logs.some(log => (log.project || "Unknown") === project && (log.callsMade || 0))).sort((a,b)=>a.localeCompare(b));
    return {
      title:"Performance Summary Report",
      sections:[
        makeSection("EXECUTIVEWISE", metricLabels, metricValue, false),
        makeSection("SOURCEWISE", sourceNames, (log, source) => source==="TOTAL" || log.source===source ? (log.callsMade || 0) : 0),
        makeSection("PROJECTWISE", projectNames, (log, project) => project==="TOTAL" || log.project===project ? (log.callsMade || 0) : 0),
      ],
    };
  },[reportScopedActivityLogs,reportPeopleUsers,projects,isDateInRange,reportStartDate,reportEndDate]);

  const managementSummaryReport = useMemo(()=>{
    const leadsInRange = reportScopedLeads.filter(lead=>isDateInRange(lead.dateCreated,reportStartDate,reportEndDate));
    const logsInRange = reportScopedActivityLogs.filter(log=>isDateInRange(log.date,reportStartDate,reportEndDate));
    const personNames = [...new Set([
      ...(currentUser?.role==="Admin" ? [currentUser.name] : []),
      ...reportPeopleUsers.filter(u=>["Manager","Executive","Telecaller"].includes(u.role)).map(u=>u.name),
      ...leadsInRange.map(l=>l.assignedTo).filter(Boolean),
      ...logsInRange.map(l=>l.executive).filter(Boolean),
    ])].filter(Boolean).sort((a,b)=>a.localeCompare(b));
    const sourceOrder = ["Walk-In","Own Leads","99acres","Olx","Office Leads","Meta Ads","Just Dial","Reference","924000"];
    const sourceNames = [...new Set([...sourceOrder, ...leadsInRange.map(l=>l.source).filter(Boolean), ...logsInRange.map(l=>l.source).filter(Boolean)])].filter(source=>leadsInRange.some(lead=>(lead.source || "Unknown")===source)).sort((a,b)=>{
      const ai=sourceOrder.indexOf(a), bi=sourceOrder.indexOf(b);
      if(ai>=0 && bi>=0)return ai-bi;
      if(ai>=0)return -1;
      if(bi>=0)return 1;
      return a.localeCompare(b);
    });
    const sourceLabel = (source) => source === "Own Leads" ? "Own" : source === "Meta Ads" ? "Meta" : source;
    const projectNames = [...new Set([...projects.map(p=>p.name), ...leadsInRange.map(l=>l.project).filter(Boolean), ...logsInRange.map(l=>l.project).filter(Boolean)])].filter(project=>project&&leadsInRange.some(lead=>(lead.project || "Unknown")===project)).sort((a,b)=>a.localeCompare(b));
    const fmtCells = (row) => row.map(formatReportValue);
    const leadKey = (item) => item?.leadId || item?.id || `${item?.phone || ""}-${item?.leadName || item?.name || ""}`;
    const uniqueLogCount = (logs, predicate) => new Set(logs.filter(predicate).map(leadKey)).size;
    const sourceMetricValue = (source, metric) => {
      const sourceLeads = leadsInRange.filter(lead=>(lead.source || "Unknown")===source);
      const sourceLogs = logsInRange.filter(log=>(log.source || "Unknown")===source);
      if(metric==="Enq")return sourceLeads.length;
      if(metric==="SV Plan")return uniqueLogCount(sourceLogs, log=>log.siteVisitPlanned);
      if(metric==="SV Done")return uniqueLogCount(sourceLogs, log=>log.siteVisitDone);
      if(metric==="Booking")return uniqueLogCount(sourceLogs, log=>log.booking);
      if(metric==="Reg")return uniqueLogCount(sourceLogs, log=>log.registration);
      if(metric==="Cancel")return uniqueLogCount(sourceLogs, log=>log.cancellation);
      if(metric==="FU")return sourceLogs.reduce((sum, log)=>sum+(log.followup||0),0);
      return 0;
    };
    const sourceMetrics = ["Enq","SV Plan","SV Done","Booking","Reg","Cancel","FU"];
    const sourceConversionRows = sourceMetrics.map(metric=>{
      const values = sourceNames.map(source=>sourceMetricValue(source, metric));
      return fmtCells([metric, ...values, values.reduce((sum,value)=>sum+value,0)]);
    });
    const sourceTotalMetrics = sourceMetrics.filter(metric=>metric!=="FU");
    const sourceTotals = sourceNames.map(source=>sourceTotalMetrics.reduce((sum,metric)=>sum+sourceMetricValue(source, metric),0));
    const sourceEnquiries = sourceNames.map(source=>sourceMetricValue(source, "Enq"));
    const sourceSvDone = sourceNames.map(source=>sourceMetricValue(source, "SV Done"));
    const sourceBookings = sourceNames.map(source=>sourceMetricValue(source, "Booking"));
    const pct = (num, den) => den ? `${((num/den)*100).toFixed(1)}%` : "-";
    const totalBookings = sourceBookings.reduce((sum,value)=>sum+value,0);
    const totalEnquiries = sourceEnquiries.reduce((sum,value)=>sum+value,0);
    const totalSvDone = sourceSvDone.reduce((sum,value)=>sum+value,0);
    const sourceConversionSection = {
      title:"SUMMARY - SOURCE Vs CONVERSION",
      headers:["", ...sourceNames.map(sourceLabel), "TOTAL"],
      rows:[
        ...sourceConversionRows,
        ["Conv Vs Enq %", ...sourceNames.map((_,i)=>pct(sourceBookings[i], sourceEnquiries[i])), pct(totalBookings,totalEnquiries)],
        ["Conv Vs SV %", ...sourceNames.map((_,i)=>pct(sourceBookings[i], sourceSvDone[i])), pct(totalBookings,totalSvDone)],
      ],
      totals:null,
    };
    const executiveSummaryRows = personNames.map(name=>{
        const logs = logsInRange.filter(log=>(log.executive || "System")===name);
        const calls = logs.reduce((sum,log)=>sum+(log.callsMade||0),0);
        const followup = logs.reduce((sum,log)=>sum+(log.followup||0),0);
        const svPlan = logs.reduce((sum,log)=>sum+(log.siteVisitPlanned||0),0);
        const svDone = logs.reduce((sum,log)=>sum+(log.siteVisitDone||0),0);
        const booking = logs.reduce((sum,log)=>sum+(log.booking||0),0);
        const registration = logs.reduce((sum,log)=>sum+(log.registration||0),0);
        const cancellation = logs.reduce((sum,log)=>sum+(log.cancellation||0),0);
        return fmtCells([name,calls,followup,svPlan,svDone,booking,registration,cancellation,calculateBookingProductivity(booking,calls)]);
      });
    const executiveTotalsRaw = logsInRange.reduce((acc,log)=>{
      acc.calls += log.callsMade || 0; acc.followup += log.followup || 0; acc.svPlan += log.siteVisitPlanned || 0; acc.svDone += log.siteVisitDone || 0; acc.booking += log.booking || 0; acc.registration += log.registration || 0; acc.cancellation += log.cancellation || 0;
      return acc;
    },{calls:0,followup:0,svPlan:0,svDone:0,booking:0,registration:0,cancellation:0});
    const executiveSummarySection = {
      title:"EXECUTIVEWISE SUMMARY",
      headers:["Executive","Calls made","Followup","SV Plan","SV Done","Booking","Registration","Cancellation","Productivity %"],
      rows:executiveSummaryRows,
      totals:fmtCells(["TOTAL",executiveTotalsRaw.calls,executiveTotalsRaw.followup,executiveTotalsRaw.svPlan,executiveTotalsRaw.svDone,executiveTotalsRaw.booking,executiveTotalsRaw.registration,executiveTotalsRaw.cancellation,calculateBookingProductivity(executiveTotalsRaw.booking,executiveTotalsRaw.calls)]),
    };
    const sourcewiseRows = personNames.map(name=>{
      const values = sourceNames.map(source=>leadsInRange.filter(lead=>(lead.assignedTo || "Unassigned")===name && (lead.source || "Unknown")===source).length);
      return fmtCells([name, ...values, values.reduce((sum,value)=>sum+value,0)]);
    });
    const sourcewiseTotals = sourceNames.map(source=>leadsInRange.filter(lead=>(lead.source || "Unknown")===source).length);
    const sourcewiseSection = {
      title:"EXECUTIVEWISE - SOURCEWISE",
      headers:["Executive", ...sourceNames.map(sourceLabel), "TOTAL"],
      rows:sourcewiseRows,
      totals:fmtCells(["TOTAL", ...sourcewiseTotals, sourcewiseTotals.reduce((sum,value)=>sum+value,0)]),
    };
    const projectHeaderTop = ["Executive"];
    const projectHeaderBottom = [""];
    const projectHeaderSpansTop = [1];
    const projectHeaderSpansBottom = [1];
    projectNames.forEach(project=>{ projectHeaderTop.push(project, "", ""); projectHeaderBottom.push("Enq","SV","Booking"); projectHeaderSpansTop.push(3,0,0); projectHeaderSpansBottom.push(1,1,1); });
    projectHeaderTop.push("TOTAL","","");
    projectHeaderBottom.push("Enq","SV","Booking");
    projectHeaderSpansTop.push(3,0,0);
    projectHeaderSpansBottom.push(1,1,1);
    const projectRows = personNames.map(name=>{
      const values = [];
      projectNames.forEach(project=>{
        values.push(leadsInRange.filter(lead=>(lead.assignedTo || "Unassigned")===name && (lead.project || "Unknown")===project).length);
        values.push(uniqueLogCount(logsInRange, log=>(log.executive || "System")===name && (log.project || "Unknown")===project && log.siteVisitDone));
        values.push(uniqueLogCount(logsInRange, log=>(log.executive || "System")===name && (log.project || "Unknown")===project && log.booking));
      });
      const totalEnq = values.filter((_,i)=>i%3===0).reduce((sum,value)=>sum+value,0);
      const totalSv = values.filter((_,i)=>i%3===1).reduce((sum,value)=>sum+value,0);
      const totalBooking = values.filter((_,i)=>i%3===2).reduce((sum,value)=>sum+value,0);
      return fmtCells([name, ...values, totalEnq, totalSv, totalBooking]);
    });
    const projectTotals = [];
    projectNames.forEach(project=>{
      projectTotals.push(leadsInRange.filter(lead=>(lead.project || "Unknown")===project).length);
      projectTotals.push(uniqueLogCount(logsInRange, log=>(log.project || "Unknown")===project && log.siteVisitDone));
      projectTotals.push(uniqueLogCount(logsInRange, log=>(log.project || "Unknown")===project && log.booking));
    });
    const projectTotalEnq = projectTotals.filter((_,i)=>i%3===0).reduce((sum,value)=>sum+value,0);
    const projectTotalSv = projectTotals.filter((_,i)=>i%3===1).reduce((sum,value)=>sum+value,0);
    const projectTotalBooking = projectTotals.filter((_,i)=>i%3===2).reduce((sum,value)=>sum+value,0);
    const projectwiseSection = {
      title:"PROJECTWISE - EXECUTIVEWISE",
      subtitle:"Enq - SV - Booking",
      headers:projectHeaderBottom,
      headerRows:[projectHeaderTop,projectHeaderBottom],
      headerColSpans:[projectHeaderSpansTop,projectHeaderSpansBottom],
      rows:projectRows,
      totals:fmtCells(["TOTAL", ...projectTotals, projectTotalEnq, projectTotalSv, projectTotalBooking]),
    };
    const projectSourceRows = sourceNames.map(source=>{
      const values = [];
      projectNames.forEach(project=>{
        values.push(leadsInRange.filter(lead=>(lead.source || "Unknown")===source && (lead.project || "Unknown")===project).length);
        values.push(uniqueLogCount(logsInRange, log=>(log.source || "Unknown")===source && (log.project || "Unknown")===project && log.siteVisitDone));
        values.push(uniqueLogCount(logsInRange, log=>(log.source || "Unknown")===source && (log.project || "Unknown")===project && log.booking));
      });
      const totalEnq = values.filter((_,i)=>i%3===0).reduce((sum,value)=>sum+value,0);
      const totalSv = values.filter((_,i)=>i%3===1).reduce((sum,value)=>sum+value,0);
      const totalBooking = values.filter((_,i)=>i%3===2).reduce((sum,value)=>sum+value,0);
      return fmtCells([sourceLabel(source), ...values, totalEnq, totalSv, totalBooking]);
    });
    const projectSourceTotals = [];
    projectNames.forEach(project=>{
      projectSourceTotals.push(leadsInRange.filter(lead=>(lead.project || "Unknown")===project).length);
      projectSourceTotals.push(uniqueLogCount(logsInRange, log=>(log.project || "Unknown")===project && log.siteVisitDone));
      projectSourceTotals.push(uniqueLogCount(logsInRange, log=>(log.project || "Unknown")===project && log.booking));
    });
    const projectSourceTotalEnq = projectSourceTotals.filter((_,i)=>i%3===0).reduce((sum,value)=>sum+value,0);
    const projectSourceTotalSv = projectSourceTotals.filter((_,i)=>i%3===1).reduce((sum,value)=>sum+value,0);
    const projectSourceTotalBooking = projectSourceTotals.filter((_,i)=>i%3===2).reduce((sum,value)=>sum+value,0);
    const projectSourceEnqBookingSection = {
      id:"ProjectSourceEnqBooking",
      title:"PROJECTWISE - SOURCEWISE",
      subtitle:"Enq - SV - Booking",
      headers:["", ...projectHeaderBottom.slice(1)],
      headerRows:[["Source", ...projectHeaderTop.slice(1)],["", ...projectHeaderBottom.slice(1)]],
      headerColSpans:[projectHeaderSpansTop,projectHeaderSpansBottom],
      rows:projectSourceRows,
      totals:fmtCells(["TOTAL", ...projectSourceTotals, projectSourceTotalEnq, projectSourceTotalSv, projectSourceTotalBooking]),
    };
    const dashboardTrendMap = {};
    leadsInRange.forEach(lead=>{
      const date = lead.dateCreated || "Unknown";
      if(!dashboardTrendMap[date])dashboardTrendMap[date]={date,enquiry:0,calls:0,svPlan:0,svDone:0,booking:0};
      dashboardTrendMap[date].enquiry += 1;
    });
    logsInRange.forEach(log=>{
      const date = log.date || "Unknown";
      if(!dashboardTrendMap[date])dashboardTrendMap[date]={date,enquiry:0,calls:0,svPlan:0,svDone:0,booking:0};
      dashboardTrendMap[date].calls += log.callsMade || 0;
      dashboardTrendMap[date].svPlan += log.siteVisitPlanned || 0;
      dashboardTrendMap[date].svDone += log.siteVisitDone || 0;
      dashboardTrendMap[date].booking += log.booking || 0;
    });
    const buildDashboardTotals = (leadRows, logRows) => {
      const totals = logRows.reduce((acc,log)=>{
        acc.calls += log.callsMade || 0; acc.followup += log.followup || 0; acc.svPlan += log.siteVisitPlanned || 0; acc.svDone += log.siteVisitDone || 0; acc.booking += log.booking || 0; acc.registration += log.registration || 0; acc.cancellation += log.cancellation || 0;
        return acc;
      },{enquiry:leadRows.length,calls:0,followup:0,svPlan:0,svDone:0,booking:0,registration:0,cancellation:0});
      totals.conversion = pct(totals.booking, totals.enquiry);
      totals.callProductivity = calculateBookingProductivity(totals.booking, totals.calls);
      return totals;
    };
    const dashboardTotals = buildDashboardTotals(leadsInRange, logsInRange);
    const todayLeads = reportScopedLeads.filter(lead=>lead.dateCreated===TODAY_STR);
    const todayLogs = reportScopedActivityLogs.filter(log=>log.date===TODAY_STR);
    const dashboard = {
      totals:dashboardTotals,
      todayTotals:buildDashboardTotals(todayLeads, todayLogs),
      trend:Object.values(dashboardTrendMap).sort((a,b)=>a.date.localeCompare(b.date)),
      sourceMix:sourceNames.map(source=>({name:sourceLabel(source),value:sourceMetricValue(source,"Enq"),booking:sourceMetricValue(source,"Booking")})).filter(item=>item.value>0),
      projectMix:projectNames.map(project=>({name:project,value:leadsInRange.filter(lead=>(lead.project || "Unknown")===project).length,booking:uniqueLogCount(logsInRange, log=>(log.project || "Unknown")===project && log.booking)})).filter(item=>item.value>0),
      executiveBars:personNames.map(name=>{
        const logs = logsInRange.filter(log=>(log.executive || "System")===name);
        const calls = logs.reduce((sum,log)=>sum+(log.callsMade||0),0);
        const booking = logs.reduce((sum,log)=>sum+(log.booking||0),0);
        return {name,calls,booking};
      }).filter(item=>item.calls||item.booking).sort((a,b)=>b.calls-a.calls).slice(0,10),
    };
    return { title:"Management Summary Sheet", dashboard, sections:[executiveSummarySection, sourceConversionSection, sourcewiseSection, projectwiseSection, projectSourceEnqBookingSection] };
  },[reportScopedLeads,reportScopedActivityLogs,currentUser,reportPeopleUsers,projects,isDateInRange,reportStartDate,reportEndDate,TODAY_STR]);

  const activeRangeReport = useMemo(()=>{
    const sumRows = (rows, fields) => fields.reduce((acc, field)=>{acc[field]=rows.reduce((s,r)=>s+(Number(r[field])||0),0);return acc;},{});
    const fmtRow = (row) => row.map(formatReportValue);
    if(selectedMatrixReport==="ManagementSummary")return managementSummaryReport;
    if(selectedMatrixReport==="ProjectSourceEnqBooking")return {title:"Projectwise-Sourcewise Enq - SV - Booking",sections:managementSummaryReport.sections.filter(section=>section.id==="ProjectSourceEnqBooking")};
    if(selectedMatrixReport==="PerformanceSummary")return performanceSummaryReport;
    if(selectedMatrixReport==="Projectwise"){
      const totals=sumRows(rangeProjectReport,["enquiry","siteVisitPlanned","siteVisitDone","booking","conversion","cancellation"]);
      totals.percentage=totals.enquiry?((totals.conversion/totals.enquiry)*100).toFixed(1):"0.0";
      return {title:"Projectwise Report",headers:["Project","Enquiry","SV Planned","SV Done","Booking","Conversion","Cancellation","Percentage"],rows:rangeProjectReport.map(r=>fmtRow([r.project,r.enquiry,r.siteVisitPlanned,r.siteVisitDone,r.booking,r.conversion,r.cancellation,`${r.percentage}%`])),rowKeys:rangeProjectReport.map(r=>`project:${r.project}`),details:rangeProjectReport.map(r=>buildReportCustomerDetails(lead=>lead.project===r.project,log=>log.project===r.project)),totals:fmtRow(["TOTAL",totals.enquiry,totals.siteVisitPlanned,totals.siteVisitDone,totals.booking,totals.conversion,totals.cancellation,`${totals.percentage}%`])};
    }
    if(selectedMatrixReport==="Sourcewise"){
      const totals=sumRows(rangeSourceReport,["enquiry","siteVisitPlanned","siteVisitDone","booking","conversion","cancellation"]);
      totals.percentage=totals.enquiry?((totals.conversion/totals.enquiry)*100).toFixed(1):"0.0";
      return {title:"Sourcewise Report",headers:["Source","Enquiry","SV Planned","SV Done","Booking","Conversion","Cancellation","Percentage"],rows:rangeSourceReport.map(r=>fmtRow([r.source,r.enquiry,r.siteVisitPlanned,r.siteVisitDone,r.booking,r.conversion,r.cancellation,`${r.percentage}%`])),rowKeys:rangeSourceReport.map(r=>`source:${r.source}`),details:rangeSourceReport.map(r=>buildReportCustomerDetails(lead=>lead.source===r.source,log=>log.source===r.source)),totals:fmtRow(["TOTAL",totals.enquiry,totals.siteVisitPlanned,totals.siteVisitDone,totals.booking,totals.conversion,totals.cancellation,`${totals.percentage}%`])};
    }
    if(selectedMatrixReport==="SourceProjectwise"){
      const totals=sumRows(rangeSourceProjectReport,["enquiry","siteVisitPlanned","siteVisitDone","booking","conversion","cancellation"]);
      totals.percentage=totals.enquiry?((totals.conversion/totals.enquiry)*100).toFixed(1):"0.0";
      return {title:"Sourcewise-Projectwise Report",headers:["Source","Project","Enquiry","SV Planned","SV Done","Booking","Conversion","Cancellation","Percentage"],rows:rangeSourceProjectReport.map(r=>fmtRow([r.source,r.project,r.enquiry,r.siteVisitPlanned,r.siteVisitDone,r.booking,r.conversion,r.cancellation,`${r.percentage}%`])),rowKeys:rangeSourceProjectReport.map(r=>`source-project:${r.source}:${r.project}`),details:rangeSourceProjectReport.map(r=>buildReportCustomerDetails(lead=>lead.source===r.source&&lead.project===r.project,log=>log.source===r.source&&log.project===r.project)),totals:fmtRow(["TOTAL","",totals.enquiry,totals.siteVisitPlanned,totals.siteVisitDone,totals.booking,totals.conversion,totals.cancellation,`${totals.percentage}%`])};
    }
    if(selectedMatrixReport==="ExecutiveProjectwise"){
      const totals=sumRows(rangeExecutiveProjectReport,["enquiry","calls","followup","siteVisitPlanned","siteVisitDone","booking","registration","cancellation"]);
      totals.productivity=calculateBookingProductivity(totals.booking,totals.calls);
      return {title:"Executivewise-Projectwise Report",headers:["Executive","Project","Enquiry","Calls","Followup","SV Planned","SV Done","Booking","Registration","Cancellation","Productivity %"],rows:rangeExecutiveProjectReport.map(r=>fmtRow([r.executive,r.project,r.enquiry,r.calls,r.followup,r.siteVisitPlanned,r.siteVisitDone,r.booking,r.registration,r.cancellation,r.productivity])),rowKeys:rangeExecutiveProjectReport.map(r=>`executive-project:${r.executive}:${r.project}`),details:rangeExecutiveProjectReport.map(r=>buildReportCustomerDetails(lead=>(lead.assignedTo||"Unassigned")===r.executive&&lead.project===r.project,log=>(log.executive||"Unassigned")===r.executive&&log.project===r.project)),totals:fmtRow(["TOTAL","",totals.enquiry,totals.calls,totals.followup,totals.siteVisitPlanned,totals.siteVisitDone,totals.booking,totals.registration,totals.cancellation,totals.productivity])};
    }
    if(selectedMatrixReport==="ExecutiveSourcewise"){
      const totals=sumRows(rangeExecutiveSourceReport,["enquiry","calls","followup","siteVisitPlanned","siteVisitDone","booking","registration","cancellation"]);
      totals.productivity=calculateBookingProductivity(totals.booking,totals.calls);
      return {title:"Executivewise-Sourcewise Report",headers:["Executive","Source","Enquiry","Calls","Followup","SV Planned","SV Done","Booking","Registration","Cancellation","Productivity %"],rows:rangeExecutiveSourceReport.map(r=>fmtRow([r.executive,r.source,r.enquiry,r.calls,r.followup,r.siteVisitPlanned,r.siteVisitDone,r.booking,r.registration,r.cancellation,r.productivity])),rowKeys:rangeExecutiveSourceReport.map(r=>`executive-source:${r.executive}:${r.source}`),details:rangeExecutiveSourceReport.map(r=>buildReportCustomerDetails(lead=>(lead.assignedTo||"Unassigned")===r.executive&&lead.source===r.source,log=>(log.executive||"Unassigned")===r.executive&&log.source===r.source)),totals:fmtRow(["TOTAL","",totals.enquiry,totals.calls,totals.followup,totals.siteVisitPlanned,totals.siteVisitDone,totals.booking,totals.registration,totals.cancellation,totals.productivity])};
    }
    const totals=sumRows(rangePeopleActivitySummary,["calls","followup","siteVisitPlanned","siteVisitDone","booking","registration","cancellation"]);
    totals.productivity=calculateBookingProductivity(totals.booking,totals.calls);
    return {title:"Executivewise Report",headers:["Name","Calls","Followup","SV Planned","SV Done","Booking","Registration","Cancellation","Productivity %"],rows:rangePeopleActivitySummary.map(r=>fmtRow([r.name,r.calls,r.followup,r.siteVisitPlanned,r.siteVisitDone,r.booking,r.registration,r.cancellation,r.productivity])),rowKeys:rangePeopleActivitySummary.map(r=>`executive:${r.name}`),details:rangePeopleActivitySummary.map(r=>buildReportCustomerDetails(lead=>(lead.assignedTo||"Unassigned")===r.name,log=>(log.executive||"Unassigned")===r.name)),totals:fmtRow(["TOTAL",totals.calls,totals.followup,totals.siteVisitPlanned,totals.siteVisitDone,totals.booking,totals.registration,totals.cancellation,totals.productivity])};
  },[selectedMatrixReport,managementSummaryReport,performanceSummaryReport,rangePeopleActivitySummary,rangeSourceReport,rangeProjectReport,rangeSourceProjectReport,rangeExecutiveProjectReport,rangeExecutiveSourceReport,buildReportCustomerDetails]);

  useEffect(() => {
    setExpandedRangeReportKey("");
  }, [selectedMatrixReport, reportStartDate, reportEndDate]);

  const exportSelectedRangeReport = (formatType) => {
    const hasSections = Array.isArray(activeRangeReport.sections);
    const headers = activeRangeReport.headers || [];
    const rows = hasSections ? [] : [...activeRangeReport.rows, activeRangeReport.totals];
    const fmtCell=(val)=>{const s=val===null||val===undefined?"":String(val);return s.includes(",")||s.includes('"')||s.includes("\n")?`"${s.replace(/"/g,'""')}"`:s;};
    const getSectionMerges = () => {
      if(!hasSections)return[];
      const merges = [];
      let rowCursor = 3;
      activeRangeReport.sections.forEach((section, idx)=>{
        if(idx)rowCursor += 1;
        rowCursor += 1;
        if(section.subtitle)rowCursor += 1;
        (section.headerColSpans || []).forEach((spans, headerRowIdx)=>{
          spans.forEach((span, colIdx)=>{
            if(span > 1)merges.push({s:{r:rowCursor+headerRowIdx,c:colIdx},e:{r:rowCursor+headerRowIdx,c:colIdx+span-1}});
          });
        });
        rowCursor += (section.headerRows || [section.headers]).length + section.rows.length + (section.totals ? 1 : 0);
      });
      return merges;
    };
    const sectionAoA = hasSections ? activeRangeReport.sections.flatMap((section, idx) => {
      const sectionHeaderRows = section.headerRows || [section.headers];
      return [
        ...(idx ? [[]] : []),
        [section.title],
        ...(section.subtitle ? [[section.subtitle]] : []),
        ...sectionHeaderRows,
        ...section.rows,
        ...(section.totals ? [section.totals] : []),
      ];
    }) : [];
    const fileStem = `Desam_${activeRangeReport.title.replaceAll(" ","_")}_${reportStartDate}_to_${reportEndDate}`;
    if(formatType==="excel"){
      const wb = XLSX.utils.book_new();
      const worksheetRows = hasSections ? [[activeRangeReport.title], [`${reportStartDate} to ${reportEndDate}`], [], ...sectionAoA] : [headers,...rows];
      const ws = XLSX.utils.aoa_to_sheet(worksheetRows);
      const maxCols = worksheetRows.reduce((max,row)=>Math.max(max,row.length),0);
      ws["!cols"] = Array.from({length:maxCols},()=>({ wch: 14 }));
      const merges = getSectionMerges();
      if(merges.length)ws["!merges"] = merges;
      XLSX.utils.book_append_sheet(wb, ws, activeRangeReport.title.slice(0,31));
      const buffer = XLSX.write(wb, { bookType:"xlsx", type:"array" });
      const blob = new Blob([buffer], { type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${fileStem}.xlsx`;document.body.appendChild(a);a.click();URL.revokeObjectURL(a.href);document.body.removeChild(a);
      triggerToastAlert("Selected range exported as Excel.");
      return;
    }
    if(formatType==="csv"){
      const lines = [
        `Selected Range Report,${reportStartDate} to ${reportEndDate}`,
        "",
        activeRangeReport.title,
        ...(hasSections ? sectionAoA.map(r=>r.map(fmtCell).join(",")) : [headers.map(fmtCell).join(","), ...rows.map(r=>r.map(fmtCell).join(","))]),
      ];
      const blob=new Blob([lines.join("\n")],{type:"text/csv;charset=utf-8;"});
      const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${fileStem}.csv`;document.body.appendChild(a);a.click();URL.revokeObjectURL(a.href);document.body.removeChild(a);
      triggerToastAlert("Selected range exported as CSV.");
      return;
    }
    const esc = (val)=>String(val ?? "").replace(/[&<>"']/g, ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
    const pdfDateLabel = (value) => {
      if(!value || value === "Unknown") return "-";
      const parts = String(value).split("-");
      return parts.length === 3 ? `${parts[2]}/${parts[1]}` : String(value);
    };
    const pdfLongDateLabel = (value) => {
      if(!value || value === "Unknown") return "-";
      const parts = String(value).split("-");
      if(parts.length !== 3)return String(value);
      const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return `${Number(parts[2])}, ${monthNames[Number(parts[1])-1] || parts[1]} ${parts[0]}`;
    };
    const pdfRangeLongLabel = `${pdfLongDateLabel(reportStartDate)} to ${pdfLongDateLabel(reportEndDate)}`;
    const renderPdfKpiSection = (title, subtitle, totals) => `<div class="metric-section"><h3>${esc(title)}</h3><p>${esc(subtitle)}</p><div class="kpis"><div class="box">Enquiry<b>${formatReportValue(totals.enquiry)}</b></div><div class="box">Calls<b>${formatReportValue(totals.calls)}</b></div><div class="box">Followup<b>${formatReportValue(totals.followup)}</b></div><div class="box">SV Plan<b>${formatReportValue(totals.svPlan)}</b></div><div class="box">SV Done<b>${formatReportValue(totals.svDone)}</b></div><div class="box">Booking<b>${formatReportValue(totals.booking)}</b></div><div class="box">Conversion<b>${formatReportValue(totals.conversion)}</b></div><div class="box">Productivity<b>${formatReportValue(totals.callProductivity)}</b></div></div></div>`;
    const renderPdfLineChart = (items) => {
      const width = 360, height = 160, padX = 28, padY = 20;
      const chartWidth = width - padX * 2, chartHeight = height - padY * 2;
      const metrics = [{key:"enquiry",label:"Enquiry",color:"#38bdf8"},{key:"calls",label:"Calls",color:"#f97316"},{key:"booking",label:"Booking",color:"#a855f7"}];
      const maxVal = Math.max(...items.flatMap(item=>metrics.map(metric=>Number(item[metric.key])||0)),1);
      const pointFor = (item, idx, key) => {
        const x = padX + (items.length > 1 ? (idx / (items.length - 1)) * chartWidth : chartWidth / 2);
        const y = padY + chartHeight - ((Number(item[key]) || 0) / maxVal) * chartHeight;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      };
      const lines = metrics.map(metric=>`<polyline fill="none" stroke="${metric.color}" stroke-width="3" points="${items.map((item,idx)=>pointFor(item,idx,metric.key)).join(" ")}"/>`).join("");
      const dots = metrics.map(metric=>items.map((item,idx)=>{
        const [x,y] = pointFor(item,idx,metric.key).split(",");
        return `<circle cx="${x}" cy="${y}" r="3" fill="${metric.color}"/>`;
      }).join("")).join("");
      const labels = items.map((item,idx)=>{
        const x = padX + (items.length > 1 ? (idx / (items.length - 1)) * chartWidth : chartWidth / 2);
        return `<text x="${x.toFixed(1)}" y="${height-4}" text-anchor="middle" font-size="8" fill="#475569">${esc(pdfDateLabel(item.date))}</text>`;
      }).join("");
      const legend = metrics.map((metric,idx)=>`<span><i style="background:${metric.color}"></i>${esc(metric.label)}</span>`).join("");
      return `<div class="line-wrap"><svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Enquiry Calls Booking Line Chart"><line x1="${padX}" y1="${padY}" x2="${padX}" y2="${height-padY}" stroke="#cbd5e1"/><line x1="${padX}" y1="${height-padY}" x2="${width-padX}" y2="${height-padY}" stroke="#cbd5e1"/>${lines}${dots}${labels}</svg><div class="legend">${legend}</div></div>`;
    };
    const dashboard = activeRangeReport.dashboard;
    const dashboardHtml = dashboard ? (() => {
      const maxSource = Math.max(...dashboard.sourceMix.map(item=>item.value),1);
      const maxProject = Math.max(...dashboard.projectMix.map(item=>item.value),1);
      const sourceBars = dashboard.sourceMix.slice(0,8).map((item,idx)=>`<div class="bar-row"><span>${esc(item.name)}</span><b style="width:${Math.max((item.value/maxSource)*100,4)}%;background:${PIE_COLORS[idx%PIE_COLORS.length]}">${formatReportValue(item.value)}</b></div>`).join("");
      const projectBars = dashboard.projectMix.slice(0,8).map((item,idx)=>`<div class="bar-row"><span>${esc(item.name)}</span><b style="width:${Math.max((item.value/maxProject)*100,4)}%;background:${PIE_COLORS[(idx+3)%PIE_COLORS.length]}">${formatReportValue(item.value)}</b></div>`).join("");
      const trendItems = dashboard.trend.slice(-10);
      const maxTrendEnquiry = Math.max(...trendItems.map(item=>item.enquiry),1);
      const trend = trendItems.map(item=>`<div class="trend-col"><strong>${formatReportValue(item.enquiry)}</strong><span style="height:${Math.max((item.enquiry/maxTrendEnquiry)*130,8)}px;background:#38bdf8"></span><em>${esc(pdfDateLabel(item.date))}</em></div>`).join("");
      return `<section class="report-cover"><div class="cover-head"><div><h1>${esc(activeRangeReport.title)}</h1><p>${esc(pdfRangeLongLabel)}</p></div><img src="${DESAM_LOGO_ASSET}" alt="Logo"/></div><div class="metric-grid">${renderPdfKpiSection("Given Period", `${pdfDateLabel(reportStartDate)} to ${pdfDateLabel(reportEndDate)}`, dashboard.totals)}${renderPdfKpiSection("Today", pdfDateLabel(TODAY_STR), dashboard.todayTotals || dashboard.totals)}</div><div class="dash-grid"><div class="dash-card"><h3>Enquiry Trend</h3><div class="trend">${trend}</div></div><div class="dash-card"><h3>Enquiry, Calls & Booking Line</h3>${renderPdfLineChart(trendItems)}</div><div class="dash-card"><h3>Source Enquiry Share</h3>${sourceBars}</div><div class="dash-card"><h3>Project Enquiry Share</h3>${projectBars}</div></div></section>`;
    })() : "";
    const reportTables = hasSections
      ? activeRangeReport.sections.map(section=>{
          const sectionHeaderRows = section.headerRows || [section.headers];
          const headerRows = sectionHeaderRows.map((row,rowIdx)=>`<tr>${row.map((h,colIdx)=>{
            const span = section.headerColSpans?.[rowIdx]?.[colIdx] ?? 1;
            if(span===0)return "";
            return `<th${span>1?` colspan="${span}"`:""}>${esc(h)}</th>`;
          }).join("")}</tr>`).join("");
          const bodyRows = section.rows.map(r=>`<tr${r[0]==="TOTAL"?` style="font-weight:700;background:#f8fafc"`:""}>${r.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("");
          const totalRow = section.totals ? `<tr style="font-weight:700;background:#f8fafc">${section.totals.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>` : "";
          return `<h2>${esc(section.title)}${section.subtitle?`<span>${esc(section.subtitle)}</span>`:""}</h2><p class="report-date">${esc(pdfRangeLongLabel)}</p><table><thead>${headerRows}</thead><tbody>${bodyRows}${totalRow}</tbody></table>`;
        }).join("")
      : `<h2>${esc(activeRangeReport.title)}</h2><table><thead><tr>${headers.map(h=>`<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${activeRangeReport.rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("")}<tr style="font-weight:700;background:#f8fafc">${activeRangeReport.totals.map(c=>`<td>${esc(c)}</td>`).join("")}</tr></tbody></table>`;
    const win = window.open("", "_blank");
    if(!win){ triggerToastAlert("Allow popup to export PDF."); return; }
    win.document.write(`<html><head><title>${esc(fileStem)}</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#111}h1{font-size:20px}h2{font-size:15px;margin:24px 0 2px;text-align:center}h2 span{display:block;font-size:12px;margin-top:3px}.report-date{text-align:center;font-size:11px;margin:0 0 8px;color:#475569}table{width:100%;border-collapse:collapse;margin-top:8px;font-size:11px;table-layout:fixed}th,td{border:1px solid #111;padding:5px;text-align:center;vertical-align:middle;width:90px}th{background:#f1f5f9;font-weight:700}.cover-head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #111;padding-bottom:10px}.cover-head img{height:38px;object-fit:contain}.metric-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0}.metric-section{border:1px solid #cbd5e1;padding:10px;background:#f8fafc}.metric-section h3{margin:0;text-align:center;font-size:13px}.metric-section p{margin:3px 0 8px;text-align:center;font-size:10px;color:#475569}.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.box{border:1px solid #ddd;padding:7px;text-align:center;background:#fff;font-size:9px}.box b{display:block;font-size:15px}.dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.dash-card{border:1px solid #ddd;padding:10px;min-height:180px}.dash-card h3{text-align:center;margin:0 0 10px;font-size:13px}.bar-row{display:grid;grid-template-columns:105px 1fr;gap:8px;align-items:center;margin:7px 0;font-size:10px}.bar-row b{display:block;color:#fff;text-align:right;padding:4px;border-radius:3px;min-width:22px}.trend{height:160px;display:flex;align-items:flex-end;gap:6px;border-left:1px solid #ddd;border-bottom:1px solid #ddd;padding:8px}.trend-col{display:flex;flex-direction:column;align-items:center;gap:4px;flex:1}.trend-col strong{font-size:9px;font-weight:700}.trend-col span{width:100%;display:block;border-radius:3px 3px 0 0}.trend-col em{font-size:8px;font-style:normal}.line-wrap svg{width:100%;height:160px}.legend{display:flex;justify-content:center;gap:10px;font-size:9px}.legend span{display:inline-flex;align-items:center;gap:4px}.legend i{width:9px;height:9px;display:inline-block;border-radius:99px}.report-cover{page-break-after:always}.table-head{display:flex;justify-content:flex-end;margin-top:12px}.table-head img{height:30px}@media print{body{padding:12px}table{page-break-inside:auto}tr{page-break-inside:avoid}.report-cover{min-height:96vh}}</style></head><body>${dashboardHtml || `<div class="table-head"><img src="${DESAM_LOGO_ASSET}" alt="Logo"/></div><h1>${esc(activeRangeReport.title)}</h1><p style="text-align:center">${esc(pdfRangeLongLabel)}</p><div class="kpis"><div class="box">Enquiry<b>${formatReportValue(selectedRangeReportTotals.source.enquiry)}</b></div><div class="box">Calls<b>${formatReportValue(selectedRangeReportTotals.people.calls)}</b></div><div class="box">Followup<b>${formatReportValue(selectedRangeReportTotals.people.followup)}</b></div><div class="box">SV Planned<b>${formatReportValue(selectedRangeReportTotals.people.siteVisitPlanned)}</b></div><div class="box">SV Done<b>${formatReportValue(selectedRangeReportTotals.people.siteVisitDone)}</b></div><div class="box">Booking<b>${formatReportValue(selectedRangeReportTotals.people.booking)}</b></div><div class="box">Conversion %<b>${formatReportValue(`${selectedRangeReportTotals.source.percentage}%`)}</b></div><div class="box">Cancellation<b>${formatReportValue(selectedRangeReportTotals.people.cancellation)}</b></div></div>`}${reportTables}<script>window.onload=()=>{window.print();}</script></body></html>`);
    win.document.close();
    triggerToastAlert("PDF report opened.");
  };

  const renderPeopleActivityTable = (title, rows) => (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2"><Users className="h-4 w-4 text-blue-400"/>{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[10px] whitespace-nowrap">
          <thead className="border-b border-slate-800 text-slate-500 uppercase font-bold"><tr><th className="p-3">Name</th><th className="p-3 text-center">Calls</th><th className="p-3 text-center">Followup</th><th className="p-3 text-center">SV Planned</th><th className="p-3 text-center">SV Done</th><th className="p-3 text-center">Booking</th><th className="p-3 text-center">Registration</th><th className="p-3 text-center">Cancellation</th><th className="p-3 text-center">Productivity %</th></tr></thead>
          <tbody className="divide-y divide-slate-800">
            {rows.length===0?<tr><td colSpan="9" className="p-5 text-center text-slate-500 font-bold uppercase tracking-wider">No activity</td></tr>:rows.map(row=>(
              <tr key={`${title}-${row.name}`} className="hover:bg-slate-900/50">
                <td className="p-3 font-black text-white">{row.name}</td><td className="p-3 text-center font-mono">{formatReportValue(row.calls)}</td><td className="p-3 text-center font-mono text-blue-400">{formatReportValue(row.followup)}</td><td className="p-3 text-center font-mono text-violet-400">{formatReportValue(row.siteVisitPlanned)}</td><td className="p-3 text-center font-mono text-emerald-400">{formatReportValue(row.siteVisitDone)}</td><td className="p-3 text-center font-mono text-purple-400">{formatReportValue(row.booking)}</td><td className="p-3 text-center font-mono text-amber-400">{formatReportValue(row.registration)}</td><td className="p-3 text-center font-mono text-rose-400">{formatReportValue(row.cancellation)}</td><td className="p-3 text-center font-mono text-orange-400 font-black">{formatReportValue(row.productivity)}</td>
              </tr>
            ))}
          </tbody>
          {rows.length>0&&<tfoot className="border-t border-slate-700 bg-slate-900/70 text-white font-black"><tr><td className="p-3">TOTAL</td><td className="p-3 text-center font-mono">{formatReportValue(rows.reduce((s,r)=>s+(r.calls||0),0))}</td><td className="p-3 text-center font-mono">{formatReportValue(rows.reduce((s,r)=>s+(r.followup||0),0))}</td><td className="p-3 text-center font-mono">{formatReportValue(rows.reduce((s,r)=>s+(r.siteVisitPlanned||0),0))}</td><td className="p-3 text-center font-mono">{formatReportValue(rows.reduce((s,r)=>s+(r.siteVisitDone||0),0))}</td><td className="p-3 text-center font-mono">{formatReportValue(rows.reduce((s,r)=>s+(r.booking||0),0))}</td><td className="p-3 text-center font-mono">{formatReportValue(rows.reduce((s,r)=>s+(r.registration||0),0))}</td><td className="p-3 text-center font-mono">{formatReportValue(rows.reduce((s,r)=>s+(r.cancellation||0),0))}</td><td className="p-3 text-center font-mono text-orange-400">{formatReportValue(calculateBookingProductivity(rows.reduce((s,r)=>s+(r.booking||0),0),rows.reduce((s,r)=>s+(r.calls||0),0)))}</td></tr></tfoot>}
        </table>
      </div>
    </div>
  );

  const renderSourceReportTable = (title, rows) => (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2"><PieChart className="h-4 w-4 text-orange-400"/>{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[10px] whitespace-nowrap">
          <thead className="border-b border-slate-800 text-slate-500 uppercase font-bold"><tr><th className="p-3">Source</th><th className="p-3 text-center">Enquiry</th><th className="p-3 text-center">SV Planned</th><th className="p-3 text-center">SV Done</th><th className="p-3 text-center">Booking</th><th className="p-3 text-center">Conversion</th><th className="p-3 text-center">Cancellation</th><th className="p-3 text-center">Percentage</th></tr></thead>
          <tbody className="divide-y divide-slate-800">
            {rows.length===0?<tr><td colSpan="8" className="p-5 text-center text-slate-500 font-bold uppercase tracking-wider">No source data</td></tr>:rows.map(row=>(
              <tr key={`${title}-${row.source}`} className="hover:bg-slate-900/50">
                <td className="p-3 font-black text-white">{row.source}</td><td className="p-3 text-center font-mono">{formatReportValue(row.enquiry)}</td><td className="p-3 text-center font-mono text-violet-400">{formatReportValue(row.siteVisitPlanned)}</td><td className="p-3 text-center font-mono text-emerald-400">{formatReportValue(row.siteVisitDone)}</td><td className="p-3 text-center font-mono text-purple-400">{formatReportValue(row.booking)}</td><td className="p-3 text-center font-mono text-orange-400">{formatReportValue(row.conversion)}</td><td className="p-3 text-center font-mono text-rose-400">{formatReportValue(row.cancellation)}</td><td className="p-3 text-center font-mono text-orange-400 font-black">{formatReportValue(`${row.percentage}%`)}</td>
              </tr>
            ))}
          </tbody>
          {rows.length>0&&<tfoot className="border-t border-slate-700 bg-slate-900/70 text-white font-black"><tr><td className="p-3">TOTAL</td><td className="p-3 text-center font-mono">{formatReportValue(rows.reduce((s,r)=>s+(r.enquiry||0),0))}</td><td className="p-3 text-center font-mono">{formatReportValue(rows.reduce((s,r)=>s+(r.siteVisitPlanned||0),0))}</td><td className="p-3 text-center font-mono">{formatReportValue(rows.reduce((s,r)=>s+(r.siteVisitDone||0),0))}</td><td className="p-3 text-center font-mono">{formatReportValue(rows.reduce((s,r)=>s+(r.booking||0),0))}</td><td className="p-3 text-center font-mono">{formatReportValue(rows.reduce((s,r)=>s+(r.conversion||0),0))}</td><td className="p-3 text-center font-mono">{formatReportValue(rows.reduce((s,r)=>s+(r.cancellation||0),0))}</td><td className="p-3 text-center font-mono text-orange-400">{formatReportValue(`${rows.reduce((s,r)=>s+(r.enquiry||0),0)?((rows.reduce((s,r)=>s+(r.conversion||0),0)/rows.reduce((s,r)=>s+(r.enquiry||0),0))*100).toFixed(1):"0.0"}%`)}</td></tr></tfoot>}
        </table>
      </div>
    </div>
  );

  const renderReportDashboard = (dashboard) => {
    if(!dashboard)return null;
    const kpis = [
      ["Enquiry", dashboard.totals.enquiry, "text-cyan-300"],
      ["Calls", dashboard.totals.calls, "text-orange-400"],
      ["Followup", dashboard.totals.followup, "text-blue-400"],
      ["SV Plan", dashboard.totals.svPlan, "text-violet-400"],
      ["SV Done", dashboard.totals.svDone, "text-emerald-400"],
      ["Booking", dashboard.totals.booking, "text-purple-400"],
      ["Conversion", dashboard.totals.conversion, "text-lime-400"],
      ["Productivity", dashboard.totals.callProductivity, "text-amber-400"],
    ];
    return (
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div><h3 className="text-lg font-black text-white uppercase tracking-wider">Management Dashboard</h3><p className="text-[10px] text-slate-500 mt-1">{reportStartDate} to {reportEndDate}</p></div>
          <img src={DESAM_LOGO_ASSET} alt="Desam" className="h-8 w-auto object-contain"/>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2 text-[10px]">
          {kpis.map(([label,value,color])=><div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center"><p className="text-slate-500 uppercase font-bold">{label}</p><p className={`text-lg font-black font-mono mt-1 ${color}`}>{formatReportValue(value)}</p></div>)}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4"><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Line: Enquiry to Booking Trend</h4><div className="h-64"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={dashboard.trend}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/><XAxis dataKey="date" stroke="#64748b" fontSize={10}/><YAxis stroke="#64748b" fontSize={10}/><Tooltip contentStyle={{backgroundColor:'#020617',border:'1px solid #334155',borderRadius:'10px',fontSize:'11px',color:'#f8fafc'}} labelStyle={{color:'#f8fafc',fontWeight:400}} itemStyle={{color:'#f8fafc',fontWeight:400}}/><Legend wrapperStyle={{fontSize:'10px'}}/><Line type="monotone" dataKey="enquiry" name="Enquiry" stroke="#38bdf8" strokeWidth={3}/><Line type="monotone" dataKey="calls" name="Calls" stroke="#f97316" strokeWidth={3}/><Line type="monotone" dataKey="booking" name="Booking" stroke="#a855f7" strokeWidth={3}/></ComposedChart></ResponsiveContainer></div></div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4"><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Source Enquiry Share</h4><div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={dashboard.sourceMix} cx="50%" cy="50%" innerRadius={58} outerRadius={92} paddingAngle={3} dataKey="value">{dashboard.sourceMix.map((entry,index)=><Cell key={`src-${index}`} fill={PIE_COLORS[index%PIE_COLORS.length]}/>)}</Pie><Tooltip contentStyle={{backgroundColor:'#020617',border:'1px solid #334155',borderRadius:'10px',fontSize:'11px',color:'#f8fafc'}} labelStyle={{color:'#f8fafc',fontWeight:400}} itemStyle={{color:'#f8fafc',fontWeight:400}}/><Legend wrapperStyle={{fontSize:'10px'}}/></PieChart></ResponsiveContainer></div></div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4"><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Project Enquiry Share</h4><div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={dashboard.projectMix} cx="50%" cy="50%" outerRadius={92} dataKey="value" label>{dashboard.projectMix.map((entry,index)=><Cell key={`proj-${index}`} fill={PIE_COLORS[(index+4)%PIE_COLORS.length]}/>)}</Pie><Tooltip contentStyle={{backgroundColor:'#020617',border:'1px solid #334155',borderRadius:'10px',fontSize:'11px',color:'#f8fafc'}} labelStyle={{color:'#f8fafc',fontWeight:400}} itemStyle={{color:'#f8fafc',fontWeight:400}}/></PieChart></ResponsiveContainer></div></div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4"><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Column: Executive Calls Vs Booking</h4><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={dashboard.executiveBars}><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/><XAxis dataKey="name" stroke="#64748b" fontSize={9}/><YAxis stroke="#64748b" fontSize={10}/><Tooltip contentStyle={{backgroundColor:'#020617',border:'1px solid #334155',borderRadius:'10px',fontSize:'11px',color:'#f8fafc'}} labelStyle={{color:'#f8fafc',fontWeight:400}} itemStyle={{color:'#f8fafc',fontWeight:400}}/><Legend wrapperStyle={{fontSize:'10px'}}/><Bar dataKey="calls" name="Calls" fill="#f97316" radius={[4,4,0,0]}/><Bar dataKey="booking" name="Booking" fill="#a855f7" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div></div>
        </div>
      </div>
    );
  };

  const renderActiveRangeReportTable = () => {
    const columnStyle = (rows, index) => {
      const columnCount = rows[0]?.length || 1;
      const width = columnCount > 18 ? 92 : columnCount > 12 ? 104 : 118;
      return { minWidth:`${width}px`, width:`${width}px` };
    };
    if (Array.isArray(activeRangeReport.sections)) {
      return (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-blue-400"/>{activeRangeReport.title}</h3>
          {renderReportDashboard(activeRangeReport.dashboard)}
          <div className="space-y-7">
            {activeRangeReport.sections.map(section=>{
              const sectionRowsForWidth = [...(section.headerRows || [section.headers]), ...section.rows, ...(section.totals ? [section.totals] : [])];
              return (
              <div key={section.title} className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 text-center text-[11px] font-black text-orange-300 uppercase tracking-wider">{section.title}{section.subtitle&&<span className="block text-[10px] text-slate-400 mt-1">{section.subtitle}</span>}</div>
                <table className="w-full table-fixed text-left text-[10px] whitespace-nowrap border-collapse">
                  <colgroup>{section.headers.map((_,i)=><col key={`${section.title}-col-${i}`} style={columnStyle(sectionRowsForWidth,i)}/>)}</colgroup>
                  <thead className="bg-slate-900 text-slate-300 uppercase font-black">
                    {(section.headerRows || [section.headers]).map((headerRow,rowIdx)=><tr key={`${section.title}-head-${rowIdx}`}>{headerRow.map((h,i)=>{
                      const span = section.headerColSpans?.[rowIdx]?.[i] ?? 1;
                      if(span===0)return null;
                      return <th key={`${section.title}-${rowIdx}-${h}-${i}`} colSpan={span} style={columnStyle(sectionRowsForWidth,i)} className={`p-2.5 border border-slate-800 text-center align-middle ${i===0?"text-orange-300":"text-slate-300"}`}>{h}</th>;
                    })}</tr>)}
                  </thead>
                  <tbody>
                    {section.rows.length===0?<tr><td colSpan={section.headers.length} className="p-5 text-center text-slate-500 font-bold uppercase tracking-wider border border-slate-800">No report data</td></tr>:section.rows.map((row,idx)=>(
                      <tr key={`${section.title}-${idx}`} className={`hover:bg-slate-900/60 ${row[0]==="TOTAL"?"bg-slate-900/80 font-black":""}`}>
                        {row.map((cell,i)=><td key={`${section.title}-${idx}-${i}`} style={columnStyle(sectionRowsForWidth,i)} className={`p-2.5 border border-slate-800 align-middle ${i===0?"font-black text-white text-left":"text-center font-mono text-slate-300"} ${i===row.length-1||row[0]==="TOTAL"?"font-black text-orange-400":""}`}>{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                  {section.totals&&<tfoot className="bg-slate-900/90 text-white font-black"><tr>{section.totals.map((cell,i)=><td key={`${section.title}-total-${i}`} style={columnStyle(sectionRowsForWidth,i)} className={`p-2.5 border border-slate-700 align-middle ${i===0?"text-left":"text-center font-mono text-orange-400"}`}>{cell}</td>)}</tr></tfoot>}
                </table>
              </div>
              );
            })}
          </div>
        </div>
      );
    }
    const activeRowsForWidth = [activeRangeReport.headers, ...activeRangeReport.rows, activeRangeReport.totals];
    return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-blue-400"/>{activeRangeReport.title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-left text-[10px] whitespace-nowrap">
          <colgroup>{activeRangeReport.headers.map((_,i)=><col key={`active-col-${i}`} style={columnStyle(activeRowsForWidth,i)}/>)}</colgroup>
          <thead className="border-b border-slate-800 text-slate-500 uppercase font-bold"><tr>{activeRangeReport.headers.map((h,i)=><th key={h} style={columnStyle(activeRowsForWidth,i)} className={`p-3 text-center align-middle ${i===0?"text-left":""}`}>{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-800">
            {activeRangeReport.rows.length===0?<tr><td colSpan={activeRangeReport.headers.length} className="p-5 text-center text-slate-500 font-bold uppercase tracking-wider">No report data</td></tr>:activeRangeReport.rows.map((row,idx)=>{
              const rowKey = activeRangeReport.rowKeys?.[idx] || `${activeRangeReport.title}-${idx}`;
              const detailRows = activeRangeReport.details?.[idx] || [];
              const isExpanded = expandedRangeReportKey === rowKey;
              return (
                <React.Fragment key={rowKey}>
                  <tr className="hover:bg-slate-900/50">
                    {row.map((cell,i)=><td key={`${idx}-${i}`} style={columnStyle(activeRowsForWidth,i)} className={`p-3 align-middle ${i===0?"font-black text-white":"text-center font-mono text-slate-300"}`}>{i===0?<button type="button" onClick={()=>setExpandedRangeReportKey(isExpanded?"":rowKey)} className="flex items-center gap-2 text-left text-white hover:text-blue-300 transition-colors"><span className="inline-flex h-5 w-5 items-center justify-center rounded bg-slate-900 border border-slate-700 text-[10px]">{isExpanded?"-":"+"}</span><span>{cell}</span><span className="text-[9px] text-slate-500 font-mono">({detailRows.length})</span></button>:cell}</td>)}
                  </tr>
                  {isExpanded&&(
                    <tr className="bg-slate-950/80">
                      <td colSpan={activeRangeReport.headers.length} className="p-0">
                        <div className="p-3 border-t border-blue-500/20 bg-blue-950/10">
                          <div className="overflow-x-auto rounded-xl border border-slate-800">
                            <table className="w-full text-left text-[10px] whitespace-nowrap">
                              <thead className="bg-slate-900/80 text-slate-500 uppercase font-black"><tr><th className="p-2.5">Customer</th><th className="p-2.5">Phone</th><th className="p-2.5">Project</th><th className="p-2.5">Source</th><th className="p-2.5">Owner</th><th className="p-2.5">Status</th><th className="p-2.5">Enquiry</th><th className="p-2.5">Follow-up</th><th className="p-2.5">Last Activity</th><th className="p-2.5">Remark</th></tr></thead>
                              <tbody className="divide-y divide-slate-800">
                                {detailRows.length===0?<tr><td colSpan="10" className="p-4 text-center text-slate-500 font-bold uppercase tracking-wider">No customers found for this row</td></tr>:detailRows.map(detail=><tr key={`${rowKey}-${detail.id}`} className="hover:bg-slate-900/50"><td className="p-2.5 font-black text-white">{detail.hasLeadRecord?<button onClick={()=>{const lead=leads.find(l=>l.id===detail.id); if(lead)setSelectedLead(lead);}} className="hover:text-orange-400 underline-offset-4 hover:underline">{detail.name}</button>:detail.name}</td><td className="p-2.5 font-mono text-slate-400">{detail.phone||"-"}</td><td className="p-2.5 text-orange-400 font-bold">{detail.project||"-"}</td><td className="p-2.5 text-slate-300">{detail.source||"-"}</td><td className="p-2.5 text-blue-300 font-bold">{detail.owner||"-"}</td><td className="p-2.5"><span className="px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider" style={{backgroundColor:SC[detail.status]?.bg||"rgba(148,163,184,0.12)",color:SC[detail.status]?.text||"#cbd5e1",border:`1px solid ${SC[detail.status]?.border||"rgba(148,163,184,0.2)"}`}}>{detail.status||"-"}</span></td><td className="p-2.5 font-mono text-slate-400">{detail.enquiryDate}</td><td className="p-2.5 font-mono text-blue-300">{detail.followUp}</td><td className="p-2.5 font-mono text-slate-400">{detail.lastActivity}</td><td className="p-2.5 text-slate-400 max-w-[260px] truncate" title={detail.remark}>{detail.remark}</td></tr>)}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
          {activeRangeReport.rows.length>0&&<tfoot className="border-t border-slate-700 bg-slate-900/80 text-white font-black"><tr>{activeRangeReport.totals.map((cell,i)=><td key={`total-${i}`} style={columnStyle(activeRowsForWidth,i)} className={`p-3 align-middle ${i===0?"text-left":"text-center font-mono text-orange-400"}`}>{cell}</td>)}</tr></tfoot>}
        </table>
      </div>
    </div>
    );
  };

  const navItems = [
    {id:"dashboard",icon:<Layers/>,label:"DASHBOARD"},
    {id:"leads",icon:<PhoneCall/>,label:"LEAD CHANNELS"},
    {id:"activity",icon:<ClipboardList/>,label:"ACTIVITY LOGS"},
    {id:"projects",icon:<Building2/>,label:"PROJECT MASTER"},
    {id:"templates",icon:<MessageSquare/>,label:"WHATSAPP TEMPLATES"},
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
            {notificationPermission!=="granted"&&currentUser&&(
              <button onClick={requestBrowserNotifications} className="relative flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl hover:bg-emerald-500/20 transition-colors">
                <Bell className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Enable Alerts</span>
              </button>
            )}
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
              {unattendedLeadAlerts.length>0&&(<div className="bg-amber-950/50 border border-amber-400/50 p-4 lg:p-5 rounded-2xl flex items-start gap-4 shadow-xl shadow-amber-950/20"><div className="bg-amber-400/20 p-2 rounded-full border border-amber-300/40 mt-0.5"><AlertTriangle className="h-5 w-5 text-amber-300 animate-pulse"/></div><div className="flex-1"><h3 className="text-amber-200 font-black text-xs uppercase tracking-wider">Unattended Leads Alert</h3><p className="text-amber-50/85 text-xs mt-1.5 font-medium">{unattendedLeadAlerts.length} unattended lead{unattendedLeadAlerts.length>1?"s":""} need action from the assigned user and branch manager.</p><div className="mt-3 flex flex-wrap gap-2">{unattendedLeadAlerts.slice(0,4).map(l=><button key={l.id} onClick={()=>setSelectedLead(l)} className="text-[10px] font-black text-amber-50 bg-amber-400/15 hover:bg-amber-400/25 border border-amber-300/30 px-3 py-1.5 rounded-lg transition-colors">{l.name} · {l.assignedTo||"Unassigned"}</button>)}</div></div></div>)}
              {(newLeadDashboardItems.length>0||dueFollowUpLeads.length>0)&&(
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {newLeadDashboardItems.length>0&&(
                    <div className="bg-teal-950/25 border border-teal-500/30 p-4 lg:p-5 rounded-2xl shadow-xl">
                      <div className="flex items-center justify-between gap-3 mb-3"><h3 className="text-teal-200 font-black text-xs uppercase tracking-wider flex items-center gap-2"><Star className="h-4 w-4"/> New Leads</h3><div className="flex items-center gap-2"><span className="text-[10px] text-teal-100/70 font-black uppercase tracking-wider">{newLeadDashboardItems.length} active</span>{newLeadDashboardItems.length>2&&<button onClick={()=>setShowAllDashboardNewLeads(v=>!v)} className="text-[10px] font-black text-teal-100 bg-teal-500/15 hover:bg-teal-500/25 border border-teal-400/30 px-2.5 py-1 rounded-lg transition-colors">{showAllDashboardNewLeads?"Show less":"View all"}</button>}</div></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {newLeadDashboardItems.slice(0,showAllDashboardNewLeads?newLeadDashboardItems.length:2).map(l=><button key={l.id} onClick={()=>setSelectedLead(l)} className="text-left bg-slate-950/80 hover:bg-slate-950 border border-teal-500/20 hover:border-teal-400/50 rounded-xl p-3 transition-colors"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="text-xs font-black text-white truncate">{l.name}</p><p className="text-[10px] text-slate-500 font-mono mt-0.5">{l.phone}</p></div><span className="shrink-0 bg-teal-500 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider">NEW</span></div><div className="mt-2 grid grid-cols-2 gap-2 text-[10px]"><p className="text-teal-300 font-bold truncate">{l.project}</p><p className="text-slate-400 font-mono text-right">{formatDateTimeLabel(l)}</p></div><p className="text-[10px] text-slate-500 mt-1 truncate">Assigned: {l.assignedTo||"Unassigned"}</p></button>)}
                      </div>
                    </div>
                  )}
                  {dueFollowUpLeads.length>0&&(
                    <div className="bg-blue-950/30 border border-blue-500/30 p-4 lg:p-5 rounded-2xl shadow-xl">
                      <div className="flex items-center justify-between gap-3 mb-3"><h3 className="text-blue-300 font-black text-xs uppercase tracking-wider flex items-center gap-2"><Clock className="h-4 w-4"/> Follow-Up Reminders</h3><div className="flex items-center gap-2"><span className="text-[10px] text-blue-200/70 font-black uppercase tracking-wider">{dueFollowUpLeads.length} due today</span>{dueFollowUpLeads.length>2&&<button onClick={()=>setShowAllDashboardFollowUps(v=>!v)} className="text-[10px] font-black text-blue-100 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-400/30 px-2.5 py-1 rounded-lg transition-colors">{showAllDashboardFollowUps?"Show less":"View all"}</button>}</div></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {dueFollowUpLeads.slice(0,showAllDashboardFollowUps?dueFollowUpLeads.length:2).map(l=><button key={l.id} onClick={()=>setSelectedLead(l)} className="text-left bg-slate-950/80 hover:bg-slate-950 border border-blue-500/20 hover:border-blue-500/50 rounded-xl p-3 transition-colors"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="text-xs font-black text-white truncate">{l.name}</p><p className="text-[10px] text-slate-500 font-mono mt-0.5">{l.phone}</p></div><span className="shrink-0 bg-blue-500 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider">DUE</span></div><div className="mt-2 grid grid-cols-2 gap-2 text-[10px]"><p className="text-blue-400 font-bold truncate">{l.project}</p><p className="text-slate-400 font-mono text-right">{l.nextFollowUp}</p></div>{currentUser.role==="Admin"&&<p className="text-[10px] text-blue-300 font-black mt-1 truncate">Owner: {l.assignedTo||"Unassigned"}</p>}</button>)}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3">
                <KpiTile label="Total Calls" value={activityKPIs.totalCalls.toLocaleString()} icon={<Phone/>} color="#ea580c"/>
                <KpiTile label="Followup Calls" value={activityKPIs.totalFollowupCalls.toLocaleString()} icon={<PhoneCall/>} color="#38bdf8"/>
                <KpiTile label="Followups" value={activityKPIs.totalFollowups.toLocaleString()} icon={<PhoneCall/>} color="#3b82f6"/>
                <KpiTile label="SV Planned" value={activityKPIs.totalSiteVisitPlanned} icon={<Calendar/>} color="#8b5cf6"/>
                <KpiTile label="SV Done" value={activityKPIs.totalSiteVisitDone} icon={<MapPin/>} color="#10b981"/>
                <KpiTile label="Bookings" value={activityKPIs.totalBookings} icon={<BookOpen/>} color="#8b5cf6"/>
                <KpiTile label="Registration" value={activityKPIs.totalRegistrations} icon={<UserCheck/>} color="#f59e0b"/>
                <KpiTile label="Cancellation" value={activityKPIs.totalCancellations} icon={<XCircle/>} color="#ef4444"/>
                <KpiTile label="Conversion %" value={`${activityKPIs.convRate}%`} icon={<TrendingUp/>} color="#a3e635"/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Scoped Leads <Briefcase className="h-4 w-4 text-orange-400"/></p><p className="text-3xl font-black text-white mt-1">{processedLeads.length}</p></div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">New Today <Star className="h-4 w-4 text-teal-300"/></p><p className="text-3xl font-black text-teal-300 mt-1">{newLeadDashboardItems.length}</p></div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Active Leads <Activity className="h-4 w-4 text-blue-400"/></p><p className="text-3xl font-black text-blue-400 mt-1">{activeScopedLeadCount}</p></div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl"><p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Inactive / Unreachable <XCircle className="h-4 w-4 text-rose-400"/></p><p className="text-3xl font-black text-rose-400 mt-1">{inactiveScopedLeadCount}</p></div>
                <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">Prospect Status <TrendingUp className="h-4 w-4 text-amber-300"/></p>
                  <div className="mt-3 space-y-2">
                    {prospectStatusSummary.map(item => {
                      const style = PROSPECT_STATUS_STYLES[item.status];
                      return <button key={item.status} type="button" onClick={()=>setProspectStatusPopup({isOpen:true,status:item.status})} className="w-full flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-black transition-colors hover:bg-slate-900" style={{borderColor:style.border,color:style.color,backgroundColor:style.bg}}><span>{item.status}</span><span className="font-mono">{item.count}</span></button>;
                    })}
                  </div>
                </div>
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
                <div className="relative flex-1 min-w-[220px]"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500"/><input type="text" value={globalSearch} onChange={e=>setGlobalSearch(e.target.value)} placeholder="Search client by name or phone..." className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-300 focus:outline-none focus:border-orange-500"/></div>
                <select value={filterSource} onChange={e=>setFilterSource(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-orange-500 flex-1 min-w-[140px]"><option value="All">All Sources</option>{SOURCES.map(s=><option key={s} value={s}>{s}</option>)}</select>
                <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-orange-500 flex-1 min-w-[140px]"><option value="All">All Statuses</option>{STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select>
                <select value={filterProject} onChange={e=>setFilterProject(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-orange-500 flex-1 min-w-[140px]"><option value="All">All Projects</option>{visibleProjects.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select>
                {["Admin","Manager"].includes(currentUser.role)&&<select value={filterExecutive} onChange={e=>setFilterExecutive(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-orange-500 flex-1 min-w-[140px]"><option value="All">All Assignees</option><option value="Unassigned">Unassigned</option>{assignableUsers.map(u=><option key={u.id} value={u.name}>{u.name}</option>)}</select>}
                <div className="flex items-center gap-2 flex-1 min-w-[230px]"><CalendarDateInput value={startDate} onChange={setStartDate} className="rounded-lg py-2 text-slate-300 text-[10px]"/><span className="text-slate-600">-</span><CalendarDateInput value={endDate} onChange={setEndDate} className="rounded-lg py-2 text-slate-300 text-[10px]"/></div>
                {(globalSearch||filterSource!=="All"||filterStatus!=="All"||filterProject!=="All"||filterExecutive!=="All"||startDate||endDate)&&<button onClick={()=>{setGlobalSearch("");setFilterSource("All");setFilterStatus("All");setFilterProject("All");setFilterExecutive("All");setStartDate("");setEndDate("");}} className="text-orange-400 hover:text-orange-300 font-bold px-3 py-2 border border-orange-500/30 rounded-lg flex items-center gap-1 bg-orange-500/10"><X className="h-3.5 w-3.5"/> Clear</button>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {processedLeads.map(lead=>(
                  <div key={lead.id} onClick={()=>setSelectedLead(lead)} className="bg-slate-950 border border-slate-800 rounded-xl p-4 hover:border-orange-500/50 cursor-pointer transition-all shadow-md group relative">
                     {isFreshLead(lead)&&<div className="absolute top-3 right-3 flex items-center gap-1"><span className="bg-orange-500 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-lg">NEW</span><span className="h-2.5 w-2.5 bg-orange-400 rounded-full animate-ping"/></div>}
                     <div className="flex justify-between items-start mb-3">
                       <div><h3 className="text-sm font-black text-white group-hover:text-orange-400 transition-colors">{lead.name}</h3><div className="flex items-center gap-1.5 mt-1"><Phone className="h-3 w-3 text-slate-500"/><span className="text-[11px] text-slate-400 font-mono">{lead.phone}</span></div></div>
                       <span className="px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider" style={{backgroundColor:SC[lead.status]?.bg,color:SC[lead.status]?.text,border:`1px solid ${SC[lead.status]?.border}`}}>{lead.status}</span>
                     </div>
                     <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4 p-3 bg-slate-900/50 rounded-lg border border-slate-800/50">
                       <div><p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Project</p><p className="text-xs text-orange-400 font-bold truncate" title={lead.project}>{lead.project}</p></div>
                       <div><p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Budget</p><p className="text-xs text-slate-300 font-mono font-bold">₹{lead.budget}L</p></div>
                       <div><p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Assigned</p><p className="text-xs text-slate-300 font-bold truncate">{lead.assignedTo}</p></div>
                       <div><p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Source</p><p className="text-xs text-slate-400 truncate">{lead.source}</p></div>
                       <div className="col-span-2"><p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Enquiry Date</p><p className="text-xs text-orange-300 font-mono font-bold">{formatDateTimeLabel(lead)||"Not recorded"}</p></div>
                     </div>
                     <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-800/60">
                       <div onClick={e=>e.stopPropagation()}><MobileCallButton phone={lead.phone} leadName={lead.name} prospectStatus={getProspectStatus(lead)} onFeedbackSaved={(f)=>handleCallFeedback(lead.id, f)} currentUser={currentUser} TODAY_STR={TODAY_STR} /></div>
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
                <div><h1 className="text-lg lg:text-xl font-black text-white flex items-center gap-2"><ClipboardList className="h-5 w-5 text-emerald-500"/> Activity Tracker</h1><p className="text-[10px] text-slate-500 mt-1">{customerActivityRows.length} customer summaries recorded.</p></div>
                {currentUser.role==="Admin"&&<button onClick={()=>executeDataExportSequence("excel")} className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 font-black text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg"><Download className="h-4 w-4"/> Export</button>}
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 text-xs">
                 <div className="flex flex-wrap gap-3">
                   <div className="relative flex-1 min-w-[220px]"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500"/><input type="text" value={activitySearch} onChange={e=>setActivitySearch(e.target.value)} placeholder="Search client, phone, user, project..." className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500"/></div>
                   {["Admin","Manager"].includes(currentUser.role)&&<select value={actFilterExec} onChange={e=>setActFilterExec(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500 flex-1 min-w-[120px]"><option value="All">All Executives</option>{visibleUsers.map(u=><option key={u.id} value={u.name}>{u.name}</option>)}</select>}
                   <select value={actFilterProject} onChange={e=>setActFilterProject(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500 flex-1 min-w-[120px]"><option value="All">All Projects</option>{visibleProjects.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select>
                   <select value={actFilterSource} onChange={e=>setActFilterSource(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500 flex-1 min-w-[120px]"><option value="All">All Sources</option>{SOURCES.map(s=><option key={s} value={s}>{s}</option>)}</select>
                   <div className="flex items-center gap-2 flex-1 min-w-[230px]"><CalendarDateInput value={actStartDate} onChange={setActStartDate} className="rounded-lg py-2 text-slate-300 focus:border-emerald-500"/><span className="text-slate-600">-</span><CalendarDateInput value={actEndDate} onChange={setActEndDate} className="rounded-lg py-2 text-slate-300 focus:border-emerald-500"/></div>
                   {(activitySearch||actFilterExec!=="All"||actFilterProject!=="All"||actFilterSource!=="All"||actFilterStatus!=="All"||actStartDate!==TODAY_STR||actEndDate!==TODAY_STR)&&<button onClick={()=>{setActivitySearch("");setActFilterExec("All");setActFilterProject("All");setActFilterSource("All");setActFilterStatus("All");setActStartDate(TODAY_STR);setActEndDate(TODAY_STR);}} className="text-emerald-400 hover:text-emerald-300 font-bold px-3 py-2 border border-emerald-500/30 rounded-lg flex items-center gap-1 bg-emerald-500/10"><X className="h-3.5 w-3.5"/> Clear</button>}
                 </div>
                 <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/40">
                   <table className="w-full text-left text-[10px] whitespace-nowrap">
                     <thead className="border-b border-slate-800 text-slate-500 uppercase font-bold bg-slate-950">
                      <tr><th className="p-3">Last Contacted</th><th className="p-3">User</th><th className="p-3">Client</th><th className="p-3">Phone</th><th className="p-3">Project</th><th className="p-3">Source</th><th className="p-3 text-center">Calls</th><th className="p-3 text-center">FU</th><th className="p-3 text-center">SV Plan</th><th className="p-3 text-center">SV Done</th><th className="p-3 text-center">BK</th><th className="p-3 text-center">Reg.</th><th className="p-3 text-center">Cxl.</th><th className="p-3">Last Remark</th></tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800">
                      {customerActivityRows.length===0?<tr><td colSpan="14" className="p-6 text-center text-slate-500 font-bold uppercase tracking-wider">No activity found</td></tr>:customerActivityRows.map((log,i)=>(
                        <tr key={log.id||i} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-3 font-mono text-slate-400">{formatDateTimeLabel({date:log.lastContactedDate,time:log.lastContactedTime})}</td>
                          <td className="p-3 font-bold text-white">{log.executive}</td>
                          <td className="p-3"><button onClick={()=>{const lead=leads.find(l=>l.id===log.leadId)||leads.find(l=>stripPhone(l.phone)===stripPhone(log.phone)); if(lead)setSelectedLead(lead);}} className="font-black text-white hover:text-orange-400 underline-offset-4 hover:underline">{log.leadName}</button></td>
                          <td className="p-3 font-mono text-slate-400">{log.phone}</td>
                          <td className="p-3 text-orange-400 font-bold">{log.project}</td>
                          <td className="p-3 text-slate-400">{log.source}</td>
                          <td className="p-3 text-center font-mono font-black text-white">{log.callsMade}</td>
                          <td className="p-3 text-center text-blue-400 font-bold">{log.followup||"-"}</td>
                          <td className="p-3 text-center text-violet-400 font-bold">{log.siteVisitPlanned||"-"}</td>
                          <td className="p-3 text-center text-emerald-400 font-bold">{log.siteVisitDone||"-"}</td>
                          <td className="p-3 text-center text-purple-400 font-bold">{log.booking||"-"}</td>
                          <td className="p-3 text-center text-amber-400 font-bold">{log.registration||"-"}</td>
                          <td className="p-3 text-center text-rose-400 font-bold">{log.cancellation||"-"}</td>
                           <td className="p-3 text-slate-400 max-w-[220px] truncate" title={log.lastRemark}>{log.lastRemark||"-"}</td>
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
                {currentUser.role==="Admin"&&<button onClick={()=>setIsProjectModalOpen(true)} className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 text-white font-black text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"><Plus className="h-4 w-4"/> New Project</button>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {visibleProjects.map(proj=>{
                  const prjLeads = reportScopedLeads.filter(l=>l.project===proj.name);
                  const booked = prjLeads.filter(l=>["Booking Confirmed","Booked","Closed"].includes(l.status)).length;
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
                      {currentUser.role==="Admin"&&(
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
          {activeTab==="templates"&&(
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 p-5 border border-slate-800 rounded-2xl shadow-xl">
                <div><h1 className="text-lg lg:text-xl font-black text-white flex items-center gap-2"><MessageSquare className="h-5 w-5 text-emerald-500"/> WhatsApp Templates</h1><p className="text-[10px] text-slate-500 mt-1">{whatsappTemplates.length} saved project messages.</p></div>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {["Admin","Manager"].includes(currentUser.role)&&(
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl xl:col-span-1">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2"><Plus className="h-4 w-4 text-emerald-500"/> Create Template</h3>
                    <form onSubmit={handleCreateWhatsappTemplate} className="space-y-4 text-xs">
                      <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Project</label><select value={newWhatsappTemplateForm.project} onChange={e=>setNewWhatsappTemplateForm({...newWhatsappTemplateForm,project:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-emerald-500"><option value="All">All Projects</option>{visibleProjects.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select></div>
                      <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Title</label><input type="text" required value={newWhatsappTemplateForm.title} onChange={e=>setNewWhatsappTemplateForm({...newWhatsappTemplateForm,title:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500" placeholder="Initial call message"/></div>
                      <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Image URL</label><input type="url" value={newWhatsappTemplateForm.imageUrl} onChange={e=>setNewWhatsappTemplateForm({...newWhatsappTemplateForm,imageUrl:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500" placeholder="https://..."/></div>
                      <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Upload Image</label><input type="file" accept="image/*" onChange={e=>handleWhatsappTemplateImageUpload(e.target.files?.[0])} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 file:mr-3 file:border-0 file:bg-emerald-600 file:text-white file:rounded-lg file:px-3 file:py-1.5 file:text-[10px] file:font-black"/></div>
                      <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Message</label><textarea required rows={8} value={newWhatsappTemplateForm.message} onChange={e=>setNewWhatsappTemplateForm({...newWhatsappTemplateForm,message:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 resize-none" placeholder="Hello {name}, thank you for your interest in {project}."/></div>
                      <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center gap-2"><CheckCircle2 className="h-4 w-4"/> Save Template</button>
                    </form>
                  </div>
                )}
                <div className={`${["Admin","Manager"].includes(currentUser.role)?"xl:col-span-1":"xl:col-span-2"}`}>
                  {["Admin","Manager"].includes(currentUser.role)&&(
                    <div className="bg-slate-950 border border-emerald-500/20 rounded-2xl p-5 shadow-xl">
                      <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2"><Eye className="h-4 w-4 text-emerald-500"/> Template Preview</h3>
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden max-w-md">
                        {(newWhatsappTemplateForm.imageDataUrl||newWhatsappTemplateForm.imageUrl)&&<img src={newWhatsappTemplateForm.imageDataUrl||newWhatsappTemplateForm.imageUrl} alt="Template preview" className="w-full h-44 object-cover" onError={e=>{e.currentTarget.style.display='none';}}/>}
                        <div className="p-4 space-y-2"><p className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">{newWhatsappTemplateForm.project}</p><h4 className="text-sm font-black text-white">{newWhatsappTemplateForm.title||"Template title"}</h4><p className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed">{newWhatsappTemplateForm.message||"Message preview will appear here."}</p>{newWhatsappTemplateForm.imageUrl&&<p className="text-[10px] text-emerald-400 truncate font-mono">{newWhatsappTemplateForm.imageUrl}</p>}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {whatsappTemplates.length===0&&<div className="md:col-span-2 flex flex-col items-center justify-center py-16 bg-slate-950/40 border border-slate-800 border-dashed rounded-2xl"><MessageSquare className="h-8 w-8 text-slate-700 mb-3"/><p className="text-slate-500 text-xs font-bold uppercase tracking-wider">No templates saved</p></div>}
                  {whatsappTemplates.map(t=>(
                    <div key={t.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-emerald-500/40 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div><h3 className="text-sm font-black text-white">{t.title}</h3><p className="text-[10px] text-emerald-400 font-bold mt-1">{t.project}</p></div>
                        {currentUser.role==="Admin"&&<button onClick={()=>handleDeleteWhatsappTemplate(t.id)} className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-400"><Trash2 className="h-3.5 w-3.5"/></button>}
                      </div>
                      {(t.imageDataUrl||t.imageUrl)&&<div className="mb-3 overflow-hidden rounded-xl border border-slate-800 bg-slate-900"><img src={t.imageDataUrl||t.imageUrl} alt={t.title} className="w-full h-32 object-cover" onError={e=>{e.currentTarget.style.display='none';}}/></div>}
                      <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">{t.message}</p>
                      {t.imageUrl&&<p className="text-[10px] text-emerald-400 mt-3 truncate font-mono">{t.imageUrl}</p>}
                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-600 font-bold uppercase tracking-wider"><span>{t.createdBy}</span><span>{t.createdAt}</span></div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab==="reports"&&(
            <div className="space-y-6">
              <div className="bg-slate-950 p-6 border border-slate-800 rounded-2xl shadow-xl">
                <h1 className="text-xl font-black text-white flex items-center gap-2 mb-1"><BarChart3 className="h-6 w-6 text-blue-500"/> Matrix Intelligence</h1>
                <p className="text-xs text-slate-500">Comprehensive analytical insights generated from system activity.</p>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div><h2 className="text-sm font-black text-white uppercase tracking-wider">Selected Range Reports</h2><p className="text-[10px] text-slate-500 mt-1">Daily, monthly, and selected range summaries are calculated from saved lead activity.</p></div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs">
                    <CalendarDateInput value={reportStartDate} onChange={setReportStartDate} className="rounded-lg py-2 text-slate-300 focus:border-blue-500"/>
                    <span className="hidden sm:block text-slate-600">-</span>
                    <CalendarDateInput value={reportEndDate} onChange={setReportEndDate} className="rounded-lg py-2 text-slate-300 focus:border-blue-500"/>
                    {currentUser.role==="Admin"&&<button onClick={()=>exportSelectedRangeReport("excel")} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-3 py-2 rounded-lg flex items-center justify-center gap-1.5"><FileSpreadsheet className="h-3.5 w-3.5"/> Excel</button>}
                    {currentUser.role==="Admin"&&<button onClick={()=>exportSelectedRangeReport("csv")} className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-black px-3 py-2 rounded-lg flex items-center justify-center gap-1.5"><Table2 className="h-3.5 w-3.5"/> CSV</button>}
                    {currentUser.role==="Admin"&&<button onClick={()=>exportSelectedRangeReport("pdf")} className="bg-rose-600 hover:bg-rose-700 text-white font-black px-3 py-2 rounded-lg flex items-center justify-center gap-1.5"><FileText className="h-3.5 w-3.5"/> PDF</button>}
                    {(reportStartDate!==monthStartDate||reportEndDate!==TODAY_STR)&&<button onClick={()=>{setReportStartDate(monthStartDate);setReportEndDate(TODAY_STR);}} className="text-blue-400 hover:text-blue-300 font-bold px-3 py-2 border border-blue-500/30 rounded-lg flex items-center justify-center gap-1 bg-blue-500/10"><X className="h-3.5 w-3.5"/> Clear</button>}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[{id:"ManagementSummary",label:"Management Summary"},{id:"ProjectSourceEnqBooking",label:"Projectwise-Sourcewise Enq SV Booking"},{id:"PerformanceSummary",label:"Performance Summary"},{id:"ExecutiveWise",label:"Executivewise Report"},{id:"ExecutiveProjectwise",label:"Executivewise-Projectwise"},{id:"ExecutiveSourcewise",label:"Executivewise-Sourcewise"},{id:"Projectwise",label:"Projectwise Report"},{id:"Sourcewise",label:"Sourcewise Report"},{id:"SourceProjectwise",label:"Sourcewise-Projectwise"}].map(item=><button key={item.id} onClick={()=>setSelectedMatrixReport(item.id)} className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-colors ${selectedMatrixReport===item.id?"bg-blue-600 border-blue-500 text-white":"bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-blue-500/40"}`}>{item.label}</button>)}
                </div>
              </div>
              <div className="space-y-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div><h3 className="text-sm font-black text-white uppercase tracking-wider">Selected Range Full View</h3><p className="text-[10px] text-slate-500 mt-1">{reportStartDate} to {reportEndDate}</p></div>
                <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2 text-[10px]">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3"><p className="text-slate-500 uppercase font-bold">Enquiry</p><p className="text-lg font-black text-cyan-300 font-mono">{formatReportValue(selectedRangeReportTotals.source.enquiry)}</p></div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3"><p className="text-slate-500 uppercase font-bold">Calls</p><p className="text-lg font-black text-white font-mono">{formatReportValue(selectedRangeReportTotals.people.calls)}</p></div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3"><p className="text-slate-500 uppercase font-bold">Followup</p><p className="text-lg font-black text-blue-400 font-mono">{formatReportValue(selectedRangeReportTotals.people.followup)}</p></div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3"><p className="text-slate-500 uppercase font-bold">SV Planned</p><p className="text-lg font-black text-violet-400 font-mono">{formatReportValue(selectedRangeReportTotals.people.siteVisitPlanned)}</p></div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3"><p className="text-slate-500 uppercase font-bold">SV Done</p><p className="text-lg font-black text-emerald-400 font-mono">{formatReportValue(selectedRangeReportTotals.people.siteVisitDone)}</p></div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3"><p className="text-slate-500 uppercase font-bold">Booking</p><p className="text-lg font-black text-purple-400 font-mono">{formatReportValue(selectedRangeReportTotals.people.booking)}</p></div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3"><p className="text-slate-500 uppercase font-bold">Conversion</p><p className="text-lg font-black text-orange-400 font-mono">{formatReportValue(`${selectedRangeReportTotals.source.percentage}%`)}</p></div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-3"><p className="text-slate-500 uppercase font-bold">Cancellation</p><p className="text-lg font-black text-rose-400 font-mono">{formatReportValue(selectedRangeReportTotals.people.cancellation)}</p></div>
                </div>
              </div>
                {renderActiveRangeReportTable()}
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {renderPeopleActivityTable(`Today Activity (${TODAY_STR})`, todayPeopleActivitySummary)}
                {renderPeopleActivityTable(`Month Activity (${monthStartDate} to ${TODAY_STR})`, monthPeopleActivitySummary)}
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                {renderSourceReportTable(`Today Sourcewise (${TODAY_STR})`, todaySourceReport)}
                {renderSourceReportTable(`Month Sourcewise (${monthStartDate} to ${TODAY_STR})`, monthSourceReport)}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl"><h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2"><TrendingUp className="h-4 w-4"/> Daily Activity Trajectory</h3><div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={callsTrendData} margin={{top:5,right:20,left:-20,bottom:5}}><defs><linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/><XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false}/><YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false}/><Tooltip contentStyle={{backgroundColor:'#0f172a',border:'1px solid #1e293b',borderRadius:'12px',fontSize:'12px',color:'#fff'}} itemStyle={{fontWeight:'900'}}/><Legend wrapperStyle={{fontSize:'10px',fontWeight:'700',paddingTop:'10px'}}/><Area type="monotone" dataKey="calls" name="Total Calls" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCalls)"/><Line type="monotone" dataKey="siteVisitPlanned" name="SV Planned" stroke="#8b5cf6" strokeWidth={3} dot={{r:4}}/><Line type="monotone" dataKey="siteVisitDone" name="SV Done" stroke="#10b981" strokeWidth={3} dot={{r:4}}/><Line type="monotone" dataKey="bookings" name="Bookings" stroke="#f59e0b" strokeWidth={3} dot={{r:4}}/></ComposedChart></ResponsiveContainer></div></div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl"><h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2"><PieChart className="h-4 w-4"/> Source Origination Share</h3><div className="h-72 w-full"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={sourcewisePieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={4} dataKey="value">{sourcewisePieData.map((entry,index)=><Cell key={`cell-${index}`} fill={PIE_COLORS[index%PIE_COLORS.length]} stroke="rgba(0,0,0,0.2)"/>)}</Pie><Tooltip contentStyle={{backgroundColor:'#0f172a',border:'1px solid #1e293b',borderRadius:'12px',fontSize:'12px',color:'#fff'}} itemStyle={{fontWeight:'900'}}/><Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{fontSize:'10px',fontWeight:'700'}}/></PieChart></ResponsiveContainer></div></div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl col-span-1 lg:col-span-2"><h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2"><Users className="h-4 w-4"/> Executive Matrix Board</h3><div className="overflow-x-auto"><table className="w-full text-left text-[10px] whitespace-nowrap"><thead className="border-b border-slate-800 text-slate-500 uppercase font-bold"><tr><th className="p-3">Personnel</th><th className="p-3 text-center">Calls</th><th className="p-3 text-center">Followup</th><th className="p-3 text-center text-violet-400">SV Planned</th><th className="p-3 text-center text-emerald-400">SV Done</th><th className="p-3 text-center text-purple-400">Bookings</th><th className="p-3 text-center text-amber-400">Reg.</th><th className="p-3 text-center text-rose-400">Cxl.</th><th className="p-3 text-center text-blue-400">Coll.</th></tr></thead><tbody className="divide-y divide-slate-800">{execDetailedMatrix.map(e=><tr key={e.name} className="hover:bg-slate-900/40"><td className="p-3 font-black text-white">{e.name}</td><td className="p-3 text-center font-mono">{e.calls}</td><td className="p-3 text-center font-mono">{e.followups}</td><td className="p-3 text-center font-mono text-violet-400">{e.siteVisitPlanned}</td><td className="p-3 text-center font-mono text-emerald-400">{e.siteVisitDone}</td><td className="p-3 text-center font-mono text-purple-400">{e.bookings}</td><td className="p-3 text-center font-mono text-amber-400">{e.registrations}</td><td className="p-3 text-center font-mono text-rose-400">{e.cancellations}</td><td className="p-3 text-center font-mono text-blue-400">{e.collection}</td></tr>)}</tbody></table></div></div>
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
                            {["Executive","Telecaller"].includes(u.role)&&<p className="text-[9px] text-blue-400 font-bold mt-1 truncate">Manager: {u.managerName||"Not mapped"}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <AdminResetRequestsPanel resetRequests={resetRequests} setResetRequests={setResetRequests} triggerToastAlert={triggerToastAlert} />
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-slate-800 pb-4"><Upload className="h-4 w-4 text-orange-500"/> Admin Data Upload</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4"><button onClick={()=>downloadLeadUploadTemplate("excel")} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] px-3 py-2 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5"><FileSpreadsheet className="h-3.5 w-3.5"/> Excel Format</button><button onClick={()=>downloadLeadUploadTemplate("csv")} className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-black text-[10px] px-3 py-2 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1.5"><Table2 className="h-3.5 w-3.5"/> CSV Format</button></div>
                    <form onSubmit={handleDataImportSubmit} className="space-y-3 text-xs">
                      <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Upload Mode</label><select value={leadImportMode} onChange={e=>setLeadImportMode(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-orange-500"><option value="append">Append to existing data</option><option value="replace">Clean existing data and replace</option></select></div>
                      <textarea rows={5} value={importText} onChange={e=>setImportText(e.target.value)} placeholder="Paste rows from Excel here..." className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500 resize-none"/>
                      <button type="submit" className={`w-full text-white font-black py-2.5 rounded-xl uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 ${leadImportMode==="replace"?"bg-rose-600 hover:bg-rose-700":"bg-orange-600 hover:bg-orange-700"}`}><AlertTriangle className="h-4 w-4"/> {leadImportMode==="replace"?"Clean & Upload":"Append Upload"}</button>
                    </form>
                  </div>
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
                      {["Executive","Telecaller"].includes(newUserForm.role)&&<div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Reporting Manager</label><select value={newUserForm.managerId||""} onChange={e=>setNewUserForm({...newUserForm,managerId:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-rose-500"><option value="">Not mapped</option>{managerUsers.map(m=><option key={m.id} value={m.id}>{m.name} ({m.branch})</option>)}</select></div>}
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
      {prospectStatusPopup.isOpen&&(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[220] flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white">{prospectStatusPopup.status} Prospects</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Click a customer to open the drawer</p>
              </div>
              <button onClick={()=>setProspectStatusPopup({isOpen:false,status:""})} className="text-slate-500 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-colors"><X className="h-5 w-5"/></button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-4">
              {prospectStatusSummary.find(item=>item.status===prospectStatusPopup.status)?.leads.length?(
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {prospectStatusSummary.find(item=>item.status===prospectStatusPopup.status)?.leads.map(lead=>(
                    <button key={lead.id} onClick={()=>{setProspectStatusPopup({isOpen:false,status:""});setSelectedLead(lead);}} className="text-left bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-xl p-3 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-black text-white text-sm truncate">{lead.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{lead.phone}</p>
                        </div>
                        <span className="shrink-0 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider" style={{color:PROSPECT_STATUS_STYLES[getProspectStatus(lead)].color,backgroundColor:PROSPECT_STATUS_STYLES[getProspectStatus(lead)].bg,border:`1px solid ${PROSPECT_STATUS_STYLES[getProspectStatus(lead)].border}`}}>{getProspectStatus(lead)}</span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                        <p className="text-orange-400 font-bold truncate">{lead.project || "No project"}</p>
                        <p className="text-slate-400 text-right truncate">{lead.status || "New"}</p>
                        <p className="text-slate-500 truncate">Owner: {lead.assignedTo || "Unassigned"}</p>
                        <p className="text-slate-500 text-right font-mono">{formatDateTimeLabel(lead) || "-"}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ):(
                <div className="py-10 text-center text-slate-500 font-bold text-sm">No customers in this prospect status.</div>
              )}
            </div>
          </div>
        </div>
      )}
      {selectedLead&&(
        <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] lg:w-[500px] bg-slate-950 border-l border-slate-800 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
          <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
            <div><h2 className="text-lg font-black text-white flex items-center gap-2">{selectedLead.name}{isFreshLead(selectedLead)&&<span className="bg-orange-500 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider">NEW</span>}</h2><p className="text-[10px] text-slate-400 font-mono mt-0.5">{selectedLead.phone} {selectedLead.altPhone&&` / ${selectedLead.altPhone}`}</p>{selectedLead.dateCreated&&<p className="text-[10px] text-orange-300 font-mono mt-1">Created: {formatDateTimeLabel(selectedLead)}</p>}</div>
            <button onClick={()=>setSelectedLead(null)} className="text-slate-500 hover:text-white p-2 hover:bg-slate-800 rounded-xl transition-colors"><X className="h-5 w-5"/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-950">
             <div className="grid grid-cols-2 gap-3 text-xs">
               <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl"><p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Status</p>{isLeadEditMode?<select value={leadEditDraft.status} onChange={e=>handleLeadDraftStatusChange(e.target.value)} className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-200 focus:outline-none focus:border-orange-500">{STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select>:<span className="block mt-1 font-black truncate" style={{color:SC[selectedLead.status]?.text}}>{selectedLead.status}</span>}</div>
               <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl"><p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Prospect Status</p>{isLeadEditMode?<select value={leadEditDraft.prospectStatus||"Warm"} onChange={e=>setLeadEditDraft({...leadEditDraft,prospectStatus:e.target.value})} className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-200 focus:outline-none focus:border-orange-500">{PROSPECT_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select>:<span className="inline-flex mt-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider" style={{color:PROSPECT_STATUS_STYLES[getProspectStatus(selectedLead)].color,backgroundColor:PROSPECT_STATUS_STYLES[getProspectStatus(selectedLead)].bg,border:`1px solid ${PROSPECT_STATUS_STYLES[getProspectStatus(selectedLead)].border}`}}>{getProspectStatus(selectedLead)}</span>}</div>
               <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl"><p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Assigned</p>{isLeadEditMode&&["Admin","Manager"].includes(currentUser.role)?<select value={leadEditDraft.assignedTo||"Unassigned"} onChange={e=>setLeadEditDraft({...leadEditDraft,assignedTo:e.target.value})} className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-200 focus:outline-none focus:border-orange-500"><option value="Unassigned">Unassigned</option>{assignableUsers.map(u=><option key={u.id} value={u.name}>{u.name} ({u.role})</option>)}</select>:<p className="font-bold text-white truncate mt-1">{selectedLead.assignedTo||"Unassigned"}</p>}</div>
               <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl"><p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Project / Budget</p>{isLeadEditMode?<select value={leadEditDraft.project||""} onChange={e=>setLeadEditDraft({...leadEditDraft,project:e.target.value})} className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] font-bold text-orange-400 focus:outline-none focus:border-orange-500">{visibleProjects.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}</select>:<p className="font-bold text-orange-400 truncate mt-1">{selectedLead.project} <span className="text-slate-500 mx-1">•</span> <span className="font-mono text-emerald-400">₹{selectedLead.budget}L</span></p>}</div>
               <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl"><p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Source</p>{isLeadEditMode&&currentUser.role==="Admin"?<select value={leadEditDraft.source||"Website"} onChange={e=>setLeadEditDraft({...leadEditDraft,source:e.target.value})} className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-200 focus:outline-none focus:border-orange-500">{SOURCES.map(s=><option key={s} value={s}>{s}</option>)}</select>:<p className="font-bold text-slate-300 mt-1 truncate">{selectedLead.source}</p>}</div>
               <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl"><p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Primary Phone</p>{isLeadEditMode?<input type="tel" value={leadEditDraft.phone||""} onChange={e=>setLeadEditDraft({...leadEditDraft,phone:stripPhone(e.target.value)})} className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-200 font-mono focus:outline-none focus:border-orange-500"/>:<p className="font-bold text-slate-200 font-mono truncate mt-1">{selectedLead.phone||"Not set"}</p>}</div>
               <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl"><p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Alt Phone</p>{isLeadEditMode?<input type="tel" value={leadEditDraft.altPhone||""} onChange={e=>setLeadEditDraft({...leadEditDraft,altPhone:stripPhone(e.target.value)})} className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-200 font-mono focus:outline-none focus:border-orange-500"/>:<p className="font-bold text-slate-300 font-mono truncate mt-1">{selectedLead.altPhone||"Not set"}</p>}</div>
               {isLeadEditMode&&leadEditDraft.statusEventDate&&<div className="col-span-2 bg-orange-950/20 border border-orange-500/20 p-3 rounded-xl"><p className="text-[9px] font-bold text-orange-300 uppercase tracking-wider">Event Details</p><p className="text-[10px] text-slate-300 mt-1"><span className="font-mono text-orange-200">{leadEditDraft.statusEventDate}</span>{leadEditDraft.statusEventRemark?` - ${leadEditDraft.statusEventRemark}`:""}</p></div>}
               <div className="col-span-2 flex justify-end gap-2">{isLeadEditMode?<><button type="button" disabled={isLeadUpdateSaving} onClick={cancelLeadDrawerEdit} className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-900 border border-slate-700 text-slate-300 hover:text-white disabled:opacity-50">Cancel</button><button type="button" disabled={isLeadUpdateSaving} onClick={commitLeadDrawerUpdate} className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-orange-600 hover:bg-orange-700 disabled:bg-slate-700 text-white flex items-center gap-1.5"><Check className="h-3 w-3"/> {isLeadUpdateSaving?"Saving...":"OK"}</button></>:<button type="button" onClick={startLeadDrawerEdit} className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5"><Edit2 className="h-3 w-3"/> Edit Lead</button>}</div>
             </div>
             <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2"><Activity className="h-4 w-4 text-blue-400"/><h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Action Center</h3></div>
                <div className="grid grid-cols-2 gap-2">
                  <MobileCallButton phone={selectedLead.phone} leadName={selectedLead.name} prospectStatus={getProspectStatus(selectedLead)} onFeedbackSaved={(f)=>handleCallFeedback(selectedLead.id, f)} currentUser={currentUser} TODAY_STR={TODAY_STR} />
                  <a href={`https://wa.me/91${stripPhone(selectedLead.phone)}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all shadow-md"><MessageSquare className="h-3.5 w-3.5"/> WhatsApp</a>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2"><MessageSquare className="h-3.5 w-3.5 text-emerald-400"/><p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Project WhatsApp Message</p></div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select value={selectedWhatsappTemplateId} onChange={e=>setSelectedWhatsappTemplateId(e.target.value)} className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-[10px] font-bold text-slate-200 focus:outline-none focus:border-emerald-500"><option value="">{whatsappTemplates.length===0?"No Templates Saved":"Select Template"}</option>{selectedLeadWhatsappTemplates.map(t=><option key={t.id} value={t.id}>{t.title} ({t.project||"All"})</option>)}</select>
                    <button type="button" disabled={!selectedWhatsappTemplateId} onClick={handleSendWhatsappTemplate} className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-black text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"><Send className="h-3 w-3"/> Send</button>
                  </div>
                </div>
             </div>
             <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2"><Calendar className="h-4 w-4 text-orange-400"/><h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Timeline</h3></div>
                <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
                  {selectedLead.history?.map((h,i)=>(
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border border-slate-700 bg-slate-900 text-slate-500 group-[.is-active]:text-orange-400 group-[.is-active]:border-orange-500/50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"><div className="h-1.5 w-1.5 bg-current rounded-full"/></div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-xl border border-slate-800 bg-slate-900/60 shadow text-xs">
                        <div className="flex items-center justify-between mb-1"><span className="font-black text-slate-300">{h.by}</span><span className="font-mono text-[9px] text-slate-500">{formatDateTimeLabel(h)}</span></div>
                        <p className="text-slate-400 leading-relaxed">{h.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {leadStatusEventPopup.isOpen&&(
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[180] flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-orange-500/30 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 bg-orange-950/20">
              <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2"><Calendar className="h-4 w-4 text-orange-400"/> {leadStatusEventPopup.status} Details</h2>
              <p className="text-[10px] text-slate-400 mt-1">{getStatusEventConfig(leadStatusEventPopup.status)?.dateRequired===false?"Add the remark before saving the lead update.":"Add the event date and remark before saving the lead update."}</p>
            </div>
            <div className="p-5 space-y-4 text-xs">
              {getStatusEventConfig(leadStatusEventPopup.status)?.dateRequired!==false&&(
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">{getStatusEventConfig(leadStatusEventPopup.status)?.dateLabel || "Event Date"}</label>
                  <CalendarDateInput required value={leadStatusEventPopup.date} min={TODAY_STR} onChange={date=>setLeadStatusEventPopup(prev=>({...prev,date}))} className="py-2.5" />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">{getStatusEventConfig(leadStatusEventPopup.status)?.eventLabel || "Event / Remark"}</label>
                <textarea rows={3} value={leadStatusEventPopup.event} onChange={e=>setLeadStatusEventPopup(prev=>({...prev,event:e.target.value}))} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-orange-500 resize-none" placeholder="Enter event details or remark"/>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={cancelLeadStatusEventPopup} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-slate-900 border border-slate-700 text-slate-300 hover:text-white">Cancel</button>
                <button type="button" onClick={confirmLeadStatusEventPopup} className="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-1.5"><Check className="h-3.5 w-3.5"/> OK</button>
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
                  <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Prospect Status</label><select value={newLeadForm.prospectStatus||"Warm"} onChange={e=>setNewLeadForm({...newLeadForm,prospectStatus:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-orange-500">{PROSPECT_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
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
                <div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Log Date</label><CalendarDateInput required value={newActivityForm.date} max={TODAY_STR} onChange={date=>setNewActivityForm({...newActivityForm,date})} className="focus:border-emerald-500"/></div>
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

      {isProjectModalOpen&&currentUser.role==="Admin"&&(
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
              {["Executive","Telecaller"].includes(editUserForm.role)&&<div className="space-y-1.5"><label className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Reporting Manager</label><select value={editUserForm.managerId||""} onChange={e=>setEditUserForm({...editUserForm,managerId:e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-blue-500"><option value="">Not mapped</option>{managerUsers.map(m=><option key={m.id} value={m.id}>{m.name} ({m.branch})</option>)}</select></div>}
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

      {showExitAppPopup&&(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[220] flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center space-y-5">
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-2"><LogOut className="h-6 w-6 text-rose-400"/></div>
            <div><h3 className="text-lg font-black text-white">You are leaving the app</h3><p className="text-xs text-slate-400 mt-2 leading-relaxed">Press Stay to continue using the CRM, or Leave to close this screen.</p></div>
            <div className="grid grid-cols-2 gap-3 pt-2"><button onClick={handleStayInApp} className="py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors">Stay</button><button onClick={handleLeaveApp} className="py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 text-white shadow-lg transition-all">Leave</button></div>
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
