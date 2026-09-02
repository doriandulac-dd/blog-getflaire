import React, { useRef } from 'react';
import { ArrowRight, BellRing, Clock, Radar, ShieldCheck, TrendingUp } from 'lucide-react';
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap';

const metrics = [
  { value: '10K+', label: 'annonces suivies chaque jour', icon: TrendingUp },
  { value: '98%', label: 'de données fiabilisées', icon: ShieldCheck },
  { value: '24h', label: 'pour détecter les opportunités', icon: Radar },
];

export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.62 } });
    timeline.from('.hero-copy > *', { y: 24, autoAlpha: 0, stagger: 0.075 }).from('.hero-cockpit', { x: 28, autoAlpha: 0 }, '-=0.4').from('.hero-metric', { y: 14, autoAlpha: 0, stagger: 0.07 }, '-=0.35');
  }, { scope: heroRef });

  return (
    <section ref={heroRef} className="dark-grid relative min-h-[760px] overflow-hidden pt-[73px] text-white">
      <div className="site-container grid min-h-[687px] items-center gap-14 py-16 lg:grid-cols-[0.86fr_1.14fr] lg:py-20">
        <div className="hero-copy relative z-10">
          <span className="eyebrow mb-7">Le blog de la pige nouvelle génération</span>
          <h1 className="max-w-2xl text-[clamp(3.1rem,6.2vw,5.6rem)] font-extrabold leading-[0.92] tracking-[-0.055em]">Donnez du <span className="text-primary">Flaire</span> à vos mandats.</h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-[#C0C8D2] md:text-lg">Conseils, méthodes et analyses pour transformer votre veille immobilière en opportunités concrètes.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="https://app.getflaire.fr/login" className="button-primary px-7 py-4">Essayer gratuitement <ArrowRight className="h-4 w-4" /></a>
            <a href="https://getflaire.fr/#product" className="button-secondary px-7 py-4">Voir le produit</a>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-[#C0C8D2]">
            <span className="inline-flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-primary" /> Lecture utile</span>
            <span className="inline-flex items-center gap-2"><BellRing className="h-3.5 w-3.5 text-primary" /> Veille terrain</span>
          </div>
        </div>

        <div className="hero-cockpit motion-layer relative">
          <div className="absolute -inset-5 border border-white/10 bg-white/[0.025]" />
          <div className="relative border border-white/15 bg-[#18202D] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.3)] md:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#8C99AA]">Cockpit éditorial</p><p className="mt-1 text-lg font-extrabold">Le terrain, décrypté.</p></div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#1F382F] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#8DDEA9]"><span className="h-1.5 w-1.5 rounded-full bg-[#55C979]" /> En veille</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {metrics.map(({ value, label, icon: Icon }) => <div key={value} className="hero-metric motion-layer border border-white/10 bg-[#101722] p-4"><Icon className="h-5 w-5 text-primary" /><strong className="mt-5 block text-2xl font-extrabold">{value}</strong><span className="mt-1 block text-xs leading-5 text-[#8C99AA]">{label}</span></div>)}
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
              <div className="border border-white/10 bg-white p-5 text-secondary">
                <div className="flex items-center justify-between"><span className="text-xs font-extrabold uppercase tracking-[0.16em] text-tertiary">Sujets à suivre</span><Radar className="h-4 w-4 text-primary" /></div>
                {['Pige immobilière', 'Prospection', 'Mandats exclusifs'].map((topic, index) => <div key={topic} className="flex items-center justify-between border-b border-secondary/10 py-3 last:border-0"><span className="text-sm font-bold">{topic}</span><span className="text-xs font-extrabold text-[#9B681E]">0{index + 1}</span></div>)}
              </div>
              <div className="flex flex-col justify-between bg-primary p-5 text-secondary"><p className="text-[10px] font-extrabold uppercase tracking-[0.18em]">Signal de la semaine</p><p className="my-8 text-3xl font-extrabold leading-none">+40%</p><p className="text-xs font-semibold leading-5">Une prospection structurée accélère la prise de mandat.</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
