import { STATUSES } from "../utils/constants.js";
import { getJobs, saveJob, updateJob } from "../storage/storage.js";

const form = document.querySelector("#jobForm");
const toast = document.querySelector("#toast");
const openDashboardBtn = document.querySelector("#openDashboard");

const fields = {
  title: document.querySelector("#title"),
  company: document.querySelector("#company"),
  location: document.querySelector("#location"),
  url: document.querySelector("#url"),
  status: document.querySelector("#status"),
  notes: document.querySelector("#notes")
};

let activeId = null;

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 1600);
};

const safeHostname = (value) => {
  try {
    return new URL(value || location.href).hostname;
  } catch {
    return location.hostname;
  }
};

const selectedJob = () => ({
  id: activeId,
  title: fields.title.value,
  company: fields.company.value,
  location: fields.location.value,
  url: fields.url.value,
  source: safeHostname(fields.url.value),
  status: fields.status.value,
  notes: fields.notes.value
});

const hydrate = (job) => {
  if (!job) return;
  activeId = job.id || null;
  fields.title.value = job.title || "";
  fields.company.value = job.company || "";
  fields.location.value = job.location || "";
  fields.url.value = job.url || "";
  fields.status.value = job.status || "Saved";
  fields.notes.value = job.notes || "";
};

const requestExtraction = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return null;

  try {
    const response = await chrome.tabs.sendMessage(tab.id, { type: "JOBEAZY_EXTRACT" });
    return response?.job || null;
  } catch {
    return null;
  }
};

const maybeAutoSave = async () => {
  if (!activeId) return;
  const updated = await updateJob(activeId, selectedJob());
  if (updated) showToast("Updated");
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const { job, duplicate } = await saveJob(selectedJob());
  activeId = job.id;
  showToast(duplicate ? "Already Saved (updated)" : "Saved");
});

fields.status.addEventListener("change", maybeAutoSave);
fields.notes.addEventListener("input", maybeAutoSave);
[fields.title, fields.company, fields.location, fields.url].forEach((element) => {
  element.addEventListener("change", maybeAutoSave);
});

openDashboardBtn.addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("dashboard/dashboard.html") });
});

const init = async () => {
  STATUSES.forEach((status) => {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    fields.status.append(option);
  });

  const extracted = await requestExtraction();
  if (extracted) {
    hydrate(extracted);
    const jobs = await getJobs();
    const existing = jobs.find((job) => job.url === extracted.url);
    if (existing) {
      hydrate(existing);
      showToast("Already Saved");
    }
  }
};

await init();
