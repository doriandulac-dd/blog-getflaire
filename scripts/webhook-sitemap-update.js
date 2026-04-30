import express from 'express';
import { generateBlogSitemap } from './generate-blog-sitemap.js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3001;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret';

// Middleware pour parser le JSON
app.use(express.json());

// Fonction pour vérifier la signature du webhook (sécurité)
function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

// Endpoint pour recevoir les webhooks de Supabase
app.post('/webhook/blog-update', async (req, res) => {
  try {
    console.log('📨 Webhook reçu:', req.body);
    
    // Vérifier la signature si configurée
    const signature = req.headers['x-webhook-signature'];
    if (WEBHOOK_SECRET && signature) {
      const payload = JSON.stringify(req.body);
      if (!verifyWebhookSignature(payload, signature, WEBHOOK_SECRET)) {
        console.error('❌ Signature du webhook invalide');
        return res.status(401).json({ error: 'Signature invalide' });
      }
    }
    
    const { type, table, record } = req.body;
    
    // Vérifier que c'est bien un événement sur la table blog_posts
    if (table !== 'blog_posts') {
      console.log('ℹ️  Événement ignoré (pas sur blog_posts)');
      return res.status(200).json({ message: 'Événement ignoré' });
    }
    
    // Vérifier le type d'événement
    if (!['INSERT', 'UPDATE', 'DELETE'].includes(type)) {
      console.log('ℹ️  Type d\'événement ignoré:', type);
      return res.status(200).json({ message: 'Type d\'événement ignoré' });
    }
    
    console.log(`🔄 Événement ${type} détecté sur blog_posts`);
    
    // Pour les UPDATE, vérifier si c'est un changement de statut de publication
    if (type === 'UPDATE' && record) {
      console.log(`📝 Article mis à jour: ${record.title} (${record.slug})`);
      console.log(`📊 Statut de publication: ${record.is_published ? 'Publié' : 'Brouillon'}`);
    }
    
    // Régénérer le sitemap
    console.log('🔄 Régénération du sitemap...');
    const result = await generateBlogSitemap();
    
    console.log('✅ Sitemap mis à jour avec succès !');
    console.log(`📊 ${result.totalUrls} URLs au total`);
    
    res.status(200).json({
      message: 'Sitemap mis à jour avec succès',
      totalUrls: result.totalUrls,
      blogUrls: result.blogUrls,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du sitemap:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour du sitemap',
      message: error.message
    });
  }
});

// Endpoint de santé
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Webhook Sitemap Updater'
  });
});

// Endpoint pour forcer une mise à jour manuelle
app.post('/manual-update', async (req, res) => {
  try {
    console.log('🔄 Mise à jour manuelle du sitemap...');
    const result = await generateBlogSitemap();
    
    res.status(200).json({
      message: 'Sitemap mis à jour manuellement',
      totalUrls: result.totalUrls,
      blogUrls: result.blogUrls,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour manuelle:', error);
    res.status(500).json({
      error: 'Erreur lors de la mise à jour manuelle',
      message: error.message
    });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur webhook démarré sur le port ${PORT}`);
  console.log(`📡 Endpoint webhook: http://localhost:${PORT}/webhook/blog-update`);
  console.log(`🔧 Endpoint manuel: http://localhost:${PORT}/manual-update`);
  console.log(`❤️  Endpoint santé: http://localhost:${PORT}/health`);
});

export default app;