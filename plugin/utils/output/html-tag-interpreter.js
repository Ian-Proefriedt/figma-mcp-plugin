export function getHtmlTagFromType(type, node) {
  if (type === 'IMAGE') return 'img';
  if (type === 'TEXT') return 'span';
  if (type === 'LINE') return 'hr';
  if (type === 'ELLIPSE') return 'div';
  if (type === 'FRAME' || type === 'GROUP' || type === 'INSTANCE' || type === 'COMPONENT') return 'div';
  return 'div';
}
