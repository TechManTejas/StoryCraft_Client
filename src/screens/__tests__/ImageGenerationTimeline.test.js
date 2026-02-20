import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ImageGenerationScreen from '../ImageGenerationScreen';
import { api } from '../../api';

// Mock API
jest.mock('../../api', () => ({
  api: {
    getStoryTimeline: jest.fn(),
    getStoryImages: jest.fn(),
    generateImage: jest.fn(),
  },
}));

// Mock navigation
const mockGoBack = jest.fn();
const mockNavigation = {
  goBack: mockGoBack,
};

// Mock the theme
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
      button: { fontSize: 16, fontWeight: '600' },
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
    },
    shadows: {
      large: {},
      glow: {},
    },
  },
}));

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  ChevronLeft: () => null,
  ChevronRight: () => null,
  Image: () => null,
  Sparkles: () => null,
  Loader: () => null,
  RefreshCw: () => null,
}));

describe('ImageGenerationScreen Timeline Navigation', () => {
  const mockRoute = {
    params: {
      storyId: 1,
    },
  };

  const mockTimeline = [
    {
      scene_id: 1,
      text: 'Beginning of the story',
      chapter_name: 'Chapter 1: The Beginning',
      character_name: 'Hero',
    },
    {
      scene_id: 2,
      text: 'Middle of the story',
      chapter_name: 'Chapter 1: The Beginning',
      character_name: 'Hero',
    },
    {
      scene_id: 3,
      text: 'End of the story',
      chapter_name: 'Chapter 2: The End',
      character_name: 'Hero',
    },
    {
      scene_id: 4,
      text: 'Epilogue',
      chapter_name: 'Chapter 2: The End',
      character_name: 'Hero',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    api.getStoryTimeline.mockResolvedValue({
      isSuccess: true,
      timeline: mockTimeline,
    });
    api.getStoryImages.mockResolvedValue({
      isSuccess: true,
      images: [],
    });
  });

  it('displays correct timeline indicator', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ImageGenerationScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Scene 1 of 4')).toBeTruthy();
    });
  });

  it('updates timeline indicator when navigating', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ImageGenerationScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Scene 1 of 4')).toBeTruthy();
    });

    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    await waitFor(() => {
      expect(getByText('Scene 2 of 4')).toBeTruthy();
    });
  });

  it('allows navigation through all timeline points', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ImageGenerationScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Chapter 1: The Beginning')).toBeTruthy();
    });

    // Navigate forward through all scenes
    for (let i = 1; i < mockTimeline.length; i++) {
      const nextButton = getByText('Next');
      fireEvent.press(nextButton);

      await waitFor(() => {
        expect(getByText(`Scene ${i + 1} of ${mockTimeline.length}`)).toBeTruthy();
      });
    }

    // Navigate backward through all scenes
    for (let i = mockTimeline.length - 1; i > 0; i--) {
      const prevButton = getByText('Previous');
      fireEvent.press(prevButton);

      await waitFor(() => {
        expect(getByText(`Scene ${i} of ${mockTimeline.length}`)).toBeTruthy();
      });
    }
  });

  it('displays correct scene content for each timeline point', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ImageGenerationScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Beginning of the story')).toBeTruthy();
    });

    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    await waitFor(() => {
      expect(getByText('Middle of the story')).toBeTruthy();
    });

    fireEvent.press(nextButton);

    await waitFor(() => {
      expect(getByText('End of the story')).toBeTruthy();
      expect(getByText('Chapter 2: The End')).toBeTruthy();
    });
  });

  it('handles timeline navigation with initial scene ID', async () => {
    const routeWithInitialScene = {
      params: {
        storyId: 1,
        initialSceneId: 3,
      },
    };

    const { getByText } = render(
      <NavigationContainer>
        <ImageGenerationScreen
          route={routeWithInitialScene}
          navigation={mockNavigation}
        />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Scene 3 of 4')).toBeTruthy();
      expect(getByText('End of the story')).toBeTruthy();
    });
  });

  it('updates scene text when navigating timeline', async () => {
    const { getByText, queryByText } = render(
      <NavigationContainer>
        <ImageGenerationScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Beginning of the story')).toBeTruthy();
    });

    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    await waitFor(() => {
      expect(queryByText('Beginning of the story')).toBeNull();
      expect(getByText('Middle of the story')).toBeTruthy();
    });
  });

  it('displays correct chapter name for each scene', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ImageGenerationScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Chapter 1: The Beginning')).toBeTruthy();
    });

    // Navigate to scene 3 which is in Chapter 2
    const nextButton = getByText('Next');
    fireEvent.press(nextButton);
    fireEvent.press(nextButton);

    await waitFor(() => {
      expect(getByText('Chapter 2: The End')).toBeTruthy();
    });
  });
});

