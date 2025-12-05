-- Secret Santa Database Schema for Supabase

-- Participants table
CREATE TABLE IF NOT EXISTS participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    sms TEXT,
    token TEXT UNIQUE NOT NULL,
    assigned_to_id UUID REFERENCES participants(id),
    gift_ready BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin configuration table
CREATE TABLE IF NOT EXISTS admin_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_name TEXT NOT NULL UNIQUE,
    pin TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_participants_token ON participants(token);
CREATE INDEX IF NOT EXISTS idx_participants_assigned_to ON participants(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_participants_event_name ON participants(event_name);
CREATE INDEX IF NOT EXISTS idx_admin_config_event_name ON admin_config(event_name);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read participants (needed for assignment lookup by token)
CREATE POLICY "Allow public read on participants" ON participants
    FOR SELECT USING (true);

-- Policy: Allow anyone to insert participants (needed for initial setup)
CREATE POLICY "Allow public insert on participants" ON participants
    FOR INSERT WITH CHECK (true);

-- Policy: Allow anyone to update participants (needed for assignments and gift status)
CREATE POLICY "Allow public update on participants" ON participants
    FOR UPDATE USING (true);

-- Policy: Allow anyone to read admin config (needed for PIN verification)
CREATE POLICY "Allow public read on admin_config" ON admin_config
    FOR SELECT USING (true);

-- Policy: Allow anyone to insert admin config (needed for initial setup)
CREATE POLICY "Allow public insert on admin_config" ON admin_config
    FOR INSERT WITH CHECK (true);

-- Policy: Allow anyone to delete from both tables (needed for clear data)
CREATE POLICY "Allow public delete on participants" ON participants
    FOR DELETE USING (true);

CREATE POLICY "Allow public delete on admin_config" ON admin_config
    FOR DELETE USING (true);

