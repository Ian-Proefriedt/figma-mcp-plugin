export function mergeWithFallback(instanceVals, fallbackVals) {
    if (!fallbackVals) return instanceVals;
    if (!instanceVals) return fallbackVals;
  
    const result = { ...fallbackVals };
    for (const key in instanceVals) {
      if (instanceVals[key] !== undefined) {
        result[key] = instanceVals[key];
      }
    }
    return result;
  }
  
  export function getInstanceMeta(instanceNode) {
    try {
      const comp = instanceNode.mainComponent;
      if (!comp) return null;
  
      const meta = {
        id: comp.id || null,
        key: comp.key || null,
        name: comp.name || null,
      };
  
      if ('componentPropertyReferences' in instanceNode && instanceNode.variantProperties) {
        meta.variantProps = { ...instanceNode.variantProperties };
      }
  
      if ('componentSetId' in comp) {
        meta.componentSetId = comp.componentSetId || null;
      }
  
      return meta;
    } catch (err) {
      console.warn(`⚠️ Failed to extract instance metadata for ${instanceNode.name}`);
      return null;
    }
  }
  