import type {
  CarbonResult,
  CompletedAction,
  FootprintHistoryEntry,
  UserProfile,
} from "../types";
import { getCompletedActionsSaving } from "./actionTracking";
import { generateRecommendations } from "./recommendationEngine";

const HISTORY_POINTS_VISIBLE = 8;
const HISTORY_CHART_HEIGHT = 100;

function getStartOfWeek(nowMs: number): number {
  const date = new Date(nowMs);
  const day = date.getDay(); // 0 is Sunday, 1 is Monday...
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const startOfWeek = new Date(date.setDate(diff));
  startOfWeek.setHours(0, 0, 0, 0);
  return startOfWeek.getTime();
}

export function getDashboardMetrics(
  profile: UserProfile,
  result: CarbonResult,
  completedActions: CompletedAction[],
  history: FootprintHistoryEntry[],
  now = Date.now(),
) {
  const recommendations = generateRecommendations(profile, result, 3);
  const startOfWeekMs = getStartOfWeek(now);
  const currentWeekCount = completedActions.filter(
    (item) => new Date(item.completedAt).getTime() >= startOfWeekMs,
  ).length;
  const totalPotentialSaving = getCompletedActionsSaving(completedActions);
  const visibleHistory = history.slice(-HISTORY_POINTS_VISIBLE);
  const historyMax = Math.max(...visibleHistory.map((item) => item.totalKg), 1);
  const highestCategoryShare =
    result.totalKg > 0
      ? Math.round((result.breakdown[result.highestCategory] / result.totalKg) * 100)
      : 0;

  return {
    currentWeekCount,
    highestCategoryShare,
    historyChartHeight: HISTORY_CHART_HEIGHT,
    historyMax,
    recommendations,
    totalPotentialSaving,
    visibleHistory,
  };
}

