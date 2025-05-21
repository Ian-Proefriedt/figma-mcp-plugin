export function stripNullsDeepExcept(obj, topLevelPreserve = []) {
    function walk(value, path = '') {
      if (Array.isArray(value)) {
        return value
          .map((item, i) => walk(item, `${path}[${i}]`))
          .filter(item => item !== null);
      }
  
      if (typeof value === 'object' && value !== null) {
        const result = {};
        for (const key in value) {
          const cleaned = walk(value[key], `${path}.${key}`);
          if (cleaned !== null) {
            result[key] = cleaned;
          }
        }
  
        return Object.keys(result).length > 0 ? result : null;
      }
  
      return value === null ? null : value;
    }
  
    const result = {};
    for (const key in obj) {
      const val = obj[key];
  
      if (val === null && topLevelPreserve.includes(key)) {
        result[key] = null;
      } else {
        const cleaned = walk(val, key);
        if (cleaned !== null) {
          result[key] = cleaned;
        }
      }
    }
  
    return result;
  }
  