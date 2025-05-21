import { registerPluginEvents } from '../runtime/event-bridge.js';
import { logLocalStylesAndTokens } from '../utils/logging/styles-log.js';

registerPluginEvents();
logLocalStylesAndTokens();
