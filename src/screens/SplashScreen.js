import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet, Text } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const characters = "TSROCYARTF";
  const initialPositions = getInitialPositions(characters);
  const finalPositions = getFinalPositions();

  const animationValues = characters.split('').reduce((acc, char) => {
    acc[char] = useRef(new Animated.Value(initialPositions[char])).current;
    return acc;
  }, {});

  useEffect(() => {
    animateCharacters();

    const totalDuration = 3000; // Total animation duration in milliseconds

    const timer = setTimeout(() => {
      navigation.replace('BottomTabNavigator'); // Navigate to BottomTabNavigator after animations complete
    }, totalDuration);

    return () => clearTimeout(timer); // Clean up timer on component unmount
  }, []);

  const animateCharacters = () => {
    const animations = characters.split('').map((char, index) => {
      const fromPosition = initialPositions[char];
      const toPosition = finalPositions[char];

      return Animated.timing(animationValues[char], {
        toValue: toPosition,
        duration: 300, // Duration for each individual animation (ms)
        easing: Easing.easeInOut,
        useNativeDriver: true,
      });
    });

    Animated.sequence(animations).start();
  };

  function getInitialPositions(chars) {
    const positions = {};
    chars.split('').forEach((char, index) => {
      positions[char] = index *10; // Initial positions based on index (adjust as needed)
    });
    return positions;
  }

  function getFinalPositions() {
    const positions = {};
    "STORYCRAFT".split('').forEach((char, index) => {
      positions[char] = index *10; // Final positions based on index (adjust as needed)
    });
    return positions;
  }

  return (
    <View style={styles.container}>
      {characters.split('').map((char, index) => (
        <Animated.Text
          key={index}
          style={[styles.text, { transform: [{ translateX: animationValues[char] }] }]}
        >
          {char}
        </Animated.Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
});

export default SplashScreen;
