import { useEffect, useMemo, useState } from "react";
import { Layout, type PageId } from "./components/Layout/Layout";
import { Assistant } from "./pages/Assistant";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { Simulator } from "./pages/Simulator";
import { Tracker } from "./pages/Tracker";
import type {
  CompletedAction,
  FootprintHistoryEntry,
  UserProfile,
} from "./types";
import { calculateCarbonFootprint } from "./utils/carbonCalculator";
import {
  appendHistory,
  getCompletedActions,
  getHistory,
  getProfile,
  saveCompletedActions,
  saveProfile,
} from "./utils/storage";

const VALID_PAGES: PageId[] = [
  "home",
  "dashboard",
  "profile",
  "assistant",
  "tracker",
  "simulator",
];

function getPageFromHash(): PageId {
  const page = window.location.hash.replace("#/", "") as PageId;
  return VALID_PAGES.includes(page) ? page : "home";
}

export default function App() {
  const [page, setPage] = useState<PageId>(getPageFromHash);
  const [profile, setProfile] = useState<UserProfile | null>(() => getProfile());
  const [completedActions, setCompletedActions] = useState<CompletedAction[]>(
    () => getCompletedActions(),
  );
  const [history, setHistory] = useState<FootprintHistoryEntry[]>(() => getHistory());
  const result = useMemo(
    () => (profile ? calculateCarbonFootprint(profile) : null),
    [profile],
  );

  useEffect(() => {
    const handleHash = () => setPage(getPageFromHash());
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  function navigate(nextPage: PageId) {
    window.location.hash = `/${nextPage}`;
  }

  function handleSaveProfile(nextProfile: UserProfile) {
    saveProfile(nextProfile);
    setProfile(nextProfile);
    const nextResult = calculateCarbonFootprint(nextProfile);
    const entry = {
      recordedAt: new Date().toISOString(),
      totalKg: nextResult.totalKg,
      score: nextResult.score,
    };
    setHistory((current) => appendHistory(current, entry));
    navigate("dashboard");
  }

  function handleCompletedActions(items: CompletedAction[]) {
    saveCompletedActions(items);
    setCompletedActions(items);
  }

  let content;
  switch (page) {
    case "dashboard":
      content = (
        <Dashboard
          profile={profile}
          result={result}
          completedActions={completedActions}
          history={history}
          onNavigate={navigate}
        />
      );
      break;
    case "profile":
      content = <Profile profile={profile} onSave={handleSaveProfile} />;
      break;
    case "assistant":
      content = <Assistant profile={profile} result={result} onNavigate={navigate} />;
      break;
    case "tracker":
      content = (
        <Tracker
          profile={profile}
          completedActions={completedActions}
          onChange={handleCompletedActions}
          onNavigate={navigate}
        />
      );
      break;
    case "simulator":
      content = <Simulator profile={profile} onNavigate={navigate} />;
      break;
    default:
      content = <Home onNavigate={navigate} />;
  }

  return (
    <Layout activePage={page} onNavigate={navigate}>
      {content}
    </Layout>
  );
}
