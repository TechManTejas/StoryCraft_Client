import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";
import SplashScreen from "./src/screens/SplashScreen";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import SignupScreen from "./src/screens/SignupScreen";
import LoginScreen from "./src/screens/LoginScreen";
import UpdatedStoryScreen from "./src/screens/UpdatedStoryScreen";
import ChapterDetails from "./src/screens/ChapterDetails";
import StoryScreen from "./src/screens/StoryScreen";
import ImageGenerationScreen from "./src/screens/ImageGenerationScreen";
import CommunityScreen from "./src/screens/CommunityScreen";
import PublicStoryDetailsScreen from "./src/screens/PublicStoryDetailsScreen";
import ReelsScreen from "./src/screens/ReelsScreen";
import MessagingScreen from "./src/screens/MessagingScreen";
import SubscriptionScreen from "./src/screens/SubscriptionScreen";
import SavedLikedScreen from "./src/screens/SavedLikedScreen";
import AnimationVideoScreen from "./src/screens/AnimationVideoScreen";
const Stack = createStackNavigator();

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SignupScreen"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="SignupScreen" component={SignupScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen
            name="BottomTabNavigator"
            component={BottomTabNavigator}
          />
          <Stack.Screen name="StoryScreen" component={StoryScreen} />
          <Stack.Screen name="UpdatedStoryScreen" component={UpdatedStoryScreen} />
          <Stack.Screen name="ChapterDetails" component={ChapterDetails} />
          <Stack.Screen name="ImageGenerationScreen" component={ImageGenerationScreen} />
          <Stack.Screen name="CommunityScreen" component={CommunityScreen} />
          <Stack.Screen name="PublicStoryDetails" component={PublicStoryDetailsScreen} />
          <Stack.Screen name="ReelsScreen" component={ReelsScreen} />
          <Stack.Screen name="MessagingScreen" component={MessagingScreen} />
          <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
          <Stack.Screen name="SavedLikedScreen" component={SavedLikedScreen} />
          <Stack.Screen name="AnimationVideoScreen" component={AnimationVideoScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}
