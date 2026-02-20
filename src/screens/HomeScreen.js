import React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import StoryCard from "../components/StoryCard";
import { theme } from "../constants/theme";
import { BookOpen, Sparkles } from "lucide-react-native";

const stories = [
  {
    id: "1",
    title: "Chronicles of the Forgotten City",
    author: "Victoria Poyner",
    description:
      "Chronicles of the Forgotten City is a gripping tale of adventure and discovery, following a group of explorers who uncover ancient secrets hidden beneath a long-lost civilization.",
    image: require("../../assets/images/story12.jpg"), // Local asset path
  },
  {
    id: "2",
    title: "Legends of the Shadow Realm",
    author: "A Tim",
    description:
      "Legends of the Shadow Realm explores a parallel universe where souls of the fallen gather, awaiting return, amidst eternal twilight under a clouded sky, driven by the lore of the Shadow Dragon and the enigmatic Shadow God.",
    image: require("../../assets/images/story9.jpeg"), // Local asset path
  },
  {
    id: "3",
    title: "The Enchanted Forest",
    author: "Amani Blanchett",
    description:
      "The Enchanted Forest is a mystical realm filled with magical creatures, ancient trees, and hidden pathways, where every leaf whispers tales of forgotten kingdoms and the guardians who protect its secrets.",
    image: require("../../assets/images/story1.jpeg"), // Local asset path
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleStartJourney = () => {
    navigation.navigate("StoryScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gradientBackground}>
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.headerContent}>
            <Sparkles size={28} color={theme.colors.primary} style={styles.icon} />
            <Text style={styles.heading}>Featured Stories</Text>
            <BookOpen size={28} color={theme.colors.secondary} style={styles.icon} />
          </View>
          <View style={styles.divider} />
        </Animated.View>
        
        <FlatList
          data={stories}
          renderItem={({ item, index }) => (
            <Animated.View
              style={[
                { opacity: fadeAnim },
                { transform: [{ translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                })}] }
              ]}
            >
              <StoryCard
                title={item.title}
                author={item.author}
                description={item.description}
                image={item.image}
              />
            </Animated.View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <Animated.View style={{ opacity: fadeAnim }}>
              <TouchableOpacity 
                style={styles.startButton}
                onPress={handleStartJourney}
                activeOpacity={0.8}
              >
                <View style={styles.buttonGradient}>
                  <Text style={styles.startButtonText}>Start Your Journey</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  icon: {
    marginHorizontal: theme.spacing.sm,
  },
  heading: {
    ...theme.typography.h1,
    color: theme.colors.textPrimary,
    textAlign: "center",
    marginHorizontal: theme.spacing.sm,
  },
  divider: {
    height: 2,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.round,
    marginTop: theme.spacing.sm,
    opacity: 0.6,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  startButton: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginVertical: theme.spacing.xl,
    ...theme.shadows.glow,
  },
  buttonGradient: {
    paddingVertical: theme.spacing.md + 4,
    paddingHorizontal: theme.spacing.xl,
    alignItems: "center",
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
  },
  startButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
    fontSize: 18,
  },
});

export default HomeScreen;
