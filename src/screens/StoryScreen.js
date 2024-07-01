import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StoryScreen = ({ navigation }) => {
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
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
          const errorMessage = await response.text();
          throw new Error(`HTTP error status: ${response.status}, Message: ${errorMessage}`);
        }

        const data = await response.json();
        console.log('Fetched Genres:', data); // Log fetched genres
        setGenres(data);
      } catch (error) {
        console.error('Error fetching genres:', error);
        if (error.message === 'Token not found' || error.message.startsWith('HTTP')) {
          navigation.navigate('LoginScreen'); // Navigate to login screen on token error
        } else {
          Alert.alert('Error', 'Failed to fetch genres');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, [navigation]);

  const handleGenrePress = (genreId) => {
    const isSelected = selectedGenres.includes(genreId);
    if (isSelected) {
      setSelectedGenres(selectedGenres.filter(id => id !== genreId));
    } else {
      setSelectedGenres([genreId]); // Ensure only one genre can be selected
    }
  };

  const handleLetsGoPress = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Token not found');
      }
  
      console.log('Selected Genres:', selectedGenres);
  
      const response = await fetch('http://51.20.4.46/stories/generate_story/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ genre_id: selectedGenres[0] }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Error response from server:', errorMessage);
        if (response.status === 404 && errorMessage === '{"error":"Genre not found"}') {
          Alert.alert('Error', 'The selected genre is not available.');
        } else {
          throw new Error(`HTTP error status: ${response.status}, Message: ${errorMessage}`);
        }
      } else {
        const data = await response.json();
        console.log('Generated Story Data:', data);
        navigation.navigate('ChapterDetails', {
          genreId: data.response.genre,
          token: token,
        });
      }
    } catch (error) {
     // console.error('Error generating story:', error);
      Alert.alert('Error', 'Failed to generate story');
    }
  };
  
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#dbdbdb" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.gridContainer}>
        {genres.map((genre) => (
          <TouchableOpacity
            key={genre.id}
            style={[styles.card, selectedGenres.includes(genre.id) && styles.selectedCard]}
            onPress={() => handleGenrePress(genre.id)}
          >
            <Text style={styles.cardText}>{genre.name} (ID: {genre.id})</Text>
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
    width: '95%',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#242424',
  },
});

export default StoryScreen;
