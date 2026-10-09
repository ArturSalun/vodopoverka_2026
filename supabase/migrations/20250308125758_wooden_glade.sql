/*
  # Update service types in service_requests table

  1. Changes
    - Update existing records to match new service types
    - Add check constraint for valid service types
*/

-- First, update any existing records to use the new service types
DO $$ 
BEGIN
  -- Update non-matching service types to 'Поверка счетчиков воды'
  UPDATE service_requests 
  SET service_type = 'Поверка счетчиков воды'
  WHERE service_type NOT IN (
    'Поверка счетчиков воды',
    'Поверка многотарифного счетчика на горячую воду',
    'Обратный звонок'
  );
END $$;

-- Now we can safely add the check constraint
ALTER TABLE service_requests DROP CONSTRAINT IF EXISTS service_type_check;
ALTER TABLE service_requests ADD CONSTRAINT service_type_check 
  CHECK (service_type IN (
    'Поверка счетчиков воды',
    'Поверка многотарифного счетчика на горячую воду',
    'Обратный звонок'
  ));