import React from 'react';
import { ArrowRight, Sparkles, TrendingUp, Shield, Clock } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-secondary text-white py-14 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-primary/5 rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-2xl text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Nouveau : Pige immobilière intelligente
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Donnez du <span className="text-primary">Flaire</span>
          <br />
          à vos mandats
        </h1>

        <p className="text-lg md:text-xl text-tertiary mb-8 max-w-4xl mx-auto leading-relaxed">
          Nous aidons les professionnels de l'immobilier à gagner du temps et à signer plus de mandats 
          grâce à une pige immobilière intelligente, un suivi optimisé et des outils modernes.
          <br />
          <span className="text-white font-medium">Une seule plateforme pour prospecter, analyser et transformer vos opportunités.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="https://app.getflaire.fr/login"
            className="btn-primary group px-8 py-4 text-lg font-semibold"
          >
            Essayer gratuitement
            <ArrowRight className="inline-block w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
          
          <a 
            href="https://getflaire.fr/"
            className="btn-outline px-8 py-4 text-lg font-semibold border-white text-white hover:bg-white hover:text-secondary"
          >
            Découvrir nos fonctionnalités
          </a>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
          <div className="card p-6 bg-white/5">
            <div className="flex items-center justify-center mb-3">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-2">10K+</div>
            <div className="text-tertiary">annonces suivies chaque jour</div>
          </div>
          <div className="card p-6 bg-white/5">
            <div className="flex items-center justify-center mb-3">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-2">98%</div>
            <div className="text-tertiary">de données fiabilisées</div>
          </div>
          <div className="card p-6 bg-white/5">
            <div className="flex items-center justify-center mb-3">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-2">24h</div>
            <div className="text-tertiary">pour détecter les nouvelles opportunités</div>
          </div>
        </div>
      </div>
    </section>
  );
};