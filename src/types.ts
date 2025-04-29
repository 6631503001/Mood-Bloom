export type Emotion = {
  id: string
  name: string
  color: string
  intensity: number // 1-5 scale
  category: "positive" | "negative" | "neutral" | "special"
}

export type Plant = {
  id: string
  name: string
  type: string
  emotion: Emotion
  plantedDate: string
  lastGrownDate: string
  growthStage: number // 0-5 (seed, sprout, growing, budding, bloomed, magnificent)
  maxGrowthStage: number // Maximum growth stage this plant can reach
  consistencyStreak: number // How many consecutive days this emotion was logged
  wateredToday: boolean
  lastWateredDate: string | null
  color: string
  rarity: "common" | "uncommon" | "rare" | "legendary"
  features: string[] // e.g., "glowing", "translucent", "musical"
  position: { x: number; y: number }
  potType: "round" | "square" | "hexagon" | "oval" | "fancy" // New pot type property
  potColor: string // New pot color property
}

export type Season = "spring" | "summer" | "autumn" | "winter"

export type Friend = {
  id: string
  name: string
  avatar: string
  plants: Plant[]
  notes: Note[]
}

export type Note = {
  id: string
  text: string
  date: string
  fromFriendId: string
}

export type Decoration = {
  id: string
  type: "bench" | "lantern" | "bridge" | "fountain" | "statue"
  position: { x: number; y: number }
}

// Update the AppContextType interface to remove waterPlant
interface AppContextType {
  plants: Plant[]
  friends: Friend[]
  lastEmotionDate: string | null
  lastEmotionId: string | null
  currentSeason: Season
  addOrGrowPlant: (emotion: Emotion) => { isNewPlant: boolean; plant: Plant }
  canLogEmotion: boolean
  decorations: string[]
  addDecoration: (decoration: string) => void
  emotionStreak: number
}
