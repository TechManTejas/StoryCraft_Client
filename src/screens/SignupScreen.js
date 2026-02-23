import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, SafeAreaView, ActivityIndicator } from "react-native";
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
import { useFocusEffect } from '@react-navigation/native';
import { theme } from "../constants/theme";

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
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

  // Toggle password visibility
  const handleState = () => {
    setShowPassword((showState) => !showState);
  };

  // Handle signup logic
  const handleSignup = async () => {
    // Reset errors
    setErrorMessage("");
    setUsernameError("");
    setPasswordError("");
    
    // Validation
    let hasError = false;
    if (!username.trim()) {
      setUsernameError("Username is required");
      hasError = true;
    } else if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      hasError = true;
    }
    
    if (!password.trim()) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (password.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      hasError = true;
    }
    
    if (hasError) return;

    setIsLoading(true);
    try {
      const data = await api.signUp(username, password);

      if (data.isSuccess) {
        await AsyncStorage.setItem("userToken", data.token);
        await AsyncStorage.setItem("username", username);
        navigation.navigate("BottomTabNavigator");
      } else {
        if (data.message?.toLowerCase().includes("exists") || data.message?.toLowerCase().includes("already")) {
          setUsernameError(data.message || "User already exists. Please try a different username.");
        } else {
          setErrorMessage(data.message || "Signup failed. Please try again.");
        }
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle input focus to clear error message
  const handleFocus = (field) => {
    setErrorMessage("");
    if (field === "username") setUsernameError("");
    if (field === "password") setPasswordError("");
  };

  // Reset state on screen focus
  useFocusEffect(
    useCallback(() => {
      setUsername("");
      setPassword("");
      setErrorMessage("");
    }, [])
  );

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

          <FormControl style={styles.formControl}>
            <VStack space="xl">
              <Heading style={styles.heading}>Create Account</Heading>
              <Text style={styles.subheading}>Join us and start your storytelling journey</Text>
              
              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorMessage}>{errorMessage}</Text>
                </View>
              ) : null}
              
              <VStack space="xs">
                <Text style={styles.label}>Username</Text>
                <Input 
                  variant="outline" 
                  onFocus={() => handleFocus("username")}
                  style={[styles.input, usernameError && styles.inputError]}
                >
                  <InputField
                    placeholder="Choose a username"
                    placeholderTextColor={theme.colors.textMuted}
                    value={username}
                    onChangeText={(text) => {
                      setUsername(text);
                      if (usernameError) setUsernameError("");
                    }}
                    style={styles.inputField}
                  />
                </Input>
                {usernameError && (
                  <Text style={styles.errorText}>{usernameError}</Text>
                )}
              </VStack>
              
              <VStack space="xs">
                <Text style={styles.label}>Password</Text>
                <Input 
                  variant="outline" 
                  onFocus={() => handleFocus("password")}
                  style={[styles.input, passwordError && styles.inputError]}
                >
                  <InputField
                    placeholder="Create a password"
                    placeholderTextColor={theme.colors.textMuted}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (passwordError) setPasswordError("");
                    }}
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
                {passwordError && (
                  <Text style={styles.errorText}>{passwordError}</Text>
                )}
              </VStack>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleSignup}
                  style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
                  activeOpacity={0.8}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={theme.colors.textPrimary} />
                  ) : (
                    <Text style={styles.buttonText}>Sign Up</Text>
                  )}
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                onPress={() => navigation.navigate("LoginScreen")}
                style={styles.loginLinkContainer}
              >
                <Text style={styles.loginLinkText}>Already have an account? </Text>
                <Text style={styles.loginLink}>Login</Text>
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
  errorContainer: {
    backgroundColor: theme.colors.error + '20',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  errorMessage: {
    ...theme.typography.bodySmall,
    color: theme.colors.error,
    textAlign: "center",
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
  inputError: {
    borderColor: theme.colors.error,
    borderWidth: 2,
  },
  inputField: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  buttonContainer: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  signupButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    ...theme.shadows.glow,
  },
  signupButtonDisabled: {
    opacity: 0.7,
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  buttonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
    fontSize: 18,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  loginLinkText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  loginLink: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
    textDecorationLine: "underline",
  },
});

export default SignupScreen;
