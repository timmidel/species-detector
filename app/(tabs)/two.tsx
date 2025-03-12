import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import CameraComponent from "@/components/CameraComponent";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <CameraComponent />
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
