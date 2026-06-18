import type {
  AssistantIntent,
  AssistantReply,
  CarbonResult,
  EcoAction,
  UserProfile,
} from "../types";
import { formatEnumLabel } from "../config/constants/domainMetadata";
import { getActionsForCategory, generateRecommendations } from "./recommendationEngine";

const CATEGORY_LABELS = {
  transport: "transport",
  electricity: "home electricity",
  food: "food",
  shopping: "shopping and deliveries",
  waste: "household waste",
} as const;

const INTENT_PATTERNS: Array<{ pattern: RegExp; intent: AssistantIntent }> = [
  { pattern: /(7\s*day|seven\s*day|week\s*plan|weekly\s*plan)/, intent: "seven_day_plan" },
  { pattern: /(what if|instead of|simulate)/, intent: "what_if_simulation" },
  { pattern: /(score|why is|biggest|highest)/, intent: "score_explanation" },
  { pattern: /(transport|commute|car|bike|bus|train|travel)/, intent: "transport_help" },
  { pattern: /(electricity|power|energy|appliance|\bac\b|air condition)/, intent: "electricity_help" },
  { pattern: /(food|diet|meat|meal|vegan|vegetarian)/, intent: "food_help" },
  { pattern: /(shop|order|delivery|buy|purchase)/, intent: "shopping_help" },
  { pattern: /(waste|recycl|rubbish|trash|reuse)/, intent: "waste_help" },
];

function detectIntent(message: string): AssistantIntent {
  const lower = message.toLowerCase().replace(/-/g, " ");
  for (const { pattern, intent } of INTENT_PATTERNS) {
    if (pattern.test(lower)) return intent;
  }
  return "general_reduce";
}

export function generateAssistantReply(
  message: string,
  profile: UserProfile,
  result: CarbonResult,
): AssistantReply {
  const intent = detectIntent(message);

  if (intent === "seven_day_plan") {
    const actions = buildSevenDayPlan(profile, result);
    return {
      intent,
      message: [
        "Here is a realistic 7-day plan based on your profile:",
        ...actions.map((action, index) => `Day ${index + 1}: ${action.title}.`),
        "Repeat the actions that fit your routine; consistency matters more than perfection.",
      ].join("\n"),
      suggestedActions: actions,
    };
  }

  if (intent === "what_if_simulation") {
    return {
      intent,
      message: buildSimulationReply(message, profile),
      suggestedActions: getActionsForCategory("transport", profile, 2),
    };
  }

  if (intent === "score_explanation") {
    const category = CATEGORY_LABELS[result.highestCategory];
    return {
      intent,
      message: `Your score is ${result.score}/100 (${result.scoreLabel}) because your estimated footprint is ${result.totalKg} kg CO₂e/month. Your largest category is ${category} at ${result.breakdown[result.highestCategory]} kg. Start there for the most useful reduction.`,
      suggestedActions: getActionsForCategory(result.highestCategory, profile, 3),
    };
  }

  const categoryByIntent: Partial<Record<AssistantIntent, CarbonCategory>> = {
    transport_help: "transport",
    electricity_help: "electricity",
    food_help: "food",
    shopping_help: "shopping",
    waste_help: "waste",
  };

  const category = categoryByIntent[intent];

  if (category) {
    const actions = getActionsForCategory(category, profile, 3);
    return {
      intent,
      message: buildCategoryReply(category, profile, result, actions),
      suggestedActions: actions,
    };
  }

  const actions = generateRecommendations(profile, result, 3);
  return {
    intent,
    message: `Your biggest opportunity is ${CATEGORY_LABELS[result.highestCategory]}, currently ${result.breakdown[result.highestCategory]} kg CO₂e/month. Start with “${actions[0]?.title ?? "one small repeatable action"}” and build from there.`,
    suggestedActions: actions,
  };
}

function buildSevenDayPlan(profile: UserProfile, result: CarbonResult): EcoAction[] {
  return generateRecommendations(profile, result, 7);
}

function buildCategoryReply(
  category: keyof typeof CATEGORY_LABELS,
  profile: UserProfile,
  result: CarbonResult,
  actions: EcoAction[],
): string {
  const amount = result.breakdown[category];
  const lead = `${capitalize(CATEGORY_LABELS[category])} contributes about ${amount} kg CO₂e/month`;
  const context = {
    transport: `You travel ${profile.commuteKmPerDay} km per day by ${formatEnumLabel(profile.transportMode)}.`,
    electricity: `You use ${profile.electricityUnitsPerMonth} units per month${profile.usesACDaily ? " and use AC daily" : ""}.`,
    food: `Your current diet is ${formatEnumLabel(profile.dietType)}.`,
    shopping: `You place ${profile.onlineOrdersPerMonth} online orders per month and report ${profile.shoppingFrequency} shopping frequency.`,
    waste: profile.recyclesWaste
      ? "You already recycle, so focus on better sorting and reuse."
      : "Starting a simple waste-sorting routine is your best first step.",
  }[category];
  const actionText = actions.length
    ? `Try ${actions.map((action) => action.title.toLowerCase()).join(", ")}.`
    : "Keep your current low-impact habits consistent.";

  return `${lead}. ${context} ${actionText}`;
}

function buildSimulationReply(message: string, profile: UserProfile): string {
  const lower = message.toLowerCase();
  if (/(bus|public transport)/.test(lower) && ["car", "bike"].includes(profile.transportMode)) {
    return `Switching some of your ${profile.commuteKmPerDay} km daily commute from ${profile.transportMode} to bus should reduce transport emissions. Open the Simulator to choose the number of commute days and see the estimate.`;
  }
  if (/(electricity|power|units)/.test(lower)) {
    return `Your current electricity input is ${profile.electricityUnitsPerMonth} units/month. In the Simulator, lower that value to compare the projected monthly footprint.`;
  }
  return "Use the Simulator to change transport mode, commute days, electricity, diet, or delivery frequency. It will compare your current and projected monthly estimates.";
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
