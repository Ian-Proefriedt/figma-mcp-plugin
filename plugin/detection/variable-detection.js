// plugin/detection/variable-detection.js

export function detectAllVariables() {
    const collections = figma.variables.getLocalVariableCollections();
    const variables = figma.variables.getLocalVariables();
  
    const collectionMap = new Map();
    const variableMap = new Map();
    const modeNameMap = new Map();

    for (const collection of collections) {
      collectionMap.set(collection.id, {
        id: collection.id,
        name: collection.name,
        modes: collection.modes
      });

      for (const mode of collection.modes) {
        modeNameMap.set(mode.modeId, mode.name);
      }
    }
  
    // Collect all variables and their metadata
    for (const variable of variables) {
      const collection = collectionMap.get(variable.variableCollectionId);
      const hasModes = (collection?.modes?.length || 0) > 1;

        //console.log(`🧪 DETECTED VARIABLE: ${variable.name} [${variable.id}]`);
        //console.log('   referencesByMode:', variable.referencesByMode);
        //console.log('   valuesByMode:', variable.valuesByMode);
  
      const valuesByMode = {};
      const referencesByMode = {};
  
      for (const modeKey in variable.valuesByMode) {
        const val = variable.valuesByMode[modeKey];
        valuesByMode[modeKey] = val;
      
        if (val?.type === 'VARIABLE_ALIAS') {
          referencesByMode[modeKey] = val.id;
        }
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
      variables: variableMap,
      modeNames: modeNameMap
    };
  }