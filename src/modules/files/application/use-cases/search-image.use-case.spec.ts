import { Test, TestingModule } from '@nestjs/testing';

import { SearchImageUseCase } from './search-image.use-case';
import { UnsplashService } from '../../infrastructure/services/unsplash.service';

const mockUnsplashService = {
    searchImages: jest
        .fn()
        .mockResolvedValue([
            'https://images.unsplash.com/photo-1',
            'https://images.unsplash.com/photo-2',
        ]),
};

describe('SearchImageUseCase', () => {
    let searchImageUseCase: SearchImageUseCase;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SearchImageUseCase,
                { provide: UnsplashService, useValue: mockUnsplashService },
            ],
        }).compile();

        searchImageUseCase = module.get<SearchImageUseCase>(SearchImageUseCase);
    });

    it('should return image URLs from Unsplash', async () => {
        const query = 'nature';

        const result = await searchImageUseCase.execute(query);

        expect(result).toEqual([
            'https://images.unsplash.com/photo-1',
            'https://images.unsplash.com/photo-2',
        ]);

        expect(mockUnsplashService.searchImages).toHaveBeenCalledWith(query);
    });

    it('should return an empty array if no images are found', async () => {
        mockUnsplashService.searchImages.mockResolvedValueOnce([]);

        const query = 'random-nonexistent-image';

        const result = await searchImageUseCase.execute(query);

        expect(result).toEqual([]);

        expect(mockUnsplashService.searchImages).toHaveBeenCalledWith(query);
    });
});
