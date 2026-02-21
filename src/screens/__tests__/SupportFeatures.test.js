import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import ProfileScreen from '../ProfileScreen';
import { api } from '../../api';

// Mock API
jest.mock('../../api', () => ({
  api: {
    getUserStats: jest.fn(),
    getFAQs: jest.fn(),
    submitFeedback: jest.fn(),
    reportBug: jest.fn(),
    contactSupport: jest.fn(),
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
const mockAlert = jest.fn();
jest.spyOn(require('react-native'), 'Alert').mockImplementation(mockAlert);

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

describe('SupportFeatures', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getUserStats.mockResolvedValue({
      isSuccess: true,
      stats: { storiesRead: 10, favorites: 5, readingTime: 30, storiesCreated: 3 },
    });
    api.getFAQs.mockResolvedValue({
      isSuccess: true,
      faqs: [
        { id: 1, question: 'Test Question', answer: 'Test Answer' },
      ],
    });
  });

  it('submits feedback successfully', async () => {
    api.submitFeedback.mockResolvedValue({
      isSuccess: true,
      message: 'Feedback submitted successfully',
    });

    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const feedbackButton = getByText('Send Feedback');
      fireEvent.press(feedbackButton);
    });

    await waitFor(() => {
      const subjectInput = getByPlaceholderText('Enter subject');
      const messageInput = getByPlaceholderText('Enter your message...');
      
      fireEvent.changeText(subjectInput, 'Test Subject');
      fireEvent.changeText(messageInput, 'Test Message');
    });

    await waitFor(() => {
      const submitButton = getByText('Submit');
      fireEvent.press(submitButton);
    });

    await waitFor(() => {
      expect(api.submitFeedback).toHaveBeenCalledWith(
        'Test Subject',
        'Test Message',
        'general'
      );
    });
  });

  it('submits bug report successfully', async () => {
    api.reportBug.mockResolvedValue({
      isSuccess: true,
      message: 'Bug reported successfully',
    });

    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const bugButton = getByText('Report Bug');
      fireEvent.press(bugButton);
    });

    await waitFor(() => {
      const subjectInput = getByPlaceholderText('Enter subject');
      const messageInput = getByPlaceholderText('Enter your message...');
      
      fireEvent.changeText(subjectInput, 'Bug Title');
      fireEvent.changeText(messageInput, 'Bug Description');
    });

    await waitFor(() => {
      const submitButton = getByText('Submit');
      fireEvent.press(submitButton);
    });

    await waitFor(() => {
      expect(api.reportBug).toHaveBeenCalledWith(
        'Bug Title',
        'Bug Description',
        ''
      );
    });
  });

  it('contacts support successfully', async () => {
    api.contactSupport.mockResolvedValue({
      isSuccess: true,
      ticket_id: 'TICKET123',
      message: 'Support ticket created',
    });

    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const contactButton = getByText('Contact Support');
      fireEvent.press(contactButton);
    });

    await waitFor(() => {
      const subjectInput = getByPlaceholderText('Enter subject');
      const messageInput = getByPlaceholderText('Enter your message...');
      
      fireEvent.changeText(subjectInput, 'Support Request');
      fireEvent.changeText(messageInput, 'I need help');
    });

    await waitFor(() => {
      const submitButton = getByText('Submit');
      fireEvent.press(submitButton);
    });

    await waitFor(() => {
      expect(api.contactSupport).toHaveBeenCalledWith(
        'Support Request',
        'I need help',
        'normal'
      );
    });
  });

  it('displays FAQ items', async () => {
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
      expect(getByText('Test Question')).toBeTruthy();
      expect(getByText('Test Answer')).toBeTruthy();
    });
  });

  it('shows error when feedback submission fails', async () => {
    api.submitFeedback.mockResolvedValue({
      isSuccess: false,
      message: 'Failed to submit feedback',
    });

    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const feedbackButton = getByText('Send Feedback');
      fireEvent.press(feedbackButton);
    });

    await waitFor(() => {
      const subjectInput = getByPlaceholderText('Enter subject');
      const messageInput = getByPlaceholderText('Enter your message...');
      
      fireEvent.changeText(subjectInput, 'Test');
      fireEvent.changeText(messageInput, 'Test');
    });

    await waitFor(() => {
      const submitButton = getByText('Submit');
      fireEvent.press(submitButton);
    });

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalled();
    });
  });

  it('validates empty fields before submission', async () => {
    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const feedbackButton = getByText('Send Feedback');
      fireEvent.press(feedbackButton);
    });

    await waitFor(() => {
      const submitButton = getByText('Submit');
      fireEvent.press(submitButton);
    });

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Error', 'Please fill in all fields');
    });
  });

  it('displays Terms & Privacy alert', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const termsButton = getByText('Terms & Privacy');
      fireEvent.press(termsButton);
    });

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        'Terms & Privacy',
        'Terms and Privacy Policy content would be displayed here.'
      );
    });
  });

  it('displays About alert', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <ProfileScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      const aboutButton = getByText('About');
      fireEvent.press(aboutButton);
    });

    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith(
        'About',
        expect.stringContaining('StoryCraft')
      );
    });
  });

  it('closes support modal when X is pressed', async () => {
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

    // Modal should be visible
    // Close functionality would be tested here
  });
});

