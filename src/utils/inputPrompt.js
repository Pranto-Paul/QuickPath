const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const { parsePathString } = require("./parser.js");
const { deletePath, renamePath, create } = require("./fileSystem.js");

/**
 * Show path input with suggestion support
 * @param {string} rootPath
 */
async function showPathInput(rootPath) {
  let currentPath = "";

  while (true) {
    //provide path of navigation
    const navigatedPath = path.join(rootPath, currentPath);
    // arr, which will store all files/folder from the navigated path
    let suggestions = [];

    try {
      const files = fs.readdirSync(navigatedPath, { withFileTypes: true });
      suggestions = files.map((file) => {
        return {
          label: file.name + (file.isDirectory() ? "/" : ""),
          description: file.isDirectory() ? "📂folder" : "📝file",
        };
      });
    } catch {
      // no suggestions if path is invalid
    }

    // let user choose the path
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
    if (rootPath !== navigatedPath) {
      pick.push({ label: "⬅️ Back", alwaysShow: true });
    }
    if (currentPath) {
      pick.push({
        label: `✏️ Rename ${path.join(currentPath).replace(/\\/g, "/")}`,
        alwaysShow: true,
      });
      pick.push({
        label: `🔥 Delete ${path.join(currentPath).replace(/\\/g, "/")}`,
        alwaysShow: true,
      });
    }

    const userChoice = await vscode.window.showQuickPick(pick, {
      placeHolder: "Navigate files/folders with one click",
      matchOnDescription: true,
    });

    if (!userChoice) return;

    if (userChoice.label === "🔗 Enter Custom Path") {
      const customInput = await vscode.window.showInputBox({
        prompt: "Enter file/folder path",
        placeHolder:
          "e.g. src components pages Home.jsx + Contact.jsx .. utils Button.jsx & InputBox.jsx",
      });
      create(rootPath, parsePathString(path.join(currentPath, customInput)));
    }

    if (userChoice.label === "⬅️ Back") {
      currentPath = path.dirname(currentPath);
      if (currentPath === ".") currentPath = ""; // if we are at the root dir, set it to empty string
      continue;
    }

    if (
      userChoice.label ===
      `🔥 Delete ${path.join(currentPath).replace(/\\/g, "/")}`
    ) {
      const is_dir = path.extname(navigatedPath) === "";
      deletePath(path.join(rootPath, currentPath), is_dir);
      try {
        currentPath = path.dirname(currentPath);
        continue;
      } catch (error) {
        break;
      }
    }
    if (
      userChoice.label ===
      `✏️ Rename ${path.join(currentPath).replace(/\\/g, "/")}`
    ) {
      const is_dir = path.extname(navigatedPath) === "";
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
