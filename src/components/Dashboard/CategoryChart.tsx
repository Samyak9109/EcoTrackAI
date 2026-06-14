import type { CategoryBreakdown } from "../../types";
import { CATEGORY_LABELS } from "../../data/domainMetadata";

const COLORS: Record<keyof CategoryBreakdown, string> = {
  transport: "var(--green-600)",
  electricity: "var(--blue-500)",
  food: "var(--amber-500)",
  shopping: "var(--purple-400)",
  waste: "var(--mint-500)",
};

export function CategoryChart({ breakdown }: { breakdown: CategoryBreakdown }) {
  const max = Math.max(...Object.values(breakdown), 1);

  return (
    <div className="category-chart" aria-label="Category emission breakdown">
      {(Object.entries(breakdown) as [keyof CategoryBreakdown, number][]).map(
        ([category, value]) => (
          <div key={category}>
            <div className="chart-label-row">
              <span>{CATEGORY_LABELS[category]}</span>
              <strong>{value.toFixed(1)} kg</strong>
            </div>
            <div
              className="chart-track"
              role="meter"
              aria-label={`${CATEGORY_LABELS[category]} emissions`}
              aria-valuenow={value}
              aria-valuemin={0}
              aria-valuemax={max}
            >
              <span
                className="chart-fill"
                style={{
                  width: `${Math.max(3, (value / max) * 100)}%`,
                  background: COLORS[category],
                }}
              />
            </div>
          </div>
        ),
      )}
    </div>
  );
}
