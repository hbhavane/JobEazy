import { DEFAULT_STATUS, STATUSES } from "../utils/constants.js";
import { deleteJob, getJobs, updateJob } from "../storage/storage.js";
import { exportJobsToCSV } from "../utils/exportCSV.js";

const rows = document.querySelector("#rows");
const searchInput = document.querySelector("#search");
const statusFilter = document.querySelector("#statusFilter");
const exportMessage = document.querySelector("#exportMessage");

let allJobs = [];

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");

const showExportMessage = (message, isError = false) => {
  exportMessage.textContent = message;
  exportMessage.classList.remove("hidden", "border-emerald-600", "text-emerald-300", "border-rose-600", "text-rose-300");
  exportMessage.classList.add(isError ? "border-rose-600" : "border-emerald-600");
  exportMessage.classList.add(isError ? "text-rose-300" : "text-emerald-300");
};

const getFilteredJobs = () => {
  const query = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;

  return allJobs
    .filter((job) => (status ? job.status === status : true))
    .filter((job) => {
      if (!query) return true;
      return [job.title, job.company, job.location, job.notes, job.source].join(" ").toLowerCase().includes(query);
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
};

const statusSelect = (job) =>
  `<select data-id="${job.id}" data-field="status" class="input min-w-32">${STATUSES.map(
    (status) => `<option value="${status}" ${status === job.status ? "selected" : ""}>${status}</option>`
  ).join("")}</select>`;

const render = () => {
  const jobs = getFilteredJobs();

  if (!jobs.length) {
    rows.innerHTML = `<tr><td class="px-3 py-6 text-center text-slate-400" colspan="8">No jobs yet.</td></tr>`;
    return;
  }

  rows.innerHTML = jobs
    .map(
      (job) => `<tr class="border-t border-slate-800 align-top">
        <td class="px-3 py-2"><input data-id="${job.id}" data-field="title" class="input min-w-48" value="${escapeHtml(job.title)}" /></td>
        <td class="px-3 py-2"><input data-id="${job.id}" data-field="company" class="input min-w-40" value="${escapeHtml(job.company)}" /></td>
        <td class="px-3 py-2"><input data-id="${job.id}" data-field="location" class="input min-w-36" value="${escapeHtml(job.location)}" /></td>
        <td class="px-3 py-2 text-slate-300">${escapeHtml(job.source)}</td>
        <td class="px-3 py-2">${statusSelect(job)}</td>
        <td class="px-3 py-2"><textarea data-id="${job.id}" data-field="notes" class="input min-h-16 min-w-56">${escapeHtml(job.notes)}</textarea></td>
        <td class="px-3 py-2 text-xs text-slate-400">${escapeHtml(new Date(job.updatedAt).toLocaleString())}</td>
        <td class="px-3 py-2">
          <div class="flex gap-2">
            <a class="btn btn-secondary" href="${escapeHtml(job.url)}" target="_blank" rel="noreferrer">Open</a>
            <button class="btn btn-secondary" data-id="${job.id}" data-action="delete">Delete</button>
          </div>
        </td>
      </tr>`
    )
    .join("");
};

const refresh = async () => {
  allJobs = await getJobs();
  render();
};

const saveField = async (target) => {
  const id = target.dataset.id;
  const field = target.dataset.field;
  if (!id || !field) return;

  const value = field === "status" ? target.value || DEFAULT_STATUS : target.value;
  await updateJob(id, { [field]: value });
  await refresh();
};

rows.addEventListener("change", async (event) => {
  const target = event.target;
  if (target.dataset.action === "delete") {
    await deleteJob(target.dataset.id);
    await refresh();
    return;
  }

  if (target.dataset.field) {
    await saveField(target);
  }
});

rows.addEventListener("input", async (event) => {
  const target = event.target;
  if (target.dataset.field === "notes") {
    await saveField(target);
  }
});

searchInput.addEventListener("input", render);
statusFilter.addEventListener("change", render);

document.querySelector("#exportCsv").addEventListener("click", async () => {
  const result = await exportJobsToCSV();
  showExportMessage(result.message, !result.ok);
});

const init = async () => {
  statusFilter.innerHTML = `<option value="">All Statuses</option>${STATUSES.map(
    (status) => `<option value="${status}">${status}</option>`
  ).join("")}`;

  await refresh();
};

await init();
