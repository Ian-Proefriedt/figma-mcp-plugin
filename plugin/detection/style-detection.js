export function getRawFill(node) {
  const fills = node?.fills || [];
  const primaryFill = fills.find(f => f.type === 'SOLID' || f.type?.endsWith('_GRADIENT'));
  if (!primaryFill) return null;

  return {
    type: primaryFill.type || null,
    color: primaryFill.color || null,
    opacity: typeof primaryFill.opacity === 'number' ? primaryFill.opacity : 1,
    visible: typeof primaryFill.visible === 'boolean' ? primaryFill.visible : true,
    styleId: node.fillStyleId || null,
    boundVariables: primaryFill.boundVariables || null
  };
}

export function getRawImage(node) {
  const fills = node?.fills || [];
  const imageFill = fills.find(f => f.type === 'IMAGE');
  if (!imageFill) return null;

  return {
    type: 'IMAGE',
    imageRef: imageFill.imageHash || null,
    scaleMode: imageFill.scaleMode || null,
    opacity: typeof imageFill.opacity === 'number' ? imageFill.opacity : 1,
    visible: typeof imageFill.visible === 'boolean' ? imageFill.visible : true,
    styleId: node.fillStyleId || null,
    boundVariables: imageFill.boundVariables || null
  };
}

export function getRawStroke(node) {
  const strokes = Array.isArray(node.strokes) ? node.strokes : [];
  const stroke = strokes[0];
  if (!stroke) return null;

  return {
    type: stroke.type || null,
    color: stroke.color || null,
    opacity: typeof stroke.opacity === 'number' ? stroke.opacity : 1,
    weight: typeof node.strokeWeight === 'number' ? node.strokeWeight : null,
    align: node.strokeAlign || null,
    styleId: node.strokeStyleId || null,
    boundVariables: stroke.boundVariables || null
  };
}

export function getCornerRadius(node) {
  return typeof node.cornerRadius === 'number' ? node.cornerRadius : null;
}

export function getRawBlendMode(node) {
  return node?.blendMode || null;
}

export function getRawShadow(node) {
  const effects = node?.effects || [];
  const dropShadow = effects.find(e => e.type === 'DROP_SHADOW');

  if (!dropShadow) return null;

  return {
    color: dropShadow.color || null,
    offset: dropShadow.offset || null,
    radius: dropShadow.radius || null,
    spread: dropShadow.spread || null,
    visible: typeof dropShadow.visible === 'boolean' ? dropShadow.visible : true,
    blendMode: dropShadow.blendMode || null
  };
}