/**
 * Centralized logging system
 */

// Define constants directly rather than as object properties
const DEBUG = 0;
const INFO = 1;
const WARN = 2;
const ERROR = 3;

// Debug flag for production vs development
const isDebug = false;

// Current log level
const currentLevel = isDebug ? DEBUG : INFO;

// Create a resilient logger that doesn't depend on property references
export const Logger = {
  // Expose log levels as constants
  LEVELS: {
    DEBUG: DEBUG,
    INFO: INFO,
    WARN: WARN,
    ERROR: ERROR
  },
  
  // Debug flag for production vs development
  DEBUG: isDebug,
  
  // Current log level
  level: currentLevel,
  
  // Prefix for all log messages
  prefix: '[MCP] ',
  
  // Enable/disable specific logging categories
  categories: {
    properties: true,  // Property value logs 
    nodeData: true,    // Raw node data logs
    ui: true           // UI update logs
  },
  
  // Debug logs - detailed information
  debug: function(component, message, data) {
    if (currentLevel <= DEBUG && this.categories[component.toLowerCase()] !== false) {
      console.debug(`${this.prefix}${component}: ${message}`, data || '');
    }
  },
  
  // Info logs - normal operation information
  info: function(component, message, data) {
    if (currentLevel <= INFO) {
      console.info(`${this.prefix}${component}: ${message}`, data || '');
    }
  },
  
  // Warning logs - potentially problematic situations
  warn: function(component, message, data) {
    if (currentLevel <= WARN) {
      console.warn(`${this.prefix}${component}: ${message}`, data || '');
    }
  },
  
  // Error logs - failures that need attention
  error: function(component, message, data) {
    if (currentLevel <= ERROR) {
      console.error(`${this.prefix}${component}: ${message}`, data || '');
    }
  }
};

// Make it available globally for compatibility with existing code
if (typeof window !== 'undefined') {
  window.Logger = Logger;
} 