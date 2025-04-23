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