(() => {
  const root = (globalThis.JobEazy = globalThis.JobEazy || {});

  const first = (...values) => values.find((value) => root.clean(value));

  const parse = (payload) => {
    if (Array.isArray(payload)) {
      for (const item of payload) {
        const job = parse(item);
        if (job) return job;
      }
      return null;
    }

    if (!payload || typeof payload !== "object") return null;

    if (Array.isArray(payload["@graph"])) {
      const job = parse(payload["@graph"]);
      if (job) return job;
    }

    const type = payload["@type"];
    const isJobPosting = Array.isArray(type) ? type.includes("JobPosting") : type === "JobPosting";
    if (!isJobPosting) return null;

    const locationNode = payload.jobLocation;
    const location = Array.isArray(locationNode)
      ? first(...locationNode.map((item) => item?.address?.addressLocality || item?.name))
      : locationNode?.address?.addressLocality || locationNode?.name;

    return {
      title: payload.title,
      company: payload.hiringOrganization?.name,
      location,
      employmentType: payload.employmentType
    };
  };

  root.extractFromJsonLd = () => {
    try {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (const script of scripts) {
        try {
          const parsed = JSON.parse(script.textContent || "{}");
          const job = parse(parsed);
          if (job) return job;
        } catch {
          continue;
        }
      }
      return null;
    } catch {
      return null;
    }
  };
})();
