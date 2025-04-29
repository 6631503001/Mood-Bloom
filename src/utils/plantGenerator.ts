import type { Plant, Emotion } from "../types"
import { nanoid } from "nanoid"
import 'react-native-get-random-values'

// Plant types based on emotion categories - each emotion will have a unique plant type
const emotionPlantTypes = {
  // Positive emotions
  happy: { name: "Sunbloom", baseColor: "#FFD166", features: ["glowing", "vibrant"] },
  excited: { name: "Sparkleaf", baseColor: "#FF9F1C", features: ["sparkling", "energetic"] },
  peaceful: { name: "Calmroot", baseColor: "#A0CED9", features: ["flowing", "gentle"] },
  content: { name: "Steadybloom", baseColor: "#83C5BE", features: ["balanced", "soft"] },
  hopeful: { name: "Wishpetal", baseColor: "#ADE8F4", features: ["floating", "bright"] },

  // Negative emotions
  sad: { name: "Teardrop", baseColor: "#6B88FE", features: ["drooping", "muted"] },
  anxious: { name: "Trembleleaf", baseColor: "#9381FF", features: ["quivering", "sharp"] },
  frustrated: { name: "Thornbloom", baseColor: "#F25F5C", features: ["spiky", "intense"] },
  tired: { name: "Restleaf", baseColor: "#8896AB", features: ["slow", "heavy"] },
  lonely: { name: "Echovine", baseColor: "#7D80DA", features: ["sparse", "reaching"] },

  // Neutral emotions
  curious: { name: "Wonderbloom", baseColor: "#C8E7FF", features: ["twisting", "changing"] },
  reflective: { name: "Mirrorbud", baseColor: "#D0D1FF", features: ["translucent", "layered"] },
  calm: { name: "Stillflower", baseColor: "#E0FBFC", features: ["symmetrical", "simple"] },
  focused: { name: "Claritystem", baseColor: "#CDEDF6", features: ["structured", "precise"] },

  // Special emotions
  grateful: { name: "Heartbloom", baseColor: "#FFCFD2", features: ["pulsing", "warm"] },
  inspired: { name: "Ideablossom", baseColor: "#FFC6FF", features: ["glowing", "complex"] },
  proud: { name: "Achievevine", baseColor: "#FDFFB6", features: ["tall", "golden"] },
  loved: { name: "Soulflower", baseColor: "#FFADAD", features: ["radiant", "embracing"] },
}

// Generate a random position within the garden bounds
const generateRandomPosition = () => {
  return {
    x: Math.floor(Math.random() * 80) + 10, // 10-90% of width
    y: Math.floor(Math.random() * 60) + 20, // 20-80% of height
  }
}

// Determine plant rarity based on emotion category and intensity
const determineRarity = (emotion: Emotion): "common" | "uncommon" | "rare" | "legendary" => {
  if (emotion.category === "special") {
    return emotion.intensity >= 4 ? "legendary" : "rare"
  }

  if (emotion.intensity >= 5) {
    return "rare"
  } else if (emotion.intensity >= 3) {
    return "uncommon"
  }

  return "common"
}

// Add pot type and color to the generated plant
export const generatePlantFromEmotion = (emotion: Emotion): Plant => {
  const rarity = determineRarity(emotion)

  // Get the specific plant type for this emotion
  const plantType = emotionPlantTypes[emotion.id] || {
    name: "Mystery Plant",
    baseColor: emotion.color,
    features: ["unknown"],
  }

  // Determine max growth stage based on rarity
  const maxGrowthStage = rarity === "legendary" ? 6 : rarity === "rare" ? 5 : rarity === "uncommon" ? 4 : 3

  const now = new Date().toISOString()

  // Determine pot type and color based on emotion category
  const potType = getPotTypeByCategory(emotion.category)
  const potColor = getPotColorByCategory(emotion.category)

  return {
    id: nanoid(),
    name: `${emotion.name} ${plantType.name}`,
    type: plantType.name,
    emotion,
    plantedDate: now,
    lastGrownDate: now,
    growthStage: 0, // Starts as a seed
    maxGrowthStage,
    consistencyStreak: 1, // First day of logging this emotion
    wateredToday: false,
    lastWateredDate: null,
    color: plantType.baseColor,
    rarity,
    features: plantType.features,
    position: generateRandomPosition(),
    potType,
    potColor,
  }
}

// Helper function to get pot type based on emotion category
const getPotTypeByCategory = (category: string): "round" | "square" | "hexagon" | "oval" | "fancy" => {
  switch (category) {
    case "positive":
      return "round"
    case "negative":
      return "square"
    case "neutral":
      return "oval"
    case "special":
      return "fancy"
    default:
      return "hexagon"
  }
}

// Helper function to get pot color based on emotion category
const getPotColorByCategory = (category: string): string => {
  switch (category) {
    case "positive":
      return "#E9C46A" // Warm yellow/gold
    case "negative":
      return "#264653" // Deep teal
    case "neutral":
      return "#E9ECEF" // Light gray
    case "special":
      return "#9D4EDD" // Purple
    default:
      return "#6B705C" // Earthy green
  }
}

// Update a plant's growth based on consistency streak
export const updatePlantGrowth = (plant: Plant, newStreak: number, currentDate: string): Plant => {
  // Calculate new growth stage based on streak
  // The plant grows every 2 consecutive days, up to its maximum
  const newGrowthStage = Math.min(Math.floor(newStreak / 2), plant.maxGrowthStage)

  // Add new features as the plant grows
  const updatedFeatures = [...plant.features]
  if (newGrowthStage > plant.growthStage) {
    // Add new features at certain growth milestones
    if (newGrowthStage >= 3 && !updatedFeatures.includes("mature")) {
      updatedFeatures.push("mature")
    }
    if (newGrowthStage >= 4 && !updatedFeatures.includes("magnificent")) {
      updatedFeatures.push("magnificent")
    }
    if (newGrowthStage >= 5 && !updatedFeatures.includes("transcendent")) {
      updatedFeatures.push("transcendent")
    }
  }

  return {
    ...plant,
    growthStage: newGrowthStage,
    lastGrownDate: currentDate,
    consistencyStreak: newStreak,
    features: updatedFeatures,
  }
}
