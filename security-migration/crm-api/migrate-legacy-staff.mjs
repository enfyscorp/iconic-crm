import { randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";

const SUPABASE_URL = String(process.env.SUPABASE_INTERNAL_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const OUTPUT_FILE = process.env.MIGRATION_PASSWORD_FILE || "/root/crm-staff-temporary-passwords.csv";
const headers = {
  apikey:SERVICE_KEY,
  Authorization:`Bearer ${SERVICE_KEY}`,
  "Content-Type":"application/json",
};

if (!SERVICE_KEY) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is missing.");
  process.exit(1);
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || data?.msg || data?.error || `Request failed (${response.status}).`);
  return data;
}

async function restSelect(table, query) {
  return requestJson(`${SUPABASE_URL}/rest/v1/${table}?${query}`, { headers });
}

async function restUpsert(table, row, conflict) {
  return requestJson(`${SUPABASE_URL}/rest/v1/${table}?on_conflict=${conflict}`, {
    method:"POST",
    headers:{ ...headers, Prefer:"resolution=merge-duplicates,return=representation" },
    body:JSON.stringify(row),
  });
}

function cleanUsername(value) {
  const raw = String(value || "").trim().toLowerCase();
  const prefix = raw.split("@")[0].replace(/[^a-z0-9._-]/g, "");
  return `${prefix}@desam`;
}

function authEmail(username) {
  return `${username.split("@")[0]}@staff.desamdevelopers.com`;
}

function password() {
  return `Dd!${randomBytes(9).toString("base64url")}7`;
}

const stateRows = await restSelect("crm_state_store", "key=eq.non_admin_users&select=value");
const legacyUsers = Array.isArray(stateRows[0]?.value) ? stateRows[0].value : [];
const existingProfiles = await restSelect("crm_profiles", "select=*");
const byLegacyId = new Map(existingProfiles.filter(p => p.legacy_id !== null).map(p => [String(p.legacy_id), p]));
const migrated = [];

for (const legacy of legacyUsers) {
  if (byLegacyId.has(String(legacy.id))) continue;
  const loginUsername = cleanUsername(legacy.email || legacy.name);
  const temporaryPassword = password();
  let authUser;
  try {
    authUser = await requestJson(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method:"POST",
      headers,
      body:JSON.stringify({
        email:authEmail(loginUsername),
        password:temporaryPassword,
        email_confirm:true,
        app_metadata:{
          role:legacy.role,
          login_username:loginUsername,
          branch:legacy.branch || "Madurai Desk",
        },
        user_metadata:{ full_name:legacy.name || loginUsername },
      }),
    });
  } catch (error) {
    console.error(`Could not create ${loginUsername}: ${error.message}`);
    continue;
  }
  const rows = await restUpsert("crm_profiles", {
    auth_user_id:authUser.id,
    legacy_id:Number(legacy.id),
    login_username:loginUsername,
    display_name:legacy.name || loginUsername,
    role:legacy.role,
    branch:legacy.branch || "Madurai Desk",
    phone:String(legacy.phone || ""),
    active:legacy.active !== false,
    manager_auth_user_id:null,
  }, "auth_user_id");
  byLegacyId.set(String(legacy.id), rows[0]);
  migrated.push({ username:loginUsername, password:temporaryPassword, name:legacy.name || "", role:legacy.role });
}

for (const legacy of legacyUsers) {
  if (!["Executive","Telecaller"].includes(legacy.role) || !legacy.managerId) continue;
  const profile = byLegacyId.get(String(legacy.id));
  const manager = byLegacyId.get(String(legacy.managerId));
  if (!profile || !manager) continue;
  await requestJson(`${SUPABASE_URL}/rest/v1/crm_profiles?auth_user_id=eq.${profile.auth_user_id}`, {
    method:"PATCH",
    headers:{ ...headers, Prefer:"return=minimal" },
    body:JSON.stringify({ manager_auth_user_id:manager.auth_user_id }),
  });
}

const escapeCsv = value => `"${String(value ?? "").replace(/"/g, '""')}"`;
const csv = [
  ["Name","Username","Temporary Password","Role"].map(escapeCsv).join(","),
  ...migrated.map(row => [row.name,row.username,row.password,row.role].map(escapeCsv).join(",")),
].join("\n");
await writeFile(OUTPUT_FILE, csv, { mode:0o600 });

console.log(`Migrated ${migrated.length} staff account(s).`);
console.log(`Temporary passwords were written to ${OUTPUT_FILE}`);
console.log("Keep this file private and delete it after passwords are distributed.");

