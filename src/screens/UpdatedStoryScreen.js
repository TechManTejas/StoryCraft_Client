import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import FinishStoryScreen from "./FinishStoryScreen";

const UpdatedStoryScreen = ({
  storyBeginning,
  selectedSituation,
  situation1,
  situation2,
  navigation, // Assuming you are using navigation prop
  setShowUpdatedStory,
  setSelectedSituation,
}) => {
  const [updatedStory, setUpdatedStory] = useState("");
  const [nextSituation1, setNextSituation1] = useState("");
  const [nextSituation2, setNextSituation2] = useState("");
  const [nextSelectedSituation, setNextSelectedSituation] = useState(null);
  const [showNextSituations, setShowNextSituations] = useState(false);
  const [showFinishScreen, setShowFinishScreen] = useState(false); // State to control showing FinishStoryScreen

  useEffect(() => {
    setUpdatedStory(
      `${storyBeginning} ${
        selectedSituation === "situation1" ? situation1 : situation2
      }`
    );
  }, [storyBeginning, selectedSituation, situation1, situation2]);

  useEffect(() => {
    setNextSituation1(" Venturing into a labyrinthine cave system, Alden encounters spectral entities that guard ancient knowledge, challenging him to solve riddles to proceed.");
    setNextSituation2("In the depths of the Forgotten Vale, Alden discovers a portal leading to a parallel dimension, where he must navigate through a landscape transformed by time, encountering creatures and artifacts unlike any known to his world.");
  }, []);

  const handleTwistJourneyPress = () => {
    setShowNextSituations(true);
  };

  const handleUpdateStoryPress = () => {
    if (nextSelectedSituation) {
      const newStory = `${updatedStory} ${
        nextSelectedSituation === "nextSituation1"
          ? nextSituation1
          : nextSituation2
      }`;
      setUpdatedStory(newStory);
      setSelectedSituation(null);
      setShowNextSituations(false);
    }
  };

  const handleFinishStoryPress = () => {
    setShowUpdatedStory(false); // Hide UpdatedStoryScreen
    setShowFinishScreen(true); // Show FinishStoryScreen
  };

  return (
    <ScrollView style={styles.container}>
      {!showFinishScreen ? (
        <>
          <View style={styles.storyContainer}>
            <Text style={styles.updatedStory}>{updatedStory}</Text>
          </View>
          <TouchableOpacity
            style={styles.twistButton}
            onPress={handleTwistJourneyPress}
          >
            <Text style={styles.twistButtonText}>Twist the Journey</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinishStoryPress}
          >
            <Text style={styles.finishButtonText}>Finish the Story</Text>
          </TouchableOpacity>

          {showNextSituations && (
            <View style={styles.nextSituationsContainer}>
              <Text style={styles.sectionTitle}>Choose a Situation</Text>
              <TouchableOpacity
                style={[
                  styles.situationBox,
                  nextSelectedSituation === "nextSituation1" && styles.selectedBox,
                ]}
                onPress={() => setNextSelectedSituation("nextSituation1")}
              >
                <Text
                  style={[
                    styles.situationText,
                    nextSelectedSituation === "nextSituation1" && styles.selectedText,
                  ]}
                >
                  {nextSituation1}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.situationBox,
                  nextSelectedSituation === "nextSituation2" && styles.selectedBox,
                ]}
                onPress={() => setNextSelectedSituation("nextSituation2")}
              >
                <Text
                  style={[
                    styles.situationText,
                    nextSelectedSituation === "nextSituation2" && styles.selectedText,
                  ]}
                >
                  {nextSituation2}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.updateButton,
                  !nextSelectedSituation && { backgroundColor: "#494949" },
                ]}
                onPress={handleUpdateStoryPress}
                disabled={!nextSelectedSituation}
              >
                <Text style={styles.updateButtonText}>Update the Story</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <FinishStoryScreen
          updatedStory={updatedStory}
          setShowUpdatedStory={setShowUpdatedStory}
          navigation={navigation} // Pass navigation prop to FinishStoryScreen
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242424",
    padding: 10,
  },
  storyContainer: {
    backgroundColor: "#494949",
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
    borderColor: "green",
    borderWidth: 2,
    shadowColor: "green", // White shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 10,
  },
  updatedStory: {
    fontSize: 16,
    color: "#dbdbdb",
  },
  twistButton: {
    backgroundColor: "#6d6d6d",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "yellow", // White shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 10,
  },
  twistButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  finishButton: {
    backgroundColor: "#494949",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#f60b0e", // White shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 10,
  },
  finishButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  nextSituationsContainer: {
    backgroundColor: "#242424",
    borderRadius: 10,
    padding: 15,
    marginVertical: 20,
    borderColor: "#FFFFFF",
    borderWidth: 2,
    shadowColor: "#FFFFFF", // White shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#b6b6b6",
  },
  situationBox: {
    backgroundColor: "#494949",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 10,
  },
  selectedBox: {
    backgroundColor: "#FFA500", // Changed to orange for the selected situation
  },
  situationText: {
    fontSize: 16,
    color: "#dbdbdb",
  },
  selectedText: {
    color: "#FFFFFF",
  },
  updateButton: {
    backgroundColor: "#000000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
    shadowColor: "#FFFFFF", // White shadow color
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

export default UpdatedStoryScreen;
