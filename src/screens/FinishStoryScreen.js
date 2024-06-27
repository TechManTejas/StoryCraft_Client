import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const FinishStoryScreen = ({ updatedStory, setShowUpdatedStory }) => {
  const [bookCover, setBookCover] = useState(null);

  const handleUploadBookCover = () => {
    setBookCover('https://via.placeholder.com/150'); // Placeholder URL for demonstration
  };

  const handleSaveAndPublish = () => {
    alert('Story saved and published!');
    setShowUpdatedStory(false); // Hide UpdatedStoryScreen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Updated Story</Text>
      <Text style={styles.updatedStory}>{updatedStory}</Text>

      {bookCover ? (
        <View style={styles.uploadedBookCoverContainer}>
          <Image source={{ uri: bookCover }} style={styles.uploadedBookCover} />
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadBookCover}>
          <Text style={styles.uploadButtonText}>Upload Book Cover</Text>
        </TouchableOpacity>
      )}

      {bookCover && (
        <TouchableOpacity style={styles.savePublishButton} onPress={handleSaveAndPublish}>
          <Text style={styles.savePublishButtonText}>Save and Publish</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E5FF',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#23298E',
    marginBottom: 20,
  },
  updatedStory: {
    fontSize: 18,
    color: '#474dc3',
    textAlign: 'center',
    marginBottom: 20,
  },
  uploadedBookCoverContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  uploadedBookCover: {
    width: 150,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  uploadButton: {
    backgroundColor: '#23298E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  savePublishButton: {
    backgroundColor: '#474dc3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  savePublishButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FinishStoryScreen;
