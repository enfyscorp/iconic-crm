const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || "";

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

function createRestClient(url, anonKey) {
  const baseUrl = url.replace(/\/$/, "");
  const headers = {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    "Content-Type": "application/json",
  };

  return {
    from(table) {
      return {
        async select(columns = "*") {
          try {
            const response = await fetch(`${baseUrl}/rest/v1/${table}?select=${encodeURIComponent(columns)}`, {
              headers,
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
                ...headers,
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
