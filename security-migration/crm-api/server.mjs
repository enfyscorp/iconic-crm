import http from "node:http";

const PORT = Number(process.env.PORT || 8787);
const SUPABASE_URL = String(process.env.SUPABASE_INTERNAL_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");
const ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const MAX_BODY_BYTES = 50 * 1024 * 1024;

if (!ANON_KEY || !SERVICE_KEY) {
  console.error("Missing SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const jsonHeaders = { "Content-Type": "application/json" };
const serviceHeaders = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
};

function send(res, status, body) {
  res.writeHead(status, {
    ...jsonHeaders,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error("Request is too large.");
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(data?.message || data?.msg || data?.error_description || data?.error || `Request failed (${response.status}).`);
    error.status = response.status;
    error.details = data;
    throw error;
  }
  return data;
}

async function authenticate(req) {
  const authorization = req.headers.authorization || "";
  if (!authorization.startsWith("Bearer ")) {
    const error = new Error("Authentication required.");
    error.status = 401;
    throw error;
  }
  const user = await requestJson(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: ANON_KEY, Authorization: authorization },
  });
  let profile = await getProfileByAuthId(user.id);
  if (!profile && String(user?.app_metadata?.role || "").toLowerCase() === "admin") {
    profile = await upsertAdminProfile(user);
  }
  if (!profile || profile.active === false) {
    const error = new Error("This CRM account is inactive or has not been provisioned.");
    error.status = 403;
    throw error;
  }
  return { user, profile, token:authorization.slice(7) };
}

async function restSelect(table, query = "") {
  return requestJson(`${SUPABASE_URL}/rest/v1/${table}?${query}`, { headers:serviceHeaders });
}

async function restUpsert(table, row, onConflict) {
  return requestJson(`${SUPABASE_URL}/rest/v1/${table}?on_conflict=${encodeURIComponent(onConflict)}`, {
    method:"POST",
    headers:{ ...serviceHeaders, Prefer:"resolution=merge-duplicates,return=representation" },
    body:JSON.stringify(row),
  });
}

async function restPatch(table, query, patch) {
  return requestJson(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    method:"PATCH",
    headers:{ ...serviceHeaders, Prefer:"return=representation" },
    body:JSON.stringify(patch),
  });
}

async function getProfileByAuthId(authUserId) {
  const rows = await restSelect("crm_profiles", `auth_user_id=eq.${encodeURIComponent(authUserId)}&select=*`);
  return rows[0] || null;
}

async function getProfileByLegacyId(legacyId) {
  const rows = await restSelect("crm_profiles", `legacy_id=eq.${encodeURIComponent(legacyId)}&select=*`);
  return rows[0] || null;
}

async function getAllProfiles() {
  return restSelect("crm_profiles", "select=*&order=display_name.asc");
}

async function upsertAdminProfile(user) {
  const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user.email || "Admin";
  const rows = await restUpsert("crm_profiles", {
    auth_user_id:user.id,
    login_username:String(user.email || "").toLowerCase(),
    display_name:name,
    role:"Admin",
    branch:"All Branches",
    phone:user.phone || "",
    active:true,
  }, "auth_user_id");
  return rows[0];
}

function toAppUser(profile) {
  return {
    id:profile.legacy_id ?? profile.auth_user_id,
    authUserId:profile.auth_user_id,
    name:profile.display_name,
    email:profile.login_username,
    role:profile.role,
    branch:profile.branch,
    phone:profile.phone || "",
    active:profile.active !== false,
    avatar:String(profile.display_name || "?").charAt(0).toUpperCase(),
    managerId:profile.manager_legacy_id ?? null,
    managerAuthUserId:profile.manager_auth_user_id || null,
    managerName:profile.manager_name || "",
    authProvider:"supabase",
  };
}

function enrichProfiles(profiles) {
  const byAuthId = new Map(profiles.map(profile => [profile.auth_user_id, profile]));
  return profiles.map(profile => {
    const manager = byAuthId.get(profile.manager_auth_user_id);
    return {
      ...profile,
      manager_legacy_id:manager?.legacy_id ?? null,
      manager_name:manager?.display_name || "",
    };
  });
}

function allowedTeam(profile, profiles) {
  if (profile.role === "Admin") return profiles;
  if (profile.role === "Manager") {
    return profiles.filter(item => item.auth_user_id === profile.auth_user_id || item.manager_auth_user_id === profile.auth_user_id);
  }
  return profiles.filter(item => item.auth_user_id === profile.auth_user_id);
}

function leadIsVisible(lead, profile, profiles) {
  if (profile.role === "Admin") return true;
  const team = allowedTeam(profile, profiles);
  const ids = new Set(team.map(item => String(item.legacy_id ?? item.auth_user_id)));
  const names = new Set(team.map(item => item.display_name));
  const usernames = new Set(team.map(item => item.login_username));
  if (ids.has(String(lead?.assignedToId ?? ""))) return true;
  if (names.has(lead?.assignedTo) || usernames.has(lead?.assignedTo)) return true;
  if (profile.role === "Manager" && (!lead?.assignedTo || lead.assignedTo === "Unassigned") && lead?.branch === profile.branch) return true;
  return false;
}

function activityIsVisible(log, profile, profiles) {
  if (profile.role === "Admin") return true;
  const names = new Set(allowedTeam(profile, profiles).map(item => item.display_name));
  return names.has(log?.executive);
}

async function readStateRows() {
  return restSelect("crm_state_store", "select=key,value,updated_at");
}

function scopeStateRows(rows, profile, profiles) {
  const enriched = enrichProfiles(profiles);
  const visibleProfiles = allowedTeam(profile, enriched);
  return rows.map(row => {
    if (row.key === "leads") {
      return { ...row, value:Array.isArray(row.value) ? row.value.filter(lead => leadIsVisible(lead, profile, enriched)) : [] };
    }
    if (row.key === "activity_logs") {
      return { ...row, value:Array.isArray(row.value) ? row.value.filter(log => activityIsVisible(log, profile, enriched)) : [] };
    }
    if (row.key === "admin_users") {
      return { ...row, value:visibleProfiles.filter(item => item.role === "Admin").map(toAppUser) };
    }
    if (row.key === "non_admin_users") {
      return { ...row, value:visibleProfiles.filter(item => item.role !== "Admin").map(toAppUser) };
    }
    if (row.key === "reset_requests") return { ...row, value:[] };
    return row;
  });
}

async function saveStateValue(key, value) {
  const rows = await restUpsert("crm_state_store", {
    key,
    value,
    updated_at:new Date().toISOString(),
  }, "key");
  return rows[0];
}

async function writeScopedState(key, incoming, profile, profiles) {
  const adminOnly = new Set(["projects", "whatsapp_templates", "admin_users", "non_admin_users", "reset_requests"]);
  if (adminOnly.has(key) && profile.role !== "Admin") {
    const error = new Error("Administrator permission is required.");
    error.status = 403;
    throw error;
  }
  if (key === "admin_users" || key === "non_admin_users" || key === "reset_requests") {
    const error = new Error("User accounts are managed through the secure user API.");
    error.status = 400;
    throw error;
  }
  if (!Array.isArray(incoming)) return saveStateValue(key, incoming);
  if (profile.role === "Admin" || !["leads", "activity_logs"].includes(key)) {
    return saveStateValue(key, incoming);
  }

  const rows = await readStateRows();
  const existing = rows.find(row => row.key === key)?.value;
  const current = Array.isArray(existing) ? existing : [];
  const byId = new Map(current.map(item => [String(item.id), item]));
  const team = allowedTeam(profile, profiles);
  const teamIds = new Set(team.map(item => String(item.legacy_id ?? item.auth_user_id)));
  const teamNames = new Set(team.map(item => item.display_name));
  const teamUsernames = new Set(team.map(item => item.login_username));

  for (const candidate of incoming) {
    const id = String(candidate.id);
    const oldItem = byId.get(id);
    if (key === "leads") {
      const oldVisible = oldItem ? leadIsVisible(oldItem, profile, profiles) : false;
      if (oldItem && !oldVisible) continue;
      let secured = { ...candidate };
      if (profile.role === "Manager") {
        const validTarget = secured.assignedTo === "Unassigned"
          || teamIds.has(String(secured.assignedToId ?? ""))
          || teamNames.has(secured.assignedTo)
          || teamUsernames.has(secured.assignedTo);
        if (!validTarget || (secured.branch && secured.branch !== profile.branch)) continue;
        secured.branch = profile.branch;
      } else {
        secured = {
          ...secured,
          assignedTo:profile.display_name,
          assignedToId:profile.legacy_id ?? profile.auth_user_id,
          branch:profile.branch,
        };
      }
      byId.set(id, secured);
      continue;
    }
    if (key === "activity_logs") {
      const secured = profile.role === "Manager"
        ? candidate
        : { ...candidate, executive:profile.display_name };
      if (activityIsVisible(secured, profile, profiles)) byId.set(id, secured);
    }
  }
  return saveStateValue(key, Array.from(byId.values()));
}

function authEmailFor(loginUsername, role) {
  const username = String(loginUsername || "").trim().toLowerCase();
  if (role === "Admin") return username;
  const prefix = username.split("@")[0].replace(/[^a-z0-9._-]/g, "");
  return `${prefix}@staff.desamdevelopers.com`;
}

function nextLegacyId() {
  return Date.now();
}

async function createAuthUser(body) {
  const role = body.role;
  const loginUsername = String(body.loginUsername || "").trim().toLowerCase();
  if (!["Admin","Manager","Executive","Telecaller"].includes(role)) throw new Error("Invalid role.");
  if (!loginUsername || !body.password || String(body.password).length < 6) throw new Error("Username and a password of at least 6 characters are required.");
  const authEmail = authEmailFor(loginUsername, role);
  const authUser = await requestJson(`${SUPABASE_URL}/auth/v1/admin/users`, {
    method:"POST",
    headers:serviceHeaders,
    body:JSON.stringify({
      email:authEmail,
      password:String(body.password),
      email_confirm:true,
      app_metadata:{ role, login_username:loginUsername, branch:body.branch || "Madurai Desk" },
      user_metadata:{ full_name:body.name || loginUsername },
    }),
  });
  let manager = null;
  if (body.managerId) manager = await getProfileByLegacyId(body.managerId);
  const rows = await restUpsert("crm_profiles", {
    auth_user_id:authUser.id,
    legacy_id:Number(body.legacyId) || nextLegacyId(),
    login_username:loginUsername,
    display_name:String(body.name || loginUsername).trim(),
    role,
    branch:role === "Admin" ? "All Branches" : (body.branch || "Madurai Desk"),
    phone:String(body.phone || ""),
    active:true,
    manager_auth_user_id:["Executive","Telecaller"].includes(role) ? (manager?.auth_user_id || null) : null,
  }, "auth_user_id");
  return toAppUser(enrichProfiles(rows)[0]);
}

async function updateAuthUser(profile, body) {
  const role = body.role || profile.role;
  const loginUsername = String(body.loginUsername || profile.login_username).trim().toLowerCase();
  const authPatch = {
    email:authEmailFor(loginUsername, role),
    app_metadata:{ role, login_username:loginUsername, branch:body.branch || profile.branch },
    user_metadata:{ full_name:body.name || profile.display_name },
  };
  if (body.password) {
    if (String(body.password).length < 6) throw new Error("Password must be at least 6 characters.");
    authPatch.password = String(body.password);
  }
  await requestJson(`${SUPABASE_URL}/auth/v1/admin/users/${profile.auth_user_id}`, {
    method:"PUT",
    headers:serviceHeaders,
    body:JSON.stringify(authPatch),
  });
  let manager = null;
  if (body.managerId) manager = await getProfileByLegacyId(body.managerId);
  const rows = await restPatch("crm_profiles", `auth_user_id=eq.${profile.auth_user_id}`, {
    login_username:loginUsername,
    display_name:String(body.name || profile.display_name).trim(),
    role,
    branch:role === "Admin" ? "All Branches" : (body.branch || profile.branch),
    phone:String(body.phone ?? profile.phone ?? ""),
    active:body.active !== false,
    manager_auth_user_id:["Executive","Telecaller"].includes(role) ? (manager?.auth_user_id || null) : null,
  });
  return toAppUser(enrichProfiles(rows)[0]);
}

async function handle(req, res) {
  if (req.method === "GET" && req.url === "/health") return send(res, 200, { ok:true });
  const { profile } = await authenticate(req);

  if (req.method === "GET" && req.url === "/me") {
    const profiles = enrichProfiles(await getAllProfiles());
    const current = profiles.find(item => item.auth_user_id === profile.auth_user_id) || profile;
    return send(res, 200, { user:toAppUser(current) });
  }

  if (req.method === "GET" && req.url === "/state") {
    const [rows, profiles] = await Promise.all([readStateRows(), getAllProfiles()]);
    return send(res, 200, { rows:scopeStateRows(rows, profile, profiles) });
  }

  if (req.method === "POST" && req.url.startsWith("/state/")) {
    const key = decodeURIComponent(req.url.slice("/state/".length));
    const body = await readJson(req);
    const profiles = await getAllProfiles();
    const row = await writeScopedState(key, body.value, profile, profiles);
    return send(res, 200, { row });
  }

  if (profile.role !== "Admin") {
    const error = new Error("Administrator permission is required.");
    error.status = 403;
    throw error;
  }

  if (req.method === "GET" && req.url === "/admin/users") {
    return send(res, 200, { users:enrichProfiles(await getAllProfiles()).map(toAppUser) });
  }

  if (req.method === "POST" && req.url === "/admin/users") {
    const user = await createAuthUser(await readJson(req));
    return send(res, 201, { user });
  }

  const userMatch = req.url.match(/^\/admin\/users\/([^/]+)$/);
  if (userMatch && req.method === "PATCH") {
    const target = await getProfileByLegacyId(decodeURIComponent(userMatch[1]));
    if (!target) {
      const error = new Error("User was not found.");
      error.status = 404;
      throw error;
    }
    const user = await updateAuthUser(target, await readJson(req));
    return send(res, 200, { user });
  }

  if (userMatch && req.method === "DELETE") {
    const target = await getProfileByLegacyId(decodeURIComponent(userMatch[1]));
    if (!target) {
      const error = new Error("User was not found.");
      error.status = 404;
      throw error;
    }
    if (target.auth_user_id === profile.auth_user_id) throw new Error("You cannot deactivate your own account.");
    await restPatch("crm_profiles", `auth_user_id=eq.${target.auth_user_id}`, { active:false });
    await requestJson(`${SUPABASE_URL}/auth/v1/admin/users/${target.auth_user_id}`, {
      method:"PUT",
      headers:serviceHeaders,
      body:JSON.stringify({ ban_duration:"876000h" }),
    });
    return send(res, 200, { ok:true });
  }

  send(res, 404, { error:"Not found." });
}

const server = http.createServer((req, res) => {
  handle(req, res).catch(error => {
    console.error(error);
    send(res, error.status || 500, { error:error.message || "Server error." });
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`DD Connect secure CRM API listening on 127.0.0.1:${PORT}`);
});
