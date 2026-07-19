import React from 'react';
import { introContent } from '@/features/bitacora/data/bitacoraContent';

interface IntroPageProps {
  onContinue: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Warning banner */}
        <div className="mb-12 p-6 bg-primary/10 border border-primary/30 rounded-lg">
          <h2 className="text-2xl md:text-3xl font-black text-primary text-center">
            {introContent.warning}
          </h2>
        </div>

        {/* Welcome section */}
        <section className="mb-12">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            🚀 Bienvenido a la plataforma de lanzamiento.
          </h3>
          <div className="prose prose-invert max-w-none">
            {introContent.welcome.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Divider */}
        <hr className="border-border my-8" />

        {/* How to use section */}
        <section className="mb-12">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            📋 Cómo usar esta Bitácora
          </h3>
          <div className="tactical-card">
            {introContent.howToUse.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed mb-2">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Rules section */}
        <section className="mb-12">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            ⚡ Tus 3 Reglas de Vuelo
          </h3>
          <div className="grid gap-4">
            {introContent.rules.map((rule, index) => (
              <div 
                key={index}
                className="exercise-box flex gap-4 items-start"
              >
                <span className="text-3xl">{rule.emoji}</span>
                <div>
                  <h4 className="font-bold text-foreground mb-1">{rule.title}</h4>
                  <p className="text-muted-foreground text-sm">{rule.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <hr className="border-border my-8" />

        {/* Closing message */}
        <section className="mb-12 text-center">
          <div className="spark-box border-l-primary">
            {introContent.closing.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-foreground leading-relaxed mb-2 last:mb-0 not-italic">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Continue button */}
        <div className="text-center">
          <button
            onClick={onContinue}
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-lg transition-all duration-300 hover:scale-105 glow-energy"
          >
            <span>COMENZAR FASE 1</span>
            <span className="text-xl">🔴</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
