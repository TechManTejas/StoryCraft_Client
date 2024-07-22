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
    title: "Chronicles of the Forgotten City",
    author: "Victoria Poyner",
    description:
      "Chronicles of the Forgotten City is a gripping tale of adventure and discovery, following a group of explorers who uncover ancient secrets hidden beneath a long-lost civilization.",
    image: require("../../assets/images/story12.jpg"), // Local asset path
  },
  {
    id: "2",
    title: "Legends of the Shadow Realm",
    author: "A Tim",
    description:
      "Legends of the Shadow Realm explores a parallel universe where souls of the fallen gather, awaiting return, amidst eternal twilight under a clouded sky, driven by the lore of the Shadow Dragon and the enigmatic Shadow God.",
    image: require("../../assets/images/story9.jpeg"), // Local asset path
  },
  {
    id: "3",
    title: "The Enchanted Forest",
    author: "Amani Blanchett",
    description:
     "The Enchanted Forest is a mystical realm filled with magical creatures, ancient trees, and hidden pathways, where every leaf whispers tales of forgotten kingdoms and the guardians who protect its secrets.",
    image: require("../../assets/images/story1.jpeg"), // Local asset path
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
    shadowColor: "#f60b0e",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 10,
    marginVertical: 20,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default HomeScreen;
