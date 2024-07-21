import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const Honeycomb = () => {
  const animatedValue = new Animated.Value(0);

  Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 700,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 700,
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
    <View style={styles.honeycomb}>
      {Array.from({ length: 7 }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.honeycombCell,
            styles[`cell${index + 1}`],
            { transform: [{ scale: interpolatedScale }] },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  honeycomb: {
    height: 72,
    position: 'relative',
    width: 72,
  },
  honeycombCell: {
    backgroundColor: '#f3f3f3',
    height: 24,
    position: 'absolute',
    width: 48,
  },
  honeycombCellAfter: {
    content: '',
    borderLeftWidth: 24,
    borderRightWidth: 24,
    borderStyle: 'solid',
    borderColor: 'transparent',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  honeycombCellBefore: {
    content: '',
    borderLeftWidth: 24,
    borderRightWidth: 24,
    borderStyle: 'solid',
    borderColor: 'transparent',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  cell1: {
    animationDelay: '0s',
    left: -48,
    top: 0,
  },
  cell2: {
    animationDelay: '0.1s',
    left: -24,
    top: 36,
  },
  cell3: {
    animationDelay: '0.2s',
    left: 24,
    top: 36,
  },
  cell4: {
    animationDelay: '0.3s',
    left: 48,
    top: 0,
  },
  cell5: {
    animationDelay: '0.4s',
    left: 24,
    top: -36,
  },
  cell6: {
    animationDelay: '0.5s',
    left: -24,
    top: -36,
  },
  cell7: {
    animationDelay: '0.6s',
    left: 0,
    top: 0,
  },
});

export default Honeycomb;
