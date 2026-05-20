import { STORAGE_KEY } from "../utils/constants.js";
import { jobsToCsv, jobsToRows } from "../utils/export.js";
import { normalizeJob, nowIso } from "../utils/job-model.js";

const getLocal = (key) =>
  new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => resolve(result[key]));
  });

const setLocal = (value) =>
  new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: value }, resolve);
  });

export const getJobs = async () => {
  const jobs = await getLocal(STORAGE_KEY);
  return Array.isArray(jobs) ? jobs : [];
};

export const saveJob = async (jobInput) => {
  const candidate = normalizeJob(jobInput);
  const jobs = await getJobs();
  const existingIndex = jobs.findIndex((job) => job.url && job.url === candidate.url);

  if (existingIndex !== -1) {
    const existing = jobs[existingIndex];
    const merged = normalizeJob({
      ...existing,
      ...candidate,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: nowIso()
    });
    jobs[existingIndex] = merged;
    await setLocal(jobs);
    return { job: merged, duplicate: true };
  }

  jobs.unshift(candidate);
  await setLocal(jobs);
  return { job: candidate, duplicate: false };
};

export const updateJob = async (id, updates) => {
  const jobs = await getJobs();
  const index = jobs.findIndex((job) => job.id === id);
  if (index === -1) return null;

  const updated = normalizeJob({
    ...jobs[index],
    ...updates,
    id,
    createdAt: jobs[index].createdAt,
    updatedAt: nowIso()
  });

  jobs[index] = updated;
  await setLocal(jobs);
  return updated;
};

export const deleteJob = async (id) => {
  const jobs = await getJobs();
  const next = jobs.filter((job) => job.id !== id);
  await setLocal(next);
};

export const exportJobs = async (format = "csv") => {
  const jobs = await getJobs();
  const stamp = new Date().toISOString().slice(0, 10);

  if (format === "xlsx") {
    const rows = jobsToRows(jobs);
    const worksheet = globalThis.XLSX.utils.json_to_sheet(rows);
    const workbook = globalThis.XLSX.utils.book_new();
    globalThis.XLSX.utils.book_append_sheet(workbook, worksheet, "Jobs");
    globalThis.XLSX.writeFile(workbook, `jobeazy-jobs-${stamp}.xlsx`);
    return;
  }

  const csv = jobsToCsv(jobs);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `jobeazy-jobs-${stamp}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
