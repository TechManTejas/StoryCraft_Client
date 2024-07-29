import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const Honeycomb = ({
  color = '#f3f3f3',
  size = 72,
  cellSize = 24,
  animationDuration = 700,
}) => {
  const animatedValue = new Animated.Value(0);

  Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: animationDuration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: animationDuration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ])
  ).start();

  const interpolatedScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={[styles.honeycomb, { height: size, width: size }]}>
      {Array.from({ length: 7 }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.honeycombCell,
            styles[`cell${index + 1}`],
            { transform: [{ scale: interpolatedScale }], backgroundColor: color },
          ]}
          accessible={true}
          accessibilityLabel={`Honeycomb Cell ${index + 1}`}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  honeycomb: {
    position: 'relative',
  },
  honeycombCell: {
    ...StyleSheet.absoluteFillObject,
    height: 24,
    width: 48,
  },
  cell1: { left: -48, top: 0 },
  cell2: { left: -24, top: 36 },
  cell3: { left: 24, top: 36 },
  cell4: { left: 48, top: 0 },
  cell5: { left: 24, top: -36 },
  cell6: { left: -24, top: -36 },
  cell7: { left: 0, top: 0 },
});

export default Honeycomb;
