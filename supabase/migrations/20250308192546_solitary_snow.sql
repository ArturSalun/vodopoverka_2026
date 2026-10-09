/*
  # Update phone column type

  1. Changes
    - Modify phone column to text type to better handle phone number formats
    - Add check constraint to ensure phone numbers contain only digits
  
  2. Security
    - Maintains existing RLS policies
*/

DO $$ 
BEGIN 
  -- Change phone column type to text
  ALTER TABLE service_requests 
  ALTER COLUMN phone TYPE text;

  -- Add check constraint to ensure phone contains only digits
  ALTER TABLE service_requests 
  ADD CONSTRAINT phone_format_check 
  CHECK (phone ~ '^[0-9]+$');
END $$;