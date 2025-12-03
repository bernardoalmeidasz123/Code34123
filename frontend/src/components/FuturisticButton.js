import React from "react";
import { Button } from "react-native-paper";

export default function FuturisticButton({ children, style, ...props }) {
  return (
    <Button
      mode="contained-tonal"
      buttonColor="#0b1220"
      textColor="#e2e8f0"
      style={[
        {
          borderWidth: 1,
          borderColor: "#3b82f6",
          borderRadius: 12,
          shadowColor: "#3b82f6",
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Button>
  );
}
