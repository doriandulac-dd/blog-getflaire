import React, { useRef } from 'react';
import { ArrowRight, Clock, Radar, Shield, Sparkles, TrendingUp } from 'lucide-react';
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '../lib/gsap';

export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const reduceMotion = prefersReducedMotion();
    const mm = gsap.matchMedia();

    if (reduceMotion) {
      gsap.set('.hero-reveal, .hero-stat, .hero-orbit, .hero-map-line', {
        autoAlpha: 1,
        clearProps: 'transform,filter',
      });
      return () => mm.revert();
    }

    const intro = gsap.timeline({
      defaults: { duration: 0.78, ease: 'power3.out' },
    });

    intro
      .from('.hero-badge', { y: 18, autoAlpha: 0, scale: 0.96 })
      .from('.hero-word', { yPercent: 105, rotateX: -26, autoAlpha: 0, stagger: 0.08 }, '-=0.35')
      .from('.hero-copy', { y: 24, autoAlpha: 0, filter: 'blur(10px)' }, '-=0.45')
      .from('.hero-cta', { y: 18, autoAlpha: 0, stagger: 0.08 }, '-=0.42')
      .from('.hero-stat', { y: 30, autoAlpha: 0, stagger: 0.12 }, '-=0.28');

    gsap.to('.hero-orbit', {
      rotate: 360,
      duration: 28,
      ease: 'none',
      repeat: -1,
    });

    mm.add(
      {
        isDesktop: '(min-width: 768px)',
        isMobile: '(max-width: 767px)',
      },
      ({ conditions }) => {
        const { isDesktop } = conditions as { isDesktop: boolean };

        gsap.to('.hero-map-line', {
          x: isDesktop ? 72 : 28,
          y: isDesktop ? -26 : -10,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
          },
        });

        gsap.to('.hero-parallax', {
          y: isDesktop ? 80 : 32,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    );

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, { scope: heroRef });

  return (
    <section ref={heroRef} className="relative overflow-hidden bg-secondary text-white pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_18%,rgba(255,178,63,0.22),transparent_18rem),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_38%)]" />
      <div className="hero-parallax motion-layer absolute -right-24 top-20 hidden h-96 w-96 rounded-full border border-white/10 bg-white/5 md:block" />
      <div className="hero-orbit motion-layer absolute left-6 top-28 h-36 w-36 rounded-full border border-primary/30 md:left-20 md:top-32">
        <div className="absolute -right-2 top-10 h-4 w-4 rounded-full bg-primary shadow-lg shadow-primary/40" />
      </div>
      <div className="hero-map-line motion-layer absolute bottom-24 left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-7">
          <div className="hero-badge inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-extrabold shadow-2xl shadow-black/10 backdrop-blur">
            <Sparkles className="w-4 h-4" />
            Nouveau : Pige immobilière intelligente
          </div>
        </div>

        <h1 className="mx-auto mb-6 max-w-5xl overflow-hidden text-5xl font-black leading-[0.95] md:text-7xl lg:text-8xl">
          <span className="block overflow-hidden pb-2">
            <span className="hero-word inline-block">Donnez du</span>{' '}
            <span className="hero-word inline-block text-primary">Flaire</span>
          </span>
          <span className="block overflow-hidden pb-2">
            <span className="hero-word inline-block">à vos mandats</span>
          </span>
        </h1>

        <p className="hero-copy mx-auto mb-9 max-w-4xl text-lg leading-relaxed text-[#b7c3d8] md:text-xl">
          Nous aidons les professionnels de l'immobilier à gagner du temps et à signer plus de mandats 
          grâce à une pige immobilière intelligente, un suivi optimisé et des outils modernes.
          <br />
          <span className="font-extrabold text-white">Une seule plateforme pour prospecter, analyser et transformer vos opportunités.</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="https://app.getflaire.fr/login"
            className="hero-cta btn-primary group inline-flex items-center px-8 py-4 text-lg"
          >
            Essayer gratuitement
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </a>
          
          <a 
            href="https://getflaire.fr/"
            className="hero-cta inline-flex items-center rounded-xl border border-white/70 px-8 py-4 text-lg font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-white hover:text-secondary"
          >
            Découvrir nos fonctionnalités
          </a>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 text-center md:mt-16 md:grid-cols-3 md:gap-6">
          <div className="hero-stat rounded-xl border border-white/15 bg-white/10 p-6 shadow-2xl shadow-black/10 backdrop-blur">
            <div className="flex items-center justify-center mb-3">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-2">10K+</div>
            <div className="text-[#b7c3d8]">annonces suivies chaque jour</div>
          </div>
          <div className="hero-stat rounded-xl border border-white/15 bg-white/10 p-6 shadow-2xl shadow-black/10 backdrop-blur">
            <div className="flex items-center justify-center mb-3">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-2">98%</div>
            <div className="text-[#b7c3d8]">de données fiabilisées</div>
          </div>
          <div className="hero-stat rounded-xl border border-white/15 bg-white/10 p-6 shadow-2xl shadow-black/10 backdrop-blur">
            <div className="flex items-center justify-center mb-3">
              <Radar className="w-8 h-8 text-primary" />
            </div>
            <div className="text-3xl font-bold mb-2">24h</div>
            <div className="text-[#b7c3d8]">pour détecter les nouvelles opportunités</div>
          </div>
        </div>

        <div className="hero-copy mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/10 px-4 py-2 text-sm font-bold text-[#b7c3d8]">
          <Clock className="h-4 w-4 text-primary" />
          Un blog pensé pour transformer la veille en mandats.
        </div>
      </div>
    </section>
  );
};
