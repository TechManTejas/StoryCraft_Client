import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { api } from "../api";

const UpdatedStoryScreen = ({ route, navigation }) => {
  const { storyId, sceneId, storyBeginning, situation1, situation2 } = route.params;

  const [updatedStory, setUpdatedStory] = useState(storyBeginning);
  const [nextSituation1, setNextSituation1] = useState(situation1);
  const [nextSituation2, setNextSituation2] = useState(situation2);
  const [selectedNextSituation, setSelectedNextSituation] = useState(null);

  const handleUpdateStory = async () => {
    if (!selectedNextSituation) return;

    try {
      // Use updateScene instead of updateStory
      const sceneRes = await api.updateScene(storyId, sceneId, selectedNextSituation);

      if (sceneRes.isSuccess) {
        setUpdatedStory(sceneRes.updatedScene.updatedStory);
        setNextSituation1(sceneRes.updatedScene.nextSituation1);
        setNextSituation2(sceneRes.updatedScene.nextSituation2);
      } else {
        console.log("Error updating story:", sceneRes.message);
      }
    } catch (error) {
      console.log("Error updating story:", error.message);
    }
  };

  return (
    <ScrollView style={styles.content}>
      <View style={styles.detailContainer}>
        <Text style={styles.detailTitle}>Updated Story</Text>
        <Text style={styles.detailText}>{updatedStory}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.situationBox,
          selectedNextSituation === "nextSituation1" && styles.selectedBox,
        ]}
        onPress={() => setSelectedNextSituation("nextSituation1")}
      >
        <Text
          style={[
            styles.situationText,
            selectedNextSituation === "nextSituation1" && styles.selectedText,
          ]}
        >
          Next Situation 1: {nextSituation1}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.situationBox,
          selectedNextSituation === "nextSituation2" && styles.selectedBox,
        ]}
        onPress={() => setSelectedNextSituation("nextSituation2")}
      >
        <Text
          style={[
            styles.situationText,
            selectedNextSituation === "nextSituation2" && styles.selectedText,
          ]}
        >
          Next Situation 2: {nextSituation2}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.updateButton,
          !selectedNextSituation && { backgroundColor: "#494949" },
        ]}
        onPress={handleUpdateStory}
        disabled={!selectedNextSituation}
      >
        <Text style={styles.updateButtonText}>Update the Story</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#242424",
    padding: 10,
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

export default UpdatedStoryScreen;
