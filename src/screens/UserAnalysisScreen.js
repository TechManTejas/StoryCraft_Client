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
import { useNavigation } from "@react-navigation/native";
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Heart,
  Eye,
  MessageCircle,
  Clock,
  Star,
  Award,
  BarChart3,
  Calendar,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Target,
  Zap,
} from "lucide-react-native";
import { api } from "../api";
import { theme } from "../constants/theme";

const UserAnalysisScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [userAnalysis, setUserAnalysis] = useState(null);
  const [activityTimeline, setActivityTimeline] = useState([]);
  const [engagementMetrics, setEngagementMetrics] = useState(null);
  const [contentPerformance, setContentPerformance] = useState(null);

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
    loadAnalysisData();
  }, [selectedPeriod]);

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

  const loadAnalysisData = async () => {
    try {
      setLoading(true);
      const [analysisRes, timelineRes, engagementRes, performanceRes] = await Promise.all([
        api.getUserAnalysis(selectedPeriod),
        api.getUserActivityTimeline(selectedPeriod),
        api.getUserEngagementMetrics(selectedPeriod),
        api.getUserContentPerformance(selectedPeriod),
      ]);

      if (analysisRes.isSuccess) {
        setUserAnalysis(analysisRes.analysis);
      }

      if (timelineRes.isSuccess) {
        setActivityTimeline(timelineRes.timeline || []);
      }

      if (engagementRes.isSuccess) {
        setEngagementMetrics(engagementRes.metrics);
      }

      if (performanceRes.isSuccess) {
        setContentPerformance(performanceRes.performance);
      }
    } catch (error) {
      console.error("Error loading analysis data:", error);
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

  const renderActivityItem = ({ item, index }) => {
    return (
      <Animated.View
        style={[
          styles.activityItem,
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
        <View style={styles.activityIconContainer}>
          {item.type === "story_created" && <BookOpen size={20} color={theme.colors.primary} />}
          {item.type === "story_liked" && <Heart size={20} color={theme.colors.error} />}
          {item.type === "comment" && <MessageCircle size={20} color={theme.colors.secondary} />}
          {item.type === "view" && <Eye size={20} color={theme.colors.info} />}
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.activityText}>{item.description || item.action}</Text>
          <Text style={styles.activityTime}>
            {new Date(item.timestamp || item.created_at).toLocaleString()}
          </Text>
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
          <Text style={styles.headerTitle}>User Analysis</Text>
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

          {/* Overview Metrics */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Target size={20} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Overview</Text>
            </View>
            <View style={styles.metricsGrid}>
              {renderMetricCard(
                BookOpen,
                "Stories Created",
                userAnalysis?.stories_created || 0,
                userAnalysis?.stories_created_change,
                theme.colors.primary,
                "Total stories"
              )}
              {renderMetricCard(
                Eye,
                "Total Views",
                userAnalysis?.total_views || 0,
                userAnalysis?.views_change,
                theme.colors.info,
                "Across all stories"
              )}
              {renderMetricCard(
                Heart,
                "Total Likes",
                userAnalysis?.total_likes || 0,
                userAnalysis?.likes_change,
                theme.colors.error,
                "Received"
              )}
              {renderMetricCard(
                MessageCircle,
                "Comments",
                userAnalysis?.total_comments || 0,
                userAnalysis?.comments_change,
                theme.colors.secondary,
                "Received"
              )}
            </View>
          </View>

          {/* Engagement Metrics */}
          {engagementMetrics && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Zap size={20} color={theme.colors.accent} />
                <Text style={styles.sectionTitle}>Engagement</Text>
              </View>
              <View style={styles.metricsGrid}>
                {renderMetricCard(
                  TrendingUp,
                  "Engagement Rate",
                  `${engagementMetrics.engagement_rate || 0}%`,
                  engagementMetrics.engagement_rate_change,
                  theme.colors.success,
                  "Average"
                )}
                {renderMetricCard(
                  Users,
                  "Followers",
                  engagementMetrics.followers || 0,
                  engagementMetrics.followers_change,
                  theme.colors.secondary,
                  "Total"
                )}
                {renderMetricCard(
                  Star,
                  "Average Rating",
                  engagementMetrics.average_rating?.toFixed(1) || "0.0",
                  engagementMetrics.rating_change,
                  theme.colors.accent,
                  "Out of 5.0"
                )}
                {renderMetricCard(
                  Clock,
                  "Avg. Reading Time",
                  `${engagementMetrics.avg_reading_time || 0}m`,
                  null,
                  theme.colors.info,
                  "Per story"
                )}
              </View>
            </View>
          )}

          {/* Content Performance */}
          {contentPerformance && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Award size={20} color={theme.colors.warning} />
                <Text style={styles.sectionTitle}>Content Performance</Text>
              </View>
              <View style={styles.performanceContainer}>
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceLabel}>Top Performing Story</Text>
                  <Text style={styles.performanceValue}>
                    {contentPerformance.top_story?.title || "N/A"}
                  </Text>
                  <Text style={styles.performanceSubtext}>
                    {contentPerformance.top_story?.views || 0} views
                  </Text>
                </View>
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceLabel}>Most Liked Story</Text>
                  <Text style={styles.performanceValue}>
                    {contentPerformance.most_liked?.title || "N/A"}
                  </Text>
                  <Text style={styles.performanceSubtext}>
                    {contentPerformance.most_liked?.likes || 0} likes
                  </Text>
                </View>
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceLabel}>Most Commented Story</Text>
                  <Text style={styles.performanceValue}>
                    {contentPerformance.most_commented?.title || "N/A"}
                  </Text>
                  <Text style={styles.performanceSubtext}>
                    {contentPerformance.most_commented?.comments || 0} comments
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Activity Timeline */}
          {activityTimeline.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock size={20} color={theme.colors.textSecondary} />
                <Text style={styles.sectionTitle}>Recent Activity</Text>
              </View>
              <FlatList
                data={activityTimeline.slice(0, 10)}
                renderItem={renderActivityItem}
                keyExtractor={(item, index) => `${item.id || index}-${item.timestamp}`}
                scrollEnabled={false}
                contentContainerStyle={styles.activityList}
              />
            </View>
          )}

          {/* Growth Trends */}
          {userAnalysis?.growth_trends && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TrendingUp size={20} color={theme.colors.success} />
                <Text style={styles.sectionTitle}>Growth Trends</Text>
              </View>
              <View style={styles.trendsContainer}>
                <View style={styles.trendItem}>
                  <Text style={styles.trendLabel}>Stories Growth</Text>
                  <View style={styles.trendValueContainer}>
                    <Text style={styles.trendValue}>
                      {userAnalysis.growth_trends.stories_growth || 0}%
                    </Text>
                    {userAnalysis.growth_trends.stories_growth > 0 ? (
                      <TrendingUp size={16} color={theme.colors.success} />
                    ) : (
                      <TrendingDown size={16} color={theme.colors.error} />
                    )}
                  </View>
                </View>
                <View style={styles.trendItem}>
                  <Text style={styles.trendLabel}>Views Growth</Text>
                  <View style={styles.trendValueContainer}>
                    <Text style={styles.trendValue}>
                      {userAnalysis.growth_trends.views_growth || 0}%
                    </Text>
                    {userAnalysis.growth_trends.views_growth > 0 ? (
                      <TrendingUp size={16} color={theme.colors.success} />
                    ) : (
                      <TrendingDown size={16} color={theme.colors.error} />
                    )}
                  </View>
                </View>
                <View style={styles.trendItem}>
                  <Text style={styles.trendLabel}>Engagement Growth</Text>
                  <View style={styles.trendValueContainer}>
                    <Text style={styles.trendValue}>
                      {userAnalysis.growth_trends.engagement_growth || 0}%
                    </Text>
                    {userAnalysis.growth_trends.engagement_growth > 0 ? (
                      <TrendingUp size={16} color={theme.colors.success} />
                    ) : (
                      <TrendingDown size={16} color={theme.colors.error} />
                    )}
                  </View>
                </View>
              </View>
            </View>
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
  activityList: {
    gap: theme.spacing.sm,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  activityTime: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  trendsContainer: {
    gap: theme.spacing.md,
  },
  trendItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  trendLabel: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  trendValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  trendValue: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
});

export default UserAnalysisScreen;

