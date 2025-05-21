export function logNodeOutput(node, result, depth = 0) {
  const indent = '  '.repeat(depth);
  
  function deepInspectNode(node) {
    const props = {};
    let current = node;
  
    while (current) {
      Object.getOwnPropertyNames(current).forEach(prop => {
        if (!(prop in props)) {
          try {
            props[prop] = node[prop];
          } catch {
            props[prop] = '[Unreadable]';
          }
        }
      });
      current = Object.getPrototypeOf(current);
    }
  
    return props;
  }
  
  // Show "Selection Start" at top level only
  if (depth === 0) {
    console.log('%c========== SELECTION START ==========', 'background: #4CAF50; color: white; font-weight: bold; padding: 2px 4px;');
  }

  const nodeTag = result.tag || 'div';
  const className = result.className || 'unnamed';
  const nodeName = result.name || 'Unnamed Layer';
  const nodeType = result.type || 'UNKNOWN';
  const nodeId = result.id || 'no-id';
  const rawNodeDump = deepInspectNode(node);
  
  const summary = `${indent}🧩 Node: <${nodeTag}> | .${className} | "${nodeName}" | ${nodeType} | ID: ${nodeId}`;
  console.log(summary);
  
  if (rawNodeDump) console.log(`${indent}🧬 Raw Node:`, rawNodeDump);
  
  if (result.treePath) console.log(`${indent}🧭 Tree Path: ${result.treePath}`);
  if (result.position) console.log(`${indent}📐 Position:`, result.position);
  if (result.layout) console.log(`${indent}🧱 Layout:`, result.layout);
  if (result.style) console.log(`${indent}🎨 Style:`, result.style);
  if (result.text) console.log(`${indent}✍️ Text:`, result.text);
  if (result.isComponent) console.log(`${indent}📦 Component:`, result.componentName);
  if (result.isInstance) console.log(`${indent}🔗 Instance of:`, result.instanceOf);

  console.log(`${indent}----------------------------------------`);

  if (Array.isArray(result.children) && result.children.length > 0) {
    result.children.forEach((childResult, index) => {
      const childNode = node.children?.[index]; // 🔑 this preserves original Figma nodes
      logNodeOutput(childNode, childResult, depth + 1);
    });
  }

  // Show "Selection End" at top level only
  if (depth === 0) {
    console.log('%c=========== SELECTION END ===========', 'background: #F44336; color: white; font-weight: bold; padding: 2px 4px;');
  }
}
