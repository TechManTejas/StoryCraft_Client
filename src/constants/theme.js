// Premium Theme Configuration for StoryCraft
export const theme = {
  colors: {
    // Primary Colors
    primary: '#FF6B6B',
    primaryDark: '#EE5A5A',
    primaryLight: '#FF8787',
    
    // Secondary Colors
    secondary: '#4ECDC4',
    secondaryDark: '#3DB8B0',
    secondaryLight: '#6EDDD6',
    
    // Accent Colors
    accent: '#FFE66D',
    accentDark: '#FFD93D',
    
    // Background Colors
    background: '#0A0E27',
    backgroundSecondary: '#1A1F3A',
    backgroundTertiary: '#252B4A',
    backgroundCard: 'rgba(26, 31, 58, 0.8)',
    backgroundGlass: 'rgba(26, 31, 58, 0.6)',
    
    // Text Colors
    textPrimary: '#FFFFFF',
    textSecondary: '#E0E0E0',
    textTertiary: '#B0B0B0',
    textMuted: '#808080',
    
    // Status Colors
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
    
    // Border Colors
    border: 'rgba(255, 255, 255, 0.1)',
    borderLight: 'rgba(255, 255, 255, 0.2)',
    borderDark: 'rgba(255, 255, 255, 0.05)',
    
    // Gradient Colors
    gradientPrimary: ['#FF6B6B', '#FF8787', '#FFA8A8'],
    gradientSecondary: ['#4ECDC4', '#6EDDD6', '#8EEEE6'],
    gradientBackground: ['#0A0E27', '#1A1F3A', '#252B4A'],
    gradientCard: ['rgba(26, 31, 58, 0.9)', 'rgba(37, 43, 74, 0.7)'],
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
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    round: 9999,
  },
  
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
      letterSpacing: -0.2,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.5,
    },
  },
  
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    glow: {
      shadowColor: '#FF6B6B',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 8,
    },
  },
  
  animation: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
};

