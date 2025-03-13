import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Text, View } from "@/components/Themed";
import { useColorScheme } from "@/components/useColorScheme";
import { Image } from "expo-image";

interface SpeciesPrediction {
  commonName: string;
  scientificName: string;
  habitat: string;
  additionalInfo: string;
}

export default function DetectSpecies() {
  const { uri, imageLink } = useLocalSearchParams();
  const [prediction, setPrediction] = useState<SpeciesPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme();

  console.log(imageLink);

  useEffect(() => {
    const detectSpecies = async () => {
      const LOCAL_URL = process.env.EXPO_PUBLIC_LOCAL_URL;
      const PORT = process.env.PORT || 3000;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://${LOCAL_URL}:${PORT}/inference`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: imageLink }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }
        const result: SpeciesPrediction = await response.json();
        setPrediction(result);
      } catch (err: any) {
        console.log(err);
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };
    detectSpecies();
  }, [imageLink]);

  return (
    <ScrollView
      style={{
        backgroundColor: colorScheme === "dark" ? "#0C311E" : "#F9EFE5",
      }}
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
      }}
    >
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={colorScheme === "dark" ? "#F9EFE5" : "#0C311E"}
          />
          <Text style={{ textAlign: "center", marginTop: 10 }}>
            Generating...
          </Text>
        </View>
      )}
      {error && <Text style={styles.error}>Error: {error}</Text>}
      {prediction && (
        <View style={styles.predictionContainer}>
          <View style={styles.mainContainer}>
            <Text
              style={[
                styles.title,
                {
                  backgroundColor:
                    colorScheme === "dark" ? "#F9EFE5" : "#0C311E",
                },
              ]}
              lightColor="#F9EFE5"
              darkColor="#0C311E"
            >
              {prediction.commonName}
            </Text>

            <View
              style={[
                styles.imageContainer,
                { borderColor: colorScheme === "dark" ? "#F9EFE5" : "#0C311E" },
              ]}
            >
              <Image
                source={{ uri: imageLink }}
                contentFit={"cover"}
                style={styles.image}
              />
            </View>
          </View>
          <View
            style={[
              styles.detailsContainer,
              { borderColor: colorScheme === "dark" ? "#F9EFE5" : "#0C311E" },
            ]}
          >
            <Text style={styles.textDetails}>
              <Text style={{ fontFamily: "Montserrat-SemiBoldItalic" }}>
                Scientific Name:{" "}
              </Text>{" "}
              {prediction.scientificName}
            </Text>
            <Text style={styles.textDetails}>
              <Text style={{ fontFamily: "Montserrat-SemiBoldItalic" }}>
                Habitat:{" "}
              </Text>
              {prediction.habitat}
            </Text>
            <View
              lightColor="#0C311E70"
              darkColor="#F9EFE570"
              style={[styles.separator]}
            />
            <Text style={styles.textAdditional}>
              {prediction.additionalInfo}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  predictionContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
  },
  mainContainer: {
    height: 470,
    marginBottom: 10,
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    fontFamily: "Montserrat-Bold",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    textTransform: "uppercase",
  },
  imageContainer: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    alignSelf: "center",
    borderWidth: 1,
    borderStartEndRadius: 20,
    borderEndEndRadius: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  separator: {
    marginTop: 5,
    height: 1,
  },
  error: {
    alignItems: "center",
    justifyContent: "center",
    color: "red",
    marginTop: 10,
  },
  detailsContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
  },
  textDetails: {
    fontSize: 16,
  },
  textAdditional: {
    marginTop: 10,
    fontSize: 16,
  },
});
