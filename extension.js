// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const {CSR, SSR, packageManagerOptions, useTsOptions} = require('./src/constant');
const {_createQuickPicker, _createInputBox, _createFolder} = require('./src/create');
const { _runTask} = require('./src/task');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "vitemplate.ViTemplate",
    async function () {
      _createQuickPicker(
        [...CSR, ...SSR],
        "Please select frameword",
        (framework) => {
          _createQuickPicker(useTsOptions, "Use Typescript?", (useTs) => {
            _createQuickPicker(
              packageManagerOptions,
              "Select package manager",
              async (packageManager) => {
                const projectName = await _createInputBox();
                const folderPath = await _createFolder();
                const path = folderPath[0].path;

                _runTask({
                  framework, path, packageManager, projectName, useTs
                });
              }
            );
          });
        }
      );
    }
  );
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
