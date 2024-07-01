import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UpdatedStoryScreen from "./UpdatedStoryScreen"; // Import the updated screen component

const AddChapter = ({ book, onBack }) => {
  const chapterName = "The Mysterious Forest";
  const characterName = "John Doe";
  const storyBeginning =
    "It was a dark and stormy night, and John Doe found himself in the middle of an eerie forest...";
  const situation1 = "John finds a mysterious glowing orb.";
  const situation2 = "John hears a strange noise coming from the bushes.";

  const [showSituations, setShowSituations] = useState(false);
  const [selectedSituation, setSelectedSituation] = useState(null);
  const [showUpdatedStory, setShowUpdatedStory] = useState(false);

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
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.bookTitle}>{book.name}</Text>
      <Text style={styles.sectionTitle}>Chapter Details</Text>
      <Text style={styles.detailTitle}>Chapter Name</Text>
      <Text style={styles.detailText}>{chapterName}</Text>
      <Text style={styles.detailTitle}>Character Name</Text>
      <Text style={styles.detailText}>{characterName}</Text>
      <Text style={styles.detailTitle}>Beginning of the Story</Text>
      <Text style={styles.detailText}>{storyBeginning}</Text>
      <TouchableOpacity
        style={styles.letsGoButton}
        onPress={() => setShowSituations(true)}
      >
        <Text style={styles.letsGoButtonText}>Let's Twist the Journey</Text>
      </TouchableOpacity>

      {showSituations && (
        <>
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
              !selectedSituation && { backgroundColor: "#a8a8a8" },
            ]}
            onPress={handleUpdateStoryPress}
            disabled={!selectedSituation}
          >
            <Text style={styles.updateButtonText}>Update the Story</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8E5FF",
    padding: 10,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    backgroundColor: "#23298E",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#23298E",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#23298E",
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 5,
    color: "#23298E",
  },
  detailText: {
    fontSize: 16,
    marginVertical: 5,
    color: "#474dc3",
  },
  letsGoButton: {
    backgroundColor: "#23298E",
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
  situationBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: "#474dc3",
  },
  selectedBox: {
    backgroundColor: "#c1c3e7",
  },
  situationText: {
    fontSize: 16,
    color: "#23298E",
  },
  selectedText: {
    color: "#ffffff",
  },
  updateButton: {
    backgroundColor: "#23298E",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddChapter;
