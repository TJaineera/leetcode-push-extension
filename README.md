#  LeetCode → GitHub Pusher (Chrome Extension)

A lightweight Chrome Extension that lets you **push accepted LeetCode solutions directly to your GitHub repository** with one click. No copy-paste, no manual commits.

---

##  Features
-  **Auto-detects** LeetCode problem title, slug, and language  
-  **Pushes your code** directly to your chosen GitHub repository via the GitHub API  
-  Customizable:
  - Base path (e.g., `/leetcode`)
  - Commit message template
  - File name template
-  Minimal UI — a floating **“Push to GitHub”** button appears on problem pages  
-  Secure: stores your GitHub token locally in Chrome’s `sync` storage (never sent elsewhere)

---

##  Installation (Developer Mode)
1. Download the latest release ZIP from the repo (or clone it).
2. Extract the folder (you should see `manifest.json`, `background.js`, etc.).
3. Open Chrome → go to **[chrome://extensions](chrome://extensions)**.
4. Toggle **Developer mode** (top-right).
5. Click **Load unpacked** → select the extracted folder.  
6. The extension should now appear in your toolbar.

---

##  Setup
1. Create a **fine-grained GitHub Personal Access Token (PAT)**  
   with **`Contents: Read and Write`** access to your target repository.  
   - Go to [https://github.com/settings/tokens?type=beta](https://github.com/settings/tokens?type=beta)
   - Resource owner: *Your account*
   - Repository access: *Select your repo (e.g. `leetcode-solutions`)*
   - Repository permissions → **Contents: Read & Write**

2. In Chrome, click the extension icon → **Options**:
   - Paste your **GitHub Token**
   - Enter your **Owner**, **Repo name**, and **Branch** (`main`)
   - Adjust **Base Path**, **Commit Template**, or **File Name Template** if needed
   - Click **Save**

---

##  Usage
1. Open any LeetCode problem (e.g. [Two Sum](https://leetcode.com/problems/two-sum/)).
2. Write or view your solution in the editor.
3. Click the **“Push to GitHub”** button (bottom-right corner).  
4. That’s it — your solution appears in your repo.

Notes

This extension uses the GitHub REST API (Contents endpoint).
For distribution or multi-user support, use OAuth via chrome.identity instead of a PAT.

Works on https://leetcode.com/

If your token doesn’t push:

Check that the repo is selected in your fine-grained PAT.

Ensure Contents: Read/Write permission.

Verify your branch name (main vs master).

| Layer                         | Description                            | Tools                |
| ----------------------------- | -------------------------------------- | -------------------- |
| **UI**                        | Popup + Floating Button                | HTML / CSS / JS      |
| **Background Service Worker** | Handles GitHub API, commits, tokens    | Chrome Extension MV3 |
| **Content Script**            | Grabs problem details & injects button | JavaScript           |
| **Storage**                   | Syncs token & config                   | Chrome Storage API   |

Local Development
# Clone the repo
git clone https://github.com/TJaineera/leetcode-push-extension.git
cd leetcode-push-extension

Make changes → Reload in Chrome (chrome://extensions)

