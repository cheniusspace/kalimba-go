# Supabase Setup for Kalimba Go

## 🚀 Quick Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and API keys

### 2. Set Environment Variables
Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# API Server
API_PORT=3001
```

### 3. Create Database Schema
Run this SQL in your Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies (optional - for public access)
CREATE POLICY "Allow public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON users FOR INSERT WITH CHECK (true);
```

### 4. Start Development Servers
```bash
# Start all services
pnpm dev

# Or start individually
pnpm --filter web dev     # Web app (port 3000)
pnpm --filter api dev      # API server (port 3001)
pnpm --filter mobile start # Mobile app
```

## 📱 Available Endpoints

### Web App (Next.js API Routes)
- `GET /api/users` - Fetch all users
- `POST /api/users` - Create new user
- `/auth` - Authentication page

### API Server (Express)
- `GET /api/users` - Fetch all users
- `POST /api/users` - Create new user
- `GET /api/health` - Health check

## 🔧 Features Included

- ✅ **Database**: PostgreSQL with Supabase
- ✅ **Authentication**: Supabase Auth (email/password)
- ✅ **Real-time**: Supabase real-time subscriptions
- ✅ **Type Safety**: TypeScript types for database
- ✅ **Cross-platform**: Web, Mobile, API server
- ✅ **Shared Package**: `@kalimba/supabase` for all apps

## 🎯 Next Steps

1. **Set up your Supabase project**
2. **Add environment variables**
3. **Create the database schema**
4. **Run `pnpm dev` to start all services**
5. **Visit `http://localhost:3000/auth` to test authentication**

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase TypeScript](https://supabase.com/docs/guides/api/generating-types)


