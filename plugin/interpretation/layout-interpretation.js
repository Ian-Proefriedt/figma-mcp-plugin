export function interpretAlignment(value) {
  switch (value) {
    case 'MIN': return 'flex-start';
    case 'MAX': return 'flex-end';
    case 'CENTER': return 'center';
    case 'SPACE_BETWEEN': return 'space-between';
    case 'SPACE_AROUND': return 'space-around';
    default: return (value && value.toLowerCase().replaceAll('_', '-')) || null;
  }
}

function interpretAxisSize(raw, axis) {
  const isMainAxis = (
    (raw.parentLayoutMode === 'VERTICAL' && axis === 'height') ||
    (raw.parentLayoutMode === 'HORIZONTAL' && axis === 'width')
  );

  const isInAutoLayout = raw.parentLayoutMode === 'VERTICAL' || raw.parentLayoutMode === 'HORIZONTAL';
  const isSelfAutoLayout = raw.layoutMode === 'VERTICAL' || raw.layoutMode === 'HORIZONTAL';

  // ────────────────────────────────
  // 1. FILL detection
  // ────────────────────────────────
  if (isInAutoLayout) {
    if (isMainAxis && raw.layoutGrow === 1) return 'flexGrow';
    if (!isMainAxis && raw.layoutAlign === 'STRETCH') return 'alignSelf';
  }

  // ────────────────────────────────
  // 2. Container hug/fixed
  if (isSelfAutoLayout) {
    const sizingMode =
      (raw.layoutMode === 'HORIZONTAL' && axis === 'width') ? raw.primaryAxisSizingMode :
      (raw.layoutMode === 'HORIZONTAL' && axis === 'height') ? raw.counterAxisSizingMode :
      (raw.layoutMode === 'VERTICAL' && axis === 'height') ? raw.primaryAxisSizingMode :
      (raw.layoutMode === 'VERTICAL' && axis === 'width') ? raw.counterAxisSizingMode :
      null;

    if (sizingMode === 'AUTO') return 'fit-content';
    if (sizingMode === 'FIXED') return `${Math.round(raw[axis])}px`;
  }

  // ────────────────────────────────
  // 3. Text hug/fixed fallback
  if (raw.isText && raw.textAutoResize !== undefined) {
    if (raw.textAutoResize === 'WIDTH_AND_HEIGHT') return 'fit-content';

    if (raw.textAutoResize === 'HEIGHT') {
      if (axis === 'height') return 'fit-content';
      if (axis === 'width') return `${Math.round(raw.width)}px`;
    }

    if (raw.textAutoResize === 'NONE') {
      return `${Math.round(raw[axis])}px`;
    }
  }

  // ────────────────────────────────
  // 4. Implied 100% (frame matching)
  if (!isSelfAutoLayout && !raw.isText) {
    const size = Math.round(raw[axis]);
    const parentSize = axis === 'width' ? raw.parentWidth : raw.parentHeight;

    if (
      typeof size === 'number' &&
      typeof parentSize === 'number' &&
      Math.abs(size - parentSize) <= 1
    ) {
      return '100%';
    }
  }

  // ────────────────────────────────
  // 5. Absolute fallback
  return `${Math.round(raw[axis])}px`;
}


export function interpretSizeAndLayoutBehavior(raw) {
  const output = {
    width: null,
    height: null,
    flexGrow: null,
    alignSelf: null
  };

  // WIDTH
  const widthBehavior = interpretAxisSize(raw, 'width');
  if (widthBehavior === 'flexGrow') {
    output.flexGrow = 1;
  } else if (widthBehavior === 'alignSelf') {
    output.alignSelf = 'stretch';
  } else {
    output.width = widthBehavior;
  }

  // HEIGHT
  const heightBehavior = interpretAxisSize(raw, 'height');
  if (heightBehavior === 'flexGrow') {
    output.flexGrow = 1; // unlikely but valid edge case
  } else if (heightBehavior === 'alignSelf') {
    output.alignSelf = 'stretch';
  } else {
    output.height = heightBehavior;
  }

  return output;
}

export function interpretOverflow(clipsContent) {
  return clipsContent === true ? 'hidden' : null;
}