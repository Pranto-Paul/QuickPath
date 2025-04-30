const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const { customMessage } = require("./customMessage.js");

/**
 * Determines if a path is a directory based on extension
 * @param {string} filePath - The path to check
 * @returns {boolean} - True if directory, false if file
 */
function isDirectory(filePath) {
  return path.extname(filePath) === "";
}

/**
 * Create a file or folder and return its full path
 * @param {string} rootPath - The root directory
 * @param {string} relativePath - Relative path for the file/folder
 * @returns {Promise<string | undefined>} - Full path of created file or undefined for folders
 */
async function createItem(rootPath, relativePath, providedIsDir) {
  const fullPath = path.join(rootPath, relativePath);
  const dir = path.dirname(fullPath);
  const isDir =
    providedIsDir !== undefined ? providedIsDir : isDirectory(fullPath);

  try {
    // Create parent directories if they don't exist
    fs.mkdirSync(dir, { recursive: true });

    if (isDir) {
      // Handle directory creation
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath);
        customMessage("created", true, fullPath);
      } else {
        customMessage("alreadyExists", true, fullPath);
      }
      return;
    } else {
      // Handle file creation
      if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, "");
        customMessage("created", false, fullPath);
      } else {
        customMessage("alreadyExists", false, fullPath);
      }
      return fullPath;
    }
  } catch (err) {
    customMessage("error", isDir, fullPath);
    throw err;
  }
}

/**
 * Create files/folders from a path string or array of paths
 * Open files automatically after creation
 *
 * @param {string} rootPath - Base directory
 * @param {string|string[]|{path: string, isDir?: boolean}[]} paths - Path(s) to create
 * @param {Object} options - Additional options
 * @param {boolean} [options.openAfterCreate=true] - Whether to open files after creation
 * @returns {Promise<string[]>} - Array of created file paths
 */
async function create(rootPath, paths, options = { openAfterCreate: true }) {
  const createdFiles = [];

  try {
    // Normalize input to array format
    let itemsToCreate = [];

    if (typeof paths === "string") {
      // Single path string
      itemsToCreate.push({
        path: paths,
        isDir: isDirectory(paths),
      });
    } else if (Array.isArray(paths)) {
      // Handle array input - properly handle both string arrays and object arrays
      itemsToCreate = paths.map((item) => {
        if (typeof item === "string") {
          return {
            path: item,
            isDir: isDirectory(item),
          };
        }
        return {
          path: item.path,
          isDir: item.isDir !== undefined ? item.isDir : isDirectory(item.path),
        };
      });
    }

    // Process each item
    for (const item of itemsToCreate) {
      console.log(`Processing: ${item.path} | isDir: ${item.isDir}`);
      // Pass the isDir property to createItem
      const fullPath = await createItem(rootPath, item.path, item.isDir);

      // Only add files to the result array
      if (fullPath) {
        createdFiles.push(fullPath);
      }
    }

    // Open the first file if requested and any files were created
    if (options.openAfterCreate && createdFiles.length > 0) {
      await openFile(vscode.Uri.file(createdFiles[0]));
    }

    return createdFiles;
  } catch (error) {
    customMessage("error", false, rootPath);
    throw error;
  }
}

/**
 * @param {vscode.Uri} fullPath
 */
async function openFile(fullPath) {
  const doc = await vscode.workspace.openTextDocument(fullPath);
  await vscode.window.showTextDocument(doc);
}

/**
 * Delete file or folder
 * @param {string} targetPath
 * @param {boolean} [isDir] - Optional, will be auto-detected if not provided
 */
function deletePath(targetPath, isDir = isDirectory(targetPath)) {
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
 * @param {boolean} [isDir] - Optional, will be auto-detected if not provided
 */
function renamePath(oldPath, newName, isDir = isDirectory(oldPath)) {
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
  create,
  openFile,
  deletePath,
  renamePath,
};
