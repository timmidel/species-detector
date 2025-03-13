const tintColorLight = "#0C311E";
const tintColorDark = "#fff";
const primaryColor = "#0C311E";
const secondaryColor = "#8D5D3D";

export default {
  light: {
    primaryColor: primaryColor,
    secondaryColor: secondaryColor,
    text: primaryColor,
    background: "#F9EFE5",
    tint: tintColorLight,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    primaryColor: primaryColor,
    secondaryColor: secondaryColor,
    text: "#fff",
    background: "#000",
    tint: primaryColor,
    tabIconDefault: "#ccc",
    tabIconSelected: tintColorDark,
  },
};
