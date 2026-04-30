import React, { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { gsap, useGSAP } from '../lib/gsap';

export const Header: React.FC = () => {
  const headerRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(headerRef.current, {
        autoAlpha: 0,
        y: -22,
        duration: 0.6,
        ease: 'power3.out'
      });

      gsap.from('.header-item', {
        autoAlpha: 0,
        y: -10,
        duration: 0.45,
        ease: 'power2.out',
        stagger: 0.045,
        delay: 0.15
      });
    });

    return () => mm.revert();
  }, { scope: headerRef });

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
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
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="https://getflaire.fr/"
              className="header-item text-[#778DA9] hover:text-[#1B263B] font-medium transition-colors"
            >
              Fonctionnalités
            </a>
            <a 
              href="https://getflaire.fr/"
              className="header-item text-[#778DA9] hover:text-[#1B263B] font-medium transition-colors"
            >
              Tarifs
            </a>
            <a 
              href="https://getflaire.fr/"
              className="header-item text-[#778DA9] hover:text-[#1B263B] font-medium transition-colors"
            >
              FAQ
            </a>
            <a 
              href="https://getflaire.fr/contact"
              className="header-item text-[#778DA9] hover:text-[#1B263B] font-medium transition-colors"
            >
              Contact
            </a>
            <Link 
              to="/blog"
              className={`header-item font-medium transition-colors ${
                isActive('/blog')
                  ? 'text-[#1B263B]'
                  : 'text-[#778DA9] hover:text-[#1B263B]'
              }`}
            >
              Blog
            </Link>
            <button 
              onClick={() => window.location.href = 'https://getflaire.fr/affiliation'}
              className="header-item text-[#778DA9] hover:text-[#1B263B] font-medium transition-colors"
            >
              Affiliation
            </button>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="https://app.getflaire.fr"
              className="header-item px-4 py-2 border border-[#778DA9] text-[#778DA9] hover:bg-[#778DA9] hover:text-white rounded-2xl font-medium transition-colors"
            >
              Connexion
            </a>
            <a 
              href="https://app.getflaire.fr"
              className="header-item px-4 py-2 bg-[#FFB23F] hover:bg-[#FF8F00] text-white rounded-2xl font-medium transition-colors"
            >
              Essayer gratuitement
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="header-item md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#778DA9] hover:text-[#1B263B] p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              <a 
                href="https://getflaire.fr/"
                className="block w-full text-left px-3 py-2 text-[#778DA9] hover:text-[#1B263B] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Fonctionnalités
              </a>
              <a 
                href="https://getflaire.fr/"
                className="block w-full text-left px-3 py-2 text-[#778DA9] hover:text-[#1B263B] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Tarifs
              </a>
              <a 
                href="https://getflaire.fr/"
                className="block w-full text-left px-3 py-2 text-[#778DA9] hover:text-[#1B263B] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </a>
              <a 
                href="https://getflaire.fr/contact"
                className="block w-full text-left px-3 py-2 text-[#778DA9] hover:text-[#1B263B] font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              <Link 
                to="/blog"
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left px-3 py-2 font-medium ${
                  isActive('/blog')
                    ? 'text-[#1B263B]'
                    : 'text-[#778DA9] hover:text-[#1B263B]'
                }`}
              >
                Blog
              </Link>
              
              <div className="pt-4 space-y-2">
                <a 
                  href="https://app.getflaire.fr"
                  className="block w-full text-center px-4 py-2 border border-[#778DA9] text-[#778DA9] hover:bg-[#778DA9] hover:text-white rounded-2xl font-medium transition-colors"
                >
                  Connexion
                </a>
                <a 
                  href="https://app.getflaire.fr"
                  className="block w-full text-center px-4 py-2 bg-[#FFB23F] hover:bg-[#FF8F00] text-white rounded-2xl font-medium transition-colors"
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
