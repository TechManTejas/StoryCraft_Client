import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import UpdatedStoryScreen from "./UpdatedStoryScreen";
import { api } from "../api"; // Import the updated API module

const ChapterDetails = ({ route }) => {
  const { genre_id } = route.params; // Get the genre_id from the previous screen

  const [chapterName, setChapterName] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [storyBeginning, setStoryBeginning] = useState("");
  const [showSituations, setShowSituations] = useState(false);
  const [selectedSituation, setSelectedSituation] = useState(null);
  const [showUpdatedStory, setShowUpdatedStory] = useState(false);

  const situation1 =
    "In the heart of an ancient temple, Alden confronts a shadowy figure who claims to know his secret.";
  const situation2 =
    "As he delves deeper into the relic's origins, Alden stumbles upon a forgotten city hidden beneath the sands of time.";

  useEffect(() => {
    const fetchChapterDetails = async () => {
      const res = await api.generateStory(genre_id);
      if (res.isSuccess) {
        setChapterName(res.story.title);
        setCharacterName(res.story.characters[0].name);
        setStoryBeginning(
          `A group of elite operatives embark on a high-stakes mission to neutralize a ruthless terrorist organization threatening global security.`
        );
      } else {
        // Handle error
        console.log(res.message);
      }
    };

    fetchChapterDetails();
  }, [genre_id]);

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
        setSelectedSituation={setSelectedSituation}
      />
    );
  }

  return (
    <ScrollView style={styles.content}>
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
              !selectedSituation && { backgroundColor: "#494949" },
            ]}
            onPress={handleUpdateStoryPress}
            disabled={!selectedSituation}
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#b6b6b6",
    textAlign: "center",
  },
  detailContainer: {
    marginTop: 15,
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
    marginBottom: 20,
  },
  situationBox: {
    backgroundColor: "#6d6d6d",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  selectedBox: {
    backgroundColor: "#dbdbdb",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  situationText: {
    fontSize: 16,
    color: "#242424",
  },
  selectedText: {
    fontWeight: "bold",
    color: "#242424",
  },
  updateButton: {
    backgroundColor: "#242424",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
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
