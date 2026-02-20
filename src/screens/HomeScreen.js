import React, { useState, useEffect, useRef } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  TextInput,
  ScrollView,
  RefreshControl,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import StoryCard from "../components/StoryCard";
import { theme } from "../constants/theme";
import {
  BookOpen,
  Sparkles,
  Search,
  TrendingUp,
  Clock,
  Star,
  Award,
  ArrowRight,
  Filter,
  X,
  BookMarked,
  Users,
} from "lucide-react-native";
import { api } from "../api";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const initialStories = [
  {
    id: "1",
    title: "Chronicles of the Forgotten City",
    author: "Victoria Poyner",
    description:
      "Chronicles of the Forgotten City is a gripping tale of adventure and discovery, following a group of explorers who uncover ancient secrets hidden beneath a long-lost civilization.",
    image: require("../../assets/images/story12.jpg"),
    rating: 4.8,
    views: 1250,
    genre: "Adventure",
    chapters: 12,
  },
  {
    id: "2",
    title: "Legends of the Shadow Realm",
    author: "A Tim",
    description:
      "Legends of the Shadow Realm explores a parallel universe where souls of the fallen gather, awaiting return, amidst eternal twilight under a clouded sky, driven by the lore of the Shadow Dragon and the enigmatic Shadow God.",
    image: require("../../assets/images/story9.jpeg"),
    rating: 4.6,
    views: 980,
    genre: "Fantasy",
    chapters: 8,
  },
  {
    id: "3",
    title: "The Enchanted Forest",
    author: "Amani Blanchett",
    description:
      "The Enchanted Forest is a mystical realm filled with magical creatures, ancient trees, and hidden pathways, where every leaf whispers tales of forgotten kingdoms and the guardians who protect its secrets.",
    image: require("../../assets/images/story1.jpeg"),
    rating: 4.9,
    views: 2100,
    genre: "Fantasy",
    chapters: 15,
  },
  {
    id: "4",
    title: "Echoes of the Ancient",
    author: "Marcus Chen",
    description:
      "A thrilling journey through time where ancient prophecies come to life and heroes must rise to save the world from darkness.",
    image: require("../../assets/images/story12.jpg"),
    rating: 4.7,
    views: 1650,
    genre: "Mystery",
    chapters: 10,
  },
  {
    id: "5",
    title: "The Last Kingdom",
    author: "Sarah Williams",
    description:
      "In a world where magic has faded, a young mage discovers the last remaining source of power and must protect it from those who seek to destroy it.",
    image: require("../../assets/images/story9.jpeg"),
    rating: 4.5,
    views: 890,
    genre: "Fantasy",
    chapters: 7,
  },
];

const categories = [
  { id: "all", name: "All", icon: BookOpen },
  { id: "fantasy", name: "Fantasy", icon: Sparkles },
  { id: "adventure", name: "Adventure", icon: TrendingUp },
  { id: "mystery", name: "Mystery", icon: Award },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const [stories, setStories] = useState(initialStories);
  const [filteredStories, setFilteredStories] = useState(initialStories);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [userStats, setUserStats] = useState({
    storiesRead: 0,
    favorites: 0,
    readingTime: 0,
  });
  const [recentStories, setRecentStories] = useState([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(statsAnim, {
        toValue: 1,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
    loadUserData();
  }, []);

  useEffect(() => {
    filterStories();
  }, [searchQuery, selectedCategory, stories]);

  const loadUserData = async () => {
    try {
      const savedStories = await AsyncStorage.getItem("recentStories");
      if (savedStories) {
        setRecentStories(JSON.parse(savedStories));
      }

      // Load user stats (can be from API in future)
      const stats = await AsyncStorage.getItem("userStats");
      if (stats) {
        setUserStats(JSON.parse(stats));
      } else {
        // Default stats
        setUserStats({
          storiesRead: 12,
          favorites: 5,
          readingTime: 45,
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const filterStories = () => {
    let filtered = [...stories];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (story) =>
          story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (story) => story.genre.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredStories(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleStartJourney = () => {
    navigation.navigate("StoryScreen");
  };

  const handleStoryPress = (story) => {
    // Navigate to story details or save as recent
    const updatedRecent = [
      story,
      ...recentStories.filter((s) => s.id !== story.id),
    ].slice(0, 5);
    setRecentStories(updatedRecent);
    AsyncStorage.setItem("recentStories", JSON.stringify(updatedRecent));
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const renderStatsCard = (icon, label, value, color) => {
    const IconComponent = icon;
    return (
      <Animated.View
        style={[
          styles.statsCard,
          {
            opacity: statsAnim,
            transform: [
              {
                translateY: statsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.statsIconContainer, { backgroundColor: color + "20" }]}>
          <IconComponent size={24} color={color} />
        </View>
        <Text style={styles.statsValue}>{value}</Text>
        <Text style={styles.statsLabel}>{label}</Text>
      </Animated.View>
    );
  };

  const renderCategoryItem = ({ item }) => {
    const IconComponent = item.icon;
    const isSelected = selectedCategory === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryItem,
          isSelected && styles.categoryItemSelected,
        ]}
        onPress={() => setSelectedCategory(item.id)}
        activeOpacity={0.7}
      >
        <IconComponent
          size={20}
          color={isSelected ? theme.colors.textPrimary : theme.colors.textSecondary}
        />
        <Text
          style={[
            styles.categoryText,
            isSelected && styles.categoryTextSelected,
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderStoryItem = ({ item, index }) => {
    return (
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleStoryPress(item)}
        >
          <StoryCard
            title={item.title}
            author={item.author}
            description={item.description}
            image={item.image}
            rating={item.rating}
            views={item.views}
            chapters={item.chapters}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderHeader = () => (
    <Animated.View
      style={[
        styles.headerSection,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Main Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Sparkles size={28} color={theme.colors.primary} style={styles.icon} />
          <Text style={styles.heading}>Featured Stories</Text>
          <BookOpen size={28} color={theme.colors.secondary} style={styles.icon} />
        </View>
        <View style={styles.divider} />
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        {renderStatsCard(
          BookOpen,
          "Stories Read",
          userStats.storiesRead,
          theme.colors.primary
        )}
        {renderStatsCard(
          Star,
          "Favorites",
          userStats.favorites,
          theme.colors.accent
        )}
        {renderStatsCard(
          Clock,
          "Hours Read",
          userStats.readingTime,
          theme.colors.secondary
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stories, authors..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Trending Section */}
      {filteredStories.length > 0 && (
        <View style={styles.trendingSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <TrendingUp size={20} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Trending Now</Text>
            </View>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => navigation.navigate("ExploreScreen")}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <ArrowRight size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Recent Stories */}
      {recentStories.length > 0 && (
        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Clock size={20} color={theme.colors.secondary} />
              <Text style={styles.sectionTitle}>Recently Viewed</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentStoriesList}
          >
            {recentStories.map((story, index) => (
              <TouchableOpacity
                key={story.id}
                style={styles.recentStoryCard}
                onPress={() => handleStoryPress(story)}
                activeOpacity={0.8}
              >
                <View style={styles.recentStoryImageContainer}>
                  <Image
                    source={story.image}
                    style={styles.recentStoryImage}
                    resizeMode="cover"
                  />
                  <View style={styles.recentStoryOverlay} />
                </View>
                <Text style={styles.recentStoryTitle} numberOfLines={2}>
                  {story.title}
                </Text>
                <View style={styles.recentStoryFooter}>
                  <Star size={12} color={theme.colors.accent} fill={theme.colors.accent} />
                  <Text style={styles.recentStoryRating}>{story.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gradientBackground}>
        <FlatList
          data={filteredStories}
          renderItem={renderStoryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <BookOpen size={64} color={theme.colors.textMuted} />
              <Text style={styles.emptyText}>No stories found</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your search or filters
              </Text>
            </View>
          }
          ListFooterComponent={
            <Animated.View style={{ opacity: fadeAnim }}>
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStartJourney}
                activeOpacity={0.8}
              >
                <View style={styles.buttonGradient}>
                  <Sparkles size={20} color={theme.colors.textPrimary} />
                  <Text style={styles.startButtonText}>Start Your Journey</Text>
                  <ArrowRight size={20} color={theme.colors.textPrimary} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerSection: {
    paddingBottom: theme.spacing.md,
  },
  header: {
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  icon: {
    marginHorizontal: theme.spacing.sm,
  },
  heading: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginHorizontal: theme.spacing.sm,
  },
  divider: {
    height: 2,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.round,
    marginTop: theme.spacing.sm,
    opacity: 0.6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  statsCard: {
    flex: 1,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  statsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statsValue: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  statsLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    paddingVertical: theme.spacing.xs,
  },
  clearButton: {
    padding: theme.spacing.xs,
  },
  categoriesContainer: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  categoriesList: {
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundCard,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  categoryItemSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  seeAllText: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  trendingSection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  recentSection: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  recentStoriesList: {
    gap: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
  recentStoryCard: {
    width: 120,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  recentStoryImageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  recentStoryImage: {
    width: '100%',
    height: '100%',
  },
  recentStoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
  },
  recentStoryTitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    padding: theme.spacing.sm,
    marginTop: theme.spacing.xs,
  },
  recentStoryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  recentStoryRating: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  contentContainer: {
    paddingBottom: theme.spacing.xl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  emptySubtext: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  startButton: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginVertical: theme.spacing.xl,
    marginHorizontal: theme.spacing.md,
    ...theme.shadows.glow,
  },
  buttonGradient: {
    paddingVertical: theme.spacing.md + 4,
    paddingHorizontal: theme.spacing.xl,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  startButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
    fontSize: 18,
  },
});

export default HomeScreen;
