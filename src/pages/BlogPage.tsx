import React from 'react';
import { BlogList } from '../components/BlogList';

export const BlogPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pt-20 pb-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-6">
            Blog GetFlaire
          </h1>
          <p className="text-xl text-tertiary max-w-3xl mx-auto leading-relaxed">
            Découvrez nos réflexions sur la pige immobilière, l'investissement et les stratégies digitales des agences.
          </p>
        </div>

        <BlogList />
      </div>
    </div>
  );
};