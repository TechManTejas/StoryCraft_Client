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
          onChangeText={handleSearch}
          value={searchQuery}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={() => handleSearch(searchQuery)}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.heading}>Explore Books</Text>
          <GridView data={filteredBooks} onPress={handleBookPress} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E5FF',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 25,
    width: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  searchInput: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    flex: 1,
  },
  searchBtn: {
    backgroundColor: '#474dc3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  searchBtnText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ExploreScreen;
