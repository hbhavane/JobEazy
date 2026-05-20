(() => {
  const root = (globalThis.JobEazy = globalThis.JobEazy || {});

  const text = (selector) => root.clean(document.querySelector(selector)?.textContent);

  root.extractLinkedIn = () => ({
    title: text(".top-card-layout__title") || text(".job-details-jobs-unified-top-card__job-title"),
    company: text(".topcard__org-name-link") || text(".job-details-jobs-unified-top-card__company-name"),
    location: text(".topcard__flavor--bullet") || text(".job-details-jobs-unified-top-card__primary-description")
  });

  root.extractGreenhouse = () => ({
    title: text(".app-title") || text("h1"),
    company: text("#header .company-name") || root.clean(document.title.split("-")[0]),
    location: text(".location") || text("#header .location")
  });

  root.extractLever = () => ({
    title: text(".posting-headline h2") || text("h2"),
    company: text(".main-header-logo img[alt]") || root.clean(document.title.split("-")[0]),
    location: text(".posting-categories .sort-by-location") || text(".location")
  });
})();
