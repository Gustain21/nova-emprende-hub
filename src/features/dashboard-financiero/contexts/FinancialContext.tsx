import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'EUR', symbol: '€', name: 'Euro (España)' },
  { code: 'MXN', symbol: '$', name: 'Peso Mexicano (México)' },
  { code: 'ARS', symbol: '$', name: 'Peso Argentino (Argentina)' },
  { code: 'COP', symbol: '$', name: 'Peso Colombiano (Colombia)' },
  { code: 'CLP', symbol: '$', name: 'Peso Chileno (Chile)' },
  { code: 'PEN', symbol: 'S/', name: 'Sol (Perú)' },
  { code: 'UYU', symbol: '$', name: 'Peso Uruguayo (Uruguay)' },
  { code: 'USD', symbol: '$', name: 'Dólar (EE.UU./Ecuador/El Salvador)' },
  { code: 'VES', symbol: 'Bs', name: 'Bolívar (Venezuela)' },
  { code: 'DOP', symbol: 'RD$', name: 'Peso Dominicano (Rep. Dominicana)' },
  { code: 'CRC', symbol: '₡', name: 'Colón (Costa Rica)' },
  { code: 'GTQ', symbol: 'Q', name: 'Quetzal (Guatemala)' },
  { code: 'HNL', symbol: 'L', name: 'Lempira (Honduras)' },
  { code: 'NIO', symbol: 'C$', name: 'Córdoba (Nicaragua)' },
  { code: 'PAB', symbol: 'B/.', name: 'Balboa (Panamá)' },
  { code: 'PYG', symbol: '₲', name: 'Guaraní (Paraguay)' },
  { code: 'BOB', symbol: 'Bs', name: 'Boliviano (Bolivia)' },
  { code: 'CUP', symbol: '$', name: 'Peso Cubano (Cuba)' },
];

export interface Assumptions {
  projectName: string;
  currencyCode: string;
  timeHorizonMonths: number;
  startMonth: string;
  businessType: string;
  initialInvestment: number;
  ownCapital: number;
  loanAmount: number;
  interestRate: number;
  loanTermYears: number;
  amortizationType: string;
  unitsSoldYear1: number;
  averagePrice: number;
  directCost: number;
  annualGrowthRate: number;
  fixedCostsAnnual: number;
  marketingLogistics: number;
  stockPercentage: number;
  paymentDays: number;
  collectionDays: number;
  basePrice: number;
  taxRate: number;
  expectedGrowthRate: number;
  variableCostPerUnit: number;
  profitTaxRate: number;
  initialDebt: number;
}

export interface SalesRow {
  month: number;
  description: string;
  units: number;
  unitPrice: number;
}

export interface FixedCostRow {
  id: string;
  category: string;
  description: string;
  monthlyAmount: number;
  startMonth: number;
  endMonth: number | null;
}

export interface InvestmentRow {
  id: string;
  concept: string;
  category: string;
  amount: number;
  month: number;
  usefulLifeYears: number;
}

export interface Financing {
  ownCapital: number;
  loanAmount: number;
  interestRate: number;
  loanTermMonths: number;
}

export type SaveStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

interface FinancialContextType {
  assumptions: Assumptions;
  updateAssumptions: (n: Partial<Assumptions>) => void;
  salesForecast: SalesRow[];
  updateSalesForecast: (n: SalesRow[]) => void;
  fixedCosts: FixedCostRow[];
  updateFixedCosts: (n: FixedCostRow[]) => void;
  investments: InvestmentRow[];
  updateInvestments: (n: InvestmentRow[]) => void;
  financing: Financing;
  updateFinancing: (n: Partial<Financing>) => void;
  status: SaveStatus;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

const defaultAssumptions: Assumptions = {
  projectName: 'Mi Curso Online',
  currencyCode: 'EUR',
  timeHorizonMonths: 24,
  startMonth: 'Enero 2026',
  businessType: 'Curso online para emprendedores',
  initialInvestment: 6000,
  ownCapital: 8000,
  loanAmount: 3000,
  interestRate: 6,
  loanTermYears: 3,
  amortizationType: 'Francés',
  unitsSoldYear1: 120,
  averagePrice: 97,
  directCost: 10,
  annualGrowthRate: 10,
  fixedCostsAnnual: 2880,
  marketingLogistics: 1800,
  stockPercentage: 0,
  paymentDays: 30,
  collectionDays: 0,
  basePrice: 97,
  taxRate: 21,
  expectedGrowthRate: 10,
  variableCostPerUnit: 10,
  profitTaxRate: 25,
  initialDebt: 3000,
};

const generateDefaultSalesForecast = (): SalesRow[] => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const forecast: SalesRow[] = [];
  let units = 10;
  for (let i = 1; i <= 24; i++) {
    forecast.push({
      month: i,
      description: `${months[(i - 1) % 12]} ${2026 + Math.floor((i - 1) / 12)}`,
      units: Math.round(units),
      unitPrice: 97,
    });
    units *= 1.1;
  }
  return forecast;
};

const defaultFixedCosts: FixedCostRow[] = [
  { id: '1', category: 'Software', description: 'Herramientas y software', monthlyAmount: 50, startMonth: 1, endMonth: null },
  { id: '2', category: 'Publicidad', description: 'Publicidad mínima mensual', monthlyAmount: 150, startMonth: 1, endMonth: null },
  { id: '3', category: 'Plataforma', description: 'Plataforma curso/hosting', monthlyAmount: 40, startMonth: 1, endMonth: null },
];

const defaultInvestments: InvestmentRow[] = [
  { id: '1', concept: 'Producción de contenido', category: 'Desarrollo', amount: 2500, month: 1, usefulLifeYears: 3 },
  { id: '2', concept: 'Branding y diseño', category: 'Marketing', amount: 800, month: 1, usefulLifeYears: 3 },
  { id: '3', concept: 'Equipo informático', category: 'Equipo', amount: 1200, month: 1, usefulLifeYears: 4 },
  { id: '4', concept: 'Publicidad de lanzamiento', category: 'Marketing', amount: 1500, month: 1, usefulLifeYears: 1 },
];

const defaultFinancing: Financing = { ownCapital: 8000, loanAmount: 3000, interestRate: 6, loanTermMonths: 36 };

export const FinancialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assumptions, setAssumptions] = useState<Assumptions>(defaultAssumptions);
  const [salesForecast, setSalesForecast] = useState<SalesRow[]>(generateDefaultSalesForecast());
  const [fixedCosts, setFixedCosts] = useState<FixedCostRow[]>(defaultFixedCosts);
  const [investments, setInvestments] = useState<InvestmentRow[]>(defaultInvestments);
  const [financing, setFinancing] = useState<Financing>(defaultFinancing);
  const [status, setStatus] = useState<SaveStatus>('loading');
  const loadedRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  // Load from Supabase
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        if (!cancelled) { setStatus('idle'); loadedRef.current = true; }
        return;
      }
      const { data, error } = await supabase
        .from('dashboard_fin_progress')
        .select('config')
        .eq('user_id', user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) { console.error(error); setStatus('error'); loadedRef.current = true; return; }
      const cfg = (data?.config as any) || null;
      if (cfg && typeof cfg === 'object') {
        if (cfg.assumptions) setAssumptions((p) => ({ ...p, ...cfg.assumptions }));
        if (Array.isArray(cfg.salesForecast)) setSalesForecast(cfg.salesForecast);
        if (Array.isArray(cfg.fixedCosts)) setFixedCosts(cfg.fixedCosts);
        if (Array.isArray(cfg.investments)) setInvestments(cfg.investments);
        if (cfg.financing) setFinancing((p) => ({ ...p, ...cfg.financing }));
      }
      setStatus('idle');
      loadedRef.current = true;
    })();
    return () => { cancelled = true; };
  }, []);

  const persist = useCallback(async (payload: any) => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) { setStatus('error'); return; }
    setStatus('saving');
    const { error } = await supabase
      .from('dashboard_fin_progress')
      .upsert({ user_id: user.id, config: payload }, { onConflict: 'user_id' });
    if (error) { console.error(error); setStatus('error'); return; }
    setStatus('saved');
    window.setTimeout(() => setStatus((s) => (s === 'saved' ? 'idle' : s)), 1200);
  }, []);

  // Debounced autosave
  useEffect(() => {
    if (!loadedRef.current) return;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      persist({ assumptions, salesForecast, fixedCosts, investments, financing });
    }, 700);
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current); };
  }, [assumptions, salesForecast, fixedCosts, investments, financing, persist]);

  return (
    <FinancialContext.Provider
      value={{
        assumptions,
        updateAssumptions: (n) => setAssumptions((p) => ({ ...p, ...n })),
        salesForecast,
        updateSalesForecast: setSalesForecast,
        fixedCosts,
        updateFixedCosts: setFixedCosts,
        investments,
        updateInvestments: setInvestments,
        financing,
        updateFinancing: (n) => setFinancing((p) => ({ ...p, ...n })),
        status,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const ctx = useContext(FinancialContext);
  if (!ctx) throw new Error('useFinancial must be used within FinancialProvider');
  return ctx;
};
