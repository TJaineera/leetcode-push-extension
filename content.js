
(function() {
  const s = document.createElement("script");
  s.src = chrome.runtime.getURL("injected.js");
  (document.head || document.documentElement).appendChild(s);

  function addButton() {
    if (document.getElementById("lc-gh-push-btn")) return;
    const btn = document.createElement("button");
    btn.id = "lc-gh-push-btn";
    btn.textContent = "Push to GitHub";
    Object.assign(btn.style, {
      position: "fixed",
      right: "16px",
      bottom: "16px",
      zIndex: 99999,
      padding: "10px 14px",
      borderRadius: "8px",
      border: "none",
      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
      cursor: "pointer",
      fontWeight: 600
    });
    btn.addEventListener("click", () => {
      window.postMessage({ type: "LC_GRAB_CODE" }, "*");
    });
    document.body.appendChild(btn);
  }

  function getTitleAndSlug() {
    const url = location.href;
    const m = url.match(/leetcode\.com\/problems\/([^\/#?]+)/i);
    const slug = m ? m[1] : "unknown-problem";
    let title = document.querySelector('[data-cy="question-title"]')?.textContent?.trim();
    if (!title) title = document.querySelector('h1')?.textContent?.trim() || slug;
    return { title, slug, url };
  }

  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if (event.data?.type === "LC_CODE_RESULT") {
      const { code, lang } = event.data;
      const meta = getTitleAndSlug();
      chrome.runtime.sendMessage({
        type: "pushSolution",
        code,
        lang,
        title: meta.title,
        slug: meta.slug,
        url: meta.url
      }, (resp) => {
        if (resp?.ok) alert(`✅ Pushed to GitHub: ${resp.path}`);
        else alert(`❌ Push failed: ${resp?.error || "Unknown error"}`);
      });
    }
  });

  addButton();
  const obs = new MutationObserver(() => addButton());
  obs.observe(document.documentElement, { childList: true, subtree: true });
})();
