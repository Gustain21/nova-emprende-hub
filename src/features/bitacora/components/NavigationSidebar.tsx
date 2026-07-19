import React, { useState } from 'react';
import { phases, PhaseContent, DayContent } from '@/features/bitacora/data/bitacoraContent';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface NavigationSidebarProps {
  currentDay: number;
  onSelectDay: (day: number) => void;
  onGoToIntro: () => void;
  onGoToConclusion: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  currentDay,
  onSelectDay,
  onGoToIntro,
  onGoToConclusion,
  isOpen,
  onClose
}) => {
  const [expandedPhases, setExpandedPhases] = useState<number[]>([1, 2, 3]);

  const togglePhase = (phase: number) => {
    setExpandedPhases(prev => 
      prev.includes(phase) 
        ? prev.filter(p => p !== phase)
        : [...prev, phase]
    );
  };

  const getPhaseClass = (phase: number) => {
    switch (phase) {
      case 1: return 'text-primary border-primary/30 bg-primary/10';
      case 2: return 'text-accent border-accent/30 bg-accent/10';
      case 3: return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      default: return '';
    }
  };

  const getDayClass = (day: number, phase: number) => {
    const isActive = currentDay === day;
    if (isActive) {
      switch (phase) {
        case 1: return 'bg-primary text-primary-foreground';
        case 2: return 'bg-accent text-accent-foreground';
        case 3: return 'bg-emerald-500 text-white';
        default: return 'bg-primary text-primary-foreground';
      }
    }
    return 'text-muted-foreground hover:text-foreground hover:bg-secondary/50';
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full w-72 bg-card border-r border-border z-50 transform transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-y-auto`}
      >
        <div className="p-6">
          {/* Logo/Title */}
          <div className="mb-8">
            <h2 className="text-lg font-black text-foreground">LA BITÁCORA</h2>
            <p className="text-xs text-primary font-bold">DEL CAPITÁN</p>
          </div>

          {/* Navigation items */}
          <nav className="space-y-2">
            {/* Intro link */}
            <button
              onClick={() => {
                onGoToIntro();
                onClose();
              }}
              className="w-full text-left nav-item nav-item-inactive flex items-center gap-2"
            >
              <span>📋</span>
              <span>Introducción</span>
            </button>

            {/* Phases */}
            {phases.map((phase) => (
              <div key={phase.phase} className="mt-4">
                {/* Phase header */}
                <button
                  onClick={() => togglePhase(phase.phase)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border ${getPhaseClass(phase.phase)} transition-all`}
                >
                  <div className="flex items-center gap-2">
                    <span>{phase.emoji}</span>
                    <span className="font-bold text-sm">Fase {phase.phase}</span>
                  </div>
                  {expandedPhases.includes(phase.phase) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {/* Days list */}
                {expandedPhases.includes(phase.phase) && (
                  <div className="mt-2 ml-4 space-y-1">
                    {phase.days.map((day) => (
                      <button
                        key={day.day}
                        onClick={() => {
                          onSelectDay(day.day);
                          onClose();
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${getDayClass(day.day, phase.phase)}`}
                      >
                        <span className="mr-2">{day.emoji}</span>
                        Día {day.day}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Conclusion link */}
            <button
              onClick={() => {
                onGoToConclusion();
                onClose();
              }}
              className="w-full text-left nav-item nav-item-inactive flex items-center gap-2 mt-4"
            >
              <span>🎯</span>
              <span>Conclusión</span>
            </button>
          </nav>
        </div>

      </aside>
    </>
  );
};

export default NavigationSidebar;
