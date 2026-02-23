import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import {
  X,
  Save,
  Edit3,
  Video,
  Palette,
  Sliders,
  Clock,
  Music,
  Mic,
  Type,
  Zap,
  RefreshCw,
  CheckCircle,
} from "lucide-react-native";
import { api } from "../api";
import { theme } from "../constants/theme";

const AnimationVideoEditor = ({ visible, video, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [editedSettings, setEditedSettings] = useState({
    duration: 30,
    quality: "hd",
    music: true,
    narration: true,
    subtitles: true,
  });
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [animationStyles, setAnimationStyles] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      loadVideoData();
      loadAnimationStyles();
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  useEffect(() => {
    if (video) {
      setVideoData(video);
      setTitle(video.title || video.story_title || "");
      setDescription(video.description || "");
      if (video.video_settings) {
        setEditedSettings(video.video_settings);
      }
      if (video.animation_style_id) {
        setSelectedStyle(video.animation_style_id);
      }
    }
  }, [video]);

  const loadVideoData = async () => {
    if (!video?.id) return;

    try {
      setLoading(true);
      const response = await api.getAnimationVideo(video.id);
      if (response.isSuccess) {
        setVideoData(response.video);
        setTitle(response.video.title || "");
        setDescription(response.video.description || "");
        if (response.video.video_settings) {
          setEditedSettings(response.video.video_settings);
        }
      }
    } catch (error) {
      console.error("Error loading video data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnimationStyles = async () => {
    try {
      const response = await api.getAnimationStyles();
      if (response.isSuccess) {
        setAnimationStyles(response.styles || []);
      }
    } catch (error) {
      console.error("Error loading animation styles:", error);
    }
  };

  const handleSave = async () => {
    if (!videoData) return;

    try {
      setSaving(true);
      const updates = {
        title: title.trim(),
        description: description.trim(),
        video_settings: editedSettings,
      };

      if (selectedStyle) {
        updates.animation_style_id = selectedStyle;
      }

      const response = await api.updateAnimationVideo(videoData.id, updates);

      if (response.isSuccess) {
        Alert.alert("Success", "Video updated successfully!");
        if (onSave) {
          onSave(response.video);
        }
        onClose();
      } else {
        Alert.alert("Error", response.message || "Failed to update video");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update video");
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (!videoData || !selectedStyle) {
      Alert.alert("Error", "Please select an animation style");
      return;
    }

    Alert.alert(
      "Regenerate Video",
      "This will create a new version of the video with the updated settings. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Regenerate",
          onPress: async () => {
            try {
              setRegenerating(true);
              const response = await api.regenerateAnimationVideo(
                videoData.id,
                selectedStyle,
                editedSettings
              );

              if (response.isSuccess) {
                Alert.alert("Success", "Video regeneration started! It will be ready shortly.");
                if (onSave) {
                  onSave(response.video);
                }
                onClose();
              } else {
                Alert.alert("Error", response.message || "Failed to regenerate video");
              }
            } catch (error) {
              Alert.alert("Error", "Failed to regenerate video");
            } finally {
              setRegenerating(false);
            }
          },
        },
      ]
    );
  };

  const renderSettingItem = (icon, label, value, onChange, type = "text") => {
    const IconComponent = icon;
    return (
      <View style={styles.settingItem}>
        <View style={styles.settingHeader}>
          <IconComponent size={20} color={theme.colors.primary} />
          <Text style={styles.settingLabel}>{label}</Text>
        </View>
        {type === "toggle" ? (
          <TouchableOpacity
            style={[
              styles.toggleButton,
              value && styles.toggleButtonActive,
            ]}
            onPress={() => onChange(!value)}
          >
            <Text style={[styles.toggleText, value && styles.toggleTextActive]}>
              {value ? "Enabled" : "Disabled"}
            </Text>
          </TouchableOpacity>
        ) : type === "number" ? (
          <TextInput
            style={styles.settingInput}
            value={value.toString()}
            onChangeText={(text) => onChange(parseInt(text) || 0)}
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textMuted}
          />
        ) : (
          <View style={styles.qualityOptions}>
            {["sd", "hd", "4k"].map((quality) => (
              <TouchableOpacity
                key={quality}
                style={[
                  styles.qualityOption,
                  value === quality && styles.qualityOptionActive,
                ]}
                onPress={() => onChange(quality)}
              >
                <Text
                  style={[
                    styles.qualityOptionText,
                    value === quality && styles.qualityOptionTextActive,
                  ]}
                >
                  {quality.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Edit3 size={24} color={theme.colors.primary} />
              <Text style={styles.headerTitle}>Edit Animation Video</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading video data...</Text>
            </View>
          ) : (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Title and Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Video Information</Text>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Title</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter video title"
                    placeholderTextColor={theme.colors.textMuted}
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter video description"
                    placeholderTextColor={theme.colors.textMuted}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </View>

              {/* Animation Style */}
              {animationStyles.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Palette size={20} color={theme.colors.accent} />
                    <Text style={styles.sectionTitle}>Animation Style</Text>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.stylesContainer}>
                      {animationStyles.map((style) => (
                        <TouchableOpacity
                          key={style.id}
                          style={[
                            styles.styleOption,
                            selectedStyle === style.id && styles.styleOptionActive,
                            { borderColor: style.color || theme.colors.primary },
                          ]}
                          onPress={() => setSelectedStyle(style.id)}
                        >
                          <Text style={styles.stylePreview}>{style.preview}</Text>
                          <Text
                            style={[
                              styles.styleName,
                              selectedStyle === style.id && styles.styleNameActive,
                            ]}
                          >
                            {style.name}
                          </Text>
                          {selectedStyle === style.id && (
                            <CheckCircle
                              size={16}
                              color={style.color || theme.colors.primary}
                              style={styles.checkIcon}
                            />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              )}

              {/* Video Settings */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Sliders size={20} color={theme.colors.secondary} />
                  <Text style={styles.sectionTitle}>Video Settings</Text>
                </View>

                {renderSettingItem(
                  Clock,
                  "Duration (seconds)",
                  editedSettings.duration,
                  (value) => setEditedSettings({ ...editedSettings, duration: value }),
                  "number"
                )}

                {renderSettingItem(
                  Video,
                  "Quality",
                  editedSettings.quality,
                  (value) => setEditedSettings({ ...editedSettings, quality: value }),
                  "select"
                )}

                {renderSettingItem(
                  Music,
                  "Background Music",
                  editedSettings.music,
                  (value) => setEditedSettings({ ...editedSettings, music: value }),
                  "toggle"
                )}

                {renderSettingItem(
                  Mic,
                  "Narration",
                  editedSettings.narration,
                  (value) => setEditedSettings({ ...editedSettings, narration: value }),
                  "toggle"
                )}

                {renderSettingItem(
                  Type,
                  "Subtitles",
                  editedSettings.subtitles,
                  (value) => setEditedSettings({ ...editedSettings, subtitles: value }),
                  "toggle"
                )}
              </View>
            </ScrollView>
          )}

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.regenerateButton]}
              onPress={handleRegenerate}
              disabled={regenerating || saving}
            >
              {regenerating ? (
                <ActivityIndicator size="small" color={theme.colors.textPrimary} />
              ) : (
                <>
                  <RefreshCw size={20} color={theme.colors.textPrimary} />
                  <Text style={styles.actionButtonText}>Regenerate</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSave}
              disabled={saving || regenerating}
            >
              {saving ? (
                <ActivityIndicator size="small" color={theme.colors.textPrimary} />
              ) : (
                <>
                  <Save size={20} color={theme.colors.textPrimary} />
                  <Text style={styles.actionButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: "90%",
    ...theme.shadows.large,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
  closeButton: {
    padding: theme.spacing.xs,
  },
  loadingContainer: {
    padding: theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
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
  inputGroup: {
    marginBottom: theme.spacing.md,
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
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  stylesContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
  styleOption: {
    width: 120,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    backgroundColor: theme.colors.backgroundCard,
    alignItems: "center",
    position: "relative",
  },
  styleOptionActive: {
    backgroundColor: theme.colors.primary + "20",
  },
  stylePreview: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  styleName: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  styleNameActive: {
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  checkIcon: {
    position: "absolute",
    top: theme.spacing.xs,
    right: theme.spacing.xs,
  },
  settingItem: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  settingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  settingLabel: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
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
    alignItems: "center",
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  toggleText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  toggleTextActive: {
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    minHeight: 50,
  },
  regenerateButton: {
    backgroundColor: theme.colors.secondary,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
  },
  actionButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
  },
});

export default AnimationVideoEditor;

