import { useState, useEffect } from "react";

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

const STEPS = [
  { key: "parsing",       label: "Parsing job description",    icon: "⚙️" },
  { key: "sourcing",      label: "Sourcing recruiters",        icon: "🔍" },
  { key: "deduplicating", label: "Running duplicate check",    icon: "🔄" },
  { key: "writing",       label: "Writing personalized email", icon: "✍️" },
  { key: "scheduling",    label: "Scheduling emails",          icon: "📅" },
  { key: "done",          label: "All emails scheduled!",      icon: "✅" },
];

function JDInput({ onSubmit, disabled }) {
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
      <button className="btn" onClick={handleSubmit} disabled={disabled}>
        {disabled ? "Processing..." : "Start Application Process"}
      </button>
    </div>
  );
}

function StatusTracker({ steps, currentStep, result }) {
  return (
    <div className="card">
      <div className="tracker-title">Live Status</div>
      {steps.map((step) => {
        const isDone = steps.findIndex(s => s.key === currentStep) > steps.findIndex(s => s.key === step.key);
        const isCurrent = step.key === currentStep;
        return (
          <div key={step.key} className={`step ${isCurrent ? "step-active" : ""} ${isDone ? "step-done" : ""}`}>
            <span className="step-icon">{step.icon}</span>
            <span className="step-label">{step.label}</span>
            {isCurrent && <span className="step-spinner">⟳</span>}
            {isDone && <span className="step-check">✓</span>}
          </div>
        );
      })}
      {result && (
        <div className="result-box">
          <div className="result-title">Done!</div>
          <div className="result-row"><span>Company:</span> <strong>{result.company}</strong></div>
          <div className="result-row"><span>Role:</span> <strong>{result.role}</strong></div>
          <div className="result-row"><span>Local Recruiters:</span> <strong>{result.localCount}</strong></div>
          <div className="result-row"><span>US Recruiters:</span> <strong>{result.usCount}</strong></div>
          <div className="result-row"><span>Total Scheduled:</span> <strong>{result.totalScheduled}</strong></div>
          {result.emailPreview && (
            <div className="email-preview">
              <div className="preview-label">Email Preview:</div>
              <div className="preview-body">{result.emailPreview}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState("input");
  const [currentStep, setCurrentStep] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit({ jdText, jdLink, source }) {
    setPhase("running");
    setCurrentStep("parsing");
    setError(null);
    setResult(null);

    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jdText, jdLink, source }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Unknown error");
      setResult(data);
      setCurrentStep("done");
      setPhase("done");
    } catch (err) {
      setError(err.message);
      setPhase("input");
      setCurrentStep(null);
    }
  }

  useEffect(() => {
    if (phase !== "running") return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(APPS_SCRIPT_URL + "?status=1");
        const data = await res.json();
        if (data.step) setCurrentStep(data.step);
      } catch (_) {}
    }, 2000);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">ApplyBot</span>
          </div>
          <div className="header-meta">Mukesh Jaisankar · Job Application Automator</div>
        </div>
      </header>
      <main className="main">
        <div className="hero">
          <h1 className="hero-title">
            Paste JD.<br />
            <span className="accent">We handle the rest.</span>
          </h1>
          <p className="hero-sub">
            Finds recruiters · Writes your email · Sends on schedule
          </p>
        </div>
        <div className="content-grid">
          <div className="left-panel">
            <JDInput onSubmit={handleSubmit} disabled={phase === "running"} />
            {error && (
              <div className="error-box">
                <span className="error-icon">⚠</span>
                <span>{error}</span>
              </div>
            )}
          </div>
          <div className="right-panel">
            {(phase === "running" || phase === "done") && (
              <StatusTracker steps={STEPS} currentStep={currentStep} result={result} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
