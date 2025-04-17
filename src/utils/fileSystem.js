const fs = require("fs");
const path = require("path");
const vscode = require("vscode");

/**
 * @param {string} root
 * @param {string} input
 */
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

/**
 * @param {vscode.Uri} fullPath
 */
async function openFile(fullPath) {
  const doc = await vscode.workspace.openTextDocument(fullPath);
  await vscode.window.showTextDocument(doc);
}
/**
 * Create folders or files based on the provided path info
 * @param {string} rootPath - The base directory where paths will be created
 * @param {{ path: string; isDir: boolean; }[]} arr - List of paths and their types
 */
const createPath = (rootPath, arr) => {
  try {
    arr.forEach(({ path: relativePath, isDir }) => {
      const fullPath = path.join(rootPath, relativePath);
      console.log(`Processing: ${fullPath} | isDir: ${isDir}`);

      if (!fs.existsSync(fullPath)) {
        if (isDir) {
          fs.mkdirSync(fullPath, { recursive: true });
          vscode.window.showInformationMessage(
            `✅ Folder created: ${relativePath}`
          );
        } else {
          const dir = path.dirname(fullPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.writeFileSync(fullPath, "");
          vscode.window.showInformationMessage(
            `✅ File created: ${relativePath}`
          );
        }
      } else {
        vscode.window.showInformationMessage(
          isDir
            ? `📁 Folder already exists: ${relativePath}`
            : `📄 File already exists: ${relativePath}`
        );
      }
    });

    return true;
  } catch (error) {
    vscode.window.showErrorMessage(
      `❌ Error while creating paths: ${error.message}`
    );
    throw error;
  }
};
module.exports = {
  createFullPath,
  createPath,
  openFile,
};
