"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"
import { useAppContext } from "../context/AppContext"
import { getSeasonColors } from "../utils/seasonHelper"
import type { Emotion } from "../types"

// Predefined emotions
const emotions: Emotion[] = [
  // Positive emotions
  { id: "happy", name: "Happy", color: "#FFD166", intensity: 4, category: "positive" },
  { id: "excited", name: "Excited", color: "#FF9F1C", intensity: 5, category: "positive" },
  { id: "peaceful", name: "Peaceful", color: "#A0CED9", intensity: 3, category: "positive" },
  { id: "content", name: "Content", color: "#83C5BE", intensity: 3, category: "positive" },
  { id: "hopeful", name: "Hopeful", color: "#ADE8F4", intensity: 4, category: "positive" },

  // Negative emotions
  { id: "sad", name: "Sad", color: "#6B88FE", intensity: 3, category: "negative" },
  { id: "anxious", name: "Anxious", color: "#9381FF", intensity: 4, category: "negative" },
  { id: "frustrated", name: "Frustrated", color: "#F25F5C", intensity: 4, category: "negative" },
  { id: "tired", name: "Tired", color: "#8896AB", intensity: 2, category: "negative" },
  { id: "lonely", name: "Lonely", color: "#7D80DA", intensity: 3, category: "negative" },

  // Neutral emotions
  { id: "curious", name: "Curious", color: "#C8E7FF", intensity: 3, category: "neutral" },
  { id: "reflective", name: "Reflective", color: "#D0D1FF", intensity: 2, category: "neutral" },
  { id: "calm", name: "Calm", color: "#E0FBFC", intensity: 2, category: "neutral" },
  { id: "focused", name: "Focused", color: "#CDEDF6", intensity: 3, category: "neutral" },

  // Special emotions (rarer)
  { id: "grateful", name: "Grateful", color: "#FFCFD2", intensity: 4, category: "special" },
  { id: "inspired", name: "Inspired", color: "#FFC6FF", intensity: 5, category: "special" },
  { id: "proud", name: "Proud", color: "#FDFFB6", intensity: 5, category: "special" },
  { id: "loved", name: "Loved", color: "#FFADAD", intensity: 5, category: "special" },
]

export default function EmotionSelectionScreen() {
  const navigation = useNavigation()
  const { currentSeason, addOrGrowPlant, lastEmotionId, plants } = useAppContext()
  const seasonColors = getSeasonColors(currentSeason)
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null)
  const [emotionIntensity, setEmotionIntensity] = useState<number>(3)
  const [continuingStreak, setContinuingStreak] = useState<boolean>(false)

  // Check if the selected emotion continues a streak
  useEffect(() => {
    if (selectedEmotion && lastEmotionId === selectedEmotion.id) {
      setContinuingStreak(true)
    } else {
      setContinuingStreak(false)
    }
  }, [selectedEmotion, lastEmotionId])

  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion)

    // Find if this emotion already has a plant
    const existingPlant = plants.find((plant) => plant.emotion.id === emotion.id)

    // Set default intensity based on existing plant or emotion default
    if (existingPlant) {
      setEmotionIntensity(existingPlant.emotion.intensity)
    } else {
      setEmotionIntensity(emotion.intensity)
    }
  }

  const handleIntensityChange = (intensity: number) => {
    setEmotionIntensity(intensity)
  }

  const handleConfirm = () => {
    if (selectedEmotion) {
      // Create a copy of the emotion with the selected intensity
      const emotionWithIntensity = {
        ...selectedEmotion,
        intensity: emotionIntensity,
      }

      // Add or grow the plant based on this emotion
      const result = addOrGrowPlant(emotionWithIntensity)

      // Show appropriate message based on whether it's a new plant or growing an existing one
      if (result.isNewPlant) {
        Alert.alert(
          "New Plant Created",
          `You've planted a new ${result.plant.name}! Your plant has been watered and will start growing.`,
        )
      } else {
        Alert.alert(
          "Plant Growing",
          `Your ${result.plant.name} has been watered and is growing stronger! Your consistency streak is now ${result.plant.consistencyStreak} days.`,
        )
      }

      // Navigate back to home
      navigation.navigate("Home")
    }
  }

  const renderEmotionItem = ({ item }: { item: Emotion }) => {
    // Check if this emotion already has a plant
    const existingPlant = plants.find((plant) => plant.emotion.id === item.id)

    return (
      <TouchableOpacity
        style={[
          styles.emotionButton,
          { backgroundColor: item.color + "80" }, // Add transparency
          selectedEmotion?.id === item.id && styles.selectedEmotion,
          existingPlant && styles.existingEmotionPlant,
        ]}
        onPress={() => handleEmotionSelect(item)}
      >
        <Text style={styles.emotionText}>{item.name}</Text>
        {existingPlant && (
          <View style={styles.plantIndicator}>
            <Text style={styles.plantIndicatorText}>
              {existingPlant.consistencyStreak > 1 ? `${existingPlant.consistencyStreak}d` : ""}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[seasonColors.primary, seasonColors.secondary]} style={styles.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={seasonColors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: seasonColors.text }]}>How do you feel today?</Text>
      </View>

      <View style={styles.content}>
        <FlatList
          data={emotions}
          renderItem={renderEmotionItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.emotionsGrid}
        />

        {selectedEmotion && (
          <View style={styles.intensityContainer}>
            <Text style={[styles.intensityTitle, { color: seasonColors.text }]}>
              How {selectedEmotion.name.toLowerCase()} do you feel?
            </Text>

            <View style={styles.intensityButtons}>
              {[1, 2, 3, 4, 5].map((intensity) => (
                <TouchableOpacity
                  key={intensity}
                  style={[
                    styles.intensityButton,
                    { backgroundColor: selectedEmotion.color + "80" },
                    emotionIntensity === intensity && styles.selectedIntensity,
                  ]}
                  onPress={() => handleIntensityChange(intensity)}
                >
                  <Text style={styles.intensityText}>{intensity}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {continuingStreak && (
              <View style={[styles.streakIndicator, { backgroundColor: selectedEmotion.color + "40" }]}>
                <Feather name="trending-up" size={16} color={selectedEmotion.color} style={styles.streakIcon} />
                <Text style={[styles.streakText, { color: selectedEmotion.color }]}>
                  Continuing your emotional consistency will help your plant grow!
                </Text>
              </View>
            )}

            <View style={styles.wateringInfo}>
              <Feather name="droplet" size={16} color="#3B82F6" style={styles.wateringIcon} />
              <Text style={styles.wateringText}>Logging your emotion will automatically water your plant</Text>
            </View>

            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: selectedEmotion.color }]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmText}>{continuingStreak ? "Continue Growing" : "Plant this feeling"}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: "Comfortaa-Bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emotionsGrid: {
    paddingVertical: 8,
  },
  emotionButton: {
    flex: 1,
    margin: 6,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
    position: "relative",
  },
  selectedEmotion: {
    borderWidth: 2,
    borderColor: "#000",
    transform: [{ scale: 1.05 }],
  },
  existingEmotionPlant: {
    borderLeftWidth: 4,
    borderLeftColor: "#000",
  },
  emotionText: {
    fontFamily: "Comfortaa-Bold",
    color: "#333",
    textAlign: "center",
  },
  plantIndicator: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  plantIndicatorText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  intensityContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 16,
  },
  intensityTitle: {
    fontSize: 18,
    fontFamily: "Comfortaa-Bold",
    marginBottom: 16,
    textAlign: "center",
  },
  intensityButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  intensityButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedIntensity: {
    borderWidth: 2,
    borderColor: "#000",
    transform: [{ scale: 1.1 }],
  },
  intensityText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 18,
    color: "#333",
  },
  streakIndicator: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  streakIcon: {
    marginRight: 8,
  },
  streakText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 14,
    flex: 1,
  },
  confirmButton: {
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 18,
    color: "#333",
  },
  wateringInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 12,
    marginBottom: 16,
  },
  wateringIcon: {
    marginRight: 8,
  },
  wateringText: {
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    color: "#555",
    flex: 1,
  },
})
