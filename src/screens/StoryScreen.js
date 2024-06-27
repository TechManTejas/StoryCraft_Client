import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import ChapterDetails from './ChapterDetails';

const genres = [
  'Action ', 'Animation ', 'Comedy ', 'Crime ',
  'Drama ', 'Experimental ', 'Fantasy ', 'Historical Genre',
  'Horror ', 'Romance ', 'Science Fiction ', 'Thriller ',
  'Western ', 'Musical ', 'War '
];

const StoryScreen = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showChapterDetails, setShowChapterDetails] = useState(false);

  const handleGenrePress = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(item => item !== genre));
    } else if (selectedGenres.length < 1) {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleLetsGoPress = () => {
    setShowChapterDetails(true);
  };

  const handleLetsTwistPress = () => {
    // Handle "Let's Twist the Journey" action here
  };

  if (showChapterDetails) {
    return (
      <ChapterDetails handleLetsTwistPress={handleLetsTwistPress} />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Choose Genre</Text>
      <View style={styles.gridContainer}>
        {genres.map((genre) => (
          <TouchableOpacity
            key={genre}
            style={[styles.optionButton, selectedGenres.includes(genre) && styles.selectedOption]}
            onPress={() => handleGenrePress(genre)}
          >
            <Text style={styles.optionText}>{genre}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.letsGoButton, !selectedGenres.length && styles.disabledButton]}
        onPress={handleLetsGoPress}
        disabled={!selectedGenres.length}
      >
        <Text style={styles.letsGoButtonText}>Let's Go</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E5FF',
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#23298E',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    backgroundColor: '#474dc3',
    padding: 15,
    borderRadius: 10,
    margin: 5,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
  },
  optionText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedOption: {
    backgroundColor: '#23298E',
  },
  letsGoButton: {
    backgroundColor: '#23298E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  letsGoButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#888',
  },
});

export default StoryScreen;
