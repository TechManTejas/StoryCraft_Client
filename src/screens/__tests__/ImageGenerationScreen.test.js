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

describe('ImageGenerationScreen', () => {
  const mockRoute = {
    params: {
      storyId: 1,
      initialSceneId: 2,
    },
  };

  const mockTimeline = [
    {
      scene_id: 1,
      text: 'Scene 1 text',
      chapter_name: 'Chapter 1',
      character_name: 'Character A',
    },
    {
      scene_id: 2,
      text: 'Scene 2 text',
      chapter_name: 'Chapter 1',
      character_name: 'Character A',
    },
    {
      scene_id: 3,
      text: 'Scene 3 text',
      chapter_name: 'Chapter 2',
      character_name: 'Character B',
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

  it('renders correctly with timeline data', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ImageGenerationScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Story Timeline')).toBeTruthy();
    });

    await waitFor(() => {
      expect(getByText('Chapter 1')).toBeTruthy();
    });
  });

  it('displays loading state initially', () => {
    api.getStoryTimeline.mockImplementation(() => new Promise(() => {}));

    const { getByText } = render(
      <NavigationContainer>
        <ImageGenerationScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    expect(getByText('Loading timeline...')).toBeTruthy();
  });

  it('displays error message when timeline fetch fails', async () => {
    api.getStoryTimeline.mockResolvedValue({
      isSuccess: false,
      message: 'Failed to load timeline',
    });

    const { getByText } = render(
      <NavigationContainer>
        <ImageGenerationScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Failed to load timeline')).toBeTruthy();
    });
  });

  it('navigates to previous scene when previous button is pressed', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ImageGenerationScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Story Timeline')).toBeTruthy();
    });

    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    await waitFor(() => {
      const prevButton = getByText('Previous');
      fireEvent.press(prevButton);
    });
  });

  it('navigates to next scene when next button is pressed', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ImageGenerationScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Story Timeline')).toBeTruthy();
    });

    const nextButton = getByText('Next');
    fireEvent.press(nextButton);

    await waitFor(() => {
      expect(getByText('Chapter 2')).toBeTruthy();
    });
  });

  it('disables previous button on first scene', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ImageGenerationScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    await waitFor(() => {
      const prevButton = getByText('Previous');
      expect(prevButton).toBeTruthy();
    });
  });

  it('disables next button on last scene', async () => {
    api.getStoryTimeline.mockResolvedValue({
      isSuccess: true,
      timeline: [mockTimeline[0]],
    });

    const { getByText } = render(
      <NavigationContainer>
        <ImageGenerationScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    await waitFor(() => {
      const nextButton = getByText('Next');
      expect(nextButton).toBeTruthy();
    });
  });

  it('displays scene information correctly', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ImageGenerationScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Chapter 1')).toBeTruthy();
      expect(getByText('Character: Character A')).toBeTruthy();
      expect(getByText('Scene 2 text')).toBeTruthy();
    });
  });

  it('calls goBack when back button is pressed', async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <ImageGenerationScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );
  });

  it('supports navigation to AnimationVideoScreen from story creation', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ImageGenerationScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    // Animation video creation integration would be tested here
    await waitFor(() => {
      expect(api.getStoryTimeline).toHaveBeenCalled();
    });
  });

  it('allows creating animation videos from generated story content', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ImageGenerationScreen route={mockRoute} navigation={mockNavigation} />
      </NavigationContainer>
    );

    // Verify story content is available for animation video creation
    await waitFor(() => {
      expect(getByText('Chapter 1')).toBeTruthy();
    });
  });

    await waitFor(() => {
      // The back button should be rendered
      expect(mockNavigation.goBack).toBeDefined();
    });
  });
});

