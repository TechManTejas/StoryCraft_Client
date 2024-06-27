import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const GridView = ({ data, onPress }) => {
  return (
    <View style={styles.container}>
      {data.map((item) => (
        <TouchableOpacity key={item.id} style={styles.bookItem} onPress={() => onPress(item)}>
          <Image source={{ uri: item.image }} style={styles.bookImage} />
          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookAuthor}>{item.author}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  bookItem: {
    width: '48%', // Adjust width as per your design
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    overflow: 'hidden',
  },
  bookImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  bookDetails: {
    padding: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
  },
});

export default GridView;
