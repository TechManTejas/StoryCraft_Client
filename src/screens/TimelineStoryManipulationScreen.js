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
  TextInput,
  Modal,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ChevronLeft,
  GitBranch,
  Video,
  Edit3,
  Save,
  RefreshCw,
  Play,
  Pause,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Link,
  Unlink,
  Zap,
  Clock,
  CheckCircle,
  X,
  AlertCircle,
} from "lucide-react-native";
import { api } from "../api";
import { theme } from "../constants/theme";

const TimelineStoryManipulationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { storyId } = route.params || {};

  const [story, setStory] = useState(null);
  const [timelines, setTimelines] = useState([]);
  const [currentTimeline, setCurrentTimeline] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [selectedScene, setSelectedScene] = useState(null);
  const [animations, setAnimations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [saving, setSaving] = useState(false);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showCreateBranch, setShowCreateBranch] = useState(false);
  const [branchChoice, setBranchChoice] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadData();
  }, [storyId]);

  useEffect(() => {
    if (currentTimeline) {
      loadTimelineData();
    }
  }, [currentTimeline]);

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
    if (autoUpdateEnabled && selectedScene && editing) {
      // Auto-update animations when story changes
      const timeoutId = setTimeout(() => {
        handleAutoUpdate();
      }, 2000); // Debounce for 2 seconds

      return () => clearTimeout(timeoutId);
    }
  }, [editedText, autoUpdateEnabled]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [storyRes, timelinesRes] = await Promise.all([
        api.getStoryDetails(storyId),
        api.getStoryTimelines(storyId),
      ]);

      if (storyRes.isSuccess) {
        setStory(storyRes.story);
      }

      if (timelinesRes.isSuccess) {
        setTimelines(timelinesRes.timelines);
        if (timelinesRes.timelines.length > 0) {
          setCurrentTimeline(timelinesRes.timelines[0]);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTimelineData = async () => {
    if (!currentTimeline) return;

    try {
      const [timelineRes, animationsRes] = await Promise.all([
        api.getTimelineDetails(storyId, currentTimeline.id),
        api.getTimelineAnimations(storyId, currentTimeline.id),
      ]);

      if (timelineRes.isSuccess) {
        setScenes(timelineRes.timeline.scenes || []);
      }

      if (animationsRes.isSuccess) {
        setAnimations(animationsRes.animations || []);
      }
    } catch (error) {
      console.error("Error loading timeline data:", error);
    }
  };

  const handleTimelineSwitch = async (timeline) => {
    try {
      const response = await api.navigateTimeline(storyId, currentTimeline?.id, timeline.id);
      if (response.isSuccess) {
        setCurrentTimeline(timeline);
        setSelectedScene(null);
        setEditing(false);
      }
    } catch (error) {
      console.error("Error switching timeline:", error);
    }
  };

  const handleSceneEdit = (scene) => {
    setSelectedScene(scene);
    setEditedText(scene.text || "");
    setEditing(true);
  };

  const handleSaveScene = async () => {
    if (!selectedScene || !editedText.trim()) {
      Alert.alert("Error", "Please enter valid text");
      return;
    }

    try {
      setSaving(true);
      const response = await api.updateTimelineScene(storyId, currentTimeline.id, selectedScene.id, {
        text: editedText,
      });

      if (response.isSuccess) {
        // Update local state
        setScenes((prev) =>
          prev.map((s) => (s.id === selectedScene.id ? { ...s, text: editedText } : s))
        );

        // Auto-update animations if enabled
        if (response.animation_updated && autoUpdateEnabled) {
          Alert.alert("Success", "Scene updated and animations synced!");
        } else {
          Alert.alert("Success", "Scene updated successfully!");
        }

        setEditing(false);
        setSelectedScene(null);
      } else {
        Alert.alert("Error", response.message || "Failed to update scene");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update scene");
    } finally {
      setSaving(false);
    }
  };

  const handleAutoUpdate = async () => {
    if (!autoUpdateEnabled || !currentTimeline) return;

    try {
      setSyncing(true);
      const response = await api.autoUpdateAnimations(storyId, currentTimeline.id);
      if (response.isSuccess) {
        // Refresh animations
        loadTimelineData();
      }
    } catch (error) {
      console.error("Error auto-updating animations:", error);
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncAnimation = async (animationId) => {
    try {
      setSyncing(true);
      const response = await api.syncAnimationWithStory(storyId, currentTimeline.id, animationId);
      if (response.isSuccess) {
        Alert.alert("Success", "Animation synced with story!");
        loadTimelineData();
      } else {
        Alert.alert("Error", response.message || "Failed to sync animation");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to sync animation");
    } finally {
      setSyncing(false);
    }
  };

  const handleCreateBranch = async () => {
    if (!branchChoice.trim() || !selectedScene) {
      Alert.alert("Error", "Please enter a choice text");
      return;
    }

    try {
      const response = await api.createTimelineBranch(storyId, selectedScene.id, branchChoice);
      if (response.isSuccess) {
        Alert.alert("Success", "New timeline branch created!");
        setShowCreateBranch(false);
        setBranchChoice("");
        loadData(); // Reload timelines
      } else {
        Alert.alert("Error", response.message || "Failed to create branch");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create branch");
    }
  };

  const renderTimelineCard = (timeline) => {
    const isActive = currentTimeline?.id === timeline.id;

    return (
      <TouchableOpacity
        key={timeline.id}
        style={[styles.timelineCard, isActive && styles.timelineCardActive]}
        onPress={() => handleTimelineSwitch(timeline)}
      >
        <View style={styles.timelineCardHeader}>
          <GitBranch size={20} color={isActive ? theme.colors.primary : theme.colors.textSecondary} />
          <Text style={[styles.timelineCardTitle, isActive && styles.timelineCardTitleActive]}>
            {timeline.name || `Timeline ${timeline.id}`}
          </Text>
          {isActive && <CheckCircle size={16} color={theme.colors.primary} />}
        </View>
        <Text style={styles.timelineCardDescription} numberOfLines={2}>
          {timeline.description || `${timeline.scenes_count || 0} scenes`}
        </Text>
        <View style={styles.timelineCardFooter}>
          <View style={styles.timelineCardMeta}>
            <Video size={14} color={theme.colors.textMuted} />
            <Text style={styles.timelineCardMetaText}>
              {timeline.animations_count || 0} animations
            </Text>
          </View>
          <Clock size={14} color={theme.colors.textMuted} />
          <Text style={styles.timelineCardMetaText}>
            {new Date(timeline.created_at).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSceneCard = ({ item, index }) => {
    const isSelected = selectedScene?.id === item.id;
    const hasAnimation = animations.some((a) => a.scene_id === item.id);

    return (
      <View style={[styles.sceneCard, isSelected && styles.sceneCardSelected]}>
        <View style={styles.sceneCardHeader}>
          <View style={styles.sceneCardInfo}>
            <Text style={styles.sceneNumber}>Scene {index + 1}</Text>
            {hasAnimation && (
              <View style={styles.animationBadge}>
                <Video size={12} color={theme.colors.primary} />
                <Text style={styles.animationBadgeText}>Animated</Text>
              </View>
            )}
          </View>
          <View style={styles.sceneCardActions}>
            <TouchableOpacity
              style={styles.sceneActionButton}
              onPress={() => handleSceneEdit(item)}
            >
              <Edit3 size={18} color={theme.colors.secondary} />
            </TouchableOpacity>
            {hasAnimation && (
              <TouchableOpacity
                style={styles.sceneActionButton}
                onPress={() => handleSyncAnimation(animations.find((a) => a.scene_id === item.id)?.id)}
              >
                <RefreshCw size={18} color={theme.colors.accent} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Text style={styles.sceneText} numberOfLines={3}>
          {item.text || "No content"}
        </Text>
        {item.choice_1 && (
          <View style={styles.choiceContainer}>
            <Text style={styles.choiceLabel}>Choice 1:</Text>
            <Text style={styles.choiceText}>{item.choice_1}</Text>
          </View>
        )}
        {item.choice_2 && (
          <View style={styles.choiceContainer}>
            <Text style={styles.choiceLabel}>Choice 2:</Text>
            <Text style={styles.choiceText}>{item.choice_2}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.branchButton}
          onPress={() => {
            setSelectedScene(item);
            setShowCreateBranch(true);
          }}
        >
          <Plus size={16} color={theme.colors.primary} />
          <Text style={styles.branchButtonText}>Create Branch</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAnimationCard = ({ item }) => {
    const isSynced = item.synced_with_story;
    const scene = scenes.find((s) => s.id === item.scene_id);

    return (
      <View style={styles.animationCard}>
        <View style={styles.animationCardHeader}>
          <Video size={24} color={theme.colors.primary} />
          <View style={styles.animationCardInfo}>
            <Text style={styles.animationCardTitle}>{item.title || "Animation"}</Text>
            <Text style={styles.animationCardSubtitle}>
              Scene: {scene?.title || `Scene ${item.scene_id}`}
            </Text>
          </View>
          <View style={[styles.syncBadge, isSynced && styles.syncBadgeSynced]}>
            {isSynced ? (
              <Link size={16} color={theme.colors.success} />
            ) : (
              <Unlink size={16} color={theme.colors.warning} />
            )}
          </View>
        </View>
        <View style={styles.animationCardFooter}>
          <View style={styles.animationCardMeta}>
            <Text style={styles.animationCardMetaText}>
              Style: {item.animation_style || "Unknown"}
            </Text>
            <Text style={styles.animationCardMetaText}>
              Status: {item.status || "Unknown"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.syncButton}
            onPress={() => handleSyncAnimation(item.id)}
            disabled={syncing}
          >
            {syncing ? (
              <ActivityIndicator size="small" color={theme.colors.textPrimary} />
            ) : (
              <>
                <RefreshCw size={16} color={theme.colors.textPrimary} />
                <Text style={styles.syncButtonText}>Sync</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading timelines...</Text>
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
          <GitBranch size={24} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>Timeline Story</Text>
        </View>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setAutoUpdateEnabled(!autoUpdateEnabled)}
        >
          <Zap
            size={24}
            color={autoUpdateEnabled ? theme.colors.accent : theme.colors.textMuted}
            fill={autoUpdateEnabled ? theme.colors.accent : "transparent"}
          />
        </TouchableOpacity>
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
          {/* Story Info */}
          {story && (
            <View style={styles.storyInfo}>
              <Text style={styles.storyTitle}>{story.title}</Text>
              <Text style={styles.storyDescription}>{story.description || "No description"}</Text>
            </View>
          )}

          {/* Auto-Update Toggle */}
          <View style={styles.autoUpdateSection}>
            <View style={styles.autoUpdateInfo}>
              <Zap size={20} color={autoUpdateEnabled ? theme.colors.accent : theme.colors.textMuted} />
              <Text style={styles.autoUpdateText}>
                Auto-update animations: {autoUpdateEnabled ? "Enabled" : "Disabled"}
              </Text>
            </View>
            {autoUpdateEnabled && (
              <TouchableOpacity
                style={styles.manualSyncButton}
                onPress={handleAutoUpdate}
                disabled={syncing}
              >
                {syncing ? (
                  <ActivityIndicator size="small" color={theme.colors.textPrimary} />
                ) : (
                  <>
                    <RefreshCw size={16} color={theme.colors.textPrimary} />
                    <Text style={styles.manualSyncText}>Sync All</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Timelines */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <GitBranch size={20} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Timelines</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.timelinesContainer}>
                {timelines.map((timeline) => renderTimelineCard(timeline))}
              </View>
            </ScrollView>
          </View>

          {/* Scenes */}
          {currentTimeline && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Play size={20} color={theme.colors.secondary} />
                <Text style={styles.sectionTitle}>Scenes</Text>
                <Text style={styles.sectionSubtitle}>({scenes.length} scenes)</Text>
              </View>
              <FlatList
                data={scenes}
                renderItem={renderSceneCard}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                contentContainerStyle={styles.scenesList}
              />
            </View>
          )}

          {/* Connected Animations */}
          {animations.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Video size={20} color={theme.colors.accent} />
                <Text style={styles.sectionTitle}>Connected Animations</Text>
                <Text style={styles.sectionSubtitle}>({animations.length} animations)</Text>
              </View>
              <FlatList
                data={animations}
                renderItem={renderAnimationCard}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                contentContainerStyle={styles.animationsList}
              />
            </View>
          )}
        </Animated.View>
      </ScrollView>

      {/* Edit Scene Modal */}
      <Modal
        visible={editing}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditing(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Scene</Text>
              <TouchableOpacity onPress={() => setEditing(false)}>
                <X size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Scene Text</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter scene text..."
                placeholderTextColor={theme.colors.textMuted}
                value={editedText}
                onChangeText={setEditedText}
                multiline
                numberOfLines={8}
              />
              {autoUpdateEnabled && (
                <View style={styles.autoUpdateNotice}>
                  <AlertCircle size={16} color={theme.colors.info} />
                  <Text style={styles.autoUpdateNoticeText}>
                    Animations will auto-update when you save
                  </Text>
                </View>
              )}
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSaveScene}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={theme.colors.textPrimary} />
                ) : (
                  <>
                    <Save size={20} color={theme.colors.textPrimary} />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Branch Modal */}
      <Modal
        visible={showCreateBranch}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateBranch(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Timeline Branch</Text>
              <TouchableOpacity onPress={() => setShowCreateBranch(false)}>
                <X size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Choice Text</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter choice text for new branch..."
                placeholderTextColor={theme.colors.textMuted}
                value={branchChoice}
                onChangeText={setBranchChoice}
                multiline
                numberOfLines={4}
              />
              <Text style={styles.branchInfo}>
                This will create a new timeline branch from the selected scene with your choice.
              </Text>
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.createBranchButton}
                onPress={handleCreateBranch}
              >
                <Plus size={20} color={theme.colors.textPrimary} />
                <Text style={styles.createBranchButtonText}>Create Branch</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  content: {
    padding: theme.spacing.lg,
  },
  storyInfo: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  storyTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  storyDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  autoUpdateSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  autoUpdateInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    flex: 1,
  },
  autoUpdateText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  manualSyncButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  manualSyncText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    fontWeight: "600",
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
  sectionSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  timelinesContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
  timelineCard: {
    width: 200,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  timelineCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "10",
  },
  timelineCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  timelineCardTitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    fontWeight: "600",
    flex: 1,
  },
  timelineCardTitleActive: {
    color: theme.colors.primary,
  },
  timelineCardDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  timelineCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  timelineCardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  timelineCardMetaText: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  scenesList: {
    gap: theme.spacing.md,
  },
  sceneCard: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  sceneCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "10",
  },
  sceneCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  sceneCardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    flex: 1,
  },
  sceneNumber: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  animationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.md,
  },
  animationBadgeText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  sceneCardActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  sceneActionButton: {
    padding: theme.spacing.xs,
  },
  sceneText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    lineHeight: 22,
  },
  choiceContainer: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
  },
  choiceLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  choiceText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
  },
  branchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.primary + "20",
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  branchButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  animationsList: {
    gap: theme.spacing.md,
  },
  animationCard: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  animationCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  animationCardInfo: {
    flex: 1,
  },
  animationCardTitle: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  animationCardSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  syncBadge: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  syncBadgeSynced: {
    backgroundColor: theme.colors.success + "20",
  },
  animationCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.sm,
  },
  animationCardMeta: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  animationCardMetaText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  syncButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    fontWeight: "600",
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
    maxHeight: "90%",
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
    maxHeight: 400,
  },
  inputLabel: {
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
    minHeight: 150,
    textAlignVertical: "top",
  },
  autoUpdateNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.info + "20",
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  autoUpdateNoticeText: {
    ...theme.typography.bodySmall,
    color: theme.colors.info,
  },
  modalFooter: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
  },
  branchInfo: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    fontStyle: "italic",
  },
  createBranchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  createBranchButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
  },
});

export default TimelineStoryManipulationScreen;

