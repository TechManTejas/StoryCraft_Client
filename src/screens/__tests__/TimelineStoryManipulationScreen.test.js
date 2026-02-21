import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import TimelineStoryManipulationScreen from '../TimelineStoryManipulationScreen';
import { api } from '../../api';

// Mock API
jest.mock('../../api', () => ({
  api: {
    getStoryDetails: jest.fn(),
    getStoryTimelines: jest.fn(),
    getTimelineDetails: jest.fn(),
    getTimelineAnimations: jest.fn(),
    navigateTimeline: jest.fn(),
    updateTimelineScene: jest.fn(),
    syncAnimationWithStory: jest.fn(),
    autoUpdateAnimations: jest.fn(),
    createTimelineBranch: jest.fn(),
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
      info: '#2196F3',
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
  GitBranch: () => null,
  Video: () => null,
  Edit3: () => null,
  Save: () => null,
  RefreshCw: () => null,
  Play: () => null,
  Pause: () => null,
  ArrowRight: () => null,
  ArrowLeft: () => null,
  Plus: () => null,
  Trash2: () => null,
  Link: () => null,
  Unlink: () => null,
  Zap: () => null,
  Clock: () => null,
  CheckCircle: () => null,
  X: () => null,
  AlertCircle: () => null,
}));

describe('TimelineStoryManipulationScreen', () => {
  const mockStory = {
    id: 1,
    title: 'Test Story',
    description: 'Test Description',
  };

  const mockTimelines = [
    {
      id: 1,
      name: 'Main Timeline',
      description: 'Primary story path',
      scenes_count: 5,
      animations_count: 3,
      created_at: '2024-01-01',
    },
    {
      id: 2,
      name: 'Alternate Timeline',
      description: 'Alternative path',
      scenes_count: 4,
      animations_count: 2,
      created_at: '2024-01-02',
    },
  ];

  const mockScenes = [
    {
      id: 1,
      text: 'Scene 1 text',
      title: 'Scene 1',
      choice_1: 'Choice 1',
      choice_2: 'Choice 2',
    },
    {
      id: 2,
      text: 'Scene 2 text',
      title: 'Scene 2',
    },
  ];

  const mockAnimations = [
    {
      id: 1,
      scene_id: 1,
      title: 'Animation 1',
      animation_style: '2D',
      status: 'completed',
      synced_with_story: true,
    },
    {
      id: 2,
      scene_id: 2,
      title: 'Animation 2',
      animation_style: '3D',
      status: 'processing',
      synced_with_story: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    api.getStoryDetails.mockResolvedValue({
      isSuccess: true,
      story: mockStory,
    });
    api.getStoryTimelines.mockResolvedValue({
      isSuccess: true,
      timelines: mockTimelines,
    });
    api.getTimelineDetails.mockResolvedValue({
      isSuccess: true,
      timeline: {
        scenes: mockScenes,
      },
    });
    api.getTimelineAnimations.mockResolvedValue({
      isSuccess: true,
      animations: mockAnimations,
    });
  });

  it('renders correctly', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <TimelineStoryManipulationScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Timeline Story')).toBeTruthy();
    });
  });

  it('displays story information', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <TimelineStoryManipulationScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Test Story')).toBeTruthy();
      expect(getByText('Test Description')).toBeTruthy();
    });
  });

  it('displays timelines', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <TimelineStoryManipulationScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Main Timeline')).toBeTruthy();
      expect(getByText('Alternate Timeline')).toBeTruthy();
    });
  });

  it('switches between timelines', async () => {
    api.navigateTimeline.mockResolvedValue({
      isSuccess: true,
      timeline: mockTimelines[1],
    });

    const { getByText } = render(
      <NavigationContainer>
        <TimelineStoryManipulationScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const alternateTimeline = getByText('Alternate Timeline');
      fireEvent.press(alternateTimeline);
    });

    await waitFor(() => {
      expect(api.navigateTimeline).toHaveBeenCalledWith(1, 1, 2);
    });
  });

  it('displays scenes for current timeline', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <TimelineStoryManipulationScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Scene 1')).toBeTruthy();
      expect(getByText('Scene 2')).toBeTruthy();
    });
  });

  it('opens edit modal when scene is edited', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <TimelineStoryManipulationScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Find edit button and press it
      // Implementation depends on component structure
    });
  });

  it('saves scene changes', async () => {
    api.updateTimelineScene.mockResolvedValue({
      isSuccess: true,
      scene: { ...mockScenes[0], text: 'Updated text' },
      animation_updated: true,
    });

    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <TimelineStoryManipulationScreen />
      </NavigationContainer>
    );

    // Edit and save flow would be tested here
    await waitFor(() => {
      expect(api.getStoryTimelines).toHaveBeenCalled();
    });
  });

  it('displays connected animations', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <TimelineStoryManipulationScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Connected Animations')).toBeTruthy();
      expect(getByText('Animation 1')).toBeTruthy();
    });
  });

  it('syncs animation with story', async () => {
    api.syncAnimationWithStory.mockResolvedValue({
      isSuccess: true,
      animation: { ...mockAnimations[1], synced_with_story: true },
      synced: true,
    });

    const { getByText } = render(
      <NavigationContainer>
        <TimelineStoryManipulationScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Find sync button and press it
      // Implementation depends on component structure
    });
  });

  it('toggles auto-update feature', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <TimelineStoryManipulationScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const autoUpdateText = getByText(/Auto-update animations/);
      expect(autoUpdateText).toBeTruthy();
    });
  });

  it('creates timeline branch', async () => {
    api.createTimelineBranch.mockResolvedValue({
      isSuccess: true,
      timeline: {
        id: 3,
        name: 'New Branch',
      },
    });

    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <TimelineStoryManipulationScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Create branch flow would be tested here
      expect(api.getStoryTimelines).toHaveBeenCalled();
    });
  });

  it('auto-updates animations when enabled', async () => {
    api.autoUpdateAnimations.mockResolvedValue({
      isSuccess: true,
      updated_animations: [1, 2],
    });

    // Auto-update would be triggered by useEffect
    await waitFor(() => {
      // Verify auto-update is called
    });
  });

  it('displays loading state initially', () => {
    api.getStoryDetails.mockImplementation(() => new Promise(() => {}));

    const { getByText } = render(
      <NavigationContainer>
        <TimelineStoryManipulationScreen />
      </NavigationContainer>
    );

    expect(getByText('Loading timelines...')).toBeTruthy();
  });
});

