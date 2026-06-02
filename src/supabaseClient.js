const AUTH_SESSION_KEY = "desam_supabase_auth_session";

const readBuildConfig = () => {
  const reactEnv = typeof process !== "undefined" ? process.env || {} : {};
  const viteEnv = import.meta.env || {};
  return {
    url: viteEnv.VITE_SUPABASE_URL || reactEnv.REACT_APP_SUPABASE_URL || "",
    anonKey: viteEnv.VITE_SUPABASE_ANON_KEY || reactEnv.REACT_APP_SUPABASE_ANON_KEY || "",
  };
};

let runtimeConfigPromise = null;

function normalizeSupabaseUrl(url) {
  return String(url || "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/rest\/v1$/i, "")
    .replace(/\/auth\/v1$/i, "")
    .replace(/\/storage\/v1$/i, "");
}

async function readRuntimeConfig() {
  if (!runtimeConfigPromise) {
    runtimeConfigPromise = fetch("/supabase-config.json", { cache: "no-store" })
      .then(response => response.ok ? response.json() : {})
      .catch(() => ({}));
  }
  return runtimeConfigPromise;
}

async function getConfig() {
  const buildConfig = readBuildConfig();
  if (buildConfig.url && buildConfig.anonKey) {
    return { ...buildConfig, url: normalizeSupabaseUrl(buildConfig.url) };
  }

  const runtimeConfig = await readRuntimeConfig();
  return {
    url: normalizeSupabaseUrl(runtimeConfig.VITE_SUPABASE_URL || runtimeConfig.REACT_APP_SUPABASE_URL || runtimeConfig.url || buildConfig.url || ""),
    anonKey: runtimeConfig.VITE_SUPABASE_ANON_KEY || runtimeConfig.REACT_APP_SUPABASE_ANON_KEY || runtimeConfig.anonKey || buildConfig.anonKey || "",
  };
}

const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) || "null");
  } catch {
    return null;
  }
};

const configError = async () => {
  const config = await getConfig();
  return {
    data: null,
    error: {
      message: `Supabase Auth is not configured. Config status: ${JSON.stringify({
        hasUrl: Boolean(config.url),
        hasAnonKey: Boolean(config.anonKey),
        checkedNames: [
          "VITE_SUPABASE_URL",
          "VITE_SUPABASE_ANON_KEY",
          "REACT_APP_SUPABASE_URL",
          "REACT_APP_SUPABASE_ANON_KEY",
          "/supabase-config.json",
        ],
      })}`,
    },
  };
};

const localKey = (table, key) => `${table}:${key}`;

const localStore = {
  from(table) {
    return {
      async select() {
        const rows = [];
        for (let i = 0; i < localStorage.length; i += 1) {
          const key = localStorage.key(i);
          if (!key || !key.startsWith(`${table}:`)) continue;
          try {
            rows.push({ key: key.slice(table.length + 1), value: JSON.parse(localStorage.getItem(key)) });
          } catch {}
        }
        return { data: rows, error: null };
      },
      async upsert(row) {
        localStorage.setItem(localKey(table, row.key), JSON.stringify(row.value));
        return { data: row, error: null };
      },
    };
  },
};

async function authHeaders() {
  const config = await getConfig();
  if (!config.url || !config.anonKey) return null;
  const session = getSession();
  return {
    baseUrl: config.url.replace(/\/$/, ""),
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${session?.access_token || config.anonKey}`,
      "Content-Type": "application/json",
    },
    anonKey: config.anonKey,
  };
}

export const supabase = {
  auth: {
    async signInWithPassword({ email, password }) {
      const auth = await authHeaders();
      if (!auth) return configError();
      try {
        const response = await fetch(`${auth.baseUrl}/auth/v1/token?grant_type=password`, {
          method: "POST",
          headers: {
            apikey: auth.anonKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) return { data: null, error: data || { message: "Login failed." } };
        const session = {
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_at: data.expires_at,
          user: data.user,
        };
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
        return { data: { session, user: data.user }, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    async signOut() {
      localStorage.removeItem(AUTH_SESSION_KEY);
      return { error: null };
    },
    async getSession() {
      return { data: { session: getSession() }, error: null };
    },
  },
  from(table) {
    return {
      async select(columns = "*") {
        const auth = await authHeaders();
        if (!auth) return localStore.from(table).select(columns);
        try {
          const response = await fetch(`${auth.baseUrl}/rest/v1/${table}?select=${encodeURIComponent(columns)}`, {
            headers: {
              ...auth.headers,
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
            cache: "no-store",
          });
          const data = await response.json();
          return response.ok ? { data, error: null } : { data: null, error: data };
        } catch (error) {
          return { data: null, error };
        }
      },
      async upsert(row, options = {}) {
        const auth = await authHeaders();
        if (!auth) return localStore.from(table).upsert(row);
        const onConflict = encodeURIComponent(options.onConflict || "key");
        const payload = table === "crm_state_store" ? { ...row, updated_at: new Date().toISOString() } : row;
        try {
          const response = await fetch(`${auth.baseUrl}/rest/v1/${table}?on_conflict=${onConflict}`, {
            method: "POST",
            headers: {
              ...auth.headers,
              Prefer: "resolution=merge-duplicates,return=representation",
            },
            body: JSON.stringify(payload),
            cache: "no-store",
          });
          const data = await response.json().catch(() => null);
          return response.ok ? { data, error: null } : { data: null, error: data };
        } catch (error) {
          return { data: null, error };
        }
      },
    };
  },
};
