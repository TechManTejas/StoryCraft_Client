import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { theme } from "../constants/theme";

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
            <Image source={item.image} style={styles.bookImage} />
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
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.colors.backgroundCard,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  bookItem: {
    width: "48%",
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
    ...theme.shadows.medium,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md,
    height: 220,
  },
  bookImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: theme.borderRadius.md,
  },
  bookDetails: {
    padding: theme.spacing.md,
  },
  bookTitle: {
    ...theme.typography.body,
    fontWeight: "600",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  bookAuthor: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
});

export default GridView;
