import React, { useState } from 'react';
import { DayContent } from '@/data/bitacoraContent';

interface DayPageProps {
  day: DayContent;
  phase: number;
  onPrevious: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  answers: Record<string, string>;
  onAnswerChange: (fieldId: string, value: string) => void;
}

const DayPage: React.FC<DayPageProps> = ({
  day,
  phase,
  onPrevious,
  onNext,
  isFirst,
  isLast,
  answers,
  onAnswerChange
}) => {
  const getPhaseClass = () => {
    switch (phase) {
      case 1: return 'phase-1';
      case 2: return 'phase-2';
      case 3: return 'phase-3';
      default: return 'phase-1';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 1: return 'text-primary';
      case 2: return 'text-accent';
      case 3: return 'text-emerald-400';
      default: return 'text-primary';
    }
  };

  const getPhaseBorderColor = () => {
    switch (phase) {
      case 1: return 'border-primary';
      case 2: return 'border-accent';
      case 3: return 'border-emerald-500';
      default: return 'border-primary';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Day header */}
        <div className="mb-8 text-center">
          <span className={`phase-badge ${getPhaseClass()} mb-4 inline-block`}>
            Fase {phase} • Día {day.day}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-foreground flex items-center justify-center gap-3">
            <span className="text-4xl">{day.emoji}</span>
            <span>{day.title}</span>
          </h1>
        </div>

        {/* Spark/Insight section */}
        <section className="mb-10">
          <h3 className={`text-lg font-bold ${getPhaseColor()} mb-4 flex items-center gap-2`}>
            ✨ Chispa de Ignición
          </h3>
          <div className={`spark-box ${getPhaseBorderColor()}`}>
            <p className="text-muted-foreground leading-relaxed">
              {day.spark}
            </p>
          </div>
        </section>

        {/* Divider */}
        <hr className="border-border my-8" />

        {/* Exercise section */}
        <section className="mb-10">
          <h3 className={`text-xl font-bold ${getPhaseColor()} mb-4`}>
            {day.exercise.title}
          </h3>

          {/* Instructions */}
          <div className="mb-6">
            <ul className="space-y-2">
              {day.exercise.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-3 text-foreground">
                  <span className={`${getPhaseColor()} font-bold`}>{index + 1}.</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Input fields */}
          <div className="space-y-4">
            {day.exercise.fields.map((field, index) => {
              const fieldId = `day-${day.day}-field-${index}`;
              return (
                <div key={index} className="exercise-box">
                  <label className="block text-foreground font-medium mb-2">
                    {field.label}
                  </label>
                  <textarea
                    className="input-field"
                    placeholder={field.placeholder}
                    rows={field.multiline ? 4 : 2}
                    value={answers[fieldId] || ''}
                    onChange={(e) => onAnswerChange(fieldId, e.target.value)}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-border">
          <button
            onClick={onPrevious}
            disabled={isFirst}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              isFirst
                ? 'text-muted-foreground cursor-not-allowed'
                : 'text-foreground hover:bg-secondary'
            }`}
          >
            <span>←</span>
            <span>Anterior</span>
          </button>

          <span className="text-muted-foreground text-sm">
            Día {day.day} de 30
          </span>

          <button
            onClick={onNext}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              isLast
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-primary text-primary-foreground hover:opacity-90'
            }`}
          >
            <span>{isLast ? 'Finalizar' : 'Siguiente'}</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayPage;
