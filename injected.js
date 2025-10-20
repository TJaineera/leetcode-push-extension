
(function() {
  function getMonaco() {
    return window.monaco && window.monaco.editor && window.monaco.editor.getModels ? window.monaco : null;
  }
  function readCode() {
    try {
      const monaco = getMonaco();
      if (monaco) {
        const model = monaco.editor.getModels()[0];
        if (model) {
          const code = model.getValue();
          const lang = model.getLanguageId();
          return { code, lang };
        }
      }
      const ta = document.querySelector("textarea, pre code");
      if (ta) return { code: ta.value || ta.textContent || "", lang: "text" };
    } catch (e) { console.warn("LC readCode error", e); }
    return { code: "", lang: "text" };
  }
  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if (event.data?.type === "LC_GRAB_CODE") {
      const { code, lang } = readCode();
      window.postMessage({ type: "LC_CODE_RESULT", code, lang }, "*");
    }
  });
})();
