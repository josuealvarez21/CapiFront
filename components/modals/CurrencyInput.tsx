'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  formatAmountForInput,
  getAmountCaretPosition,
  normalizeAmountInput,
} from '@/lib/utils';

interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type' | 'inputMode'> {
  value: string;
  onChange: (value: string) => void;
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(function CurrencyInput(
  { value, onChange, onFocus, onBlur, placeholder = '0', ...props },
  ref,
) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, []);

  const placeCaret = (nextValue: string) => {
    requestAnimationFrame(() => {
      const input = inputRef.current;
      if (!input) return;
      const position = getAmountCaretPosition(nextValue);
      input.setSelectionRange(position, position);
    });
  };

  return (
    <input
      {...props}
      ref={inputRef}
      type="text"
      inputMode="numeric"
      placeholder={placeholder}
      value={formatAmountForInput(value)}
      onFocus={(event) => {
        placeCaret(value);
        onFocus?.(event);
      }}
      onBlur={onBlur}
      onChange={(event) => {
        const nextValue = normalizeAmountInput(event.target.value);
        onChange(nextValue);
        placeCaret(nextValue);
      }}
    />
  );
});

export default CurrencyInput;
