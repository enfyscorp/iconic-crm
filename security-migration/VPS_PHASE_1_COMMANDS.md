# Phase 1 - Add the Security Foundation

These commands do not replace the live frontend and do not enable final RLS.

## 1. Download the migration files from GitHub

After the files are uploaded and committed to GitHub:

```bash
cd /var/www/iconic-crm
git fetch origin main
mkdir -p /root/dd-connect-security/crm-api
git show origin/main:security-migration/01_SECURE_CRM_SCHEMA.sql > /root/dd-connect-security/01_SECURE_CRM_SCHEMA.sql
git show origin/main:security-migration/02_FINAL_LOCKDOWN.sql > /root/dd-connect-security/02_FINAL_LOCKDOWN.sql
git show origin/main:security-migration/03_EMERGENCY_ROLLBACK.sql > /root/dd-connect-security/03_EMERGENCY_ROLLBACK.sql
git show origin/main:security-migration/crm-api/server.mjs > /root/dd-connect-security/crm-api/server.mjs
git show origin/main:security-migration/crm-api/migrate-legacy-staff.mjs > /root/dd-connect-security/crm-api/migrate-legacy-staff.mjs
git show origin/main:security-migration/crm-api/crm-api.service > /root/dd-connect-security/crm-api/crm-api.service
git show origin/main:security-migration/crm-api/nginx-location.conf > /root/dd-connect-security/crm-api/nginx-location.conf
```

## 2. Create the secure profile table

```bash
docker exec -i supabase-db psql -U postgres -d postgres < /root/dd-connect-security/01_SECURE_CRM_SCHEMA.sql
```

This must complete without an SQL error.

## 3. Install the private CRM API

```bash
mkdir -p /opt/dd-connect-crm-api
cp /root/dd-connect-security/crm-api/server.mjs /opt/dd-connect-crm-api/server.mjs
cp /root/dd-connect-security/crm-api/migrate-legacy-staff.mjs /opt/dd-connect-crm-api/migrate-legacy-staff.mjs
chmod 700 /opt/dd-connect-crm-api
chmod 600 /opt/dd-connect-crm-api/*.mjs
```

Load the two keys without displaying them:

```bash
ANON_VALUE="$(grep -m1 '^ANON_KEY=' /opt/supabase/docker/.env | cut -d= -f2- | tr -d '\r"')"
SERVICE_VALUE="$(grep -m1 '^SERVICE_ROLE_KEY=' /opt/supabase/docker/.env | cut -d= -f2- | tr -d '\r"')"
```

Create the protected service environment:

```bash
printf 'PORT=8787\nSUPABASE_INTERNAL_URL=http://127.0.0.1:8000\nSUPABASE_ANON_KEY=%s\nSUPABASE_SERVICE_ROLE_KEY=%s\n' "$ANON_VALUE" "$SERVICE_VALUE" > /etc/dd-connect-crm-api.env
chmod 600 /etc/dd-connect-crm-api.env
unset ANON_VALUE SERVICE_VALUE
```

Install and start the service:

```bash
cp /root/dd-connect-security/crm-api/crm-api.service /etc/systemd/system/dd-connect-crm-api.service
systemctl daemon-reload
systemctl enable --now dd-connect-crm-api
systemctl status dd-connect-crm-api --no-pager
curl -s http://127.0.0.1:8787/health
```

The final command must show:

```json
{"ok":true}
```

## Stop here

Do not migrate staff, edit Nginx, replace the frontend, or run final lock-down until the Phase 1 results are checked.

