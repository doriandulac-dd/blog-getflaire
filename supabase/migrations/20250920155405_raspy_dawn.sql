/*
  # Fix Newsletter RLS Policy - Final

  1. Security
    - Drop existing policies to start fresh
    - Create proper RLS policy for anonymous users
    - Ensure anon role can insert newsletter subscriptions
  
  2. Changes
    - Remove conflicting policies
    - Add comprehensive INSERT policy for anon role
    - Add proper validation
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow anonymous newsletter subscription" ON public.newsletter_subscribers;

-- Ensure RLS is enabled
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create a comprehensive policy for anonymous newsletter subscription
CREATE POLICY "Enable newsletter subscription for anonymous users"
ON public.newsletter_subscribers
FOR INSERT
TO anon
WITH CHECK (
  email IS NOT NULL 
  AND email != '' 
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

-- Also allow authenticated users to subscribe
CREATE POLICY "Enable newsletter subscription for authenticated users"
ON public.newsletter_subscribers
FOR INSERT
TO authenticated
WITH CHECK (
  email IS NOT NULL 
  AND email != '' 
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

-- Ensure the unique constraint exists
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_email_unique
ON public.newsletter_subscribers (lower(email));

-- Set proper defaults
ALTER TABLE public.newsletter_subscribers 
ALTER COLUMN subscribed_at SET DEFAULT timezone('utc', now());

ALTER TABLE public.newsletter_subscribers 
ALTER COLUMN is_active SET DEFAULT true;