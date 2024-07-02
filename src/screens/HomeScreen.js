import React from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import StoryCard from "../components/StoryCard";

const stories = [
  {
    id: "1",
    title: "Story 1",
    author: "John Smith",
    description:
      "Discover how the power of positive thinking can transform your life, boost your confidence, and help you overcome challenges.",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    title: "Story 2",
    author: "Jane Doe",
    description:
      "Discover how the power of positive thinking can transform your life, boost your confidence, and help you overcome challenges.",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    title: "Story 3",
    author: "Alice Johnson",
    description:
      "Discover how the power of positive thinking can transform your life, boost your confidence, and help you overcome challenges.",
    image: "https://via.placeholder.com/150",
  },
];

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Featured Stories</Text>
      <FlatList
        data={stories}
        renderItem={({ item }) => (
          <StoryCard
            title={item.title}
            author={item.author}
            description={item.description}
            image={item.image}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        ListFooterComponent={
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Start Your Journey</Text>
          </TouchableOpacity>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242424",
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  heading: {
    paddingTop: 10,
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
    textAlign: "center",
  },
  contentContainer: {
    paddingBottom: 20,
  },
  startButton: {
    backgroundColor: "#f60b0e",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    marginVertical: 20,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default HomeScreen;
