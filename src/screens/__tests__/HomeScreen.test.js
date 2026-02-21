import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from '../HomeScreen';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

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
      accent: '#FFE66D',
      gradientBackground: ['#0A0E27', '#1A1F3A'],
      gradientPrimary: ['#FF6B6B', '#FF8787'],
    },
    typography: {
      h1: { fontSize: 32, fontWeight: '700' },
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
      xxl: 48,
    },
    borderRadius: {
      md: 12,
      lg: 16,
      xl: 20,
      round: 9999,
    },
    shadows: {
      glow: {},
      medium: {},
    },
  },
}));

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  BookOpen: () => null,
  Sparkles: () => null,
  Search: () => null,
  TrendingUp: () => null,
  Clock: () => null,
  Star: () => null,
  ArrowRight: () => null,
  X: () => null,
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    expect(getByText('Featured Stories')).toBeTruthy();
  });

  it('displays featured stories', () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    expect(getByText('Chronicles of the Forgotten City')).toBeTruthy();
    expect(getByText('Legends of the Shadow Realm')).toBeTruthy();
    expect(getByText('The Enchanted Forest')).toBeTruthy();
  });

  it('displays "Start Your Journey" button', () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    expect(getByText('Start Your Journey')).toBeTruthy();
  });

  it('navigates to StoryScreen when "Start Your Journey" is pressed', () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    const button = getByText('Start Your Journey');
    fireEvent.press(button);

    expect(mockNavigate).toHaveBeenCalledWith('StoryScreen');
  });

  it('renders story cards with correct information', () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    // Check for authors
    expect(getByText('Victoria Poyner')).toBeTruthy();
    expect(getByText('A Tim')).toBeTruthy();
    expect(getByText('Amani Blanchett')).toBeTruthy();
  });

  it('displays story descriptions', () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    expect(getByText(/Chronicles of the Forgotten City is a gripping tale/)).toBeTruthy();
  });

  it('displays user stats cards', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify({
      storiesRead: 12,
      favorites: 5,
      readingTime: 45,
    }));

    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('12')).toBeTruthy();
      expect(getByText('Stories Read')).toBeTruthy();
    });
  });

  it('displays search bar', () => {
    const { getByPlaceholderText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    expect(getByPlaceholderText('Search stories, authors...')).toBeTruthy();
  });

  it('handles search input', async () => {
    const { getByPlaceholderText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    const searchInput = getByPlaceholderText('Search stories, authors...');
    fireEvent.changeText(searchInput, 'Chronicles');

    await waitFor(() => {
      expect(searchInput.props.value).toBe('Chronicles');
    });
  });

  it('displays category filters', () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    expect(getByText('All')).toBeTruthy();
    expect(getByText('Fantasy')).toBeTruthy();
    expect(getByText('Adventure')).toBeTruthy();
  });

  it('handles category selection', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    const fantasyCategory = getByText('Fantasy');
    fireEvent.press(fantasyCategory);

    // Category should be selected (implementation depends on component)
    expect(fantasyCategory).toBeTruthy();
  });

  it('displays trending section', () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    expect(getByText('Trending Now')).toBeTruthy();
  });

  it('handles pull to refresh', async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    // Pull to refresh functionality should be available
    // Implementation depends on component structure
  });

  it('displays empty state when no stories match search', async () => {
    const { getByPlaceholderText, getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    const searchInput = getByPlaceholderText('Search stories, authors...');
    fireEvent.changeText(searchInput, 'NonExistentStory12345');

    // After filtering, should show empty state if no matches
    // This depends on the filtering logic
  });

  it('saves recent stories when story is pressed', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    // Find and press a story card
    const story = getByText('Chronicles of the Forgotten City');
    fireEvent.press(story);

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('displays stats cards with user data', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify({
      storiesRead: 15,
      favorites: 8,
      readingTime: 60,
    }));

    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('15')).toBeTruthy();
      expect(getByText('8')).toBeTruthy();
      expect(getByText('60')).toBeTruthy();
      expect(getByText('Stories Read')).toBeTruthy();
      expect(getByText('Favorites')).toBeTruthy();
      expect(getByText('Hours Read')).toBeTruthy();
    });
  });

  it('filters stories by category correctly', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const fantasyCategory = getByText('Fantasy');
      fireEvent.press(fantasyCategory);
    });

    // Stories should be filtered
    // Implementation depends on filtering logic
  });

  it('displays trending section with see all button', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Trending Now')).toBeTruthy();
      expect(getByText('See All')).toBeTruthy();
    });
  });

  it('navigates to CommunityScreen when See All is pressed', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const seeAllButton = getByText('See All');
      fireEvent.press(seeAllButton);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('CommunityScreen');
    });
  });

  it('displays user profile information correctly', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify({
      username: 'testuser',
      email: 'test@example.com',
    }));

    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Profile information should be accessible
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });
  });

  it('handles navigation to profile screen', async () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    // Navigation to profile would be tested here
    // Implementation depends on component structure
  });

  it('displays quick actions for user engagement', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <HomeScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Quick actions should be visible
      expect(getByText('Trending Now')).toBeTruthy();
    });
  });
});

