import { DEFAULT_STATUS, STATUSES } from "./constants.js";

export const clean = (value) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim();

export const nowIso = () => new Date().toISOString();

export const createId = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const normalizeJob = (partial = {}) => {
  const createdAt = partial.createdAt || nowIso();

  return {
    id: partial.id || createId(),
    title: clean(partial.title),
    company: clean(partial.company),
    location: clean(partial.location),
    url: clean(partial.url),
    source: clean(partial.source),
    status: STATUSES.includes(partial.status) ? partial.status : DEFAULT_STATUS,
    notes: String(partial.notes || ""),
    createdAt,
    updatedAt: partial.updatedAt || createdAt
  };
};
