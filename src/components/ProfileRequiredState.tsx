import type { PageId } from "./Layout/Layout";

type ProfileRequiredStateProps = {
  marker: string;
  title: string;
  description: string;
  buttonLabel?: string;
  onNavigate: (page: PageId) => void;
};

export function ProfileRequiredState({
  marker,
  title,
  description,
  buttonLabel = "Create profile",
  onNavigate,
}: ProfileRequiredStateProps) {
  return (
    <section className="empty-state page-width">
      <span className="empty-state-number">{marker}</span>
      <h1>{title}</h1>
      <p>{description}</p>
      <button
        className="primary-button"
        onClick={() => onNavigate("profile")}
        type="button"
      >
        {buttonLabel}
      </button>
    </section>
  );
}
