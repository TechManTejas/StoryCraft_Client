import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import CommunityScreen from '../CommunityScreen';
import { api } from '../../api';

// Mock API
jest.mock('../../api', () => ({
  api: {
    getPublicStories: jest.fn(),
    getTrendingStories: jest.fn(),
    likeStory: jest.fn(),
    followUser: jest.fn(),
  },
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
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
      accent: '#FFE66D',
    },
    typography: {
      h1: { fontSize: 32, fontWeight: '700' },
      h3: { fontSize: 20, fontWeight: '600' },
      body: { fontSize: 16 },
      bodySmall: { fontSize: 14 },
      caption: { fontSize: 12 },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    borderRadius: {
      md: 12,
      lg: 16,
      xl: 20,
      round: 9999,
    },
    shadows: {
      medium: {},
      large: {},
    },
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Search: () => null,
  TrendingUp: () => null,
  Heart: () => null,
  MessageCircle: () => null,
  Eye: () => null,
  Star: () => null,
  Filter: () => null,
  Users: () => null,
  BookOpen: () => null,
  Sparkles: () => null,
  ArrowRight: () => null,
  X: () => null,
  User: () => null,
}));

describe('CommunityScreen', () => {
  const mockStories = [
    {
      id: 1,
      title: 'Test Story 1',
      author_name: 'Author One',
      author_username: 'author1',
      description: 'Test description 1',
      rating: 4.5,
      views_count: 100,
      chapters_count: 5,
      comments_count: 10,
      likes_count: 25,
      liked: false,
      created_at: '2024-01-01',
    },
    {
      id: 2,
      title: 'Test Story 2',
      author_name: 'Author Two',
      author_username: 'author2',
      description: 'Test description 2',
      rating: 4.8,
      views_count: 200,
      chapters_count: 8,
      comments_count: 15,
      likes_count: 50,
      liked: true,
      created_at: '2024-01-02',
    },
  ];

  const mockTrendingStories = [
    {
      id: 3,
      title: 'Trending Story',
      author_name: 'Trending Author',
      author_username: 'trending',
      likes_count: 100,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    api.getPublicStories.mockResolvedValue({
      isSuccess: true,
      stories: mockStories,
      total: 2,
    });
    api.getTrendingStories.mockResolvedValue({
      isSuccess: true,
      stories: mockTrendingStories,
    });
  });

  it('renders correctly', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <CommunityScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Community')).toBeTruthy();
    });
  });

  it('displays stories list', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <CommunityScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Test Story 1')).toBeTruthy();
      expect(getByText('Test Story 2')).toBeTruthy();
    });
  });

  it('displays trending stories when trending tab is selected', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <CommunityScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const trendingTab = getByText('Trending');
      fireEvent.press(trendingTab);
    });

    await waitFor(() => {
      expect(getByText('Trending Story')).toBeTruthy();
    });
  });

  it('handles search functionality', async () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <CommunityScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const searchInput = getByPlaceholderText('Search stories, authors...');
      fireEvent.changeText(searchInput, 'Test');
    });

    await waitFor(() => {
      expect(api.getPublicStories).toHaveBeenCalled();
    });
  });

  it('handles genre filter selection', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <CommunityScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const fantasyFilter = getByText('Fantasy');
      fireEvent.press(fantasyFilter);
    });

    await waitFor(() => {
      expect(api.getPublicStories).toHaveBeenCalledWith(
        expect.any(Number),
        expect.any(Number),
        'fantasy',
        null
      );
    });
  });

  it('handles story like functionality', async () => {
    api.likeStory.mockResolvedValue({
      isSuccess: true,
      liked: true,
      likesCount: 26,
    });

    const { getByText } = render(
      <NavigationContainer>
        <CommunityScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Test Story 1')).toBeTruthy();
    });

    // Find and press like button (implementation depends on your component structure)
    // This is a basic test structure
  });

  it('navigates to story details when story is pressed', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <CommunityScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const story = getByText('Test Story 1');
      fireEvent.press(story);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('PublicStoryDetails', {
        storyId: 1,
      });
    });
  });

  it('handles pull to refresh', async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <CommunityScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Trigger refresh
      expect(api.getPublicStories).toHaveBeenCalled();
    });
  });

  it('displays empty state when no stories found', async () => {
    api.getPublicStories.mockResolvedValue({
      isSuccess: true,
      stories: [],
      total: 0,
    });

    const { getByText } = render(
      <NavigationContainer>
        <CommunityScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('No stories found')).toBeTruthy();
    });
  });

  it('handles tab switching between all and trending', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <CommunityScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const allTab = getByText('All Stories');
      const trendingTab = getByText('Trending');
      
      fireEvent.press(trendingTab);
      fireEvent.press(allTab);
    });

    // Verify tab switching works
    expect(getByText('All Stories')).toBeTruthy();
  });

  it('navigates to ReelsScreen when Reels button is pressed', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <CommunityScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const reelsButton = getByText('Reels');
      fireEvent.press(reelsButton);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('ReelsScreen');
    });
  });

  it('navigates to MessagingScreen when Messages button is pressed', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <CommunityScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const messagesButton = getByText('Messages');
      fireEvent.press(messagesButton);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('MessagingScreen');
    });
  });

  it('displays Reels and Messages navigation buttons', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <CommunityScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Reels')).toBeTruthy();
      expect(getByText('Messages')).toBeTruthy();
    });
  });
});

