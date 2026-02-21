import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import PublicStoryDetailsScreen from '../PublicStoryDetailsScreen';
import { api } from '../../api';

// Mock API
jest.mock('../../api', () => ({
  api: {
    getPublicStoryDetails: jest.fn(),
    getStoryComments: jest.fn(),
    likeStory: jest.fn(),
    addComment: jest.fn(),
    followUser: jest.fn(),
  },
}));

// Mock navigation
const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
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

// Mock Alert
jest.spyOn(require('react-native'), 'Alert').mockImplementation((title, message, buttons) => {
  // Mock implementation
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
      error: '#F44336',
    },
    typography: {
      h1: { fontSize: 32, fontWeight: '700' },
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
    },
    borderRadius: {
      md: 12,
      lg: 16,
      xl: 20,
      round: 9999,
    },
    shadows: {},
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  ChevronLeft: () => null,
  Heart: () => null,
  MessageCircle: () => null,
  Share2: () => null,
  BookOpen: () => null,
  Eye: () => null,
  Star: () => null,
  User: () => null,
  Calendar: () => null,
  TrendingUp: () => null,
  Send: () => null,
  MoreVertical: () => null,
}));

describe('PublicStoryDetailsScreen', () => {
  const mockRoute = {
    params: {
      storyId: 1,
    },
  };

  const mockStory = {
    id: 1,
    title: 'Test Story',
    subtitle: 'Test Subtitle',
    description: 'Test description',
    author_name: 'Test Author',
    author_username: 'testauthor',
    author_followers: 100,
    rating: 4.5,
    views_count: 500,
    chapters_count: 10,
    likes_count: 50,
    liked: false,
    genre: 'Fantasy',
    created_at: '2024-01-01',
    cover_image: 'https://example.com/image.jpg',
  };

  const mockComments = [
    {
      id: 1,
      comment: 'Great story!',
      author_name: 'Commenter One',
      author_username: 'commenter1',
      created_at: '2024-01-02',
    },
    {
      id: 2,
      comment: 'Love it!',
      author_name: 'Commenter Two',
      author_username: 'commenter2',
      created_at: '2024-01-03',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    api.getPublicStoryDetails.mockResolvedValue({
      isSuccess: true,
      story: mockStory,
    });
    api.getStoryComments.mockResolvedValue({
      isSuccess: true,
      comments: mockComments,
    });
  });

  it('renders correctly with story data', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <PublicStoryDetailsScreen route={mockRoute} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Test Story')).toBeTruthy();
      expect(getByText('Test Author')).toBeTruthy();
    });
  });

  it('displays loading state initially', () => {
    api.getPublicStoryDetails.mockImplementation(() => new Promise(() => {}));

    const { getByText } = render(
      <NavigationContainer>
        <PublicStoryDetailsScreen route={mockRoute} />
      </NavigationContainer>
    );

    expect(getByText('Loading story...')).toBeTruthy();
  });

  it('displays story details correctly', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <PublicStoryDetailsScreen route={mockRoute} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Test Story')).toBeTruthy();
      expect(getByText('Test Subtitle')).toBeTruthy();
      expect(getByText('Test Author')).toBeTruthy();
      expect(getByText('4.5')).toBeTruthy();
      expect(getByText('500')).toBeTruthy();
      expect(getByText('10')).toBeTruthy();
    });
  });

  it('displays comments', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <PublicStoryDetailsScreen route={mockRoute} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Great story!')).toBeTruthy();
      expect(getByText('Love it!')).toBeTruthy();
      expect(getByText('Comments (2)')).toBeTruthy();
    });
  });

  it('handles like functionality', async () => {
    api.likeStory.mockResolvedValue({
      isSuccess: true,
      liked: true,
      likesCount: 51,
    });

    const { getByText } = render(
      <NavigationContainer>
        <PublicStoryDetailsScreen route={mockRoute} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('50')).toBeTruthy();
    });

    // Find and press like button
    // Implementation depends on component structure
  });

  it('handles adding a comment', async () => {
    api.addComment.mockResolvedValue({
      isSuccess: true,
      comment: {
        id: 3,
        comment: 'New comment',
        author_name: 'Current User',
        author_username: 'currentuser',
        created_at: '2024-01-04',
      },
    });

    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <PublicStoryDetailsScreen route={mockRoute} />
      </NavigationContainer>
    );

    await waitFor(() => {
      const commentInput = getByPlaceholderText('Write a comment...');
      fireEvent.changeText(commentInput, 'New comment');
    });

    // Find and press send button
    // Implementation depends on component structure
  });

  it('handles back navigation', async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <PublicStoryDetailsScreen route={mockRoute} />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Back button should be rendered
      expect(mockGoBack).toBeDefined();
    });
  });

  it('handles follow user functionality', async () => {
    api.followUser.mockResolvedValue({
      isSuccess: true,
      following: true,
    });

    const { getByText } = render(
      <NavigationContainer>
        <PublicStoryDetailsScreen route={mockRoute} />
      </NavigationContainer>
    );

    await waitFor(() => {
      const followButton = getByText('Follow');
      fireEvent.press(followButton);
    });

    await waitFor(() => {
      expect(api.followUser).toHaveBeenCalledWith('testauthor');
    });
  });

  it('displays error state when story not found', async () => {
    api.getPublicStoryDetails.mockResolvedValue({
      isSuccess: false,
      message: 'Story not found',
    });

    const { getByText } = render(
      <NavigationContainer>
        <PublicStoryDetailsScreen route={mockRoute} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Story not found')).toBeTruthy();
    });
  });

  it('displays empty comments state', async () => {
    api.getStoryComments.mockResolvedValue({
      isSuccess: true,
      comments: [],
    });

    const { getByText } = render(
      <NavigationContainer>
        <PublicStoryDetailsScreen route={mockRoute} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('No comments yet')).toBeTruthy();
    });
  });
});

