import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, StyleSheet, Text, SafeAreaView } from "react-native";
import { Sparkles, BookOpen } from "lucide-react-native";
import { theme } from "../constants/theme";

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const icon1Anim = useRef(new Animated.Value(0)).current;
  const icon2Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(icon1Anim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(400),
        Animated.timing(icon2Anim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Navigate after animation
    const timer = setTimeout(() => {
      navigation.replace("SignupScreen");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const icon1Translate = icon1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0],
  });

  const icon2Translate = icon2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { rotate },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.iconWrapper,
              {
                transform: [{ translateX: icon1Translate }],
                opacity: icon1Anim,
              },
            ]}
          >
            <Sparkles size={40} color={theme.colors.primary} />
          </Animated.View>
          <Animated.View
            style={[
              styles.iconWrapper,
              {
                transform: [{ translateX: icon2Translate }],
                opacity: icon2Anim,
              },
            ]}
          >
            <BookOpen size={40} color={theme.colors.secondary} />
          </Animated.View>
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }) }],
            },
          ]}
        >
          <Text style={styles.title}>StoryCraft</Text>
          <Text style={styles.subtitle}>Craft Your Story, Share Your World</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.xl,
    position: "relative",
    width: 120,
    height: 120,
  },
  iconWrapper: {
    position: "absolute",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.round,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  textContainer: {
    alignItems: "center",
    marginTop: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h1,
    fontSize: 42,
    color: theme.colors.textPrimary,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default SplashScreen;
