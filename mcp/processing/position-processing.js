function processPositionUI(node) {
  const pos = getPosition(node);
  const size = getSize(node);
  const sizing = getSizingModes(node);
  return {
    x: pos.x,
    y: pos.y,
    width: size.width,
    widthMode: sizing.widthMode,
    height: size.height,
    heightMode: sizing.heightMode,
    rotation: getRotation(node),
    constraints: getConstraints(node),
    positioning: getPositioning(node),
    clipping: getClipping(node),
    zIndex: getZIndex(node)
  };
}