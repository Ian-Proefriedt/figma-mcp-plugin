// utils/log-design-references.js

export function logLocalStylesAndTokens() {
    // ──────────────
    // 🎨 STYLES
    // ──────────────
    console.log("🎨 Local Paint Styles:");
    figma.getLocalPaintStyles().forEach(style => {
      console.log(`🖌️ ${style.name} — ID: ${style.id}`, style.paints);
    });
  
    console.log("✍️ Local Text Styles:");
    figma.getLocalTextStyles().forEach(style => {
      console.log(`🔤 ${style.name} — ID: ${style.id}`, {
        fontSize: style.fontSize,
        fontName: style.fontName,
        lineHeight: style.lineHeight
      });
    });
  
    console.log("🌫️ Local Effect Styles:");
    figma.getLocalEffectStyles().forEach(style => {
      console.log(`✨ ${style.name} — ID: ${style.id}`, style.effects);
    });
  
    // ──────────────
    // 🧪 TOKENS
    // ──────────────
    const variables = figma.variables.getLocalVariables();
    const collections = figma.variables.getLocalVariableCollections();
  
    console.log("📦 Local Variable Collections:");
    collections.forEach(collection => {
      console.log(`📂 ${collection.name} — ID: ${collection.id}`);
      collection.modes.forEach(mode =>
        console.log(`   ↳ Mode: ${mode.name} (${mode.modeId})${mode.default ? ' [default]' : ''}`)
      );
    });
  
    console.log("🧬 Local Variables:");
    variables.forEach(variable => {
      console.log(`🔗 ${variable.name} (${variable.resolvedType}) — ID: ${variable.id}`);
      Object.entries(variable.valuesByMode).forEach(([modeId, val]) => {
        console.log(`   ↳ ${modeId}:`, val);
      });
    });
  }
  