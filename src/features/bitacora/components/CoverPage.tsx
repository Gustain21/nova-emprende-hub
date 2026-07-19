import React from 'react';

interface CoverPageProps {
  onStart: () => void;
}

const CoverPage: React.FC<CoverPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card to-background" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Mission badge */}
        <div className="mb-8">
          <span className="inline-block px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-primary border border-primary/30 rounded-full bg-primary/10">
            El Big Bang de los Negocios
          </span>
        </div>

        {/* Main title */}
        <h1 className="mb-4">
          <span className="block text-6xl md:text-8xl lg:text-9xl font-black text-foreground tracking-tight">
            LA
          </span>
          <span className="block text-6xl md:text-8xl lg:text-9xl font-black text-foreground tracking-tight">
            BITÁCORA
          </span>
          <span className="block text-6xl md:text-8xl lg:text-9xl font-black text-primary tracking-tight">
            DEL CAPITÁN
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground tracking-[0.2em] uppercase mt-8 mb-12">
          30 días para <span className="text-foreground font-bold">detonar tu mentalidad emprendedora</span>
        </p>

        {/* Decorative line */}
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-12" />

        {/* CTA Button */}
        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-lg transition-all duration-300 hover:scale-105 glow-energy"
        >
          <span>INICIAR MISIÓN</span>
          <span className="text-2xl group-hover:translate-x-1 transition-transform">🚀</span>
        </button>

        {/* Tagline */}
        <p className="mt-8 text-sm text-muted-foreground italic">
          El cuaderno de trabajo oficial
        </p>
      </div>

    </div>
  );
};

export default CoverPage;
