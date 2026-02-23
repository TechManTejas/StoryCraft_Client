import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { theme } from '../constants/theme';

const Honeycomb = ({
  color = theme.colors.primary,
  size = 72,
  cellSize = 24,
  animationDuration = 800,
}) => {
  const animatedValues = useRef(
    Array.from({ length: 7 }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = animatedValues.map((animValue, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(index * 100),
          Animated.timing(animValue, {
            toValue: 1,
            duration: animationDuration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: animationDuration,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
        ])
      );
    });

    Animated.parallel(animations).start();
  }, []);

  return (
    <View style={[styles.honeycomb, { height: size, width: size }]}>
      {Array.from({ length: 7 }).map((_, index) => {
        const scale = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [0.3, 1],
        });

        const opacity = animatedValues[index].interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.3, 1, 0.3],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.honeycombCell,
              styles[`cell${index + 1}`],
              {
                transform: [{ scale }],
                backgroundColor: color,
                opacity,
              },
            ]}
            accessible={true}
            accessibilityLabel={`Honeycomb Cell ${index + 1}`}
          />
        );
      })}
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
