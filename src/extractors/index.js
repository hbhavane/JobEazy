(() => {
  const root = (globalThis.JobEazy = globalThis.JobEazy || {});

  const pickExtractor = (hostname) => {
    if (hostname.includes("linkedin.com")) return root.extractLinkedIn;
    if (hostname.includes("greenhouse.io")) return root.extractGreenhouse;
    if (hostname.includes("lever.co")) return root.extractLever;
    return null;
  };

  root.extractJob = () => {
    const now = root.now();
    const source = root.hostname();
    const url = root.url();

    const fromJsonLd = root.extractFromJsonLd?.();
    const siteExtractor = pickExtractor(source);
    const fromSite = siteExtractor ? siteExtractor() : null;
    const fromGeneric = root.extractGeneric?.() || {};

    const data = {
      ...(fromGeneric || {}),
      ...(fromSite || {}),
      ...(fromJsonLd || {}),
      url,
      source,
      createdAt: now,
      updatedAt: now,
      status: root.DEFAULT_STATUS,
      notes: ""
    };

    return root.buildJob(data);
  };
})();
