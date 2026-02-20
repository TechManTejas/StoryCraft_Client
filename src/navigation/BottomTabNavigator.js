import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Animated, Easing } from "react-native";
import { Home, BookOpen, Search, User } from "lucide-react-native";
import HomeScreen from "../screens/HomeScreen";
import StoryScreen from "../screens/StoryScreen";
import ExploreScreen from "../screens/ExploreScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { theme } from "../constants/theme";

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
        tabBarIcon: ({ color, size, focused }) => {
          let IconComponent;
          const iconSize = focused ? 24 : 22;

          if (route.name === "Home") {
            IconComponent = Home;
          } else if (route.name === "Story") {
            IconComponent = BookOpen;
          } else if (route.name === "Explore") {
            IconComponent = Search;
          } else if (route.name === "Profile") {
            IconComponent = User;
          }

          return (
            <IconComponent 
              size={iconSize} 
              color={color} 
              strokeWidth={focused ? 2.5 : 2}
            />
          );
        },
        tabBarStyle: {
          backgroundColor: theme.colors.backgroundSecondary,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
          ...theme.shadows.large,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarLabelStyle: {
          ...theme.typography.caption,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Story"
        component={StoryScreen}
        options={{
          tabBarLabel: "Story",
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: "Explore",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
