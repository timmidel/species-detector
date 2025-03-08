import React, { useState } from "react";
import { StyleSheet, Button } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import CameraComponent from "@/components/CameraComponent";

export default function TabOneScreen() {
  const [showCamera, setShowCamera] = useState(false);

  const openCamera = () => {
    setShowCamera(true);
  };

  const closeCamera = () => {
    setShowCamera(false);
  };

  return (
    <View style={styles.container}>
      {showCamera ? (
        <CameraComponent onCameraClose={closeCamera} />
      ) : (
        <>
          <Text style={styles.title}>Hellow World!</Text>
          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />
          <Button title="Open Camera" onPress={openCamera} />
        </>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
