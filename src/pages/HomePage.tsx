import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { BlogSection } from '../components/BlogSection';

export const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <BlogSection />
    </div>
  );
};