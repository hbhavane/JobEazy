import test from "node:test";
import assert from "node:assert/strict";

import { convertJobsToCSV } from "../src/utils/exportCSV.js";

test("convertJobsToCSV creates required columns", () => {
  const csv = convertJobsToCSV([
    {
      title: "Engineer",
      company: "Acme",
      location: "Remote",
      source: "example.com",
      status: "Saved",
      url: "https://example.com/job/1",
      notes: "hello",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z"
    }
  ]);

  const [header, row] = csv.split("\n");
  assert.equal(
    header,
    "\"Title\",\"Company\",\"Location\",\"Source\",\"Status\",\"URL\",\"Notes\",\"CreatedAt\",\"UpdatedAt\""
  );
  assert.equal(
    row,
    "\"Engineer\",\"Acme\",\"Remote\",\"example.com\",\"Saved\",\"https://example.com/job/1\",\"hello\",\"2026-01-01T00:00:00.000Z\",\"2026-01-02T00:00:00.000Z\""
  );
});

test("convertJobsToCSV escapes quotes, commas and preserves multiline notes", () => {
  const csv = convertJobsToCSV([
    {
      title: "Senior, Engineer",
      company: "A \"Great\" Co",
      location: null,
      source: undefined,
      status: "Applied",
      url: "https://example.com/job/2",
      notes: "Line 1\nLine \"2\"",
      createdAt: "",
      updatedAt: ""
    }
  ]);

  assert.match(csv, /"Senior, Engineer"/);
  assert.match(csv, /"A ""Great"" Co"/);
  assert.match(csv, /"Line 1\nLine ""2"""/);
  assert.match(csv, /"","","Applied"/);
});
