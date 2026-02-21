              import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  ActivityIndicator,
  Animated,
  Dimensions,
  ScrollView,
  Alert,
  Modal,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Video,
  Heart,
  MessageCircle,
  Share2,
  Send,
  Plus,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  User,
  BookOpen,
  Sparkles,
  ChevronLeft,
} from "lucide-react-native";
import { api } from "../api";
import { theme } from "../constants/theme";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const ReelsScreen = () => {
  const navigation = useNavigation();
  const [reels, setReels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [caption, setCaption] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [creating, setCreating] = useState(false);
  const [myStories, setMyStories] = useState([]);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadReels();
    loadMyStories();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadReels = async () => {
    try {
      setLoading(true);
      const response = await api.getReels();
      if (response.isSuccess) {
        setReels(response.reels);
      }
    } catch (error) {
      console.error("Error loading reels:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMyStories = async () => {
    try {
      const response = await api.getUserStories();
      if (response.isSuccess) {
        setMyStories(response.stories || []);
      }
    } catch (error) {
      console.error("Error loading my stories:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReels();
  };

  const handleLike = async (reelId, currentLiked) => {
    try {
      const response = await api.likeReel(reelId);
      if (response.isSuccess) {
        setReels((prev) =>
          prev.map((reel) =>
            reel.id === reelId
              ? { ...reel, liked: response.liked, likes_count: response.likesCount }
              : reel
          )
        );
      }
    } catch (error) {
      console.error("Error liking reel:", error);
    }
  };

  const handleShare = async (reelId) => {
    Alert.prompt(
      "Share Reel",
      "Enter username to share with:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Share",
          onPress: async (username) => {
            if (username) {
              try {
                const response = await api.shareReel(reelId, username);
                if (response.isSuccess) {
                  Alert.alert("Success", "Reel shared successfully!");
                } else {
                  Alert.alert("Error", response.message || "Failed to share reel");
                }
              } catch (error) {
                Alert.alert("Error", "Failed to share reel");
              }
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const handleCreateReel = async () => {
    if (!selectedStory || !videoUrl) {
      Alert.alert("Error", "Please select a story and provide a video URL");
      return;
    }

    try {
      setCreating(true);
      const response = await api.createReel(
        selectedStory.id,
        videoUrl,
        caption,
        thumbnailUrl
      );
      if (response.isSuccess) {
        Alert.alert("Success", "Reel created successfully!");
        setShowCreateModal(false);
        setCaption("");
        setVideoUrl("");
        setThumbnailUrl("");
        setSelectedStory(null);
        loadReels();
      } else {
        Alert.alert("Error", response.message || "Failed to create reel");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create reel");
    } finally {
      setCreating(false);
    }
  };

  const renderReel = ({ item, index }) => {
    const isActive = index === currentIndex;

    return (
      <View style={styles.reelContainer}>
        {/* Video/Image Container */}
        <View style={styles.mediaContainer}>
          {item.thumbnail_url ? (
            <Image
              source={{ uri: item.thumbnail_url }}
              style={styles.media}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.mediaPlaceholder}>
              <Video size={64} color={theme.colors.textMuted} />
              <Text style={styles.mediaPlaceholderText}>Video</Text>
            </View>
          )}

          {/* Overlay Controls */}
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.playPauseButton}
              onPress={() => setPaused(!paused)}
            >
              {paused ? (
                <Play size={32} color={theme.colors.textPrimary} />
              ) : (
                <Pause size={32} color={theme.colors.textPrimary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.muteButton}
              onPress={() => setMuted(!muted)}
            >
              {muted ? (
                <VolumeX size={24} color={theme.colors.textPrimary} />
              ) : (
                <Volume2 size={24} color={theme.colors.textPrimary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Reel Info */}
        <View style={styles.reelInfo}>
          <View style={styles.reelHeader}>
            <View style={styles.authorInfo}>
              <View style={styles.authorAvatar}>
                <User size={20} color={theme.colors.primary} />
              </View>
              <View>
                <Text style={styles.authorName}>
                  {item.author_name || item.author_username}
                </Text>
                <Text style={styles.storyTitle}>{item.story_title}</Text>
              </View>
            </View>
          </View>

          {item.caption && (
            <Text style={styles.caption} numberOfLines={3}>
              {item.caption}
            </Text>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleLike(item.id, item.liked)}
            >
              <Heart
                size={24}
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

            <TouchableOpacity style={styles.actionButton}>
              <MessageCircle size={24} color={theme.colors.textSecondary} />
              <Text style={styles.actionText}>{item.comments_count || 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleShare(item.id)}
            >
              <Share2 size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderCreateModal = () => (
    <Modal
      visible={showCreateModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowCreateModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create Reel</Text>
            <TouchableOpacity
              onPress={() => setShowCreateModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.label}>Select Story</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {myStories.map((story) => (
                <TouchableOpacity
                  key={story.id}
                  style={[
                    styles.storyOption,
                    selectedStory?.id === story.id && styles.storyOptionSelected,
                  ]}
                  onPress={() => setSelectedStory(story)}
                >
                  <BookOpen size={20} color={theme.colors.textPrimary} />
                  <Text style={styles.storyOptionText} numberOfLines={2}>
                    {story.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>Video URL</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter video URL"
              placeholderTextColor={theme.colors.textMuted}
              value={videoUrl}
              onChangeText={setVideoUrl}
            />

            <Text style={styles.label}>Thumbnail URL (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter thumbnail URL"
              placeholderTextColor={theme.colors.textMuted}
              value={thumbnailUrl}
              onChangeText={setThumbnailUrl}
            />

            <Text style={styles.label}>Caption</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Write a caption..."
              placeholderTextColor={theme.colors.textMuted}
              value={caption}
              onChangeText={setCaption}
              multiline
              numberOfLines={4}
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.createButton, creating && styles.createButtonDisabled]}
              onPress={handleCreateReel}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator size="small" color={theme.colors.textPrimary} />
              ) : (
                <>
                  <Sparkles size={20} color={theme.colors.textPrimary} />
                  <Text style={styles.createButtonText}>Create Reel</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading && reels.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading reels...</Text>
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
          <Video size={24} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>Reels</Text>
        </View>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Plus size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Reels List */}
      {reels.length > 0 ? (
        <FlatList
          data={reels}
          renderItem={renderReel}
          keyExtractor={(item) => item.id.toString()}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.floor(
              event.nativeEvent.contentOffset.y / SCREEN_HEIGHT
            );
            setCurrentIndex(index);
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Video size={64} color={theme.colors.textMuted} />
          <Text style={styles.emptyText}>No reels yet</Text>
          <Text style={styles.emptySubtext}>
            Create your first reel to share your story!
          </Text>
          <TouchableOpacity
            style={styles.createFirstButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Plus size={20} color={theme.colors.textPrimary} />
            <Text style={styles.createFirstButtonText}>Create Reel</Text>
          </TouchableOpacity>
        </View>
      )}

      {renderCreateModal()}
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
  reelContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 100,
    backgroundColor: theme.colors.background,
  },
  mediaContainer: {
    flex: 1,
    position: "relative",
  },
  media: {
    width: "100%",
    height: "100%",
  },
  mediaPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundSecondary,
  },
  mediaPlaceholderText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  playPauseButton: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundCard + "CC",
    borderRadius: theme.borderRadius.round,
  },
  muteButton: {
    position: "absolute",
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundCard + "CC",
    borderRadius: theme.borderRadius.round,
  },
  reelInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.backgroundCard + "E6",
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  reelHeader: {
    marginBottom: theme.spacing.md,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  authorName: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  storyTitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  caption: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.lg,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  actionText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  actionTextActive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
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
    marginBottom: theme.spacing.lg,
  },
  createFirstButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  createFirstButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  modalBody: {
    padding: theme.spacing.lg,
  },
  label: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    fontWeight: "600",
  },
  input: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  storyOption: {
    width: 120,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  storyOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "20",
  },
  storyOptionText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    textAlign: "center",
  },
  modalFooter: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
  },
});

export default ReelsScreen;

