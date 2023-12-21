// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

let packageManagerObj = {
  pnpm: "pnpm",
  yarn: "yarn",
  npm: "npm",
};

async function _selectTs() {
  return await vscode.window.showQuickPick(["Yes", "No"], {
    canPickMany: false,
    placeHolder: "Do you want to use Typescript?",
  });
}

async function _selectPackageManager() {
  return await vscode.window.showQuickPick(["pnpm", "yarn", "npm"], {
    canPickMany: false,
    placeHolder: "Select package manager",
  });
}

async function _inputProjectName() {
  return await vscode.window.showInputBox({
    placeHolder: "Project name",
    validateInput: (input) => {
      if (!input || !input.length) {
        return {
          message: "Please input validate project name",
          severity: 3,
        };
      }
    },
  });
}

async function _selectFolder() {
  return await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    title: "Select project path",
  });
}

async function _getCommand(params) {
  const { framework, path, packageManager, projectName, useTs } = params;
  console.log(
    "framework, path, packageManager, projectName, useTs : ",
    framework,
    path,
    packageManager,
    projectName,
    useTs
  );
  switch (framework) {
    case "Next":
      return new vscode.ShellExecution(
        `cd ${path} && create-next-app ${projectName} ${
          useTs === "Yes" ? "--ts" : "--js"
        } --use-${packageManagerObj[packageManager]}`
      );
    // case "Nuxt":
    //   const tsCommand =
    //     packageManager === "npm"
    //       ? "npm install --save-dev vue-tsc typescript"
    //       : `${packageManager} add -D vue-tsc typescript`;
    //   return new vscode.ShellExecution(
    //     `cd ${path} && pnpm dlx nuxi@latest init ${projectName} && cd ${projectName} && ${packageManager} install ${
    //       useTs === "Yes" ? "&& " + tsCommand : ""
    //     }`
    //   );
    case "Vue":
    case "React":
    case "Svelte":
    case "Solid":
      return new vscode.ShellExecution(
        `cd ${path} && ${packageManager} create vite ${projectName} --template ${framework.toLowerCase()} ${
          useTs === "Yes" ? "-ts" : ""
        } && cd ${projectName} && ${packageManager} install`
      );
    default:
      return;
  }
}

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
      const inputFramework = await vscode.window.showQuickPick(
        ["React", "Vue", "Svelte", "Solid", "Next", "Nuxt"],
        {
          canPickMany: false,
          placeHolder: "Select framework",
        }
      );

      if (inputFramework === "Nuxt") { // Nuxt
				const nuxtProjectName = await _inputProjectName();

				const nuxtFolderPath = await _selectFolder();

        if (!nuxtFolderPath || !nuxtFolderPath.length) {
          return;
        }
        const nuxtCommand = new vscode.ShellExecution(
					`cd ${nuxtFolderPath[0].path} && pnpm dlx nuxi@latest init ${nuxtProjectName}`
				);

				let nuxtTaks = new vscode.Task(
					{ type: "command" },
					2,
					"create-init",
					"pnpm",
					nuxtCommand
				);

				vscode.tasks.executeTask(nuxtTaks);
				vscode.tasks.onDidEndTaskProcess((e) => {
          if (e.execution.terminate && e.exitCode === 0) {
            console.log("=========this task is terminate=========");
            vscode.commands.executeCommand(
              "vscode.openFolder",
              vscode.Uri.joinPath(
                vscode.Uri.parse(nuxtFolderPath[0].path),
                nuxtProjectName
              ),
              true
            );
          } else {
            console.error("========this task processed error======");
            return;
          }
        });
      } else {
        const useTs = await _selectTs();

        const pm = await _selectPackageManager();

        const projectName = await _inputProjectName();

        const folderPath = await _selectFolder();

        if (!folderPath || !folderPath.length) {
          return;
        }

        const executeCommand = await _getCommand({
          framework: inputFramework,
          useTs,
          packageManager: pm,
          projectName,
          path: folderPath[0].path,
        });

        let task = new vscode.Task(
          { type: "command" },
          2,
          "create-init",
          pm,
          executeCommand
        );
        vscode.tasks.executeTask(task);

        vscode.tasks.onDidEndTaskProcess((e) => {
          if (e.execution.terminate && e.exitCode === 0) {
            console.log("=========this task is terminate=========");
            vscode.commands.executeCommand(
              "vscode.openFolder",
              vscode.Uri.joinPath(
                vscode.Uri.parse(folderPath[0].path),
                projectName
              ),
              true
            );
          } else {
            console.error("========this task processed error======");
            return;
          }
        });
      }
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
