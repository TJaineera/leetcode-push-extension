
// background.js (service worker, MV3) — v0.1.1
async function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      {
        githubToken: "",
        owner: "",
        repo: "",
        branch: "main",
        basePath: "leetcode",
        commitTemplate: "Add {title} ({slug}) solution in {lang}",
        fileNameTemplate: "{slug}.{ext}"
      },
      resolve
    );
  });
}

const LANG_EXT = {
  "python": "py",
  "python3": "py",
  "cpp": "cpp",
  "c": "c",
  "java": "java",
  "javascript": "js",
  "typescript": "ts",
  "go": "go",
  "csharp": "cs",
  "ruby": "rb",
  "swift": "swift",
  "kotlin": "kt",
  "rust": "rs",
  "scala": "scala",
  "php": "php"
};

function sanitizePath(p) {
  return p.replace(/[^a-zA-Z0-9/_\-.]/g, "_").replace(/\/+/g, "/");
}

async function githubRequest(method, url, token, bodyObj) {
  const headers = {
    "Accept": "application/vnd.github+json",
    "Authorization": `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json"
  };
  const res = await fetch(url, {
    method,
    headers,
    body: bodyObj ? JSON.stringify(bodyObj) : undefined
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API ${method} ${url} failed: ${res.status} ${text}`);
  }
  return res.json();
}

async function createOrUpdateFile({owner, repo, branch, path, content, message, token}) {
  // IMPORTANT: Do NOT encode slashes in the 'contents' path; use encodeURI so / stays as path separators.
  const encodedPath = encodeURI(path);
  const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`;
  let sha = null;
  try {
    const meta = await githubRequest("GET", getUrl, token);
    sha = meta.sha;
  } catch (e) {
    // 404 means new file; other errors propagate
    if (!/404/.test(String(e))) {
      throw e;
    }
  }

  const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodedPath}`;
  const body = {
    message,
    content: btoa(unescape(encodeURIComponent(content))), // base64
    branch
  };
  if (sha) body.sha = sha;
  return githubRequest("PUT", putUrl, token, body);
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === "pushSolution") {
    (async () => {
      try {
        const settings = await getSettings();
        const token = settings.githubToken?.trim();
        if (!token) throw new Error("Missing GitHub token. Add one in Options.");

        const owner = settings.owner?.trim();
        const repo  = settings.repo?.trim();
        const branch = settings.branch?.trim() || "main";
        const basePath = settings.basePath?.trim() || "leetcode";
        const commitTemplate = settings.commitTemplate || "Add {title} solution";
        const fileNameTemplate = settings.fileNameTemplate || "{slug}.{ext}";

        if (!owner || !repo) throw new Error("Missing repo info (owner/repo) in Options.");

        const langKey = (msg.lang || "").toLowerCase().trim();
        const ext = LANG_EXT[langKey] || (langKey || "txt").replace(/[^a-z0-9]/g,"");

        const folder = `${basePath}/${msg.slug}`;
        const fileName = fileNameTemplate
            .replaceAll("{slug}", msg.slug)
            .replaceAll("{title}", msg.title)
            .replaceAll("{lang}", langKey)
            .replaceAll("{ext}", ext);

        const relPath = sanitizePath(`${folder}/${fileName}`);

        const header = `/**
 * Title: ${msg.title}
 * Slug: ${msg.slug}
 * URL: ${msg.url}
 * Language: ${msg.lang}
 * Submitted: ${new Date().toISOString()}
 */\n\n`;

        const content = header + (msg.code || "");
        const message = commitTemplate
          .replaceAll("{slug}", msg.slug)
          .replaceAll("{title}", msg.title)
          .replaceAll("{lang}", langKey);

        const result = await createOrUpdateFile({
          owner, repo, branch, path: relPath, content, message, token
        });

        sendResponse({ ok: true, result, path: relPath });
      } catch (err) {
        sendResponse({ ok: false, error: String(err) });
      }
    })();
    return true;
  }
});
