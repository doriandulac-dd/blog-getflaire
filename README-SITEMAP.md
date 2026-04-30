# Système de Sitemap Automatique pour leblog.getflaire.fr

Ce système génère et met à jour automatiquement le sitemap XML pour le blog GetFlaire.

## 🚀 Fonctionnalités

- **Génération automatique** : Sitemap généré à partir de la base de données Supabase
- **Mise à jour en temps réel** : Détection automatique des nouveaux articles
- **Webhooks** : Mise à jour instantanée via webhooks Supabase
- **Surveillance continue** : Vérification périodique des changements
- **Gestion d'erreurs** : Fallback gracieux en cas de problème de connexion

## 📋 Scripts Disponibles

### Génération du sitemap
```bash
# Générer le sitemap une fois
npm run blog-sitemap

# Tester la connexion à Supabase
npm run sitemap:test

# Valider le sitemap généré
npm run sitemap:validate
```

### Surveillance automatique
```bash
# Démarrer la surveillance (vérification toutes les 5 minutes)
npm run blog-sitemap:watch

# Forcer une mise à jour immédiate
npm run blog-sitemap:force
```

### Webhooks (optionnel)
```bash
# Démarrer le serveur webhook
npm run webhook:start
```

## ⚙️ Configuration

### Variables d'environnement
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Pour les webhooks (optionnel)
WEBHOOK_PORT=3001
WEBHOOK_SECRET=your-webhook-secret
```

### Configuration Supabase (Webhooks)

Pour activer les webhooks automatiques, configurez dans Supabase :

1. Allez dans **Database** > **Webhooks**
2. Créez un nouveau webhook :
   - **Name** : Blog Sitemap Update
   - **Table** : blog_posts
   - **Events** : Insert, Update, Delete
   - **URL** : `https://votre-domaine.com/webhook/blog-update`
   - **HTTP Headers** : `Content-Type: application/json`

## 🔄 Méthodes de Mise à Jour

### 1. Surveillance Continue (Recommandé pour le développement)
```bash
npm run blog-sitemap:watch
```
- Vérification automatique toutes les 5 minutes
- Détection des nouveaux articles publiés
- Mise à jour automatique du sitemap

### 2. Webhooks (Recommandé pour la production)
```bash
npm run webhook:start
```
- Mise à jour instantanée lors de changements
- Plus efficace pour la production
- Nécessite la configuration des webhooks Supabase

### 3. Mise à Jour Manuelle
```bash
npm run blog-sitemap:force
```
- Génération immédiate du sitemap
- Utile pour les tests et le débogage

## 📁 Structure du Sitemap

Le sitemap généré inclut :

- **Page d'accueil** : `https://leblog.getflaire.fr/` (priorité 1.0)
- **Index du blog** : `https://leblog.getflaire.fr/blog` (priorité 0.9)
- **Articles individuels** : `https://leblog.getflaire.fr/blog/slug-article` (priorité 0.8)

### Métadonnées optimisées :
- **lastmod** : Date de publication/modification de l'article
- **changefreq** : Fréquence de mise à jour appropriée
- **priority** : Priorité SEO optimisée

## 🛠️ Gestion d'Erreurs

Le système est conçu pour être robuste :

- **Connexion échouée** : Génère un sitemap avec les URLs statiques
- **Timeout** : Protection contre les requêtes qui traînent
- **Erreurs de build** : N'interrompt jamais le processus de build

## 📊 Monitoring

### Logs détaillés
Tous les scripts fournissent des logs détaillés :
- ✅ Succès avec statistiques
- ⚠️ Avertissements pour les problèmes non-critiques  
- ❌ Erreurs avec détails pour le débogage

### Endpoints de monitoring (avec webhooks)
- `GET /health` : Statut du service
- `POST /manual-update` : Mise à jour manuelle via API

## 🚀 Déploiement

### Développement
```bash
# Générer le sitemap localement
npm run blog-sitemap

# Démarrer la surveillance
npm run blog-sitemap:watch
```

### Production
1. Configurer les variables d'environnement
2. Configurer les webhooks Supabase (optionnel)
3. Ajouter au processus de build :
```json
{
  "scripts": {
    "prebuild": "npm run blog-sitemap",
    "build": "vite build"
  }
}
```

## 🔍 Validation

Le sitemap généré est automatiquement validé :
- Structure XML correcte
- URLs valides et accessibles
- Métadonnées complètes
- Conformité aux standards des sitemaps

## 📈 SEO Benefits

- **Indexation rapide** : Les nouveaux articles sont découverts immédiatement
- **Métadonnées riches** : Informations complètes pour les moteurs de recherche
- **Structure optimisée** : Hiérarchie claire des contenus
- **Mise à jour automatique** : Toujours synchronisé avec le contenu

## 🆘 Dépannage

### Le sitemap ne se génère pas
1. Vérifier les variables d'environnement
2. Tester la connexion : `npm run sitemap:test`
3. Vérifier les logs pour les erreurs

### Les nouveaux articles n'apparaissent pas
1. Vérifier que `is_published = true`
2. Forcer une mise à jour : `npm run blog-sitemap:force`
3. Vérifier la configuration des webhooks

### Erreurs de webhooks
1. Vérifier l'URL du webhook
2. Contrôler les logs du serveur
3. Tester manuellement : `POST /manual-update`