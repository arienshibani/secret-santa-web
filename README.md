# Secret Santa Web App 🎄🎁

A beautiful, festive Secret Santa web application built with SvelteKit, TypeScript, Tailwind CSS, and Supabase. Features multi-language support (English, Norsk, Nynorsk), animated snow effects, and a complete admin dashboard.

## Features

- 🎄 **Festive Design**: Beautiful Christmas-themed UI with animated snow effects
- 🌍 **Multi-language Support**: English, Norsk (Bokmål), and Nynorsk
- 📱 **Mobile Responsive**: Works perfectly on all devices
- 🔐 **Secure Assignments**: Unique token-based URLs for each participant
- 👨‍💼 **Admin Dashboard**: PIN-protected dashboard to track gift status
- 🎁 **Gift Tracking**: Mark when gifts are ready
- 🎲 **Smart Shuffling**: Ensures no self-assignments

## Tech Stack

- **SvelteKit** - Framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Database and backend
- **Vercel** - Hosting

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the SQL from `supabase-schema.sql`
3. Get your Supabase URL and anon key from Project Settings > API

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PUBLIC_SUPABASE_URL=your_supabase_url_here
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

## Deployment to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

Vercel will automatically detect SvelteKit and configure the build.

## Usage

1. **Setup**: Enter the number of participants and preferred contact method
2. **Participants**: Fill in names and contact information for each participant
3. **Assignments**: The app automatically shuffles and creates unique URLs
4. **Share**: Copy and share the URLs with each participant
5. **Admin**: Use the admin dashboard (PIN will be generated on first setup) to track gift status

## Project Structure

```
src/
├── routes/
│   ├── +page.svelte          # Step 1: Initial setup
│   ├── participants/         # Step 2: Participant form
│   ├── results/              # Step 3: Assignment URLs
│   ├── assignment/           # Individual assignment view
│   └── admin/                # Admin dashboard
├── lib/
│   ├── components/           # Reusable components
│   ├── i18n/                # Internationalization
│   ├── supabase/            # Database utilities
│   └── utils/               # Helper functions
```

## License

MIT

