import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration pour le blog
const BLOG_SITE_URL = 'https://leblog.getflaire.fr';

// URLs statiques du blog
const staticUrls = [
  {
    loc: `${BLOG_SITE_URL}/`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: '1.0'
  },
  {
    loc: `${BLOG_SITE_URL}/blog`,
    lastmod: new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: '0.9'
  }
];

// Génération du sitemap pour le blog
async function generateBlogSitemap() {
  console.log('🚀 Génération du sitemap pour leblog.getflaire.fr...');
  
  let blogUrls = [];
  
  try {
    // Charger les variables d'environnement
    dotenv.config();
    
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️  Variables d\'environnement Supabase manquantes');
      console.warn('Génération du sitemap avec les URLs statiques uniquement');
    } else {
      console.log('✅ Variables d\'environnement trouvées');
      console.log(`📍 URL: ${supabaseUrl}`);

      const supabase = createClient(supabaseUrl, supabaseKey);

      // Récupérer tous les articles publiés avec timeout
      const { data: posts, error } = await Promise.race([
        supabase
          .from('blog_posts')
          .select('slug, published_at, created_at')
          .eq('is_published', true)
          .order('published_at', { ascending: false }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 10000)
        )
      ]);

      if (error) {
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      console.log(`📝 ${posts?.length || 0} articles trouvés`);

      // Générer les URLs des articles de blog
      blogUrls = posts?.map(post => {
        const publishedDate = post.published_at || post.created_at;
        return {
          loc: `${BLOG_SITE_URL}/blog/${post.slug}`,
          lastmod: new Date(publishedDate).toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.8'
        };
      }) || [];
    }
  } catch (error) {
    console.warn('⚠️  Erreur lors de la récupération des articles:', error.message);
    console.warn('Génération du sitemap avec les URLs statiques uniquement');
    blogUrls = [];
  }

  // Toujours générer le sitemap, même en cas d'erreur
  const allUrls = [...staticUrls, ...blogUrls];
  const xmlContent = generateXML(allUrls);

  // S'assurer que le dossier public existe
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Écrire le sitemap
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xmlContent, 'utf8');

  console.log('✅ Sitemap généré avec succès !');
  console.log(`📍 ${allUrls.length} URLs incluses dans le sitemap`);
  console.log(`   - ${staticUrls.length} URLs statiques`);
  console.log(`   - ${blogUrls.length} articles de blog`);
  console.log(`📁 Fichier: ${sitemapPath}`);

  // Générer un index de sitemap si nécessaire (plus de 1000 URLs)
  if (allUrls.length > 1000) {
    generateSitemapIndex(allUrls);
  }

  return {
    totalUrls: allUrls.length,
    staticUrls: staticUrls.length,
    blogUrls: blogUrls.length,
    sitemapPath
  };
}

function generateXML(urls) {
  const urlElements = urls.map(url => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

function generateSitemapIndex(urls) {
  console.log('📊 Génération d\'un index de sitemap pour optimiser les performances...');
  
  // Diviser les URLs en chunks de 1000 (bonne pratique pour les sitemaps)
  const chunks = [];
  for (let i = 0; i < urls.length; i += 1000) {
    chunks.push(urls.slice(i, i + 1000));
  }

  const publicDir = path.join(__dirname, '..', 'public');
  
  // Générer les sitemaps individuels
  chunks.forEach((chunk, index) => {
    const sitemapName = `sitemap-${index + 1}.xml`;
    const xmlContent = generateXML(chunk);
    fs.writeFileSync(path.join(publicDir, sitemapName), xmlContent, 'utf8');
  });

  // Générer l'index des sitemaps
  const indexElements = chunks.map((_, index) => {
    const sitemapName = `sitemap-${index + 1}.xml`;
    return `  <sitemap>
    <loc>${BLOG_SITE_URL}/${sitemapName}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`;
  }).join('\n');

  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexElements}
</sitemapindex>`;

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), indexXml, 'utf8');
  console.log(`✅ Index de sitemap créé avec ${chunks.length} fichiers`);
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// Test de connexion
async function testBlogConnection() {
  console.log('🔍 Test de connexion à Supabase pour le blog...');
  
  dotenv.config();
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables d\'environnement manquantes');
    return false;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, is_published')
      .limit(1);

    if (error) {
      console.error('❌ Erreur de connexion:', error.message);
      return false;
    }

    console.log('✅ Connexion réussie !');
    return true;
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return false;
  }
}

// Exporter les fonctions pour les tests
export {
  generateBlogSitemap,
  testBlogConnection,
  generateXML
};

// Exécuter si appelé directement
generateBlogSitemap().catch(error => {
  console.error('❌ Erreur fatale:', error.message);
  // Ne pas quitter avec un code d'erreur pour éviter de casser le build
  process.exit(0);
});