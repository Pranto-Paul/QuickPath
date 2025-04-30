const vscode = require("vscode");
const {
  createFullPath,
  openFile,
  createPath,
} = require("../utils/fileSystem.js");
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
  const inputPath = await showPathInput(rootPath);
  if (!inputPath) return;

  try {
    await createPath(rootPath, inputPath);

    // // Now, open each file after creation (or if already exists)
    // for (const { path } of inputPath) {
    //   await openFile(path);
    // }
  } catch (err) {
    vscode.window.showErrorMessage("❌ Error: " + err.message);
  }
};
