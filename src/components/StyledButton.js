import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Animated, Easing } from 'react-native';
import { Icon } from 'react-native-elements';

const StyledButton = ({ onPress }) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => {
    const toValue = isFlipped ? 0 : 1;
    Animated.timing(flipAnim, {
      toValue,
      duration: 800,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => setIsFlipped(!isFlipped));
  };

  const frontAnimatedStyle = {
    transform: [{
      translateY: flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -6], // Adjusted to numeric values
      }),
    }],
  };

  const shadowAnimatedStyle = {
    transform: [{
      translateY: flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 4], // Adjusted to numeric values
      }),
    }],
  };

  const handlePressIn = () => {
    flipCard(); // Trigger flip animation
  };

  const handlePressOut = () => {
    // No specific action needed on press out
  };

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <View style={styles.pushable}>
        <Animated.View style={[styles.shadow, shadowAnimatedStyle]} />
        <View style={styles.edge} />
        <Animated.View style={[styles.front, frontAnimatedStyle]}>
          <Text style={styles.buttonText}>Start Your Journey</Text>
          <Icon name='play-circle-filled' type='material' color='#FFFFFF' size={28} style={styles.buttonIcon} />
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  pushable: {
    position: 'relative',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    marginTop: 10,
    marginHorizontal: 20,
    elevation: 2, // Adding elevation for shadow on Android
  },
  shadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: '#d4d4d4', // Adjusted to a gray shade
    borderRadius: 8,
    transform: [{ translateY: 2 }], // Adjusted translateY
    transition: 'transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1)',
  },
  edge: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#000', // Adjusted to a black shade
  },
  front: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#474dc3', // Updated to #474dc3
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: '#FFFFFF',
    fontFamily: 'Arial',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontSize: 16,
    transform: [{ translateY: -4 }],
    transition: 'transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1)',
  },
  buttonText: {
    marginRight: 8,
    color: '#FFFFFF', // Text color updated to white
  },
  buttonIcon: {
    marginTop: -2,
    color: '#FFFFFF', // Icon color updated to white
  },
});

export default StyledButton;
