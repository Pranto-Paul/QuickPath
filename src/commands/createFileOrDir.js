const vscode = require("vscode");
const { createFullPath, openFile } = require("../utils/fileSystem.js");
const { showPathInput } = require("../utils/inputPrompt.js");

/**
 * Command to create a file or directory from user input
 */
module.exports = async function createFileOrDir() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage("❌ Open a folder to use QuickPath.");
    return;
  }

  const rootPath = workspaceFolders[0].uri.fsPath;

  const inputPath = await showPathInput(rootPath);
  if (!inputPath) return;

  try {
    const fullPath = await createFullPath(rootPath, inputPath);
    if (fullPath) await openFile(fullPath);
  } catch (err) {
    vscode.window.showErrorMessage("❌ Error: " + err.message);
  }
};
