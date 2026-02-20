import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, SafeAreaView } from "react-native";
import {
  Button,
  Input,
  InputField,
  InputSlot,
  InputIcon,
} from "@gluestack-ui/themed";
import { EyeIcon, EyeOffIcon, BookOpen, Sparkles } from "lucide-react-native";
import { FormControl, VStack, Heading, ButtonText } from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../api";
import { theme } from "../constants/theme";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [inputTouched, setInputTouched] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
    <SafeAreaView style={styles.container}>
      <View style={styles.background}>
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Sparkles size={32} color={theme.colors.primary} />
            <Text style={styles.appTitle}>StoryCraft</Text>
            <BookOpen size={32} color={theme.colors.secondary} />
          </View>

          {/* Sample Credentials Box */}
          <View style={styles.credentialsBox}>
            <Text style={styles.credentialsHeading}>
              Sample Credentials
            </Text>
            <View style={styles.credentialsContent}>
              <Text style={styles.credentialsLabel}>Username:</Text>
              <Text style={styles.credentialsValue}>arjun</Text>
            </View>
            <View style={styles.credentialsContent}>
              <Text style={styles.credentialsLabel}>Password:</Text>
              <Text style={styles.credentialsValue}>arjun</Text>
            </View>
          </View>

          <FormControl style={styles.formControl}>
            <VStack space="xl">
              <Heading style={styles.heading}>Welcome Back</Heading>
              <Text style={styles.subheading}>Sign in to continue your journey</Text>
              
              <VStack space="xs">
                <Text style={styles.label}>Username</Text>
                <Input 
                  variant="outline" 
                  onFocus={handleFocus}
                  style={styles.input}
                >
                  <InputField
                    placeholder="Enter your username"
                    placeholderTextColor={theme.colors.textMuted}
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                    style={styles.inputField}
                  />
                </Input>
                {(usernameError || inputTouched) && (
                  <Text style={styles.errorText}>{usernameError}</Text>
                )}
              </VStack>
              
              <VStack space="xs">
                <Text style={styles.label}>Password</Text>
                <Input 
                  variant="outline" 
                  onFocus={handleFocus}
                  style={styles.input}
                >
                  <InputField
                    placeholder="Enter your password"
                    placeholderTextColor={theme.colors.textMuted}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    type={showPassword ? "text" : "password"}
                    style={styles.inputField}
                  />
                  <InputSlot pr="$3" onPress={handleState}>
                    <InputIcon
                      as={showPassword ? EyeIcon : EyeOffIcon}
                      color={theme.colors.textSecondary}
                    />
                  </InputSlot>
                </Input>
                {(passwordError || inputTouched) && (
                  <Text style={styles.errorText}>{passwordError}</Text>
                )}
              </VStack>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleLogin}
                  style={styles.loginButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                onPress={() => navigation.navigate("SignupScreen")}
                style={styles.signupLinkContainer}
              >
                <Text style={styles.signupLinkText}>Don't have an account? </Text>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </VStack>
          </FormControl>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  content: {
    width: '100%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  appTitle: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
    marginHorizontal: theme.spacing.md,
    fontWeight: '800',
  },
  credentialsBox: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.backgroundCard,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.medium,
  },
  credentialsHeading: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  credentialsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  credentialsLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  credentialsValue: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  formControl: {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundCard,
    ...theme.shadows.large,
  },
  heading: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  subheading: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  input: {
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  inputField: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  buttonContainer: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.glow,
  },
  buttonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
    fontSize: 18,
  },
  signupLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  signupLinkText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  signupLink: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
    textDecorationLine: "underline",
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});

export default LoginScreen;
