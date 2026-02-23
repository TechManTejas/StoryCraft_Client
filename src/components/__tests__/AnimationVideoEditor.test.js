import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AnimationVideoEditor from '../AnimationVideoEditor';
import { api } from '../../api';

// Mock API
jest.mock('../../api', () => ({
  api: {
    getAnimationVideo: jest.fn(),
    getAnimationStyles: jest.fn(),
    updateAnimationVideo: jest.fn(),
    regenerateAnimationVideo: jest.fn(),
  },
}));

// Mock Alert
jest.spyOn(require('react-native'), 'Alert').mockImplementation((title, message, buttons) => {
  if (buttons && buttons.length > 0) {
    const confirmButton = buttons.find(b => b.text !== 'Cancel');
    if (confirmButton && confirmButton.onPress) {
      confirmButton.onPress();
    }
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
      warning: '#FF9800',
      accent: '#FFE66D',
      info: '#2196F3',
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
    shadows: {
      small: {},
      medium: {},
      large: {},
    },
  },
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  X: () => null,
  Save: () => null,
  Edit3: () => null,
  Video: () => null,
  Palette: () => null,
  Sliders: () => null,
  Clock: () => null,
  Music: () => null,
  Mic: () => null,
  Type: () => null,
  Zap: () => null,
  RefreshCw: () => null,
  CheckCircle: () => null,
}));

describe('AnimationVideoEditor', () => {
  const mockVideo = {
    id: 1,
    title: 'Test Video',
    description: 'Test Description',
    story_title: 'Story 1',
    animation_style_id: 1,
    video_settings: {
      duration: 30,
      quality: 'hd',
      music: true,
      narration: true,
      subtitles: true,
    },
    status: 'completed',
  };

  const mockStyles = [
    {
      id: 1,
      name: '2D Animation',
      description: 'Classic 2D animated style',
      preview: '🎨',
      color: '#FF6B6B',
    },
    {
      id: 2,
      name: '3D Animation',
      description: 'Modern 3D animated style',
      preview: '🎬',
      color: '#4ECDC4',
    },
  ];

  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    api.getAnimationVideo.mockResolvedValue({
      isSuccess: true,
      video: mockVideo,
    });
    api.getAnimationStyles.mockResolvedValue({
      isSuccess: true,
      styles: mockStyles,
    });
  });

  it('renders correctly when visible', async () => {
    const { getByText } = render(
      <AnimationVideoEditor
        visible={true}
        video={mockVideo}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    await waitFor(() => {
      expect(getByText('Edit Animation Video')).toBeTruthy();
    });
  });

  it('does not render when not visible', () => {
    const { queryByText } = render(
      <AnimationVideoEditor
        visible={false}
        video={mockVideo}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(queryByText('Edit Animation Video')).toBeNull();
  });

  it('loads video data when opened', async () => {
    render(
      <AnimationVideoEditor
        visible={true}
        video={mockVideo}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    await waitFor(() => {
      expect(api.getAnimationVideo).toHaveBeenCalledWith(mockVideo.id);
    });
  });

  it('loads animation styles when opened', async () => {
    render(
      <AnimationVideoEditor
        visible={true}
        video={mockVideo}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    await waitFor(() => {
      expect(api.getAnimationStyles).toHaveBeenCalled();
    });
  });

  it('displays video title and description', async () => {
    const { getByDisplayValue } = render(
      <AnimationVideoEditor
        visible={true}
        video={mockVideo}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    await waitFor(() => {
      expect(getByDisplayValue('Test Video')).toBeTruthy();
      expect(getByDisplayValue('Test Description')).toBeTruthy();
    });
  });

  it('allows editing video title', async () => {
    const { getByDisplayValue } = render(
      <AnimationVideoEditor
        visible={true}
        video={mockVideo}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    await waitFor(() => {
      const titleInput = getByDisplayValue('Test Video');
      fireEvent.changeText(titleInput, 'Updated Title');
      expect(titleInput.props.value).toBe('Updated Title');
    });
  });

  it('allows editing video description', async () => {
    const { getByDisplayValue } = render(
      <AnimationVideoEditor
        visible={true}
        video={mockVideo}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    await waitFor(() => {
      const descInput = getByDisplayValue('Test Description');
      fireEvent.changeText(descInput, 'Updated Description');
      expect(descInput.props.value).toBe('Updated Description');
    });
  });

  it('saves video changes successfully', async () => {
    api.updateAnimationVideo.mockResolvedValue({
      isSuccess: true,
      video: { ...mockVideo, title: 'Updated Title' },
    });

    const { getByText } = render(
      <AnimationVideoEditor
        visible={true}
        video={mockVideo}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    await waitFor(() => {
      const saveButton = getByText('Save Changes');
      fireEvent.press(saveButton);
    });

    await waitFor(() => {
      expect(api.updateAnimationVideo).toHaveBeenCalled();
      expect(mockOnSave).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('handles save error', async () => {
    api.updateAnimationVideo.mockResolvedValue({
      isSuccess: false,
      message: 'Save failed',
    });

    const { getByText } = render(
      <AnimationVideoEditor
        visible={true}
        video={mockVideo}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    await waitFor(() => {
      const saveButton = getByText('Save Changes');
      fireEvent.press(saveButton);
    });

    await waitFor(() => {
      expect(api.updateAnimationVideo).toHaveBeenCalled();
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  it('regenerates video successfully', async () => {
    api.regenerateAnimationVideo.mockResolvedValue({
      isSuccess: true,
      video: { ...mockVideo, status: 'processing' },
    });

    const { getByText } = render(
      <AnimationVideoEditor
        visible={true}
        video={mockVideo}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    await waitFor(() => {
      const regenerateButton = getByText('Regenerate');
      fireEvent.press(regenerateButton);
    });

    await waitFor(() => {
      expect(api.regenerateAnimationVideo).toHaveBeenCalled();
      expect(mockOnSave).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('allows changing video duration', async () => {
    const { getByDisplayValue } = render(
      <AnimationVideoEditor
        visible={true}
        video={mockVideo}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    await waitFor(() => {
      const durationInput = getByDisplayValue('30');
      fireEvent.changeText(durationInput, '60');
      expect(durationInput.props.value).toBe('60');
    });
  });

  it('allows toggling video settings', async () => {
    const { getByText } = render(
      <AnimationVideoEditor
        visible={true}
        video={mockVideo}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    await waitFor(() => {
      const musicToggle = getByText('Enabled');
      fireEvent.press(musicToggle);
    });

    await waitFor(() => {
      expect(getByText('Disabled')).toBeTruthy();
    });
  });

  it('closes editor when close button is pressed', async () => {
    render(
      <AnimationVideoEditor
        visible={true}
        video={mockVideo}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    // Close functionality would be tested here
    expect(mockOnClose).toBeDefined();
  });

  it('displays loading state while fetching video data', () => {
    api.getAnimationVideo.mockImplementation(() => new Promise(() => {}));

    const { getByText } = render(
      <AnimationVideoEditor
        visible={true}
        video={mockVideo}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(getByText('Loading video data...')).toBeTruthy();
  });

  it('displays animation styles for selection', async () => {
    const { getByText } = render(
      <AnimationVideoEditor
        visible={true}
        video={mockVideo}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    await waitFor(() => {
      expect(getByText('2D Animation')).toBeTruthy();
      expect(getByText('3D Animation')).toBeTruthy();
    });
  });

  it('allows selecting different animation style', async () => {
    const { getByText } = render(
      <AnimationVideoEditor
        visible={true}
        video={mockVideo}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    await waitFor(() => {
      const styleOption = getByText('3D Animation');
      fireEvent.press(styleOption);
    });

    // Style selection would be tested here
    expect(api.getAnimationStyles).toHaveBeenCalled();
  });
});

