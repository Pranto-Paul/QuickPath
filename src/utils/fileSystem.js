const fs = require("fs");
const path = require("path");
const vscode = require("vscode");

function createFullPath(root, input) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(root, input);
    const dir = path.dirname(fullPath);

    try {
      fs.mkdirSync(dir, { recursive: true });

      const isDir = path.extname(fullPath) === "";
      if (isDir) {
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath);
          vscode.window.showInformationMessage("📁 Folder created.");
        } else {
          vscode.window.showInformationMessage("📁 Folder already exists.");
        }
        return resolve(null); // Do not open folders
      }

      if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, "");
        vscode.window.showInformationMessage(`✅ Created: ${input}`);
      } else {
        vscode.window.showInformationMessage(`📄 Opened: ${input}`);
      }

      resolve(fullPath);
    } catch (err) {
      reject(err);
    }
  });
}

async function openFile(fullPath) {
  const doc = await vscode.workspace.openTextDocument(fullPath);
  await vscode.window.showTextDocument(doc);
}

module.exports = {
  createFullPath,
  openFile,
};
