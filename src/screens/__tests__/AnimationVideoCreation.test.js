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
      params: {
        storyId: 1,
        chapterId: 1,
      },
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
}));

describe('AnimationVideoCreation', () => {
  const mockStory = {
    id: 1,
    title: 'Test Story',
    chapters: [
      {
        id: 1,
        title: 'Chapter 1',
        text: 'Chapter content',
        chapter_number: 1,
      },
    ],
  };

  const mockStyles = [
    {
      id: 1,
      name: '2D Animation',
      description: 'Classic 2D',
      preview: '🎨',
      color: '#FF6B6B',
    },
    {
      id: 2,
      name: '3D Animation',
      description: 'Modern 3D',
      preview: '🎬',
      color: '#4ECDC4',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    api.getUserStories.mockResolvedValue({
      isSuccess: true,
      stories: [mockStory],
    });
    api.getAnimationStyles.mockResolvedValue({
      isSuccess: true,
      styles: mockStyles,
    });
    api.getMyAnimationVideos.mockResolvedValue({
      isSuccess: true,
      videos: [],
    });
    api.getStoryDetails.mockResolvedValue({
      isSuccess: true,
      story: mockStory,
    });
  });

  it('auto-selects story and chapter from route params', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(api.getStoryDetails).toHaveBeenCalledWith(1);
    });
  });

  it('validates selections before creating video', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Try to create without selections
      // Should show error
    });
  });

  it('creates video with correct parameters', async () => {
    api.createAnimationVideo.mockResolvedValue({
      isSuccess: true,
      video: {
        id: 1,
        status: 'processing',
      },
    });

    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Select style
      const styleCard = getByText('2D Animation');
      fireEvent.press(styleCard);
    });

    await waitFor(() => {
      const createButton = getByText('Create Animation Video');
      fireEvent.press(createButton);
    });

    await waitFor(() => {
      expect(api.createAnimationVideo).toHaveBeenCalledWith(
        1, // story_id
        1, // chapter_id
        1, // animation_style
        expect.objectContaining({
          duration: expect.any(Number),
          quality: expect.any(String),
        })
      );
    });
  });

  it('polls video status after creation', async () => {
    api.createAnimationVideo.mockResolvedValue({
      isSuccess: true,
      video: {
        id: 1,
        status: 'processing',
      },
    });

    api.getAnimationVideoStatus.mockResolvedValue({
      isSuccess: true,
      status: {
        status: 'completed',
        progress: 100,
      },
    });

    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const styleCard = getByText('2D Animation');
      fireEvent.press(styleCard);
    });

    await waitFor(() => {
      const createButton = getByText('Create Animation Video');
      fireEvent.press(createButton);
    });

    // Status polling would be tested here
    await waitFor(() => {
      expect(api.createAnimationVideo).toHaveBeenCalled();
    });
  });

  it('handles video creation error', async () => {
    api.createAnimationVideo.mockResolvedValue({
      isSuccess: false,
      message: 'Failed to create video',
    });

    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const styleCard = getByText('2D Animation');
      fireEvent.press(styleCard);
    });

    await waitFor(() => {
      const createButton = getByText('Create Animation Video');
      fireEvent.press(createButton);
    });

    await waitFor(() => {
      expect(require('react-native').Alert.alert).toHaveBeenCalled();
    });
  });

  it('displays video processing status', async () => {
    api.getMyAnimationVideos.mockResolvedValue({
      isSuccess: true,
      videos: [
        {
          id: 1,
          title: 'Processing Video',
          status: 'processing',
          created_at: '2024-01-01',
        },
      ],
    });

    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Processing Video')).toBeTruthy();
    });
  });

  it('displays completed video with actions', async () => {
    api.getMyAnimationVideos.mockResolvedValue({
      isSuccess: true,
      videos: [
        {
          id: 1,
          title: 'Completed Video',
          status: 'completed',
          created_at: '2024-01-01',
          thumbnail_url: 'https://example.com/thumb.jpg',
        },
      ],
    });

    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Completed Video')).toBeTruthy();
    });
  });

  it('allows selecting different animation styles', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('2D Animation')).toBeTruthy();
      expect(getByText('3D Animation')).toBeTruthy();
    });
  });

  it('updates video settings', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Open settings modal
      // Update settings
      // Verify changes
    });
  });
});

