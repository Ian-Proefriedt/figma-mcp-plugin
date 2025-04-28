export const PropertyMap = {
    layout: [
      { key: 'type', label: 'Type', fromRoot: true },
      { key: 'direction', label: 'Direction' },
      { key: 'justifyContent', label: 'Justify Content' },
      { key: 'alignItems', label: 'Align Items' },
      { key: 'gap', label: 'Gap' },
      { key: 'padding', label: 'Padding' },
      { key: 'wrap', label: 'Wrap' }
    ],
    position: [
      { key: 'x', label: 'X' },
      { key: 'y', label: 'Y' },
      { key: 'width', label: 'Width' },
      { key: 'widthMode', label: 'Width Mode' },
      { key: 'height', label: 'Height' },
      { key: 'heightMode', label: 'Height Mode' },
      { key: 'rotation', label: 'Rotation' },
      { key: 'constraints', label: 'Constraints', transform: JSON.stringify },
      { key: 'positioning', label: 'Positioning' },
      { key: 'clipping', label: 'Clipping' },
      { key: 'zIndex', label: 'Z Index' }
    ],
    style: [
      { key: 'fillStyleId', label: 'Fill Style ID' },
      { key: 'fill', label: 'Fill', transform: JSON.stringify },
      { key: 'stroke', label: 'Stroke', transform: JSON.stringify },
      { key: 'radius', label: 'Radius' },
      { key: 'blendMode', label: 'Blend Mode' },
      { key: 'shadow', label: 'Shadow' },
      { key: 'image', label: 'Image', transform: JSON.stringify }
    ],
    text: [
      { key: 'textStyleId', label: 'Text Style ID' },
      { key: 'textContent', label: 'Text Content' },
      { key: 'fontSize', label: 'Font Size' },
      { key: 'fontName', label: 'Font Name' },
      { key: 'fontStyle', label: 'Font Style' },
      { key: 'alignment', label: 'Alignment', transform: JSON.stringify },
      { key: 'letterSpacing', label: 'Letter Spacing' },
      { key: 'lineHeight', label: 'Line Height' },
      { key: 'textCase', label: 'Text Case' },
      { key: 'textDecoration', label: 'Text Decoration' }
    ]
  };
  