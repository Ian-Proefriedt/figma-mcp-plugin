import { processLayoutUI } from '../processing/layout-processing.js';
import { processPositionUI } from '../processing/position-processing.js';
import { processStyleUI } from '../processing/style-processing.js';
import { processTextUI } from '../processing/text-processing.js';

import { sanitizeClassName } from '../utils/classname-sanitizer.js';
import { getHtmlTagFromType } from '../utils/html-tag-interpreter.js';
import { isImageNode } from '../detection/style-detection.js';

import { mergeWithFallback, getInstanceMeta } from '../utils/inheritance-resolver.js';
import { sanitizeDeep } from '../utils/value-sanitizer.js';
import { stripNullsDeepExcept } from '../utils/null-omitter.js';

export function processNodeProperties(node, overrides = {}) {
  if (!node) return null;

  const className = sanitizeClassName(node.name);
  const isComponent = node.type === 'COMPONENT';
  const isInstance = node.type === 'INSTANCE';

  let instanceOf = null;
  let inheritedLayout = null;
  let inheritedStyle = null;
  let inheritedText = null;
  let instanceMeta = null;

  if (isInstance) {
    try {
      const comp = node.mainComponent;
      if (comp) {
        instanceOf = comp.name || null;
        inheritedLayout = processLayoutUI(comp);
        inheritedStyle = processStyleUI(comp);
        inheritedText = comp.type === 'TEXT' ? processTextUI(comp) : null;
        instanceMeta = getInstanceMeta(node);
      }
    } catch {
      instanceOf = '⚠️ unresolved';
    }
  }

  const layout = mergeWithFallback(processLayoutUI(node), inheritedLayout);
  const style = mergeWithFallback(processStyleUI(node), inheritedStyle);

  // ✅ Strip image-specific style values for non-image nodes
  if (!isImageNode(node) && style) {
    delete style.image;
    delete style.imageScaleMode;
  }

  let text = null;
  let textPropertyReference = null;

  if (node.type === 'TEXT') {
    text = mergeWithFallback(processTextUI(node), inheritedText);

    if (
      'componentPropertyReferences' in node &&
      node.componentPropertyReferences &&
      typeof node.componentPropertyReferences.characters === 'string'
  ) {
      textPropertyReference = node.componentPropertyReferences.characters;
    }
  }

  const result = {
    id: node.id,
    name: node.name,
    tag: getHtmlTagFromType(node.type, node),
    className: className,
    type: isImageNode(node) ? 'IMAGE' : node.type,
    position: {
      ...processPositionUI(node),
      ...(overrides.position || {})
    },
    layout,
    text,
    textPropertyReference,
    style,
    isMainComponent: isComponent,
    componentName: isComponent ? node.name : null,
    isInstance: isInstance,
    instanceOf: instanceOf,
    instanceMeta: instanceMeta
  };

  const sanitized = sanitizeDeep(result);
  return stripNullsDeepExcept(sanitized, ['text', 'layout']);


}
