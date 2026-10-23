# blog-getflaire

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-t5xks2h4)

Application React côté navigateur, construite avec Vite et React Router.
Les articles publiés sont lus depuis Supabase. Ce projet n'exécute pas Next.js.

## Développement et vérification

Utiliser une version LTS maintenue de Node.js (Node 24 recommandé), avec les
derniers correctifs de sécurité. Le minimum technique déclaré est Node 22.12.

```sh
npm ci
npm run typecheck
npm run lint
npm run build
npm run preview -- --host 127.0.0.1
```

Configurer `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans un fichier `.env`
local ignoré par Git. Ne jamais utiliser de clé Supabase `service_role` côté client.
Le build régénère `public/sitemap.xml` depuis les articles publiés, puis le valide.
Sans accès aux données, le générateur peut se rabattre sur les seules URLs
statiques ; `SITEMAP_STRICT=true npm run build` permet de rendre cet échec bloquant.

Pour compiler uniquement l'application sans régénérer le sitemap :

```sh
npm exec -- vite build
npm run sitemap:validate -- --local-only
```

## Dépendances et sécurité — 23 octobre 2026

- React et React DOM : **19.3.1**, avec types 19.3 et Lucide compatible React 19.
- React Router : **7.18.4** ; Vite : **7.3.7**, branche maintenue avec le plugin React 5.2.
- Suppression de `@next/font` 14.2.15, inutilisé, qui entraînait l'installation
  indirecte de Next.js 15.5.3 et de Sharp. Les polices restent chargées par CSS.
- Le verrouillage npm inclut les correctifs compatibles des dépendances
  transitives. Utiliser `npm ci` pour reproduire les versions examinées.
- Les cibles navigateur de Vite 5 sont conservées explicitement dans la configuration.

Les avis [React2Shell (CVE-2025-55182)](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components)
et [Next.js du 14 octobre 2026](https://nextjs.org/blog/nextjs-security-update-october-14-2026)
concernent des fonctions serveur absentes de cette SPA. Next.js publie les correctifs
16.4.1 / 15.5.28 ; les avis React RSC du 14 octobre
[RCE](https://github.com/react/react/security/advisories/GHSA-xqc2-xf4c-x3h3) et
[DoS](https://github.com/react/react/security/advisories/GHSA-h3gv-c5rc-p453)
indiquent notamment 19.3.1 comme version corrigée des paquets RSC. Aucun paquet
`react-server-dom-*` n'est installé ici.

Reste à traiter séparément : l'audit npm signale **7 dépendances de développement**
liées à Tailwind 3 (5 alertes élevées, 2 modérées), notamment `braces` et
`postcss-selector-parser`. La correction proposée nécessite une migration vers
Tailwind 4 et la vérification des styles. Ces outils traitent les fichiers du projet
lors de la compilation ; ils ne sont pas embarqués comme serveurs dans le site statique.
Ne pas appliquer `npm audit fix --force` sans examiner cette migration.
