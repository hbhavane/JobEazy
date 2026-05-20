(() => {
  const root = (globalThis.JobEazy = globalThis.JobEazy || {});

  const content = (selector, attribute = "content") =>
    root.clean(document.querySelector(selector)?.getAttribute(attribute));

  const text = (selector) => root.clean(document.querySelector(selector)?.textContent);

  root.extractGeneric = () => {
    const title =
      text("h1") ||
      content('meta[property="og:title"]') ||
      content('meta[name="twitter:title"]') ||
      root.clean(document.title.replace(/\|.*$/, ""));

    const company =
      content('meta[property="og:site_name"]') ||
      text('[class*="company"]') ||
      text('[data-test*="company"]');

    const location =
      text('[class*="location"]') ||
      text('[data-test*="location"]') ||
      content('meta[name="jobLocation"]');

    return {
      title,
      company,
      location
    };
  };
})();
