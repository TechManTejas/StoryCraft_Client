import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, SafeAreaView, ScrollView } from "react-native";
import { User, BookOpen, LogOut, Trash2, Crown, Bookmark, Heart } from "lucide-react-native";
import { api } from "../api";
import { theme } from "../constants/theme";

// Import images from assets
const book1 = require('../../assets/images/story1.jpeg');
const book2 = require('../../assets/images/story12.jpg');
const book3 = require('../../assets/images/story9.jpeg');
const book4 = require('../../assets/images/story7.jpeg');
const book5 = require('../../assets/images/story14.jpg');

const ProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("Passionate writer and developer");
  const [books, setBooks] = useState([
    { name: "Book 1", image: book1 },
    { name: "Book 2", image: book2 },
    { name: "Book 3", image: book3 },
    { name: "Book 4", image: book4 },
    { name: "Book 5", image: book5 },
  ]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
      }
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
    }).catch(error => {
      console.error("Error removing token:", error);
    });
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Yes", onPress: deleteAccount }
      ],
      { cancelable: false }
    );
  };

  const deleteAccount = async () => {
    try {
      // Attempt to delete the account
      await api.deleteAccount();
      // Clear AsyncStorage and navigate to SignupScreen if deletion is successful
      await AsyncStorage.clear();
      navigation.navigate("SignupScreen");
    } catch (error) {
      // Log the error for debugging purposes
  
      // Clear AsyncStorage and navigate to SignupScreen even if there's an error
      await AsyncStorage.clear();
      navigation.navigate("SignupScreen");
    }
  };
  

  const renderBookCard = ({ item }) => (
    <View style={styles.bookCard}>
      <Image source={item.image} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookName} numberOfLines={2}>{item.name}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User size={40} color={theme.colors.primary} />
          </View>
          <Text style={styles.username}>{username || "User"}</Text>
          <Text style={styles.bio}>{bio}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookOpen size={20} color={theme.colors.secondary} />
            <Text style={styles.sectionTitle}>My Library</Text>
          </View>
          <FlatList
            data={books}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderBookCard}
            scrollEnabled={false}
            contentContainerStyle={styles.bookList}
          />
        </View>

        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate("SavedLikedScreen")}
            activeOpacity={0.8}
          >
            <Bookmark size={24} color={theme.colors.primary} />
            <Text style={styles.quickActionText}>Saved & Liked</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate("SubscriptionScreen")}
            activeOpacity={0.8}
          >
            <Crown size={24} color={theme.colors.accent} />
            <Text style={styles.quickActionText}>Subscription</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <LogOut size={20} color={theme.colors.textPrimary} />
            <Text style={styles.actionButtonText}>Logout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={handleDeleteAccount}
            activeOpacity={0.8}
          >
            <Trash2 size={20} color={theme.colors.textPrimary} />
            <Text style={styles.actionButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  username: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  bio: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.sm,
  },
  bookList: {
    paddingBottom: theme.spacing.md,
  },
  bookCard: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  bookImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
    resizeMode: "cover",
  },
  bookInfo: {
    flex: 1,
  },
  bookName: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  quickActionsContainer: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
    gap: theme.spacing.sm,
  },
  quickActionText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  actionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  actionButton: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
    gap: theme.spacing.sm,
  },
  deleteButton: {
    backgroundColor: theme.colors.error + '20',
    borderColor: theme.colors.error,
  },
  actionButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
});

export default ProfileScreen;
