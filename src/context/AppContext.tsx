"use client"

// Update the AppContext to handle emotion consistency and plant growth
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Plant, Emotion, Season, Friend } from "../types"
import { generatePlantFromEmotion, updatePlantGrowth } from "../utils/plantGenerator"
import { getCurrentSeason } from "../utils/seasonHelper"

interface AppContextType {
  plants: Plant[]
  friends: Friend[]
  lastEmotionDate: string | null
  lastEmotionId: string | null
  currentSeason: Season
  addOrGrowPlant: (emotion: Emotion) => { isNewPlant: boolean; plant: Plant }
  waterPlant: (plantId: string) => void
  canLogEmotion: boolean
  decorations: string[]
  addDecoration: (decoration: string) => void
  emotionStreak: number
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plants, setPlants] = useState<Plant[]>([])
  const [friends, setFriends] = useState<Friend[]>([])
  const [lastEmotionDate, setLastEmotionDate] = useState<string | null>(null)
  const [lastEmotionId, setLastEmotionId] = useState<string | null>(null)
  const [currentSeason, setCurrentSeason] = useState<Season>(getCurrentSeason())
  const [decorations, setDecorations] = useState<string[]>([])
  const [emotionStreak, setEmotionStreak] = useState<number>(0)

  // Load data from storage on app start
  useEffect(() => {
    const loadData = async () => {
      try {
        const plantsData = await AsyncStorage.getItem("plants")
        if (plantsData) setPlants(JSON.parse(plantsData))

        const friendsData = await AsyncStorage.getItem("friends")
        if (friendsData) setFriends(JSON.parse(friendsData))

        const lastDateData = await AsyncStorage.getItem("lastEmotionDate")
        if (lastDateData) setLastEmotionDate(lastDateData)

        const lastEmotionIdData = await AsyncStorage.getItem("lastEmotionId")
        if (lastEmotionIdData) setLastEmotionId(lastEmotionIdData)

        const emotionStreakData = await AsyncStorage.getItem("emotionStreak")
        if (emotionStreakData) setEmotionStreak(Number.parseInt(emotionStreakData, 10))

        const decorationsData = await AsyncStorage.getItem("decorations")
        if (decorationsData) setDecorations(JSON.parse(decorationsData))
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }

    loadData()
  }, [])

  // Save data to storage whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem("plants", JSON.stringify(plants))
        await AsyncStorage.setItem("friends", JSON.stringify(friends))
        if (lastEmotionDate) {
          await AsyncStorage.setItem("lastEmotionDate", lastEmotionDate)
        }
        if (lastEmotionId) {
          await AsyncStorage.setItem("lastEmotionId", lastEmotionId)
        }
        await AsyncStorage.setItem("emotionStreak", emotionStreak.toString())
        await AsyncStorage.setItem("decorations", JSON.stringify(decorations))
      } catch (error) {
        console.error("Error saving data:", error)
      }
    }

    saveData()
  }, [plants, friends, lastEmotionDate, lastEmotionId, emotionStreak, decorations])

  // Update season periodically
  useEffect(() => {
    const seasonInterval = setInterval(() => {
      setCurrentSeason(getCurrentSeason())
    }, 86400000) // Check once per day

    return () => clearInterval(seasonInterval)
  }, [])

  // Check if user can log emotion today
  const canLogEmotion = !lastEmotionDate || new Date(lastEmotionDate).toDateString() !== new Date().toDateString()

  // Add a new plant or grow an existing one based on emotion
  const addOrGrowPlant = (emotion: Emotion) => {
    const today = new Date()
    const todayString = today.toISOString()

    // Check if this emotion already has a plant
    const existingPlantIndex = plants.findIndex((plant) => plant.emotion.id === emotion.id)

    const updatedPlants = [...plants]
    let resultPlant: Plant
    let isNewPlant = false

    if (existingPlantIndex >= 0) {
      // Emotion plant exists, grow it
      const existingPlant = plants[existingPlantIndex]

      // Check if this is a consecutive day for this emotion
      const isConsecutive =
        lastEmotionId === emotion.id &&
        lastEmotionDate &&
        new Date(lastEmotionDate).toDateString() === new Date(today.getTime() - 86400000).toDateString()

      // Update streak
      const newStreak = isConsecutive ? existingPlant.consistencyStreak + 1 : 1
      setEmotionStreak(newStreak)

      // Update the plant and automatically water it
      const updatedPlant = updatePlantGrowth(existingPlant, newStreak, todayString)
      updatedPlants[existingPlantIndex] = {
        ...updatedPlant,
        wateredToday: true,
        lastWateredDate: todayString,
      }
      resultPlant = updatedPlants[existingPlantIndex]
    } else {
      // Create a new plant for this emotion (already watered)
      const newPlant = {
        ...generatePlantFromEmotion(emotion),
        wateredToday: true,
        lastWateredDate: todayString,
      }
      updatedPlants.push(newPlant)
      resultPlant = newPlant
      isNewPlant = true
      setEmotionStreak(1)
    }

    setPlants(updatedPlants)
    setLastEmotionDate(todayString)
    setLastEmotionId(emotion.id)

    return { isNewPlant, plant: resultPlant }
  }

  // Water a plant to increase its growth
  const waterPlant = (plantId: string) => {
    setPlants(
      plants.map((plant) => {
        if (plant.id === plantId && !plant.wateredToday) {
          return {
            ...plant,
            growthStage: Math.min(plant.growthStage + 1, plant.maxGrowthStage || 5),
            wateredToday: true,
            lastWateredDate: new Date().toISOString(),
          }
        }
        return plant
      }),
    )
  }

  // Add decoration to garden
  const addDecoration = (decoration: string) => {
    setDecorations([...decorations, decoration])
  }

  // Reset watered status daily
  // useEffect(() => {
  //   const resetWateredStatus = () => {
  //     const today = new Date().toDateString()
  //     setPlants(
  //       plants.map((plant) => {
  //         if (plant.lastWateredDate && new Date(plant.lastWateredDate).toDateString() !== today) {
  //           return { ...plant, wateredToday: false }
  //         }
  //         return plant
  //       }),
  //     )
  //   }

  //   const dailyReset = setInterval(resetWateredStatus, 3600000) // Check hourly
  //   resetWateredStatus() // Run once on mount

  //   return () => clearInterval(dailyReset)
  // }, [plants])

  // Grow plants over time
  // useEffect(() => {
  //   const growPlants = () => {
  //     const now = new Date()
  //     setPlants(
  //       plants.map((plant) => {
  //         const plantAge = now.getTime() - new Date(plant.plantedDate).getTime()
  //         const daysOld = Math.floor(plantAge / (1000 * 60 * 60 * 24))

  //         // Determine growth stage based on age
  //         let newGrowthStage = plant.growthStage
  //         if (daysOld >= 7 && plant.growthStage < 3) {
  //           newGrowthStage = 3 // Fully grown after 7 days
  //         } else if (daysOld >= 3 && plant.growthStage < 2) {
  //           newGrowthStage = 2 // Medium growth after 3 days
  //         } else if (daysOld >= 1 && plant.growthStage < 1) {
  //           newGrowthStage = 1 // Small growth after 1 day
  //         }

  //         if (newGrowthStage !== plant.growthStage) {
  //           return { ...plant, growthStage: newGrowthStage }
  //         }
  //         return plant
  //       }),
  //     )
  //   }

  //   const growthInterval = setInterval(growPlants, 3600000) // Check hourly
  //   growPlants() // Run once on mount

  //   return () => clearInterval(growthInterval)
  // }, [plants])

  return (
    <AppContext.Provider
      value={{
        plants,
        friends,
        lastEmotionDate,
        lastEmotionId,
        currentSeason,
        addOrGrowPlant,
        canLogEmotion,
        decorations,
        addDecoration,
        emotionStreak,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
