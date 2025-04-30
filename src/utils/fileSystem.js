const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const { customMessage } = require("./customMessage.js");

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
          customMessage("created", true, fullPath);
        } else {
          customMessage("alreadyExists", true, fullPath);
        }
        return resolve();
      }

      if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, "");
        customMessage("created", false, fullPath);
      } else {
        customMessage("alreadyExists", false, fullPath);
      }

      resolve(fullPath);
    } catch (err) {
      customMessage("error", false, fullPath);
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
 * @param {string} rootPath
 * @param {{ path: string; isDir: boolean; }[]} arr
 */
const createPath = (rootPath, arr) => {
  try {
    arr.forEach(({ path: relativePath, isDir }) => {
      const fullPath = path.join(rootPath, relativePath);
      console.log(`Processing: ${fullPath} | isDir: ${isDir}`);

      if (!fs.existsSync(fullPath)) {
        if (isDir) {
          fs.mkdirSync(fullPath, { recursive: true });
          customMessage("created", true, fullPath);
        } else {
          const dir = path.dirname(fullPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.writeFileSync(fullPath, "");
          customMessage("created", false, fullPath);
        }
      } else {
        customMessage("alreadyExists", isDir, fullPath);
      }
    });

    return true;
  } catch (error) {
    customMessage("error", false, rootPath);
    throw error;
  }
};

/**
 * Delete file or folder
 * @param {string} targetPath
 * @param {boolean} isDir
 */
function deletePath(targetPath, isDir) {
  try {
    if (!fs.existsSync(targetPath)) {
      customMessage("notExist", isDir, targetPath);
      return;
    }

    if (isDir) {
      fs.rmSync(targetPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(targetPath);
    }

    customMessage("deleted", isDir, targetPath);
  } catch (error) {
    customMessage("error", isDir, targetPath);
    throw error;
  }
}

/**
 * Rename a file or folder
 * @param {string} oldPath
 * @param {string} newName
 * @param {boolean} isDir
 */
function renamePath(oldPath, newName, isDir) {
  try {
    if (!fs.existsSync(oldPath)) {
      customMessage("notExist", isDir, oldPath);
      return;
    }

    const newPath = path.join(path.dirname(oldPath), newName);
    fs.renameSync(oldPath, newPath);

    customMessage("renamed", isDir, newPath);
    return newPath;
  } catch (error) {
    customMessage("error", isDir, oldPath);
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
