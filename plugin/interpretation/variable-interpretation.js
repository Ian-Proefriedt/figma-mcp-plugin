function parseValue(value) {
    if (!value) return null;
  
    if (value.type === 'COLOR') {
      const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
      const { r, g, b, a } = value;
      const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      return a < 1 ? `${hex} @ ${Math.round(a * 100)}%` : hex;
    }
  
    if (typeof value === 'number') return value;
  
    return value.type === 'VARIABLE_ALIAS' ? null : value;
  }
  
  export function interpretVariableReferenceChain(variableId, mode) {
    const visited = new Set();
    const path = [];
    let currentId = variableId;
    let currentMode = mode;
  
    while (true) {
      if (visited.has(currentId)) {
        path.push({
          id: currentId,
          error: `Circular reference detected at ${currentId}`
        });
        break;
      }
  
      visited.add(currentId);
  
      const variable = figma.variables.getVariableById(currentId);
      if (!variable) {
        path.push({
          id: currentId,
          error: `Variable not found`
        });
        break;
      }
  
      const collection = figma.variables.getVariableCollectionById(variable.variableCollectionId);
  
      console.log(`\n--- 🔍 Step ${path.length + 1}: Evaluating variable ${variable.name} [${variable.id}] ---`);
      console.log(`📦 Collection: ${collection?.name}`);
      console.log(`🎯 Mode requested: ${currentMode}`);
      console.log(`📘 valuesByMode keys:`, Object.keys(variable.valuesByMode || {}));
      console.log(`🧪 Raw value for mode:`, variable.valuesByMode?.[currentMode]);
      console.log(`🧪 Raw value for "default":`, variable.valuesByMode?.["default"]);
  
      // Safe value resolution
      let val = undefined;
      if (variable.valuesByMode?.[currentMode] !== undefined) {
        val = variable.valuesByMode[currentMode];
      } else if (variable.valuesByMode?.["default"] !== undefined) {
        val = variable.valuesByMode["default"];
      }
  
      console.log(`✅ Value selected:`, val);
  
      const referenceId = val?.type === 'VARIABLE_ALIAS' ? val.id : null;
      const parsed = parseValue(val);
  
      console.log(`🔗 Reference ID: ${referenceId ?? "—"}`);
      console.log(`🎨 Parsed value:`, parsed);
  
      path.push({
        id: variable.id,
        name: variable.name,
        type: variable.resolvedType,
        collection: collection?.name || 'Unknown',
        mode: currentMode,
        reference: referenceId,
        value: val,
        parsedValue: parsed
      });
  
      if (!referenceId) {
        console.log(`\n✅ Final resolved path:`);
        path.forEach((step, i) => {
          console.log(`   ${i + 1}. ${step.name} (${step.collection}) → ${step.reference ?? "value"}`);
        });
        console.log(`\n🎯 Final resolved value:`, parsed);
        break;
      }
  
      currentId = referenceId;
      currentMode = (collection?.modes?.length ?? 0) > 1 ? currentMode : "default";
    }
  
    const resolved = path[path.length - 1];
    return {
      path,
      finalValue: resolved?.parsedValue ?? null,
      resolved
    };
  }
  