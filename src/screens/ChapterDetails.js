import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import UpdatedStoryScreen from "./UpdatedStoryScreen";
import { api } from "../api";

const ChapterDetails = ({ route }) => {
  const { genre_id } = route.params;

  const [chapterName, setChapterName] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [storyBeginning, setStoryBeginning] = useState("");
  const [showSituations, setShowSituations] = useState(false);
  const [selectedSituation, setSelectedSituation] = useState(null);
  const [showUpdatedStory, setShowUpdatedStory] = useState(false);
  const [situation1, setSituation1] = useState("");
  const [situation2, setSituation2] = useState("");

  useEffect(() => {
    const fetchChapterDetails = async () => {
      try {
        const storyRes = await api.generateStory(genre_id);
        console.log("Story Response:", storyRes);
        if (storyRes.isSuccess) {
          const story = storyRes.story;
          setChapterName(story.title);
          setCharacterName(story.characters[0]?.name || ""); 

          const saveStoryRes = await api.saveStory(story);
          console.log("Save Story Response:", saveStoryRes);
          if (saveStoryRes.isSuccess) {
            const storyId = saveStoryRes.storyId;

            const sceneRes = await api.getScenes(storyId);
            console.log("Scene Response:", sceneRes);
            if (sceneRes.isSuccess) {
              const scene = sceneRes.scene[0]; // Make sure to get the first scene if there are multiple
              setStoryBeginning(scene.text);
              setSituation1(scene.choice_1);
              setSituation2(scene.choice_2);
            } else {
              console.log("Error fetching scenes:", sceneRes.message);
            }
          } else {
            console.log("Error saving story:", saveStoryRes.message);
          }
        } else {
          console.log("Error generating story:", storyRes.message);
        }
      } catch (error) {
        console.log("Error fetching chapter details:", error.message);
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
    fontSize: 18,
    color: "#dbdbdb",
    marginBottom: 10,
  },
  detailContainer: {
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 16,
    color: "#b6b6b6",
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: "#dbdbdb",
  },
  letsGoButton: {
    backgroundColor: "#6d6d6d",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
  },
  letsGoButtonText: {
    color: "#dbdbdb",
    fontSize: 16,
  },
  situationsContainer: {
    marginBottom: 20,
  },
  situationBox: {
    backgroundColor: "#494949",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  situationText: {
    color: "#dbdbdb",
    fontSize: 14,
  },
  selectedBox: {
    borderColor: "#dbdbdb",
    borderWidth: 1,
  },
  selectedText: {
    color: "#242424",
  },
  updateButton: {
    backgroundColor: "#6d6d6d",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  updateButtonText: {
    color: "#dbdbdb",
    fontSize: 16,
  },
});

export default ChapterDetails;
