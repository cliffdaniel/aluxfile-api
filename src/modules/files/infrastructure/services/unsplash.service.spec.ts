import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

import { UnsplashService } from './unsplash.service';

jest.mock('axios');

describe('UnsplashService', () => {
    let unsplashService: UnsplashService;

    beforeEach(async () => {
        process.env.UNSPLASH_ACCESS_KEY = 'test-access-key';

        const module: TestingModule = await Test.createTestingModule({
            providers: [UnsplashService],
        }).compile();

        unsplashService = module.get<UnsplashService>(UnsplashService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch images from Unsplash successfully', async () => {
        const mockImages = [
            { id: '1', urls: { regular: 'https://unsplash.com/photo1' } },
            { id: '2', urls: { regular: 'https://unsplash.com/photo2' } },
        ];

        (axios.get as jest.Mock).mockResolvedValue({
            data: { results: mockImages },
        });

        const result = await unsplashService.searchImages('nature');

        expect(result).toEqual([
            'https://unsplash.com/photo1',
            'https://unsplash.com/photo2',
        ]);

        expect(axios.get).toHaveBeenCalledWith(
            'https://api.unsplash.com/search/photos',
            {
                params: { query: 'nature', per_page: 10 },
                headers: { Authorization: 'Client-ID test-access-key' },
            },
        );
    });

    it('should throw BadRequestException if API key is missing', async () => {
        delete process.env.UNSPLASH_ACCESS_KEY;

        const module: TestingModule = await Test.createTestingModule({
            providers: [UnsplashService],
        }).compile();

        unsplashService = module.get<UnsplashService>(UnsplashService);

        await expect(unsplashService.searchImages('nature')).rejects.toThrow(
            BadRequestException,
        );
    });

    it('should throw BadRequestException if fetching images fails', async () => {
        (axios.get as jest.Mock).mockRejectedValue(new Error('Unsplash error'));

        await expect(unsplashService.searchImages('nature')).rejects.toThrow(
            BadRequestException,
        );
    });
});
