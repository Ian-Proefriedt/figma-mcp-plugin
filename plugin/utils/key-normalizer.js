export function normalizeCssKeys(obj) {
    return Object.fromEntries(
      Object.entries(obj || {})
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key, value]) => {
          const kebabKey = key.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
          return [kebabKey, value];
        })
    );
  }