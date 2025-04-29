"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { StatusBar } from "expo-status-bar"
import { useAppContext } from "../context/AppContext"
import { getSeasonColors } from "../utils/seasonHelper"
import PlantComponent from "../components/PlantComponent"
import DecorationComponent from "../components/DecorationComponent"
import SeasonalEffects from "../components/SeasonalEffects"
import { Feather } from "@expo/vector-icons"

export default function HomeScreen() {
  const navigation = useNavigation()
  const { plants, currentSeason, canLogEmotion, decorations } = useAppContext()
  const seasonColors = getSeasonColors(currentSeason)
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null)

  const handlePlantPress = (plantId: string) => {
    setSelectedPlantId(plantId)
    navigation.navigate("PlantDetail", { plantId })
  }

  const handleAddEmotion = () => {
    navigation.navigate("EmotionSelection")
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient colors={[seasonColors.primary, seasonColors.secondary]} style={styles.background} />

      <SeasonalEffects season={currentSeason} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: seasonColors.text }]}>Mood Bloom</Text>
        <Text style={[styles.seasonText, { color: seasonColors.text }]}>
          {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)}
        </Text>
      </View>

      <View style={styles.gardenContainer}>
        {/* Garden background */}
        <View style={styles.gardenBackground} />

        {/* Decorations */}
        {decorations.map((decoration, index) => (
          <DecorationComponent
            key={index}
            type={decoration}
            position={{
              x: 20 + ((index * 60) % 300),
              y: 50 + Math.floor((index * 60) / 300) * 80,
            }}
          />
        ))}

        {/* Plants */}
        <ScrollView contentContainerStyle={styles.gardenContent} showsVerticalScrollIndicator={false}>
          {plants.map((plant) => (
            <PlantComponent
              key={plant.id}
              plant={plant}
              onPress={() => handlePlantPress(plant.id)}
              selected={selectedPlantId === plant.id}
              season={currentSeason}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("FriendGardens")}>
          <Feather name="users" size={24} color={seasonColors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.addEmotionButton, { backgroundColor: canLogEmotion ? seasonColors.accent : "#ccc" }]}
          onPress={handleAddEmotion}
          //disabled={!canLogEmotion}
        >
          <Text style={[styles.addEmotionText, { color: seasonColors.text }]}>
            {canLogEmotion ? "How do you feel today?" : "Come back tomorrow"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Settings")}>
          <Feather name="settings" size={24} color={seasonColors.text} />
        </TouchableOpacity>
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
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "Comfortaa-Bold",
    marginBottom: 4,
  },
  seasonText: {
    fontSize: 16,
    fontFamily: "Comfortaa-Regular",
    opacity: 0.8,
  },
  gardenContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  gardenBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 20,
  },
  gardenContent: {
    minHeight: "100%",
    padding: 16,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  addEmotionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  addEmotionText: {
    fontFamily: "Comfortaa-Bold",
    fontSize: 16,
  },
})
