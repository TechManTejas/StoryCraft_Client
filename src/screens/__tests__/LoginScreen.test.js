import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../api';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
}));

// Mock API
jest.mock('../../api', () => ({
  api: {
    login: jest.fn(),
  },
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
      error: '#F44336',
    },
    typography: {
      h1: { fontSize: 32, fontWeight: '700' },
      h2: { fontSize: 24, fontWeight: '600' },
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
      lg: 16,
      xl: 20,
      round: 9999,
    },
    shadows: {
      large: {},
      glow: {},
      medium: {},
    },
  },
}));

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  EyeIcon: () => null,
  EyeOffIcon: () => null,
  BookOpen: () => null,
  Sparkles: () => null,
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <LoginScreen navigation={{ navigate: mockNavigate }} />
      </NavigationContainer>
    );

    expect(getByText('StoryCraft')).toBeTruthy();
    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByPlaceholderText('Enter your username')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
  });

  it('displays sample credentials', () => {
    const { getByText } = render(
      <NavigationContainer>
        <LoginScreen navigation={{ navigate: mockNavigate }} />
      </NavigationContainer>
    );

    expect(getByText('Sample Credentials')).toBeTruthy();
    expect(getByText('Username:')).toBeTruthy();
    expect(getByText('arjun')).toBeTruthy();
    expect(getByText('Password:')).toBeTruthy();
  });

  it('allows user to input username and password', () => {
    const { getByPlaceholderText } = render(
      <NavigationContainer>
        <LoginScreen navigation={{ navigate: mockNavigate }} />
      </NavigationContainer>
    );

    const usernameInput = getByPlaceholderText('Enter your username');
    const passwordInput = getByPlaceholderText('Enter your password');

    fireEvent.changeText(usernameInput, 'testuser');
    fireEvent.changeText(passwordInput, 'testpass');

    expect(usernameInput.props.value).toBe('testuser');
    expect(passwordInput.props.value).toBe('testpass');
  });

  it('toggles password visibility', () => {
    const { getByPlaceholderText } = render(
      <NavigationContainer>
        <LoginScreen navigation={{ navigate: mockNavigate }} />
      </NavigationContainer>
    );

    const passwordInput = getByPlaceholderText('Enter your password');
    
    // Initially password should be hidden
    expect(passwordInput.props.type || passwordInput.props.secureTextEntry).toBeTruthy();
  });

  it('navigates to BottomTabNavigator on successful login', async () => {
    api.login.mockResolvedValue({
      isSuccess: true,
      token: 'test-token',
    });

    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <LoginScreen navigation={{ navigate: mockNavigate }} />
      </NavigationContainer>
    );

    const usernameInput = getByPlaceholderText('Enter your username');
    const passwordInput = getByPlaceholderText('Enter your password');
    const loginButton = getByText('Login');

    fireEvent.changeText(usernameInput, 'arjun');
    fireEvent.changeText(passwordInput, 'arjun');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith('arjun', 'arjun');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userToken', 'test-token');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('username', 'arjun');
      expect(mockNavigate).toHaveBeenCalledWith('BottomTabNavigator');
    });
  });

  it('displays error message when user is not found', async () => {
    api.login.mockResolvedValue({
      isSuccess: false,
      userFound: false,
    });

    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <LoginScreen navigation={{ navigate: mockNavigate }} />
      </NavigationContainer>
    );

    const usernameInput = getByPlaceholderText('Enter your username');
    const passwordInput = getByPlaceholderText('Enter your password');
    const loginButton = getByText('Login');

    fireEvent.changeText(usernameInput, 'wronguser');
    fireEvent.changeText(passwordInput, 'wrongpass');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText('No user found. Please sign up.')).toBeTruthy();
    });
  });

  it('displays error message when password is incorrect', async () => {
    api.login.mockResolvedValue({
      isSuccess: false,
      userFound: true,
    });

    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <LoginScreen navigation={{ navigate: mockNavigate }} />
      </NavigationContainer>
    );

    const usernameInput = getByPlaceholderText('Enter your username');
    const passwordInput = getByPlaceholderText('Enter your password');
    const loginButton = getByText('Login');

    fireEvent.changeText(usernameInput, 'arjun');
    fireEvent.changeText(passwordInput, 'wrongpass');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText('Incorrect password. Please try again.')).toBeTruthy();
    });
  });

  it('navigates to SignupScreen when signup link is pressed', () => {
    const { getByText } = render(
      <NavigationContainer>
        <LoginScreen navigation={{ navigate: mockNavigate }} />
      </NavigationContainer>
    );

    const signupLink = getByText('Sign up');
    fireEvent.press(signupLink);

    expect(mockNavigate).toHaveBeenCalledWith('SignupScreen');
  });
});

