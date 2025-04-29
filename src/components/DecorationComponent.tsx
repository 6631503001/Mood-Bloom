import { View, StyleSheet } from "react-native"
import { Feather } from "@expo/vector-icons"

interface DecorationComponentProps {
  type: string
  position: { x: number; y: number }
}

export default function DecorationComponent({ type, position }: DecorationComponentProps) {
  const renderDecoration = () => {
    switch (type) {
      case "bench":
        return (
          <View style={styles.bench}>
            <View style={styles.benchSeat} />
            <View style={styles.benchLeg} />
            <View style={[styles.benchLeg, { right: 5 }]} />
          </View>
        )
      case "lantern":
        return (
          <View style={styles.lantern}>
            <View style={styles.lanternTop} />
            <View style={styles.lanternBody} />
            <View style={styles.lanternLight} />
            <View style={styles.lanternBase} />
          </View>
        )
      case "bridge":
        return (
          <View style={styles.bridge}>
            <View style={styles.bridgeArch} />
            <View style={styles.bridgeDeck} />
            <View style={styles.bridgeRail} />
            <View style={[styles.bridgeRail, { bottom: 15 }]} />
          </View>
        )
      case "fountain":
        return (
          <View style={styles.fountain}>
            <View style={styles.fountainBase} />
            <View style={styles.fountainMiddle} />
            <View style={styles.fountainTop} />
            <View style={styles.fountainWater} />
          </View>
        )
      default:
        return (
          <View style={styles.defaultDecoration}>
            <Feather name="star" size={24} color="#8B5CF6" />
          </View>
        )
    }
  }

  return (
    <View
      style={[
        styles.container,
        {
          left: position.x,
          top: position.y,
        },
      ]}
    >
      {renderDecoration()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1,
  },
  defaultDecoration: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  bench: {
    width: 40,
    height: 20,
    alignItems: "center",
  },
  benchSeat: {
    width: 40,
    height: 5,
    backgroundColor: "#A78BFA",
    borderRadius: 2,
  },
  benchLeg: {
    position: "absolute",
    bottom: 0,
    left: 5,
    width: 5,
    height: 15,
    backgroundColor: "#A78BFA",
    borderRadius: 2,
  },
  lantern: {
    width: 20,
    height: 40,
    alignItems: "center",
  },
  lanternTop: {
    width: 10,
    height: 5,
    backgroundColor: "#A78BFA",
    borderRadius: 2,
  },
  lanternBody: {
    width: 15,
    height: 20,
    backgroundColor: "rgba(167, 139, 250, 0.5)",
    borderRadius: 2,
  },
  lanternLight: {
    position: "absolute",
    top: 10,
    width: 10,
    height: 10,
    backgroundColor: "rgba(255, 255, 0, 0.5)",
    borderRadius: 5,
  },
  lanternBase: {
    width: 10,
    height: 10,
    backgroundColor: "#A78BFA",
    borderRadius: 2,
  },
  bridge: {
    width: 60,
    height: 30,
    alignItems: "center",
  },
  bridgeArch: {
    width: 60,
    height: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomWidth: 0,
    backgroundColor: "transparent",
    borderWidth: 3,
    borderColor: "#A78BFA",
  },
  bridgeDeck: {
    position: "absolute",
    top: 0,
    width: 60,
    height: 5,
    backgroundColor: "#A78BFA",
  },
  bridgeRail: {
    position: "absolute",
    bottom: 5,
    width: 50,
    height: 2,
    backgroundColor: "#A78BFA",
  },
  fountain: {
    width: 40,
    height: 40,
    alignItems: "center",
  },
  fountainBase: {
    width: 40,
    height: 10,
    backgroundColor: "#A78BFA",
    borderRadius: 20,
  },
  fountainMiddle: {
    width: 20,
    height: 15,
    backgroundColor: "#A78BFA",
    borderRadius: 10,
  },
  fountainTop: {
    width: 10,
    height: 10,
    backgroundColor: "#A78BFA",
    borderRadius: 5,
  },
  fountainWater: {
    position: "absolute",
    top: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(139, 216, 246, 0.3)",
  },
})
