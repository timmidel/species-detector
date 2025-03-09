import { _View, StyleSheet } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Button, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import * as MediaLibrary from "expo-media-library";
import { Image } from "expo-image";
import { FontAwesome6, AntDesign } from "@expo/vector-icons";

interface CameraComponentProps {
  onCameraClose: () => void;
}

export default function CameraComponent({
  onCameraClose,
}: CameraComponentProps) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);

  const toggleCameraFacing = () => {
    setFacing((curr) => (curr === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    if (!ref.current) return;
    try {
      const photo = await ref.current.takePictureAsync();
      if (photo) {
        setUri(photo.uri);
        savePicture(photo.uri);
      }
    } catch (error) {
      console.error("Error taking picture:", error);
    }
  };

  const savePicture = async (uri: string) => {
    try {
      if (!mediaPermission) {
        return null;
      }
      if (mediaPermission.status !== "granted") {
        await requestMediaPermission();
      }
      // Create an album to store all the images
      const asset = await MediaLibrary.createAssetAsync(uri);
      const album = await MediaLibrary.getAlbumAsync("ZooView");
      if (album) {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      } else {
        await MediaLibrary.createAlbumAsync("ZooView", asset, false);
      }
      console.log("Image saved!");
    } catch (error) {
      console.error("Error saving picture:", error);
    }
  };

  const renderCamera = () => {
    if (!cameraPermission) {
      return null;
    }
    if (!cameraPermission.granted) {
      return (
        <View style={styles.container}>
          <Text style={styles.permissionText}>
            We need your permission to show the camera
          </Text>
          <Button onPress={requestCameraPermission} title="Grant Permission" />
        </View>
      );
    }
    return (
      <CameraView
        style={styles.camera}
        ref={ref}
        facing={facing}
        responsiveOrientationWhenOrientationLocked
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onCameraClose}>
            <AntDesign name="close" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <View style={styles.shutterBtn}>
              <View style={styles.shutterBtnInner} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <FontAwesome6 name="rotate-left" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    );
  };
  const renderPicture = () => {
    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri }}
          contentFit="contain"
          style={{ aspectRatio: 1 }}
        />
        <View style={styles.overlay}>
          <TouchableOpacity onPress={() => setUri(null)}>
            <Text style={styles.buttonText}>Take a New Picture</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return <>{uri ? renderPicture() : renderCamera()}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    flex: 1,
    flexDirection: "row",
  },
  camera: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "white",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    alignItems: "flex-end",
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  overlay: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
});
