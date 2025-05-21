import { interpretPropName } from '../interpretation/component-interpretation.js';
import {
  getTextPropertyReference,
  getBooleanPropertyReference
} from '../detection/component-detection.js';

import { getInstanceMeta } from '../utils/detection/inheritance-resolver.js';

export function processComponentReferences(node) {
  const props = {};

  const textProp = getTextPropertyReference(node);
  if (textProp) {
    const name = interpretPropName(textProp);
    props[name] = {
      type: 'text',
      value: node.characters
    };
  }

  const booleanProp = getBooleanPropertyReference(node);
  if (booleanProp) {
    const name = interpretPropName(booleanProp);
    props[name] = {
      type: 'boolean',
      value: node.visible
    };
  }

  return Object.keys(props).length > 0 ? { props } : null;
}

export function processComponentBlock(node) {
  const isComponent = node.type === 'COMPONENT';
  const isInstance = node.type === 'INSTANCE';

  const propsBlock = processComponentReferences(node);
  const meta = isInstance ? getInstanceMeta(node) : null;
  const instanceOf = isInstance && node.mainComponent ? node.mainComponent.name : null;

  return {
    type: isComponent ? 'component' : isInstance ? 'instance' : null,
    name: node.name,
    ...(isInstance && { instanceOf }),
    ...(meta && { meta }),
    ...(propsBlock || {})
  };
}
