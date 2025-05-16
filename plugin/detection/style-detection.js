// detection/style-detection.js

export function isImageNode(node) {
  return node?.type === 'RECTANGLE' &&
    node.fills?.some(f => f.type === 'IMAGE');
}

export function getRawFillAndImage(node) {
  const fills = node?.fills || [];
  let image = null;
  let fill = null;

  for (const f of fills) {
    if (!image && f.type === 'IMAGE') {
      image = {
        type: f.type,
        imageRef: f.imageHash || null,
        scaleMode: typeof f.scaleMode === 'string' ? f.scaleMode.toLowerCase() : null,
        styleId: node.fillStyleId || null
      };
    } else if (!fill && (f.type === 'SOLID' || f?.type?.endsWith('_GRADIENT'))) {
      fill = {
        rawType: f.type,
        rawColor: f.color || null,
        opacity: f.opacity || null,
        styleId: node.fillStyleId || null
      };
    }
  }

  return { fill, image };
}

export function getRawStroke(node) {
  const stroke = node?.strokes?.[0] || null;
  return {
    rawColor: stroke?.color || null,
    opacity: stroke?.opacity || null,
    weight: node?.strokeWeight || null,
    styleId: node?.strokeStyleId || null
  };
}

export function getCornerRadius(node) {
  return node?.cornerRadius || null;
}

export function getRawBlendMode(node) {
  return node?.blendMode || null;
}

export function getShadowPresence(node) {
  const effects = node?.effects || [];
  return effects.some(effect => effect.type === 'DROP_SHADOW') ? true : null;
}
