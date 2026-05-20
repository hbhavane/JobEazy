import test from "node:test";
import assert from "node:assert/strict";

import { jobsToCsv } from "../src/utils/export.js";

test("jobsToCsv creates required columns", () => {
  const csv = jobsToCsv([
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

  assert.match(csv, /^Title,Company,Location,Source,Status,URL,Notes,CreatedAt,UpdatedAt/);
  assert.match(csv, /Engineer,Acme,Remote,example\.com,Saved,https:\/\/example\.com\/job\/1,hello/);
});
