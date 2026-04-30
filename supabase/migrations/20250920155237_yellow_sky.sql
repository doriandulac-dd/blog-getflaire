/*
  # Fix Newsletter RLS Policy

  1. Security
    - Enable RLS on newsletter_subscribers table
    - Add policy for anonymous users to subscribe
    - Add email validation in policy
    
  2. Constraints
    - Add unique index for case-insensitive email
    - Set default value for subscribed_at column
*/

-- 1) Enable RLS if not already done
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- 2) Policy for INSERT for anon role
CREATE POLICY "Public can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
TO anon
WITH CHECK (
  email IS NOT NULL
  AND position('@' in email) > 1
);

-- Email uniqueness, case insensitive
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_email_unique
  ON public.newsletter_subscribers (lower(email));

-- Default value on DB side (UTC)
ALTER TABLE public.newsletter_subscribers
  ALTER COLUMN subscribed_at SET DEFAULT timezone('utc', now());