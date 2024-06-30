import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChapterDetails from './ChapterDetails'; // Ensure this component exists and is imported correctly

const StoryScreen = ({ navigation }) => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showChapterDetails, setShowChapterDetails] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log('User Token:', token); // Log the token for verification
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await fetch('http://51.20.4.46/genres/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });

        if (!response.ok) {
          const errorMessage = await response.text(); // Attempt to retrieve a more descriptive error message
          console.error('HTTP error status:', response.status, 'Message:', errorMessage);
          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('Fetched genres:', data); // Log the fetched genres for debugging
        setGenres(data);
      } catch (error) {
        console.error('Error fetching genres:', error);
        if (error.message === 'Token not found' || error.message.startsWith('HTTP')) {
          navigation.navigate('LoginScreen'); // Adjust the navigation target as needed
        }
      }
    };

    fetchGenres();
  }, [navigation]);

  const handleGenrePress = (genreId) => {
    const isSelected = selectedGenres.includes(genreId);
    if (isSelected) {
      setSelectedGenres(selectedGenres.filter(id => id!== genreId));
    } else {
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  const handleLetsGoPress = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('Selected Genres:', selectedGenres); // Log the selected genres for verification
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch('http://51.20.4.46/stories/generate_story/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ genre_ids: selectedGenres }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('HTTP error status:', response.status, 'Message:', errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Generated Story:', data); 

      // Navigate to ChapterDetails screen with necessary params
      navigation.navigate('ChapterDetails', {
        genreId: data.genre_id,
        token: token,
      });
    } catch (error) {
      console.error('Error generating story:', error);
      Alert.alert('Error', 'Failed to generate story');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.gridContainer}>
        {genres.map((genre, index) => (
          <TouchableOpacity
            key={genre.id} // Use genre.id as the key
            style={[styles.card, selectedGenres.includes(genre.id.toString()) && styles.selectedCard]}
            onPress={() => handleGenrePress(genre.id)}
          >
            <Text style={styles.cardText}>{genre.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.letsGoButton,!selectedGenres.length && styles.disabledButton]}
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
    marginTop: 10,
    flex: 1,
    backgroundColor: '#242424',
    padding: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#494949',
    padding: 15,
    borderRadius: 10,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    width: '98%',
    borderWidth: 1,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  cardText: {
    color: '#dbdbdb',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedCard: {
    backgroundColor: '#6d6d6d',
  },
  letsGoButton: {
    backgroundColor: '#f60b0e',
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
