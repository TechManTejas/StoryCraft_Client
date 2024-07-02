import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import ChapterDetails from "./ChapterDetails";

// Mapping of genres to their colors
const genreColors = {
  Action: "red",
  Animation: "orange",
  Comedy: "yellow",
  Crime: "darkblue",
  Drama: "blue",
  Experimental: "cyan",
  Fantasy: "pink",
  "Historical Genre": "brown",
  Horror: "black",
};

const genres = [
  "Action",
  "Animation",
  "Comedy",
  "Crime",
  "Drama",
  "Experimental",
  "Fantasy",
  "Historical Genre",
  "Horror",
];

const StoryScreen = () => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [showChapterDetails, setShowChapterDetails] = useState(false);

  const handleGenrePress = (genre) => {
    if (selectedGenre === genre) {
      setSelectedGenre(null); // Deselect if the same genre is clicked again
    } else {
      setSelectedGenre(genre); // Select the new genre
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

  return (
    <ScrollView style={styles.container}>
      <View
        style={[
          styles.borderedContainer,
          selectedGenre && { borderColor: genreColors[selectedGenre] },
        ]}
      >
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.card,
              selectedGenre === genres[0]
                ? { backgroundColor: genreColors[genres[0]] }
                : {},
            ]}
            onPress={() => handleGenrePress(genres[0])}
          >
            <Text style={styles.cardText}>{genres[0]}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.card,
              selectedGenre === genres[1]
                ? { backgroundColor: genreColors[genres[1]] }
                : {},
            ]}
            onPress={() => handleGenrePress(genres[1])}
          >
            <Text style={styles.cardText}>{genres[1]}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centeredRow}>
          <TouchableOpacity
            style={[
              styles.card,
              selectedGenre === genres[2]
                ? { backgroundColor: genreColors[genres[2]] }
                : {},
            ]}
            onPress={() => handleGenrePress(genres[2])}
          >
            <Text style={styles.cardText}>{genres[2]}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.card,
              selectedGenre === genres[3]
                ? { backgroundColor: genreColors[genres[3]] }
                : {},
            ]}
            onPress={() => handleGenrePress(genres[3])}
          >
            <Text style={styles.cardText}>{genres[3]}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.card,
              selectedGenre === genres[4]
                ? { backgroundColor: genreColors[genres[4]] }
                : {},
            ]}
            onPress={() => handleGenrePress(genres[4])}
          >
            <Text style={styles.cardText}>{genres[4]}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centeredRow}>
          <TouchableOpacity
            style={[
              styles.card,
              selectedGenre === genres[5]
                ? { backgroundColor: genreColors[genres[5]] }
                : {},
            ]}
            onPress={() => handleGenrePress(genres[5])}
          >
            <Text style={styles.cardText}>{genres[5]}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.card,
              selectedGenre === genres[6]
                ? { backgroundColor: genreColors[genres[6]] }
                : {},
            ]}
            onPress={() => handleGenrePress(genres[6])}
          >
            <Text style={styles.cardText}>{genres[6]}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.card,
              selectedGenre === genres[7]
                ? { backgroundColor: genreColors[genres[7]] }
                : {},
            ]}
            onPress={() => handleGenrePress(genres[7])}
          >
            <Text style={styles.cardText}>{genres[7]}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centeredRow}>
          <TouchableOpacity
            style={[
              styles.card,
              selectedGenre === genres[8]
                ? { backgroundColor: genreColors[genres[8]] }
                : {},
            ]}
            onPress={() => handleGenrePress(genres[8])}
          >
            <Text style={styles.cardText}>{genres[8]}</Text>
          </TouchableOpacity>
        </View>
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
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  centeredRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
    width: '100%', // Ensuring the row takes full width
  },
  card: {
    backgroundColor: "#494949",
    padding: 15,
    borderRadius: 10,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    height: 80,
    width: "48%", // Adjusting width to fit two cards side by side
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
