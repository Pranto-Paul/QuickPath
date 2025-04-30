const vscode = require("vscode");
const { showPathInput } = require("../utils/inputPrompt.js");
const { customMessage } = require("../utils/customMessage.js");

/**
 * Command to create a file or directory from user input
 */
module.exports = async function createFileOrDir() {
  // Check if a workspace is open
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showWarningMessage("Open a folder/project to use QuickPath.");
    return;
  }

  // Get the root path of the first workspace folder
  const rootPath = workspaceFolders[0].uri.fsPath;

  // Show input prompt for file or directory creation
  await showPathInput(rootPath);
};
