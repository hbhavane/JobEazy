import { STORAGE_KEY } from "../utils/constants.js";
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
