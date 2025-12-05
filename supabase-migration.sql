-- Migration script to add event_name to existing tables
-- Run this if you already have the tables created without event_name

-- Step 1: Add event_name column to participants table (nullable first)
ALTER TABLE participants 
ADD COLUMN IF NOT EXISTS event_name TEXT;

-- Step 2: Add event_name column to admin_config table (nullable first)
ALTER TABLE admin_config 
ADD COLUMN IF NOT EXISTS event_name TEXT;

-- Step 3: Set default values for existing rows
-- For participants, create a unique event name per participant (we'll group them later if needed)
UPDATE participants 
SET event_name = 'legacy-event-' || id::text 
WHERE event_name IS NULL;

-- For admin_config, create a unique event name
UPDATE admin_config 
SET event_name = 'legacy-event-' || id::text 
WHERE event_name IS NULL;

-- Step 4: Now make it NOT NULL
ALTER TABLE participants 
ALTER COLUMN event_name SET NOT NULL;

ALTER TABLE admin_config 
ALTER COLUMN event_name SET NOT NULL;

-- Step 5: Add unique constraint to admin_config.event_name (drop first if exists)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'admin_config_event_name_unique'
    ) THEN
        ALTER TABLE admin_config DROP CONSTRAINT admin_config_event_name_unique;
    END IF;
END $$;

ALTER TABLE admin_config 
ADD CONSTRAINT admin_config_event_name_unique UNIQUE (event_name);

-- Step 6: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_participants_event_name ON participants(event_name);
CREATE INDEX IF NOT EXISTS idx_admin_config_event_name ON admin_config(event_name);

