export function logNodeOutput(node, result, depth = 0, isRoot = true) {
  const indent = '  '.repeat(depth);

  if (depth === 0 && isRoot) {
    console.log(
      '%c========== SELECTION START ==========',
      'color: white; background: green; font-weight: bold; padding: 2px;'
    );
    console.log('');
  }

  // 🧩 Node summary
  console.log(`${indent}🧩 Node: <${result.tag}> | .${result.className} | "${result.name}" | ${result.type} | ID: ${result.id}`);
  console.log('');

  // 🧭 Tree Path
  if (result.treePath) {
    console.log(`${indent}🧭 Tree Path: ${result.treePath}`);
    console.log('');
  }

  // 📐 Position
  const pos = result.position;
  if (pos) {
    const summary = [
      `widthMode: ${pos.widthMode}`,
      `heightMode: ${pos.heightMode}`,
      `zIndex: ${pos.zIndex}`
    ].join(' | ');
    console.log(`${indent}📐 Position: ${summary}`);
    console.log('');
  }

  // 🧱 Layout
  const layout = result.layout;
  if (layout) {
    const summary = [
      `type: ${layout.type}`,
      `direction: ${layout.direction}`,
      `justify: ${layout.justifyContent}`,
      `align: ${layout.alignItems}`
    ].join(' | ');
    console.log(`${indent}🧱 Layout: ${summary}`);
    console.log('');
  }

  // 🎨 Style
  const style = result.style;
  if (style) {
    const fillStyle =
      (style.fillStyleName !== undefined && style.fillStyleName !== null && style.fillStyleName) ||
      (style.fill && style.fill.color) ||
      'none';
    const imageType = (style.image && style.image.type) || 'none';
    const blendMode = style.blendMode || 'normal';

    const summary = [
      `fillStyle: ${fillStyle}`,
      `image: ${imageType}`,
      `blendMode: ${blendMode}`
    ].join(' | ');
    console.log(`${indent}🎨 Style: ${summary}`);
    console.log('');
  }

  // ✍️ Text
  const text = result.text;
  if (text) {
    const summary = [
      `textStyle: ${text.textStyleName || 'none'}`,
      `font: ${text.fontName || 'N/A'}`,
      `style: ${text.fontStyle || 'N/A'}`
    ].join(' | ');
    console.log(`${indent}✍️ Text: ${summary}`);

    const preview = text.textContent ? text.textContent.slice(0, 60).replace(/\n/g, ' ') + '...' : '';
    if (preview) console.log(`${indent}   ↪ "${preview}"`);
    console.log('');
  }

  // 📦 Instance/Component
  if (result.isComponent) {
    console.log(`${indent}📦 Component: ${result.componentName}`);
    console.log('');
  }
  if (result.isInstance) {
    console.log(`${indent}🔗 Instance of: ${result.instanceOf}`);
    console.log('');
  }

  console.log(`${indent}----------------------------------------`);
  console.log('');

  if (Array.isArray(result.children) && result.children.length > 0) {
    result.children.forEach(child => {
      logNodeOutput({ type: child.type }, child, depth + 1, false);
    });
    console.log('');
  }

  if (depth === 0 && isRoot) {
    console.log(
      '%c=========== SELECTION END ===========',
      'color: white; background: red; font-weight: bold;'
    );
    console.log('');
  }
}
