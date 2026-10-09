/*
  # Create service requests table

  1. New Tables
    - `service_requests`
      - `id` (bigint, primary key)
      - `created_at` (timestamp with time zone)
      - `name` (text)
      - `phone` (text)
      - `address` (text)
      - `service_type` (text)
      - `message` (text)
      - `status` (text)

  2. Security
    - Enable RLS on `service_requests` table
    - Add policies for authenticated users to manage service requests
*/

CREATE TABLE service_requests (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  service_type text NOT NULL,
  message text,
  status text DEFAULT 'new' NOT NULL
);

ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert new requests
CREATE POLICY "Anyone can create service requests"
  ON service_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only authenticated users can view and manage requests
CREATE POLICY "Authenticated users can view all requests"
  ON service_requests
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update requests"
  ON service_requests
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);