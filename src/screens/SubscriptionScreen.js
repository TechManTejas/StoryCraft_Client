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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  ChevronLeft,
  Crown,
  Check,
  Star,
  Sparkles,
  Zap,
  Gift,
  CreditCard,
  Calendar,
  X,
  AlertCircle,
} from "lucide-react-native";
import { api } from "../api";
import { theme } from "../constants/theme";

const SubscriptionScreen = () => {
  const navigation = useNavigation();
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    loadSubscriptionData();
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

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      const [plansResponse, subscriptionResponse] = await Promise.all([
        api.getSubscriptionPlans(),
        api.getCurrentSubscription(),
      ]);

      if (plansResponse.isSuccess) {
        setPlans(plansResponse.plans);
      }

      if (subscriptionResponse.isSuccess) {
        setCurrentSubscription(subscriptionResponse.subscription);
      }
    } catch (error) {
      console.error("Error loading subscription data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    Alert.alert(
      "Confirm Subscription",
      "Are you sure you want to subscribe to this plan?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Subscribe",
          onPress: async () => {
            try {
              setSubscribing(true);
              const response = await api.subscribe(planId, "card");
              if (response.isSuccess) {
                Alert.alert("Success", "Subscription activated successfully!");
                setCurrentSubscription(response.subscription);
                loadSubscriptionData();
              } else {
                Alert.alert("Error", response.message || "Failed to subscribe");
              }
            } catch (error) {
              Alert.alert("Error", "Failed to process subscription");
            } finally {
              setSubscribing(false);
            }
          },
        },
      ]
    );
  };

  const handleCancelSubscription = async () => {
    Alert.alert(
      "Cancel Subscription",
      "Are you sure you want to cancel your subscription?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await api.cancelSubscription();
              if (response.isSuccess) {
                Alert.alert("Success", "Subscription cancelled successfully");
                setCurrentSubscription(null);
                loadSubscriptionData();
              } else {
                Alert.alert("Error", response.message || "Failed to cancel subscription");
              }
            } catch (error) {
              Alert.alert("Error", "Failed to cancel subscription");
            }
          },
        },
      ]
    );
  };

  const renderPlanCard = (plan, index) => {
    const isCurrentPlan = currentSubscription?.plan_id === plan.id;
    const isPopular = plan.is_popular || index === 1;
    const IconComponent = index === 0 ? Star : index === 1 ? Crown : Zap;

    return (
      <Animated.View
        key={plan.id}
        style={[
          styles.planCard,
          isPopular && styles.planCardPopular,
          isCurrentPlan && styles.planCardCurrent,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 50],
                  extrapolate: "clamp",
                }),
              },
            ],
          },
        ]}
      >
        {isPopular && (
          <View style={styles.popularBadge}>
            <Sparkles size={16} color={theme.colors.textPrimary} />
            <Text style={styles.popularBadgeText}>Most Popular</Text>
          </View>
        )}

        {isCurrentPlan && (
          <View style={styles.currentBadge}>
            <Check size={16} color={theme.colors.textPrimary} />
            <Text style={styles.currentBadgeText}>Current Plan</Text>
          </View>
        )}

        <View style={styles.planHeader}>
          <View style={[styles.planIcon, { backgroundColor: plan.color + "20" }]}>
            <IconComponent size={32} color={plan.color || theme.colors.primary} />
          </View>
          <Text style={styles.planName}>{plan.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.planPrice}>${plan.price}</Text>
            <Text style={styles.planPeriod}>/{plan.period}</Text>
          </View>
        </View>

        <Text style={styles.planDescription}>{plan.description}</Text>

        <View style={styles.featuresContainer}>
          {plan.features?.map((feature, idx) => (
            <View key={idx} style={styles.featureItem}>
              <Check size={18} color={theme.colors.success} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.subscribeButton,
            isCurrentPlan && styles.subscribeButtonCurrent,
            isPopular && styles.subscribeButtonPopular,
          ]}
          onPress={() => {
            if (isCurrentPlan) {
              handleCancelSubscription();
            } else {
              handleSubscribe(plan.id);
            }
          }}
          disabled={subscribing}
        >
          {subscribing && selectedPlan === plan.id ? (
            <ActivityIndicator size="small" color={theme.colors.textPrimary} />
          ) : (
            <Text style={styles.subscribeButtonText}>
              {isCurrentPlan ? "Cancel Subscription" : "Subscribe Now"}
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading plans...</Text>
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
          <Crown size={24} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>Subscription</Text>
        </View>
        <View style={styles.placeholder} />
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
          {/* Current Subscription Info */}
          {currentSubscription && (
            <View style={styles.currentSubscriptionCard}>
              <View style={styles.currentSubscriptionHeader}>
                <Crown size={24} color={theme.colors.accent} />
                <Text style={styles.currentSubscriptionTitle}>Active Subscription</Text>
              </View>
              <View style={styles.currentSubscriptionInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Plan:</Text>
                  <Text style={styles.infoValue}>
                    {currentSubscription.plan_name || "Premium"}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Status:</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>
                      {currentSubscription.status || "Active"}
                    </Text>
                  </View>
                </View>
                {currentSubscription.expires_at && (
                  <View style={styles.infoRow}>
                    <Calendar size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.infoLabel}>Expires:</Text>
                    <Text style={styles.infoValue}>
                      {new Date(currentSubscription.expires_at).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Benefits Section */}
          <View style={styles.benefitsSection}>
            <View style={styles.sectionHeader}>
              <Gift size={24} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Premium Benefits</Text>
            </View>
            <View style={styles.benefitsGrid}>
              <View style={styles.benefitItem}>
                <Sparkles size={24} color={theme.colors.primary} />
                <Text style={styles.benefitText}>Unlimited Stories</Text>
              </View>
              <View style={styles.benefitItem}>
                <Zap size={24} color={theme.colors.accent} />
                <Text style={styles.benefitText}>Priority Support</Text>
              </View>
              <View style={styles.benefitItem}>
                <Crown size={24} color={theme.colors.secondary} />
                <Text style={styles.benefitText}>Exclusive Content</Text>
              </View>
              <View style={styles.benefitItem}>
                <Star size={24} color={theme.colors.primary} />
                <Text style={styles.benefitText}>Ad-Free Experience</Text>
              </View>
            </View>
          </View>

          {/* Plans Section */}
          <View style={styles.plansSection}>
            <View style={styles.sectionHeader}>
              <CreditCard size={24} color={theme.colors.primary} />
              <Text style={styles.sectionTitle}>Choose Your Plan</Text>
            </View>

            {plans.length > 0 ? (
              plans.map((plan, index) => renderPlanCard(plan, index))
            ) : (
              <View style={styles.defaultPlans}>
                {renderPlanCard(
                  {
                    id: 1,
                    name: "Basic",
                    price: 0,
                    period: "month",
                    description: "Free plan with basic features",
                    features: [
                      "Limited stories per month",
                      "Basic support",
                      "Standard content access",
                    ],
                    color: theme.colors.textSecondary,
                  },
                  0
                )}
                {renderPlanCard(
                  {
                    id: 2,
                    name: "Premium",
                    price: 9.99,
                    period: "month",
                    description: "Unlock all features and exclusive content",
                    features: [
                      "Unlimited stories",
                      "Priority support",
                      "Exclusive content",
                      "Ad-free experience",
                      "Early access to features",
                    ],
                    color: theme.colors.primary,
                    is_popular: true,
                  },
                  1
                )}
                {renderPlanCard(
                  {
                    id: 3,
                    name: "Pro",
                    price: 19.99,
                    period: "month",
                    description: "For power users and creators",
                    features: [
                      "Everything in Premium",
                      "Advanced analytics",
                      "Custom themes",
                      "API access",
                      "Creator tools",
                    ],
                    color: theme.colors.secondary,
                  },
                  2
                )}
              </View>
            )}
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <AlertCircle size={20} color={theme.colors.info} />
              <Text style={styles.infoText}>
                All subscriptions auto-renew. Cancel anytime from your account settings.
              </Text>
            </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  content: {
    padding: theme.spacing.lg,
  },
  currentSubscriptionCard: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    ...theme.shadows.large,
  },
  currentSubscriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  currentSubscriptionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  currentSubscriptionInfo: {
    gap: theme.spacing.sm,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  infoLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  statusBadge: {
    backgroundColor: theme.colors.success + "20",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  statusText: {
    ...theme.typography.bodySmall,
    color: theme.colors.success,
    fontWeight: "600",
  },
  benefitsSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
  },
  benefitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  benefitItem: {
    width: "48%",
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: "center",
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  benefitText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    textAlign: "center",
    fontWeight: "600",
  },
  plansSection: {
    marginBottom: theme.spacing.xl,
  },
  defaultPlans: {
    gap: theme.spacing.lg,
  },
  planCard: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    position: "relative",
    ...theme.shadows.large,
  },
  planCardPopular: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "10",
  },
  planCardCurrent: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.success + "10",
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    right: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
    ...theme.shadows.medium,
  },
  popularBadgeText: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  currentBadge: {
    position: "absolute",
    top: -12,
    right: theme.spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
    ...theme.shadows.medium,
  },
  currentBadgeText: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  planHeader: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  planIcon: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.round,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  planName: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  planPrice: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    fontWeight: "800",
  },
  planPeriod: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  planDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  featuresContainer: {
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  featureText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: theme.colors.backgroundSecondary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  subscribeButtonPopular: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  subscribeButtonCurrent: {
    backgroundColor: theme.colors.error + "20",
    borderColor: theme.colors.error,
  },
  subscribeButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
  infoSection: {
    marginTop: theme.spacing.lg,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundCard,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    flex: 1,
  },
});

export default SubscriptionScreen;

