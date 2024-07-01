import React from "react";
import { Text } from "react-native";
import { Button } from "@gluestack-ui/themed";

const StyledButton = ({ onPress }) => {
  return (
    <Button onPress={onPress} variant="solid" colorScheme="primary">
      <Text>Click Me</Text>
    </Button>
  );
};

export default StyledButton;
