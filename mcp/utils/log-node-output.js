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