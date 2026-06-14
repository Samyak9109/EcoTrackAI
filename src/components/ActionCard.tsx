import type { EcoAction } from "../types";

type ActionCardProps = {
  action: EcoAction;
  compact?: boolean;
  completed?: boolean;
  onToggle?: (action: EcoAction) => void;
};

export function ActionCard({
  action,
  compact = false,
  completed = false,
  onToggle,
}: ActionCardProps) {
  const categoryClass = ["electricity", "food", "shopping"].includes(action.category)
    ? ` chip-${action.category}`
    : "";
  return (
    <article className={`action-card ${compact ? "action-card-compact" : ""}`}>
      <div className={`category-chip${categoryClass}`}>{action.category}</div>
      <div className="action-card-copy">
        <h3>{action.title}</h3>
        {!compact && <p>{action.description}</p>}
        <span>{action.estimatedSavingKg} kg potential monthly saving</span>
      </div>
      {onToggle && (
        <button
          className={completed ? "complete-button completed" : "complete-button"}
          onClick={() => onToggle(action)}
          type="button"
          aria-pressed={completed}
        >
          {completed ? "Completed" : "Mark done"}
        </button>
      )}
    </article>
  );
}
