import { useState } from "react";

export default function JDInput({ onSubmit, disabled }) {
  const [jdText, setJdText] = useState("");
  const [jdLink, setJdLink] = useState("");
  const [source, setSource] = useState("Company Careers Page");

  function handleSubmit() {
    if (!jdText.trim()) return alert("Please paste a job description.");
    if (!jdLink.trim()) return alert("Please add the job posting link.");
    onSubmit({ jdText, jdLink, source });
  }

  return (
    <div className="card">
      <label className="label">Job Description</label>
      <textarea
        className="textarea"
        placeholder="Paste the full job description here..."
        value={jdText}
        onChange={(e) => setJdText(e.target.value)}
        disabled={disabled}
        rows={10}
      />
      <label className="label">Job Posting Link</label>
      <input
        className="input"
        type="url"
        placeholder="https://company.com/careers/job-id"
        value={jdLink}
        onChange={(e) => setJdLink(e.target.value)}
        disabled={disabled}
      />
      <label className="label">Where did you find this?</label>
      <select
        className="input"
        value={source}
        onChange={(e) => setSource(e.target.value)}
        disabled={disabled}
      >
        <option>Company Careers Page</option>
        <option>LinkedIn</option>
        <option>Indeed</option>
        <option>Glassdoor</option>
        <option>Referral</option>
        <option>Other</option>
      </select>
      <button
        className="btn"
        onClick={handleSubmit}
        disabled={disabled}
      >
        {disabled ? "Processing..." : "Start Application Process"}
      </button>
    </div>
  );
}
