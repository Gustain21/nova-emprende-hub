import React from 'react';
import { conclusionContent } from '@/data/bitacoraContent';

interface ConclusionPageProps {
  onRestart: () => void;
  onDownloadPDF: () => void;
}

const ConclusionPage: React.FC<ConclusionPageProps> = ({ onRestart, onDownloadPDF }) => {
  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success badge */}
        <div className="text-center mb-8">
          <span className="inline-block text-6xl mb-4">🎯</span>
          <span className="block phase-badge phase-3">
            Misión Completada
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-center text-foreground mb-8">
          {conclusionContent.title}
        </h1>

        {/* Content */}
        <div className="tactical-card mb-12">
          {conclusionContent.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-muted-foreground leading-relaxed mb-4 last:mb-0">
              {paragraph.split('**').map((part, i) => 
                i % 2 === 1 ? <strong key={i} className="text-foreground">{part}</strong> : part
              )}
            </p>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button
            onClick={onDownloadPDF}
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-lg transition-all duration-300 hover:scale-105 glow-energy w-full sm:w-auto justify-center"
          >
            <span>📥</span>
            <span>Descargar PDF</span>
          </button>
          
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-3 px-8 py-4 bg-secondary text-foreground font-bold text-lg rounded-lg transition-all duration-300 hover:bg-secondary/80 w-full sm:w-auto justify-center"
          >
            <span>🔄</span>
            <span>Volver al Inicio</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-border pt-8">
          <p className="text-lg font-bold text-foreground mb-2">
            EDITORIAL NOVA EMPRENDE
          </p>
          <a 
            href="https://www.editorialnovaemprende.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            www.editorialnovaemprende.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConclusionPage;
