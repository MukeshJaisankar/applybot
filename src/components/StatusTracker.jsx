// StatusTracker.jsx
export function StatusTracker({ steps, currentStep, result }) {
  const currentIdx = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="card status-card">
      <div className="card-header">
        <span className="card-icon">⚡</span>
        <h2>Live Status</h2>
      </div>

      <div className="steps">
        {steps.map((step, idx) => {
          const isDone = idx < currentIdx || currentStep === "done";
          const isActive = step.key === currentStep && currentStep !== "done";
          return (
            <div key={step.key} className={`step ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}>
              <div className="step-dot">
                {isDone ? "✓" : isActive ? <span className="pulse-dot" /> : ""}
              </div>
              <div className="step-content">
                <span className="step-icon">{step.icon}</span>
                <span className="step-label">{step.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {result && currentStep === "done" && (
        <div className="result-grid">
          <div className="result-item">
            <span className="result-label">Company</span>
            <span className="result-value">{result.company}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Role</span>
            <span className="result-value">{result.role}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Location</span>
            <span className="result-value">{result.location}</span>
          </div>
          {result.jobId && (
            <div className="result-item">
              <span className="result-label">Job ID</span>
              <span className="result-value">{result.jobId}</span>
            </div>
          )}
          <div className="result-item highlight">
            <span className="result-label">Local Recruiters</span>
            <span className="result-value">{result.localCount}</span>
          </div>
          <div className="result-item highlight">
            <span className="result-label">US Recruiters</span>
            <span className="result-value">{result.usCount}</span>
          </div>
          <div className="result-item big-highlight">
            <span className="result-label">Total Emails Scheduled</span>
            <span className="result-value big">{result.totalScheduled}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatusTracker;


// EmailPreview.jsx — separate export for clarity
export function EmailPreview({ result }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(result.emailPreview || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!result?.emailPreview) return null;

  return (
    <div className="card preview-card">
      <div className="card-header">
        <span className="card-icon">✉️</span>
        <h2>Email Preview</h2>
        <button className="copy-btn" onClick={copy} type="button">
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <div className="preview-body">
        <div className="preview-meta">
          Same body sent to all {result.totalScheduled} recruiters · greeting personalised per recipient
        </div>
        <pre className="preview-text">{result.emailPreview}</pre>
      </div>
    </div>
  );
}

// Fix missing import
import { useState } from "react";
export default EmailPreview;
