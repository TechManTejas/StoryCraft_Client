import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import BookPage from './BookPage'; 

const ProfileScreen = () => {
  const [books] = useState([
    { id: 1, name: 'Book 1', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Book 2', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Book 3', image: 'https://via.placeholder.com/150' },
    // Add more books as needed
  ]);

  const [selectedBook, setSelectedBook] = useState(null);

  const handleBookPress = (book) => {
    setSelectedBook(book);
  };

  const handleBack = () => {
    setSelectedBook(null);
  };

  if (selectedBook) {
    return <BookPage book={selectedBook} onBack={handleBack} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>Arjun Shukla</Text>
      </View>

      <View style={styles.librarySection}>
        <Text style={styles.libraryTitle}>Your Library</Text>
        {books.map((book) => (
          <TouchableOpacity key={book.id} style={styles.bookContainer} onPress={() => handleBookPress(book)}>
            <Image source={{ uri: book.image }} style={styles.bookImage} />
            <Text style={styles.bookName}>{book.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#E8E5FF',
    padding: 20,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#23298E', // Adjust color as needed
  },
  librarySection: {
    marginTop: 20,
  },
  libraryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#23298E', // Adjust color as needed
  },
  bookContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookImage: {
    width: 50,
    height: 70,
    borderRadius: 5,
    marginRight: 10,
  },
  bookName: {
    fontSize: 16,
    color: '#23298E', // Adjust color as needed
  },
});

export default ProfileScreen;
