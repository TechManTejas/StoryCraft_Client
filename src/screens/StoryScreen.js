import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Animated,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Sparkles, ArrowRight } from "lucide-react-native";
import { api } from "../api";
import { theme } from "../constants/theme";

const genreColors = {
  Action: theme.colors.error,
  Animation: theme.colors.warning,
  Comedy: theme.colors.accent,
  Crime: "#6C5CE7",
  Drama: theme.colors.info,
  Experimental: theme.colors.secondary,
  Fantasy: "#FD79A8",
  Historical: "#A0855B",
  Horror: "#2D3436",
};

const StoryScreen = () => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation(); // Hook to get navigation prop

  useEffect(() => {
    const fetchGenres = async () => {
      const response = await api.getGenres();
      if (response.isSuccess) {
        setGenres(response.genres);
      } else {
        console.error(response.message);
      }
      setLoading(false);
    };

    fetchGenres();
  }, []);

  const handleGenrePress = (genre) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(genre);
    }
  };

  const handleLetsGoPress = () => {
    const selectedGenreObject = genres.find((genre) => genre.name === selectedGenre);
    if (selectedGenreObject) {
      navigation.navigate("ChapterDetails", {
        genre_id: selectedGenreObject.id,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading genres...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Sparkles size={28} color={theme.colors.primary} />
          <Text style={styles.headerTitle}>Choose Your Genre</Text>
          <Text style={styles.headerSubtitle}>Select a genre to begin your story</Text>
        </View>

        <View style={styles.genresContainer}>
          {genres.map((genre, index) => {
            const isSelected = selectedGenre === genre.name;
            const genreColor = genreColors[genre.name] || theme.colors.primary;
            
            return (
              <TouchableOpacity
                key={genre.id}
                style={[
                  styles.genreCard,
                  isSelected && {
                    backgroundColor: genreColor,
                    borderColor: genreColor,
                    ...theme.shadows.glow,
                  },
                ]}
                onPress={() => handleGenrePress(genre.name)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.genreText,
                  isSelected && styles.genreTextSelected
                ]}>
                  {genre.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[
            styles.letsGoButton,
            !selectedGenre && styles.disabledButton
          ]}
          onPress={handleLetsGoPress}
          disabled={!selectedGenre}
          activeOpacity={0.8}
        >
          <Text style={styles.letsGoButtonText}>Let's Go</Text>
          <ArrowRight size={20} color={theme.colors.textPrimary} style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  headerTitle: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xl,
  },
  genreCard: {
    backgroundColor: theme.colors.backgroundCard,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.md,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 100,
    width: "48%",
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
    transition: 'all 0.3s ease',
  },
  genreText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    textAlign: "center",
    fontWeight: "600",
  },
  genreTextSelected: {
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  letsGoButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: theme.spacing.md,
    minHeight: 56,
    ...theme.shadows.glow,
  },
  letsGoButtonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
    fontSize: 18,
  },
  disabledButton: {
    backgroundColor: theme.colors.textMuted,
    opacity: 0.5,
  },
});

export default StoryScreen;
