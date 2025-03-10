import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { Image } from "expo-image";

export default function DetectSpecies() {
  const { uri, imageLink } = useLocalSearchParams();
  const [prediction, setPrediction] = useState<string | null>(null);

  useEffect(() => {
    const detectSpecies = async () => {
      const LOCAL_URL = process.env.EXPO_PUBLIC_LOCAL_URL;
      try {
        const response = await fetch(`http://${LOCAL_URL}:3000/inference`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: imageLink }),
        });
        console.log(response);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }
        const result = await response.text();
        setPrediction(result);
      } catch (error) {
        console.log(error);
      }
    };
    detectSpecies();
  }, []);

  return (
    <View style={styles.container}>
      {prediction ? (
        <Text>TEST PREDICTION: {prediction}</Text>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
