function registerPluginEvents() {
  figma.showUI(__html__, { visible: true, width: 300, height: 200 });

  figma.ui.onmessage = msg => {
    if (msg.type === 'start-export') {
      const node = figma.currentPage.selection[0];
      if (!node) {
        figma.notify("Please select a node first.");
        return;
      }
      handleSelection(node);
    }
  };
}