import { TouchableOpacity } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";

interface UriSetterProps {
  isCapturing: boolean;
  setUri: (uri: string | null) => void;
  redirect: (uri: string) => Promise<void>;
}

export default function GalleryComponent(props: UriSetterProps) {
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      props.setUri(result.assets[0].uri);
      props.redirect(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity onPress={pickImage} disabled={props.isCapturing}>
      <FontAwesome name="photo" size={35} color="white" />
    </TouchableOpacity>
  );
}
