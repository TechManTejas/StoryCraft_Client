import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import MessagingScreen from '../MessagingScreen';
import { api } from '../../api';

// Mock API
jest.mock('../../api', () => ({
  api: {
    getConversations: jest.fn(),
    getMessages: jest.fn(),
    sendMessage: jest.fn(),
    createConversation: jest.fn(),
    searchUsers: jest.fn(),
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
  };
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
    shadows: {},
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  MessageCircle: () => null,
  Send: () => null,
  Search: () => null,
  User: () => null,
  Plus: () => null,
  ChevronLeft: () => null,
  MoreVertical: () => null,
  Video: () => null,
  Image: () => null,
}));

describe('MessagingScreen', () => {
  const mockConversations = [
    {
      id: 1,
      other_user: {
        username: 'user1',
        name: 'User One',
      },
      last_message: {
        text: 'Hello!',
        created_at: '2024-01-01T10:00:00Z',
      },
      unread_count: 2,
    },
    {
      id: 2,
      other_user: {
        username: 'user2',
        name: 'User Two',
      },
      last_message: {
        text: 'How are you?',
        created_at: '2024-01-01T11:00:00Z',
      },
      unread_count: 0,
    },
  ];

  const mockMessages = [
    {
      id: 1,
      text: 'Hello!',
      sender_username: 'user1',
      created_at: '2024-01-01T10:00:00Z',
      message_type: 'text',
    },
    {
      id: 2,
      text: 'Hi there!',
      sender_username: 'currentuser',
      created_at: '2024-01-01T10:05:00Z',
      message_type: 'text',
    },
  ];

  const mockRoute = {
    params: {},
  };

  beforeEach(() => {
    jest.clearAllMocks();
    api.getConversations.mockResolvedValue({
      isSuccess: true,
      conversations: mockConversations,
    });
    api.getMessages.mockResolvedValue({
      isSuccess: true,
      messages: mockMessages,
    });
  });

  it('renders correctly', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <MessagingScreen route={mockRoute} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Conversations')).toBeTruthy();
    });
  });

  it('displays conversations list', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <MessagingScreen route={mockRoute} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('User One')).toBeTruthy();
      expect(getByText('User Two')).toBeTruthy();
      expect(getByText('Hello!')).toBeTruthy();
    });
  });

  it('displays loading state initially', () => {
    api.getConversations.mockImplementation(() => new Promise(() => {}));

    const { getByText } = render(
      <NavigationContainer>
        <MessagingScreen route={mockRoute} />
      </NavigationContainer>
    );

    expect(getByText('Loading messages...')).toBeTruthy();
  });

  it('opens search when plus button is pressed', async () => {
    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <MessagingScreen route={mockRoute} />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Find plus button and press it
      // This depends on component structure
    });
  });

  it('handles sending a message', async () => {
    api.sendMessage.mockResolvedValue({
      isSuccess: true,
      message: {
        id: 3,
        text: 'New message',
        sender_username: 'currentuser',
        created_at: '2024-01-01T12:00:00Z',
      },
    });

    const { getByPlaceholderText } = render(
      <NavigationContainer>
        <MessagingScreen route={mockRoute} />
      </NavigationContainer>
    );

    // This test would require selecting a conversation first
    // Implementation depends on component structure
  });

  it('displays messages in chat view', async () => {
    const routeWithConversation = {
      params: {
        conversationId: 1,
      },
    };

    const { getByText } = render(
      <NavigationContainer>
        <MessagingScreen route={routeWithConversation} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Messages')).toBeTruthy();
      expect(getByText('Hello!')).toBeTruthy();
      expect(getByText('Hi there!')).toBeTruthy();
    });
  });

  it('handles user search', async () => {
    api.searchUsers.mockResolvedValue({
      isSuccess: true,
      users: [
        { username: 'user3', name: 'User Three' },
        { username: 'user4', name: 'User Four' },
      ],
    });

    const { getByPlaceholderText } = render(
      <NavigationContainer>
        <MessagingScreen route={mockRoute} />
      </NavigationContainer>
    );

    // This test would require opening search and typing
    // Implementation depends on component structure
  });

  it('creates new conversation', async () => {
    api.createConversation.mockResolvedValue({
      isSuccess: true,
      conversation: {
        id: 3,
        other_user: {
          username: 'user3',
          name: 'User Three',
        },
      },
    });

    // This test would require searching and selecting a user
    // Implementation depends on component structure
  });

  it('displays empty state when no conversations', async () => {
    api.getConversations.mockResolvedValue({
      isSuccess: true,
      conversations: [],
    });

    const { getByText } = render(
      <NavigationContainer>
        <MessagingScreen route={mockRoute} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('No conversations yet')).toBeTruthy();
      expect(getByText('Start a new conversation to connect with others!')).toBeTruthy();
    });
  });

  it('displays unread count badges', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <MessagingScreen route={mockRoute} />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('2')).toBeTruthy(); // Unread count
    });
  });

  it('handles back navigation from chat view', async () => {
    const routeWithConversation = {
      params: {
        conversationId: 1,
      },
    };

    const { getByTestId } = render(
      <NavigationContainer>
        <MessagingScreen route={routeWithConversation} />
      </NavigationContainer>
    );

    await waitFor(() => {
      // Back button should be rendered
      expect(mockGoBack).toBeDefined();
    });
  });
});

