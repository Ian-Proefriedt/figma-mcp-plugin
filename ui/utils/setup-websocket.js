import { renderFeedbackMessage } from '../feedback-log/feedback-log-logic.js';

let socket;

export function setupWebSocket() {
  socket = new WebSocket('ws://localhost:3001');

  socket.onopen = () => {
    console.log('🟢 WebSocket connected to server');
    renderFeedbackMessage('WebSocket connection established');
  };

  socket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      console.log('📡 Server message received:', msg);
      renderFeedbackMessage(`[${msg.type}] ${msg.content}`);
    } catch (err) {
      console.warn('⚠️ Failed to parse WebSocket message:', event.data);
    }
  };

  socket.onerror = (err) => {
    console.error('❌ WebSocket error:', err);
    renderFeedbackMessage('WebSocket error');
  };

  socket.onclose = () => {
    console.warn('🔌 WebSocket disconnected');
    renderFeedbackMessage('WebSocket disconnected');
  };
}