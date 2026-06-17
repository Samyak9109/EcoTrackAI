import { useMemo, useState } from "react";
import type { PageId } from "../components/Layout/Layout";
import { ProfileRequiredState } from "../components/ProfileRequiredState";
import { DIET_OPTIONS, TRANSPORT_OPTIONS } from "../data/domainMetadata";
import { DEFAULT_COMMUTE_DAYS } from "../data/emissionFactors";
import type {
  DietType,
  SimulationChanges,
  TransportMode,
  UserProfile,
} from "../types";
import { simulateAction } from "../utils/simulator";

export function Simulator({
  profile,
  onNavigate,
}: {
  profile: UserProfile | null;
  onNavigate: (page: PageId) => void;
}) {
  const [changes, setChanges] = useState<SimulationChanges>(() => ({
    transportMode: profile?.transportMode,
    commuteDaysPerMonth: DEFAULT_COMMUTE_DAYS,
    electricityUnitsPerMonth: profile?.electricityUnitsPerMonth,
    dietType: profile?.dietType,
    onlineOrdersPerMonth: profile?.onlineOrdersPerMonth,
  }));

  const simulation = useMemo(
    () => (profile ? simulateAction(profile, changes) : null),
    [profile, changes],
  );

  if (!profile || !simulation) {
    return (
      <ProfileRequiredState
        marker="IF"
        title="Start with your current baseline"
        description="Create a profile before comparing possible lifestyle changes."
        onNavigate={onNavigate}
      />
    );
  }

  const difference = simulation.deltaKg;
  const improved = difference > 0;

  return (
    <section className="page-width page-section">
      <div className="page-heading dashboard-heading">
        <div><span className="section-kicker">EXPLORE THE IMPACT</span><h1>What-if simulator</h1><p>Change a few habits and compare the monthly estimate instantly.</p></div>
        <button className="text-button" type="button" onClick={() => setChanges({
          transportMode: profile.transportMode,
          commuteDaysPerMonth: DEFAULT_COMMUTE_DAYS,
          electricityUnitsPerMonth: profile.electricityUnitsPerMonth,
          dietType: profile.dietType,
          onlineOrdersPerMonth: profile.onlineOrdersPerMonth,
        })}>Reset scenario</button>
      </div>

      <div className="simulator-layout">
        <div className="scenario-form panel">
          <span className="section-kicker">YOUR SCENARIO</span>
          <h2>Try a different routine</h2>
          <label className="field">
            <span>Transport mode</span>
            <select value={changes.transportMode} onChange={(event) => setChanges((current) => ({ ...current, transportMode: event.target.value as TransportMode }))}>
              {TRANSPORT_OPTIONS.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field range-field">
            <span>Commute days per month <strong>{changes.commuteDaysPerMonth}</strong></span>
            <input type="range" min="0" max={DEFAULT_COMMUTE_DAYS} value={changes.commuteDaysPerMonth} onChange={(event) => setChanges((current) => ({ ...current, commuteDaysPerMonth: Number(event.target.value) }))} />
            <div><span>0 days</span><span>{DEFAULT_COMMUTE_DAYS} days</span></div>
          </label>
          <label className="field range-field">
            <span>Electricity use <strong>{changes.electricityUnitsPerMonth} units</strong></span>
            <input type="range" min="0" max={Math.max(400, profile.electricityUnitsPerMonth)} step="5" value={changes.electricityUnitsPerMonth} onChange={(event) => setChanges((current) => ({ ...current, electricityUnitsPerMonth: Number(event.target.value) }))} />
            <div><span>0</span><span>{Math.max(400, profile.electricityUnitsPerMonth)} units</span></div>
          </label>
          <label className="field">
            <span>Diet type</span>
            <select value={changes.dietType} onChange={(event) => setChanges((current) => ({ ...current, dietType: event.target.value as DietType }))}>
              {DIET_OPTIONS.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field range-field">
            <span>Online orders <strong>{changes.onlineOrdersPerMonth}/month</strong></span>
            <input type="range" min="0" max={Math.max(12, profile.onlineOrdersPerMonth)} value={changes.onlineOrdersPerMonth} onChange={(event) => setChanges((current) => ({ ...current, onlineOrdersPerMonth: Number(event.target.value) }))} />
            <div><span>0</span><span>{Math.max(12, profile.onlineOrdersPerMonth)}</span></div>
          </label>
        </div>

        <div className="scenario-results">
          <div className="comparison-cards">
            <article><span>CURRENT</span><strong>{simulation.current.totalKg}</strong><small>kg CO₂e / month</small></article>
            <span className="comparison-arrow" aria-hidden="true">→</span>
            <article className="projected"><span>NEW ESTIMATE</span><strong>{simulation.projected.totalKg}</strong><small>kg CO₂e / month</small></article>
          </div>
          <article className={`saving-card ${improved ? "positive" : "neutral"}`}>
            <span className="section-kicker">{improved ? "ESTIMATED MONTHLY SAVING" : "SCENARIO RESULT"}</span>
            <strong>{Math.abs(difference).toFixed(1)} <small>kg CO₂e</small></strong>
            <p>
              {improved
                ? `That is about ${Math.round(difference * 12)} kg CO₂e over a year if this routine stays consistent.`
                : difference < 0
                  ? "This scenario increases the estimate. Try fewer commute days, lower electricity use, or a lower-impact mode."
                  : "This scenario matches your current estimated footprint."}
            </p>
          </article>
          <article className="panel score-comparison">
            <div><span>Current score</span><strong>{simulation.current.score}</strong></div>
            <progress
              className="score-line"
              max={100}
              value={simulation.projected.score}
              aria-label="Projected carbon score"
            />
            <div><span>Projected score</span><strong>{simulation.projected.score}</strong></div>
          </article>
          <p className="disclaimer">Scenario estimates use simplified factors and should be treated as directional.</p>
        </div>
      </div>
    </section>
  );
}
