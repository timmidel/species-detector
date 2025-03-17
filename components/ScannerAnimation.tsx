import React, { useEffect, useRef } from "react";
import {
  Animated,
  View,
  StyleSheet,
  ImageBackground,
  Text,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ScannerAnimation({ uri }: { uri: string }) {
  const scanAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current; // For "Please Wait" text
  const imageHeight = 250;

  useEffect(() => {
    // Scanning Line Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: imageHeight,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // "Initializing..." Fade Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1, // Fade in
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0, // Fade out
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.wrapper}>
      <ImageBackground style={styles.container} source={{ uri }}>
        {/* Scanning Line */}
        <Animated.View
          style={[styles.scanner, { transform: [{ translateY: scanAnim }] }]}
        >
          <LinearGradient
            colors={["#11472bCC", "#11472b20"]}
            style={styles.gradient}
          />
        </Animated.View>
      </ImageBackground>

      {/* "Initializing..." Text */}
      <Animated.Text style={[styles.waitText, { opacity: fadeAnim }]}>
        Initializing...
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  container: {
    width: 250,
    height: 250,
    borderColor: "#0C311E",
    borderWidth: 5,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  scanner: {
    width: "100%",
    height: 300,
    position: "absolute",
    top: 0,
  },
  gradient: {
    width: "100%",
    height: "100%",
    borderTopWidth: 5,
    borderTopColor: "#0C311E",
  },
  waitText: {
    marginTop: 10,
    fontSize: 15,
    fontFamily: "Montserrat-SemiBold",
    color: "#0C311E",
    textAlign: "center",
    textShadowColor: "#0C311E",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    textTransform: "uppercase",
  },
});
