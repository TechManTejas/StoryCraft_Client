import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Animated,
  Alert,
  FlatList,
  Image,
  Modal,
  TextInput,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ChevronLeft,
  Video,
  Play,
  Pause,
  Settings,
  Sparkles,
  Film,
  Image as ImageIcon,
  Clock,
  CheckCircle,
  X,
  Trash2,
  Download,
  Share2,
  Zap,
  Palette,
  Sliders,
  GitBranch,
  Edit3,
} from "lucide-react-native";
import { api } from "../api";
import { theme } from "../constants/theme";
import AnimationVideoEditor from "../components/AnimationVideoEditor";

const AnimationVideoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { storyId, chapterId } = route.params || {};

  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [animationStyles, setAnimationStyles] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [videoSettings, setVideoSettings] = useState({
    duration: 30,
    quality: "hd",
    music: true,
    narration: true,
    subtitles: true,
  });
  const [creating, setCreating] = useState(false);
  const [createdVideos, setCreatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [videoStatus, setVideoStatus] = useState({});
  const [pollingInterval, setPollingInterval] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadData();
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, []);

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

  useEffect(() => {
    if (storyId) {
      handleStorySelect(storyId);
    }
  }, [storyId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [storiesRes, stylesRes, videosRes] = await Promise.all([
        api.getUserStories(),
        api.getAnimationStyles(),
        api.getMyAnimationVideos(),
      ]);

      if (storiesRes.isSuccess) {
        setStories(storiesRes.stories || []);
      }

      if (stylesRes.isSuccess) {
        setAnimationStyles(stylesRes.styles || getDefaultStyles());
      } else {
        setAnimationStyles(getDefaultStyles());
      }

      if (videosRes.isSuccess) {
        setCreatedVideos(videosRes.videos || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultStyles = () => [
    {
      id: 1,
      name: "2D Animation",
      description: "Classic 2D animated style",
      preview: "🎨",
      color: theme.colors.primary,
    },
    {
      id: 2,
      name: "3D Animation",
      description: "Modern 3D animated style",
      preview: "🎬",
      color: theme.colors.secondary,
    },
    {
      id: 3,
      name: "Motion Graphics",
      description: "Dynamic motion graphics",
      preview: "✨",
      color: theme.colors.accent,
    },
    {
      id: 4,
      name: "Watercolor",
      description: "Artistic watercolor style",
      preview: "🖌️",
      color: theme.colors.info,
    },
    {
      id: 5,
      name: "Minimalist",
      description: "Clean minimalist style",
      preview: "🎯",
      color: theme.colors.success,
    },
  ];

  const handleStorySelect = async (storyId) => {
    try {
      const story = stories.find((s) => s.id === storyId) || { id: storyId };
      setSelectedStory(story);
      const response = await api.getStoryDetails(storyId);
      if (response.isSuccess) {
        setChapters(response.story.chapters || []);
        if (chapterId) {
          const chapter = response.story.chapters?.find((c) => c.id === chapterId);
          if (chapter) {
            setSelectedChapter(chapter);
          }
        }
      }
    } catch (error) {
      console.error("Error loading story details:", error);
    }
  };

  const handleCreateVideo = async () => {
    if (!selectedStory || !selectedChapter || !selectedStyle) {
      Alert.alert("Error", "Please select a story, chapter, and animation style");
      return;
    }

    try {
      setCreating(true);
      const response = await api.createAnimationVideo(
        selectedStory.id,
        selectedChapter.id,
        selectedStyle.id,
        videoSettings
      );

      if (response.isSuccess) {
        Alert.alert("Success", "Animation video creation started! It will be ready shortly.");
        setCreatedVideos([response.video, ...createdVideos]);
        startPollingStatus(response.video.id);
      } else {
        Alert.alert("Error", response.message || "Failed to create animation video");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create animation video");
    } finally {
      setCreating(false);
    }
  };

  const startPollingStatus = (videoId) => {
    const interval = setInterval(async () => {
      try {
        const response = await api.getAnimationVideoStatus(videoId);
        if (response.isSuccess) {
          setVideoStatus((prev) => ({
            ...prev,
            [videoId]: response.status,
          }));

          if (response.status.status === "completed" || response.status.status === "failed") {
            clearInterval(interval);
            loadData(); // Refresh videos list
          }
        }
      } catch (error) {
        console.error("Error polling video status:", error);
      }
    }, 5000);

    setPollingInterval(interval);
  };

  const handleDeleteVideo = async (videoId) => {
    Alert.alert(
      "Delete Video",
      "Are you sure you want to delete this animation video?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await api.deleteAnimationVideo(videoId);
              if (response.isSuccess) {
                setCreatedVideos(createdVideos.filter((v) => v.id !== videoId));
                Alert.alert("Success", "Video deleted successfully");
              } else {
                Alert.alert("Error", response.message || "Failed to delete video");
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete video");
            }
          },
        },
      ]
    );
  };

  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setShowEditor(true);
  };

  const handleEditorSave = (updatedVideo) => {
    setCreatedVideos((prev) =>
      prev.map((v) => (v.id === updatedVideo.id ? updatedVideo : v))
    );
    setShowEditor(false);
    setEditingVideo(null);
    loadData(); // Refresh data
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    setEditingVideo(null);
  };

  const renderStoryCard = (story) => (
    <TouchableOpacity
      style={[
        styles.storyCard,
        selectedStory?.id === story.id && styles.storyCardSelected,
      ]}
      onPress={() => handleStorySelect(story.id)}
    >
      <View style={styles.storyCardContent}>
        <ImageIcon size={24} color={theme.colors.primary} />
        <View style={styles.storyCardInfo}>
          <Text style={styles.storyCardTitle} numberOfLines={1}>
            {story.title}
          </Text>
          <Text style={styles.storyCardSubtitle}>
            {story.chapters_count || 0} chapters
          </Text>
        </View>
      </View>
      {selectedStory?.id === story.id && (
        <CheckCircle size={20} color={theme.colors.primary} />
      )}
    </TouchableOpacity>
  );

  const renderChapterCard = (chapter) => (
    <TouchableOpacity
      style={[
        styles.chapterCard,
        selectedChapter?.id === chapter.id && styles.chapterCardSelected,
      ]}
      onPress={() => setSelectedChapter(chapter)}
    >
      <View style={styles.chapterCardContent}>
        <Film size={20} color={theme.colors.secondary} />
        <View style={styles.chapterCardInfo}>
          <Text style={styles.chapterCardTitle} numberOfLines={2}>
            {chapter.title || `Chapter ${chapter.chapter_number || chapter.id}`}
          </Text>
          <Text style={styles.chapterCardSubtitle} numberOfLines={2}>
            {chapter.text?.substring(0, 100) || "No content"}
          </Text>
        </View>
      </View>
      {selectedChapter?.id === chapter.id && (
        <CheckCircle size={20} color={theme.colors.secondary} />
      )}
    </TouchableOpacity>
  );

  const renderStyleCard = (style) => (
    <TouchableOpacity
      style={[
        styles.styleCard,
        selectedStyle?.id === style.id && styles.styleCardSelected,
        { borderColor: style.color },
      ]}
      onPress={() => setSelectedStyle(style)}
    >
      <View style={[styles.styleIconContainer, { backgroundColor: style.color + "20" }]}>
        <Text style={styles.stylePreview}>{style.preview}</Text>
      </View>
      <View style={styles.styleCardInfo}>
        <Text style={styles.styleCardTitle}>{style.name}</Text>
        <Text style={styles.styleCardDescription}>{style.description}</Text>
      </View>
      {selectedStyle?.id === style.id && (
        <CheckCircle size={20} color={style.color} />
      )}
    </TouchableOpacity>
  );

  const renderVideoCard = ({ item }) => {
    const status = videoStatus[item.id] || { status: item.status || "processing" };
    const isCompleted = status.status === "completed";
    const isProcessing = status.status === "processing" || status.status === "pending";

    return (
      <View style={styles.videoCard}>
        <View style={styles.videoCardHeader}>
          <View style={styles.videoCardInfo}>
            <Video size={24} color={theme.colors.primary} />
            <View style={styles.videoCardDetails}>
              <Text style={styles.videoCardTitle} numberOfLines={1}>
                {item.title || item.story_title}
              </Text>
              <Text style={styles.videoCardSubtitle}>
                {item.animation_style_name || "Animation Video"}
              </Text>
            </View>
          </View>
          <View style={styles.videoCardActions}>
            {isCompleted && (
              <>
                <TouchableOpacity style={styles.videoActionButton}>
                  <Play size={18} color={theme.colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.videoActionButton}>
                  <Share2 size={18} color={theme.colors.secondary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.videoActionButton}>
                  <Download size={18} color={theme.colors.accent} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.videoActionButton}
                  onPress={() => handleEditVideo(item)}
                >
                  <Edit3 size={18} color={theme.colors.info} />
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={styles.videoActionButton}
              onPress={() => handleDeleteVideo(item.id)}
            >
              <Trash2 size={18} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        {isProcessing && (
          <View style={styles.progressContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.progressText}>
              {status.progress ? `${status.progress}%` : "Processing..."}
            </Text>
          </View>
        )}

        {isCompleted && item.thumbnail_url && (
          <Image source={{ uri: item.thumbnail_url }} style={styles.videoThumbnail} />
        )}

        <View style={styles.videoCardFooter}>
          <View style={styles.videoCardMeta}>
            <Clock size={14} color={theme.colors.textSecondary} />
            <Text style={styles.videoCardMetaText}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              isCompleted && styles.statusBadgeCompleted,
              !isCompleted && styles.statusBadgeProcessing,
            ]}
          >
            <Text style={styles.statusText}>
              {isCompleted ? "Ready" : "Processing"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
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
          <Text style={styles.headerTitle}>Animation Video</Text>
        </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate("TimelineStoryManipulationScreen", { storyId: selectedStory?.id || storyId })}
            >
              <GitBranch size={24} color={theme.colors.secondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setShowSettings(!showSettings)}
            >
              <Settings size={24} color={theme.colors.primary} />
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
          {/* Step 1: Select Story */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Sparkles size={20} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>1. Select Story</Text>
            </View>
            {stories.length > 0 ? (
              <FlatList
                data={stories}
                renderItem={({ item }) => renderStoryCard(item)}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No stories available</Text>
                <Text style={styles.emptySubtext}>
                  Create a story first to make animation videos
                </Text>
              </View>
            )}
          </View>

          {/* Step 2: Select Chapter */}
          {selectedStory && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Film size={20} color={theme.colors.secondary} />
                <Text style={styles.sectionTitle}>2. Select Chapter</Text>
              </View>
              {chapters.length > 0 ? (
                <FlatList
                  data={chapters}
                  renderItem={({ item }) => renderChapterCard(item)}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                />
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No chapters available</Text>
                </View>
              )}
            </View>
          )}

          {/* Step 3: Select Animation Style */}
          {selectedChapter && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Palette size={20} color={theme.colors.accent} />
                <Text style={styles.sectionTitle}>3. Choose Animation Style</Text>
              </View>
              <View style={styles.stylesGrid}>
                {animationStyles.map((style) => renderStyleCard(style))}
              </View>
            </View>
          )}

          {/* Create Button */}
          {selectedStory && selectedChapter && selectedStyle && (
            <TouchableOpacity
              style={[styles.createButton, creating && styles.createButtonDisabled]}
              onPress={handleCreateVideo}
              disabled={creating}
            >
              {creating ? (
                <>
                  <ActivityIndicator size="small" color={theme.colors.textPrimary} />
                  <Text style={styles.createButtonText}>Creating Video...</Text>
                </>
              ) : (
                <>
                  <Zap size={20} color={theme.colors.textPrimary} />
                  <Text style={styles.createButtonText}>Create Animation Video</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Created Videos */}
          {createdVideos.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Video size={20} color={theme.colors.primary} />
                <Text style={styles.sectionTitle}>My Animation Videos</Text>
              </View>
              <FlatList
                data={createdVideos}
                renderItem={renderVideoCard}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                contentContainerStyle={styles.videosList}
              />
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Video Settings</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <X size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Duration (seconds)</Text>
                <TextInput
                  style={styles.settingInput}
                  value={videoSettings.duration.toString()}
                  onChangeText={(text) =>
                    setVideoSettings({ ...videoSettings, duration: parseInt(text) || 30 })
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Quality</Text>
                <View style={styles.qualityOptions}>
                  {["sd", "hd", "4k"].map((quality) => (
                    <TouchableOpacity
                      key={quality}
                      style={[
                        styles.qualityOption,
                        videoSettings.quality === quality && styles.qualityOptionActive,
                      ]}
                      onPress={() => setVideoSettings({ ...videoSettings, quality })}
                    >
                      <Text
                        style={[
                          styles.qualityOptionText,
                          videoSettings.quality === quality && styles.qualityOptionTextActive,
                        ]}
                      >
                        {quality.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Music</Text>
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() =>
                    setVideoSettings({ ...videoSettings, music: !videoSettings.music })
                  }
                >
                  <Text style={styles.toggleText}>
                    {videoSettings.music ? "Enabled" : "Disabled"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Narration</Text>
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() =>
                    setVideoSettings({ ...videoSettings, narration: !videoSettings.narration })
                  }
                >
                  <Text style={styles.toggleText}>
                    {videoSettings.narration ? "Enabled" : "Disabled"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Subtitles</Text>
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() =>
                    setVideoSettings({ ...videoSettings, subtitles: !videoSettings.subtitles })
                  }
                >
                  <Text style={styles.toggleText}>
                    {videoSettings.subtitles ? "Enabled" : "Disabled"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Animation Video Editor */}
      <AnimationVideoEditor
        visible={showEditor}
        video={editingVideo}
        onClose={handleEditorClose}
        onSave={handleEditorSave}
      />
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
  headerActions: {
    flexDirection: "row",
    gap: theme.spacing.xs,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  content: {
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
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
  horizontalList: {
    gap: theme.spacing.md,
  },
  storyCard: {
    width: 200,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.md,
    ...theme.shadows.medium,
  },
  storyCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "10",
  },
  storyCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  storyCardInfo: {
    flex: 1,
  },
  storyCardTitle: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  storyCardSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  chapterCard: {
    width: 250,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.md,
    ...theme.shadows.medium,
  },
  chapterCardSelected: {
    borderColor: theme.colors.secondary,
    backgroundColor: theme.colors.secondary + "10",
  },
  chapterCardContent: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  chapterCardInfo: {
    flex: 1,
  },
  chapterCardTitle: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  chapterCardSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  stylesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  styleCard: {
    width: "48%",
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  styleCardSelected: {
    backgroundColor: theme.colors.primary + "10",
  },
  styleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  stylePreview: {
    fontSize: 32,
  },
  styleCardInfo: {
    flex: 1,
  },
  styleCardTitle: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  styleCardDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.lg,
    ...theme.shadows.large,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
    fontSize: 18,
  },
  videosList: {
    gap: theme.spacing.md,
  },
  videoCard: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  videoCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  videoCardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    flex: 1,
  },
  videoCardDetails: {
    flex: 1,
  },
  videoCardTitle: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  videoCardSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  videoCardActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  videoActionButton: {
    padding: theme.spacing.xs,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  progressText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  videoThumbnail: {
    width: "100%",
    height: 200,
    borderRadius: theme.borderRadius.md,
    marginVertical: theme.spacing.sm,
  },
  videoCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.sm,
  },
  videoCardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  videoCardMetaText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  statusBadgeCompleted: {
    backgroundColor: theme.colors.success + "20",
  },
  statusBadgeProcessing: {
    backgroundColor: theme.colors.warning + "20",
  },
  statusText: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  emptySubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.textMuted,
    textAlign: "center",
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
    maxHeight: "80%",
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
  modalBody: {
    padding: theme.spacing.lg,
  },
  settingItem: {
    marginBottom: theme.spacing.lg,
  },
  settingLabel: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
  },
  settingInput: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  qualityOptions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  qualityOption: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  qualityOptionActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  qualityOptionText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  qualityOptionTextActive: {
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  toggleButton: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  toggleText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
});

export default AnimationVideoScreen;

