const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const disposable = vscode.commands.registerCommand(
    "quickpath.createFileOrDir",
    async function () {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage("Open a folder to use QuickPath.");
        return;
      }

      const rootPath = workspaceFolders[0].uri.fsPath;

      const input = await vscode.window.showInputBox({
        prompt: "Enter path like: src/components/Button/index.tsx",
        placeHolder: "e.g. pages/home/index.tsx",
      });

      if (!input) return;

      const fullPath = path.join(rootPath, input);
      const dir = path.dirname(fullPath);

      try {
        // Create folders recursively
        fs.mkdirSync(dir, { recursive: true });

        // Create file if it doesn't exist
        if (!fs.existsSync(fullPath)) {
          fs.writeFileSync(fullPath, "");
          vscode.window.showInformationMessage(`✅ Created: ${input}`);
        } else {
          vscode.window.showWarningMessage("⚠️ File already exists.");
        }
      } catch (err) {
        vscode.window.showErrorMessage("❌ Error: " + err.message);
      }
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
