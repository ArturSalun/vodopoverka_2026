/*
  # Add appointment date and time to service requests

  1. Changes
    - Add `appointment_date` column to store the preferred visit date
    - Add `appointment_time` column to store the preferred visit time
    
  2. Security
    - Maintain existing RLS policies
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'service_requests' AND column_name = 'appointment_date'
  ) THEN
    ALTER TABLE service_requests 
    ADD COLUMN appointment_date date,
    ADD COLUMN appointment_time time;
  END IF;
END $$;