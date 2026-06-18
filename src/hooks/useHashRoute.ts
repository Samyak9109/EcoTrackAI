import { useEffect, useState } from "react";
import type { PageId } from "../components/Layout/Layout";

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

export function useHashRoute() {
  const [page, setPage] = useState<PageId>(getPageFromHash);

  useEffect(() => {
    const handleHash = () => setPage(getPageFromHash());
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  function navigate(nextPage: PageId) {
    window.location.hash = `/${nextPage}`;
  }

  return { page, navigate };
}

