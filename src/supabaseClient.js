const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || "";
const AUTH_SESSION_KEY = "desam_supabase_auth_session";

const localKey = (table, key) => `${table}:${key}`;

const localStore = {
  auth: {
    async signInWithPassword() {
      return { data: null, error: { message: "Supabase Auth is not configured." } };
    },
    async signOut() {
      return { error: null };
    },
    async getSession() {
      return { data: { session: null }, error: null };
    },
  },
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

function createRestClient(url, anonKey) {
  const baseUrl = url.replace(/\/$/, "");
  const baseHeaders = {
    apikey: anonKey,
    "Content-Type": "application/json",
  };
  const getSession = () => {
    try {
      return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) || "null");
    } catch {
      return null;
    }
  };
  const authHeaders = () => {
    const session = getSession();
    return {
      ...baseHeaders,
      Authorization: `Bearer ${session?.access_token || anonKey}`,
    };
  };

  return {
    auth: {
      async signInWithPassword({ email, password }) {
        try {
          const response = await fetch(`${baseUrl}/auth/v1/token?grant_type=password`, {
            method: "POST",
            headers: baseHeaders,
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
          try {
            const response = await fetch(`${baseUrl}/rest/v1/${table}?select=${encodeURIComponent(columns)}`, {
              headers: authHeaders(),
            });
            const data = await response.json();
            return response.ok ? { data, error: null } : { data: null, error: data };
          } catch (error) {
            return { data: null, error };
          }
        },
        async upsert(row) {
          try {
            const response = await fetch(`${baseUrl}/rest/v1/${table}`, {
              method: "POST",
              headers: {
                ...authHeaders(),
                Prefer: "resolution=merge-duplicates,return=representation",
              },
              body: JSON.stringify(row),
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
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createRestClient(supabaseUrl, supabaseAnonKey)
  : localStore;
