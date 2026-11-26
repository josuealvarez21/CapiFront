/** Política de contraseñas compartida por registro y recuperación. */

export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;

export function validatePassword(value: string): string | undefined {
  if (!value) return 'La contraseña es obligatoria';
  if (/\s/.test(value))
    return 'La contraseña no puede contener espacios ni saltos de línea';
  if (value.length < PASSWORD_MIN_LENGTH)
    return `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`;
  if (value.length > PASSWORD_MAX_LENGTH)
    return `La contraseña no puede superar los ${PASSWORD_MAX_LENGTH} caracteres`;
  return undefined;
}

/** El login no aplica la política nueva para no dejar fuera cuentas antiguas. */
export function validatePasswordForLogin(value: string): string | undefined {
  if (!value) return 'La contraseña es obligatoria';
  if (/\s/.test(value))
    return 'La contraseña no puede contener espacios ni saltos de línea';
  return undefined;
}

export function validateConfirmPassword(
  value: string,
  password: string,
): string | undefined {
  const error = validatePassword(value);
  if (error) return error;
  if (password !== value) return 'Las contraseñas no coinciden';
  return undefined;
}
