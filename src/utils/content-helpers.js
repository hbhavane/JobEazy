(() => {
  const root = (globalThis.JobEazy = globalThis.JobEazy || {});

  root.DEFAULT_STATUS = "Saved";
  root.STATUSES = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"];

  root.now = () => new Date().toISOString();

  root.createId = () => {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  };

  root.clean = (value) =>
    String(value || "")
      .replace(/\s+/g, " ")
      .trim();

  root.hostname = () => globalThis.location?.hostname || "";
  root.url = () => globalThis.location?.href || "";

  root.buildJob = (partial = {}) => {
    const createdAt = partial.createdAt || root.now();
    return {
      id: partial.id || root.createId(),
      title: root.clean(partial.title),
      company: root.clean(partial.company),
      location: root.clean(partial.location),
      url: root.clean(partial.url) || root.url(),
      source: root.clean(partial.source) || root.hostname(),
      status: root.STATUSES.includes(partial.status) ? partial.status : root.DEFAULT_STATUS,
      notes: String(partial.notes || ""),
      createdAt,
      updatedAt: partial.updatedAt || createdAt
    };
  };
})();
