import { useEffect, useRef, type ReactNode } from "react";

export type PageId =
  | "home"
  | "dashboard"
  | "profile"
  | "assistant"
  | "tracker"
  | "simulator";

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "profile", label: "Profile" },
  { id: "assistant", label: "Assistant" },
  { id: "tracker", label: "Tracker" },
  { id: "simulator", label: "Simulator" },
];

const PAGE_TITLES: Record<PageId, string> = {
  home: "EcoTrack AI",
  dashboard: "Dashboard | EcoTrack AI",
  profile: "Profile | EcoTrack AI",
  assistant: "Assistant | EcoTrack AI",
  tracker: "Action Tracker | EcoTrack AI",
  simulator: "What-if Simulator | EcoTrack AI",
};

type LayoutProps = {
  activePage: PageId;
  children: ReactNode;
  onNavigate: (page: PageId) => void;
};

export function Layout({ activePage, children, onNavigate }: LayoutProps) {
  const mainRef = useRef<HTMLElement>(null);
  const previousPage = useRef(activePage);

  useEffect(() => {
    document.title = PAGE_TITLES[activePage];
    if (previousPage.current !== activePage) {
      mainRef.current?.focus();
      previousPage.current = activePage;
    }
  }, [activePage]);

  return (
    <div>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="site-header">
        <button
          className="brand"
          onClick={() => onNavigate("home")}
          type="button"
          aria-current={activePage === "home" ? "page" : undefined}
        >
          <span className="brand-mark" aria-hidden="true">
            E
          </span>
          <span>EcoTrack <strong>AI</strong></span>
        </button>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <button
              className={activePage === item.id ? "nav-link active" : "nav-link"}
              key={item.id}
              onClick={() => onNavigate(item.id)}
              type="button"
              aria-current={activePage === item.id ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button
          className="header-cta"
          onClick={() => onNavigate("profile")}
          type="button"
        >
          Update profile
        </button>
      </header>

      <main id="main-content" ref={mainRef} tabIndex={-1}>
        {children}
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {NAV_ITEMS.map((item) => (
          <button
            className={activePage === item.id ? "mobile-nav-link active" : "mobile-nav-link"}
            key={item.id}
            onClick={() => onNavigate(item.id)}
            type="button"
            aria-current={activePage === item.id ? "page" : undefined}
          >
            <span className="mobile-nav-icon" aria-hidden="true">
              {item.label.charAt(0)}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <footer className="site-footer">
        <div>
          <span className="footer-brand">EcoTrack AI</span>
          <p>Small actions. Measurable progress.</p>
        </div>
        <p>Estimates are approximate and meant for awareness.</p>
      </footer>
    </div>
  );
}
