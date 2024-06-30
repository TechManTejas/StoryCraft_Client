import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import UpdatedStoryScreen from './UpdatedStoryScreen'; // Import the updated screen component
import axios from 'axios';

const ChapterDetails = ({ route }) => {
  // Ensure route and route.params exist before destructuring
  if (!route || !route.params) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Route parameters are missing.</Text>
      </View>
    );
  }

  const { genreId, token } = route.params; // Destructure genreId and token from route.params

  const [chapterName, setChapterName] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [storyBeginning, setStoryBeginning] = useState('');
  const [situation1, setSituation1] = useState('');
  const [situation2, setSituation2] = useState('');
  const [showSituations, setShowSituations] = useState(false);
  const [selectedSituation, setSelectedSituation] = useState(null);
  const [showUpdatedStory, setShowUpdatedStory] = useState(false); // State to toggle updated story screen
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStoryDetails();
  }, []);

  const fetchStoryDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://51.20.4.46/stories/generate_story/',
        { genre_id: genreId },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const storyData = response.data.response;
      setChapterName(storyData.title);
      setCharacterName(storyData.characters[0].name); // Example, picking the first character's name
      setStoryBeginning(storyData.synopsis);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch story details');
    } finally {
      setLoading(false);
    }
  };

  const fetchSituations = async (storyId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://51.20.4.46/scenes/',
        { story_id: storyId },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const sceneData = response.data;
      setSituation1(sceneData.choice_1);
      setSituation2(sceneData.choice_2);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch situations');
    } finally {
      setLoading(false);
    }
  };

  const handleTwistJourneyPress = () => {
    // Assuming the storyId is available after fetching story details
    const storyId = 2; // Replace with actual story ID
    fetchSituations(storyId);
    setShowSituations(true);
  };

  const handleUpdateStoryPress = () => {
    setShowUpdatedStory(true);
  };

  if (showUpdatedStory) {
    return (
      <UpdatedStoryScreen
        storyBeginning={storyBeginning}
        selectedSituation={selectedSituation}
        situation1={situation1}
        situation2={situation2}
        setShowUpdatedStory={setShowUpdatedStory}
        setSelectedSituation={setSelectedSituation} // Pass down setSelectedSituation to manage selected situation
      />
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#dbdbdb" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.sectionTitle}>Chapter Details</Text>
        <Text style={styles.detailTitle}>Chapter Name</Text>
        <Text style={styles.detailText}>{chapterName}</Text>
        <Text style={styles.detailTitle}>Character Name</Text>
        <Text style={styles.detailText}>{characterName}</Text>
        <Text style={styles.detailTitle}>Beginning of the Story</Text>
        <Text style={styles.detailText}>{storyBeginning}</Text>
        <TouchableOpacity style={styles.letsGoButton} onPress={handleTwistJourneyPress}>
          <Text style={styles.letsGoButtonText}>Let's Twist the Journey</Text>
        </TouchableOpacity>
      </View>

      {showSituations && (
        <View style={styles.box}>
          <Text style={styles.sectionTitle}>Choose a Situation</Text>
          <TouchableOpacity
            style={[
              styles.situationBox,
              selectedSituation === 'situation1' && styles.selectedBox,
            ]}
            onPress={() => setSelectedSituation('situation1')}
          >
            <Text style={[
              styles.situationText,
              selectedSituation === 'situation1' && styles.selectedText
            ]}>Situation 1: {situation1}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.situationBox,
              selectedSituation === 'situation2' && styles.selectedBox,
            ]}
            onPress={() => setSelectedSituation('situation2')}
          >
            <Text style={[
              styles.situationText,
              selectedSituation === 'situation2' && styles.selectedText
            ]}>Situation 2: {situation2}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.updateButton,
              !selectedSituation && styles.disabledButton // Disable button if no situation is selected
            ]}
            onPress={handleUpdateStoryPress}
            disabled={!selectedSituation} // Disable button if no situation is selected
          >
            <Text style={styles.updateButtonText}>Update the Story</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#242424',
  },
  errorText: {
    color: '#dbdbdb',
    fontSize: 18,
  },
  box: {
    backgroundColor: '#494949',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#dbdbdb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#dbdbdb',
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#b6b6b6',
  },
  detailText: {
    fontSize: 16,
    marginVertical: 5,
    color: '#929292',
  },
  letsGoButton: {
    backgroundColor: '#f60b0e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  letsGoButtonText: {
    color: '#dbdbdb',
    fontSize: 18,
    fontWeight: 'bold',
  },
  situationBox: {
    backgroundColor: '#6d6d6d',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
  selectedBox: {
    backgroundColor: '#929292',
  },
  situationText: {
    fontSize: 16,
    color: '#dbdbdb',
  },
  selectedText: {
    color: '#000000',
  },
  updateButton: {
    backgroundColor: '#f60b0e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  updateButtonText: {
    color: '#dbdbdb',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#494949',
  },
});

export default ChapterDetails;
