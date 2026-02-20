import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../HomeScreen';

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
      background: '#0A0E27',
      gradientBackground: ['#0A0E27', '#1A1F3A'],
      gradientPrimary: ['#FF6B6B', '#FF8787'],
    },
    typography: {
      h1: { fontSize: 32, fontWeight: '700' },
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
      xl: 20,
      round: 9999,
    },
    shadows: {
      glow: {},
    },
  },
}));

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  BookOpen: () => null,
  Sparkles: () => null,
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
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
});

