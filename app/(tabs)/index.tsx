import React, { useState, useCallback } from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useFocusEffect } from "@react-navigation/native";

import { Text, View } from "@/components/Themed";
import { Discovery } from "@/utils/database";
import { useDatabase } from "@/contexts/databaseContext";
import { useColorScheme } from "@/components/useColorScheme";

interface Discovery {
  id: number;
  commonName: string;
  scientificName: string;
  habitat: string;
  additionalInfo: string;
  imageLink: string;
}

export default function TabOneScreen() {
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const db = useDatabase();
  const colorScheme = useColorScheme();

  useFocusEffect(
    useCallback(() => {
      const getDiscoveries = async () => {
        try {
          const results: Discovery[] = await Discovery.getAllDiscovery(db);
          setDiscoveries(results);
          console.log("Successfully refreshed discoveries!");
        } catch (error: any) {
          console.log("Failed to get discoveries!", error);
        }
      };

      getDiscoveries();
    }, [db])
  );

  const deleteDiscovery = async (discoveryId: number) => {
    try {
      const result = await Discovery.deleteDiscovery(db, discoveryId);
      if (result) {
        // Update discoveries state
        setDiscoveries((prevDiscoveries) =>
          prevDiscoveries.filter((discovery) => discovery.id !== discoveryId)
        );
        console.log("Successfully deleted the discovery!");
      }
    } catch (error: any) {
      console.log("Failed to delete discovery!", error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colorScheme === "dark" ? "#0C311E" : "#F9EFE5" },
      ]}
    >
      <Text style={styles.title}>Discoveries</Text>

      {discoveries.length === 0 ? (
        <Text>
          No discoveries found. Pls identify an animal to add to your
          discoveries.
        </Text>
      ) : (
        discoveries.map((discovery) => (
          <View key={discovery.id} style={styles.discoveryItem}>
            <View style={styles.header}>
              <View style={styles.infoContainer}>
                <Image
                  source={{ uri: discovery.imageLink }}
                  style={styles.image}
                />
                <View>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.discoveryTitle}
                  >
                    {discovery.commonName}
                  </Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      fontFamily: "Montserrat-SemiBoldItalic",
                      marginBottom: 5,
                    }}
                  >
                    {discovery.scientificName}
                  </Text>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{ fontFamily: "Montserrat-Regular" }}
                  >
                    {discovery.habitat}
                  </Text>
                </View>
              </View>

              <TouchableOpacity onPress={() => deleteDiscovery(discovery.id)}>
                <FontAwesome6 name="delete-left" size={24} color="#0C311E" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    marginVertical: 15,
    textTransform: "uppercase",
    fontFamily: "Montserrat-Bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  discoveryItem: {
    marginBottom: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    width: "90%",
  },
  discoveryTitle: {
    fontSize: 18,
    fontFamily: "Montserrat-SemiBold",
    marginBottom: -5,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    maxWidth: 190,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});
