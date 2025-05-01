export function logNodeOutput(node, result, depth = 0) {
  const indent = '  '.repeat(depth);

  // Show "Selection Start" at top level only
  if (depth === 0) {
    console.log('%c========== SELECTION START ==========', 'background: #4CAF50; color: white; font-weight: bold; padding: 2px 4px;');
  }

  const nodeTag = result.tag || 'div';
  const className = result.className || 'unnamed';
  const nodeName = result.name || 'Unnamed Layer';
  const nodeType = result.type || 'UNKNOWN';
  const nodeId = result.id || 'no-id';

  const summary = `${indent}🧩 Node: <${nodeTag}> | .${className} | "${nodeName}" | ${nodeType} | ID: ${nodeId}`;
  console.log(summary);

  if (result.treePath) console.log(`${indent}🧭 Tree Path: ${result.treePath}`);
  if (result.position) console.log(`${indent}📐 Position:`, result.position);
  if (result.layout) console.log(`${indent}🧱 Layout:`, result.layout);
  if (result.style) console.log(`${indent}🎨 Style:`, result.style);
  if (result.text) console.log(`${indent}✍️ Text:`, result.text);
  if (result.isComponent) console.log(`${indent}📦 Component:`, result.componentName);
  if (result.isInstance) console.log(`${indent}🔗 Instance of:`, result.instanceOf);

  console.log(`${indent}----------------------------------------`);

  if (Array.isArray(result.children) && result.children.length > 0) {
    result.children.forEach(child => {
      logNodeOutput(child, child, depth + 1);
    });
  }

  // Show "Selection End" at top level only
  if (depth === 0) {
    console.log('%c=========== SELECTION END ===========', 'background: #F44336; color: white; font-weight: bold; padding: 2px 4px;');
  }
}
