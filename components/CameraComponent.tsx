import { _View, StyleSheet } from "react-native";
import React, { useState, useRef } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Button, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import * as MediaLibrary from "expo-media-library";
import { ImageBackground } from "expo-image";
import { FontAwesome6, AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import GalleryComponent from "./GalleryComponent";
import { useColorScheme } from "@/components/useColorScheme";

export default function CameraComponent() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const ref = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const router = useRouter();
  const colorScheme = useColorScheme();

  const toggleCameraFacing = () => {
    setFacing((curr) => (curr === "back" ? "front" : "back"));
  };

  const takePicture = async () => {
    if (!isCameraReady || !ref.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const options = {
        quality: 0.5,
        base64: false,
        skipProcessing: true,
      };
      const photo = await ref.current.takePictureAsync(options);
      if (photo) {
        setUri(photo.uri);
      }
    } catch (error) {
      console.error("Error taking picture:", error);
    } finally {
      setIsCapturing(false);
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
      console.log("Image saved locally!");

      // Redirect to detect-species page
      redirect(uri);
    } catch (error) {
      console.error("Error saving picture:", error);
    }
  };

  const uploadImage = async (uri: string) => {
    const formData = new FormData();
    formData.append("file", {
      uri: uri,
      type: "image/jpeg",
      name: "animal.jpg",
    } as any);
    formData.append("upload_preset", "species-detector");
    formData.append("width", "750");
    formData.append("height", "1000");
    formData.append("crop", "limit");
    formData.append("quality", "auto");
    formData.append("fetch_format", "auto");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      console.log("Upload successful!");
      const imageLink = data.secure_url;
      return imageLink;
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  // Save image to cloud and redirect to detect-species page
  const redirect = async (uri: string) => {
    // Upload image online
    const imageLink = await uploadImage(uri);

    // Open detect-species page and pass the uri and image link
    router.push({
      pathname: "/detect-species",
      params: { uri: uri, imageLink: imageLink },
    });
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
        onCameraReady={() => setIsCameraReady(true)}
      >
        <View style={styles.closeContainer}>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            disabled={isCapturing}
          >
            <AntDesign name="close" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <GalleryComponent
              isCapturing={isCapturing}
              setUri={setUri}
              redirect={redirect}
            />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={takePicture}
            disabled={isCapturing}
          >
            <View style={styles.shutterBtn}>
              <View style={styles.shutterBtnInner} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={toggleCameraFacing}
            disabled={isCapturing}
          >
            <FontAwesome6 name="rotate-left" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    );
  };
  const renderPicture = () => {
    return (
      <ImageBackground style={styles.camera} source={{ uri }}>
        <View style={styles.closeContainer}>
          <TouchableOpacity onPress={() => setUri(null)}>
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View style={[styles.buttonContainer, { justifyContent: "flex-end" }]}>
          <View style={styles.submitContainer}>
            <TouchableOpacity onPress={() => savePicture(uri || "")}>
              <Ionicons
                name="send"
                size={30}
                color="#0C311E"
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
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
    width: "100%",
    padding: 15,
    justifyContent: "space-between",
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  closeContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    backgroundColor: "transparent",
    paddingHorizontal: 10,
  },
  button: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "transparent",
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
  submitContainer: {
    backgroundColor: "white",
    paddingVertical: 13,
    paddingHorizontal: 11,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
