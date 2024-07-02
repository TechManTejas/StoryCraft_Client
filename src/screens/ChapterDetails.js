/*import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import UpdatedStoryScreen from './UpdatedStoryScreen';

const ChapterDetails = ({ route }) => {
  const { genreId, token } = route.params;
  const [chapterName, setChapterName] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [storyBeginning, setStoryBeginning] = useState('');
  const [situation1, setSituation1] = useState('');
  const [situation2, setSituation2] = useState('');
  const [selectedSituation, setSelectedSituation] = useState(null);
  const [showSituations, setShowSituations] = useState(false);
  const [showUpdatedStory, setShowUpdatedStory] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoryDetails = async () => {
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
        setCharacterName(storyData.characters[0].name);
        setStoryBeginning(storyData.synopsis);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching story details:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to fetch story details');
      }
    };

    fetchStoryDetails();
  }, [genreId, token]);

  const fetchSituations = async (storyId) => {
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
      setShowSituations(true);
    } catch (error) {
      console.error('Error fetching situations:', error);
      Alert.alert('Error', 'Failed to fetch situations');
    }
  };

  const handleTwistJourneyPress = () => {
    // Assuming the storyId is available after fetching story details
    const storyId = 2; // Replace with actual story ID
    fetchSituations(storyId);
  };

  const handleUpdateStoryPress = () => {
    setShowUpdatedStory(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#dbdbdb" />
      </View>
    );
  }

  if (showUpdatedStory) {
    return (
      <UpdatedStoryScreen
        storyBeginning={storyBeginning}
        selectedSituation={selectedSituation}
        situation1={situation1}
        situation2={situation2}
        setShowUpdatedStory={setShowUpdatedStory}
        setSelectedSituation={setSelectedSituation}
      />
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
      </View>

      {showSituations && (
        <View style={styles.box}>
          <Text style={styles.sectionTitle}>Select Your Path</Text>
          <TouchableOpacity
            style={[styles.choiceButton, selectedSituation === 1 && styles.selectedChoice]}
            onPress={() => setSelectedSituation(1)}
          >
            <Text style={styles.choiceText}>{situation1}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.choiceButton, selectedSituation === 2 && styles.selectedChoice]}
            onPress={() => setSelectedSituation(2)}
          >
            <Text style={styles.choiceText}>{situation2}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateStoryPress}>
            <Text style={styles.updateButtonText}>Update Story</Text>
          </TouchableOpacity>
        </View>
      )}

      {!showSituations && (
        <TouchableOpacity style={styles.twistButton} onPress={handleTwistJourneyPress}>
          <Text style={styles.twistButtonText}>Twist the Journey</Text>
        </TouchableOpacity>
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
  box: {
    backgroundColor: '#494949',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dbdbdb',
    marginBottom: 10,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dbdbdb',
    marginTop: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#dbdbdb',
    marginBottom: 10,
  },
  twistButton: {
    backgroundColor: '#f60b0e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  twistButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  choiceButton: {
    backgroundColor: '#6d6d6d',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  selectedChoice: {
    backgroundColor: '#f60b0e',
  },
  choiceText: {
    color: '#dbdbdb',
    fontSize: 16,
    fontWeight: 'bold',
  },
  updateButton: {
    backgroundColor: '#f60b0e',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#242424',
  },
});

export default ChapterDetails;
*/
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import UpdatedStoryScreen from "./UpdatedStoryScreen"; // Import the updated screen component

const ChapterDetails = () => {
  // Hardcoded values (to be replaced with API data)
  const bookName = "Adventures of the Unknown";
  const chapterName = "The Mysterious Forest";
  const characterName = "John Doe";
  const storyBeginning =
    "It was a dark and stormy night, and John Doe found himself in the middle of an eerie forest...";

  // Hardcoded situations
  const situation1 = "John finds a mysterious glowing orb.";
  const situation2 = "John hears a strange noise coming from the bushes.";

  // State to handle the visibility of the situations and selected situation
  const [showSituations, setShowSituations] = useState(false);
  const [selectedSituation, setSelectedSituation] = useState(null);
  const [showUpdatedStory, setShowUpdatedStory] = useState(false); // State to toggle updated story screen

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

  return (
    <ScrollView style={styles.content}>
      <Text style={styles.bookTitle}>{bookName}</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.detailTitle}>Chapter Name</Text>
        <Text style={styles.detailText}>{chapterName}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.detailTitle}>Character Name</Text>
        <Text style={styles.detailText}>{characterName}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.detailTitle}>Beginning of the Story</Text>
        <Text style={styles.detailText}>{storyBeginning}</Text>
      </View>
      <TouchableOpacity
        style={styles.letsGoButton}
        onPress={() => setShowSituations(true)}
      >
        <Text style={styles.letsGoButtonText}>Let's Twist the Journey</Text>
      </TouchableOpacity>

      {showSituations && (
        <View style={styles.situationsContainer}>
          <Text style={styles.sectionTitle}>Choose a Situation</Text>
          <TouchableOpacity
            style={[
              styles.situationBox,
              selectedSituation === "situation1" && styles.selectedBox,
            ]}
            onPress={() => setSelectedSituation("situation1")}
          >
            <Text
              style={[
                styles.situationText,
                selectedSituation === "situation1" && styles.selectedText,
              ]}
            >
              Situation 1: {situation1}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.situationBox,
              selectedSituation === "situation2" && styles.selectedBox,
            ]}
            onPress={() => setSelectedSituation("situation2")}
          >
            <Text
              style={[
                styles.situationText,
                selectedSituation === "situation2" && styles.selectedText,
              ]}
            >
              Situation 2: {situation2}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.updateButton,
              !selectedSituation && { backgroundColor: "#494949" }, // Disable button if no situation is selected
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
  content: {
    flex: 1,
    backgroundColor: "#242424",
    padding: 10,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#dbdbdb",
    textAlign: "center",
    marginTop: 20, // Adjusted marginTop
    marginBottom: 10, // Added marginBottom for spacing
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#b6b6b6",
    textAlign: "center",
  },
  detailContainer: {
    backgroundColor: "#242424",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#929292",
  },
  detailText: {
    fontSize: 16,
    marginVertical: 5,
    color: "#6d6d6d",
  },
  letsGoButton: {
    backgroundColor: "#494949",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  letsGoButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  situationsContainer: {
    backgroundColor: "#242424",
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 20, // Adjusted marginBottom for complete visibility
  },
  situationBox: {
    backgroundColor: "#6d6d6d",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#FFFFFF", // Ensure border remains white
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  selectedBox: {
    backgroundColor: "#FFA500", // Changed to orange
    borderColor: "#FFFFFF", // Ensure border remains white
  },
  situationText: {
    fontSize: 16,
    color: "#dbdbdb",
  },
  selectedText: {
    color: "#ffffff",
  },
  updateButton: {
    backgroundColor: "#000000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ChapterDetails;
