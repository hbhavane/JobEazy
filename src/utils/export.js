import { EXPORT_COLUMNS } from "./constants.js";

const toRow = (job) => ({
  Title: job.title,
  Company: job.company,
  Location: job.location,
  Source: job.source,
  Status: job.status,
  URL: job.url,
  Notes: job.notes,
  CreatedAt: job.createdAt,
  UpdatedAt: job.updatedAt
});

const escapeCsv = (value) => {
  const raw = String(value ?? "");
  if (!/[",\n]/.test(raw)) return raw;
  return `"${raw.replaceAll('"', '""')}"`;
};

export const jobsToRows = (jobs) => jobs.map(toRow);

export const jobsToCsv = (jobs) => {
  const rows = jobsToRows(jobs);
  const header = EXPORT_COLUMNS.join(",");
  const data = rows.map((row) => EXPORT_COLUMNS.map((column) => escapeCsv(row[column])).join(","));
  return [header, ...data].join("\n");
};
