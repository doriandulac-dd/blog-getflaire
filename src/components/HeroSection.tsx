import React, { useRef } from 'react';
import { ArrowRight, Sparkles, TrendingUp, Shield, Clock } from 'lucide-react';
import { gsap, useGSAP } from '../lib/gsap';

export const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-kicker', { autoAlpha: 0, y: 18, scale: 0.96, duration: 0.55 })
        .from('.hero-title', { autoAlpha: 0, y: 34, duration: 0.75 }, '-=0.25')
        .from('.hero-copy', { autoAlpha: 0, y: 24, duration: 0.65 }, '-=0.35')
        .from('.hero-cta', { y: 22, scale: 0.97, stagger: 0.08, duration: 0.55 }, '-=0.25')
        .from('.hero-stat', { y: 36, scale: 0.94, stagger: 0.12, duration: 0.65 }, '-=0.1');

      gsap.fromTo(
        '.hero-orb',
        { autoAlpha: 0.4, scale: 0.7 },
        { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.75)', stagger: 0.12 }
      );

      gsap.to('.hero-orb-primary', {
        yPercent: 28,
        xPercent: -10,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8
        }
      });

      gsap.to('.hero-orb-secondary', {
        yPercent: -32,
        xPercent: 12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.9
        }
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative bg-secondary text-white py-14 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="hero-orb hero-orb-primary absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full"></div>
      <div className="hero-orb hero-orb-secondary absolute bottom-20 left-20 w-24 h-24 bg-primary/5 rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <div className="mb-6">
          <div className="hero-kicker inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-2xl text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Nouveau : Pige immobilière intelligente
          </div>
        </div>

        <h1 className="hero-title text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Donnez du <span className="text-primary">Flaire</span>
          <br />
          à vos mandats
        </h1>

        <p className="hero-copy text-lg md:text-xl text-tertiary mb-8 max-w-4xl mx-auto leading-relaxed">
          Nous aidons les professionnels de l'immobilier à gagner du temps et à signer plus de mandats 
          grâce à une pige immobilière intelligente, un suivi optimisé et des outils modernes.
          <br />
          <span className="text-white font-medium">Une seule plateforme pour prospecter, analyser et transformer vos opportunités.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="https://app.getflaire.fr/login"
            className="hero-cta btn-primary group px-8 py-4 text-lg font-semibold"
          >
            Essayer gratuitement
            <ArrowRight className="inline-block w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
          
          <a 
            href="https://getflaire.fr/"
            className="hero-cta btn-outline px-8 py-4 text-lg font-semibold border-white text-white hover:bg-white hover:text-secondary"
          >
            Découvrir nos fonctionnalités
          </a>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
          <div className="hero-stat card p-6 bg-white/5">
            <div className="flex items-center justify-center mb-3">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-2">10K+</div>
            <div className="text-tertiary">annonces suivies chaque jour</div>
          </div>
          <div className="hero-stat card p-6 bg-white/5">
            <div className="flex items-center justify-center mb-3">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-2">98%</div>
            <div className="text-tertiary">de données fiabilisées</div>
          </div>
          <div className="hero-stat card p-6 bg-white/5">
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
