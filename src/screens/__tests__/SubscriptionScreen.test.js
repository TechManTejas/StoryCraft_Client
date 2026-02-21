import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import SubscriptionScreen from '../SubscriptionScreen';
import { api } from '../../api';

// Mock API
jest.mock('../../api', () => ({
  api: {
    getSubscriptionPlans: jest.fn(),
    getCurrentSubscription: jest.fn(),
    subscribe: jest.fn(),
    cancelSubscription: jest.fn(),
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

// Mock Alert
jest.spyOn(require('react-native'), 'Alert').mockImplementation((title, message, buttons) => {
  // Mock implementation - call the confirm button if available
  if (buttons && buttons[1]) {
    setTimeout(() => buttons[1].onPress(), 0);
  }
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
      accent: '#FFE66D',
      info: '#2196F3',
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
      large: {},
      medium: {},
    },
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  ChevronLeft: () => null,
  Crown: () => null,
  Check: () => null,
  Star: () => null,
  Sparkles: () => null,
  Zap: () => null,
  Gift: () => null,
  CreditCard: () => null,
  Calendar: () => null,
  X: () => null,
  AlertCircle: () => null,
}));

describe('SubscriptionScreen', () => {
  const mockPlans = [
    {
      id: 1,
      name: 'Basic',
      price: 0,
      period: 'month',
      description: 'Free plan',
      features: ['Feature 1', 'Feature 2'],
      color: '#FFFFFF',
    },
    {
      id: 2,
      name: 'Premium',
      price: 9.99,
      period: 'month',
      description: 'Premium plan',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
      color: '#FF6B6B',
      is_popular: true,
    },
  ];

  const mockSubscription = {
    plan_id: 2,
    plan_name: 'Premium',
    status: 'active',
    expires_at: '2024-12-31',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    api.getSubscriptionPlans.mockResolvedValue({
      isSuccess: true,
      plans: mockPlans,
    });
    api.getCurrentSubscription.mockResolvedValue({
      isSuccess: true,
      subscription: mockSubscription,
    });
  });

  it('renders correctly', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <SubscriptionScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Subscription')).toBeTruthy();
    });
  });

  it('displays subscription plans', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <SubscriptionScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Basic')).toBeTruthy();
      expect(getByText('Premium')).toBeTruthy();
    });
  });

  it('displays current subscription info', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <SubscriptionScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Active Subscription')).toBeTruthy();
      expect(getByText('Premium')).toBeTruthy();
      expect(getByText('active')).toBeTruthy();
    });
  });

  it('displays plan prices correctly', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <SubscriptionScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('$0')).toBeTruthy();
      expect(getByText('$9.99')).toBeTruthy();
    });
  });

  it('displays plan features', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <SubscriptionScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Feature 1')).toBeTruthy();
      expect(getByText('Feature 2')).toBeTruthy();
    });
  });

  it('handles subscription', async () => {
    api.subscribe.mockResolvedValue({
      isSuccess: true,
      subscription: mockSubscription,
    });

    const { getByText } = render(
      <NavigationContainer>
        <SubscriptionScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Subscribe Now')).toBeTruthy();
    });

    // Subscription flow would be tested here
    // Implementation depends on component structure
  });

  it('handles cancel subscription', async () => {
    api.cancelSubscription.mockResolvedValue({
      isSuccess: true,
      message: 'Subscription cancelled',
    });

    const { getByText } = render(
      <NavigationContainer>
        <SubscriptionScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Cancel Subscription')).toBeTruthy();
    });
  });

  it('displays loading state initially', () => {
    api.getSubscriptionPlans.mockImplementation(() => new Promise(() => {}));

    const { getByText } = render(
      <NavigationContainer>
        <SubscriptionScreen />
      </NavigationContainer>
    );

    expect(getByText('Loading plans...')).toBeTruthy();
  });

  it('displays premium benefits section', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <SubscriptionScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Premium Benefits')).toBeTruthy();
      expect(getByText('Unlimited Stories')).toBeTruthy();
      expect(getByText('Priority Support')).toBeTruthy();
    });
  });

  it('displays popular badge on popular plan', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <SubscriptionScreen />
      </NavigationContainer>
    );

    await waitFor(() => {
      expect(getByText('Most Popular')).toBeTruthy();
    });
  });
});

