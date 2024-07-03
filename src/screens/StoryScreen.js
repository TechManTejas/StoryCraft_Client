import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import ChapterDetails from "./ChapterDetails";
import { api } from "../api"; 

const genreColors = {
  Action: "red",
  Animation: "orange",
  Comedy: "yellow",
  Crime: "darkblue",
  Drama: "blue",
  Experimental: "cyan",
  Fantasy: "pink",
  Historical: "brown",
  Horror: "black",
};

const StoryScreen = ({ token }) => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [showChapterDetails, setShowChapterDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        console.log("Token received in StoryScreen:", token); // Debugging line
        const response = await api.fetchGenres(token);

        if (response.isSuccess) {
          setGenres(response.genres);
        } else {
          console.error("Failed to fetch genres", response.message);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, [token]);

  const handleGenrePress = (genre) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(genre);
    }
  };

  const handleLetsGoPress = () => {
    setShowChapterDetails(true);
  };

  const handleLetsTwistPress = () => {
    // Handle "Let's Twist the Journey" action here
  };

  if (showChapterDetails) {
    return <ChapterDetails handleLetsTwistPress={handleLetsTwistPress} />;
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View
        style={[
          styles.borderedContainer,
          selectedGenre && { borderColor: genreColors[selectedGenre] },
        ]}
      >
        {genres.map((genre) => (
          <TouchableOpacity
            key={genre.id}
            style={[
              styles.card,
              selectedGenre === genre.name
                ? { backgroundColor: genreColors[genre.name] }
                : {},
            ]}
            onPress={() => handleGenrePress(genre.name)}
          >
            <Text style={styles.cardText}>{genre.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.letsGoButton, !selectedGenre && styles.disabledButton]}
        onPress={handleLetsGoPress}
        disabled={!selectedGenre}
      >
        <Text style={styles.letsGoButtonText}>Let's Go</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242424",
    padding: 10,
  },
  borderedContainer: {
    marginTop: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#494949",
    padding: 15,
    borderRadius: 10,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    height: 80,
    width: "48%",
    borderWidth: 1,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  cardText: {
    color: "#dbdbdb",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  letsGoButton: {
    backgroundColor: "#f60b0e",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
  },
  letsGoButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#888",
  },
});

export default StoryScreen;
