import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  Dimensions,
} from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Sparkles,
  Loader,
  RefreshCw,
} from "lucide-react-native";
import { api } from "../api";
import { theme } from "../constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ImageGenerationScreen = ({ route, navigation }) => {
  const { storyId, initialSceneId } = route.params || {};
  
  const [timeline, setTimeline] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchTimeline();
  }, [storyId]);

  useEffect(() => {
    if (initialSceneId && timeline.length > 0) {
      const index = timeline.findIndex((item) => item.scene_id === initialSceneId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [timeline, initialSceneId]);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getStoryTimeline(storyId);
      
      if (response.isSuccess) {
        setTimeline(response.timeline || []);
        // Fetch existing images
        const imagesResponse = await api.getStoryImages(storyId);
        if (imagesResponse.isSuccess) {
          const imagesMap = {};
          imagesResponse.images.forEach((img) => {
            imagesMap[img.scene_id] = img.image_url;
          });
          setImages(imagesMap);
        }
      } else {
        setError(response.message || "Failed to load timeline");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const animateTransition = (direction) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: direction === "next" ? -50 : 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      fadeAnim.setValue(1);
      slideAnim.setValue(0);
    });
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      animateTransition("prev");
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < timeline.length - 1) {
      animateTransition("next");
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleGenerateImage = async () => {
    const currentScene = timeline[currentIndex];
    if (!currentScene || images[currentScene.scene_id]) {
      return;
    }

    try {
      setGenerating(true);
      setError(null);
      
      const context = {
        scene_text: currentScene.text,
        chapter_name: currentScene.chapter_name,
        character_name: currentScene.character_name,
      };

      const response = await api.generateImage(
        storyId,
        currentScene.scene_id,
        context
      );

      if (response.isSuccess) {
        setImages((prev) => ({
          ...prev,
          [currentScene.scene_id]: response.imageUrl,
        }));
      } else {
        setError(response.message || "Failed to generate image");
      }
    } catch (err) {
      setError(err.message || "An error occurred while generating image");
    } finally {
      setGenerating(false);
    }
  };

  const currentScene = timeline[currentIndex];
  const currentImage = currentScene ? images[currentScene.scene_id] : null;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Loader size={48} color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading timeline...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && timeline.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchTimeline}
          >
            <RefreshCw size={20} color={theme.colors.textPrimary} />
            <Text style={styles.retryButtonText}>Retry</Text>
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
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ChevronLeft size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Sparkles size={24} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>Story Timeline</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Timeline Indicator */}
      <View style={styles.timelineContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.timelineScroll}
        >
          {timeline.map((scene, index) => (
            <TouchableOpacity
              key={scene.scene_id}
              style={[
                styles.timelineDot,
                index === currentIndex && styles.timelineDotActive,
              ]}
              onPress={() => {
                animateTransition(index > currentIndex ? "next" : "prev");
                setCurrentIndex(index);
              }}
            >
              <View
                style={[
                  styles.timelineDotInner,
                  index === currentIndex && styles.timelineDotInnerActive,
                  images[scene.scene_id] && styles.timelineDotWithImage,
                ]}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.timelineText}>
          Scene {currentIndex + 1} of {timeline.length}
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentScene && (
          <Animated.View
            style={[
              styles.sceneContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            {/* Scene Info */}
            <View style={styles.sceneInfo}>
              <Text style={styles.chapterName}>{currentScene.chapter_name}</Text>
              {currentScene.character_name && (
                <Text style={styles.characterName}>
                  Character: {currentScene.character_name}
                </Text>
              )}
            </View>

            {/* Image Display/Generation */}
            <View style={styles.imageContainer}>
              {currentImage ? (
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: currentImage }}
                    style={styles.generatedImage}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay}>
                    <ImageIcon size={24} color={theme.colors.textPrimary} />
                    <Text style={styles.imageLabel}>Generated Image</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.placeholderImage}>
                  <ImageIcon size={64} color={theme.colors.textMuted} />
                  <Text style={styles.placeholderText}>No image generated</Text>
                </View>
              )}

              {!currentImage && (
                <TouchableOpacity
                  style={[
                    styles.generateButton,
                    generating && styles.generateButtonDisabled,
                  ]}
                  onPress={handleGenerateImage}
                  disabled={generating}
                >
                  {generating ? (
                    <>
                      <ActivityIndicator
                        size="small"
                        color={theme.colors.textPrimary}
                      />
                      <Text style={styles.generateButtonText}>Generating...</Text>
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} color={theme.colors.textPrimary} />
                      <Text style={styles.generateButtonText}>
                        Generate Image
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}

              {currentImage && (
                <TouchableOpacity
                  style={styles.regenerateButton}
                  onPress={handleGenerateImage}
                  disabled={generating}
                >
                  <RefreshCw
                    size={18}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.regenerateButtonText}>Regenerate</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Scene Text */}
            <View style={styles.sceneTextContainer}>
              <Text style={styles.sceneTextLabel}>Scene Context</Text>
              <Text style={styles.sceneText}>{currentScene.text}</Text>
            </View>

            {error && (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            )}
          </Animated.View>
        )}
      </ScrollView>

      {/* Navigation Controls */}
      <View style={styles.navigationControls}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft
            size={24}
            color={
              currentIndex === 0
                ? theme.colors.textMuted
                : theme.colors.textPrimary
            }
          />
          <Text
            style={[
              styles.navButtonText,
              currentIndex === 0 && styles.navButtonTextDisabled,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <View style={styles.navIndicator}>
          <Text style={styles.navIndicatorText}>
            {currentIndex + 1} / {timeline.length}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentIndex === timeline.length - 1 && styles.navButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={currentIndex === timeline.length - 1}
        >
          <Text
            style={[
              styles.navButtonText,
              currentIndex === timeline.length - 1 &&
                styles.navButtonTextDisabled,
            ]}
          >
            Next
          </Text>
          <ChevronRight
            size={24}
            color={
              currentIndex === timeline.length - 1
                ? theme.colors.textMuted
                : theme.colors.textPrimary
            }
          />
        </TouchableOpacity>
      </View>
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
    ...theme.typography.body,
    color: theme.colors.error,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
  },
  retryButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.sm,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  timelineContainer: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  timelineScroll: {
    paddingHorizontal: theme.spacing.sm,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  timelineDotActive: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  timelineDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.textMuted,
  },
  timelineDotInnerActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  timelineDotWithImage: {
    backgroundColor: theme.colors.secondary,
  },
  timelineText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  sceneContainer: {
    marginBottom: theme.spacing.xl,
  },
  sceneInfo: {
    marginBottom: theme.spacing.lg,
  },
  chapterName: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  characterName: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  imageContainer: {
    marginBottom: theme.spacing.lg,
  },
  imageWrapper: {
    borderRadius: theme.borderRadius.xl,
    overflow: "hidden",
    marginBottom: theme.spacing.md,
    ...theme.shadows.large,
  },
  generatedImage: {
    width: "100%",
    height: SCREEN_WIDTH * 0.7,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  imageOverlay: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundCard + "E6",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  imageLabel: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  placeholderImage: {
    width: "100%",
    height: SCREEN_WIDTH * 0.7,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    marginBottom: theme.spacing.md,
  },
  placeholderText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.sm,
    ...theme.shadows.glow,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
  },
  regenerateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.backgroundSecondary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  regenerateButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  sceneTextContainer: {
    backgroundColor: theme.colors.backgroundCard,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sceneTextLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sceneText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    lineHeight: 24,
  },
  errorBanner: {
    backgroundColor: theme.colors.error + "20",
    borderWidth: 1,
    borderColor: theme.colors.error,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  errorBannerText: {
    ...theme.typography.bodySmall,
    color: theme.colors.error,
  },
  navigationControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.xs,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  navButtonTextDisabled: {
    color: theme.colors.textMuted,
  },
  navIndicator: {
    backgroundColor: theme.colors.backgroundCard,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  navIndicatorText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
});

export default ImageGenerationScreen;

