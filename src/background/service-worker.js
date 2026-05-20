chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["jobs"], (result) => {
    if (!Array.isArray(result.jobs)) {
      chrome.storage.local.set({ jobs: [] });
    }
  });
});
