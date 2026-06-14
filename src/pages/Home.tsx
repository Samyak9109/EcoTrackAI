import type { PageId } from "../components/Layout/Layout";

export function Home({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <>
      <section className="hero page-width">
        <div className="hero-copy">
          <span className="eyebrow-pill">PERSONAL CARBON ASSISTANT</span>
          <h1>Understand your impact. <em>Change what matters.</em></h1>
          <p>
            Track everyday habits, see where your emissions come from, and get a
            practical plan built around your life.
          </p>
          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={() => onNavigate("profile")}
              type="button"
            >
              Start tracking <span aria-hidden="true">→</span>
            </button>
            <button
              className="text-button"
              onClick={() => onNavigate("dashboard")}
              type="button"
            >
              View dashboard
            </button>
          </div>
          <p className="privacy-inline">
            <span aria-hidden="true">✓</span> Your data stays in this browser.
          </p>
        </div>
        <div className="hero-visual" aria-label="Example EcoTrack carbon summary">
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="hero-score-card">
            <div className="score-ring">
              <span>76</span>
              <small>/ 100</small>
            </div>
            <div>
              <span className="small-label">YOUR CARBON SCORE</span>
              <strong>Eco Improver</strong>
              <p>Up 8 points this month</p>
            </div>
          </div>
          <div className="hero-insight-card">
            <span className="insight-icon" aria-hidden="true">↓</span>
            <div>
              <small>THIS WEEK</small>
              <strong>12.4 kg saved</strong>
              <span>3 actions completed</span>
            </div>
          </div>
          <div className="hero-category-card">
            <div className="mini-bar-label"><span>Transport</span><strong>38%</strong></div>
            <div className="mini-bar"><span style={{ width: "38%" }} /></div>
            <div className="mini-bar-label"><span>Food</span><strong>27%</strong></div>
            <div className="mini-bar amber"><span style={{ width: "27%" }} /></div>
          </div>
        </div>
      </section>

      <section className="features-section page-width">
        <div className="section-heading">
          <span className="section-kicker">ONE CLEAR VIEW</span>
          <h2>From footprint to forward motion</h2>
          <p>No spreadsheets. No jargon. Just the numbers and next steps that matter.</p>
        </div>
        <div className="feature-grid">
          {[
            ["01", "Calculate your footprint", "A quick lifestyle profile turns your routine into a clear monthly estimate."],
            ["02", "Get personal guidance", "Recommendations adapt to your highest-impact habits and what you already do well."],
            ["03", "Ask the smart assistant", "Get short, context-aware answers and a practical seven-day action plan."],
            ["04", "Track real progress", "Complete simple actions, build a streak, and see estimated carbon savings add up."],
          ].map(([number, title, text]) => (
            <article className="feature-card" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="privacy-banner page-width">
        <div className="privacy-mark" aria-hidden="true">L</div>
        <div>
          <h2>Private by design</h2>
          <p>
            This prototype stores only lifestyle inputs in localStorage. It collects no
            name, address, account, or exact location.
          </p>
        </div>
        <button className="secondary-button" onClick={() => onNavigate("profile")} type="button">
          Build my profile
        </button>
      </section>
    </>
  );
}
