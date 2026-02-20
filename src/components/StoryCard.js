import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from "react-native";
import { Card } from "@gluestack-ui/themed";
import { Heart } from "lucide-react-native";
import { theme } from "../constants/theme";

const StoryCard = ({ title, author, description, image }) => {
  const [liked, setLiked] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const toggleLike = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setLiked(!liked);
  };

  return (
    <Card style={styles.card}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={image} />
        <View style={styles.imageOverlay} />
        <View style={styles.overlay}>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.description} numberOfLines={3}>{description}</Text>
        <View style={styles.footer}>
          <View style={styles.authorContainer}>
            <Text style={styles.authorLabel}>by</Text>
            <Text style={styles.author}>{author}</Text>
          </View>
          <TouchableOpacity 
            onPress={toggleLike} 
            style={styles.likeButton}
            activeOpacity={0.7}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Heart
                size={24}
                color={liked ? theme.colors.primary : theme.colors.textTertiary}
                fill={liked ? theme.colors.primary : 'transparent'}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    borderRadius: theme.borderRadius.xl,
    margin: theme.spacing.md,
    backgroundColor: theme.colors.backgroundCard,
    ...theme.shadows.large,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 280,
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  comingSoonBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    ...theme.shadows.medium,
  },
  comingSoonText: {
    ...theme.typography.button,
    color: theme.colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  description: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorLabel: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
    marginRight: theme.spacing.xs,
  },
  author: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  likeButton: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
});

export default StoryCard;
