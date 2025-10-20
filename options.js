
function save() {
  const data = {
    githubToken: document.getElementById("githubToken").value,
    owner: document.getElementById("owner").value,
    repo: document.getElementById("repo").value,
    branch: document.getElementById("branch").value,
    basePath: document.getElementById("basePath").value,
    commitTemplate: document.getElementById("commitTemplate").value,
    fileNameTemplate: document.getElementById("fileNameTemplate").value
  };
  chrome.storage.sync.set(data, () => {
    const s = document.getElementById("status");
    s.textContent = "Saved!";
    setTimeout(() => s.textContent = "", 1500);
  });
}
function restore() {
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
    (items) => {
      for (const [k, v] of Object.entries(items)) {
        const el = document.getElementById(k);
        if (el) el.value = v || "";
      }
    }
  );
}
document.getElementById("save").addEventListener("click", save);
document.addEventListener("DOMContentLoaded", restore);
