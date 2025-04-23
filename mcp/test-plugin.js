// test-plugin.js (Flattened detection test plugin with recursive + z-index integration)

// ================================
// ✳️ STYLE NAME HELPERS
// ================================

function getStyleNameById(styleId, styleType) {
  let styles = [];
  switch (styleType) {
    case 'text':
      styles = figma.getLocalTextStyles();
      break;
    case 'fill':
    case 'stroke':
      styles = figma.getLocalPaintStyles();
      break;
    case 'effect':
      styles = figma.getLocalEffectStyles();
      break;
  }
  const style = styles.find(s => s.id === styleId);
  return style ? style.name : null;
}

// ================================
// ✳️ DETECTION FUNCTIONS
// ================================

// [Insert full detection functions here — imported from original plugin version]
// --- Layout Detection
function getLayoutDirection(node) {
  return node && node.layoutMode === 'VERTICAL' ? 'column' : 'row';
}

function isAutoLayout(node) {
  return (node && (node.layoutMode === 'VERTICAL' || node.layoutMode === 'HORIZONTAL'));
}

function interpretAlignment(value) {
  switch (value) {
    case 'MIN': return 'flex-start';
    case 'MAX': return 'flex-end';
    case 'CENTER': return 'center';
    case 'SPACE_BETWEEN': return 'space-between';
    case 'SPACE_AROUND': return 'space-around';
    default: return (value && value.toLowerCase().replaceAll('_', '-')) || 'undefined';
  }
}

function getLayoutAlignment(node) {
  return {
justifyContent: interpretAlignment(node && node.primaryAxisAlignItems),
    alignItems: interpretAlignment(node && node.counterAxisAlignItems)
  };
}

function getItemSpacing(node) {
  return (node && node.itemSpacing) || 0;
}

function getPadding(node) {
  return {
    top: (node && node.paddingTop) || 0,
    right: (node && node.paddingRight) || 0,
    bottom: (node && node.paddingBottom) || 0,
    left: (node && node.paddingLeft) || 0
  };
}

function getLayoutWrap(node) {
  const val = node && node.layoutWrap;
  return val === 'WRAP' ? 'wrap' : 'nowrap';
}

// --- Position Detection
function isOverlapping(a, b) {
  if (!a || !b) return false;
  const ax = a.x, ay = a.y, aw = a.width, ah = a.height;
  const bx = b.x, by = b.y, bw = b.width, bh = b.height;
  return !(ax + aw <= bx || ax >= bx + bw || ay + ah <= by || ay >= by + bh);
}

function interpretConstraint(value, axis) {
  if (axis === 'horizontal') {
    switch (value) {
      case 'MIN': return 'left';
      case 'MAX': return 'right';
      case 'CENTER': return 'center';
      case 'STRETCH': return 'stretch';
      case 'SCALE': return 'scale';
      default: return (value && value.toLowerCase()) || 'undefined';
    }
  } else if (axis === 'vertical') {
    switch (value) {
      case 'MIN': return 'top';
      case 'MAX': return 'bottom';
      case 'CENTER': return 'center';
      case 'STRETCH': return 'stretch';
      case 'SCALE': return 'scale';
      default: return (value && value.toLowerCase()) || 'undefined';
    }
  }
  return 'undefined';
}

function isActuallyInAutoLayout(node) {
  if (!node || node.type !== "TEXT") return false;
  const parentLayout = node.parent && node.parent.layoutMode;
  const positioning = node.layoutPositioning;
  const constraints = node.constraints || {};
  const hasNeutralConstraints = (constraints.horizontal === "MIN" && constraints.vertical === "MIN");
  const isMarkedAbsolute = positioning === "ABSOLUTE";
  const isInsideAutoLayout = parentLayout === "HORIZONTAL" || parentLayout === "VERTICAL";
  const isAutoPositioning = positioning === "AUTO";
  return ((isMarkedAbsolute && isInsideAutoLayout && hasNeutralConstraints) || isAutoPositioning);
}

function getFixedStatus(node) {
  const isAbsolute = node && node.layoutPositioning === 'ABSOLUTE';
  const parent = node && node.parent;
  const isRootChild = parent && parent.type === 'FRAME' && (!parent.parent || parent.parent.type === 'PAGE');
  return isAbsolute && isRootChild;
}

function getPosition(node) {
  return { x: (node && node.x) || 0, y: (node && node.y) || 0 };
}

function getSize(node) {
  return { width: (node && node.width) || 0, height: (node && node.height) || 0 };
}

function getSizingModes(node) {
  return {
    widthMode: (node && node.primaryAxisSizingMode && node.primaryAxisSizingMode.toLowerCase()) || 'fixed',
    heightMode: (node && node.counterAxisSizingMode && node.counterAxisSizingMode.toLowerCase()) || 'fixed'
  };
}

function getRotation(node) {
  return (node && node.rotation) || 0;
}

function getConstraints(node) {
  const raw = (node && node.constraints) || {};
  return {
    horizontal: interpretConstraint(raw.horizontal, 'horizontal'),
    vertical: interpretConstraint(raw.vertical, 'vertical')
  };
}

function getPositioning(node) {
  if (isActuallyInAutoLayout(node)) return 'relative';
  if (getFixedStatus(node)) return 'fixed';
  return node && node.layoutPositioning === 'ABSOLUTE' ? 'absolute' : 'relative';
}

function getClipping(node) {
  return (node && node.clipsContent) || false;
}

function getZIndex(node) {
  return 1; // placeholder: replaced by traverseNodeTree z-index logic
}

// --- Style Detection
function rgbToHex(color) {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function interpretFillType(type) {
  switch (type) {
    case 'SOLID': return 'solid';
    case 'LINEAR_GRADIENT': return 'linear-gradient';
    case 'RADIAL_GRADIENT': return 'radial-gradient';
    case 'ANGULAR_GRADIENT': return 'conic-gradient';
    default: return (type && type.toLowerCase()) || 'unknown';
  }
}

function isImageNode(node) {
  return node && node.type === 'RECTANGLE' && node.fills && node.fills.some(f => f.type === 'IMAGE');
}

function getFillAndImage(node) {
  const fills = (node && node.fills) || [];
  let image = null;
  let fill = null;
  for (const f of fills) {
    if (!image && f.type === 'IMAGE') {
      image = {
        type: 'image',
        imageRef: f.imageHash || null,
        scaleMode: (f && f.scaleMode && f.scaleMode.toLowerCase()) || 'undefined',
        styleId: (node && node.fillStyleId) || null
      };
    } else if (!fill && (f.type === 'SOLID' || (f && f.type && f.type.endsWith('_GRADIENT')))) {
      fill = {
        type: interpretFillType(f.type),
        color: f.color ? rgbToHex(f.color) : null,
        opacity: f.opacity || 1,
        styleId: (node && node.fillStyleId) || null
      };
    }
  }
  return { fill, image };
}

function getStroke(node) {
  const stroke = (node && node.strokes && node.strokes[0]) || null;
  return {
    color: (stroke && stroke.color) || null,
    opacity: (stroke && stroke.opacity) || 1,
    weight: (node && node.strokeWeight) || 1,
    styleId: (node && node.strokeStyleId) || null
  };
}

function getCornerRadius(node) {
  return (node && node.cornerRadius) || 0;
}

function interpretBlendMode(value) {
  switch (value) {
    case 'PASS_THROUGH':
    case 'NORMAL': return 'normal';
    case 'MULTIPLY': return 'multiply';
    case 'SCREEN': return 'screen';
    case 'OVERLAY': return 'overlay';
    case 'DARKEN': return 'darken';
    case 'LIGHTEN': return 'lighten';
    case 'COLOR_DODGE': return 'color-dodge';
    case 'COLOR_BURN': return 'color-burn';
    case 'HARD_LIGHT': return 'hard-light';
    case 'SOFT_LIGHT': return 'soft-light';
    case 'DIFFERENCE': return 'difference';
    case 'EXCLUSION': return 'exclusion';
    case 'HUE': return 'hue';
    case 'SATURATION': return 'saturation';
    case 'COLOR': return 'color';
    case 'LUMINOSITY': return 'luminosity';
    default: return (value && value.toLowerCase().replaceAll('_', '-')) || 'normal';
  }
}

function getBlendMode(node) {
  return interpretBlendMode(node && node.blendMode);
}

function getShadowPresence(node) {
  const effects = (node && node.effects) || [];
  return effects.some(effect => effect.type === 'DROP_SHADOW');
}

// --- Text Detection
function getTextContent(node) {
  return (node && node.characters) || '';
}

function interpretFontWeight(style) {
  if (!style || typeof style !== 'string') return null;
  const normalized = style.trim().toLowerCase();

  switch (normalized) {
    case 'thin':
    case 'hairline': return 100;
    case 'extra light':
    case 'ultralight': return 200;
    case 'light': return 300;
    case 'regular':
    case 'normal': return 400;
    case 'medium': return 500;
    case 'semibold':
    case 'demibold': return 600;
    case 'bold': return 700;
    case 'extra bold':
    case 'ultrabold': return 800;
    case 'black':
    case 'heavy': return 900;
    default: return null;
  }
}

function getFontStyle(node) {
  return {
    fontSize: (node && node.fontSize) || null,
    fontName: (node && node.fontName && node.fontName.family) || null,
    fontStyle: (node && node.fontName && node.fontName.style) || null,
    fontWeight: interpretFontWeight((node && node.fontName && node.fontName.style) || null)
  };
}

function getTextAlignment(node) {
  return {
    horizontal: (node && node.textAlignHorizontal && node.textAlignHorizontal.toLowerCase()) || 'left',
    vertical: (node && node.textAlignVertical && node.textAlignVertical.toLowerCase()) || 'top'
  };
}

function getTextSpacing(node) {
  return {
    letterSpacing: (node && node.letterSpacing && node.letterSpacing.value) || null,
    lineHeight: (node && node.lineHeight && node.lineHeight.value) || null,
    paragraphSpacing: (node && node.paragraphSpacing) || null
  };
}

function getTextCaseAndDecoration(node) {
  return {
    textCase: (node && node.textCase && node.textCase.toLowerCase()) || 'original',
    textDecoration: (node && node.textDecoration && node.textDecoration.toLowerCase()) || 'none'
  };
}

function getTextStyleId(node) {
  return (node && node.textStyleId) || null;
}

// ================================
// ✳️ PROCESSORS
// ================================

function processLayoutUI(node) {
  if (node.type === 'TEXT') return null;
  const alignment = getLayoutAlignment(node);
  return {
    type: isAutoLayout(node) ? 'Flex' : 'Block',
    direction: getLayoutDirection(node),
    justifyContent: alignment.justifyContent,
    alignItems: alignment.alignItems,
    gap: getItemSpacing(node),
    padding: getPadding(node),
    wrap: getLayoutWrap(node)
  };
}

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

function processTextUI(node) {
  const styleName = getStyleNameById(node && node.textStyleId, 'text');
  const styleDef = node && node.textStyleId
    ? figma.getLocalTextStyles().find(s => s.id === node.textStyleId)
    : null;

  const font = styleDef
  ? {
      fontSize: styleDef.fontSize,
      fontName: styleDef.fontName.family,
      fontStyle: styleDef.fontName.style,
      fontWeight: interpretFontWeight(styleDef.fontName.style)
      }
    : getFontStyle(node);

  const spacing = styleDef
    ? {
        letterSpacing: styleDef.letterSpacing && styleDef.letterSpacing.value,
        lineHeight: styleDef.lineHeight && styleDef.lineHeight.value,
        paragraphSpacing: styleDef.paragraphSpacing || null
      }
    : getTextSpacing(node);

  const caseDecor = getTextCaseAndDecoration(node);

  return {
    textStyleName: styleName || null,
    textContent: getTextContent(node),
    fontSize: font.fontSize,
    fontName: font.fontName,
    fontStyle: font.fontStyle,
    fontWeight: font.fontWeight,
    alignment: getTextAlignment(node),
    letterSpacing: spacing.letterSpacing,
    lineHeight: spacing.lineHeight,
    paragraphSpacing: spacing.paragraphSpacing,
    textCase: caseDecor.textCase,
    textDecoration: caseDecor.textDecoration
  };
}

function processNodeProperties(node) {
  const className = sanitizeClassName(node.name);
  if (!node) return null;
  const isComponent = node.type === 'COMPONENT';
  const isInstance = node.type === 'INSTANCE';
  const instanceOf = isInstance && node.mainComponent ? node.mainComponent.name : null;

  return {
    id: node.id,
    name: node.name,
    tag: getHtmlTagFromType(node.type, node),
    className: className,
    type: isImageNode(node) ? 'IMAGE' : node.type,
    position: processPositionUI(node),
    layout: processLayoutUI(node),
    text: node.type === 'TEXT' ? processTextUI(node) : null,
    style: processStyleUI(node),
    isComponent: isComponent,
    componentName: isComponent ? node.name : null,
    isInstance: isInstance,
    instanceOf: instanceOf
  };
}

// ================================
// ✳️ CLASSNAME SANITIZER
// ================================

function sanitizeClassName(name) {
  if (typeof name !== 'string') return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-_]/g, '');
}

// ================================
// ✳️ HTML TAG INTERPRETER
// ================================

function getHtmlTagFromType(type, node) {
  if (type === 'IMAGE') return 'img';
  if (type === 'TEXT') return 'span';
  if (type === 'LINE') return 'hr';
  if (type === 'ELLIPSE') return 'div';
  if (type === 'FRAME' || type === 'GROUP' || type === 'INSTANCE' || type === 'COMPONENT') return 'div';
  return 'div';
}

// ================================
// ✳️ RECURSIVE TRAVERSAL WITH Z-INDEX
// ================================

function traverseNodeTree(node, inheritedZ = null, path = '') {
  if (!node || node.removed || node.visible === false) return null;

  const isFixed = getFixedStatus(node);
  const isRoot = !node.parent || node.parent.type === 'PAGE';

  // Fixed always gets 10, root gets 0, everything else starts at 1
  let zIndex;
  if (isFixed) {
    zIndex = 10;
  } else if (isRoot) {
    zIndex = 0;
  } else {
    zIndex = (inheritedZ !== null && inheritedZ !== undefined) ? inheritedZ : 1;
  }

  const processed = processNodeProperties(node);
  processed.treePath = path || node.name;
  processed.position.zIndex = zIndex;

  if ('children' in node && Array.isArray(node.children)) {
    const children = node.children.filter(child => !child.removed && child.visible !== false);

    // Detect which siblings overlap and group them
    const overlapGroups = [];

    for (let i = 0; i < children.length; i++) {
      const a = children[i];
      if (getFixedStatus(a)) continue; // ignore fixed

      const group = [a];
      for (let j = 0; j < children.length; j++) {
        if (i === j) continue;
        const b = children[j];
        if (getFixedStatus(b)) continue;
        if (isOverlapping(a, b)) {
          group.push(b);
        }
      }

      // Check if this group already exists
      if (!overlapGroups.some(g => g.includes(a))) {
        overlapGroups.push(group);
      }
    }

    const zMap = new Map();
    for (const group of overlapGroups) {
      const sorted = [...new Set(group)].sort((a, b) => children.indexOf(a) - children.indexOf(b));
      const N = sorted.length;
      sorted.forEach((node, index) => {
        zMap.set(node.id, N - index); // first in list = topmost = highest zIndex
      });
    }

    processed.children = children.map(child => {
      const childIsFixed = getFixedStatus(child);
      const inherited = childIsFixed ? 10 : (zMap.get(child.id) || zIndex);
      return traverseNodeTree(child, inherited, `${path || node.name}/${child.name}`);
    });
  }

  return processed;
}

// ================================
// ✳️ RECURSIVE LOGGER
// ================================

function logNodeOutput(node, result, depth = 0) {
  const indent = '  '.repeat(depth);
  console.log(`${indent}🧩 Node: [HTML Tag] ${result.tag} [Class] .${result.className} [Layer Name] ${result.name} [Type] ${result.type} [ID] ${result.id}`);

  if (result.treePath) console.log(`${indent}🧭 Tree Path: ${result.treePath}`);
  if (result.position) console.log(`${indent}📐 Position:`, result.position);
  if (result.layout) console.log(`${indent}🧱 Layout:`, result.layout);
  if (result.text) console.log(`${indent}✍️ Text:`, result.text);
  if (result.style) console.log(`${indent}🎨 Style:`, result.style);
  if (result.isComponent) console.log(`${indent}📦 Component:`, result.componentName);
  if (result.isInstance) console.log(`${indent}🔗 Instance of:`, result.instanceOf);
  console.log(`${indent}----------------------------------------`);

  if (Array.isArray(result.children) && result.children.length > 0) {
    result.children.forEach(child => {
      logNodeOutput({ type: child.type }, child, depth + 1);
    });
  }
}

// ================================
// ✳️ ENTRY POINT
// ================================

function handleSelection(node) {
  if (!node) {
    console.warn("No node selected.");
    return null;
  }

  const tree = traverseNodeTree(node);
  figma.ui.postMessage({
    type: 'export-tree-to-server',
    tree
  });

  // Also trigger font resolution from UI
  figma.ui.postMessage({
    type: 'trigger-font-resolution'
  });

  // 🔽 Detect and post image data
  const imagePromises = [];

  function collectImageNodes(node) {
    if (isImageNode(node) && node.fills) {
      const imageFill = node.fills.find(f => f.type === 'IMAGE');
      if (imageFill && imageFill.imageHash) {
        const promise = figma.getImageByHash(imageFill.imageHash).getBytesAsync()
          .then(bytes => {
            figma.ui.postMessage({
              type: 'export-image',
              bytes: Array.from(bytes),
              name: sanitizeClassName(node.name || 'image') + '.png'
            });
          })
          .catch(err => {
            console.warn('⚠️ Failed to extract image for', node.name, err);
          });
        imagePromises.push(promise);
      }
    }
    if ('children' in node && Array.isArray(node.children)) {
      node.children.forEach(collectImageNodes);
    }
  }

  collectImageNodes(node);
  Promise.all(imagePromises).then(() => {
    console.log('📦 All image exports complete');
  });
}

// ================================
// ✳️ FIGMA PLUGIN BOOTSTRAP
// ================================

figma.showUI(__html__, { visible: true, width: 300, height: 200 });

figma.ui.onmessage = msg => {
  if (msg.type === 'start-export') {
    const node = figma.currentPage.selection[0];
    if (!node) {
      figma.notify("Please select a node first.");
      return;
    }
    handleSelection(node);
  }
};
