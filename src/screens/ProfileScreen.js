import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  Animated,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import {
  User,
  BookOpen,
  LogOut,
  Trash2,
  Crown,
  Bookmark,
  Heart,
  Settings,
  HelpCircle,
  MessageCircle,
  FileText,
  Bug,
  Mail,
  Info,
  Shield,
  Star,
  Eye,
  Video,
  ChevronRight,
  X,
  Send,
  Sparkles,
} from "lucide-react-native";
import { api } from "../api";
import { theme } from "../constants/theme";

// Import images from assets
const book1 = require("../../assets/images/story1.jpeg");
const book2 = require("../../assets/images/story12.jpg");
const book3 = require("../../assets/images/story9.jpeg");
const book4 = require("../../assets/images/story7.jpeg");
const book5 = require("../../assets/images/story14.jpg");

const ProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("Passionate writer and developer");
  const [email, setEmail] = useState("");
  const [books, setBooks] = useState([]);
  const [userStats, setUserStats] = useState({
    storiesRead: 0,
    favorites: 0,
    readingTime: 0,
    storiesCreated: 0,
    reelsCreated: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportType, setSupportType] = useState("feedback");
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [faqs, setFaqs] = useState([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    fetchUserData();
    loadUserStats();
    loadFAQs();
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

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const storedUsername = await AsyncStorage.getItem("username");
      const storedEmail = await AsyncStorage.getItem("email");
      if (storedUsername) {
        setUsername(storedUsername);
      }
      if (storedEmail) {
        setEmail(storedEmail);
      }
      setBooks([
        { name: "The Epistle to the Colossians", image: book1 },
        { name: "The Book of Acts", image: book2 },
        { name: "The Revelation of John", image: book3 },
        { name: "The Lotus Sutra", image: book4 },
        { name: "Cyber City", image: book5 },
      ]);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const response = await api.getUserStats();
      if (response.isSuccess) {
        setUserStats(response.stats);
      }
    } catch (error) {
      console.error("Error loading user stats:", error);
    }
  };

  const loadFAQs = async () => {
    try {
      const response = await api.getFAQs();
      if (response.isSuccess) {
        setFaqs(response.faqs);
      } else {
        // Default FAQs if API fails
        setFaqs([
          {
            id: 1,
            question: "How do I create a story?",
            answer: "Go to the Story tab and select your genre. Then start writing your story chapter by chapter.",
          },
          {
            id: 2,
            question: "Can I share my stories?",
            answer: "Yes! You can make your stories public in the Community section and share them with others.",
          },
          {
            id: 3,
            question: "How do subscriptions work?",
            answer: "Subscriptions give you access to premium features like unlimited stories, priority support, and exclusive content.",
          },
          {
            id: 4,
            question: "How do I save a story?",
            answer: "Tap the bookmark icon on any story to save it. You can view all saved stories in your profile.",
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading FAQs:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("token");
              await AsyncStorage.removeItem("username");
              navigation.navigate("SignupScreen");
            } catch (error) {
              console.error("Error removing token:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteAccount,
        },
      ],
      { cancelable: false }
    );
  };

  const deleteAccount = async () => {
    try {
      await api.deleteAccount();
      await AsyncStorage.clear();
      navigation.navigate("SignupScreen");
    } catch (error) {
      await AsyncStorage.clear();
      navigation.navigate("SignupScreen");
    }
  };

  const handleSupportAction = (type) => {
    setSupportType(type);
    setSupportSubject("");
    setSupportMessage("");
    setShowSupportModal(true);
  };

  const handleSubmitSupport = async () => {
    if (!supportSubject.trim() || !supportMessage.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      let response;

      if (supportType === "feedback") {
        response = await api.submitFeedback(supportSubject, supportMessage);
      } else if (supportType === "bug") {
        response = await api.reportBug(supportSubject, supportMessage, "");
      } else if (supportType === "contact") {
        response = await api.contactSupport(supportSubject, supportMessage);
      }

      if (response?.isSuccess) {
        Alert.alert("Success", response.message || "Thank you for your submission!");
        setShowSupportModal(false);
        setSupportSubject("");
        setSupportMessage("");
      } else {
        Alert.alert("Error", response?.message || "Failed to submit. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderBookCard = ({ item, index }) => (
    <Animated.View
      style={[
        styles.bookCard,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 30],
                outputRange: [0, 30 * (index + 1)],
                extrapolate: "clamp",
              }),
            },
          ],
        },
      ]}
    >
      <Image source={item.image} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookName} numberOfLines={2}>
          {item.name}
        </Text>
      </View>
    </Animated.View>
  );

  const renderStatCard = (icon, value, label, color) => (
    <Animated.View
      style={[
        styles.statCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[styles.statIconContainer, { backgroundColor: color + "20" }]}>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );

  const renderSupportItem = (icon, title, description, onPress, color = theme.colors.primary) => (
    <TouchableOpacity style={styles.supportItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.supportIconContainer, { backgroundColor: color + "20" }]}>
        {icon}
      </View>
      <View style={styles.supportContent}>
        <Text style={styles.supportTitle}>{title}</Text>
        {description && <Text style={styles.supportDescription}>{description}</Text>}
      </View>
      <ChevronRight size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderSupportModal = () => (
    <Modal
      visible={showSupportModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowSupportModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {supportType === "feedback"
                ? "Send Feedback"
                : supportType === "bug"
                ? "Report Bug"
                : "Contact Support"}
            </Text>
            <TouchableOpacity onPress={() => setShowSupportModal(false)}>
              <X size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.inputLabel}>Subject</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter subject"
              placeholderTextColor={theme.colors.textMuted}
              value={supportSubject}
              onChangeText={setSupportSubject}
            />

            <Text style={styles.inputLabel}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter your message..."
              placeholderTextColor={theme.colors.textMuted}
              value={supportMessage}
              onChangeText={setSupportMessage}
              multiline
              numberOfLines={6}
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmitSupport}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color={theme.colors.textPrimary} />
              ) : (
                <>
                  <Send size={20} color={theme.colors.textPrimary} />
                  <Text style={styles.submitButtonText}>Submit</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderFAQModal = () => (
    <Modal
      visible={showFAQ}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFAQ(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Frequently Asked Questions</Text>
            <TouchableOpacity onPress={() => setShowFAQ(false)}>
              <X size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={faqs}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.faqItem}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              </View>
            )}
            contentContainerStyle={styles.faqList}
          />
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <Animated.View
          style={[
            styles.profileHeader,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatarGradient}>
              <User size={50} color={theme.colors.primary} />
            </View>
            <View style={styles.avatarBadge}>
              <Crown size={16} color={theme.colors.accent} fill={theme.colors.accent} />
            </View>
          </View>
          <Text style={styles.username}>{username || "User"}</Text>
          {email && <Text style={styles.email}>{email}</Text>}
          <Text style={styles.bio}>{bio}</Text>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View
          style={[
            styles.statsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {renderStatCard(
            <BookOpen size={24} color={theme.colors.primary} />,
            userStats.storiesRead || 0,
            "Stories Read",
            theme.colors.primary
          )}
          {renderStatCard(
            <Heart size={24} color={theme.colors.error} />,
            userStats.favorites || 0,
            "Favorites",
            theme.colors.error
          )}
          {renderStatCard(
            <Eye size={24} color={theme.colors.secondary} />,
            `${userStats.readingTime || 0}h`,
            "Reading Time",
            theme.colors.secondary
          )}
          {renderStatCard(
            <Sparkles size={24} color={theme.colors.accent} />,
            userStats.storiesCreated || 0,
            "Created",
            theme.colors.accent
          )}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          style={[
            styles.quickActionsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate("SavedLikedScreen")}
            activeOpacity={0.8}
          >
            <Bookmark size={24} color={theme.colors.primary} />
            <Text style={styles.quickActionText}>Saved & Liked</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate("SubscriptionScreen")}
            activeOpacity={0.8}
          >
            <Crown size={24} color={theme.colors.accent} />
            <Text style={styles.quickActionText}>Subscription</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* My Library Section */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <BookOpen size={20} color={theme.colors.secondary} />
            <Text style={styles.sectionTitle}>My Library</Text>
          </View>
          <FlatList
            data={books}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderBookCard}
            scrollEnabled={false}
            contentContainerStyle={styles.bookList}
          />
        </Animated.View>

        {/* Support Section */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <HelpCircle size={20} color={theme.colors.info} />
            <Text style={styles.sectionTitle}>Support & Help</Text>
          </View>

          <View style={styles.supportContainer}>
            {renderSupportItem(
              <HelpCircle size={24} color={theme.colors.info} />,
              "Help Center",
              "Get help with common questions",
              () => setShowFAQ(true),
              theme.colors.info
            )}

            {renderSupportItem(
              <FileText size={24} color={theme.colors.secondary} />,
              "FAQ",
              "Frequently asked questions",
              () => setShowFAQ(true),
              theme.colors.secondary
            )}

            {renderSupportItem(
              <MessageCircle size={24} color={theme.colors.primary} />,
              "Contact Support",
              "Get help from our support team",
              () => handleSupportAction("contact"),
              theme.colors.primary
            )}

            {renderSupportItem(
              <Star size={24} color={theme.colors.accent} />,
              "Send Feedback",
              "Share your thoughts and suggestions",
              () => handleSupportAction("feedback"),
              theme.colors.accent
            )}

            {renderSupportItem(
              <Bug size={24} color={theme.colors.error} />,
              "Report Bug",
              "Report issues you've encountered",
              () => handleSupportAction("bug"),
              theme.colors.error
            )}

            {renderSupportItem(
              <Shield size={24} color={theme.colors.success} />,
              "Terms & Privacy",
              "View our terms and privacy policy",
              () => Alert.alert("Terms & Privacy", "Terms and Privacy Policy content would be displayed here."),
              theme.colors.success
            )}

            {renderSupportItem(
              <Info size={24} color={theme.colors.textSecondary} />,
              "About",
              "Learn more about StoryCraft",
              () => Alert.alert("About", "StoryCraft v1.0.0\n\nA premium storytelling platform for creators and readers."),
              theme.colors.textSecondary
            )}
          </View>
        </Animated.View>

        {/* Settings Section */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Settings size={20} color={theme.colors.textSecondary} />
            <Text style={styles.sectionTitle}>Settings</Text>
          </View>

          <TouchableOpacity style={styles.settingsItem} onPress={handleLogout} activeOpacity={0.7}>
            <View style={[styles.settingsIconContainer, { backgroundColor: theme.colors.warning + "20" }]}>
              <LogOut size={20} color={theme.colors.warning} />
            </View>
            <Text style={styles.settingsText}>Logout</Text>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingsItem, styles.deleteItem]}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <View style={[styles.settingsIconContainer, { backgroundColor: theme.colors.error + "20" }]}>
              <Trash2 size={20} color={theme.colors.error} />
            </View>
            <Text style={[styles.settingsText, styles.deleteText]}>Delete Account</Text>
            <ChevronRight size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {renderSupportModal()}
      {renderFAQModal()}
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
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundCard,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: theme.spacing.md,
  },
  avatarGradient: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 4,
    borderColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.large,
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.round,
    padding: theme.spacing.xs,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  username: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  email: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  bio: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    maxWidth: "80%",
  },
  statsSection: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.round,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    fontWeight: "700",
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  quickActionsContainer: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
    gap: theme.spacing.sm,
    minHeight: 100,
  },
  quickActionText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  bookList: {
    paddingBottom: theme.spacing.md,
  },
  bookCard: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  bookImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.md,
    resizeMode: "cover",
  },
  bookInfo: {
    flex: 1,
  },
  bookName: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "500",
  },
  supportContainer: {
    gap: theme.spacing.sm,
  },
  supportItem: {
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
  supportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  supportContent: {
    flex: 1,
  },
  supportTitle: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  supportDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
    gap: theme.spacing.md,
  },
  deleteItem: {
    borderColor: theme.colors.error,
    backgroundColor: theme.colors.error + "10",
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  deleteText: {
    color: theme.colors.error,
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
    minHeight: 120,
    textAlignVertical: "top",
  },
  modalFooter: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    minHeight: 50,
    ...theme.shadows.medium,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
  },
  faqList: {
    padding: theme.spacing.lg,
  },
  faqItem: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  faqQuestion: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: "600",
    marginBottom: theme.spacing.sm,
  },
  faqAnswer: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});

export default ProfileScreen;
