import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import ChapterScreen from "./ChapterScreen"; // Assuming ChapterScreen.js is in the same directory

const BookDetailsScreen = ({ book, onBack }) => {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [liked, setLiked] = useState(false);

  const chapters = [
    { id: "1", title: "The Call of the Wildwood", content: "Under the cloak of twilight, whispers of the ancient forest stirred the soul of twelve-year-old Elara. Her grandmother's tales of enchanted creatures and hidden pathways had always been a source of wonder. But tonight, as she sat by the hearth, the old woman's eyes held a new urgency. Your destiny awaits, child, she said, handing Elara a small, intricately carved pendant. When the moon is full and the stars align, follow the call of the wildwood. With those words, Elara's adventure began, leading her into a world where magic was real, and every shadow held a secret." },
    { id: "2", title: "Chapter 2", content: "Content of Chapter 2" },
    { id: "3", title: "Chapter 3", content: "Content of Chapter 3" },
    { id: "4", title: "Chapter 4", content: "Content of Chapter 4" },
    { id: "5", title: "Chapter 5", content: "Content of Chapter 5" },
    { id: "6", title: "Chapter 6", content: "Content of Chapter 6" },
    { id: "7", title: "Chapter 7", content: "Content of Chapter 7" },
    { id: "8", title: "Chapter 8", content: "Content of Chapter 8" },
    { id: "9", title: "Chapter 9", content: "Content of Chapter 9" },
    { id: "10", title: "Chapter 10", content: "Content of Chapter 10" },
  ];

  const handleChapterClick = (chapter) => {
    setSelectedChapter(chapter);
  };

  const handleBack = () => {
    setSelectedChapter(null);
  };

  const handleLike = () => {
    setLiked(!liked);
  };

  return (
    <View style={styles.container}>
      {selectedChapter ? (
        <ChapterScreen
          chapterTitle={selectedChapter.title}
          chapterContent={selectedChapter.content}
          onClose={handleBack}
        />
      ) : (
        <>
          <View style={styles.imageContainer}>
            <Image source={{ uri: book.image }} style={styles.bookImage} />
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <View style={styles.detailsContainer}>
            <View style={styles.authorContainer}>
              <FontAwesome
                name="user-circle-o"
                size={24}
                color="#23298E"
                style={styles.profileIcon}
              />
              <Text style={styles.bookAuthor}>{book.author}</Text>
            </View>
            <TouchableOpacity onPress={handleLike}>
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={24}
                color={liked ? "#FF0000" : "#929292"}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.summaryContainer}>
            <Text style={styles.bookSummary}>{book.summary}</Text>
          </View>
          <Text style={styles.latestChapters}>Latest Chapters</Text>
          <View style={styles.chapterScrollView}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.chapterContainer}
            >
              {chapters.map((chapter) => (
                <TouchableOpacity
                  key={chapter.id}
                  style={styles.chapterButton}
                  onPress={() => handleChapterClick(chapter)}
                >
                  <Text style={styles.chapterButtonText}>{chapter.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          {/* Adding gap below Latest Chapters */}
          <View style={{ marginBottom: 20 }} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#242424",
    padding: 20,
  },
  imageContainer: {
    paddingTop: 10,
    marginBottom: 20,
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  bookImage: {
    width: 350,
    height: 250,
    resizeMode: "cover",
    borderRadius: 10,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 20,
    padding: 5,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#dbdbdb",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Added to align items vertically
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIcon: {
    marginRight: 10,
  },
  bookAuthor: {
    fontSize: 18,
    color: "#dbdbdb",
  },
  summaryContainer: {
    backgroundColor: "#494949",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 10,
  },
  bookSummary: {
    fontSize: 16,
    textAlign: "left",
    color: "#dbdbdb",
  },
  latestChapters: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#dbdbdb",
    alignSelf: "flex-start",
  },
  chapterScrollView: {
    maxHeight: 200,
    borderRadius: 10,
    overflow: "hidden",
  },
  chapterContainer: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  chapterButton: {
    minWidth: 330,
    backgroundColor: "#000000",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  chapterButtonText: {
    color: "#dbdbdb",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
});

export default BookDetailsScreen;
