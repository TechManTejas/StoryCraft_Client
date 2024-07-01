import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

const GridView = ({ data, onPress }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {data.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.bookItem}
          onPress={() => onPress(item)}
        >
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.bookImage} />
          </View>
          <View style={styles.bookDetails}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookAuthor}>{item.author}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderColor: "#fff", // Changed border color to white
    borderWidth: 1, // Increased border width for visibility
    borderRadius: 20, // Increased border radius
    shadowColor: "#ffffff", // Changed shadow color to black
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    backgroundColor: "#242424", // Optional: Set background color for the container
    overflow: "hidden",
  },
  bookItem: {
    width: "48%",
    marginBottom: 20,
    backgroundColor: "#494949",
    borderRadius: 10,
    shadowColor: "#000", // Changed shadow color to black
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    overflow: "hidden",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    height: 150, // Height of the image container
  },
  bookImage: {
    width: "100%",
    aspectRatio: 1, // Ensure the image maintains a square aspect ratio
    borderRadius: 10,
  },
  bookDetails: {
    padding: 10,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#dbdbdb",
  },
  bookAuthor: {
    fontSize: 14,
    color: "#b6b6b6",
  },
});

export default GridView;
