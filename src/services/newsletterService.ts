import { supabase } from '../lib/supabase';

export interface NewsletterSubscription {
  email: string;
  source?: string;
}

export class NewsletterService {
  static async subscribe(email: string, source: string = 'website'): Promise<{ success: boolean; message: string }> {
    try {
      // Validation basique de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          success: false,
          message: 'Veuillez entrer une adresse email valide.'
        };
      }

      // Utiliser le client standard avec RLS configuré
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert([
          {
            email: email.toLowerCase().trim(),
            source,
            subscribed_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        // Gestion de l'erreur de duplication (email déjà inscrit)
        if (error.code === '23505') { // Unique violation
          return {
            success: false,
            message: 'Cette adresse email est déjà inscrite à notre newsletter.'
          };
        }
        
        console.error('Erreur lors de l\'inscription à la newsletter:', error);
        return {
          success: false,
          message: 'Une erreur est survenue. Veuillez réessayer plus tard.'
        };
      }

      return {
        success: true,
        message: 'Merci ! Vous êtes maintenant inscrit(e) à notre newsletter.'
      };

    } catch (error) {
      console.error('Erreur lors de l\'inscription à la newsletter:', error);
      return {
        success: false,
        message: 'Une erreur est survenue. Veuillez réessayer plus tard.'
      };
    }
  }

  static async unsubscribe(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('email', email.toLowerCase().trim());

      if (error) {
        console.error('Erreur lors de la désinscription:', error);
        return {
          success: false,
          message: 'Une erreur est survenue lors de la désinscription.'
        };
      }

      return {
        success: true,
        message: 'Vous avez été désinscrit(e) avec succès.'
      };

    } catch (error) {
      console.error('Erreur lors de la désinscription:', error);
      return {
        success: false,
        message: 'Une erreur est survenue lors de la désinscription.'
      };
    }
  }

  static async getSubscriberCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (error) {
        console.error('Erreur lors du comptage des abonnés:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Erreur lors du comptage des abonnés:', error);
      console.error('Newsletter subscription error:', error);
      return 0;
    }
  }
}