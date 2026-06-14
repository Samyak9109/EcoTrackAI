import { ActionCard } from "../components/ActionCard";
import { CategoryChart } from "../components/Dashboard/CategoryChart";
import { MetricCard } from "../components/Dashboard/MetricCard";
import type { PageId } from "../components/Layout/Layout";
import { ProfileRequiredState } from "../components/ProfileRequiredState";
import { CATEGORY_LABELS } from "../data/domainMetadata";
import type {
  CarbonResult,
  CompletedAction,
  FootprintHistoryEntry,
  UserProfile,
} from "../types";
import { generateRecommendations } from "../utils/recommendationEngine";
import { getCompletedActionsSaving } from "../utils/actionTracking";

type DashboardProps = {
  profile: UserProfile | null;
  result: CarbonResult | null;
  completedActions: CompletedAction[];
  history: FootprintHistoryEntry[];
  onNavigate: (page: PageId) => void;
};

export function Dashboard({
  profile,
  result,
  completedActions,
  history,
  onNavigate,
}: DashboardProps) {
  if (!profile || !result) {
    return <EmptyProfile onNavigate={onNavigate} />;
  }

  const recommendations = generateRecommendations(profile, result, 3);
  const currentWeekCount = completedActions.filter(
    (item) => Date.now() - new Date(item.completedAt).getTime() < 7 * 86400000,
  ).length;
  const totalPotentialSaving = getCompletedActionsSaving(completedActions);
  const visibleHistory = history.slice(-8);
  const historyMax = Math.max(...visibleHistory.map((item) => item.totalKg), 1);

  return (
    <section className="page-width page-section">
      <div className="page-heading dashboard-heading">
        <div>
          <span className="section-kicker">YOUR OVERVIEW</span>
          <h1>Your carbon dashboard</h1>
          <p>One monthly estimate, with the clearest opportunities first.</p>
        </div>
        <button className="secondary-button" onClick={() => onNavigate("simulator")} type="button">
          Explore what-if scenarios
        </button>
      </div>

      <div className="metrics-grid">
        <MetricCard eyebrow="ESTIMATED FOOTPRINT" value={`${result.totalKg} kg`} detail="CO₂e per month" tone="green" />
        <MetricCard eyebrow="CARBON SCORE" value={`${result.score} / 100`} detail={result.scoreLabel} tone="blue" />
        <MetricCard eyebrow="BIGGEST CONTRIBUTOR" value={CATEGORY_LABELS[result.highestCategory]} detail={`${result.breakdown[result.highestCategory]} kg CO₂e`} tone="amber" />
        <MetricCard eyebrow="ACTIONS THIS WEEK" value={`${currentWeekCount}`} detail={`${totalPotentialSaving.toFixed(1)} kg potential saved`} />
      </div>

      <div className="dashboard-main-grid">
        <article className="panel">
          <div className="panel-heading">
            <div><span className="section-kicker">YOUR BREAKDOWN</span><h2>Where your footprint comes from</h2></div>
            <span className="panel-total">{result.totalKg} kg total</span>
          </div>
          <CategoryChart breakdown={result.breakdown} />
        </article>

        <article className="panel insight-panel">
          <span className="section-kicker">BIGGEST OPPORTUNITY</span>
          <div className="impact-number">{Math.round((result.breakdown[result.highestCategory] / result.totalKg) * 100)}<span>%</span></div>
          <h2>of your footprint comes from {CATEGORY_LABELS[result.highestCategory].toLowerCase()}</h2>
          <p>
            {recommendations[0]?.description} This is likely to make the most useful
            difference for your current profile.
          </p>
          <button className="text-button light" onClick={() => onNavigate("assistant")} type="button">
            Ask the assistant <span aria-hidden="true">→</span>
          </button>
        </article>
      </div>

      <div className="content-grid">
        <section>
          <div className="panel-heading">
            <div><span className="section-kicker">RECOMMENDED FOR YOU</span><h2>Three good next moves</h2></div>
            <button className="text-button" onClick={() => onNavigate("tracker")} type="button">Open tracker</button>
          </div>
          <div className="recommendation-list">
            {recommendations.map((action) => <ActionCard action={action} key={action.id} />)}
          </div>
        </section>

        <article className="panel history-panel">
          <span className="section-kicker">PROFILE HISTORY</span>
          <h2>Your recent estimates</h2>
          {history.length > 1 ? (
            <div className="history-chart">
              {visibleHistory.map((entry, index) => (
                  <div className="history-column" key={`${entry.recordedAt}-${index}`}>
                    <span style={{ height: `${Math.max(12, (entry.totalKg / historyMax) * 100)}%` }} />
                    <small>{entry.totalKg}</small>
                  </div>
              ))}
            </div>
          ) : (
            <div className="empty-mini">
              <strong>Your first baseline is saved.</strong>
              <p>Update your profile after changing habits to see progress here.</p>
            </div>
          )}
        </article>
      </div>

      <p className="disclaimer">Estimates are approximate and meant for awareness, not scientific reporting.</p>
    </section>
  );
}

function EmptyProfile({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <ProfileRequiredState
      marker="01"
      title="Create your lifestyle profile"
      description="Answer eight simple questions to unlock your footprint, score, and personalized actions."
      buttonLabel="Start my profile"
      onNavigate={onNavigate}
    />
  );
}
