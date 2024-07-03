import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Import your local images
import example1 from '../../assets/images/story1.jpeg'; // Adjust the path according to your project structure
import example2 from '../../assets/images/story2.jpeg'; // Adjust the path according to your project structure
import example3 from '../../assets/images/story3.jpeg'; // Adjust the path according to your project structure

const ChapterScreen = ({ chapterTitle, chapterContent, onClose }) => {
  // Function to split content into pages
  const splitContentIntoPages = (content) => {
    const words = content.split(" ");
    const pages = [];
    let currentPage = "";

    words.forEach((word) => {
      if ((currentPage + word).length <= 300) {
        currentPage += word + " ";
      } else {
        pages.push(currentPage.trim());
        currentPage = word + " ";
      }
    });

    if (currentPage.trim().length > 0) {
      pages.push(currentPage.trim());
    }

    return pages;
  };

  const pages = splitContentIntoPages(chapterContent);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.chapterTitle}>{chapterTitle}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {pages.map((page, index) => (
          <View key={index} style={[styles.page, { width: screenWidth - 50, height: screenHeight - 150 }]}>
            <Text style={styles.pageContent}>{page}</Text>
            <Image
              source={
                index === 0? example1 :
                index === 1? example2 :
                index === 2? example3 :
                null // Fallback to null or another image if needed
              }
              style={styles.pageImage}
            />
            <Text style={styles.pageNumber}>{`Page ${index + 1} of ${pages.length}`}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242424",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  backButton: {
    marginRight: 10,
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    alignItems: "center",
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#242424",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    margin: 10,
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 10,
  },
  pageContent: {
    fontSize: 16,
    textAlign: "left",
    color: "#dbdbdb",
    marginBottom: 20,
  },
  pageImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  pageNumber: {
    fontSize: 14,
    color: "#929292",
    textAlign: "center",
  },
});

export default ChapterScreen;
