export function renderFeedbackMessage(message, type = 'info') {
    const logContainer = document.getElementById('feedback-log');
    if (!logContainer) return;
  
    const entry = document.createElement('div');
    entry.className = `feedback-entry feedback-${type}`;
    entry.textContent = message;
  
    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight; // Auto-scroll to newest message
  }
  
  export function clearFeedbackLog() {
    const logContainer = document.getElementById('feedback-log');
    if (logContainer) {
      logContainer.innerHTML = '';
    }
  }