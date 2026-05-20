(() => {
  const root = (globalThis.JobEazy = globalThis.JobEazy || {});

  const matchesHost = (hostname, domain) => hostname === domain || hostname.endsWith(`.${domain}`);

  const pickExtractor = (hostname) => {
    if (matchesHost(hostname, "linkedin.com")) return root.extractLinkedIn;
    if (matchesHost(hostname, "greenhouse.io")) return root.extractGreenhouse;
    if (matchesHost(hostname, "lever.co")) return root.extractLever;
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
