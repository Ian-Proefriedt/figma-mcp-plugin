// plugin/detection/variable-detection.js

export function detectAllVariables() {
    const collections = figma.variables.getLocalVariableCollections();
    const variables = figma.variables.getLocalVariables();
  
    const collectionMap = new Map();
    const variableMap = new Map();
  
    // Collect all collections
    for (const collection of collections) {
      collectionMap.set(collection.id, {
        id: collection.id,
        name: collection.name,
        modes: collection.modes // array of mode names, or empty if not mode-aware
      });
    }
  
    // Collect all variables and their metadata
    for (const variable of variables) {
      const collection = collectionMap.get(variable.variableCollectionId);
      const hasModes = (collection?.modes?.length || 0) > 1;
  
      const valuesByMode = {};
      const referencesByMode = {};
  
      for (const modeKey in variable.valuesByMode) {
        valuesByMode[modeKey] = variable.valuesByMode[modeKey];
      }
  
      for (const modeKey in variable.referencesByMode) {
        referencesByMode[modeKey] = variable.referencesByMode[modeKey];
      }
  
      variableMap.set(variable.id, {
        id: variable.id,
        name: variable.name,
        collectionId: variable.variableCollectionId,
        collectionName: collection?.name || "Unknown",
        type: variable.resolvedType,
        hasModes,
        valuesByMode,
        referencesByMode
      });
    }
  
    return {
      collections: collectionMap,
      variables: variableMap
    };
  }