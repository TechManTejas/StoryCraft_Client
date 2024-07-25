import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Honeycomb from "../components/LoadingComponent"; // Import the Honeycomb component
import { api } from "../api";

const ChapterDetails = ({ route, navigation }) => {
  const { genre_id } = route.params;

  const [chapterName, setChapterName] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [storyBeginning, setStoryBeginning] = useState("");
  const [showSituations, setShowSituations] = useState(false);
  const [selectedSituation, setSelectedSituation] = useState(null);
  const [situation1, setSituation1] = useState("");
  const [situation2, setSituation2] = useState("");
  const [storyId, setStoryId] = useState(null);
  const [sceneId, setSceneId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChapterDetails = async () => {
      try {
        const storyRes = await api.generateStory(genre_id);
        console.log("Story Response:", storyRes); // Print the story response
        if (storyRes.isSuccess) {
          const story = storyRes.story;
          setChapterName(story.title);
          setCharacterName(story.characters[0]?.name || "");
          setStoryBeginning(story.beginning);

          const saveStoryRes = await api.saveStory(story);
          console.log("Save Story Response:", saveStoryRes); // Print the save story response
          if (saveStoryRes.isSuccess) {
            const storyId = saveStoryRes.storyId;
            setStoryId(storyId);

            const sceneRes = await api.getScenes(storyId);
            console.log("Scene Response:", sceneRes); // Print the scene response
            if (sceneRes.isSuccess) {
              const scene = sceneRes.scene[0];
              setStoryBeginning(scene.text);
              setSceneId(scene.id);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapterDetails();
  }, [genre_id]);

  const handleUpdateStoryPress = () => {
    navigation.navigate("UpdatedStoryScreen", {
      storyId,
      sceneId,
      storyBeginning,
      situation1,
      situation2,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Honeycomb />
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#242424",
  },
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
    color: "#dbdbdb",
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: "#b6b6b6",
  },
  letsGoButton: {
    backgroundColor: "#f60b0e",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  letsGoButtonText: {
    color: "#dbdbdb",
    fontSize: 16,
  },
  situationsContainer: {
    backgroundColor: "#323232",
    padding: 15,
    borderRadius: 10,
  },
  situationBox: {
    backgroundColor: "#494949",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  situationText: {
    color: "#dbdbdb",
    fontSize: 14,
  },
  selectedBox: {
    backgroundColor: "#f60b0e",
  },
  selectedText: {
    color: "#242424",
  },
  updateButton: {
    backgroundColor: "#f60b0e",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  updateButtonText: {
    color: "#dbdbdb",
    fontSize: 16,
  },
});

export default ChapterDetails;
