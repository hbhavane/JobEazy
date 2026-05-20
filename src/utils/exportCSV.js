import { EXPORT_COLUMNS, STORAGE_KEY } from "./constants.js";

const getValue = (job, column) => {
  const map = {
    Title: "title",
    Company: "company",
    Location: "location",
    Source: "source",
    Status: "status",
    URL: "url",
    Notes: "notes",
    CreatedAt: "createdAt",
    UpdatedAt: "updatedAt"
  };

  return job?.[map[column]] ?? "";
};

const escapeCSVValue = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

export const convertJobsToCSV = (jobs) => {
  const safeJobs = Array.isArray(jobs) ? jobs : [];
  const header = EXPORT_COLUMNS.map(escapeCSVValue).join(",");
  const rows = safeJobs.map((job) => EXPORT_COLUMNS.map((column) => escapeCSVValue(getValue(job, column))).join(","));
  return [header, ...rows].join("\n");
};

export const downloadCSV = (csvString) => {
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "job-tracker.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const getJobsFromStorage = () =>
  new Promise((resolve, reject) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve(Array.isArray(result[STORAGE_KEY]) ? result[STORAGE_KEY] : []);
    });
  });

export const exportJobsToCSV = async () => {
  try {
    const jobs = await getJobsFromStorage();

    if (!jobs.length) {
      return { ok: false, message: "No jobs to export" };
    }

    const csvString = convertJobsToCSV(jobs);
    downloadCSV(csvString);
    return { ok: true, message: "CSV exported" };
  } catch (error) {
    console.error("CSV export failed:", error);
    return { ok: false, message: "Unable to export jobs right now" };
  }
};
