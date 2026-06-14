export type TransportMode =
  | "car"
  | "bike"
  | "bus"
  | "train"
  | "cycle"
  | "walk"
  | "work_from_home";

export type DietType = "vegan" | "vegetarian" | "mixed" | "high_meat";
export type ShoppingFrequency = "low" | "medium" | "high";
export type CarbonCategory =
  | "transport"
  | "electricity"
  | "food"
  | "shopping"
  | "waste";

export type UserProfile = {
  commuteKmPerDay: number;
  transportMode: TransportMode;
  electricityUnitsPerMonth: number;
  dietType: DietType;
  onlineOrdersPerMonth: number;
  shoppingFrequency: ShoppingFrequency;
  recyclesWaste: boolean;
  usesACDaily: boolean;
};

export type CategoryBreakdown = Record<CarbonCategory, number>;

export type CarbonResult = {
  totalKg: number;
  score: number;
  scoreLabel: string;
  highestCategory: CarbonCategory;
  breakdown: CategoryBreakdown;
};

export type EcoAction = {
  id: string;
  title: string;
  category: CarbonCategory;
  description: string;
  estimatedSavingKg: number;
  difficulty: "easy" | "medium" | "hard";
  condition: (profile: UserProfile) => boolean;
};

export type AssistantIntent =
  | "transport_help"
  | "electricity_help"
  | "food_help"
  | "shopping_help"
  | "waste_help"
  | "seven_day_plan"
  | "what_if_simulation"
  | "general_reduce"
  | "score_explanation";

export type AssistantReply = {
  intent: AssistantIntent;
  message: string;
  suggestedActions: EcoAction[];
};

export type SimulationChanges = {
  transportMode?: TransportMode;
  commuteDaysPerMonth?: number;
  electricityUnitsPerMonth?: number;
  dietType?: DietType;
  onlineOrdersPerMonth?: number;
};

export type SimulationResult = {
  current: CarbonResult;
  projected: CarbonResult;
  deltaKg: number;
};

export type CompletedAction = {
  actionId: string;
  completedAt: string;
};

export type FootprintHistoryEntry = {
  recordedAt: string;
  totalKg: number;
  score: number;
};
