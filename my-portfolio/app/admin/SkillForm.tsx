"use client";

import { useState } from "react";
import { createSkill } from "./actions";

export default function SkillForm() {
  const [evidenceType, setEvidenceType] = useState<"website" | "self_taught">(
    "website",
  );

  return (
    <form
      action={createSkill}
      className="mb-10 grid min-w-0 gap-4 rounded-lg border border-gray-300 bg-white/90 p-4 text-gray-900 shadow-sm sm:p-6"
    >
      <h2 className="text-xl font-semibold">Add skill</h2>
      <label className="grid min-w-0 gap-1">
        Skill name
        <input
          className="w-full min-w-0 rounded border border-gray-400 px-3 py-2"
          maxLength={100}
          name="name"
          required
        />
      </label>
      <label className="grid min-w-0 gap-1">
        Evidence type
        <select
          className="w-full min-w-0 rounded border border-gray-400 px-3 py-2"
          name="evidence_type"
          onChange={(event) =>
            setEvidenceType(
              event.target.value === "self_taught" ? "self_taught" : "website",
            )
          }
          required
          value={evidenceType}
        >
          <option value="website">Link to a website</option>
          <option value="self_taught">Self-taught</option>
        </select>
      </label>
      {evidenceType === "website" && (
        <label className="grid min-w-0 gap-1">
          Website URL
          <input
            className="w-full min-w-0 rounded border border-gray-400 px-3 py-2"
            name="url"
            placeholder="https://example.com"
            required
            type="url"
          />
        </label>
      )}
      <button
        className="w-fit rounded bg-gray-900 px-4 py-2 font-semibold text-white hover:bg-gray-700"
        type="submit"
      >
        Add skill
      </button>
    </form>
  );
}
