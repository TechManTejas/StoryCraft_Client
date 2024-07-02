import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Button, Text, StyleSheet, FlatList, Image } from "react-native";

const ProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState("John Doe");
  const [bio, setBio] = useState("Passionate writer and developer");
  const [books, setBooks] = useState([
    { name: "Book 1", image: "https://via.placeholder.com/150" },
    { name: "Book 2", image: "https://via.placeholder.com/150" },
    { name: "Book 3", image: "https://via.placeholder.com/150" },
    { name: "Book 4", image: "https://via.placeholder.com/150" },
    { name: "Book 5", image: "https://via.placeholder.com/150" },
  ]);

  useEffect(() => {
    // Fetch user details and books written by the user (mock data for example)
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    // Fetch user details from AsyncStorage or any other data source
    try {
      // Replace with actual AsyncStorage.getItem calls if needed
      setUsername("John Doe");
      setBio("Passionate writer and developer");
      setBooks([
        { name: "Book 1", image: "https://via.placeholder.com/150" },
        { name: "Book 2", image: "https://via.placeholder.com/150" },
        { name: "Book 3", image: "https://via.placeholder.com/150" },
        { name: "Book 4", image: "https://via.placeholder.com/150" },
        { name: "Book 5", image: "https://via.placeholder.com/150" },
      ]);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = () => {
    AsyncStorage.removeItem("token").then(() => {
      navigation.navigate("SignupScreen");
    });
  };

  // Render book cards
  const renderBookCard = ({ item }) => (
    <View style={styles.bookCard}>
      <Image source={{ uri: item.image }} style={styles.bookImage} />
      <Text style={styles.bookName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.bio}>{bio}</Text>
      </View>
      <FlatList
        data={books}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderBookCard}
        contentContainerStyle={styles.bookList}
      />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242424",
    padding: 20,
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#dbdbdb",
  },
  bio: {
    textAlign: "center",
    color: "#b6b6b6",
    marginBottom: 20,
  },
  bookList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  bookCard: {
    backgroundColor: "#494949",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  bookImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  bookName: {
    fontSize: 18,
    color: "#dbdbdb",
  },
});

export default ProfileScreen;
