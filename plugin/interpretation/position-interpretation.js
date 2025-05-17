export function interpretConstraint(value, axis) {
  if (!value || typeof value !== 'string') return null;

  // Axis-specific mappings
  if (value === 'MIN') return axis === 'horizontal' ? 'left' : 'top';
  if (value === 'MAX') return axis === 'horizontal' ? 'right' : 'bottom';

  // Shared values across both axes
  const allowed = ['CENTER', 'STRETCH', 'SCALE'];
  if (allowed.includes(value)) return value.toLowerCase();

  // Fallback: unknown or unsupported
  return null;
}