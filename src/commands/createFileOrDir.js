const vscode = require("vscode");
const {
  createFullPath,
  openFile,
  createPath,
} = require("../utils/fileSystem.js");
const { showPathInput } = require("../utils/inputPrompt.js");

/**
 * Command to create a file or directory from user input
 */
module.exports = async function createFileOrDir() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) {
    vscode.window.showErrorMessage(
      "❌ Open a folder/project to use QuickPath."
    );
    return;
  }

  const rootPath = workspaceFolders[0].uri.fsPath;

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
