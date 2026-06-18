import { ACTION_LIBRARY } from "../config/constants/actionLibrary";
import type { CarbonResult, EcoAction, UserProfile } from "../types";

const DIFFICULTY_WEIGHT = { easy: 3, medium: 2, hard: 1 };

export function generateRecommendations(
  profile: UserProfile,
  result: CarbonResult,
  limit = 5,
): EcoAction[] {
  return ACTION_LIBRARY.filter((action) => action.condition(profile))
    .sort((a, b) => {
      const categoryDifference =
        Number(b.category === result.highestCategory) -
        Number(a.category === result.highestCategory);
      if (categoryDifference !== 0) return categoryDifference;

      const savingDifference = b.estimatedSavingKg - a.estimatedSavingKg;
      if (savingDifference !== 0) return savingDifference;

      return DIFFICULTY_WEIGHT[b.difficulty] - DIFFICULTY_WEIGHT[a.difficulty];
    })
    .slice(0, limit);
}

export function getActionsForCategory(
  category: EcoAction["category"],
  profile: UserProfile,
  limit = 3,
): EcoAction[] {
  return ACTION_LIBRARY.filter(
    (action) => action.category === category && action.condition(profile),
  )
    .sort((a, b) => b.estimatedSavingKg - a.estimatedSavingKg)
    .slice(0, limit);
}
