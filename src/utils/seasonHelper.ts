import type { Season } from "../types"

export const getCurrentSeason = (): Season => {
  const now = new Date()
  const month = now.getMonth()

  // Northern hemisphere seasons
  if (month >= 2 && month <= 4) {
    return "spring"
  } else if (month >= 5 && month <= 7) {
    return "summer"
  } else if (month >= 8 && month <= 10) {
    return "autumn"
  } else {
    return "winter"
  }
}

export const getSeasonColors = (season: Season) => {
  switch (season) {
    case "spring":
      return {
        primary: "#F9F5FF",
        secondary: "#E6FFEA",
        accent: "#FFD6E8",
        text: "#5D4777",
      }
    case "summer":
      return {
        primary: "#FFFBF5",
        secondary: "#FFF8E6",
        accent: "#FFE8CC",
        text: "#775D47",
      }
    case "autumn":
      return {
        primary: "#FFF8F5",
        secondary: "#FFEEE6",
        accent: "#FFD6CC",
        text: "#774747",
      }
    case "winter":
      return {
        primary: "#F5F8FF",
        secondary: "#E6EEFF",
        accent: "#CCE0FF",
        text: "#475D77",
      }
  }
}

export const getSeasonEffects = (season: Season) => {
  switch (season) {
    case "spring":
      return {
        particleEffect: "petals",
        growthBonus: 1.2,
        ambientSound: "spring_birds.mp3",
      }
    case "summer":
      return {
        particleEffect: "fireflies",
        growthBonus: 1.5,
        ambientSound: "summer_cicadas.mp3",
      }
    case "autumn":
      return {
        particleEffect: "leaves",
        growthBonus: 0.8,
        ambientSound: "autumn_wind.mp3",
      }
    case "winter":
      return {
        particleEffect: "snow",
        growthBonus: 0.5,
        ambientSound: "winter_quiet.mp3",
      }
  }
}
