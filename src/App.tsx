import { useEffect } from "react";
import { Layout } from "./components/Layout/Layout";
import { Assistant } from "./pages/Assistant";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { Simulator } from "./pages/Simulator";
import { Tracker } from "./pages/Tracker";
import { useEcoTrackState } from "./hooks/useEcoTrackState";
import { useHashRoute } from "./hooks/useHashRoute";

export default function App() {
  const { page, navigate } = useHashRoute();
  const {
    completedActions,
    history,
    profile,
    result,
    saveCompletedActionState,
    saveProfileState,
    storageError,
  } = useEcoTrackState();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);


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
      content = (
        <Profile
          profile={profile}
          onSave={(nextProfile) => {
            saveProfileState(nextProfile);
            navigate("dashboard");
          }}
        />
      );
      break;
    case "assistant":
      content = <Assistant profile={profile} result={result} onNavigate={navigate} />;
      break;
    case "tracker":
      content = (
        <Tracker
          profile={profile}
          completedActions={completedActions}
          onChange={saveCompletedActionState}
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
      {storageError && (
        <div className="app-alert" role="alert">
          {storageError}
        </div>
      )}
      {content}
    </Layout>
  );
}

