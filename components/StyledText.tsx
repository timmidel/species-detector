import { Text, TextProps } from "./Themed";

export function MontserratText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "Montserrat" }]} />
  );
}
