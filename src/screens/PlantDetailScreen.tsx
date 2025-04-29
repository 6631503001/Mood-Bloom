"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation, useRoute } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"
import { useAppContext } from "../context/AppContext"
import { getSeasonColors } from "../utils/seasonHelper"
import type { Plant } from "../types"
import PlantComponent from "../components/PlantComponent"
import { format } from "date-fns"

export default function PlantDetailScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { plantId } = route.params || {}
  const { plants, currentSeason } = useAppContext()
  const seasonColors = getSeasonColors(currentSeason)
  const [plant, setPlant] = useState<Plant | null>(null)

  useEffect(() => {
    if (plantId) {
      const foundPlant = plants.find((p) => p.id === plantId)
      if (foundPlant) {
        setPlant(foundPlant)
      } else {
        // Plant not found, go back
        navigation.goBack()
      }
    }
  }, [plantId, plants, navigation])

  if (!plant) {
    return null
  }

  const getPlantAge = () => {
    const plantDate = new Date(plant.plantedDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - plantDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return "Today"
    } else if (diffDays === 1) {
      return "Yesterday"
    } else {
      return `${diffDays} days ago`
    }
  }

  const getGrowthStageText = () => {
    switch (plant.growthStage) {
      case 0:
        return "Seed"
      case 1:
        return "Sprout"
      case 2:
        return "Growing"
      case 3:
        return "Budding"
      case 4:
        return "Bloomed"
      case 5:
        return "Magnificent"
      default:
        return "Unknown"
    }
  }

  const getConsistencyMessage = () => {
    if (plant.consistencyStreak <= 1) {
      return "You just started feeling this emotion. Log it again tomorrow to help your plant grow!"
    } else if (plant.consistencyStreak < 4) {
      return `You've felt ${plant.emotion.name.toLowerCase()} for ${plant.consistencyStreak} days in a row. Your plant is growing steadily!`
    } else if (plant.consistencyStreak < 7) {
      return `Impressive! You've maintained this emotion for ${plant.consistencyStreak} consecutive days. Your plant is thriving!`
    } else {
      return `Amazing consistency! ${plant.consistencyStreak} days of the same emotion has made your plant extraordinary!`
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[seasonColors.primary, seasonColors.secondary]} style={styles.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={seasonColors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: seasonColors.text }]}>{plant.name}</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.plantContainer}>
          <PlantComponent plant={plant} onPress={() => {}} selected={false} season={currentSeason} size="large" />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Plant Details</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Emotion:</Text>
            <View style={[styles.emotionTag, { backgroundColor: plant.emotion.color + "80" }]}>
              <Text style={styles.emotionText}>{plant.emotion.name}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Planted:</Text>
            <Text style={styles.infoValue}>
              {format(new Date(plant.plantedDate), "MMMM d, yyyy")} ({getPlantAge()})
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Growth:</Text>
            <Text style={styles.infoValue}>
              {getGrowthStageText()} ({plant.growthStage}/{plant.maxGrowthStage})
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Consistency:</Text>
            <Text style={styles.infoValue}>
              {plant.consistencyStreak} day{plant.consistencyStreak !== 1 ? "s" : ""}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rarity:</Text>
            <Text style={[styles.infoValue, styles.rarityText, { color: getRarityColor(plant.rarity) }]}>
              {plant.rarity.charAt(0).toUpperCase() + plant.rarity.slice(1)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Features:</Text>
            <View style={styles.featuresContainer}>
              {plant.features.map((feature, index) => (
                <Text key={index} style={styles.featureText}>
                  {feature}
                  {index < plant.features.length - 1 ? ", " : ""}
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.consistencyContainer}>
            <Text style={styles.consistencyTitle}>Emotional Consistency</Text>
            <View style={styles.streakBar}>
              {Array.from({ length: 7 }).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.streakDot,
                    index < plant.consistencyStreak
                      ? { backgroundColor: plant.emotion.color }
                      : { backgroundColor: "#ddd" },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.consistencyText}>{getConsistencyMessage()}</Text>
          </View>

          <View style={styles.memoryContainer}>
            <Text style={styles.memoryTitle}>Memory</Text>
            <Text style={styles.memoryText}>
              Since {format(new Date(plant.plantedDate), "MMMM d, yyyy")}, you've felt{" "}
              <Text style={{ fontWeight: "bold", color: plant.emotion.color }}>{plant.emotion.name.toLowerCase()}</Text>
              {plant.emotion.intensity > 3 ? " very" : ""} {plant.emotion.intensity > 4 ? " strongly" : ""}. This{" "}
              {plant.name.toLowerCase()} has been growing with your consistent emotions.
            </Text>
          </View>

          {/* Watering info instead of button */}
          <View style={styles.wateringInfo}>
            <Feather name="info" size={20} color={seasonColors.text} />
            <Text style={styles.wateringInfoText}>
              Plants are automatically watered when you log the same emotion again.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "common":
      return "#6B7280"
    case "uncommon":
      return "#10B981"
    case "rare":
      return "#3B82F6"
    case "legendary":
      return "#8B5CF6"
    default:
      return "#6B7280"
  }
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
  },
  contentContainer: {
    padding: 16,
  },
  plantContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  infoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: "Comfortaa-Bold",
    marginBottom: 16,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },
  infoLabel: {
    width: 90,
    fontSize: 14,
    fontFamily: "Comfortaa-Bold",
    color: "#555",
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Comfortaa-Regular",
  },
  emotionTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emotionText: {
    fontFamily: "Comfortaa-Bold",
    color: "#333",
  },
  rarityText: {
    fontFamily: "Comfortaa-Bold",
  },
  featuresContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  featureText: {
    fontSize: 14,
    fontFamily: "Comfortaa-Regular",
  },
  consistencyContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 12,
  },
  consistencyTitle: {
    fontSize: 16,
    fontFamily: "Comfortaa-Bold",
    marginBottom: 12,
    textAlign: "center",
  },
  streakBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  streakDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ddd",
  },
  consistencyText: {
    fontSize: 14,
    fontFamily: "Comfortaa-Regular",
    lineHeight: 20,
    textAlign: "center",
  },
  memoryContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 12,
  },
  memoryTitle: {
    fontSize: 16,
    fontFamily: "Comfortaa-Bold",
    marginBottom: 8,
    textAlign: "center",
  },
  memoryText: {
    fontSize: 14,
    fontFamily: "Comfortaa-Regular",
    lineHeight: 22,
  },
  wateringInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  wateringInfoText: {
    marginLeft: 8,
    fontFamily: "Comfortaa-Regular",
    fontSize: 14,
    flex: 1,
  },
})
