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
import { api } from "../api"; // Assuming this is correctly imported

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [inputTouched, setInputTouched] = useState(false); // New state variable

  const handleState = () => {
    setShowPassword((showState) => !showState);
  };

  const handleLogin = async () => {
    const data = await api.login(username, password);

    if (data.isSuccess) {
      await AsyncStorage.setItem("userToken", data.token);
      await AsyncStorage.setItem("username", username); 
      navigation.navigate("BottomTabNavigator");
    } else {
      if (!data.userFound) {
        setUsernameError("No user found. Please sign up.");
      } else {
        setPasswordError("Incorrect password. Please try again.");
      }
      console.log(JSON.stringify(data, null, 1));
    }
  };

  // Function to handle input focus to reset errors
  const handleFocus = () => {
    setInputTouched(true);
    setUsernameError(""); // Reset username error
    setPasswordError(""); // Reset password error
  };

  return (
    <View style={styles.container}>
      {/* Sample Credentials Box */}
      <View style={styles.credentialsBox}>
        <Text style={styles.credentialsHeading}>
          Sample Credentials for Google Play Review
        </Text>
        <Text style={styles.credentialsText}>Username: arjun</Text>
        <Text style={styles.credentialsText}>Password: arjun</Text>
      </View>

      <FormControl style={styles.formControl}>
        <VStack space="xl">
          <Heading color="$text900" lineHeight="$md" style={styles.heading}>
            Login
          </Heading>
          <VStack space="xs">
            <Input variant="underlined" onFocus={handleFocus}>
              <InputField
                placeholder="Username"
                value={username}
                onChangeText={(text) => setUsername(text)}
                style={styles.inputField}
              />
            </Input>
            {(usernameError || inputTouched) && <Text style={styles.errorText}>{usernameError}</Text>}
          </VStack>
          <VStack space="xs">
            <Input textAlign="center" variant="underlined" onFocus={handleFocus}>
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
            {(passwordError || inputTouched) && <Text style={styles.errorText}>{passwordError}</Text>}
          </VStack>
          <View style={styles.buttonContainer}>
            <Button
              onPress={handleLogin}
              style={styles.loginButton}
              variant="outline"
            >
              <ButtonText color="#ffffff">
                <Text style={styles.buttonText}>Login</Text>
              </ButtonText>
            </Button>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
            <Text style={styles.signupLink}>Don't have an account? Signup</Text>
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
  credentialsBox: {
    padding: 16,
    width: 350,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#8B0000",
    backgroundColor: "#2a2a2a", // Slightly different color for distinction
    marginBottom: 20,
    shadowColor: "#8B0000",
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  credentialsHeading: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  credentialsText: {
    color: "#ffffff",
    textAlign: "center",
    fontSize: 14,
  },
  formControl: {
    padding: 16,
    width: 350,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#8D8D8D",
    backgroundColor: "#242424",
    shadowColor: "#ffffff",
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  heading: {
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  inputField: {
    color: "#ffffff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10,
  },
  loginButton: {
    alignSelf: "center",
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  signupLink: {
    color: "#ffffff",
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
  },
  buttonText: {
    color: "#ffffff",
  },
  errorText: {
    color: "#ff0000", // Error message text color
    fontSize: 14,
    marginTop: 5,
  },
});

export default LoginScreen;
