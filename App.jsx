import { useState, useEffect } from "react";
import JDInput from "./components/JDInput";
import StatusTracker from "./components/StatusTracker";
import EmailPreview from "./components/EmailPreview";

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

const STEPS = [
  { key: "parsing",       label: "Parsing job description",        icon: "⚙️" },
  { key: "sourcing",      label: "Sourcing recruiters",            icon: "🔍" },
  { key: "deduplicating", label: "Running duplicate check",        icon: "🔄" },
  { key: "writing",       label: "Writing personalized email",     icon: "✍️" },
  { key: "scheduling",    label: "Scheduling emails",              icon: "📅" },
  { key: "done",          label: "All emails scheduled!",          icon: "✅" },
];

export default function App() {
  const [phase, setPhase] = useState("input"); // input | running | done
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

  // Poll status from Apps Script
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
            <JDInput
              onSubmit={handleSubmit}
              disabled={phase === "running"}
            />
            {error && (
              <div className="error-box">
                <span className="error-icon">⚠</span>
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="right-panel">
            {(phase === "running" || phase === "done") && (
              <StatusTracker
                steps={STEPS}
                currentStep={currentStep}
                result={result}
              />
            )}
            {phase === "done" && result && (
              <EmailPreview result={result} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
