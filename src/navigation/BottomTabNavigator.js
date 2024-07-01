import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Animated, Easing } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import StoryScreen from "../screens/StoryScreen";
import ExploreScreen from "../screens/ExploreScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Icon } from "react-native-elements";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ setIsLoggedIn }) => {
  const animateTab = (index, animationValue) => {
    const opacity = animationValue.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [0.5, 1, 0.5],
      extrapolate: "clamp",
    });
    return { opacity };
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Story") {
            iconName = "book";
          } else if (route.name === "Explore") {
            iconName = "search";
          } else if (route.name === "Profile") {
            iconName = "person";
          }

          return (
            <Icon name={iconName} type="material" color={color} size={size} />
          );
        },
        tabBarStyle: {
          backgroundColor: "#000000", // Dark black background color
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          elevation: 6,
          borderWidth: 0, // Remove border
          overflow: "hidden", // Ensure content inside doesn't overflow
        },
        tabBarActiveTintColor: "#FFFFFF", // White active tab color
        tabBarInactiveTintColor: "#8E8E93", // Light gray inactive tab color
        tabBarHideOnKeyboard: true, // Hide the tab bar when keyboard is shown
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarIconStyle: {
          width: 20,
          height: 20,
        },
        tabBarButtonStyle: {
          paddingVertical: 10,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" type="material" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Story"
        component={StoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="book" type="material" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" type="material" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" type="material" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
