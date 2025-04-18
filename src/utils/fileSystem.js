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

/**
 * Delete file or folder based on path and isDir flag
 * @param {string} targetPath - The full path to delete
 * @param {boolean} isDir - Whether the target is a directory
 */
function deletePath(targetPath, isDir) {
  try {
    if (!fs.existsSync(targetPath)) {
      vscode.window.showWarningMessage(`⚠️ Path does not exist: ${targetPath}`);
      return;
    }

    if (isDir) {
      fs.rmSync(targetPath, { recursive: true, force: true });
      vscode.window.showInformationMessage(`🗑️ Folder deleted: ${targetPath}`);
    } else {
      fs.unlinkSync(targetPath);
      vscode.window.showInformationMessage(`🗑️ File deleted: ${targetPath}`);
    }
  } catch (error) {
    vscode.window.showErrorMessage(`❌ Failed to delete: ${error.message}`);
    throw error;
  }
}

/**
 * Rename a file or folder
 * @param {string} oldPath - The current full path of the file/folder
 * @param {string} newName - The new name (not full path, just name)
 * @param {boolean} isDir - Whether it's a directory or not
 */
function renamePath(oldPath, newName, isDir) {
  try {
    if (!fs.existsSync(oldPath)) {
      vscode.window.showWarningMessage(`⚠️ Path does not exist: ${oldPath}`);
      return;
    }

    const newPath = path.join(path.dirname(oldPath), newName);

    fs.renameSync(oldPath, newPath);

    vscode.window.showInformationMessage(
      `${isDir ? "📁 Folder" : "📄 File"} renamed to: ${newName}`
    );

    return newPath;
  } catch (error) {
    vscode.window.showErrorMessage(`❌ Failed to rename: ${error.message}`);
    throw error;
  }
}
module.exports = {
  createFullPath,
  createPath,
  openFile,
  deletePath,
  renamePath,
};
