/*
  # Création du schéma complet pour le blog GetFlaire

  1. Nouvelles Tables
    - `authors` - Auteurs des articles avec bio et avatar
    - `categories` - Catégories pour organiser les articles  
    - `blog_posts` - Articles de blog avec contenu Markdown
    - `post_categories` - Table de liaison pour relations many-to-many

  2. Sécurité
    - Activation RLS sur toutes les tables
    - Policies pour lecture publique des contenus publiés
    - Policies restrictives pour modifications (future interface admin)

  3. Données de test
    - 2 auteurs avec bio complète
    - 3 catégories (Technologie, Design, Business) 
    - 3 articles de blog publiés avec contenu réaliste
*/

-- Table des auteurs
CREATE TABLE IF NOT EXISTS authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text NOT NULL,
  bio text DEFAULT '',
  avatar_url text DEFAULT ''
);

-- Table des catégories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL
);

-- Table des articles de blog
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  author_id uuid REFERENCES authors(id),
  published_at timestamptz DEFAULT now(),
  featured_image_url text DEFAULT '',
  is_published boolean DEFAULT false
);

-- Table de liaison articles-catégories  
CREATE TABLE IF NOT EXISTS post_categories (
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Activation RLS
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;

-- Policies pour lecture publique
CREATE POLICY "Public can read authors" ON authors FOR SELECT TO public USING (true);
CREATE POLICY "Public can read categories" ON categories FOR SELECT TO public USING (true);
CREATE POLICY "Public can read published posts" ON blog_posts FOR SELECT TO public USING (is_published = true);
CREATE POLICY "Public can read post categories" ON post_categories FOR SELECT TO public USING (true);

-- Insertion des données de test

-- Auteurs
INSERT INTO authors (name, bio, avatar_url) VALUES 
  ('Marie Dubois', 'Développeuse Full-Stack passionnée par les technologies web modernes et l''UX. 8 ans d''expérience dans le développement d''applications React et Node.js.', 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg'),
  ('Thomas Martin', 'Designer UI/UX et entrepreneur. Spécialisé dans la création d''interfaces intuitives et l''optimisation de l''expérience utilisateur pour les startups.', 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg');

-- Catégories
INSERT INTO categories (name, slug) VALUES
  ('Technologie', 'technologie'),
  ('Design', 'design'), 
  ('Business', 'business');

-- Articles de blog
INSERT INTO blog_posts (slug, title, excerpt, content, author_id, featured_image_url, is_published, published_at) VALUES 
  (
    'future-of-web-development-2025',
    'L''avenir du développement web en 2025',
    'Explorez les tendances émergentes qui façonneront le développement web : IA générative, WebAssembly, et architectures edge-first.',
    '# L''avenir du développement web en 2025

Le paysage du développement web évolue à une vitesse vertigineuse. En tant que développeurs, nous devons nous adapter aux nouvelles technologies qui redéfinissent notre façon de concevoir et construire des applications web.

## L''intelligence artificielle générative

L''IA générative transforme radicalement notre approche du développement. Des outils comme GitHub Copilot et ChatGPT nous permettent de :

- **Accélérer le prototypage** : Génération rapide de composants et de logique métier
- **Améliorer la qualité du code** : Suggestions d''optimisations et détection d''erreurs
- **Faciliter la documentation** : Création automatique de commentaires et guides

## WebAssembly : La révolution performance

WebAssembly (WASM) ouvre de nouvelles possibilités :

```javascript
// Exemple d''utilisation de WebAssembly
import init, { process_image } from ''./pkg/image_processor.js'';

async function optimizeImage(imageData) {
  await init();
  return process_image(imageData);
}
```

## Architectures Edge-First

L''edge computing devient incontournable pour :
- Réduire la latence utilisateur
- Améliorer les performances globales  
- Optimiser les coûts d''infrastructure

Les frameworks comme Next.js 14 et Remix intègrent nativement ces concepts, permettant un rendu au plus près des utilisateurs.

## Conclusion

2025 sera une année charnière où l''IA, les performances edge et les nouvelles architectures convergeront pour créer des expériences web exceptionnelles.',
    (SELECT id FROM authors WHERE name = 'Marie Dubois'),
    'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg',
    true,
    '2025-01-10 10:00:00+00'
  ),
  (
    'design-systems-scale-startup',
    'Construire un design system qui scale pour votre startup',
    'Guide pratique pour créer un design system évolutif dès les premiers jours de votre startup, sans sacrifier la vélocité de développement.',
    '# Construire un design system qui scale pour votre startup

Un design system bien pensé peut faire la différence entre une startup qui grandit sereinement et une qui s''enlise dans la dette technique. Voici comment le construire efficacement.

## Commencer petit, penser grand

### Les fondations essentielles

Démarrez avec les éléments critiques :

1. **Palette de couleurs** : 5-6 couleurs maximum
2. **Typography scale** : 4-5 tailles de polices
3. **Spacing system** : Système basé sur 8px
4. **Composants de base** : Button, Input, Card

### Exemple d''implémentation

```css
:root {
  /* Colors */
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-900: #1e3a8a;
  
  /* Spacing */
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem;  /* 8px */
  --space-4: 1rem;    /* 16px */
  --space-8: 2rem;    /* 32px */
}
```

## Outils et workflow

### Documentation vivante

Utilisez **Storybook** pour :
- Cataloguer vos composants
- Tester les variations
- Maintenir la documentation à jour

### Tokens de design

Implémentez des design tokens avec **Style Dictionary** :

```json
{
  "color": {
    "primary": {
      "value": "#3b82f6"
    }
  }
}
```

## Gouvernance et adoption

### Règles simples

1. **Pas de CSS custom** sans validation
2. **Composants réutilisables** pour tous les éléments récurrents  
3. **Reviews systématiques** des nouveaux patterns

### Évangélisation

- **Sessions de formation** régulières
- **Champions** du design system dans chaque équipe
- **Métriques d''adoption** pour mesurer le succès

## Évolution continue

Un design system n''est jamais fini. Planifiez des **audits trimestriels** pour :

- Identifier les patterns émergents
- Nettoyer les composants obsolètes
- Aligner sur les évolutions produit

Avec cette approche, votre design system grandira naturellement avec votre startup.',
    (SELECT id FROM authors WHERE name = 'Thomas Martin'),
    'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
    true,
    '2025-01-05 14:30:00+00'
  ),
  (
    'monetization-strategies-saas-2025',
    'Stratégies de monétisation SaaS en 2025',
    'Analyse des modèles de pricing innovants qui cartonnent en 2025 : usage-based, value-based et hybrid pricing pour maximiser votre revenue.',
    '# Stratégies de monétisation SaaS en 2025

Le marché SaaS a évolué. Les stratégies de pricing traditionnelles montrent leurs limites face aux attentes des utilisateurs modernes.

## L''ère du Usage-Based Pricing

### Pourquoi ça marche

Le **usage-based pricing** aligne parfaitement coûts et valeur :

- **Fairness perçue** : "Je paie ce que j''utilise"
- **Élasticité naturelle** : Croissance organique avec l''usage client
- **Barrier d''entrée réduite** : Essai sans engagement lourd

### Exemples concrets

**Stripe** : 2.9% + 30¢ par transaction
**Twilio** : Prix par message/appel
**Vercel** : Tarification par déploiement et bandwidth

```javascript
// Exemple de calcul dynamique
const calculatePrice = (usage) => {
  const tiers = [
    { limit: 1000, rate: 0.10 },
    { limit: 10000, rate: 0.08 },
    { limit: Infinity, rate: 0.06 }
  ];
  
  return tiers.reduce((total, tier, index) => {
    const prevLimit = index > 0 ? tiers[index-1].limit : 0;
    const tierUsage = Math.min(usage - prevLimit, tier.limit - prevLimit);
    return total + (tierUsage > 0 ? tierUsage * tier.rate : 0);
  }, 0);
};
```

## Value-Based Pricing : La révolution

### Mesurer la valeur créée

Au lieu de facturer des **features**, facturez la **valeur business** :

- **ROI client** : % du gain généré
- **Coût évité** : Économies réalisées  
- **Efficacité gagnée** : Temps économisé valorisé

### Implémentation pratique

1. **Customer Success** proactif pour mesurer l''impact
2. **Analytics avancées** pour tracker la valeur
3. **Négociation** basée sur les metrics business

## Modèles hybrides : Le meilleur des deux mondes

### Combinaisons gagnantes

- **Base fixe + Usage variable** : Prédictibilité + flexibilité
- **Tiers + Value sharing** : Simplicité + alignment sur le ROI
- **Freemium + Premium usage** : Acquisition + monétisation

### Exemple concret : Notion

- **Personal** : Gratuit jusqu''à une certaine limite
- **Pro** : $8/mois + usage illimité  
- **Enterprise** : Value-based sur la productivité équipe

## Métriques clés pour 2025

### Suivez ces indicateurs

- **Net Revenue Retention** (objectif: >110%)
- **Customer Lifetime Value / Customer Acquisition Cost** (objectif: >3:1)
- **Expansion Revenue %** (objectif: >30%)
- **Pricing Sensitivity Index** (testez régulièrement)

Le pricing n''est plus une décision ponctuelle, mais un **levier stratégique continu** d''optimisation.',
    (SELECT id FROM authors WHERE name = 'Marie Dubois'),  
    'https://images.pexels.com/photos/7947661/pexels-photo-7947661.jpeg',
    true,
    '2024-12-28 09:15:00+00'
  );

-- Liaison articles-catégories
INSERT INTO post_categories (post_id, category_id) VALUES
  ((SELECT id FROM blog_posts WHERE slug = 'future-of-web-development-2025'), (SELECT id FROM categories WHERE slug = 'technologie')),
  ((SELECT id FROM blog_posts WHERE slug = 'design-systems-scale-startup'), (SELECT id FROM categories WHERE slug = 'design')),
  ((SELECT id FROM blog_posts WHERE slug = 'design-systems-scale-startup'), (SELECT id FROM categories WHERE slug = 'business')),
  ((SELECT id FROM blog_posts WHERE slug = 'monetization-strategies-saas-2025'), (SELECT id FROM categories WHERE slug = 'business'));