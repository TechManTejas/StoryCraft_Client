import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  ActivityIndicator,
  Animated,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ChevronLeft,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  Eye,
  Star,
  User,
  Calendar,
  TrendingUp,
  Send,
  MoreVertical,
} from "lucide-react-native";
import { api } from "../api";
import { theme } from "../constants/theme";

const PublicStoryDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { storyId } = route.params;
  
  const [story, setStory] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadStoryDetails();
    loadComments();
  }, [storyId]);

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

  const loadStoryDetails = async () => {
    try {
      setLoading(true);
      const response = await api.getPublicStoryDetails(storyId);
      if (response.isSuccess) {
        setStory(response.story);
        setLiked(response.story.liked || false);
        setLikesCount(response.story.likes_count || 0);
      }
    } catch (error) {
      console.error("Error loading story:", error);
      Alert.alert("Error", "Failed to load story details");
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const response = await api.getStoryComments(storyId);
      if (response.isSuccess) {
        setComments(response.comments);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await api.likeStory(storyId);
      if (response.isSuccess) {
        setLiked(response.liked);
        setLikesCount(response.likesCount);
      }
    } catch (error) {
      console.error("Error liking story:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setCommentLoading(true);
      const response = await api.addComment(storyId, newComment.trim());
      if (response.isSuccess) {
        setComments([response.comment, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      Alert.alert("Error", "Failed to add comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleShare = () => {
    Alert.alert("Share Story", "Share functionality coming soon!");
  };

  const handleFollow = async () => {
    if (!story) return;
    try {
      const response = await api.followUser(story.author_username);
      if (response.isSuccess) {
        Alert.alert("Success", response.following ? "Following user" : "Unfollowed user");
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUserPress = (username) => {
    navigation.navigate("UserProfile", { username });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading story...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!story) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Story not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
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
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Share2 size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MoreVertical size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Cover Image */}
          {story.cover_image && (
            <Image
              source={{ uri: story.cover_image }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          )}

          {/* Story Header */}
          <View style={styles.storyHeader}>
            <Text style={styles.storyTitle}>{story.title}</Text>
            <Text style={styles.storySubtitle}>{story.subtitle || story.description}</Text>

            {/* Author Info */}
            <TouchableOpacity
              style={styles.authorSection}
              onPress={() => handleUserPress(story.author_username)}
            >
              <View style={styles.authorAvatar}>
                <User size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>
                  {story.author_name || story.author_username}
                </Text>
                <Text style={styles.authorMeta}>
                  {story.author_followers || 0} followers
                </Text>
              </View>
              <TouchableOpacity
                style={styles.followButton}
                onPress={handleFollow}
              >
                <Text style={styles.followButtonText}>Follow</Text>
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Story Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Star size={18} color={theme.colors.accent} fill={theme.colors.accent} />
                <Text style={styles.statValue}>{story.rating || 4.5}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statItem}>
                <Eye size={18} color={theme.colors.textSecondary} />
                <Text style={styles.statValue}>{story.views_count || 0}</Text>
                <Text style={styles.statLabel}>Views</Text>
              </View>
              <View style={styles.statItem}>
                <BookOpen size={18} color={theme.colors.secondary} />
                <Text style={styles.statValue}>{story.chapters_count || 0}</Text>
                <Text style={styles.statLabel}>Chapters</Text>
              </View>
              <View style={styles.statItem}>
                <MessageCircle size={18} color={theme.colors.textSecondary} />
                <Text style={styles.statValue}>{comments.length}</Text>
                <Text style={styles.statLabel}>Comments</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, liked && styles.actionButtonActive]}
                onPress={handleLike}
              >
                <Heart
                  size={24}
                  color={liked ? theme.colors.primary : theme.colors.textSecondary}
                  fill={liked ? theme.colors.primary : "transparent"}
                />
                <Text
                  style={[
                    styles.actionButtonText,
                    liked && styles.actionButtonTextActive,
                  ]}
                >
                  {likesCount}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  // Scroll to comments
                }}
              >
                <MessageCircle size={24} color={theme.colors.textSecondary} />
                <Text style={styles.actionButtonText}>Comment</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Share2 size={24} color={theme.colors.textSecondary} />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>

            {/* Story Meta */}
            <View style={styles.metaContainer}>
              <View style={styles.metaItem}>
                <Calendar size={16} color={theme.colors.textMuted} />
                <Text style={styles.metaText}>
                  Published {new Date(story.created_at).toLocaleDateString()}
                </Text>
              </View>
              {story.genre && (
                <View style={styles.metaItem}>
                  <TrendingUp size={16} color={theme.colors.textMuted} />
                  <Text style={styles.metaText}>{story.genre}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Story Content */}
          <View style={styles.storyContent}>
            <Text style={styles.contentTitle}>About This Story</Text>
            <Text style={styles.contentText}>{story.description || story.summary}</Text>

            {story.full_text && (
              <>
                <Text style={styles.contentTitle}>Full Story</Text>
                <Text style={styles.contentText}>{story.full_text}</Text>
              </>
            )}
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <View style={styles.commentsHeader}>
              <MessageCircle size={20} color={theme.colors.primary} />
              <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>
            </View>

            {/* Add Comment */}
            <View style={styles.addCommentContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment..."
                placeholderTextColor={theme.colors.textMuted}
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!newComment.trim() || commentLoading) && styles.sendButtonDisabled,
                ]}
                onPress={handleAddComment}
                disabled={!newComment.trim() || commentLoading}
              >
                {commentLoading ? (
                  <ActivityIndicator size="small" color={theme.colors.textPrimary} />
                ) : (
                  <Send size={20} color={theme.colors.textPrimary} />
                )}
              </TouchableOpacity>
            </View>

            {/* Comments List */}
            {comments.length > 0 ? (
              comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <View style={styles.commentAvatar}>
                    <User size={20} color={theme.colors.primary} />
                  </View>
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>
                        {comment.author_name || comment.author_username}
                      </Text>
                      <Text style={styles.commentDate}>
                        {new Date(comment.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                    <Text style={styles.commentText}>{comment.comment}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.noComments}>
                <MessageCircle size={48} color={theme.colors.textMuted} />
                <Text style={styles.noCommentsText}>No comments yet</Text>
                <Text style={styles.noCommentsSubtext}>Be the first to comment!</Text>
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  errorText: {
    ...theme.typography.h3,
    color: theme.colors.error,
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  backButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
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
  headerActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  content: {
    flex: 1,
  },
  coverImage: {
    width: "100%",
    height: 300,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  storyHeader: {
    padding: theme.spacing.lg,
  },
  storyTitle: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  storySubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  authorSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  authorAvatar: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  authorMeta: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  followButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  followButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  actionButtons: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionButtonActive: {
    backgroundColor: theme.colors.primary + "20",
    borderColor: theme.colors.primary,
  },
  actionButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  actionButtonTextActive: {
    color: theme.colors.primary,
  },
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  metaText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
  },
  storyContent: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundCard,
    marginHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  contentTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  contentText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  commentsSection: {
    padding: theme.spacing.lg,
  },
  commentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  commentsTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  addCommentContainer: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  commentInput: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 50,
    maxHeight: 100,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: theme.spacing.lg,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  commentContent: {
    flex: 1,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xs,
  },
  commentAuthor: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  commentDate: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  commentText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  noComments: {
    alignItems: "center",
    paddingVertical: theme.spacing.xxl,
  },
  noCommentsText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  noCommentsSubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
  },
});

export default PublicStoryDetailsScreen;

