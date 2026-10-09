/*
  # Add admin fields to service requests

  1. Changes
    - Add `is_read` column to track if admin has viewed the request
    - Add `admin_notes` column for internal notes
    - Add `priority` column for request prioritization
    - Update service_type_check constraint to include all service types
    - Add indexes for better query performance

  2. Security
    - Update RLS policies for admin access
*/

-- Add new columns
ALTER TABLE service_requests 
ADD COLUMN IF NOT EXISTS is_read boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS admin_notes text,
ADD COLUMN IF NOT EXISTS priority text DEFAULT 'normal'
  CHECK (priority IN ('low', 'normal', 'high', 'urgent'));

-- Update service_type constraint
ALTER TABLE service_requests 
DROP CONSTRAINT IF EXISTS service_type_check;

ALTER TABLE service_requests 
ADD CONSTRAINT service_type_check 
CHECK (service_type IN (
  'Повірка лічильників води',
  'Повірка багатотарифного лічильника на гарячу воду ЛВ-4Т',
  'Поверка счетчиков воды',
  'Поверка многотарифного счетчика на горячую воду ЛВ-4Т',
  'Обратный звонок'
));

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_service_requests_created_at 
ON service_requests(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_service_requests_status 
ON service_requests(status);

CREATE INDEX IF NOT EXISTS idx_service_requests_is_read 
ON service_requests(is_read);

-- Update RLS policies
CREATE POLICY "Admins can do everything"
ON service_requests
FOR ALL
TO authenticated
USING (auth.jwt() ->> 'email' = 'admin@vodopoverka.com')
WITH CHECK (auth.jwt() ->> 'email' = 'admin@vodopoverka.com');