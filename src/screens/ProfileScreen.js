import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { View, Button } from "react-native";

const ProfileScreen = ({ navigation }) => {
  const handleLogout = () => {

    console.log("log out clicked");
    AsyncStorage.removeItem("token").then(() => {
      navigation.navigate("SignupScreen");
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default ProfileScreen;
