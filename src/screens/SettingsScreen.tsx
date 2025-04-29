"use client"

import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"
import { useAppContext } from "../context/AppContext"
import { getSeasonColors } from "../utils/seasonHelper"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function SettingsScreen() {
  const navigation = useNavigation()
  const { currentSeason } = useAppContext()
  const seasonColors = getSeasonColors(currentSeason)
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true)
  const [soundEnabled, setSoundEnabled] = React.useState(true)

  const handleResetGarden = () => {
    Alert.alert(
      "Reset Garden",
      "Are you sure you want to reset your garden? This will remove all plants and progress.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("plants")
              await AsyncStorage.removeItem("lastEmotionDate")
              Alert.alert("Success", "Garden has been reset. Please restart the app.")
            } catch (error) {
              console.error("Error resetting garden:", error)
              Alert.alert("Error", "Failed to reset garden. Please try again.")
            }
          },
        },
      ],
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[seasonColors.primary, seasonColors.secondary]} style={styles.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={seasonColors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: seasonColors.text }]}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Daily Notifications</Text>
              <Text style={styles.settingDescription}>Remind me to log my emotions</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#ccc", true: seasonColors.accent }}
              thumbColor={notificationsEnabled ? seasonColors.text : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Sound Effects</Text>
              <Text style={styles.settingDescription}>Play sounds when interacting with plants</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: "#ccc", true: seasonColors.accent }}
              thumbColor={soundEnabled ? seasonColors.text : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Garden</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // This would navigate to a decoration shop in the full version
              Alert.alert("Decoration Shop", "This feature would be available in the full version!")
            }}
          >
            <Feather name="shopping-bag" size={20} color="#555" style={styles.actionIcon} />
            <Text style={styles.actionText}>Decoration Shop</Text>
            <Feather name="chevron-right" size={20} color="#888" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleResetGarden}>
            <Feather name="trash-2" size={20} color="#555" style={styles.actionIcon} />
            <Text style={styles.actionText}>Reset Garden</Text>
            <Feather name="chevron-right" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Mood Bloom</Text>
            <Text style={styles.infoVersion}>Version 1.0.0</Text>
            <Text style={styles.infoText}>
              A cozy casual mobile game where players grow a personal garden based on their daily emotions.
            </Text>
            <Text style={styles.infoText}>Created with React Native and Expo.</Text>
          </View>
        </View>
      </ScrollView>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Comfortaa-Bold",
    marginBottom: 16,
    color: "#555",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: "Comfortaa-Bold",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    fontFamily: "Comfortaa-Regular",
    color: "#666",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  actionIcon: {
    marginRight: 16,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Comfortaa-Bold",
  },
  infoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: "Comfortaa-Bold",
    textAlign: "center",
    marginBottom: 4,
  },
  infoVersion: {
    fontSize: 14,
    fontFamily: "Comfortaa-Regular",
    textAlign: "center",
    color: "#666",
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    fontFamily: "Comfortaa-Regular",
    color: "#555",
    marginBottom: 8,
    lineHeight: 20,
  },
})
