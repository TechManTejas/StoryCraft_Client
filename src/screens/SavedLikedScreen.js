import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  Animated,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ChevronLeft,
  Bookmark,
  Heart,
  Video,
  BookOpen,
  Eye,
  MessageCircle,
  Star,
  User,
  Filter,
  X,
  Trash2,
} from "lucide-react-native";
import { api } from "../api";
import { theme } from "../constants/theme";
import StoryCard from "../components/StoryCard";

const SavedLikedScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("saved"); // saved, liked
  const [contentType, setContentType] = useState("stories"); // stories, reels
  const [savedStories, setSavedStories] = useState([]);
  const [likedStories, setLikedStories] = useState([]);
  const [savedReels, setSavedReels] = useState([]);
  const [likedReels, setLikedReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadContent();
  }, [activeTab, contentType]);

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

  const loadContent = async () => {
    try {
      setLoading(true);
      if (activeTab === "saved") {
        if (contentType === "stories") {
          const response = await api.getSavedStories();
          if (response.isSuccess) {
            setSavedStories(response.stories);
          }
        } else {
          const response = await api.getSavedReels();
          if (response.isSuccess) {
            setSavedReels(response.reels);
          }
        }
      } else {
        if (contentType === "stories") {
          const response = await api.getLikedStories();
          if (response.isSuccess) {
            setLikedStories(response.stories);
          }
        } else {
          const response = await api.getLikedReels();
          if (response.isSuccess) {
            setLikedReels(response.reels);
          }
        }
      }
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadContent();
  };

  const handleStoryPress = (story) => {
    navigation.navigate("PublicStoryDetails", { storyId: story.id });
  };

  const handleReelPress = (reel) => {
    navigation.navigate("ReelsScreen", { reelId: reel.id });
  };

  const handleUnsave = async (storyId) => {
    try {
      const response = await api.unsaveStory(storyId);
      if (response.isSuccess) {
        setSavedStories((prev) => prev.filter((s) => s.id !== storyId));
      }
    } catch (error) {
      console.error("Error unsaving story:", error);
    }
  };

  const renderStoryItem = ({ item }) => {
    return (
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleStoryPress(item)}
        >
          <StoryCard
            title={item.title}
            author={item.author_name || item.author_username}
            description={item.description || item.summary}
            image={item.cover_image ? { uri: item.cover_image } : require("../../assets/images/story1.jpeg")}
            rating={item.rating}
            views={item.views_count}
            chapters={item.chapters_count}
          />
        </TouchableOpacity>
        {activeTab === "saved" && (
          <TouchableOpacity
            style={styles.unsaveButton}
            onPress={() => handleUnsave(item.id)}
          >
            <Trash2 size={18} color={theme.colors.error} />
            <Text style={styles.unsaveButtonText}>Remove</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  };

  const renderReelItem = ({ item }) => {
    return (
      <Animated.View
        style={[
          styles.reelCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleReelPress(item)}
        >
          <View style={styles.reelImageContainer}>
            {item.thumbnail_url ? (
              <Image
                source={{ uri: item.thumbnail_url }}
                style={styles.reelImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.reelPlaceholder}>
                <Video size={48} color={theme.colors.textMuted} />
              </View>
            )}
            <View style={styles.reelOverlay}>
              <Video size={24} color={theme.colors.textPrimary} />
            </View>
          </View>

          <View style={styles.reelInfo}>
            <Text style={styles.reelTitle} numberOfLines={2}>
              {item.story_title || item.caption}
            </Text>
            <View style={styles.reelMeta}>
              <View style={styles.reelMetaItem}>
                <User size={14} color={theme.colors.textSecondary} />
                <Text style={styles.reelMetaText}>
                  {item.author_name || item.author_username}
                </Text>
              </View>
              <View style={styles.reelMetaItem}>
                <Heart size={14} color={theme.colors.primary} fill={theme.colors.primary} />
                <Text style={styles.reelMetaText}>{item.likes_count || 0}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const currentContent =
    activeTab === "saved"
      ? contentType === "stories"
        ? savedStories
        : savedReels
      : contentType === "stories"
      ? likedStories
      : likedReels;

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
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "saved" && styles.tabActive]}
          onPress={() => setActiveTab("saved")}
        >
          <Bookmark
            size={20}
            color={
              activeTab === "saved"
                ? theme.colors.textPrimary
                : theme.colors.textSecondary
            }
            fill={activeTab === "saved" ? theme.colors.primary : "transparent"}
          />
          <Text
            style={[styles.tabText, activeTab === "saved" && styles.tabTextActive]}
          >
            Saved
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "liked" && styles.tabActive]}
          onPress={() => setActiveTab("liked")}
        >
          <Heart
            size={20}
            color={
              activeTab === "liked"
                ? theme.colors.textPrimary
                : theme.colors.textSecondary
            }
            fill={activeTab === "liked" ? theme.colors.primary : "transparent"}
          />
          <Text
            style={[styles.tabText, activeTab === "liked" && styles.tabTextActive]}
          >
            Liked
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Type Filter */}
      <View style={styles.contentTypeContainer}>
        <TouchableOpacity
          style={[
            styles.contentTypeButton,
            contentType === "stories" && styles.contentTypeButtonActive,
          ]}
          onPress={() => setContentType("stories")}
        >
          <BookOpen
            size={18}
            color={
              contentType === "stories"
                ? theme.colors.textPrimary
                : theme.colors.textSecondary
            }
          />
          <Text
            style={[
              styles.contentTypeText,
              contentType === "stories" && styles.contentTypeTextActive,
            ]}
          >
            Stories
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.contentTypeButton,
            contentType === "reels" && styles.contentTypeButtonActive,
          ]}
          onPress={() => setContentType("reels")}
        >
          <Video
            size={18}
            color={
              contentType === "reels"
                ? theme.colors.textPrimary
                : theme.colors.textSecondary
            }
          />
          <Text
            style={[
              styles.contentTypeText,
              contentType === "reels" && styles.contentTypeTextActive,
            ]}
          >
            Reels
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Bookmark size={20} color={theme.colors.primary} />
          <Text style={styles.statValue}>{savedStories.length + savedReels.length}</Text>
          <Text style={styles.statLabel}>Saved</Text>
        </View>
        <View style={styles.statItem}>
          <Heart size={20} color={theme.colors.primary} fill={theme.colors.primary} />
          <Text style={styles.statValue}>{likedStories.length + likedReels.length}</Text>
          <Text style={styles.statLabel}>Liked</Text>
        </View>
      </View>
    </Animated.View>
  );

  if (loading && currentContent.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading content...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Bookmark size={24} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>Saved & Liked</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {contentType === "stories" ? (
        <FlatList
          data={currentContent}
          renderItem={renderStoryItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              {activeTab === "saved" ? (
                <Bookmark size={64} color={theme.colors.textMuted} />
              ) : (
                <Heart size={64} color={theme.colors.textMuted} />
              )}
              <Text style={styles.emptyText}>
                No {activeTab} {contentType} yet
              </Text>
              <Text style={styles.emptySubtext}>
                {activeTab === "saved"
                  ? "Save stories you want to read later"
                  : "Like stories you enjoy"}
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={currentContent}
          renderItem={renderReelItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.reelRow}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Video size={64} color={theme.colors.textMuted} />
              <Text style={styles.emptyText}>
                No {activeTab} reels yet
              </Text>
              <Text style={styles.emptySubtext}>
                {activeTab === "saved"
                  ? "Save reels you want to watch later"
                  : "Like reels you enjoy"}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerButton: {
    padding: theme.spacing.sm,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  headerSection: {
    paddingBottom: theme.spacing.md,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundCard,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
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
  contentTypeContainer: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  contentTypeButton: {
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
  contentTypeButtonActive: {
    backgroundColor: theme.colors.primary + "20",
    borderColor: theme.colors.primary,
  },
  contentTypeText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  contentTypeTextActive: {
    color: theme.colors.primary,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.backgroundCard,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  statItem: {
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  statValue: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  unsaveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.error + "20",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  unsaveButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.error,
    fontWeight: "600",
  },
  reelCard: {
    flex: 1,
    margin: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  reelRow: {
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
  },
  reelImageContainer: {
    width: "100%",
    height: 200,
    position: "relative",
  },
  reelImage: {
    width: "100%",
    height: "100%",
  },
  reelPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  reelOverlay: {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundCard + "CC",
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
  },
  reelInfo: {
    padding: theme.spacing.md,
  },
  reelTitle: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
  },
  reelMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reelMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  reelMetaText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
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
});

export default SavedLikedScreen;

