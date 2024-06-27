import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import FinishStoryScreen from './FinishStoryScreen';

const UpdatedStoryScreen = ({ storyBeginning, selectedSituation, situation1, situation2, setShowUpdatedStory, setSelectedSituation }) => {
  const [updatedStory, setUpdatedStory] = useState('');
  const [nextSituation1, setNextSituation1] = useState('');
  const [nextSituation2, setNextSituation2] = useState('');
  const [nextSelectedSituation, setNextSelectedSituation] = useState(null);
  const [showNextSituations, setShowNextSituations] = useState(false);
  const [showFinishScreen, setShowFinishScreen] = useState(false); // State to control showing FinishStoryScreen

  useEffect(() => {
    setUpdatedStory(`${storyBeginning} ${selectedSituation === 'situation1' ? situation1 : situation2}`);
  }, [storyBeginning, selectedSituation, situation1, situation2]);

  useEffect(() => {
    setNextSituation1('John finds a hidden cave.');
    setNextSituation2('John encounters a wild animal.');
  }, []);

  const handleTwistJourneyPress = () => {
    setShowNextSituations(true);
  };

  const handleUpdateStoryPress = () => {
    if (nextSelectedSituation) {
      const newStory = `${updatedStory} ${nextSelectedSituation === 'nextSituation1' ? nextSituation1 : nextSituation2}`;
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
          <Text style={styles.updatedStory}>{updatedStory}</Text>
          <TouchableOpacity style={styles.twistButton} onPress={handleTwistJourneyPress}>
            <Text style={styles.twistButtonText}>Twist the Journey</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.finishButton} onPress={handleFinishStoryPress}>
            <Text style={styles.finishButtonText}>Finish the Story</Text>
          </TouchableOpacity>

          {showNextSituations && (
            <>
              <Text style={styles.sectionTitle}>Choose a Situation</Text>
              <TouchableOpacity
                style={[styles.situationBox, nextSelectedSituation === 'nextSituation1' && styles.selectedBox]}
                onPress={() => setNextSelectedSituation('nextSituation1')}
              >
                <Text style={[styles.situationText, nextSelectedSituation === 'nextSituation1' && styles.selectedText]}>
                  {nextSituation1}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.situationBox, nextSelectedSituation === 'nextSituation2' && styles.selectedBox]}
                onPress={() => setNextSelectedSituation('nextSituation2')}
              >
                <Text style={[styles.situationText, nextSelectedSituation === 'nextSituation2' && styles.selectedText]}>
                  {nextSituation2}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.updateButton, !nextSelectedSituation && { backgroundColor: '#a8a8a8' }]}
                onPress={handleUpdateStoryPress}
                disabled={!nextSelectedSituation}
              >
                <Text style={styles.updateButtonText}>Update the Story</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      ) : (
        <FinishStoryScreen updatedStory={updatedStory} setShowUpdatedStory={setShowUpdatedStory} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E5FF',
    padding: 10,
  },
  updatedStory: {
    fontSize: 16,
    color: '#474dc3',
    marginVertical: 10,
  },
  twistButton: {
    backgroundColor: '#23298E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  twistButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  finishButton: {
    backgroundColor: '#474dc3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#23298E',
  },
  situationBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: '#474dc3',
  },
  selectedBox: {
    backgroundColor: '#c1c3e7',
  },
  situationText: {
    fontSize: 16,
    color: '#23298E',
  },
  selectedText: {
    color: '#ffffff',
  },
  updateButton: {
    backgroundColor: '#23298E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UpdatedStoryScreen;
