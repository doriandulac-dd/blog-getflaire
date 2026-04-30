/*
  # Création de la table newsletter_subscribers

  1. Nouvelle table
    - `newsletter_subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `subscribed_at` (timestamp)
      - `is_active` (boolean, default true)
      - `source` (text, pour tracker d'où vient l'inscription)

  2. Sécurité
    - Enable RLS sur la table `newsletter_subscribers`
    - Politique pour permettre l'insertion anonyme
    - Aucune politique de lecture pour protéger les données
*/

-- Créer la table newsletter_subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  subscribed_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  source text DEFAULT 'website',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion anonyme (pour le formulaire public)
CREATE POLICY "Allow anonymous newsletter subscription"
  ON newsletter_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Politique pour permettre aux utilisateurs authentifiés de voir leurs propres inscriptions
CREATE POLICY "Users can view their own subscription"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (email IN (
    SELECT email FROM auth.users WHERE id = auth.uid()
  ));

-- Index pour optimiser les recherches par email
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email 
ON newsletter_subscribers(email);

-- Index pour optimiser les recherches par date
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at 
ON newsletter_subscribers(subscribed_at DESC);