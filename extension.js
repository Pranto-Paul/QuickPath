const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

//algorithm
//------------------------------------------------------------
// ctr + alt + N to open
// write the path -> path will be created from the root dir
// hit enter/return to create the file/folder and open the file
// If already exists then open the file
// If it was a folder then return

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
        fs.mkdirSync(dir, { recursive: true });

        const isDir = path.extname(fullPath) === "";

        if (isDir) {
          try {
            const fileExists = fs.existsSync(fullPath);
            if (fileExists)
              vscode.window.showWarningMessage(
                `📂 File already exists: ${input}`
              );
            fs.mkdirSync(fullPath);
            vscode.window.showInformationMessage("📁 Folder created.");
          } catch (err) {
            vscode.window.showErrorMessage("❌ Error: " + err.message);
          }
          return;
        }

        const fileExists = fs.existsSync(fullPath);

        if (!fileExists) {
          fs.writeFileSync(fullPath, "");
          vscode.window.showInformationMessage(`✅ Created: ${input}`);
        } else {
          vscode.window.showInformationMessage(
            `📂 File already exists: ${input}`
          );
        }

        // Open the file in editor
        const doc = await vscode.workspace.openTextDocument(fullPath);
        await vscode.window.showTextDocument(doc);
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
