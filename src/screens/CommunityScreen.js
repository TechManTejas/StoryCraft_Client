import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  RefreshControl,
  Animated,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Search,
  TrendingUp,
  Heart,
  MessageCircle,
  Eye,
  Star,
  Filter,
  Users,
  BookOpen,
  Sparkles,
  ArrowRight,
  X,
  User,
  Video,
} from "lucide-react-native";
import { api } from "../api";
import { theme } from "../constants/theme";
import StoryCard from "../components/StoryCard";

const CommunityScreen = () => {
  const navigation = useNavigation();
  const [stories, setStories] = useState([]);
  const [trendingStories, setTrendingStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // all, trending, following

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const genres = [
    { id: "all", name: "All" },
    { id: "fantasy", name: "Fantasy" },
    { id: "adventure", name: "Adventure" },
    { id: "mystery", name: "Mystery" },
    { id: "romance", name: "Romance" },
    { id: "sci-fi", name: "Sci-Fi" },
  ];

  useEffect(() => {
    loadStories();
    loadTrendingStories();
  }, []);

  useEffect(() => {
    if (searchQuery || selectedGenre !== "all") {
      const timeoutId = setTimeout(() => {
        loadStories(true);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      loadStories(true);
    }
  }, [searchQuery, selectedGenre, activeTab]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadStories = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(1);
      }

      const currentPage = reset ? 1 : page;
      const response = await api.getPublicStories(
        currentPage,
        20,
        selectedGenre !== "all" ? selectedGenre : null,
        searchQuery || null
      );

      if (response.isSuccess) {
        if (reset) {
          setStories(response.stories);
        } else {
          setStories([...stories, ...response.stories]);
        }
        setHasMore(response.stories.length === 20);
        setPage(currentPage + 1);
      }
    } catch (error) {
      console.error("Error loading stories:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadTrendingStories = async () => {
    try {
      const response = await api.getTrendingStories();
      if (response.isSuccess) {
        setTrendingStories(response.stories);
      }
    } catch (error) {
      console.error("Error loading trending stories:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStories(true);
    await loadTrendingStories();
  };

  const handleStoryPress = (story) => {
    navigation.navigate("PublicStoryDetails", { storyId: story.id });
  };

  const handleLike = async (storyId, currentLiked) => {
    try {
      const response = await api.likeStory(storyId);
      if (response.isSuccess) {
        setStories((prev) =>
          prev.map((story) =>
            story.id === storyId
              ? { ...story, liked: response.liked, likes_count: response.likesCount }
              : story
          )
        );
        setTrendingStories((prev) =>
          prev.map((story) =>
            story.id === storyId
              ? { ...story, liked: response.liked, likes_count: response.likesCount }
              : story
          )
        );
      }
    } catch (error) {
      console.error("Error liking story:", error);
    }
  };

  const handleUserPress = (username) => {
    navigation.navigate("UserProfile", { username });
  };

  const renderStoryCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.storyCard}
        onPress={() => handleStoryPress(item)}
        activeOpacity={0.9}
      >
        <View style={styles.storyCardHeader}>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => handleUserPress(item.author_username)}
          >
            <View style={styles.avatarContainer}>
              <User size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.authorName}>{item.author_name || item.author_username}</Text>
              <Text style={styles.storyDate}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.storyStats}>
            <View style={styles.statItem}>
              <Star size={14} color={theme.colors.accent} fill={theme.colors.accent} />
              <Text style={styles.statText}>{item.rating || 4.5}</Text>
            </View>
          </View>
        </View>

        {item.cover_image && (
          <Image source={{ uri: item.cover_image }} style={styles.storyCoverImage} />
        )}

        <View style={styles.storyCardContent}>
          <Text style={styles.storyTitle}>{item.title}</Text>
          <Text style={styles.storyDescription} numberOfLines={3}>
            {item.description || item.summary}
          </Text>

          <View style={styles.storyMeta}>
            <View style={styles.metaItem}>
              <BookOpen size={14} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{item.chapters_count || 0} chapters</Text>
            </View>
            <View style={styles.metaItem}>
              <Eye size={14} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{item.views_count || 0} views</Text>
            </View>
            <View style={styles.metaItem}>
              <MessageCircle size={14} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{item.comments_count || 0} comments</Text>
            </View>
          </View>

          <View style={styles.storyActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleLike(item.id, item.liked)}
            >
              <Heart
                size={20}
                color={item.liked ? theme.colors.primary : theme.colors.textSecondary}
                fill={item.liked ? theme.colors.primary : "transparent"}
              />
              <Text
                style={[
                  styles.actionText,
                  item.liked && styles.actionTextActive,
                ]}
              >
                {item.likes_count || 0}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleStoryPress(item)}
            >
              <MessageCircle size={20} color={theme.colors.textSecondary} />
              <Text style={styles.actionText}>Comment</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.readButton]}
              onPress={() => handleStoryPress(item)}
            >
              <Text style={styles.readButtonText}>Read</Text>
              <ArrowRight size={16} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTrendingStory = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.trendingCard}
        onPress={() => handleStoryPress(item)}
        activeOpacity={0.9}
      >
        <View style={styles.trendingRank}>
          <Text style={styles.trendingRankText}>#{index + 1}</Text>
        </View>
        <View style={styles.trendingContent}>
          <Text style={styles.trendingTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.trendingMeta}>
            <Text style={styles.trendingAuthor}>by {item.author_name || item.author_username}</Text>
            <View style={styles.trendingStats}>
              <Heart size={12} color={theme.colors.primary} fill={theme.colors.primary} />
              <Text style={styles.trendingStatText}>{item.likes_count || 0}</Text>
            </View>
          </View>
        </View>
        <TrendingUp size={20} color={theme.colors.primary} />
      </TouchableOpacity>
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
          <Users size={28} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>Community</Text>
          <Sparkles size={28} color={theme.colors.secondary} />
        </View>
        <Text style={styles.headerSubtitle}>Discover stories from creators worldwide</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={() => navigation.navigate("ReelsScreen")}
          >
            <Video size={20} color={theme.colors.primary} />
            <Text style={styles.headerActionText}>Reels</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerActionButton}
            onPress={() => navigation.navigate("MessagingScreen")}
          >
            <MessageCircle size={20} color={theme.colors.secondary} />
            <Text style={styles.headerActionText}>Messages</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "all" && styles.tabActive]}
          onPress={() => setActiveTab("all")}
        >
          <Text style={[styles.tabText, activeTab === "all" && styles.tabTextActive]}>
            All Stories
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "trending" && styles.tabActive]}
          onPress={() => setActiveTab("trending")}
        >
          <TrendingUp size={16} color={activeTab === "trending" ? theme.colors.textPrimary : theme.colors.textSecondary} />
          <Text style={[styles.tabText, activeTab === "trending" && styles.tabTextActive]}>
            Trending
          </Text>
        </TouchableOpacity>
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
            <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
              <X size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Genre Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.genresContainer}
      >
        {genres.map((genre) => (
          <TouchableOpacity
            key={genre.id}
            style={[
              styles.genreChip,
              selectedGenre === genre.id && styles.genreChipActive,
            ]}
            onPress={() => setSelectedGenre(genre.id)}
          >
            <Text
              style={[
                styles.genreChipText,
                selectedGenre === genre.id && styles.genreChipTextActive,
              ]}
            >
              {genre.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Trending Section */}
      {activeTab === "trending" && trendingStories.length > 0 && (
        <View style={styles.trendingSection}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Top Stories This Week</Text>
          </View>
          <FlatList
            data={trendingStories}
            renderItem={renderTrendingStory}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.trendingList}
          />
        </View>
      )}

      {activeTab === "all" && (
        <View style={styles.storiesHeader}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? "Search Results" : "All Stories"}
          </Text>
          <Text style={styles.storiesCount}>{stories.length} stories</Text>
        </View>
      )}
    </Animated.View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  const displayStories = activeTab === "trending" ? trendingStories : stories;

  return (
    <SafeAreaView style={styles.container}>
      {loading && stories.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading stories...</Text>
        </View>
      ) : (
        <FlatList
          data={displayStories}
          renderItem={renderStoryCard}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
          onEndReached={() => {
            if (!loading && hasMore && activeTab === "all") {
              loadStories();
            }
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <BookOpen size={64} color={theme.colors.textMuted} />
              <Text style={styles.emptyText}>No stories found</Text>
              <Text style={styles.emptySubtext}>
                {searchQuery
                  ? "Try adjusting your search"
                  : "Be the first to share your story!"}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  headerSection: {
    paddingBottom: theme.spacing.md,
  },
  header: {
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  headerTitle: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
  },
  headerSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.md,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  headerActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.backgroundCard,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  headerActionText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.xs,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  tabTextActive: {
    color: theme.colors.textPrimary,
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
    minHeight: 48,
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
  genresContainer: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  genreChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.backgroundCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
    minHeight: 40,
  },
  genreChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  genreChipText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  genreChipTextActive: {
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  trendingSection: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  trendingList: {
    gap: theme.spacing.md,
  },
  trendingCard: {
    width: 200,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.md,
    ...theme.shadows.medium,
  },
  trendingRank: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.sm,
  },
  trendingRankText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  trendingContent: {
    flex: 1,
  },
  trendingTitle: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  trendingMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trendingAuthor: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  trendingStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  trendingStatText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  storiesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  storiesCount: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  storyCard: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.xl,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
    ...theme.shadows.large,
  },
  storyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.sm,
  },
  userDetails: {
    flex: 1,
  },
  authorName: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  storyDate: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  storyStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  statText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  storyCoverImage: {
    width: "100%",
    height: 200,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  storyCardContent: {
    padding: theme.spacing.md,
  },
  storyTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  storyDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  storyMeta: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  metaText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  storyActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  actionText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  actionTextActive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  readButton: {
    marginLeft: "auto",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    minHeight: 36,
    ...theme.shadows.small,
  },
  readButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
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
    textAlign: "center",
  },
  footerLoader: {
    paddingVertical: theme.spacing.lg,
    alignItems: "center",
  },
});

export default CommunityScreen;

