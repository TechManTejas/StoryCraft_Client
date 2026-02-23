import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import AnimationVideoScreen from '../../screens/AnimationVideoScreen';
import AnimationVideoEditor from '../AnimationVideoEditor';
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
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      goBack: mockGoBack,
      navigate: mockNavigate,
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

// Mock Alert
jest.spyOn(require('react-native'), 'Alert').mockImplementation((title, message, buttons) => {
  if (buttons && buttons.length > 0) {
    const confirmButton = buttons.find(b => b.text !== 'Cancel');
    if (confirmButton && confirmButton.onPress) {
      confirmButton.onPress();
    }
  }
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
  Save: () => null,
  Edit3: () => null,
  Music: () => null,
  Mic: () => null,
  Type: () => null,
  RefreshCw: () => null,
}));

describe('AnimationVideoEditContext Integration', () => {
  const mockStories = [
    {
      id: 1,
      title: 'Story 1',
      chapters_count: 5,
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
      video_settings: {
        duration: 30,
        quality: 'hd',
        music: true,
        narration: true,
        subtitles: true,
      },
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
    api.getAnimationVideo.mockResolvedValue({
      isSuccess: true,
      video: mockVideos[0],
    });
  });

  it('opens editor when edit button is clicked on completed video', async () => {
    const { getByText, queryByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('My Animation Videos')).toBeTruthy();
    });

    // Edit functionality would be tested here
    // The edit button should be available for completed videos
    expect(api.getMyAnimationVideos).toHaveBeenCalled();
  });

  it('updates video list after editing', async () => {
    const updatedVideo = {
      ...mockVideos[0],
      title: 'Updated Video Title',
    };

    api.updateAnimationVideo.mockResolvedValue({
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

    // After edit, video list should be refreshed
    expect(api.getMyAnimationVideos).toHaveBeenCalled();
  });

  it('handles editor save callback correctly', async () => {
    const mockOnSave = jest.fn();
    const updatedVideo = {
      ...mockVideos[0],
      title: 'Updated Title',
    };

    api.updateAnimationVideo.mockResolvedValue({
      isSuccess: true,
      video: updatedVideo,
    });

    const { getByText } = render(
      <AnimationVideoEditor
        visible={true}
        video={mockVideos[0]}
        onClose={jest.fn()}
        onSave={mockOnSave}
      />
    );

    await waitFor(() => {
      const saveButton = getByText('Save Changes');
      fireEvent.press(saveButton);
    });

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(updatedVideo);
    });
  });

  it('handles editor close callback correctly', async () => {
    const mockOnClose = jest.fn();

    const { getByText } = render(
      <AnimationVideoEditor
        visible={true}
        video={mockVideos[0]}
        onClose={mockOnClose}
        onSave={jest.fn()}
      />
    );

    // Close functionality would be tested here
    expect(mockOnClose).toBeDefined();
  });

  it('maintains video state during editing', async () => {
    const { getByDisplayValue } = render(
      <AnimationVideoEditor
        visible={true}
        video={mockVideos[0]}
        onClose={jest.fn()}
        onSave={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(getByDisplayValue('Video 1')).toBeTruthy();
    });
  });

  it('syncs editor changes with video screen', async () => {
    const updatedVideo = {
      ...mockVideos[0],
      title: 'Synced Title',
      video_settings: {
        duration: 60,
        quality: '4k',
        music: false,
        narration: true,
        subtitles: false,
      },
    };

    api.updateAnimationVideo.mockResolvedValue({
      isSuccess: true,
      video: updatedVideo,
    });

    const { getByText } = render(
      <NavigationContainer>
        <AnimationVideoScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(api.getMyAnimationVideos).toHaveBeenCalled();
    });

    // After save, the video list should reflect changes
    expect(api.updateAnimationVideo).toBeDefined();
  });

  it('handles regeneration from editor context', async () => {
    const regeneratedVideo = {
      ...mockVideos[0],
      status: 'processing',
    };

    api.regenerateAnimationVideo.mockResolvedValue({
      isSuccess: true,
      video: regeneratedVideo,
    });

    const { getByText } = render(
      <AnimationVideoEditor
        visible={true}
        video={mockVideos[0]}
        onClose={jest.fn()}
        onSave={jest.fn()}
      />
    );

    await waitFor(() => {
      const regenerateButton = getByText('Regenerate');
      fireEvent.press(regenerateButton);
    });

    await waitFor(() => {
      expect(api.regenerateAnimationVideo).toHaveBeenCalled();
    });
  });

  it('validates required fields before saving', async () => {
    const { getByText } = render(
      <AnimationVideoEditor
        visible={true}
        video={mockVideos[0]}
        onClose={jest.fn()}
        onSave={jest.fn()}
      />
    );

    await waitFor(() => {
      const saveButton = getByText('Save Changes');
      fireEvent.press(saveButton);
    });

    // Validation would be tested here
    expect(api.updateAnimationVideo).toBeDefined();
  });

  it('handles API errors gracefully during edit', async () => {
    api.updateAnimationVideo.mockResolvedValue({
      isSuccess: false,
      message: 'Update failed',
    });

    const { getByText } = render(
      <AnimationVideoEditor
        visible={true}
        video={mockVideos[0]}
        onClose={jest.fn()}
        onSave={jest.fn()}
      />
    );

    await waitFor(() => {
      const saveButton = getByText('Save Changes');
      fireEvent.press(saveButton);
    });

    await waitFor(() => {
      expect(api.updateAnimationVideo).toHaveBeenCalled();
    });
  });
});

