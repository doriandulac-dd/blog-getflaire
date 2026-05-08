import React, { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap';

export const Header: React.FC = () => {
  const headerRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    gsap.from('.header-item', {
      y: -18,
      autoAlpha: 0,
      duration: 0.55,
      stagger: 0.045,
      ease: 'power3.out',
    });
  }, { scope: headerRef });

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 border-b border-secondary/10 bg-white/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="header-item flex-shrink-0">
            <Link 
              to="/"
              className="hover:opacity-80 transition-opacity"
            >
              <img 
                src="/GetFlaire logo long hd 2000*500-min.png" 
                alt="Logo GetFlaire" 
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-7">
            <a 
              href="https://getflaire.fr/"
              className="header-item text-tertiary hover:text-secondary font-bold transition-colors"
            >
              Fonctionnalités
            </a>
            <a 
              href="https://getflaire.fr/"
              className="header-item text-tertiary hover:text-secondary font-bold transition-colors"
            >
              Tarifs
            </a>
            <a 
              href="https://getflaire.fr/"
              className="header-item text-tertiary hover:text-secondary font-bold transition-colors"
            >
              FAQ
            </a>
            <a 
              href="https://getflaire.fr/contact"
              className="header-item text-tertiary hover:text-secondary font-bold transition-colors"
            >
              Contact
            </a>
            <Link 
              to="/blog"
              className={`header-item font-bold transition-colors ${
                isActive('/blog')
                  ? 'text-secondary'
                  : 'text-tertiary hover:text-secondary'
              }`}
            >
              Blog
            </Link>
            <button 
              onClick={() => window.location.href = 'https://getflaire.fr/affiliation'}
              className="header-item text-tertiary hover:text-secondary font-bold transition-colors"
            >
              Affiliation
            </button>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden xl:flex items-center space-x-4">
            <a 
              href="https://app.getflaire.fr"
              className="header-item px-4 py-2 border border-secondary/25 text-secondary hover:border-secondary rounded-xl font-bold transition-colors"
            >
              Connexion
            </a>
            <a 
              href="https://app.getflaire.fr"
              className="header-item px-4 py-2 bg-primary hover:bg-[#ff9f1f] text-secondary rounded-xl font-extrabold shadow-lg shadow-primary/25 transition-colors"
            >
              Essayer gratuitement
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="header-item text-tertiary hover:text-secondary p-2"
              aria-label="Ouvrir le menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="xl:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-secondary/10 shadow-xl">
              <a 
                href="https://getflaire.fr/"
                className="block w-full text-left px-3 py-2 text-tertiary hover:text-secondary font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                Fonctionnalités
              </a>
              <a 
                href="https://getflaire.fr/"
                className="block w-full text-left px-3 py-2 text-tertiary hover:text-secondary font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                Tarifs
              </a>
              <a 
                href="https://getflaire.fr/"
                className="block w-full text-left px-3 py-2 text-tertiary hover:text-secondary font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </a>
              <a 
                href="https://getflaire.fr/contact"
                className="block w-full text-left px-3 py-2 text-tertiary hover:text-secondary font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              <Link 
                to="/blog"
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left px-3 py-2 font-bold ${
                  isActive('/blog')
                    ? 'text-secondary'
                    : 'text-tertiary hover:text-secondary'
                }`}
              >
                Blog
              </Link>
              
              <div className="pt-4 space-y-2">
                <a 
                  href="https://app.getflaire.fr"
                  className="block w-full text-center px-4 py-2 border border-secondary/25 text-secondary hover:border-secondary rounded-xl font-bold transition-colors"
                >
                  Connexion
                </a>
                <a 
                  href="https://app.getflaire.fr"
                  className="block w-full text-center px-4 py-2 bg-primary hover:bg-[#ff9f1f] text-secondary rounded-xl font-extrabold transition-colors"
                >
                  Essayer gratuitement
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
