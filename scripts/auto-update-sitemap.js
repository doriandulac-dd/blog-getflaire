import { createClient } from '@supabase/supabase-js';
import { generateBlogSitemap } from './generate-blog-sitemap.js';
import dotenv from 'dotenv';

// Configuration pour l'auto-update
const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
let lastCheck = new Date();
let isUpdating = false;

// Fonction pour vérifier s'il y a de nouveaux articles
async function checkForNewPosts() {
  if (isUpdating) {
    console.log('⏳ Mise à jour en cours, skip...');
    return false;
  }

  try {
    dotenv.config();
    
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️  Variables d\'environnement manquantes');
      return false;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Vérifier s'il y a des articles publiés depuis la dernière vérification
    const { data: newPosts, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, published_at, created_at')
      .eq('is_published', true)
      .gte('published_at', lastCheck.toISOString())
      .order('published_at', { ascending: false });

    if (error) {
      console.error('❌ Erreur lors de la vérification:', error.message);
      return false;
    }

    if (newPosts && newPosts.length > 0) {
      console.log(`🆕 ${newPosts.length} nouveau(x) article(s) détecté(s):`);
      newPosts.forEach(post => {
        console.log(`   - ${post.title} (${post.slug})`);
      });
      return true;
    }

    console.log('✅ Aucun nouvel article depuis la dernière vérification');
    return false;

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
    return false;
  }
}

// Fonction pour mettre à jour le sitemap
async function updateSitemap() {
  if (isUpdating) return;
  
  isUpdating = true;
  console.log('🔄 Mise à jour du sitemap en cours...');
  
  try {
    const result = await generateBlogSitemap();
    console.log('✅ Sitemap mis à jour avec succès !');
    console.log(`📊 ${result.totalUrls} URLs au total`);
    lastCheck = new Date();
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du sitemap:', error.message);
  } finally {
    isUpdating = false;
  }
}

// Fonction principale de surveillance
async function startSitemapWatcher() {
  console.log('🚀 Démarrage du système de surveillance du sitemap...');
  console.log(`⏰ Vérification toutes les ${CHECK_INTERVAL / 1000 / 60} minutes`);
  
  // Première génération
  await updateSitemap();
  
  // Surveillance continue
  setInterval(async () => {
    console.log('🔍 Vérification de nouveaux articles...');
    const hasNewPosts = await checkForNewPosts();
    
    if (hasNewPosts) {
      await updateSitemap();
    }
  }, CHECK_INTERVAL);
}

// Fonction pour forcer une mise à jour
async function forceSitemapUpdate() {
  console.log('🔄 Mise à jour forcée du sitemap...');
  await updateSitemap();
}

// Gestion des signaux pour arrêt propre
process.on('SIGINT', () => {
  console.log('\n👋 Arrêt du système de surveillance...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Arrêt du système de surveillance...');
  process.exit(0);
});

// Exporter les fonctions
export {
  startSitemapWatcher,
  forceSitemapUpdate,
  checkForNewPosts,
  updateSitemap
};

// Démarrer si appelé directement
if (process.argv[2] === '--start') {
  startSitemapWatcher();
} else if (process.argv[2] === '--force') {
  forceSitemapUpdate();
} else {
  console.log('Usage:');
  console.log('  node scripts/auto-update-sitemap.js --start   # Démarrer la surveillance');
  console.log('  node scripts/auto-update-sitemap.js --force   # Forcer une mise à jour');
}