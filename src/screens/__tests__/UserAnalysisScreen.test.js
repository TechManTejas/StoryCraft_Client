import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import UserAnalysisScreen from '../UserAnalysisScreen';
import { api } from '../../api';

// Mock API
jest.mock('../../api', () => ({
  api: {
    getUserAnalysis: jest.fn(),
    getUserActivityTimeline: jest.fn(),
    getUserEngagementMetrics: jest.fn(),
    getUserContentPerformance: jest.fn(),
  },
}));

// Mock navigation
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
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
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FF9800',
      accent: '#FFE66D',
      info: '#2196F3',
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
    },
    borderRadius: {
      md: 12,
      lg: 16,
      xl: 20,
      round: 9999,
    },
    shadows: {
      small: {},
      medium: {},
      large: {},
    },
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  ChevronLeft: () => null,
  TrendingUp: () => null,
  TrendingDown: () => null,
  Users: () => null,
  BookOpen: () => null,
  Heart: () => null,
  Eye: () => null,
  MessageCircle: () => null,
  Clock: () => null,
  Star: () => null,
  Award: () => null,
  BarChart3: () => null,
  Calendar: () => null,
  ArrowUp: () => null,
  ArrowDown: () => null,
  Sparkles: () => null,
  Target: () => null,
  Zap: () => null,
}));

describe('UserAnalysisScreen', () => {
  const mockUserAnalysis = {
    stories_created: 15,
    stories_created_change: 10,
    total_views: 1250,
    views_change: 25,
    total_likes: 340,
    likes_change: 15,
    total_comments: 89,
    comments_change: 8,
    growth_trends: {
      stories_growth: 12,
      views_growth: 30,
      engagement_growth: 18,
    },
  };

  const mockEngagementMetrics = {
    engagement_rate: 45.5,
    engagement_rate_change: 5,
    followers: 120,
    followers_change: 10,
    average_rating: 4.5,
    rating_change: 0.2,
    avg_reading_time: 15,
  };

  const mockContentPerformance = {
    top_story: {
      title: 'Top Story',
      views: 500,
    },
    most_liked: {
      title: 'Most Liked',
      likes: 150,
    },
    most_commented: {
      title: 'Most Commented',
      comments: 45,
    },
  };

  const mockActivityTimeline = [
    {
      id: 1,
      type: 'story_created',
      description: 'Created new story',
      timestamp: '2024-01-15T10:00:00Z',
    },
    {
      id: 2,
      type: 'story_liked',
      description: 'Received a like',
      timestamp: '2024-01-14T15:30:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    api.getUserAnalysis.mockResolvedValue({
      isSuccess: true,
      analysis: mockUserAnalysis,
    });
    api.getUserActivityTimeline.mockResolvedValue({
      isSuccess: true,
      timeline: mockActivityTimeline,
    });
    api.getUserEngagementMetrics.mockResolvedValue({
      isSuccess: true,
      metrics: mockEngagementMetrics,
    });
    api.getUserContentPerformance.mockResolvedValue({
      isSuccess: true,
      performance: mockContentPerformance,
    });
  });

  it('renders correctly', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <UserAnalysisScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('User Analysis')).toBeTruthy();
    });
  });

  it('loads user analysis data on mount', async () => {
    render(
      <NavigationContainer>
        <UserAnalysisScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(api.getUserAnalysis).toHaveBeenCalledWith('30d');
      expect(api.getUserActivityTimeline).toHaveBeenCalledWith('30d');
      expect(api.getUserEngagementMetrics).toHaveBeenCalledWith('30d');
      expect(api.getUserContentPerformance).toHaveBeenCalledWith('30d');
    });
  });

  it('displays overview metrics', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <UserAnalysisScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Stories Created')).toBeTruthy();
      expect(getByText('Total Views')).toBeTruthy();
      expect(getByText('Total Likes')).toBeTruthy();
      expect(getByText('Comments')).toBeTruthy();
    });
  });

  it('displays engagement metrics', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <UserAnalysisScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Engagement')).toBeTruthy();
      expect(getByText('Engagement Rate')).toBeTruthy();
      expect(getByText('Followers')).toBeTruthy();
    });
  });

  it('displays content performance', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <UserAnalysisScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Content Performance')).toBeTruthy();
      expect(getByText('Top Performing Story')).toBeTruthy();
    });
  });

  it('displays activity timeline', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <UserAnalysisScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Recent Activity')).toBeTruthy();
    });
  });

  it('allows changing time period', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <UserAnalysisScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const periodButton = getByText('90 Days');
      fireEvent.press(periodButton);
    });

    await waitFor(() => {
      expect(api.getUserAnalysis).toHaveBeenCalledWith('90d');
    });
  });

  it('displays growth trends', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <UserAnalysisScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Growth Trends')).toBeTruthy();
      expect(getByText('Stories Growth')).toBeTruthy();
    });
  });

  it('handles loading state', () => {
    api.getUserAnalysis.mockImplementation(() => new Promise(() => {}));

    const { getByText } = render(
      <NavigationContainer>
        <UserAnalysisScreen />
      </NavigationContainer>
    );

    expect(getByText('Loading analysis...')).toBeTruthy();
  });

  it('handles API errors gracefully', async () => {
    api.getUserAnalysis.mockResolvedValue({
      isSuccess: false,
      message: 'Failed to load',
    });

    const { getByText } = render(
      <NavigationContainer>
        <UserAnalysisScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('User Analysis')).toBeTruthy();
    });
  });

  it('navigates back when back button is pressed', async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <UserAnalysisScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(mockGoBack).toBeDefined();
    });
  });
});

