const vscode = require("vscode");
const createFileOrDir = require("./src/commands/createFileOrDir");

function activate(context) {
  const disposable = vscode.commands.registerCommand(
    "quickpath.createFileOrDir",
    createFileOrDir
  );
  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };
