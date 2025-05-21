import { processComponentBlock } from '../processing/component-processing.js';
import { processLayoutUI } from '../processing/layout-processing.js';
import { processPositionUI } from '../processing/position-processing.js';
import { processStyleUI } from '../processing/style-processing.js';
import { processTextUI } from '../processing/text-processing.js';

import { sanitizeClassName } from '../utils/classname-sanitizer.js';
import { getHtmlTagFromType } from '../utils/html-tag-interpreter.js';
import { getRawImage } from '../detection/style-detection.js'; // ✅ Use this instead

import { mergeWithFallback } from '../utils/inheritance-resolver.js';
import { normalizeCssKeys } from '../utils/key-normalizer.js';
import { sanitizeDeep } from '../utils/value-sanitizer.js';
import { stripNullsDeepExcept } from '../utils/null-omitter.js';

export function processNodeProperties(node) {
  if (!node) return null;

  const className = sanitizeClassName(node.name);
  const isComponent = node.type === 'COMPONENT';
  const isInstance = node.type === 'INSTANCE';

  let inheritedLayout = null;
  let inheritedStyle = null;
  let inheritedText = null;

  if (isInstance && node.mainComponent) {
    const comp = node.mainComponent;
    inheritedLayout = processLayoutUI(comp);
    inheritedStyle = processStyleUI(comp);
    inheritedText = comp.type === 'TEXT' ? processTextUI(comp) : null;
  }

  const layout = normalizeCssKeys(
    mergeWithFallback(processLayoutUI(node), inheritedLayout)
  );
  const style = normalizeCssKeys(
    mergeWithFallback(processStyleUI(node), inheritedStyle)
  );
  const position = normalizeCssKeys(
    processPositionUI(node)
  );

  const isImage = !!getRawImage(node);

  if (!isImage && style) {
  delete style.image;
  delete style.imageScaleMode;
  }

  const text = node.type === 'TEXT'
    ? mergeWithFallback(processTextUI(node), inheritedText)
    : null;

  const component = processComponentBlock(node);

  const result = {
    type: isImage ? 'IMAGE' : node.type,
    name: node.name,
    id: node.id,
    tag: getHtmlTagFromType(node.type, node),
    className,
    position,
    layout,
    style,
    text,
    component
  };

  const sanitized = sanitizeDeep(result);
  return stripNullsDeepExcept(sanitized, ['text', 'layout']);
}
