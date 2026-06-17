import type { CategoryBreakdown } from "../../types";
import { CATEGORY_LABELS } from "../../data/domainMetadata";

export function CategoryChart({ breakdown }: { breakdown: CategoryBreakdown }) {
  const max = Math.max(...Object.values(breakdown), 1);

  return (
    <div
      className="category-chart"
      role="group"
      aria-label="Category emission breakdown"
    >
      {(Object.entries(breakdown) as [keyof CategoryBreakdown, number][]).map(
        ([category, value]) => (
          <div key={category}>
            <div className="chart-label-row">
              <span>{CATEGORY_LABELS[category]}</span>
              <strong>{value.toFixed(1)} kg</strong>
            </div>
            <div className="chart-track">
              <meter
                className={`chart-meter chart-${category}`}
                min={0}
                max={max}
                value={value}
                aria-label={`${CATEGORY_LABELS[category]} emissions`}
              />
            </div>
          </div>
        ),
      )}
    </div>
  );
}
