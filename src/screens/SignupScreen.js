import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  Button,
  Input,
  InputField,
  InputSlot,
  InputIcon,
} from "@gluestack-ui/themed";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import { FormControl, VStack, Heading, ButtonText } from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../api";

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleState = () => {
    setShowPassword((showState) => !showState);
  };

  const handleSignup = async () => {
    const data = await api.signUp(username, password);

    if (data.isSuccess)
      AsyncStorage.setItem("userToken", data.token).then(() => {
        navigation.navigate("BottomTabNavigator");
      });
    else console.log(JSON.stringify(data, null, 1));
  };

  return (
    <View style={styles.container}>
      <FormControl style={styles.formControl}>
        <VStack space="xl">
          <Heading color="$text900" lineHeight="$md" style={styles.heading}>
            Create New Account
          </Heading>
          <VStack space="xs">
            <Text color="$text500" lineHeight="$xs" style={styles.label}></Text>
            <Input variant="underlined">
              <InputField
                placeholder="Username"
                value={username}
                onChangeText={(text) => setUsername(text)}
                style={styles.inputField}
              />
            </Input>
          </VStack>
          <VStack space="xs">
            <Text color="$text500" lineHeight="$xs" style={styles.label}></Text>
            <Input textAlign="center" variant="underlined">
              <InputField
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                type={showPassword ? "text" : "password"}
                style={styles.inputField}
              />
              <InputSlot pr="$3" onPress={handleState}>
                <InputIcon
                  as={showPassword ? EyeIcon : EyeOffIcon}
                  color="#ffffff"
                />
              </InputSlot>
            </Input>
          </VStack>
          <View style={styles.buttonContainer}>
            <Button
              onPress={handleSignup}
              style={styles.signupButton}
              variant="outline"
            >
              <ButtonText color="#ffffff">
                <Text style={styles.buttonText}>Signup</Text>
              </ButtonText>
            </Button>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
            <Text style={styles.loginLink}>Already have an account? Login</Text>
          </TouchableOpacity>
        </VStack>
      </FormControl>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#242424",
  },
  formControl: {
    padding: 16,
    width: 350,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#8D8D8D",
    backgroundColor: "#242424",
    shadowColor: "#ffffff", // Shadow color
    shadowOffset: { width: 4, height: 10 }, // Offset for shadow
    shadowOpacity: 0.8, // Opacity for shadow
    shadowRadius: 10, // Blur radius for shadow
    elevation: 10, // Android shadow
  },
  heading: {
    color: "#ffffff",
    textAlign: "center", // Center the heading
    marginBottom: 20, // Add some margin to the bottom
  },
  label: {
    color: "#ffffff",
  },
  inputField: {
    color: "#ffffff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10, // Add margin bottom to give space for the login link
  },
  signupButton: {
    alignSelf: "center",
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    // elevation: 5,
  },
  loginLink: {
    color: "#ffffff",
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
  },
  buttonText: {
    color: "#ffffff",
  },
});

export default SignupScreen;
