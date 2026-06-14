type MetricCardProps = {
  eyebrow: string;
  value: string;
  detail: string;
  tone?: "green" | "blue" | "amber" | "plain";
};

export function MetricCard({
  eyebrow,
  value,
  detail,
  tone = "plain",
}: MetricCardProps) {
  const toneClass = tone === "plain" ? "" : ` metric-${tone}`;
  return (
    <article className={`metric-card${toneClass}`}>
      <p className="metric-eyebrow">{eyebrow}</p>
      <p className="metric-value">{value}</p>
      <p className="metric-detail">{detail}</p>
    </article>
  );
}
