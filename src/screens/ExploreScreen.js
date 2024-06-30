import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import GridView from '../components/GridView'; // Adjust import path as per your project structure
import BookDetailsScreen from './BookDetailsScreen'; // Adjust import path as per your project structure

// Dummy data for books
const books = [
  { id: '1', title: 'Book 1', image: 'https://via.placeholder.com/150', rating: 4.5, author: 'Author 1', summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae justo vel lorem tincidunt ultrices at non nunc. Donec in sapien viverra, tincidunt augue id, efficitur massa.' },
  { id: '2', title: 'Book 2', image: 'https://via.placeholder.com/150', rating: 4.0, author: 'Author 2', summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae justo vel lorem tincidunt ultrices at non nunc. Donec in sapien viverra, tincidunt augue id, efficitur massa.' },
  { id: '3', title: 'Book 3', image: 'https://via.placeholder.com/150', rating: 4.8, author: 'Author 3', summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae justo vel lorem tincidunt ultrices at non nunc. Donec in sapien viverra, tincidunt augue id, efficitur massa.' },
  { id: '4', title: 'Book 4', image: 'https://via.placeholder.com/150', rating: 4.2, author: 'Author 4', summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae justo vel lorem tincidunt ultrices at non nunc. Donec in sapien viverra, tincidunt augue id, efficitur massa.' },
  { id: '5', title: 'Book 5', image: 'https://via.placeholder.com/150', rating: 4.3, author: 'Author 5', summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae justo vel lorem tincidunt ultrices at non nunc. Donec in sapien viverra, tincidunt augue id, efficitur massa.' },
  { id: '6', title: 'Book 6', image: 'https://via.placeholder.com/150', rating: 4.7, author: 'Author 6', summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae justo vel lorem tincidunt ultrices at non nunc. Donec in sapien viverra, tincidunt augue id, efficitur massa.' },
];

const ExploreScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState(books);
  const [selectedBook, setSelectedBook] = useState(null);

  const handleBookPress = (book) => {
    setSelectedBook(book);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredData = books.filter((book) =>
      book.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredBooks(filteredData);
  };

  if (selectedBook) {
    return <BookDetailsScreen book={selectedBook} onBack={() => setSelectedBook(null)} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search books..."
          placeholderTextColor="#929292"
          onChangeText={handleSearch}
          value={searchQuery}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={() => handleSearch(searchQuery)}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        <GridView data={filteredBooks} onPress={handleBookPress} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',
    padding: 20,
  },
  searchBar: {
    marginTop: 20, // Adjust margin top to create space below the top of the screen
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#494949',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ffffff', // White border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  searchInput: {
    height: 40,
    flex: 1,
    paddingHorizontal: 10,
    color: '#dbdbdb',
  },
  searchBtn: {
    backgroundColor: '#f60b0e',
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
  },
  searchBtnText: {
    color: '#fff',
    fontSize: 16,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
});

export default ExploreScreen;
