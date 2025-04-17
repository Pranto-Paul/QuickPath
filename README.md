# 🚀 QuickPath

## **Create FILES and FOLDER _lightning-fast_ ⚡ `WITHOUT EVER TOUCHING YOUR MOUSE 🔥`**

[Watch the Demo Video](./demo.mp4)

> **QuickPath** helps you stay in the **flow**. No more right-clicks, navigating file trees, or breaking focus. Just open the command palette, type a path, and BOOM🔥 — structure created.

## ✨ Features at a Glance

⚡️ Instantly **create files and folders** from the command palette  
🪜 Supports **deeply nested structures** — like `src/components/Nav/Item.jsx`  
🎯 Execute **advanced path queries** — create multiple files and folders in one go  
🚀 Blazingly fast and **seamless integration** with your workflow  
🎹 Built for **keyboard-first developers** — keep your hands on the keys  
🧩 **Zero setup required** — no config, no hassle, just install and go

## ⚡ How It Works (Example)

### Just follow these steps:

1. Press:

   - 🪟 **Windows/Linux**: `Ctrl + Alt + N`
   - 🍎 **macOS**: `Cmd + Option + N`

2. Run the command:  
   🔍 `QuickPath: Create File or Folder`

3. Type your desired path:  
   ✍️ `src components Header Header.jsx`

4. Hit `Enter` — that's it! Your structure is ready! 🎉

## 📦 Installation

1. Open **Visual Studio Code**.
2. Navigate to the **Extensions** view:
   - Shortcut: `Ctrl + Shift + X` (Windows/Linux) or `Cmd + Shift + X` (macOS)
3. Search for **`QuickPath`**.
4. Click **Install** on the extension by [Pranto-Paul](https://github.com/Pranto-Paul).

🔗 Or install directly from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=pranto-paul.quickpath) _(replace with real link if available)_.

## 🧠 Why Use QuickPath?

> **"I just want to create `src/components/Auth/Login.jsx` — why so many clicks?"**

QuickPath eliminates the **friction**. Whether you're starting a new project or adding new components, you'll **save time, stay focused**, and feel like a productivity ninja. 🥷

## 🚀 Advanced Query Feature

The **Advanced Query** feature allows you to create multiple files or folders in one go with powerful syntax.

### 📁 Folder Creation with Spaces:

- Use **space** to create nested folders. Example:
  - `src bro a.txt` → creates `src/bro/a.txt`

### ✨ Creating Multiple Files/Folders (Siblings):

- Use **+** or **&** to create multiple sibling files/folders.
- Make sure to **add space** before and after the operators `+` and `&`.
  - Example:
    - `src bro a.txt + b.html & c.css`
    - Creates:
      - `src/bro/a.txt`
      - `src/bro/b.html`
      - `src/bro/c.css`
- **Note**: **+** and **&** can be used interchangeably.

### 🔙 Navigating Backwards:

- Use **..** (with spaces before and after) to navigate up a directory.
  - Example: `src bro .. a.txt` → creates `a.txt` in the parent directory of `bro`.

### 💡 Best Practices for Avoiding Mistakes:

- **Create a full branch** first, then add more branches. Example:
  - `/my-node-backend-project` → root directory
    - `/config` → child directory
    - `/controllers` → another child directory
    - `config db.js & server.js .. controllers userController.js + authController.js`

### ⚡️ Quick Tips:

- **Don't use**: `src bro a.txt+b.html&c.css` (incorrect format).
- Always use **spaces** before and after `+`, `&`, and `..`.

With these simple rules, the **Advanced Query** feature of _QuickPath_ makes creating files and folders a breeze. Happy coding! 😎

## 🔧 Extension Settings

This extension works out-of-the-box.  
**No additional configuration required.** 🎉

## 🐞 Known Issues

Currently, there are no known issues.  
If you spot one, [report it here](https://github.com/Pranto-Paul/QuickPath/issues).

## 🗒 Release Notes

### 🆕 v2.0.0

- 🚀 Initial launch of **QuickPath**
- 🔥 Supports files and nested folder creation
- ❤️ Get realtime suggestion
- 🎯 Integrated with Command Palette
- 💡 Keyboard-only interaction

## 🤝 Contributing

Have ideas to improve QuickPath?  
You're welcome to contribute!

1. Fork the repository 📂
2. Create a feature branch 🌿
3. Submit a pull request 🚀

🔗 [Contribute on GitHub](https://github.com/Pranto-Paul/QuickPath)

## 📄 License

This project is licensed under the [MIT License](LICENSE).  
Made with ❤️ by [Pranto Paul](https://github.com/Pranto-Paul)

## 📚 Useful Links

- [🔗 GitHub Repository](https://github.com/Pranto-Paul/QuickPath)
- [🔗 VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=pranto-paul.quickpath)
- [🐛 Report Issues](https://github.com/Pranto-Paul/QuickPath/issues)
- [✨ Other Projects by Pranto](https://github.com/Pranto-Paul?tab=repositories)

---

> **Don’t break your flow — let QuickPath do the clicking for you.**
