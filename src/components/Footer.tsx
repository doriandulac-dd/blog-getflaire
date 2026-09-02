import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const productLinks = [
  ['Fonctionnalités', 'https://getflaire.fr/#product'], ['Méthode', 'https://getflaire.fr/#method'], ['Tarifs', 'https://getflaire.fr/#pricing'], ['FAQ', 'https://getflaire.fr/#faq'], ['Contact', 'https://getflaire.fr/contact'], ['Affiliation', 'https://getflaire.fr/affiliation'],
];
const legalLinks = [
  ['Mentions légales', 'https://getflaire.fr/mentions-legales'], ['CGU', 'https://getflaire.fr/cgu'], ['Confidentialité', 'https://getflaire.fr/politique-confidentialite'], ['Conditions', 'https://getflaire.fr/conditions'], ['Remboursements', 'https://getflaire.fr/remboursements'], ['Annulation', 'https://getflaire.fr/annulation'], ['RGPD', 'https://getflaire.fr/rgpd'],
];

export const Footer: React.FC = () => (
  <footer className="dark-grid border-t border-white/10 text-white">
    <div className="site-container py-16 md:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr_0.6fr]">
        <div>
          <Link to="/" aria-label="Accueil du blog GetFlaire"><img src="/GetFlaire logo long hd 2000*500-min.png" alt="GetFlaire" className="h-8 w-auto" /></Link>
          <p className="mt-6 max-w-md text-sm leading-6 text-[#9DA8B7]">La pige immobilière nouvelle génération pour détecter, suivre et convertir davantage d’opportunités.</p>
          <a href="https://app.getflaire.fr/login" className="text-link mt-7 text-primary">Essayer gratuitement <ArrowUpRight className="h-4 w-4" /></a>
        </div>
        <div><h3 className="text-sm font-extrabold tracking-normal">GetFlaire</h3><ul className="mt-5 space-y-3 text-sm text-[#9DA8B7]">{productLinks.map(([label, href]) => <li key={label}><a href={href} className="transition-colors hover:text-primary">{label}</a></li>)}<li><Link to="/blog" className="transition-colors hover:text-primary">Blog</Link></li></ul></div>
        <div><h3 className="text-sm font-extrabold tracking-normal">Informations</h3><ul className="mt-5 space-y-3 text-sm text-[#9DA8B7]">{legalLinks.map(([label, href]) => <li key={label}><a href={href} className="transition-colors hover:text-primary">{label}</a></li>)}</ul></div>
      </div>
      <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-[#7D8999] sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} GetFlaire. Tous droits réservés.</p><p>Hébergé en France · Données sécurisées</p></div>
    </div>
  </footer>
);
