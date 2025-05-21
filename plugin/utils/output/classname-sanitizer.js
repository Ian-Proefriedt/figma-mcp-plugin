export function sanitizeClassName(name) {
  if (typeof name !== 'string') return '';
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-_]/g, '');
}
