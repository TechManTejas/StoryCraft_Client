import { api } from '../index';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('Image Generation API', () => {
  const mockToken = 'test-token';
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue(mockToken);
    mockedAxios.create.mockReturnValue(mockAxiosInstance);
  });

  describe('getStoryTimeline', () => {
    it('successfully fetches story timeline', async () => {
      const mockTimeline = [
        {
          scene_id: 1,
          text: 'Scene 1',
          chapter_name: 'Chapter 1',
          character_name: 'Character A',
        },
        {
          scene_id: 2,
          text: 'Scene 2',
          chapter_name: 'Chapter 1',
          character_name: 'Character A',
        },
      ];

      mockAxiosInstance.get.mockResolvedValue({
        data: mockTimeline,
      });

      const result = await api.getStoryTimeline(1);

      expect(result.isSuccess).toBe(true);
      expect(result.timeline).toEqual(mockTimeline);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/stories/1/timeline/',
        {
          headers: { Authorization: `Token ${mockToken}` },
        }
      );
    });

    it('handles error when fetching timeline fails', async () => {
      const errorMessage = 'Failed to fetch timeline';
      mockAxiosInstance.get.mockRejectedValue({
        response: {
          data: { message: errorMessage },
        },
      });

      const result = await api.getStoryTimeline(1);

      expect(result.isSuccess).toBe(false);
      expect(result.message).toBe(errorMessage);
    });

    it('handles error without response data', async () => {
      mockAxiosInstance.get.mockRejectedValue({
        message: 'Network error',
      });

      const result = await api.getStoryTimeline(1);

      expect(result.isSuccess).toBe(false);
      expect(result.message).toBe('Network error');
    });
  });

  describe('generateImage', () => {
    it('successfully generates an image', async () => {
      const mockResponse = {
        image_url: 'https://example.com/image.jpg',
        id: 123,
      };

      mockAxiosInstance.post.mockResolvedValue({
        data: mockResponse,
      });

      const context = {
        scene_text: 'A beautiful landscape',
        chapter_name: 'Chapter 1',
        character_name: 'Hero',
      };

      const result = await api.generateImage(1, 2, context);

      expect(result.isSuccess).toBe(true);
      expect(result.imageUrl).toBe(mockResponse.image_url);
      expect(result.imageId).toBe(mockResponse.id);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/images/generate/',
        {
          story_id: 1,
          scene_id: 2,
          context,
        },
        {
          headers: { Authorization: `Token ${mockToken}` },
        }
      );
    });

    it('handles error when image generation fails', async () => {
      const errorMessage = 'Failed to generate image';
      mockAxiosInstance.post.mockRejectedValue({
        response: {
          data: { message: errorMessage },
        },
      });

      const result = await api.generateImage(1, 2, {});

      expect(result.isSuccess).toBe(false);
      expect(result.message).toBe(errorMessage);
    });

    it('handles error without response data', async () => {
      mockAxiosInstance.post.mockRejectedValue({
        message: 'Network error',
      });

      const result = await api.generateImage(1, 2, {});

      expect(result.isSuccess).toBe(false);
      expect(result.message).toBe('Network error');
    });
  });

  describe('getStoryImages', () => {
    it('successfully fetches story images', async () => {
      const mockImages = [
        {
          id: 1,
          scene_id: 1,
          image_url: 'https://example.com/image1.jpg',
        },
        {
          id: 2,
          scene_id: 2,
          image_url: 'https://example.com/image2.jpg',
        },
      ];

      mockAxiosInstance.get.mockResolvedValue({
        data: mockImages,
      });

      const result = await api.getStoryImages(1);

      expect(result.isSuccess).toBe(true);
      expect(result.images).toEqual(mockImages);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/images/',
        {
          params: { story_id: 1 },
          headers: { Authorization: `Token ${mockToken}` },
        }
      );
    });

    it('handles error when fetching images fails', async () => {
      const errorMessage = 'Failed to fetch images';
      mockAxiosInstance.get.mockRejectedValue({
        response: {
          data: { message: errorMessage },
        },
      });

      const result = await api.getStoryImages(1);

      expect(result.isSuccess).toBe(false);
      expect(result.message).toBe(errorMessage);
    });

    it('handles empty images array', async () => {
      mockAxiosInstance.get.mockResolvedValue({
        data: [],
      });

      const result = await api.getStoryImages(1);

      expect(result.isSuccess).toBe(true);
      expect(result.images).toEqual([]);
    });
  });

  describe('API Integration', () => {
    it('generates image and then fetches all images', async () => {
      const mockTimeline = [
        {
          scene_id: 1,
          text: 'Scene 1',
          chapter_name: 'Chapter 1',
          character_name: 'Character A',
        },
      ];

      const mockGeneratedImage = {
        image_url: 'https://example.com/generated.jpg',
        id: 123,
      };

      const mockAllImages = [
        {
          id: 123,
          scene_id: 1,
          image_url: 'https://example.com/generated.jpg',
        },
      ];

      // Mock timeline fetch
      mockAxiosInstance.get
        .mockResolvedValueOnce({
          data: mockTimeline,
        })
        .mockResolvedValueOnce({
          data: [],
        })
        .mockResolvedValueOnce({
          data: mockAllImages,
        });

      // Mock image generation
      mockAxiosInstance.post.mockResolvedValue({
        data: mockGeneratedImage,
      });

      // Fetch timeline
      const timelineResult = await api.getStoryTimeline(1);
      expect(timelineResult.isSuccess).toBe(true);

      // Generate image
      const generateResult = await api.generateImage(1, 1, {
        scene_text: 'Scene 1',
      });
      expect(generateResult.isSuccess).toBe(true);

      // Fetch all images
      const imagesResult = await api.getStoryImages(1);
      expect(imagesResult.isSuccess).toBe(true);
      expect(imagesResult.images).toHaveLength(1);
    });
  });
});

