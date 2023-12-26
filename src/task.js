const vscode = require("vscode");
const { _createCommand } = require( "./create");

/**
 * run install command
 * @param {{ framework: string; path: any; packageManager?: string; projectName: any; useTs?: string; }} params
 */
async function _runTask(params) {
  const { path, projectName } = params;
  const task = await _createTask(params);
  vscode.tasks.executeTask(task).then(
    () => {
      vscode.tasks.onDidEndTaskProcess((taskEvent) => {
        if (taskEvent.execution.terminate && taskEvent.exitCode === 0) {
          console.log("=========this task is terminate=========");
          vscode.commands.executeCommand(
            "vscode.openFolder",
            vscode.Uri.joinPath(vscode.Uri.parse(path), projectName),
            true
          );
        } else {
          return vscode.window.showErrorMessage("Task is not terminate!");
        }
      });
    },
    () => {
      return vscode.window.showErrorMessage("Task run failed!");
    }
  );
}

/** create task
 * @param {{ framework: string; path: string; projectName: string; useTs?: string; packageManager?: string; }} params
 */
async function _createTask(params) {
  const { framework, packageManager, path } = params;
  if (!path || !path.length) {
    return;
  }
  const executeCommand = await _createCommand(params);
  console.log('executeCommand: ', executeCommand);
  return new vscode.Task(
    { type: "command" },
    2,
    `create-${framework}-project`,
    packageManager,
    executeCommand
  );
}

/**
 * @param {{ framework: any; useTs: any; packageManager: any; }} params
 */
// export async function _beforeRunTask(params) {
//   const { framework, useTs, packageManager } = params;
//   const projectName = await _createInputBox();
//   const folder = await _createFolder();
//   const path = folder[0].path;

//   return framework === "Nuxt"
//     ? { framework, path, projectName }
//     : {
//         framework,
//         useTs,
//         packageManager,
//         projectName,
//         path,
//       };
// }

module.exports = {_runTask}
