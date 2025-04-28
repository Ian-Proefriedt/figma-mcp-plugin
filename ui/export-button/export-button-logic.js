export function startExport() {
  parent.postMessage(
    { pluginMessage: { type: 'start-server' } },
    '*'
  );
}
