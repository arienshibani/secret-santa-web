# Environment Variables Setup Guide

## Step 1: Create the .env file

Create a file named `.env` in the **root directory** of your project (same level as `package.json`).

The file should be located at:
```
/Users/ari/Repos/secret-santa-web/.env
```

## Step 2: Add the required variables

Add these two lines to your `.env` file:

```env
PUBLIC_SUPABASE_URL=your_supabase_url_here
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Step 3: Find your Supabase values

### In Supabase Dashboard:

1. **Go to your Supabase project dashboard**: https://supabase.com/dashboard
2. **Select your project** (the one where you ran the SQL schema)
3. **Click on "Project Settings"** (gear icon in the left sidebar)
4. **Click on "API"** in the settings menu
5. You'll see two values you need:

   - **Project URL**: This is your `PUBLIC_SUPABASE_URL`
     - It looks like: `https://xxxxxxxxxxxxx.supabase.co`
     - Copy this entire URL
   
   - **anon/public key**: This is your `PUBLIC_SUPABASE_ANON_KEY`
     - It's a long string that starts with `eyJ...`
     - This is the "anon" or "public" key (NOT the service_role key!)
     - Copy this entire key

## Step 4: Fill in your .env file

Replace the placeholder values with your actual values:

```env
PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2ODAwMCwiZXhwIjoxOTU0NTQ0MDAwfQ.example
```

**Important Notes:**
- Do NOT commit the `.env` file to git (it's already in `.gitignore`)
- The `.env` file should be in the root directory, not in `src/` or any subdirectory
- Make sure there are no quotes around the values
- Make sure there are no spaces around the `=` sign
- Restart your dev server after creating/updating the `.env` file

## Step 5: Verify it works

After creating the `.env` file, restart your dev server:

```bash
npm run dev
```

If you see any errors about missing environment variables, double-check:
1. The file is named exactly `.env` (with the dot at the beginning)
2. The file is in the root directory
3. The variable names are exactly `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`
4. You copied the values correctly from Supabase

