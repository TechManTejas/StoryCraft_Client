import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Animated, Easing } from "react-native";
import { Home, BookOpen, Users, User } from "lucide-react-native";
import HomeScreen from "../screens/HomeScreen";
import StoryScreen from "../screens/StoryScreen";
import CommunityScreen from "../screens/CommunityScreen";
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
          } else if (route.name === "Community") {
            IconComponent = Users;
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
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
          ...theme.shadows.large,
          elevation: 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarLabelStyle: {
          ...theme.typography.caption,
          fontWeight: '600',
          marginTop: 2,
          fontSize: 12,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
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
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarLabel: "Community",
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
