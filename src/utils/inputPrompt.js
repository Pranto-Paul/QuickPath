const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const { parsePathString } = require("./parser.js");
const { deletePath, renamePath } = require("./fileSystem.js");
/**
 * Show path input with suggestion support
 * @param {string} rootPath
 */
async function showPathInput(rootPath) {
  let currentPath = "";

  while (true) {
    const dirPath = path.join(rootPath, currentPath); //provide full path
    let suggestions = []; // arr which will store all files/folder from the dir

    try {
      const files = fs.readdirSync(dirPath, { withFileTypes: true });
      suggestions = files.map((file) => {
        return {
          label: file.name + (file.isDirectory() ? "/" : ""),
          description: file.isDirectory() ? "📂folder" : "📝file",
        };
      });
    } catch {
      // no suggestions if path is invalid
    }

    const pick = [
      ...suggestions,
      {
        kind: vscode.QuickPickItemKind.Separator,
        label: "More Options",
      },
      {
        label: "🔗 Enter Custom Path",
        alwaysShow: true,
        description: "use advanced query for nested structure!",
      },
    ];

    //push the Go Back option in the pick array if it is not the root dir
    if (rootPath !== dirPath)
      pick.push({ label: "🔙 Go Back", alwaysShow: true });

    if (currentPath) {
      pick.push({
        label: `⚔️ Delete ${path.join(rootPath, currentPath)}`,
        alwaysShow: true,
      });
      pick.push({
        label: `✒️ Rename ${path.join(rootPath, currentPath)}`,
        alwaysShow: true,
      });
    }

    const userChoice = await vscode.window.showQuickPick(pick, {
      placeHolder: "Navigate files/folders with Tab or enter full path",
      matchOnDescription: true,
    });

    if (!userChoice) return;

    if (userChoice.label === "🔗 Enter Custom Path") {
      const customInput = await vscode.window.showInputBox({
        prompt: "Enter file/folder path",
        placeHolder:
          "e.g. src components pages Home.jsx + Contact.jsx .. utils Button.jsx & InputBox.jsx",
      });
      return parsePathString(path.join(currentPath, customInput));
    }

    if (userChoice.label === "🔙 Go Back") {
      currentPath = path.dirname(currentPath);
      continue;
    }
    if (userChoice.label === `⚔️ Delete ${path.join(rootPath, currentPath)}`) {
      const is_dir = path.join(rootPath, currentPath).endsWith("\\");
      deletePath(path.join(rootPath, currentPath), is_dir);
      try {
        currentPath = path.dirname(currentPath);
        continue;
      } catch (error) {
        break;
      }
    }
    if (userChoice.label === `✒️ Rename ${path.join(rootPath, currentPath)}`) {
      const is_dir = path.join(rootPath, currentPath).endsWith("\\");
      const customInput = await vscode.window.showInputBox({
        prompt: "Enter new file/folder name",
        placeHolder: "rename.txt",
      });
      renamePath(path.join(rootPath, currentPath), customInput, is_dir);

      try {
        currentPath = path.dirname(currentPath);
        continue;
      } catch (error) {
        break;
      }
    }

    currentPath = path.join(currentPath, userChoice.label);

    // if (!userChoice.label.endsWith("/")) {
    //   // it's a file
    //   return [{ path: currentPath, isDir: false }];
    // }
  }
}

module.exports = {
  showPathInput,
};
