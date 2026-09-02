import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap';

const navigation = [
  { label: 'Produit', href: 'https://getflaire.fr/#product' },
  { label: 'Méthode', href: 'https://getflaire.fr/#method' },
  { label: 'Tarifs', href: 'https://getflaire.fr/#pricing' },
  { label: 'FAQ', href: 'https://getflaire.fr/#faq' },
];

export const Header: React.FC = () => {
  const headerRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const updateHeader = () => setIsScrolled(window.scrollY > 24);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  useEffect(() => setIsMenuOpen(false), [location.pathname]);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo(
      '.header-reveal',
      { y: -10, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.4,
        stagger: 0.03,
        ease: 'power2.out',
        clearProps: 'transform,opacity,visibility',
      },
    );
  }, { scope: headerRef });

  return (
    <header ref={headerRef} className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${isScrolled || isMenuOpen ? 'border-secondary/10 bg-white/95 text-secondary shadow-[0_8px_30px_rgba(16,23,34,0.06)] backdrop-blur-md' : 'border-white/10 bg-secondary/70 text-white backdrop-blur-md'}`}>
      <div className="site-container flex h-[73px] items-center justify-between">
        <Link to="/" className="header-reveal shrink-0" aria-label="Accueil du blog GetFlaire">
          <img src="/GetFlaire logo long hd 2000*500-min.png" alt="GetFlaire" className="h-8 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navigation principale">
          {navigation.map((item) => <a key={item.label} href={item.href} className="header-reveal text-sm font-semibold transition-colors hover:text-primary">{item.label}</a>)}
          <Link to="/blog" className="header-reveal text-sm font-semibold text-primary">Blog</Link>
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a href="https://app.getflaire.fr/login" className="header-reveal text-sm font-semibold transition-colors hover:text-primary">Connexion</a>
          <a href="https://app.getflaire.fr/login" className="header-reveal button-primary">Essayer gratuitement <ArrowUpRight className="h-4 w-4" /></a>
        </div>

        <button type="button" onClick={() => setIsMenuOpen((open) => !open)} className="header-reveal rounded-md p-2 transition-colors hover:text-primary lg:hidden" aria-expanded={isMenuOpen} aria-controls="mobile-navigation" aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div id="mobile-navigation" className="border-t border-secondary/10 bg-white text-secondary lg:hidden">
          <nav className="site-container flex flex-col py-5" aria-label="Navigation mobile">
            {navigation.map((item) => <a key={item.label} href={item.href} className="border-b border-secondary/10 py-3 text-base font-semibold">{item.label}</a>)}
            <Link to="/blog" className="border-b border-secondary/10 py-3 text-base font-semibold text-[#9B681E]">Blog</Link>
            <div className="grid grid-cols-2 gap-3 pt-5">
              <a href="https://app.getflaire.fr/login" className="rounded-md border border-secondary/20 px-4 py-3 text-center text-sm font-bold">Connexion</a>
              <a href="https://app.getflaire.fr/login" className="button-primary px-4">Essayer <ArrowUpRight className="h-4 w-4" /></a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
