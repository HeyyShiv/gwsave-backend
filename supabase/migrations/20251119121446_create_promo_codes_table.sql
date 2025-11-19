/*
  # Create promo_codes table

  1. New Tables
    - `promo_codes`
      - `id` (uuid, primary key)
      - `code` (text, unique, the promo code string)
      - `type` (text, either 'starter' or 'standard')
      - `region` (text, either 'emea', 'americas', or 'asia-pacific')
      - `is_used` (boolean, whether the code has been redeemed)
      - `redeem_date` (timestamptz, when the code was redeemed, nullable)
      - `created_at` (timestamptz, when the code was created)

  2. Security
    - Enable RLS on `promo_codes` table
    - Add policy for service role to manage all promo codes
    - Codes should only be accessible through service role

  3. Indexes
    - Index on code for fast lookups
    - Index on is_used for filtering
    - Index on redeem_date for sorting used codes
    - Index on type and region for filtering

  4. Important Notes
    - The redeem_date field will be NULL for unused codes
    - When a code is marked as used, redeem_date should be set to current timestamp
    - Codes are sorted by redeem_date DESC to show latest redeemed codes first
*/

CREATE TABLE IF NOT EXISTS promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('starter', 'standard')),
  region text NOT NULL CHECK (region IN ('emea', 'americas', 'asia-pacific')),
  is_used boolean DEFAULT false,
  redeem_date timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage promo codes"
  ON promo_codes
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_is_used ON promo_codes(is_used);
CREATE INDEX IF NOT EXISTS idx_promo_codes_redeem_date ON promo_codes(redeem_date DESC);
CREATE INDEX IF NOT EXISTS idx_promo_codes_type ON promo_codes(type);
CREATE INDEX IF NOT EXISTS idx_promo_codes_region ON promo_codes(region);
CREATE INDEX IF NOT EXISTS idx_promo_codes_created_at ON promo_codes(created_at DESC);