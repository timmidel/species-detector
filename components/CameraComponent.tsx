import { _View, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Button, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import * as MediaLibrary from "expo-media-library";

interface CameraComponentProps {
  onCameraClose: () => void;
}

export default function CameraComponent({
  onCameraClose,
}: CameraComponentProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");

  const toggleCameraFacing = () => {
    setFacing((curr) => (curr === "back" ? "front" : "back"));
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  return (
    <CameraView style={styles.camera} facing={facing}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onCameraClose}>
          <Text style={styles.buttonText}>Close Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.buttonText}>Flip Camera</Text>
        </TouchableOpacity>
      </View>
    </CameraView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  camera: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
    padding: 15,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  permissionText: {
    fontSize: 17,
    textAlign: "center",
  },
});
