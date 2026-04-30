import React, { useState } from 'react';
import { Mail, Send, Check, AlertCircle } from 'lucide-react';
import { NewsletterService } from '../services/newsletterService';

interface NewsletterFormProps {
  source?: string;
  className?: string;
}

export const NewsletterForm: React.FC<NewsletterFormProps> = ({ 
  source = 'footer',
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage({
        type: 'error',
        text: 'Veuillez entrer votre adresse email.'
      });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await NewsletterService.subscribe(email, source);
      
      setMessage({
        type: result.success ? 'success' : 'error',
        text: result.message
      });

      if (result.success) {
        setEmail(''); // Vider le champ en cas de succès
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Une erreur est survenue. Veuillez réessayer.'
      });
    } finally {
      setIsLoading(false);
    }

    // Effacer le message après 5 secondes
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-3">
        <Mail className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Newsletter</h3>
      </div>
      
      <p className="text-tertiary mb-4 text-sm leading-relaxed">
        Recevez nos derniers articles sur la pige immobilière et les stratégies digitales directement dans votre boîte mail.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="flex-1 px-4 py-2 border border-tertiary/30 rounded-2xl bg-white text-secondary placeholder-tertiary/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-2xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Envoi...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>S'inscrire</span>
              </>
            )}
          </button>
        </div>

        {message && (
          <div className={`flex items-center gap-2 p-3 rounded-2xl text-sm ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <Check className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}
      </form>

      <p className="text-xs text-tertiary/80 mt-3">
        Pas de spam, désinscription possible à tout moment.
      </p>
    </div>
  );
};