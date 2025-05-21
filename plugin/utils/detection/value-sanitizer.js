let sanitizeWarnings = [];

export function sanitizeDeep(obj, path = '', log = true) {
  if (obj === null || obj === undefined) return null;

  const t = typeof obj;

  if (t === 'string' || t === 'number' || t === 'boolean') return obj;

  if (t === 'symbol' || t === 'function') {
    if (log) sanitizeWarnings.push(`Stripped unsafe ${t} at ${path}`);
    return null;
  }

  if (Array.isArray(obj)) {
    return obj.map((item, i) => sanitizeDeep(item, `${path}[${i}]`, log));
  }

  if (t === 'object') {
    if (typeof obj.remove === 'function' && typeof obj.type === 'string') {
      if (log) sanitizeWarnings.push(`Stripped raw Figma node at ${path}`);
      return null;
    }

    const result = {};
    for (const key in obj) {
      result[key] = sanitizeDeep(obj[key], `${path}.${key}`, log);
    }
    return result;
  }

  if (log) sanitizeWarnings.push(`Stripped unknown unsafe value at ${path}`);
  return null;
}

export function getSanitizeWarnings() {
  return [...sanitizeWarnings]; // safe copy
}

export function clearSanitizeWarnings() {
  sanitizeWarnings = [];
}
