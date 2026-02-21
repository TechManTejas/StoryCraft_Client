import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ProfileScreen from '../ProfileScreen';
import { api } from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock API
jest.mock('../../api', () => ({
  api: {
    getUserStats: jest.fn(),
    getFAQs: jest.fn(),
    submitFeedback: jest.fn(),
    reportBug: jest.fn(),
    contactSupport: jest.fn(),
    deleteAccount: jest.fn(),
  },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
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
  User: () => null,
  BookOpen: () => null,
  LogOut: () => null,
  Trash2: () => null,
  Crown: () => null,
  Bookmark: () => null,
  Heart: () => null,
  Settings: () => null,
  HelpCircle: () => null,
  MessageCircle: () => null,
  FileText: () => null,
  Bug: () => null,
  Mail: () => null,
  Info: () => null,
  Shield: () => null,
  Star: () => null,
  Eye: () => null,
  Video: () => null,
  ChevronRight: () => null,
  X: () => null,
  Send: () => null,
  Sparkles: () => null,
}));

describe('ProfileScreen', () => {
  const mockStats = {
    storiesRead: 15,
    favorites: 8,
    readingTime: 60,
    storiesCreated: 5,
    reelsCreated: 3,
  };

  const mockFAQs = [
    {
      id: 1,
      question: 'How do I create a story?',
      answer: 'Go to the Story tab and select your genre.',
    },
    {
      id: 2,
      question: 'Can I share my stories?',
      answer: 'Yes! You can make your stories public.',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue('testuser');
    api.getUserStats.mockResolvedValue({
      isSuccess: true,
      stats: mockStats,
    });
    api.getFAQs.mockResolvedValue({
      isSuccess: true,
      faqs: mockFAQs,
    });
  });

  it('renders correctly', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('testuser')).toBeTruthy();
    });
  });

  it('displays user stats', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('15')).toBeTruthy(); // Stories Read
      expect(getByText('8')).toBeTruthy(); // Favorites
      expect(getByText('60h')).toBeTruthy(); // Reading Time
      expect(getByText('5')).toBeTruthy(); // Created
    });
  });

  it('displays stat labels', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Stories Read')).toBeTruthy();
      expect(getByText('Favorites')).toBeTruthy();
      expect(getByText('Reading Time')).toBeTruthy();
      expect(getByText('Created')).toBeTruthy();
    });
  });

  it('navigates to SavedLikedScreen when button is pressed', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const button = getByText('Saved & Liked');
      fireEvent.press(button);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('SavedLikedScreen');
    });
  });

  it('navigates to SubscriptionScreen when button is pressed', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const button = getByText('Subscription');
      fireEvent.press(button);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('SubscriptionScreen');
    });
  });

  it('displays library section', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('My Library')).toBeTruthy();
    });
  });

  it('displays support section', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Support & Help')).toBeTruthy();
      expect(getByText('Help Center')).toBeTruthy();
      expect(getByText('FAQ')).toBeTruthy();
      expect(getByText('Contact Support')).toBeTruthy();
      expect(getByText('Send Feedback')).toBeTruthy();
      expect(getByText('Report Bug')).toBeTruthy();
    });
  });

  it('displays settings section', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Settings')).toBeTruthy();
      expect(getByText('Logout')).toBeTruthy();
      expect(getByText('Delete Account')).toBeTruthy();
    });
  });

  it('opens FAQ modal when FAQ is pressed', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const faqButton = getByText('FAQ');
      fireEvent.press(faqButton);
    });

    await waitFor(() => {
      expect(getByText('Frequently Asked Questions')).toBeTruthy();
    });
  });

  it('opens support modal when Contact Support is pressed', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const contactButton = getByText('Contact Support');
      fireEvent.press(contactButton);
    });

    await waitFor(() => {
      expect(getByText('Contact Support')).toBeTruthy();
    });
  });

  it('opens feedback modal when Send Feedback is pressed', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const feedbackButton = getByText('Send Feedback');
      fireEvent.press(feedbackButton);
    });

    await waitFor(() => {
      expect(getByText('Send Feedback')).toBeTruthy();
    });
  });

  it('opens bug report modal when Report Bug is pressed', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const bugButton = getByText('Report Bug');
      fireEvent.press(bugButton);
    });

    await waitFor(() => {
      expect(getByText('Report Bug')).toBeTruthy();
    });
  });

  it('handles logout confirmation', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const logoutButton = getByText('Logout');
      fireEvent.press(logoutButton);
    });

    // Alert should be shown
    expect(require('react-native').Alert.alert).toHaveBeenCalled();
  });

  it('handles delete account confirmation', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const deleteButton = getByText('Delete Account');
      fireEvent.press(deleteButton);
    });

    // Alert should be shown
    expect(require('react-native').Alert.alert).toHaveBeenCalled();
  });

  it('displays loading state initially', () => {
    AsyncStorage.getItem.mockImplementation(() => new Promise(() => {}));

    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    expect(getByText('Loading profile...')).toBeTruthy();
  });

  it('displays user bio', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Passionate writer and developer')).toBeTruthy();
    });
  });
});

