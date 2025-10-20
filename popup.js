
document.getElementById("push").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !/^https:\/\/leetcode\.com/.test(tab.url)) {
    document.getElementById("status").textContent = "Open a LeetCode problem page first.";
    return;
  }
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.postMessage({ type: "LC_GRAB_CODE" }, "*")
  });
  document.getElementById("status").textContent = "Grabbing code and pushing...";
});
