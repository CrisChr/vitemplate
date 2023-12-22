const {vscode, vsWindow, packageManagerOptions } = require("./constant");

/**
 * create input box
 */
function _createInputBox() {
  return new Promise((resolve) => {
    const inputBox = vsWindow.createInputBox();
    inputBox.placeholder = "Input project name";
    inputBox.ignoreFocusOut = true;
    inputBox.show();
    inputBox.onDidAccept(() => {
      const value = inputBox.value;
      if (!value || !value.length) {
        return vsWindow.showErrorMessage("Please input validate project name");
      }
      resolve(value);
      inputBox.dispose();
    });
  });
}

/**
 * create quick pick selector
 * @param {{label: string;picked: boolean;}[] | readonly vscode.QuickPickItem[]} items
 * @param {string} placeHolder
 * @param {(value: string) => void} [next]
 */
function _createQuickPicker(items, placeHolder, next) {
  const quickPick = vsWindow.createQuickPick();
  quickPick.items = items;
  quickPick.canSelectMany = false;
  quickPick.ignoreFocusOut = true;
  quickPick.placeholder = placeHolder;
  quickPick.show();
  quickPick.onDidAccept(() => {
    const value = quickPick.selectedItems[0].label;
    if (!value.length) return vsWindow.showWarningMessage("Please select!");
    quickPick.dispose();
    next(value);
  });
  return quickPick;
}

// select folder path
async function _createFolder() {
  return await vsWindow.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    title: "Select project path",
  });
}

/** get install command (React, Vue, Svelte, Solid, Next, Nuxt)
 * @param {{ framework: string; useTs?: string; packageManager?: string; projectName: string; path: string; }} params
 */
async function _createCommand(params) {
  const { framework, path, packageManager, projectName, useTs } = params;
  switch (framework) {
    case "Next":
      return new vscode.ShellExecution(
        `cd ${path} && create-next-app ${projectName} ${
          useTs === "Yes" ? "--ts" : "--js"
        } --use-${
          packageManagerOptions.find((pk) => pk.label === packageManager).label
        }`
      );
    case "Nuxt":
      return new vscode.ShellExecution(
        `cd ${path} && pnpm dlx nuxi@latest init ${projectName}`
      );
    case "Vue":
    case "React":
    case "Svelte":
    case "Solid":
      return new vscode.ShellExecution(
        `cd ${path} && ${packageManager} create vite ${projectName} --template ${framework.toLowerCase()}${
          useTs === "Yes" ? "-ts" : ""
        } && cd ${projectName} && ${packageManager} install`
      );
    default:
      return;
  }
}

module.exports = {
  _createInputBox,
  _createQuickPicker,
  _createFolder,
  _createCommand
}
