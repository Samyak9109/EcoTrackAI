type AlertProps = {
  type?: "error" | "info" | "success";
  children: React.ReactNode;
};

export function Alert({ type = "info", children }: AlertProps) {
  const baseClasses = "alert";
  const typeClasses = {
    error: "alert--error",
    info: "alert--info",
    success: "alert--success",
  };

  return (
    <div
      className={`${baseClasses} ${typeClasses[type]}`}
      role="alert"
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      {children}
    </div>
  );
}