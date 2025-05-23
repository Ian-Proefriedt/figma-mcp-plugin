import { detectAllVariables } from '../detection/variable-detection.js';
import { interpretVariableReferenceChain } from '../interpretation/variable-interpretation.js';

export function processTokens() {
  const { variables, modeNames } = detectAllVariables();
  const tokenMap = {};

  for (const variable of variables.values()) {
    const tokenName = variable.name;

    let modeKeys = Object.keys(variable.referencesByMode || variable.valuesByMode || {});
    if (modeKeys.length === 0) modeKeys = ['default'];

    for (const mode of modeKeys) {
      const { path, finalValue, resolved } = interpretVariableReferenceChain(variable.id, mode);
      if (!path || path.length === 0 || resolved == null) continue;

      const modeLabel = modeNames.get(mode) || mode;
      const directRef = path.length > 1 ? path[1]?.name : null;

      if (!tokenMap[tokenName]) tokenMap[tokenName] = {};

      tokenMap[tokenName][modeLabel] = {
        reference: directRef,
        resolved: {
          reference: resolved.name || null,
          value: resolved.value || null
        }
      };
    }
  }

  return tokenMap;
}
