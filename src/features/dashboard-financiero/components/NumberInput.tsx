import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NumberInputProps {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  decimals?: number;
  min?: number;
  max?: number;
  className?: string;
  placeholder?: string;
}

const formatValue = (value: number, decimals: number): string => {
  if (isNaN(value)) return '';
  return value.toLocaleString('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

const parseValue = (str: string): number => {
  if (!str) return 0;
  let s = str.replace(/\s/g, '');
  if (s.includes('.') && s.includes(',')) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (s.includes(',')) {
    s = s.replace(',', '.');
  } else {
    const parts = s.split('.');
    if (parts.length > 2) s = s.replace(/\./g, '');
    else if (parts.length === 2 && parts[1].length === 3 && parts[0].length > 0) s = s.replace('.', '');
  }
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
};

export const NumberInput = ({ id, value, onChange, decimals = 2, min, max, className, placeholder }: NumberInputProps) => {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState<string>(formatValue(value, decimals));

  useEffect(() => {
    if (!focused) setDraft(formatValue(value, decimals));
  }, [value, decimals, focused]);

  return (
    <Input
      id={id}
      type="text"
      inputMode="decimal"
      value={draft}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onChange={(e) => {
        const cleaned = e.target.value.replace(/[^\d.,-]/g, '');
        setDraft(cleaned);
        let n = parseValue(cleaned);
        if (typeof min === 'number' && n < min) n = min;
        if (typeof max === 'number' && n > max) n = max;
        onChange(n);
      }}
      onBlur={() => {
        setFocused(false);
        setDraft(formatValue(value, decimals));
      }}
      className={cn(className)}
    />
  );
};
