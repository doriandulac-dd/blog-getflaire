import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center mb-4">
              <img 
                src="/GetFlaire logo long hd 2000*500-min.png" 
                alt="Logo GetFlaire" 
                className="h-8 w-auto"
              />
            </Link>
             <p className="text-[#778DA9] leading-relaxed max-w-md">
              GetFlaire révolutionne la prospection immobilière en automatisant la veille du marché et en centralisant tous vos outils dans une seule plateforme intuitive.
            </p>
          </div>

          {/* Contact */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-tertiary">
                <Mail className="w-4 h-4" />
                <span>hello@getflaire.fr</span>
              </li>
              <li className="flex items-center gap-2 text-tertiary">
                <Phone className="w-4 h-4" />
                <span>+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center gap-2 text-tertiary">
                <MapPin className="w-4 h-4" />
                <span>Paris, France</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-tertiary/20 mt-8 pt-8 text-center">
          <p className="text-tertiary">
            © {new Date().getFullYear()} GetFlaire. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};