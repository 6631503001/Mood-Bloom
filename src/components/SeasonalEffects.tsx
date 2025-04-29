"use client"

import { useEffect, useState } from "react"
import { View, StyleSheet, Animated, Easing } from "react-native"
import type { Season } from "../types"

interface Particle {
  id: number
  position: Animated.ValueXY
  opacity: Animated.Value
  rotation: Animated.Value
  size: number
}

interface SeasonalEffectsProps {
  season: Season
}

export default function SeasonalEffects({ season }: SeasonalEffectsProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    // Initialize particles
    const initialParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      position: new Animated.ValueXY({ x: Math.random() * 100, y: -20 }),
      opacity: new Animated.Value(Math.random() * 0.5 + 0.5),
      rotation: new Animated.Value(0),
      size: Math.random() * 10 + 5,
    }))
    setParticles(initialParticles)

    // Animate each particle
    initialParticles.forEach((particle) => {
      const animateParticle = () => {
        // Reset position
        particle.position.setValue({ x: Math.random() * 100, y: -20 })
        particle.opacity.setValue(Math.random() * 0.5 + 0.5)

        // Create animation sequence
        Animated.parallel([
          Animated.timing(particle.position.y, {
            toValue: 120,
            duration: 5000 + Math.random() * 5000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(particle.position.x, {
            toValue: particle.position.x._value + (Math.random() * 40 - 20),
            duration: 5000 + Math.random() * 5000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: 5000 + Math.random() * 5000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(particle.rotation, {
            toValue: 360,
            duration: 5000 + Math.random() * 5000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Restart animation
          animateParticle()
        })
      }

      animateParticle()
    })

    // Cleanup function to stop animations when the component unmounts or the season changes
    return () => {
      initialParticles.forEach((particle) => {
        particle.position.stopAnimation()
        particle.opacity.stopAnimation()
        particle.rotation.stopAnimation()
      })
    }
  }, [season])

  const getParticleStyle = (season: Season) => {
    switch (season) {
      case "spring":
        return styles.petalParticle
      case "summer":
        return styles.fireflyParticle
      case "autumn":
        return styles.leafParticle
      case "winter":
        return styles.snowParticle
    }
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => {
        const rotate = particle.rotation.interpolate({
          inputRange: [0, 360],
          outputRange: ["0deg", "360deg"],
        })

        return (
          <Animated.View
            key={particle.id}
            style={[
              getParticleStyle(season),
              {
                width: particle.size,
                height: particle.size,
                opacity: particle.opacity,
                transform: [{ translateX: particle.position.x }, { translateY: particle.position.y }, { rotate }],
              },
            ]}
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  petalParticle: {
    position: "absolute",
    backgroundColor: "#FFCFD2",
    borderRadius: 5,
    width: 10,
    height: 10,
  },
  fireflyParticle: {
    position: "absolute",
    backgroundColor: "#FDFFB6",
    borderRadius: 10,
    width: 5,
    height: 5,
  },
  leafParticle: {
    position: "absolute",
    backgroundColor: "#F4A261",
    borderRadius: 2,
    width: 10,
    height: 10,
  },
  snowParticle: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    width: 8,
    height: 8,
  },
})
