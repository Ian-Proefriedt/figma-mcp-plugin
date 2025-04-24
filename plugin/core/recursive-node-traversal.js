import { processNodeProperties } from './master-processing.js';
import { getFixedStatus, isOverlapping } from '../detection/position-detection.js';

export function traverseNodeTree(node, inheritedZ = null, path = '') {
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

  const processed = processNodeProperties(node, {
    position: { zIndex }
  });

  processed.treePath = path || node.name;

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
