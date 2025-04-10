/**
 * Centralized state management for the UI
 */

import { PropertyHandler } from '../properties/PropertyHandler.js';
import { PropertyBlock } from '../components/PropertyBlock.js';
import { PropertyPanel } from '../components/PropertyPanel.js';

// AppState singleton
export const AppState = {
  currentSelection: null,
  propertyPanel: null,
  
  // Initialize the app state
  init: function() {
    // Create the property panel
    const container = document.querySelector('.plugin-container');
    if (container) {
      this.propertyPanel = new PropertyPanel(container);
    }
  },
  
  // Status management
  updateStatus: function(message) {
    const statusEl = document.getElementById('plugin-status');
    if (statusEl) statusEl.textContent = message;
  },
  
  // Selection management
  setSelection: function(data) {
    this.currentSelection = data;
    this.updateUI();
  },
  
  // UI update orchestration
  updateUI: function() {
    if (!this.currentSelection) return;
    
    updateSelectionInfo(this.currentSelection);
    
    // Use the property panel if available
    if (this.propertyPanel) {
      this.propertyPanel.updateUI(this.currentSelection);
    } else {
      // Legacy fallback
      updateSectionVisibility(this.currentSelection);
      updateVisibilityByType(this.currentSelection);
      PropertyHandler.updateAllProperties(this.currentSelection);
      updatePropertyStates(this.currentSelection);
    }
    
    // For debugging
    displayRawData(this.currentSelection);
  },
  
  // Find a property block by property name
  findPropertyBlock: function(name) {
    const element = document.querySelector(`[data-property="${name}"]`);
    return element ? new PropertyBlock(element) : null;
  },
  
  // Update a property value
  updatePropertyValue: function(name, value, isOriginal = true) {
    const block = this.findPropertyBlock(name);
    if (block) {
      block.setValue(value, { isOriginal });
      return true;
    }
    return false;
  },
  
  // Set a property state
  setPropertyState: function(name, state) {
    const block = this.findPropertyBlock(name);
    if (block) {
      block.setState(state);
      return true;
    }
    return false;
  }
};

// These functions are used by AppState.updateUI
// They should be defined in the same file for clarity

// Update selection title display
function updateSelectionInfo(data) {
  if (!data) return;

  const nameEl = document.querySelector('.selection-name');
  const typeEl = document.querySelector('.selection-type');
  
  if (nameEl) nameEl.textContent = data.name || 'Unnamed';
  
  if (typeEl) {
    const typeText = data.type 
      ? data.type.charAt(0) + data.type.slice(1).toLowerCase() 
      : 'Unknown';
    typeEl.textContent = typeText;
  }
}

// Consolidated section visibility management
function updateSectionVisibility(data) {
  if (!data) return;

  // Map of section headers to visibility conditions
  const sectionVisibility = {
    'Layout': true,
    'Position & Size': true,
    'Styles': true,
    'Text': data.type === 'TEXT',
    'Raw Data': false // Always hidden
  };
  
  // Update visibility for each section
  document.querySelectorAll('.section').forEach(section => {
    const header = section.querySelector('h3');
    if (!header) return;
    
    const headerText = header.textContent;
    const isVisible = sectionVisibility[headerText] !== undefined 
      ? sectionVisibility[headerText] 
      : true;
    
    section.classList.toggle('hidden', !isVisible);
  });
}

// Update visibility of property blocks based on element type
function updateVisibilityByType(data) {
  if (!data) return;

  // Show/hide property blocks based on element type
  const visibilityMap = {
    'fill': ['FRAME', 'RECTANGLE', 'ELLIPSE', 'POLYGON', 'STAR', 'TEXT'],
    'stroke': ['FRAME', 'RECTANGLE', 'ELLIPSE', 'POLYGON', 'STAR'],
    'radius': ['FRAME', 'RECTANGLE'],
    'opacity': true, // Always show
    'blend': true,   // Always show
    'shadow': ['FRAME', 'RECTANGLE', 'ELLIPSE', 'POLYGON', 'STAR', 'TEXT']
  };
  
  // Update visibility for property blocks
  Object.entries(visibilityMap).forEach(([property, types]) => {
    const block = document.querySelector(`[data-property="${property}"]`);
    if (!block) return;
    
    const isVisible = types === true || 
      (Array.isArray(types) && types.includes(data.type));
    
    block.style.display = isVisible ? '' : 'none';
  });
}

// Update property states (locked/unlocked) based on context
function updatePropertyStates(data) {
  if (!data) return;
  
  try {
    const isActuallyInAutoLayout = window.PropertyInterpreter.isActuallyInAutoLayout(data);
    const isInAutoLayout = 
      (data.layout && data.layout.type === 'AUTO') || 
      (data.layout && data.layout.parent && data.layout.parent.type === 'AUTO') ||
      (data.layout && data.layout.parent && data.layout.parent.layoutMode === "HORIZONTAL") ||
      (data.layout && data.layout.parent && data.layout.parent.layoutMode === "VERTICAL") ||
      isActuallyInAutoLayout;
    const ignoresAutoLayout = (data.layout && data.layout.isIgnoringAutoLayout === true) && !isActuallyInAutoLayout;
    
    // Lock/unlock position and constraints based on auto layout
    if (isInAutoLayout && !ignoresAutoLayout) {
      AppState.setPropertyState('position', 'locked');
      AppState.setPropertyState('constraints', 'locked');
    } else {
      AppState.setPropertyState('position', 'default');
      AppState.setPropertyState('constraints', 'default');
    }
  } catch (error) {
    console.error('Error updating property states', error);
  }
}

// Display raw data for debugging
function displayRawData(data) {
  if (!data) return;
  
  const rawDataDisplay = document.getElementById('raw-data');
  if (!rawDataDisplay) return;
  
  try {
    rawDataDisplay.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    rawDataDisplay.textContent = 'Error serializing data: ' + error.message;
  }
}

// Make it available globally for compatibility with existing code
if (typeof window !== 'undefined') {
  window.AppState = AppState;
} 