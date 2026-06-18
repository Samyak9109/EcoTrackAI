type SpinnerProps = {}

export function Spinner(): React.ReactNode {
  return (
    <div className="spinner">
      <span className="spinner-dot" aria-label="Loading...">•</span>
    </div>
  );
}