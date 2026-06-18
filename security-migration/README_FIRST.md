# DD Connect Permanent Security Migration

This migration removes public database access without taking down the current CRM.

## What changes

- Every Admin, Manager, Executive and Telecaller signs in through Supabase Auth.
- The browser no longer reads `crm_state_store` directly.
- A private VPS API validates the logged-in user and applies Admin/Manager/Staff scope.
- Admin can create users, change passwords, map managers and deactivate users from the CRM.
- Final RLS blocks `anon` and `authenticated` from direct access to CRM state.

## Files to upload to the GitHub repository

Upload these deployable files:

- `frontend/App.js` to `src/App.js`
- `frontend/supabaseClient.js` to `src/supabaseClient.js`
- The complete `security-migration` folder to the repository root

Do not upload:

- VPS `.env.local`
- VPS `public/supabase-config.json`
- Any service-role key
- Temporary staff passwords
- Database backups

## Deployment phases

1. Run `01_SECURE_CRM_SCHEMA.sql`. This is additive and does not interrupt the live CRM.
2. Install and start `crm-api`.
3. Run `migrate-legacy-staff.mjs`. It creates Supabase Auth users and a private temporary-password file.
4. Build the new frontend into `build-secure`, leaving the current `build` untouched.
5. Test every role on a protected test URL.
6. Switch the live frontend to the secure build.
7. Run `02_FINAL_LOCKDOWN.sql`.
8. Verify anonymous access is gone.

Do not run `02_FINAL_LOCKDOWN.sql` before all role tests pass.

