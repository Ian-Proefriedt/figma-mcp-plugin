// processing/component-processing.js

import {
    getTextPropertyReference,
    getBooleanPropertyReference,
    getInstanceSwapPropertyReference,
    getImagePropertyReference
  } from '../detection/component-detection.js';
  
  import { interpretPropName } from '../interpretation/component-interpretation.js';
  
  export function processComponentReferences(node) {
    const textRaw = getTextPropertyReference(node);
    const booleanRaw = getBooleanPropertyReference(node);
    const swapRaw = getInstanceSwapPropertyReference(node);
    const imageRaw = getImagePropertyReference(node);
  
    const result = {};
  
    if (textRaw) {
      result.textPropertyReference = interpretPropName(textRaw);
    }
  
    if (booleanRaw) {
      result.booleanPropertyReference = interpretPropName(booleanRaw);
    }
  
    if (swapRaw) {
      result.instanceSwapPropertyReference = interpretPropName(swapRaw);
    }
  
    if (imageRaw) {
      result.imagePropertyReference = interpretPropName(imageRaw);
    }
  
    return result;
  }
  