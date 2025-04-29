"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"
import { useAppContext } from "../context/AppContext"
import { getSeasonColors } from "../utils/seasonHelper"
import type { Friend } from "../types"

// Sample friends data
const sampleFriends: Friend[] = [
  {
    id: "1",
    name: "Emma",
    avatar: "https://i.pravatar.cc/150?img=1",
    plants: [],
    notes: [],
  },
  {
    id: "2",
    name: "Liam",
    avatar: "https://i.pravatar.cc/150?img=2",
    plants: [],
    notes: [],
  },
  {
    id: "3",
    name: "Olivia",
    avatar: "https://i.pravatar.cc/150?img=3",
    plants: [],
    notes: [],
  },
]

export default function FriendGardensScreen() {
  const navigation = useNavigation()
  const { currentSeason, friends } = useAppContext()
  const seasonColors = getSeasonColors(currentSeason)
  const [allFriends] = useState<Friend[]>(friends.length > 0 ? friends : sampleFriends)

  const renderFriendItem = ({ item }: { item: Friend }) => (
    <TouchableOpacity
      style={styles.friendCard}
      onPress={() => {
        // In a full implementation, this would navigate to the friend's garden
        // For now, we'll just show a placeholder
        alert(`Visiting ${item.name}'s garden would be implemented in the full version!`)
      }}
    >
      <Image
        source={{ uri: item.avatar }}
        style={styles.avatar}
        defaultSource={require("../../assets/default-avatar.png")}
      />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.name}</Text>
        <Text style={styles.friendStats}>
          {item.plants.length} plants • {item.notes.length} notes
        </Text>
      </View>
      <Feather name="chevron-right" size={24} color="#888" />
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[seasonColors.primary, seasonColors.secondary]} style={styles.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={seasonColors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: seasonColors.text }]}>Friend Gardens</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Visit a friend's garden</Text>

        <FlatList
          data={allFriends}
          renderItem={renderFriendItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.friendsList}
        />

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Friend Gardens</Text>
          <Text style={styles.infoText}>
            In the full version, you would be able to visit your friends' gardens, see what emotions they've been
            planting, and leave friendly notes for them.
          </Text>
          <Text style={styles.infoText}>
            You could also send seeds as gifts and collaborate on special garden projects!
          </Text>
        </View>
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
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Comfortaa-Bold",
    marginBottom: 16,
    color: "#555",
  },
  friendsList: {
    paddingBottom: 16,
  },
  friendCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontFamily: "Comfortaa-Bold",
    marginBottom: 4,
  },
  friendStats: {
    fontSize: 12,
    fontFamily: "Comfortaa-Regular",
    color: "#666",
  },
  infoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: "Comfortaa-Bold",
    marginBottom: 12,
    textAlign: "center",
  },
  infoText: {
    fontSize: 14,
    fontFamily: "Comfortaa-Regular",
    color: "#555",
    marginBottom: 8,
    lineHeight: 20,
  },
})
