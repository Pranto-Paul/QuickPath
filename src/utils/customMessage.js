const vscode = require("vscode");
const path = require("path");

/**
 * @param {string} status - Message type
 * @param {boolean} isDir - Is directory
 * @param {string} fullPath - Absolute path to be converted
 */
function customMessage(status, isDir, fullPath) {
  const workspaceFolder =
    vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath || process.cwd();
  const relativePath = path.relative(workspaceFolder, fullPath);

  const messages = {
    created: isDir ? "✅ Folder created: " : "✅ File created: ",
    alreadyExists: isDir
      ? "📁 Folder already exists: "
      : "📄 File already exists: ",
    deleted: isDir ? "🗑️ Folder deleted: " : "🗑️ File deleted: ",
    renamed: isDir ? "🔄 Folder renamed: " : "🔄 File renamed: ",
    notExist: "⚠️ Path does not exist: ",
    error: "⚠️ Something went wrong: ",
  };

  const message = messages[status] + relativePath;

  // Decide message type
  if (status === "error") {
    vscode.window.showErrorMessage(message);
  } else if (status === "notExist") {
    vscode.window.showWarningMessage(message);
  } else {
    vscode.window.showInformationMessage(message);
  }

  return message; // Optional, in case you still want to log it
}

module.exports = {
  customMessage,
};
