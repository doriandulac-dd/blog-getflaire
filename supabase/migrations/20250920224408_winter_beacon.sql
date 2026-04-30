/*
  # Correction complète des politiques RLS

  1. Tables concernées
    - `blog_posts` : Lecture des articles publiés pour les utilisateurs anonymes
    - `newsletter_subscribers` : Inscription à la newsletter pour les utilisateurs anonymes

  2. Politiques RLS
    - Permettre la lecture des articles publiés (rôle anon)
    - Permettre l'inscription à la newsletter (rôle anon)
    - Validation des données d'entrée

  3. Sécurité
    - Accès en lecture seule pour les articles publiés
    - Insertion seulement pour la newsletter avec validation email
*/

-- =============================================
-- BLOG POSTS - Correction des politiques RLS
-- =============================================

-- Activer RLS sur la table blog_posts si ce n'est pas déjà fait
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques conflictuelles pour blog_posts
DROP POLICY IF EXISTS "Public can read published posts" ON blog_posts;
DROP POLICY IF EXISTS "Public read published" ON blog_posts;

-- Créer une nouvelle politique pour permettre la lecture des articles publiés
CREATE POLICY "Allow anonymous users to read published blog posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- =============================================
-- NEWSLETTER - Correction des politiques RLS
-- =============================================

-- Activer RLS sur la table newsletter_subscribers si ce n'est pas déjà fait
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Supprimer toutes les anciennes politiques conflictuelles pour newsletter_subscribers
DROP POLICY IF EXISTS "Enable newsletter subscription for anonymous users" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Enable newsletter subscription for authenticated users" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Users can view their own subscription" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON newsletter_subscribers;

-- Créer une politique pour permettre l'inscription à la newsletter (utilisateurs anonymes)
CREATE POLICY "Allow anonymous newsletter subscription"
  ON newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL 
    AND email != '' 
    AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );

-- Créer une politique pour permettre aux utilisateurs de voir leur propre abonnement
CREATE POLICY "Users can view their own newsletter subscription"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (
    email IN (
      SELECT auth.users.email 
      FROM auth.users 
      WHERE auth.users.id = auth.uid()
    )
  );

-- =============================================
-- INDEX ET CONTRAINTES
-- =============================================

-- Index unique pour éviter les doublons d'email (insensible à la casse)
CREATE UNIQUE INDEX IF NOT EXISTS newsletter_email_unique 
  ON newsletter_subscribers (lower(email));

-- Valeur par défaut pour subscribed_at en UTC
ALTER TABLE newsletter_subscribers 
  ALTER COLUMN subscribed_at SET DEFAULT timezone('utc', now());