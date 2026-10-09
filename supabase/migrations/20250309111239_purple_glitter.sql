/*
  # Update service type values

  1. Changes
    - Update service_type check constraint to match the actual service options used in the application
    - Ensure values match exactly between frontend and database

  2. Security
    - Maintains existing RLS policies
*/

DO $$ 
BEGIN
  -- Drop existing constraint if it exists
  ALTER TABLE service_requests DROP CONSTRAINT IF EXISTS service_type_check;
  
  -- Add updated constraint with correct service types
  ALTER TABLE service_requests 
    ADD CONSTRAINT service_type_check 
    CHECK (service_type = ANY (ARRAY[
      'Повірка лічильників води',
      'Повірка багатотарифного лічильника на гарячу воду ЛВ-4Т',
      'Обратный звонок',
      'Поверка счетчиков воды',
      'Поверка многотарифного счетчика на горячую воду ЛВ-4Т'
    ]));
END $$;