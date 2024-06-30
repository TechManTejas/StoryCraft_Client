import React from 'react';
import { View, Button } from 'react-native';

const ProfileScreen = ({ navigation, setIsLoggedIn }) => {
  const handleLogout = () => {
    // Perform logout actions here
    setIsLoggedIn(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default ProfileScreen;
