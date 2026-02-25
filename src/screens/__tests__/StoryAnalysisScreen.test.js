import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import StoryAnalysisScreen from '../StoryAnalysisScreen';
import { api } from '../../api';

// Mock API
jest.mock('../../api', () => ({
  api: {
    getStoryAnalysis: jest.fn(),
    getStoryPerformanceMetrics: jest.fn(),
    getStoryEngagementData: jest.fn(),
    getStoryReaderDemographics: jest.fn(),
    getAllStoriesAnalysis: jest.fn(),
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
    useRoute: () => ({
      params: { storyId: 1 },
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
  Eye: () => null,
  Heart: () => null,
  MessageCircle: () => null,
  Clock: () => null,
  Star: () => null,
  Users: () => null,
  BookOpen: () => null,
  BarChart3: () => null,
  Calendar: () => null,
  ArrowUp: () => null,
  ArrowDown: () => null,
  Share2: () => null,
  Bookmark: () => null,
  Target: () => null,
  Award: () => null,
  Zap: () => null,
}));

describe('StoryAnalysisScreen', () => {
  const mockStoryAnalysis = {
    title: 'Test Story',
    description: 'Test Description',
    total_views: 1250,
    views_change: 25,
    total_likes: 340,
    likes_change: 15,
    total_comments: 89,
    comments_change: 8,
    average_rating: 4.5,
    rating_change: 0.2,
    chapters_count: 10,
    created_at: '2024-01-01',
  };

  const mockPerformanceMetrics = {
    peak_views_day: '2024-01-15',
    peak_views_count: 150,
    best_chapter: {
      title: 'Chapter 5',
      views: 200,
    },
    completion_rate: 65,
  };

  const mockEngagementData = {
    engagement_rate: 45.5,
    engagement_rate_change: 5,
    shares: 50,
    shares_change: 10,
    saves: 120,
    saves_change: 15,
    avg_read_time: 12,
  };

  const mockDemographics = {
    total_readers: 500,
    age_groups: {
      '18-24': 150,
      '25-34': 200,
      '35-44': 100,
      '45+': 50,
    },
    geographic_distribution: [
      { region: 'North America', count: 200 },
      { region: 'Europe', count: 150 },
      { region: 'Asia', count: 100 },
    ],
  };

  const mockAllStoriesAnalysis = {
    total_stories: 15,
    stories_change: 10,
    total_views: 5000,
    views_change: 25,
    total_likes: 1200,
    likes_change: 15,
    average_rating: 4.3,
    top_stories: [
      { id: 1, title: 'Story 1', views: 500, likes: 150, rating: 4.8 },
      { id: 2, title: 'Story 2', views: 400, likes: 120, rating: 4.5 },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    api.getStoryAnalysis.mockResolvedValue({
      isSuccess: true,
      analysis: mockStoryAnalysis,
    });
    api.getStoryPerformanceMetrics.mockResolvedValue({
      isSuccess: true,
      metrics: mockPerformanceMetrics,
    });
    api.getStoryEngagementData.mockResolvedValue({
      isSuccess: true,
      engagement: mockEngagementData,
    });
    api.getStoryReaderDemographics.mockResolvedValue({
      isSuccess: true,
      demographics: mockDemographics,
    });
    api.getAllStoriesAnalysis.mockResolvedValue({
      isSuccess: true,
      analysis: mockAllStoriesAnalysis,
    });
  });

  it('renders correctly for single story', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <StoryAnalysisScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Story Analysis')).toBeTruthy();
    });
  });

  it('loads story analysis data on mount', async () => {
    render(
      <NavigationContainer>
        <StoryAnalysisScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(api.getStoryAnalysis).toHaveBeenCalledWith(1, '30d');
      expect(api.getStoryPerformanceMetrics).toHaveBeenCalledWith(1, '30d');
      expect(api.getStoryEngagementData).toHaveBeenCalledWith(1, '30d');
      expect(api.getStoryReaderDemographics).toHaveBeenCalledWith(1);
    });
  });

  it('displays story overview', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <StoryAnalysisScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Story Overview')).toBeTruthy();
      expect(getByText('Test Story')).toBeTruthy();
    });
  });

  it('displays performance metrics', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <StoryAnalysisScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Performance Metrics')).toBeTruthy();
      expect(getByText('Total Views')).toBeTruthy();
      expect(getByText('Total Likes')).toBeTruthy();
    });
  });

  it('displays engagement data', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <StoryAnalysisScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Engagement')).toBeTruthy();
      expect(getByText('Engagement Rate')).toBeTruthy();
    });
  });

  it('displays performance details', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <StoryAnalysisScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Performance Details')).toBeTruthy();
      expect(getByText('Peak Views Day')).toBeTruthy();
    });
  });

  it('displays reader demographics', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <StoryAnalysisScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Reader Demographics')).toBeTruthy();
    });
  });

  it('allows changing time period', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <StoryAnalysisScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const periodButton = getByText('90 Days');
      fireEvent.press(periodButton);
    });

    await waitFor(() => {
      expect(api.getStoryAnalysis).toHaveBeenCalledWith(1, '90d');
    });
  });

  it('renders all stories analysis when no storyId', async () => {
    jest.spyOn(require('@react-navigation/native'), 'useRoute').mockReturnValue({
      params: {},
    });

    const { getByText } = render(
      <NavigationContainer>
        <StoryAnalysisScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('All Stories Analysis')).toBeTruthy();
      expect(api.getAllStoriesAnalysis).toHaveBeenCalledWith('30d');
    });
  });

  it('displays top stories comparison', async () => {
    jest.spyOn(require('@react-navigation/native'), 'useRoute').mockReturnValue({
      params: {},
    });

    const { getByText } = render(
      <NavigationContainer>
        <StoryAnalysisScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Top Performing Stories')).toBeTruthy();
    });
  });

  it('handles loading state', () => {
    api.getStoryAnalysis.mockImplementation(() => new Promise(() => {}));

    const { getByText } = render(
      <NavigationContainer>
        <StoryAnalysisScreen />
      </NavigationContainer>
    );

    expect(getByText('Loading analysis...')).toBeTruthy();
  });

  it('handles API errors gracefully', async () => {
    api.getStoryAnalysis.mockResolvedValue({
      isSuccess: false,
      message: 'Failed to load',
    });

    const { getByText } = render(
      <NavigationContainer>
        <StoryAnalysisScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Story Analysis')).toBeTruthy();
    });
  });
});

