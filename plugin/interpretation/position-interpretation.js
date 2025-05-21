export function interpretPositionConstraints(raw) {
  const result = {};

  const {
    x, y,
    width, height,
    parentWidth, parentHeight,
    horizontalConstraint,
    verticalConstraint
  } = raw;

  // ───────────────────────────────
  // Horizontal Constraints
  switch (horizontalConstraint) {
    case 'LEFT':
      result.left = `${x}px`;
      break;
    case 'RIGHT':
      result.right = `${parentWidth - x - width}px`;
      break;
    case 'CENTER':
      result.left = '50%';
      result.transform = 'translateX(-50%)';
      break;
    case 'LEFT_RIGHT':
      result.left = `${x}px`;
      result.right = `${parentWidth - x - width}px`;
      break;
    // Add 'SCALE' here if you ever want to handle it
  }

  // ───────────────────────────────
  // Vertical Constraints
  switch (verticalConstraint) {
    case 'TOP':
      result.top = `${y}px`;
      break;
    case 'BOTTOM':
      result.bottom = `${parentHeight - y - height}px`;
      break;
    case 'CENTER':
      result.top = '50%';
      result.transform = result.transform
        ? `${result.transform} translateY(-50%)`
        : 'translateY(-50%)';
      break;
    case 'TOP_BOTTOM':
      result.top = `${y}px`;
      result.bottom = `${parentHeight - y - height}px`;
      break;
  }

  return result;
}
