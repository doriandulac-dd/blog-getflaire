const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Test de connexion à Supabase
async function testConnection() {
  console.log('🔍 Test de connexion à Supabase...');
  
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables d\'environnement manquantes');
    return;
  }

  console.log('✅ Variables d\'environnement trouvées');
  console.log(`📍 URL: ${supabaseUrl}`);

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, is_published')
      .limit(5);

    if (error) {
      console.error('❌ Erreur de connexion:', error.message);
      return;
    }

    console.log('✅ Connexion réussie !');
    console.log(`📝 ${data.length} articles trouvés (échantillon):`);
    data.forEach(post => {
      console.log(`  - ${post.title} (${post.slug}) - ${post.is_published ? 'Publié' : 'Brouillon'}`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testConnection();