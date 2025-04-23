function processStyleUI(node) {
  const { fill, image } = getFillAndImage(node);
  const stroke = getStroke(node);
  const fillStyleName = getStyleNameById(fill && fill.styleId, 'fill');
  const strokeStyleName = getStyleNameById(stroke && stroke.styleId, 'stroke');

  return {
    fillStyleName: fillStyleName || null,
    fill: (fill && fill.color) || null,
    opacity: (fill && fill.opacity) || 1,
    image: image || null,
    imageScaleMode: (image && image.scaleMode) || null,
    stroke: (stroke && stroke.color) || null,
    strokeWidth: (stroke && stroke.weight) || null,
    strokeOpacity: (stroke && stroke.opacity) || 1,
    strokeStyleName: strokeStyleName || null,
    radius: getCornerRadius(node),
    blendMode: getBlendMode(node),
    shadow: getShadowPresence(node)
  };
}