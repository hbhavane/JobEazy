(() => {
  const root = (globalThis.JobEazy = globalThis.JobEazy || {});

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== "JOBEAZY_EXTRACT") return;

    try {
      sendResponse({ ok: true, job: root.extractJob() });
    } catch {
      sendResponse({ ok: true, job: root.buildJob({}) });
    }

    return true;
  });
})();
