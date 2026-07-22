import { useMemo } from 'react';

export interface CountryConfig {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  taxRate: number;
}

export const countries: CountryConfig[] = [
  { code: 'ES', name: 'España', currency: 'EUR', currencySymbol: '€', locale: 'es-ES', taxRate: 0.25 },
  { code: 'MX', name: 'México', currency: 'MXN', currencySymbol: '$', locale: 'es-MX', taxRate: 0.30 },
  { code: 'AR', name: 'Argentina', currency: 'ARS', currencySymbol: '$', locale: 'es-AR', taxRate: 0.35 },
  { code: 'CO', name: 'Colombia', currency: 'COP', currencySymbol: '$', locale: 'es-CO', taxRate: 0.35 },
  { code: 'CL', name: 'Chile', currency: 'CLP', currencySymbol: '$', locale: 'es-CL', taxRate: 0.27 },
  { code: 'PE', name: 'Perú', currency: 'PEN', currencySymbol: 'S/', locale: 'es-PE', taxRate: 0.295 },
  { code: 'EC', name: 'Ecuador', currency: 'USD', currencySymbol: '$', locale: 'es-EC', taxRate: 0.25 },
  { code: 'UY', name: 'Uruguay', currency: 'UYU', currencySymbol: '$', locale: 'es-UY', taxRate: 0.25 },
  { code: 'VE', name: 'Venezuela', currency: 'USD', currencySymbol: '$', locale: 'es-VE', taxRate: 0.34 },
  { code: 'CR', name: 'Costa Rica', currency: 'CRC', currencySymbol: '₡', locale: 'es-CR', taxRate: 0.30 },
  { code: 'PA', name: 'Panamá', currency: 'USD', currencySymbol: '$', locale: 'es-PA', taxRate: 0.25 },
  { code: 'GT', name: 'Guatemala', currency: 'GTQ', currencySymbol: 'Q', locale: 'es-GT', taxRate: 0.25 },
  { code: 'DO', name: 'República Dominicana', currency: 'DOP', currencySymbol: 'RD$', locale: 'es-DO', taxRate: 0.27 },
];

export interface FinancialConfig {
  countryCode: string;
  inversionInicial: number;
  capitalPropio: number;
  prestamo: number;
  interesPrestamo: number;
  anosPrestamo: number;
  unidadesVendidas: number;
  precioMedio: number;
  costeMedio: number;
  crecimientoAnual: number;
  gastosFijos: number;
  marketingLogistica: number;
  stockPct: number;
  diasPagoProveedores: number;
  diasCobroClientes: number;
}

export interface YearlyData {
  year: string;
  ventas: number;
  costeVentas: number;
  margenBruto: number;
  gastosFijos: number;
  ebitda: number;
  amortizacion: number;
  intereses: number;
  bai: number;
  impuestos: number;
  beneficioNeto: number;
  flujoCajaOperativo: number;
  cajaAcumulada: number;
}

export interface FinancialResults {
  data: YearlyData[];
  kpis: {
    beneficioNetoY1: number;
    cajaY1: number;
    roeY1: number;
    breakEven: number;
  };
  riskLevel: 'success' | 'warning' | 'danger';
  riskMessage: string;
  stockCongelado: number;
  country: CountryConfig;
}

export const useFinancialCalculations = (config: FinancialConfig): FinancialResults => {
  return useMemo(() => {
    const country = countries.find(c => c.code === config.countryCode) || countries[0];
    const years = ["Año 1", "Año 2", "Año 3", "Año 4", "Año 5"];
    const data: YearlyData[] = [];

    const cajaInicial = config.capitalPropio + config.prestamo - config.inversionInicial;
    let saldoCaja = cajaInicial;
    const amortizacionAnual = config.inversionInicial / 4;
    let deudaViva = config.prestamo;
    const amortPrestamo = config.prestamo > 0 ? config.prestamo / config.anosPrestamo : 0;
    let ventasAnterior = 0;

    for (let i = 0; i < 5; i++) {
      const factorCrecimiento = Math.pow(1 + config.crecimientoAnual, i);
      const ventas = config.unidadesVendidas * factorCrecimiento * config.precioMedio * Math.pow(1.02, i);
      const costes = config.unidadesVendidas * factorCrecimiento * config.costeMedio * Math.pow(1.03, i);
      const margen = ventas - costes;

      let gastosEstructura = config.gastosFijos * Math.pow(1.03, i) + config.marketingLogistica;
      if (i >= 2) gastosEstructura += 18000;

      const ebitda = margen - gastosEstructura;
      const intereses = deudaViva * config.interesPrestamo;
      const bai = ebitda - amortizacionAnual - intereses;
      const impuestos = bai > 0 ? bai * country.taxRate : 0;
      const neto = bai - impuestos;

      const stockNecesario = ventas * config.stockPct;
      const cuentasCobrar = (ventas / 365) * config.diasCobroClientes;
      const cuentasPagar = (costes / 365) * config.diasPagoProveedores;

      let variacionNof: number;
      if (i === 0) variacionNof = stockNecesario + cuentasCobrar - cuentasPagar;
      else variacionNof = stockNecesario - (ventasAnterior * config.stockPct);

      const cashFlow = neto + amortizacionAnual - variacionNof - amortPrestamo;

      deudaViva -= amortPrestamo;
      saldoCaja += cashFlow;
      ventasAnterior = ventas;

      data.push({
        year: years[i], ventas, costeVentas: costes, margenBruto: margen,
        gastosFijos: gastosEstructura, ebitda, amortizacion: amortizacionAnual,
        intereses, bai, impuestos, beneficioNeto: neto,
        flujoCajaOperativo: cashFlow, cajaAcumulada: saldoCaja,
      });
    }

    const beneficioNetoY1 = data[0].beneficioNeto;
    const cajaY1 = data[0].cajaAcumulada;
    const roeY1 = config.capitalPropio > 0 ? (beneficioNetoY1 / config.capitalPropio) * 100 : 0;
    const breakEven = (config.precioMedio - config.costeMedio) > 0
      ? (data[0].gastosFijos + data[0].amortizacion) / ((config.precioMedio - config.costeMedio) / config.precioMedio)
      : 0;

    const minCaja = Math.min(...data.map(d => d.cajaAcumulada));
    let riskLevel: 'success' | 'warning' | 'danger';
    let riskMessage: string;

    if (minCaja < 0) {
      riskLevel = 'danger';
      riskMessage = `¡PELIGRO! Tu caja entra en negativo (${minCaja.toLocaleString(country.locale, { maximumFractionDigits: 0 })}${country.currencySymbol}). Necesitas más financiación inicial o pagar más tarde a proveedores.`;
    } else if (cajaY1 < 5000) {
      riskLevel = 'warning';
      riskMessage = 'Precaución: Terminas el Año 1 con poca liquidez. Cualquier imprevisto podría romper la cadena.';
    } else {
      riskLevel = 'success';
      riskMessage = 'Salud Financiera Robusta. Tienes liquidez suficiente para financiar el crecimiento.';
    }

    const stockCongelado = data[0].ventas * config.stockPct;

    return {
      data,
      kpis: { beneficioNetoY1, cajaY1, roeY1, breakEven },
      riskLevel, riskMessage, stockCongelado, country,
    };
  }, [config]);
};

export const businessPresets: Record<string, Partial<FinancialConfig>> = {
  custom: {
    inversionInicial: 5000, prestamo: 5000, capitalPropio: 5000,
    unidadesVendidas: 1000, precioMedio: 50, costeMedio: 20,
    stockPct: 0.10, diasPagoProveedores: 30, diasCobroClientes: 5,
    gastosFijos: 10000, marketingLogistica: 5000,
  },
  infoproducto: {
    inversionInicial: 3900, prestamo: 0, capitalPropio: 5000,
    unidadesVendidas: 655, precioMedio: 25, costeMedio: 8,
    stockPct: 0, diasPagoProveedores: 2, diasCobroClientes: 2,
    gastosFijos: 5720, marketingLogistica: 0,
  },
  fisico: {
    inversionInicial: 8300, prestamo: 12000, capitalPropio: 10000,
    unidadesVendidas: 1450, precioMedio: 51, costeMedio: 18,
    stockPct: 0.15, diasPagoProveedores: 60, diasCobroClientes: 5,
    gastosFijos: 4600, marketingLogistica: 22500,
  },
};

export const defaultConfig: FinancialConfig = {
  ...(businessPresets.custom as FinancialConfig),
  countryCode: 'ES',
  interesPrestamo: 0.07,
  crecimientoAnual: 0.20,
  anosPrestamo: 5,
};
