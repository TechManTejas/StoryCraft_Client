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
      <View contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.scrollContainer}>
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
            contentContainerStyle={styles.verticalList}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>Start Your Journey</Text>
        </TouchableOpacity>
      </View>
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
  scrollContentContainer: {
    paddingBottom: 20,
  },
  scrollContainer: {
    borderWidth: 2,
    borderColor: "#494949",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButton: {
    backgroundColor: "#f60b0e",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    alignSelf: "center",
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default HomeScreen;
