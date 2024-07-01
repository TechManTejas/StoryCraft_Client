import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AddChapter from "./AddChapter"; // Import AddChapter component

const BookPage = ({ book, onBack }) => {
  const [view, setView] = useState("bookPage");

  const handleAddChapter = () => {
    setView("addChapter");
  };

  if (view === "addChapter") {
    return <AddChapter book={book} onBack={() => setView("bookPage")} />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.bookTitle}>{book.name}</Text>
      <ScrollView contentContainerStyle={styles.chaptersContainer}>
        {Array.from({ length: 5 }).map((_, index) => (
          <TouchableOpacity key={index} style={styles.chapterButton}>
            <Text style={styles.chapterButtonText}>Chapter {index + 1}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.addChapterButton}
          onPress={handleAddChapter}
        >
          <Text style={styles.addChapterButtonText}>Add Chapter</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8E5FF",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#23298E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#23298E",
    textAlign: "center",
    marginTop: 20,
  },
  chaptersContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  chapterButton: {
    backgroundColor: "#23298E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  chapterButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  addChapterButton: {
    backgroundColor: "#474dc3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  addChapterButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
});

export default BookPage;
