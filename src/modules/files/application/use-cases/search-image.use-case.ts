import { Injectable } from '@nestjs/common';

import { UnsplashService } from '../../infrastructure/services/unsplash.service';

@Injectable()
export class SearchImageUseCase {
    constructor(private readonly unsplashService: UnsplashService) {}

    /**
     * Searches for images using the Unsplash API.
     *
     * - Fetches a list of image URLs based on the provided query.
     * - Uses the `UnsplashService` to perform the API request.
     *
     * @param {string} query - The search term for finding images.
     * @returns {Promise<string[]>} A list of image URLs.
     * @throws {BadRequestException} If there is an error fetching images.
     */
    async execute(query: string): Promise<string[]> {
        return this.unsplashService.searchImages(query);
    }
}
