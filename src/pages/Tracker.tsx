import { ActionCard } from "../components/ActionCard";
import type { PageId } from "../components/Layout/Layout";
import { ProfileRequiredState } from "../components/ProfileRequiredState";
import { ACTION_LIBRARY } from "../config/constants/actionLibrary";
import type { CompletedAction, EcoAction, UserProfile } from "../types";
import {
  calculateActionStreak,
  getCompletedActionsSaving,
  getUtcDateKey,
} from "../utils/actionTracking";

export function Tracker({
  profile,
  completedActions,
  onChange,
  onNavigate,
}: {
  profile: UserProfile | null;
  completedActions: CompletedAction[];
  onChange: (items: CompletedAction[]) => void;
  onNavigate: (page: PageId) => void;
}) {
  if (!profile) {
    return (
      <ProfileRequiredState
        marker="07"
        title="Actions work better with context"
        description="Create a profile to see actions relevant to your habits."
        onNavigate={onNavigate}
      />
    );
  }

  const today = getUtcDateKey();
  const relevantActions = ACTION_LIBRARY.filter((action) => action.condition(profile)).slice(0, 10);
  const completedToday = new Set(
    completedActions
      .filter((item) => item.completedAt.slice(0, 10) === today)
      .map((item) => item.actionId),
  );
  const saved = getCompletedActionsSaving(completedActions);
  const streak = calculateActionStreak(completedActions);

  function toggle(action: EcoAction) {
    const existing = completedActions.find(
      (item) => item.actionId === action.id && item.completedAt.slice(0, 10) === today,
    );
    if (existing) {
      onChange(completedActions.filter((item) => item !== existing));
    } else {
      onChange([
        ...completedActions,
        {
          actionId: action.id,
          completedAt: new Date().toISOString(),
        },
      ]);
    }
  }

  return (
    <section className="page-width page-section">
      <div className="page-heading dashboard-heading">
        <div><span className="section-kicker">BUILD THE HABIT</span><h1>Your action tracker</h1><p>Mark small actions as you complete them. Come back tomorrow and build a streak.</p></div>
      </div>
      <div className="tracker-summary">
        <div><span>TODAY</span><strong>{completedToday.size}</strong><p>actions completed</p></div>
        <div><span>ALL TIME</span><strong>{completedActions.length}</strong><p>actions logged</p></div>
        <div><span>ESTIMATED SAVING</span><strong>{saved.toFixed(1)} kg</strong><p>monthly CO₂e potential</p></div>
        <div className="streak-card"><span>CURRENT STREAK</span><strong>{streak} {streak === 1 ? "day" : "days"}</strong><p>Keep one action going daily</p></div>
      </div>
      <div className="tracker-heading">
        <div><span className="section-kicker">TODAY'S ACTIONS</span><h2>Choose what fits your day</h2></div>
        <p>{completedToday.size} of {relevantActions.length} complete</p>
      </div>
      <div className="tracker-grid">
        {relevantActions.map((action) => (
          <ActionCard
            action={action}
            completed={completedToday.has(action.id)}
            key={action.id}
            onToggle={toggle}
          />
        ))}
      </div>
    </section>
  );
}
