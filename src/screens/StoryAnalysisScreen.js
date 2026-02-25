import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  FlatList,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  Star,
  Users,
  BookOpen,
  BarChart3,
  Calendar,
  ArrowUp,
  ArrowDown,
  Share2,
  Bookmark,
  Target,
  Award,
  Zap,
} from "lucide-react-native";
import { api } from "../api";
import { theme } from "../constants/theme";

const StoryAnalysisScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { storyId } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [storyAnalysis, setStoryAnalysis] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [engagementData, setEngagementData] = useState(null);
  const [demographics, setDemographics] = useState(null);
  const [allStoriesAnalysis, setAllStoriesAnalysis] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const periods = [
    { id: "7d", label: "7 Days" },
    { id: "30d", label: "30 Days" },
    { id: "90d", label: "90 Days" },
    { id: "1y", label: "1 Year" },
    { id: "all", label: "All Time" },
  ];

  useEffect(() => {
    if (storyId) {
      loadStoryAnalysis();
    } else {
      loadAllStoriesAnalysis();
    }
  }, [selectedPeriod, storyId]);

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

  const loadStoryAnalysis = async () => {
    if (!storyId) return;

    try {
      setLoading(true);
      const [analysisRes, performanceRes, engagementRes, demographicsRes] = await Promise.all([
        api.getStoryAnalysis(storyId, selectedPeriod),
        api.getStoryPerformanceMetrics(storyId, selectedPeriod),
        api.getStoryEngagementData(storyId, selectedPeriod),
        api.getStoryReaderDemographics(storyId),
      ]);

      if (analysisRes.isSuccess) {
        setStoryAnalysis(analysisRes.analysis);
      }

      if (performanceRes.isSuccess) {
        setPerformanceMetrics(performanceRes.metrics);
      }

      if (engagementRes.isSuccess) {
        setEngagementData(engagementRes.engagement);
      }

      if (demographicsRes.isSuccess) {
        setDemographics(demographicsRes.demographics);
      }
    } catch (error) {
      console.error("Error loading story analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllStoriesAnalysis = async () => {
    try {
      setLoading(true);
      const response = await api.getAllStoriesAnalysis(selectedPeriod);
      if (response.isSuccess) {
        setAllStoriesAnalysis(response.analysis);
      }
    } catch (error) {
      console.error("Error loading all stories analysis:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderMetricCard = (icon, label, value, change, color, subtitle) => {
    const IconComponent = icon;
    const isPositive = change >= 0;

    return (
      <Animated.View
        style={[
          styles.metricCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={[styles.metricIconContainer, { backgroundColor: color + "20" }]}>
          <IconComponent size={24} color={color} />
        </View>
        <View style={styles.metricContent}>
          <Text style={styles.metricLabel}>{label}</Text>
          <Text style={styles.metricValue}>{value}</Text>
          {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
          {change !== null && change !== undefined && (
            <View style={styles.metricChange}>
              {isPositive ? (
                <ArrowUp size={14} color={theme.colors.success} />
              ) : (
                <ArrowDown size={14} color={theme.colors.error} />
              )}
              <Text
                style={[
                  styles.metricChangeText,
                  { color: isPositive ? theme.colors.success : theme.colors.error },
                ]}
              >
                {Math.abs(change)}%
              </Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderStoryComparisonItem = ({ item, index }) => {
    return (
      <Animated.View
        style={[
          styles.comparisonItem,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateX: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.comparisonRank}>
          <Text style={styles.comparisonRankText}>#{index + 1}</Text>
        </View>
        <View style={styles.comparisonContent}>
          <Text style={styles.comparisonTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.comparisonMetrics}>
            <View style={styles.comparisonMetric}>
              <Eye size={14} color={theme.colors.info} />
              <Text style={styles.comparisonMetricText}>{item.views || 0}</Text>
            </View>
            <View style={styles.comparisonMetric}>
              <Heart size={14} color={theme.colors.error} />
              <Text style={styles.comparisonMetricText}>{item.likes || 0}</Text>
            </View>
            <View style={styles.comparisonMetric}>
              <Star size={14} color={theme.colors.accent} />
              <Text style={styles.comparisonMetricText}>
                {item.rating?.toFixed(1) || "0.0"}
              </Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading analysis...</Text>
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
          <BarChart3 size={24} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>
            {storyId ? "Story Analysis" : "All Stories Analysis"}
          </Text>
        </View>
        <View style={styles.headerButton} />
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
          {/* Period Selector */}
          <View style={styles.periodSelector}>
            <Calendar size={20} color={theme.colors.primary} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.periodButtons}>
                {periods.map((period) => (
                  <TouchableOpacity
                    key={period.id}
                    style={[
                      styles.periodButton,
                      selectedPeriod === period.id && styles.periodButtonActive,
                    ]}
                    onPress={() => setSelectedPeriod(period.id)}
                  >
                    <Text
                      style={[
                        styles.periodButtonText,
                        selectedPeriod === period.id && styles.periodButtonTextActive,
                      ]}
                    >
                      {period.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Single Story Analysis */}
          {storyId && storyAnalysis && (
            <>
              {/* Story Overview */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <BookOpen size={20} color={theme.colors.primary} />
                  <Text style={styles.sectionTitle}>Story Overview</Text>
                </View>
                <View style={styles.storyInfoCard}>
                  <Text style={styles.storyTitle}>{storyAnalysis.title || "Untitled Story"}</Text>
                  <Text style={styles.storyDescription}>
                    {storyAnalysis.description || "No description"}
                  </Text>
                  <View style={styles.storyMeta}>
                    <View style={styles.storyMetaItem}>
                      <BookOpen size={16} color={theme.colors.textSecondary} />
                      <Text style={styles.storyMetaText}>
                        {storyAnalysis.chapters_count || 0} chapters
                      </Text>
                    </View>
                    <View style={styles.storyMetaItem}>
                      <Clock size={16} color={theme.colors.textSecondary} />
                      <Text style={styles.storyMetaText}>
                        {new Date(storyAnalysis.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Performance Metrics */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Target size={20} color={theme.colors.success} />
                  <Text style={styles.sectionTitle}>Performance Metrics</Text>
                </View>
                <View style={styles.metricsGrid}>
                  {renderMetricCard(
                    Eye,
                    "Total Views",
                    storyAnalysis.total_views || 0,
                    storyAnalysis.views_change,
                    theme.colors.info,
                    "All time"
                  )}
                  {renderMetricCard(
                    Heart,
                    "Total Likes",
                    storyAnalysis.total_likes || 0,
                    storyAnalysis.likes_change,
                    theme.colors.error,
                    "Received"
                  )}
                  {renderMetricCard(
                    MessageCircle,
                    "Comments",
                    storyAnalysis.total_comments || 0,
                    storyAnalysis.comments_change,
                    theme.colors.secondary,
                    "Received"
                  )}
                  {renderMetricCard(
                    Star,
                    "Average Rating",
                    storyAnalysis.average_rating?.toFixed(1) || "0.0",
                    storyAnalysis.rating_change,
                    theme.colors.accent,
                    "Out of 5.0"
                  )}
                </View>
              </View>

              {/* Engagement Data */}
              {engagementData && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Zap size={20} color={theme.colors.accent} />
                    <Text style={styles.sectionTitle}>Engagement</Text>
                  </View>
                  <View style={styles.metricsGrid}>
                    {renderMetricCard(
                      TrendingUp,
                      "Engagement Rate",
                      `${engagementData.engagement_rate || 0}%`,
                      engagementData.engagement_rate_change,
                      theme.colors.success,
                      "Average"
                    )}
                    {renderMetricCard(
                      Share2,
                      "Shares",
                      engagementData.shares || 0,
                      engagementData.shares_change,
                      theme.colors.secondary,
                      "Total"
                    )}
                    {renderMetricCard(
                      Bookmark,
                      "Saves",
                      engagementData.saves || 0,
                      engagementData.saves_change,
                      theme.colors.warning,
                      "Total"
                    )}
                    {renderMetricCard(
                      Clock,
                      "Avg. Read Time",
                      `${engagementData.avg_read_time || 0}m`,
                      null,
                      theme.colors.info,
                      "Per reader"
                    )}
                  </View>
                </View>
              )}

              {/* Performance Details */}
              {performanceMetrics && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Award size={20} color={theme.colors.warning} />
                    <Text style={styles.sectionTitle}>Performance Details</Text>
                  </View>
                  <View style={styles.performanceContainer}>
                    <View style={styles.performanceItem}>
                      <Text style={styles.performanceLabel}>Peak Views Day</Text>
                      <Text style={styles.performanceValue}>
                        {performanceMetrics.peak_views_day || "N/A"}
                      </Text>
                      <Text style={styles.performanceSubtext}>
                        {performanceMetrics.peak_views_count || 0} views
                      </Text>
                    </View>
                    <View style={styles.performanceItem}>
                      <Text style={styles.performanceLabel}>Best Performing Chapter</Text>
                      <Text style={styles.performanceValue}>
                        {performanceMetrics.best_chapter?.title || "N/A"}
                      </Text>
                      <Text style={styles.performanceSubtext}>
                        {performanceMetrics.best_chapter?.views || 0} views
                      </Text>
                    </View>
                    <View style={styles.performanceItem}>
                      <Text style={styles.performanceLabel}>Completion Rate</Text>
                      <Text style={styles.performanceValue}>
                        {performanceMetrics.completion_rate || 0}%
                      </Text>
                      <Text style={styles.performanceSubtext}>
                        Readers who finished
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Demographics */}
              {demographics && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Users size={20} color={theme.colors.secondary} />
                    <Text style={styles.sectionTitle}>Reader Demographics</Text>
                  </View>
                  <View style={styles.demographicsContainer}>
                    {demographics.age_groups && (
                      <View style={styles.demographicItem}>
                        <Text style={styles.demographicLabel}>Age Groups</Text>
                        {Object.entries(demographics.age_groups).map(([age, count]) => (
                          <View key={age} style={styles.demographicBar}>
                            <Text style={styles.demographicBarLabel}>{age}</Text>
                            <View style={styles.demographicBarContainer}>
                              <View
                                style={[
                                  styles.demographicBarFill,
                                  {
                                    width: `${(count / demographics.total_readers) * 100}%`,
                                    backgroundColor: theme.colors.primary,
                                  },
                                ]}
                              />
                            </View>
                            <Text style={styles.demographicBarValue}>{count}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                    {demographics.geographic_distribution && (
                      <View style={styles.demographicItem}>
                        <Text style={styles.demographicLabel}>Top Regions</Text>
                        {demographics.geographic_distribution.slice(0, 5).map((region, index) => (
                          <View key={index} style={styles.regionItem}>
                            <Text style={styles.regionName}>{region.region || "Unknown"}</Text>
                            <Text style={styles.regionCount}>{region.count || 0} readers</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              )}
            </>
          )}

          {/* All Stories Analysis */}
          {!storyId && allStoriesAnalysis && (
            <>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Award size={20} color={theme.colors.warning} />
                  <Text style={styles.sectionTitle}>Overall Statistics</Text>
                </View>
                <View style={styles.metricsGrid}>
                  {renderMetricCard(
                    BookOpen,
                    "Total Stories",
                    allStoriesAnalysis.total_stories || 0,
                    allStoriesAnalysis.stories_change,
                    theme.colors.primary,
                    "Published"
                  )}
                  {renderMetricCard(
                    Eye,
                    "Total Views",
                    allStoriesAnalysis.total_views || 0,
                    allStoriesAnalysis.views_change,
                    theme.colors.info,
                    "Across all"
                  )}
                  {renderMetricCard(
                    Heart,
                    "Total Likes",
                    allStoriesAnalysis.total_likes || 0,
                    allStoriesAnalysis.likes_change,
                    theme.colors.error,
                    "Received"
                  )}
                  {renderMetricCard(
                    Star,
                    "Avg. Rating",
                    allStoriesAnalysis.average_rating?.toFixed(1) || "0.0",
                    null,
                    theme.colors.accent,
                    "Overall"
                  )}
                </View>
              </View>

              {/* Top Stories Comparison */}
              {allStoriesAnalysis.top_stories && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <TrendingUp size={20} color={theme.colors.success} />
                    <Text style={styles.sectionTitle}>Top Performing Stories</Text>
                  </View>
                  <FlatList
                    data={allStoriesAnalysis.top_stories}
                    renderItem={renderStoryComparisonItem}
                    keyExtractor={(item, index) => `${item.id || index}`}
                    scrollEnabled={false}
                    contentContainerStyle={styles.comparisonList}
                  />
                </View>
              )}
            </>
          )}
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
    width: 40,
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
  periodSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  periodButtons: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  periodButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  periodButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  periodButtonText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  periodButtonTextActive: {
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
  storyInfoCard: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  storyTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  storyDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  storyMeta: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  storyMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  storyMetaText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  metricCard: {
    width: "48%",
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  metricIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  metricContent: {
    flex: 1,
  },
  metricLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  metricValue: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    fontWeight: "700",
    marginBottom: theme.spacing.xs,
  },
  metricSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  metricChange: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  metricChangeText: {
    ...theme.typography.caption,
    fontWeight: "600",
  },
  performanceContainer: {
    gap: theme.spacing.md,
  },
  performanceItem: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  performanceLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  performanceValue: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  performanceSubtext: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  demographicsContainer: {
    gap: theme.spacing.md,
  },
  demographicItem: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  demographicLabel: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
    marginBottom: theme.spacing.md,
  },
  demographicBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  demographicBarLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    width: 60,
  },
  demographicBarContainer: {
    flex: 1,
    height: 20,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
  },
  demographicBarFill: {
    height: "100%",
    borderRadius: theme.borderRadius.md,
  },
  demographicBarValue: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    fontWeight: "600",
    width: 40,
    textAlign: "right",
  },
  regionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  regionName: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  regionCount: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  comparisonList: {
    gap: theme.spacing.md,
  },
  comparisonItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
    gap: theme.spacing.md,
  },
  comparisonRank: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  comparisonRankText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  comparisonContent: {
    flex: 1,
  },
  comparisonTitle: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  comparisonMetrics: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  comparisonMetric: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  comparisonMetricText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
});

export default StoryAnalysisScreen;

