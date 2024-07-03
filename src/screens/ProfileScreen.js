import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Button, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";

// Import images from assets
const book1 = require('../../assets/images/story1.jpeg');
const book2 = require('../../assets/images/story12.jpg');
const book3 = require('../../assets/images/story9.jpeg');
const book4 = require('../../assets/images/story7.jpeg');
const book5 = require('../../assets/images/story14.jpg');

const ProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState("Bill Watts");
  const [bio, setBio] = useState("Passionate writer and developer");
  const [books, setBooks] = useState([
    { name: "Book 1", image: book1 },
    { name: "Book 2", image: book2 },
    { name: "Book 3", image: book3 },
    { name: "Book 4", image: book4 },
    { name: "Book 5", image: book5 },
  ]);

  useEffect(() => {
    // Fetch user details and books written by the user (mock data for example)
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    // Fetch user details from AsyncStorage or any other data source
    try {
      // Replace with actual AsyncStorage.getItem calls if needed
      setUsername("Bill Watts");
      setBio("Passionate writer and developer");
      setBooks([
        { name: "The Epistle to the Colossians", image: book1 },
        { name: "The Book of Acts", image: book2 },
        { name: "The Revelation of John", image: book3 },
        { name: "The Lotus Sutra", image: book4 },
        { name: "Cyber City", image: book5 },
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
      <Image source={item.image} style={styles.bookImage} />
      <Text style={styles.bookName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileInfoContainer}>
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.bio}>{bio}</Text>
        </View>
      </View>
      <FlatList
        data={books}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderBookCard}
        contentContainerStyle={styles.bookList}
      />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242424",
    padding: 20,
  },
  profileInfoContainer: {
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "orange",
    borderRadius: 10,
    padding: 10,
    shadowColor: "orange",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  profileInfo: {
    alignItems: "center",
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
    resizeMode: "cover",
  },
  bookName: {
    fontSize: 18,
    color: "#dbdbdb",
  },
  logoutButton: {
    backgroundColor: "#000000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
