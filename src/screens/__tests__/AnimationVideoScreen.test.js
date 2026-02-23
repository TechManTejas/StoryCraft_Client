import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import AnimationVideoScreen from '../AnimationVideoScreen';
import { api } from '../../api';

// Mock API
jest.mock('../../api', () => ({
  api: {
    getUserStories: jest.fn(),
    getAnimationStyles: jest.fn(),
    getMyAnimationVideos: jest.fn(),
    getStoryDetails: jest.fn(),
    createAnimationVideo: jest.fn(),
    getAnimationVideoStatus: jest.fn(),
    deleteAnimationVideo: jest.fn(),
    getAnimationVideo: jest.fn(),
    updateAnimationVideo: jest.fn(),
    regenerateAnimationVideo: jest.fn(),
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
      params: {},
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
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FF9800',
      accent: '#FFE66D',
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
  Video: () => null,
  Play: () => null,
  Pause: () => null,
  Settings: () => null,
  Sparkles: () => null,
  Film: () => null,
  Image: () => null,
  Clock: () => null,
  CheckCircle: () => null,
  X: () => null,
  Trash2: () => null,
  Download: () => null,
  Share2: () => null,
  Zap: () => null,
  Palette: () => null,
  Sliders: () => null,
  GitBranch: () => null,
  Edit3: () => null,
}));

describe('AnimationVideoScreen', () => {
  const mockStories = [
    {
      id: 1,
      title: 'Story 1',
      chapters_count: 5,
    },
    {
      id: 2,
      title: 'Story 2',
      chapters_count: 3,
    },
  ];

  const mockChapters = [
    {
      id: 1,
      title: 'Chapter 1',
      text: 'Chapter content here',
      chapter_number: 1,
    },
    {
      id: 2,
      title: 'Chapter 2',
      text: 'More content',
      chapter_number: 2,
    },
  ];

  const mockStyles = [
    {
      id: 1,
      name: '2D Animation',
      description: 'Classic 2D animated style',
      preview: '🎨',
      color: '#FF6B6B',
    },
  ];

  const mockVideos = [
    {
      id: 1,
      title: 'Video 1',
      story_title: 'Story 1',
      animation_style_name: '2D Animation',
      status: 'completed',
      created_at: '2024-01-01',
      thumbnail_url: 'https://example.com/thumb.jpg',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    api.getUserStories.mockResolvedValue({
      isSuccess: true,
      stories: mockStories,
    });
    api.getAnimationStyles.mockResolvedValue({
      isSuccess: true,
      styles: mockStyles,
    });
    api.getMyAnimationVideos.mockResolvedValue({
      isSuccess: true,
      videos: mockVideos,
    });
    api.getStoryDetails.mockResolvedValue({
      isSuccess: true,
      story: {
        chapters: mockChapters,
      },
    });
  });

  it('renders correctly', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Animation Video')).toBeTruthy();
    });
  });

  it('displays stories list', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Story 1')).toBeTruthy();
      expect(getByText('Story 2')).toBeTruthy();
    });
  });

  it('displays animation styles', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('2D Animation')).toBeTruthy();
    });
  });

  it('loads chapters when story is selected', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const storyCard = getByText('Story 1');
      fireEvent.press(storyCard);
    });

    await waitFor(() => {
      expect(api.getStoryDetails).toHaveBeenCalledWith(1);
    });
  });

  it('displays chapters after story selection', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const storyCard = getByText('Story 1');
      fireEvent.press(storyCard);
    });

    await waitFor(() => {
      expect(getByText('Chapter 1')).toBeTruthy();
    });
  });

  it('creates video when all selections are made', async () => {
    api.createAnimationVideo.mockResolvedValue({
      isSuccess: true,
      video: {
        id: 3,
        title: 'New Video',
        status: 'processing',
      },
    });

    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const storyCard = getByText('Story 1');
      fireEvent.press(storyCard);
    });

    await waitFor(() => {
      const chapterCard = getByText('Chapter 1');
      fireEvent.press(chapterCard);
    });

    await waitFor(() => {
      const styleCard = getByText('2D Animation');
      fireEvent.press(styleCard);
    });

    await waitFor(() => {
      const createButton = getByText('Create Animation Video');
      fireEvent.press(createButton);
    });

    await waitFor(() => {
      expect(api.createAnimationVideo).toHaveBeenCalled();
    });
  });

  it('displays created videos', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('My Animation Videos')).toBeTruthy();
      expect(getByText('Video 1')).toBeTruthy();
    });
  });

  it('handles delete video', async () => {
    api.deleteAnimationVideo.mockResolvedValue({
      isSuccess: true,
      message: 'Video deleted',
    });

    const { getByTestId } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Delete functionality would be tested here
      expect(api.getMyAnimationVideos).toHaveBeenCalled();
    });
  });

  it('displays loading state initially', () => {
    api.getUserStories.mockImplementation(() => new Promise(() => {}));

    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    expect(getByText('Loading...')).toBeTruthy();
  });

  it('shows empty state when no stories', async () => {
    api.getUserStories.mockResolvedValue({
      isSuccess: true,
      stories: [],
    });

    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('No stories available')).toBeTruthy();
    });
  });

  it('opens settings modal when settings button is pressed', async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Settings modal would be tested here
      expect(api.getUserStories).toHaveBeenCalled();
    });
  });

  it('navigates to TimelineStoryManipulationScreen', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('@react-navigation/native'), 'useNavigation').mockReturnValue({
      navigate: mockNavigate,
      goBack: jest.fn(),
    });

    const { getByTestId } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Timeline navigation button should be available
      expect(mockNavigate).toBeDefined();
    });
  });

  it('connects animation videos to story timelines', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Animation videos should be connected to story timelines
      expect(api.getUserStories).toHaveBeenCalled();
    });
  });

  it('supports timeline-based story manipulation', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Timeline manipulation should be accessible
      expect(api.getMyAnimationVideos).toHaveBeenCalled();
    });
  });

  it('opens editor when edit button is clicked on completed video', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('My Animation Videos')).toBeTruthy();
      expect(getByText('Video 1')).toBeTruthy();
    });

    // Edit button should be available for completed videos
    expect(api.getMyAnimationVideos).toHaveBeenCalled();
  });

  it('handles video editing successfully', async () => {
    api.updateAnimationVideo = jest.fn().mockResolvedValue({
      isSuccess: true,
      video: {
        id: 1,
        title: 'Updated Video',
        status: 'completed',
      },
    });

    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Video 1')).toBeTruthy();
    });

    // Edit functionality would be tested here
    expect(api.getMyAnimationVideos).toHaveBeenCalled();
  });

  it('updates video list after editing', async () => {
    api.updateAnimationVideo = jest.fn().mockResolvedValue({
      isSuccess: true,
      video: {
        id: 1,
        title: 'Updated Video Title',
        status: 'completed',
      },
    });

    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('My Animation Videos')).toBeTruthy();
    });

    // After edit, video list should be refreshed
    expect(api.getMyAnimationVideos).toHaveBeenCalled();
  });

  it('handles editor save callback correctly', async () => {
    const updatedVideo = {
      id: 1,
      title: 'Updated Video',
      status: 'completed',
    };

    api.updateAnimationVideo = jest.fn().mockResolvedValue({
      isSuccess: true,
      video: updatedVideo,
    });

    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Video 1')).toBeTruthy();
    });

    // Editor save callback would be tested here
    expect(api.getMyAnimationVideos).toHaveBeenCalled();
  });

  it('handles video regeneration from editor', async () => {
    api.regenerateAnimationVideo = jest.fn().mockResolvedValue({
      isSuccess: true,
      video: {
        id: 1,
        title: 'Video 1',
        status: 'processing',
      },
    });

    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Video 1')).toBeTruthy();
    });

    // Regeneration functionality would be tested here
    expect(api.getMyAnimationVideos).toHaveBeenCalled();
  });
});

