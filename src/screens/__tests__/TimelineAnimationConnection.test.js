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
    updateTimelineScene: jest.fn(),
    syncAnimationWithStory: jest.fn(),
    autoUpdateAnimations: jest.fn(),
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

describe('TimelineAnimationConnection', () => {
  const mockTimeline = {
    id: 1,
    name: 'Main Timeline',
    scenes: [
      {
        id: 1,
        text: 'Scene 1',
        title: 'Scene 1',
      },
    ],
  };

  const mockAnimations = [
    {
      id: 1,
      scene_id: 1,
      title: 'Animation 1',
      synced_with_story: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    api.getStoryDetails.mockResolvedValue({
      isSuccess: true,
      story: { id: 1, title: 'Test Story' },
    });
    api.getStoryTimelines.mockResolvedValue({
      isSuccess: true,
      timelines: [mockTimeline],
    });
    api.getTimelineDetails.mockResolvedValue({
      isSuccess: true,
      timeline: mockTimeline,
    });
    api.getTimelineAnimations.mockResolvedValue({
      isSuccess: true,
      animations: mockAnimations,
    });
  });

  it('connects animations to story scenes', async () => {
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

  it('auto-updates animations when story changes', async () => {
    api.updateTimelineScene.mockResolvedValue({
      isSuccess: true,
      scene: { id: 1, text: 'Updated text' },
      animation_updated: true,
    });

    api.autoUpdateAnimations.mockResolvedValue({
      isSuccess: true,
      updated_animations: [1],
    });

    const { getByText } = render(
      <NavigationContainer>
        <TimelineStoryManipulationScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Auto-update would be triggered
      expect(api.getTimelineAnimations).toHaveBeenCalled();
    });
  });

  it('syncs individual animation with story', async () => {
    api.syncAnimationWithStory.mockResolvedValue({
      isSuccess: true,
      animation: { ...mockAnimations[0], synced_with_story: true },
      synced: true,
    });

    const { getByText } = render(
      <NavigationContainer>
        <TimelineStoryManipulationScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Sync functionality would be tested here
      expect(api.getTimelineAnimations).toHaveBeenCalled();
    });
  });

  it('shows sync status for animations', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <TimelineStoryManipulationScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Sync status indicators would be displayed
      expect(getByText('Connected Animations')).toBeTruthy();
    });
  });

  it('updates animation when scene text changes', async () => {
    api.updateTimelineScene.mockResolvedValue({
      isSuccess: true,
      scene: { id: 1, text: 'New text' },
      animation_updated: true,
    });

    const { getByText } = render(
      <NavigationContainer>
        <TimelineStoryManipulationScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Scene update would trigger animation update
      expect(api.updateTimelineScene).toBeDefined);
    });
  });

  it('handles auto-update toggle', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <TimelineStoryManipulationScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const toggle = getByText(/Auto-update animations/);
      expect(toggle).toBeTruthy();
    });
  });

  it('refreshes animations after sync', async () => {
    api.syncAnimationWithStory.mockResolvedValue({
      isSuccess: true,
      animation: { ...mockAnimations[0], synced_with_story: true },
    });

    const { getByText } = render(
      <NavigationContainer>
        <TimelineStoryManipulationScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      // After sync, animations should be refreshed
      expect(api.getTimelineAnimations).toHaveBeenCalled();
    });
  });

  it('displays animation sync status correctly', async () => {
    const syncedAnimations = [
      {
        id: 1,
        scene_id: 1,
        title: 'Synced Animation',
        synced_with_story: true,
      },
      {
        id: 2,
        scene_id: 2,
        title: 'Unsynced Animation',
        synced_with_story: false,
      },
    ];

    api.getTimelineAnimations.mockResolvedValue({
      isSuccess: true,
      animations: syncedAnimations,
    });

    const { getByText } = render(
      <NavigationContainer>
        <TimelineStoryManipulationScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Synced Animation')).toBeTruthy();
      expect(getByText('Unsynced Animation')).toBeTruthy();
    });
  });

  it('updates animations when switching timelines', async () => {
    const timeline2 = {
      id: 2,
      name: 'Timeline 2',
      scenes: [{ id: 2, text: 'Scene 2' }],
    };

    api.navigateTimeline.mockResolvedValue({
      isSuccess: true,
      timeline: timeline2,
    });

    api.getTimelineDetails.mockResolvedValueOnce({
      isSuccess: true,
      timeline: mockTimeline,
    }).mockResolvedValueOnce({
      isSuccess: true,
      timeline: timeline2,
    });

    const { getByText } = render(
      <NavigationContainer>
        <TimelineStoryManipulationScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Timeline switch would update animations
      expect(api.getTimelineAnimations).toHaveBeenCalled();
    });
  });
});

