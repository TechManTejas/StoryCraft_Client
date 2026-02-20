import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { Search } from "lucide-react-native";
import GridView from "../components/GridView";
import BookDetailsScreen from "./BookDetailsScreen";
import { theme } from "../constants/theme";

// Import images from assets
const enchantedForest = require("../../assets/images/story1.jpeg");
const dawnOfTheDragonKings = require("../../assets/images/story10.jpeg");
const mysteriesOfTheCrystalSea = require("../../assets/images/story5.jpeg");
const chroniclesOfTheForgottenCity = require("../../assets/images/story13.jpg");
const legendsOfTheShadowRealm = require("../../assets/images/story11.jpg");
const talesFromTheEtherium = require("../../assets/images/story9.jpeg");

// Dummy data for books
const books = [
  {
    id: "1",
    title: "The Enchanted Forest",
    image: enchantedForest,
    rating: 4.5,
    author: "Amani Blanchett",
    summary:
      "In The Enchanted Forest Amani Blanchett weaves a tale of magic and mystery as a young girl embarks on a journey to uncover her family's enchanted legacy amidst the ancient woods.",
  },
  {
    id: "2",
    title: "Dawn of the Dragon Kings",
    image: dawnOfTheDragonKings,
    rating: 4.0,
    author: "Debra Sterling",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae justo vel lorem tincidunt ultrices at non nunc. Donec in sapien viverra, tincidunt augue id, efficitur massa.",
  },
  {
    id: "3",
    title: "Mysteries of the Crystal Sea",
    image: mysteriesOfTheCrystalSea,
    rating: 4.8,
    author: "Bradley Kjell",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae justo vel lorem tincidunt ultrices at non nunc. Donec in sapien viverra, tincidunt augue id, efficitur massa.",
  },
  {
    id: "4",
    title: "Chronicles of the Forgotten City",
    image: chroniclesOfTheForgottenCity,
    rating: 4.2,
    author: "Victoria Poyner",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae justo vel lorem tincidunt ultrices at non nunc. Donec in sapien viverra, tincidunt augue id, efficitur massa.",
  },
  {
    id: "5",
    title: "Legends of the Shadow Realm",
    image: legendsOfTheShadowRealm,
    rating: 4.3,
    author: "A Tim",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae justo vel lorem tincidunt ultrices at non nunc. Donec in sapien viverra, tincidunt augue id, efficitur massa.",
  },
  {
    id: "6",
    title: "Tales from the Etherium",
    image: talesFromTheEtherium,
    rating: 4.7,
    author: "Bill Watts",
    summary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae justo vel lorem tincidunt ultrices at non nunc. Donec in sapien viverra, tincidunt augue id, efficitur massa.",
  },
];

const ExploreScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(books);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleBookPress = (book) => {
    setSelectedBook(book);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredData = books.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBooks(filteredData);
  };

  if (selectedBook) {
    return (
      <BookDetailsScreen
        book={selectedBook}
        onBack={() => setSelectedBook(null)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerSubtitle}>Discover amazing stories</Text>
      </View>
      
      <View style={styles.searchBar}>
        <View style={styles.searchIconContainer}>
          <Search size={20} color={theme.colors.textSecondary} />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search books, authors..."
          placeholderTextColor={theme.colors.textMuted}
          onChangeText={handleSearch}
          value={searchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => handleSearch("")}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <GridView data={filteredBooks} onPress={handleBookPress} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerTitle: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.medium,
  },
  searchIconContainer: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 50,
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  clearButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  clearButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  scrollViewContent: {
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
});

export default ExploreScreen;
