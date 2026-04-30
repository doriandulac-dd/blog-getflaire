import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validation script for sitemap
async function validateSitemap() {
  console.log('🔍 Validation du sitemap...');
  
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  
  if (!fs.existsSync(sitemapPath)) {
    console.error('❌ Fichier sitemap.xml non trouvé');
    return false;
  }

  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  
  // Basic XML validation
  if (!sitemapContent.includes('<?xml version="1.0"') || 
      !sitemapContent.includes('<urlset') ||
      !sitemapContent.includes('</urlset>')) {
    console.error('❌ Structure XML invalide');
    return false;
  }

  // Count URLs
  const urlMatches = sitemapContent.match(/<url>/g);
  const urlCount = urlMatches ? urlMatches.length : 0;
  
  console.log(`✅ Sitemap valide avec ${urlCount} URLs`);
  
  // Extract and validate URLs
  const urlRegex = /<loc>(.*?)<\/loc>/g;
  const urls = [];
  let match;
  
  while ((match = urlRegex.exec(sitemapContent)) !== null) {
    urls.push(match[1]);
  }

  console.log('📋 URLs trouvées:');
  urls.forEach(url => {
    console.log(`  - ${url}`);
  });

  // Check for blog URLs
  const blogUrls = urls.filter(url => url.includes('/blog/') && !url.endsWith('/blog'));
  console.log(`📝 ${blogUrls.length} articles de blog dans le sitemap`);

  if (blogUrls.length === 0) {
    console.warn('⚠️  Aucun article de blog trouvé dans le sitemap');
  }

  return true;
}

// Test sitemap accessibility
async function testSitemapAccess(sitemapUrl) {
  return new Promise((resolve) => {
    const url = new URL(sitemapUrl);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'GET',
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      console.log(`📡 Status: ${res.statusCode} pour ${sitemapUrl}`);
      resolve(res.statusCode === 200);
    });

    req.on('error', (error) => {
      console.error(`❌ Erreur d'accès: ${error.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.error('❌ Timeout lors de l\'accès au sitemap');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Main validation function
async function runValidation() {
  const isValid = await validateSitemap();
  
  if (isValid) {
    console.log('\n🌐 Test d\'accessibilité...');
    const isAccessible = await testSitemapAccess('https://getflaire.fr/sitemap.xml');
    
    if (isAccessible) {
      console.log('✅ Sitemap accessible publiquement');
    } else {
      console.warn('⚠️  Sitemap non accessible (normal en développement)');
    }
  }
  
  return isValid;
}

if (process.argv[1] === __filename) {
  runValidation();
}

export { validateSitemap, testSitemapAccess, runValidation };
