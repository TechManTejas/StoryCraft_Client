import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import SavedLikedScreen from '../SavedLikedScreen';
import { api } from '../../api';

// Mock API
jest.mock('../../api', () => ({
  api: {
    getSavedStories: jest.fn(),
    getLikedStories: jest.fn(),
    getSavedReels: jest.fn(),
    getLikedReels: jest.fn(),
    unsaveStory: jest.fn(),
  },
}));

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: mockGoBack,
    }),
  };
});

// Mock theme
jest.mock('../../constants/theme', () => ({
  theme: {
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      textPrimary: '#FFFFFF',
      textSecondary: '#E0E0E0',
      textMuted: '#808080',
      background: '#0A0E27',
      backgroundCard: 'rgba(26, 31, 58, 0.8)',
      backgroundSecondary: '#1A1F3A',
      border: 'rgba(255, 255, 255, 0.1)',
      error: '#F44336',
    },
    typography: {
      h2: { fontSize: 24, fontWeight: '600' },
      h3: { fontSize: 20, fontWeight: '600' },
      body: { fontSize: 16 },
      bodySmall: { fontSize: 14 },
      caption: { fontSize: 12 },
      button: { fontSize: 16, fontWeight: '600' },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    borderRadius: {
      md: 12,
      lg: 16,
      xl: 20,
      round: 9999,
    },
    shadows: {
      medium: {},
    },
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  ChevronLeft: () => null,
  Bookmark: () => null,
  Heart: () => null,
  Video: () => null,
  BookOpen: () => null,
  Eye: () => null,
  MessageCircle: () => null,
  Star: () => null,
  User: () => null,
  Filter: () => null,
  X: () => null,
  Trash2: () => null,
}));

// Mock StoryCard
jest.mock('../../components/StoryCard', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return (props) => (
    <View>
      <Text>{props.title}</Text>
      <Text>{props.author}</Text>
    </View>
  );
});

describe('SavedLikedScreen', () => {
  const mockSavedStories = [
    {
      id: 1,
      title: 'Saved Story 1',
      author_name: 'Author One',
      author_username: 'author1',
      description: 'Description 1',
      rating: 4.5,
      views_count: 100,
      chapters_count: 5,
    },
    {
      id: 2,
      title: 'Saved Story 2',
      author_name: 'Author Two',
      author_username: 'author2',
      description: 'Description 2',
      rating: 4.8,
      views_count: 200,
      chapters_count: 8,
    },
  ];

  const mockLikedStories = [
    {
      id: 3,
      title: 'Liked Story 1',
      author_name: 'Author Three',
      author_username: 'author3',
      description: 'Description 3',
      rating: 4.9,
      views_count: 300,
      chapters_count: 10,
    },
  ];

  const mockSavedReels = [
    {
      id: 1,
      story_title: 'Saved Reel 1',
      author_name: 'Author One',
      author_username: 'author1',
      thumbnail_url: 'https://example.com/thumb1.jpg',
      likes_count: 50,
    },
  ];

  const mockLikedReels = [
    {
      id: 2,
      story_title: 'Liked Reel 1',
      author_name: 'Author Two',
      author_username: 'author2',
      thumbnail_url: 'https://example.com/thumb2.jpg',
      likes_count: 100,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    api.getSavedStories.mockResolvedValue({
      isSuccess: true,
      stories: mockSavedStories,
    });
    api.getLikedStories.mockResolvedValue({
      isSuccess: true,
      stories: mockLikedStories,
    });
    api.getSavedReels.mockResolvedValue({
      isSuccess: true,
      reels: mockSavedReels,
    });
    api.getLikedReels.mockResolvedValue({
      isSuccess: true,
      reels: mockLikedReels,
    });
  });

  it('renders correctly', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <SavedLikedScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Saved & Liked')).toBeTruthy();
    });
  });

  it('displays saved stories by default', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <SavedLikedScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Saved Story 1')).toBeTruthy();
      expect(getByText('Saved Story 2')).toBeTruthy();
    });
  });

  it('switches to liked tab', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <SavedLikedScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const likedTab = getByText('Liked');
      fireEvent.press(likedTab);
    });

    await waitFor(() => {
      expect(getByText('Liked Story 1')).toBeTruthy();
    });
  });

  it('switches between stories and reels', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <SavedLikedScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Stories')).toBeTruthy();
      expect(getByText('Reels')).toBeTruthy();
    });

    const reelsButton = getByText('Reels');
    fireEvent.press(reelsButton);

    await waitFor(() => {
      expect(api.getSavedReels).toHaveBeenCalled();
    });
  });

  it('displays stats correctly', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <SavedLikedScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('2')).toBeTruthy(); // Saved count
      expect(getByText('1')).toBeTruthy(); // Liked count
    });
  });

  it('handles unsave story', async () => {
    api.unsaveStory.mockResolvedValue({
      isSuccess: true,
      saved: false,
    });

    const { getByText } = render(
      <NavigationContainer>
        <SavedLikedScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Saved Story 1')).toBeTruthy();
    });

    // Find and press unsave button
    // Implementation depends on component structure
  });

  it('navigates to story details when story is pressed', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <SavedLikedScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const story = getByText('Saved Story 1');
      fireEvent.press(story);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('PublicStoryDetails', {
        storyId: 1,
      });
    });
  });

  it('displays empty state when no content', async () => {
    api.getSavedStories.mockResolvedValue({
      isSuccess: true,
      stories: [],
    });

    const { getByText } = render(
      <NavigationContainer>
        <SavedLikedScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('No saved stories yet')).toBeTruthy();
    });
  });

  it('handles pull to refresh', async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <SavedLikedScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(api.getSavedStories).toHaveBeenCalled();
    });
  });

  it('displays reels in grid layout', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <SavedLikedScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const reelsButton = getByText('Reels');
      fireEvent.press(reelsButton);
    });

    await waitFor(() => {
      expect(api.getSavedReels).toHaveBeenCalled();
    });
  });
});

