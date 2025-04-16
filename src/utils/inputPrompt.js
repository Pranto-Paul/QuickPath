const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

/**
 * Show path input with suggestion support
 * @param {string} rootPath
 */
async function showPathInput(rootPath) {
  let currentPath = "";

  while (true) {
    const dirPath = path.join(rootPath, currentPath);
    let suggestions = [];

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
      { label: "🔗 Enter Custom Path", alwaysShow: true },
    ];
    if (rootPath !== dirPath)
      pick.push({ label: "🔙 Go Back", alwaysShow: true });
    const userChoice = await vscode.window.showQuickPick(pick, {
      placeHolder: "Navigate folders with Tab or enter full path",
      matchOnDescription: true,
    });

    if (!userChoice) return;

    if (userChoice.label === "🔗 Enter Custom Path") {
      const customInput = await vscode.window.showInputBox({
        prompt: "Enter file/folder path",
        placeHolder: "e.g. src/components/Button/index.tsx",
      });
      return path.join(currentPath, customInput || "");
    }

    if (userChoice.label === "🔙 Go Back") {
      currentPath = path.dirname(currentPath);
      console.log(currentPath);
      continue;
    }

    currentPath = path.join(currentPath, userChoice.label);
    if (!userChoice.label.endsWith("/")) {
      // it's a file
      return currentPath;
    }
  }
}

module.exports = {
  showPathInput,
};
