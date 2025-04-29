"use client"

import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated } from "react-native"
import type { Plant, Season } from "../types"

interface PlantComponentProps {
  plant: Plant
  onPress: () => void
  selected: boolean
  season: Season
  size?: "normal" | "large"
}

export default function PlantComponent({ plant, onPress, selected, season, size = "normal" }: PlantComponentProps) {
  // Animation for plant growth
  const [scaleAnim] = React.useState(new Animated.Value(1))
  const [rotateAnim] = React.useState(new Animated.Value(0))

  React.useEffect(() => {
    // Gentle swaying animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 2000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Pulse animation when selected
    if (selected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start()
    } else {
      scaleAnim.setValue(1)
    }
  }, [selected, rotateAnim, scaleAnim])

  // Render the pot based on the plant's pot type
  const renderPot = () => {
    const potSize = size === "large" ? styles.largePot : styles.pot
    const potColor = plant.potColor || getPotColorByCategory(plant.emotion.category)

    switch (plant.potType || getPotTypeByCategory(plant.emotion.category)) {
      case "round":
        return (
          <View style={[potSize, styles.roundPot, { backgroundColor: potColor }]}>
            <View style={styles.potSoil} />
            {plant.wateredToday && <View style={styles.moistSoil} />}
          </View>
        )
      case "square":
        return (
          <View style={[potSize, styles.squarePot, { backgroundColor: potColor }]}>
            <View style={styles.potSoil} />
            {plant.wateredToday && <View style={styles.moistSoil} />}
          </View>
        )
      case "hexagon":
        return (
          <View style={[potSize, styles.hexagonPot, { backgroundColor: potColor }]}>
            <View style={styles.potSoil} />
            {plant.wateredToday && <View style={styles.moistSoil} />}
          </View>
        )
      case "oval":
        return (
          <View style={[potSize, styles.ovalPot, { backgroundColor: potColor }]}>
            <View style={styles.potSoil} />
            {plant.wateredToday && <View style={styles.moistSoil} />}
          </View>
        )
      case "fancy":
        return (
          <View style={[potSize, styles.fancyPot, { backgroundColor: potColor }]}>
            <View style={[styles.fancyPotDetail, { backgroundColor: lightenColor(potColor, 30) }]} />
            <View style={styles.potSoil} />
            {plant.wateredToday && <View style={styles.moistSoil} />}
          </View>
        )
      default:
        return (
          <View style={[potSize, styles.roundPot, { backgroundColor: potColor }]}>
            <View style={styles.potSoil} />
            {plant.wateredToday && <View style={styles.moistSoil} />}
          </View>
        )
    }
  }

  // Fix the positioning of plant elements to ensure they grow upward from the pot
  // Update the renderPlant function to properly position plant elements

  // In the renderPlant function, update the positioning of plant elements
  const renderPlant = () => {
    const rotate = rotateAnim.interpolate({
      inputRange: [-1, 1],
      outputRange: ["-3deg", "3deg"],
    })

    const plantSize = size === "large" ? styles.largePlantContainer : styles.plantContainer

    return (
      <Animated.View
        style={[
          plantSize,
          {
            transform: [{ scale: scaleAnim }, { rotate }],
          },
        ]}
      >
        {renderPot()}

        {plant.growthStage === 0 && <View style={[styles.seed, { backgroundColor: plant.color }]}>{/* Seed */}</View>}

        {plant.growthStage === 1 && (
          <View style={styles.sproutContainer}>
            <View style={[styles.stem, { height: size === "large" ? 30 : 20 }]} />
            <View style={[styles.leaf, { backgroundColor: plant.color + "80" }]} />
          </View>
        )}

        {plant.growthStage === 2 && (
          <View style={styles.growingContainer}>
            <View style={[styles.stem, { height: size === "large" ? 50 : 35 }]} />
            <View style={[styles.leaf, { backgroundColor: plant.color + "80" }]} />
            <View style={[styles.leaf, styles.leafRight, { backgroundColor: plant.color + "80" }]} />
            <View style={[styles.bud, { backgroundColor: plant.color }]} />
          </View>
        )}

        {plant.growthStage === 3 && (
          <View style={styles.buddingContainer}>
            <View style={[styles.stem, { height: size === "large" ? 60 : 40 }]} />
            <View style={[styles.leaf, { backgroundColor: plant.color + "80" }]} />
            <View style={[styles.leaf, styles.leafRight, { backgroundColor: plant.color + "80" }]} />
            <View style={[styles.leaf, styles.leafTop, { backgroundColor: plant.color + "80" }]} />
            <View style={[styles.bud, { backgroundColor: plant.color }]} />
            <View style={[styles.smallBud, { backgroundColor: plant.color }]} />
          </View>
        )}

        {plant.growthStage === 4 && (
          <View style={styles.bloomedContainer}>
            <View style={[styles.stem, { height: size === "large" ? 70 : 50 }]} />
            <View style={[styles.leaf, { backgroundColor: plant.color + "80" }]} />
            <View style={[styles.leaf, styles.leafRight, { backgroundColor: plant.color + "80" }]} />
            <View style={[styles.leaf, styles.leafTop, { backgroundColor: plant.color + "80" }]} />
            <View style={[styles.flower, { backgroundColor: plant.color }]}>
              {plant.features.includes("glowing") && (
                <View style={[styles.glow, { backgroundColor: plant.color + "40" }]} />
              )}
              {plant.features.includes("translucent") && (
                <View style={[styles.translucent, { backgroundColor: "#fff" }]} />
              )}
            </View>
          </View>
        )}

        {plant.growthStage >= 5 && (
          <View style={styles.magnificentContainer}>
            <View style={[styles.stem, { height: size === "large" ? 80 : 60 }]} />
            <View style={[styles.leaf, { backgroundColor: plant.color + "80" }]} />
            <View style={[styles.leaf, styles.leafRight, { backgroundColor: plant.color + "80" }]} />
            <View style={[styles.leaf, styles.leafTop, { backgroundColor: plant.color + "80" }]} />
            <View style={[styles.leaf, styles.leafTopRight, { backgroundColor: plant.color + "80" }]} />
            <View style={[styles.magnificentFlower, { backgroundColor: plant.color }]}>
              <View style={[styles.innerFlower, { backgroundColor: lightenColor(plant.color, 30) }]} />
              {plant.features.includes("glowing") && (
                <View style={[styles.magnificentGlow, { backgroundColor: plant.color + "40" }]} />
              )}
            </View>
            {plant.features.includes("sparkling") && (
              <View style={styles.sparkleContainer}>
                <View style={[styles.sparkle, { backgroundColor: "#fff" }]} />
                <View style={[styles.sparkle, styles.sparkleRight, { backgroundColor: "#fff" }]} />
                <View style={[styles.sparkle, styles.sparkleTop, { backgroundColor: "#fff" }]} />
              </View>
            )}
          </View>
        )}
      </Animated.View>
    )
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { left: `${plant.position.x}%`, top: `${plant.position.y}%` },
        selected && styles.selected,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {renderPlant()}

      {/* Consistency streak indicator */}
      {plant.consistencyStreak > 1 && (
        <View
          style={[
            styles.streakIndicator,
            { backgroundColor: plant.emotion.color, borderColor: lightenColor(plant.emotion.color, 30) },
          ]}
        >
          <Text style={styles.streakText}>{plant.consistencyStreak}</Text>
        </View>
      )}

      {/* Rarity indicator for rare and legendary plants */}
      {(plant.rarity === "rare" || plant.rarity === "legendary") && (
        <View
          style={[styles.rarityIndicator, { backgroundColor: plant.rarity === "legendary" ? "#8B5CF6" : "#3B82F6" }]}
        >
          <Text style={styles.rarityText}>{plant.rarity === "legendary" ? "★★★" : "★★"}</Text>
        </View>
      )}
    </TouchableOpacity>
  )
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

// Helper function to lighten a color
const lightenColor = (color: string, percent: number): string => {
  // Simple implementation - in a real app, use a proper color library
  if (color.startsWith("#")) {
    const hex = color.slice(1)
    const r = Number.parseInt(hex.slice(0, 2), 16)
    const g = Number.parseInt(hex.slice(2, 4), 16)
    const b = Number.parseInt(hex.slice(4, 6), 16)

    const lightenValue = (value: number) => Math.min(255, value + (255 - value) * (percent / 100))

    const rNew = Math.round(lightenValue(r)).toString(16).padStart(2, "0")
    const gNew = Math.round(lightenValue(g)).toString(16).padStart(2, "0")
    const bNew = Math.round(lightenValue(b)).toString(16).padStart(2, "0")

    return `#${rNew}${gNew}${bNew}`
  }
  return color
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 80,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  selected: {
    zIndex: 2,
  },
  plantContainer: {
    width: 80,
    height: 100,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  largePlantContainer: {
    width: 140,
    height: 180,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  // Pot styles
  pot: {
    width: 50,
    height: 40,
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: "hidden",
  },
  largePot: {
    width: 80,
    height: 60,
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    overflow: "hidden",
  },
  roundPot: {
    borderRadius: 25,
  },
  squarePot: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  hexagonPot: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  ovalPot: {
    borderRadius: 20,
    height: 35,
  },
  fancyPot: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  fancyPotDetail: {
    position: "absolute",
    top: 5,
    left: 5,
    right: 5,
    height: 10,
    borderRadius: 5,
  },
  potSoil: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 15,
    backgroundColor: "#5E503F",
  },
  moistSoil: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 15,
    backgroundColor: "#3A2E1F",
  },
  // Plant growth stages
  seed: {
    position: "absolute",
    bottom: 30,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#8B5CF6",
    zIndex: 2,
  },
  sproutContainer: {
    position: "absolute",
    bottom: 30,
    alignItems: "center",
    zIndex: 2,
  },
  stem: {
    width: 3,
    height: 20,
    backgroundColor: "#4ADE80",
    zIndex: 1,
  },
  leaf: {
    position: "absolute",
    width: 15,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(74, 222, 128, 0.5)",
    transform: [{ rotate: "30deg" }],
    left: -8,
    top: 10,
    zIndex: 2,
  },
  leafRight: {
    left: 8,
    transform: [{ rotate: "-30deg" }],
  },
  leafTop: {
    left: -8,
    top: 5,
    transform: [{ rotate: "60deg" }],
  },
  leafTopRight: {
    left: 8,
    top: 5,
    transform: [{ rotate: "-60deg" }],
  },
  growingContainer: {
    position: "absolute",
    bottom: 30,
    alignItems: "center",
    zIndex: 2,
  },
  buddingContainer: {
    position: "absolute",
    bottom: 30,
    alignItems: "center",
    zIndex: 2,
  },
  bud: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: "#8B5CF6",
    zIndex: 3,
  },
  smallBud: {
    position: "absolute",
    top: 15,
    right: -5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#8B5CF6",
    zIndex: 3,
  },
  bloomedContainer: {
    position: "absolute",
    bottom: 30,
    alignItems: "center",
    zIndex: 2,
  },
  flower: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
  glow: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(139, 92, 246, 0.3)",
    zIndex: 2,
  },
  translucent: {
    position: "absolute",
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    zIndex: 4,
  },
  magnificentContainer: {
    position: "absolute",
    bottom: 30,
    alignItems: "center",
    zIndex: 2,
  },
  magnificentFlower: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
  innerFlower: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#D8B4FE",
    zIndex: 4,
  },
  magnificentGlow: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(139, 92, 246, 0.3)",
    zIndex: 2,
  },
  sparkleContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  sparkle: {
    position: "absolute",
    top: 5,
    left: -15,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    opacity: 0.8,
  },
  sparkleRight: {
    left: 15,
    top: 10,
  },
  sparkleTop: {
    left: 0,
    top: -5,
  },
  streakIndicator: {
    position: "absolute",
    top: 0,
    right: 15,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3B82F6",
    borderWidth: 2,
    borderColor: "#93C5FD",
    alignItems: "center",
    justifyContent: "center",
  },
  streakText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  rarityIndicator: {
    position: "absolute",
    top: 0,
    left: 15,
    backgroundColor: "#3B82F6",
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  rarityText: {
    color: "white",
    fontSize: 8,
    fontWeight: "bold",
  },
})
