import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
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
        <ActivityIndicator size="large" color="#fff" />
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
        {genres.map((genre, index) => (
          <View
            key={genre.id}
            style={index % 2 === 0 ? styles.row : styles.centeredRow}
          >
            <TouchableOpacity
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
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#242424",
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
    width: "100%",
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
