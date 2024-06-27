import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, SafeAreaView, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import StyledButton from '../components/StyledButton'; // Adjust the import path as per your file structure

const stories = [
  { id: '1', title: 'Story 1', image: 'https://via.placeholder.com/150', rating: 4.5 },
  { id: '2', title: 'Story 2', image: 'https://via.placeholder.com/150', rating: 4.0 },
  { id: '3', title: 'Story 3', image: 'https://via.placeholder.com/150', rating: 4.8 },
  { id: '4', title: 'Story 4', image: 'https://via.placeholder.com/150', rating: 4.2 },
  { id: '5', title: 'Story 5', image: 'https://via.placeholder.com/150', rating: 4.3 },
];

const recommendedStories = [
  { id: '6', title: 'Recommended Story 1', image: 'https://via.placeholder.com/150', rating: 4.5 },
  { id: '7', title: 'Recommended Story 2', image: 'https://via.placeholder.com/150', rating: 4.0 },
  { id: '8', title: 'Recommended Story 3', image: 'https://via.placeholder.com/150', rating: 4.8 },
  { id: '9', title: 'Recommended Story 4', image: 'https://via.placeholder.com/150', rating: 4.2 },
  { id: '10', title: 'Recommended Story 5', image: 'https://via.placeholder.com/150', rating: 4.3 },
];

const StoryCard = ({ title, image, rating }) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => {
    const toValue = isFlipped ? 0 : 1;
    Animated.timing(flipAnim, {
      toValue,
      duration: 800,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => setIsFlipped(!isFlipped));
  };

  const frontAnimatedStyle = {
    transform: [{
      rotateY: flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
      }),
    }],
  };

  const backAnimatedStyle = {
    transform: [{
      rotateY: flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
      }),
    }],
  };

  return (
    <TouchableWithoutFeedback onPress={flipCard}>
      <View style={styles.storyCard}>
        <Animated.View style={[styles.storyCardFront, frontAnimatedStyle]}>
          <Image source={{ uri: image }} style={styles.storyCardImage} />
          <Icon name='image' type='material' color='#333' size={40} style={styles.cardIcon} />
          <View style={styles.storyCardContent}>
            <Text style={styles.storyCardTitle}>{title}</Text>
            <View style={styles.ratingContainer}>
              <Icon name='star' type='material' color='#FFD700' size={20} />
              <Text style={styles.ratingText}>{rating}</Text>
            </View>
          </View>
        </Animated.View>
        <Animated.View style={[styles.storyCardBack, backAnimatedStyle]}>
          <View style={styles.storyCardContent}>
            <Text style={styles.storyCardDescription}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae justo vel lorem tincidunt ultrices at non nunc. Donec in sapien viverra, tincidunt augue id, efficitur massa.
            </Text>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const RecommendedCard = ({ title, image, rating }) => {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  const flipCard = () => {
    const toValue = isFlipped ? 0 : 1;
    Animated.timing(flipAnim, {
      toValue,
      duration: 800,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => setIsFlipped(!isFlipped));
  };

  const frontAnimatedStyle = {
    transform: [{
      rotateY: flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
      }),
    }],
  };

  const backAnimatedStyle = {
    transform: [{
      rotateY: flipAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
      }),
    }],
  };

  return (
    <TouchableWithoutFeedback onPress={flipCard}>
      <View style={styles.recommendedCard}>
        <Animated.View style={[styles.recommendedCardFront, frontAnimatedStyle]}>
          <Image source={{ uri: image }} style={styles.recommendedCardImage} />
          <Icon name='image' type='material' color='#333' size={40} style={styles.cardIcon} />
        </Animated.View>
        <Animated.View style={[styles.recommendedCardBack, backAnimatedStyle]}>
          <View style={styles.recommendedCardContent}>
            <Text style={styles.recommendedCardTitle}>{title}</Text>
            <Text style={styles.recommendedCardDescription}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae justo vel lorem tincidunt ultrices at non nunc. Donec in sapien viverra, tincidunt augue id, efficitur massa.
            </Text>
          </View>
          <View style={styles.ratingContainer}>
            <Icon name='star' type='material' color='#FFD700' size={20} />
            <Text style={styles.ratingText}>{rating}</Text>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View>
            
              <Text style={styles.heading}>Top Stories</Text>
              <FlatList
                horizontal
                data={stories}
                renderItem={({ item }) => <StoryCard {...item} />}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.horizontalList}
                showsHorizontalScrollIndicator={false}
              />
            
            
              <Text style={styles.heading}>Recommended Story Today</Text>
           
          </View>
        }
        
        data={recommendedStories}
        renderItem={({ item }) => <RecommendedCard {...item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.verticalList}
        showsVerticalScrollIndicator={false}
        
        ListFooterComponent={
          <StyledButton onPress={() => { /* Handle button press */ }} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E5FF',
  },
  topStoriesSection: {
    backgroundColor: '#826EFF',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    maxWidth:400
  },
  recommendedSection: {
    backgroundColor: '#826EFF',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 20,
    maxWidth: '95%',
   // alignSelf: 'center',
   // maxHeight: '90%',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#23298E',
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 20,
  },
  horizontalList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  verticalList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  storyCard: {
    width: 350,
    height: 220,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#474dc3',
    marginHorizontal: 10,
    alignSelf: 'center',
  },
  recommendedCard: {
    width: 350,
    height: 250,
    borderRadius: 10,
    marginHorizontal: 10,
    perspective: 1000,
    paddingTop: 10,
    overflow: 'hidden',
  },
  storyCardFront: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    backgroundColor: '#474dc3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyCardBack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    backgroundColor: '#474dc3',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotateY: '180deg' }],
  },
  recommendedCardFront: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    backgroundColor: '#474dc3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendedCardBack: {
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    backgroundColor: '#474dc3',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    transform: [{ rotateY: '180deg' }]
  },
  storyCardImage: {
    width: '100%',
    height: 140,
  },
  recommendedCardImage: {
    width: '100%',
    height: 200,
  },
  cardIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  storyCardContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  recommendedCardContent: {
    padding: 20,
  },
  storyCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0C073A',
    marginBottom: 10,
  },
  recommendedCardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  storyCardDescription: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  recommendedCardDescription: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    color: '#FFD700',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default HomeScreen;
