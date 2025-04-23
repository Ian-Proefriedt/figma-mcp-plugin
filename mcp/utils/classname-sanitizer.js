function sanitizeClassName(name) {
  if (typeof name !== 'string') return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-_]/g, '');
}