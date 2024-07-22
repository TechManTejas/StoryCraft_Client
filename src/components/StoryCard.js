import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { FontAwesome } from "@expo/vector-icons";

const StoryCard = ({ title, author, description, image }) => {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <Card style={styles.card}>
      <View style={styles.overlay}>
        <Text style={styles.comingSoonText}>Coming Soon</Text>
      </View>
      <Image style={styles.image} source={image} />
      <Text style={styles.date}></Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.footer}>
        <Text style={styles.author}>{author}</Text>
        <TouchableOpacity onPress={toggleLike} style={styles.likeButton}>
          <FontAwesome
            name={liked ? "heart" : "heart-o"}
            size={24}
            color={liked ? "#f60b0e" : "#929292"}
          />
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 12,
    maxWidth: 360,
    margin: 12,
    backgroundColor: "rgba(45, 45, 45, 0.8)", // Reduced opacity
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: "relative", // To allow overlay positioning
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensure overlay is on top
  },
  comingSoonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  image: {
    height: 240,
    width: "100%",
    borderRadius: 12,
    marginBottom: 16,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    color: "#b6b6b6",
  },
  description: {
    marginTop: 4,
    color: "#6d6d6d",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  author: {
    fontSize: 14,
    color: "#494949",
  },
  likeButton: {
    marginLeft: "auto",
  },
});

export default StoryCard;
